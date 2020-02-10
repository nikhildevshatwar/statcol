#include "statcol.h"

struct rpmsg_context g_rpmsg_contexts[MAX_RPMSG_CONTEXTS];
struct rpmsg_context *g_ddr_ctx = NULL;
struct rpmsg_context *g_ethfw_ctx = NULL;

struct metric_cpuload g_metric_cpuload[MAX_CPU_CORES];
int running = 1;


int remote_service_run(struct rpmsg_context *ctx, char *service, uint cmd,
			void *prm, uint prm_size, uint flags);


struct metric_cpuload *alloc_metric_cpuload(char *name) {
	struct metric_cpuload *mc;
	int i;

	for (i = 0; i < MAX_CPU_CORES; i++) {

		mc = &g_metric_cpuload[i];
		if (!mc->name) {
			mc->name = name;
			return mc;
		}
	}
	return NULL;
}

void print_cpuload(void) {
	struct metric_cpuload *mc;
	struct rpmsg_context *ctx;
	char buffer[200], *ptr;
	int count, i;

	ptr = &buffer[0];
	for (i = 0, count = 0; i < MAX_CPU_CORES; i++) {

		mc = &g_metric_cpuload[i];
		if (!mc->name)
			continue;
		ptr += sprintf(ptr, " %s %03.2f", mc->name, mc->load);
		count++;
	}
	*ptr = '\0';

	if (count) {
		printf("WS-cpuload: %d%s\n", count, buffer);
	}
};

void print_ddrbw(void) {

	app_perf_stats_ddr_stats_t ddr_stats;

	remote_service_run(g_ddr_ctx, APP_PERF_STATS_SERVICE_NAME,
		APP_PERF_STATS_CMD_GET_DDR_STATS,
		&ddr_stats, sizeof(ddr_stats), 0);

	remote_service_run(g_ddr_ctx, APP_PERF_STATS_SERVICE_NAME,
		APP_PERF_STATS_CMD_RESET_DDR_STATS,
		NULL, 0, 0);

	if (ddr_stats.total_available_bw == 0)
		return;
	printf("WS-ddrbw: 3 Read_avg %06d Write_avg %06d Total_avg %06d\n",
		ddr_stats.read_bw_avg,
		ddr_stats.write_bw_avg,
		ddr_stats.total_available_bw);
};

uint32_t get_bits_per_sec(uint64_t bytes, char **unit) {
	uint64_t bits;

	bits = bytes * 8;
	if (bits < 1000) {
		*unit = "";
		return bits;
	} else if (bits < 1000 * 1000) {
		*unit = "K";
		return bits / 1000;
	} else if (bits < 1000 * 1000 * 1000) {
		*unit = "M";
		return bits / (1000 * 1000);
	} else {
		*unit = "G";
		return bits / (1000 * 1000 * 1000);
	}
}

void print_ethfw_stats(void) {
	app_ethfw_port_bandwidth_t ethfw_stats;
	uint32_t tx_bw, rx_bw;
	char *tx_unit, *rx_unit;
	char buffer[200], *ptr;
	int count, i;

	if (g_ethfw_ctx == NULL) {
		return;
	}

	remote_service_run(g_ethfw_ctx, APP_ETHFW_STATS_SERVICE_NAME,
		APP_ETHFW_STATS_CMD_GET_BANDWIDTH,
		&ethfw_stats, sizeof(ethfw_stats), 0);

	ptr = &buffer[0];
	for (i = 0, count = 0; i < APP_ETHFW_PORT_NUM_MAX; i++) {

		if (ethfw_stats.isportenabled[i] == 0)
			continue;

		tx_bw = get_bits_per_sec(ethfw_stats.tx_bandwidth[i], &tx_unit);
		rx_bw = get_bits_per_sec(ethfw_stats.rx_bandwidth[i], &rx_unit);
		ptr += sprintf(ptr, " port%d_TX %03d%sbps port%d_RX %03d%sbps",
				i, tx_bw, tx_unit,
				i, rx_bw, rx_unit);
		count++;
	}
	*ptr = '\0';

	if (count) {
		printf("WS-ethfw-bw: %d%s\n", count * 2, buffer);
	}
};

void scan_rpmsg_char_nodes(void) {

	struct rpmsg_context *ctx;
	rproc_device_t *rproc_dev;
	rproc_char_device_t *rp_cdev;
	rproc_char_endpt_t *ep;
	char *ep_name;

	char **corenames;
	char *core;
	int i;

	corenames = rproc_get_supported_names();

	for (i = 0; i < MAX_RPMSG_CONTEXTS; i++) {

		core = corenames[i];
		if (core == NULL)
			break;

		debug("rpmsg-char supported in %s\n", core);
		ctx = &g_rpmsg_contexts[i];

		rproc_dev = rproc_device_find_for_name(core);
		if (!rproc_dev)
			continue;
		debug("    rproc_dev exists\n");

		rp_cdev = rproc_device_find_chrdev_by_remote_port(rproc_dev,
				APP_IPC_REMOTE_SERVICE_RPMSG_PORT_ID);
		if (!rp_cdev)
			continue;
		debug("    rproc_char_dev exists\n");

		ep = rproc_char_device_create_endpt(rp_cdev, "rpmsg_chrdev",
				RPMSG_ADDR_ANY);
		if (!ep)
			continue;
		debug("    char_dev endpoint created\n");

		ep_name = rproc_char_endpt_get_dev_name(ep);
		ctx->port = rproc_char_endpt_get_local_port(ep);
		ctx->fd = open(ep_name, O_RDWR);
		if (!ctx->fd)
			continue;

		ctx->m_cpuload = alloc_metric_cpuload(core);
		ctx->name = core;
		debug(">> Created RPMSG endpoint %s for %s (fd = %d, port = %d)\n", ep_name, core, ctx->fd, ctx->port);

		if (strcmp(core, "r5f-main-0-core-0") == 0) {
			g_ethfw_ctx = ctx;
		} else if (strcmp(core, "r5f-main-0-core-1") == 0) {
			g_ddr_ctx = ctx;
		}

		if (ep_name)
			free(ep_name);
		if (ep)
			free(ep);
		if (rp_cdev)
			free(rp_cdev);
		if (rproc_dev)
			free(rproc_dev);
	}
}

int remote_service_run(struct rpmsg_context *ctx, char *service, uint cmd,
			void *prm, uint prm_size, uint flags) {
	app_service_msg_header_t *header;
	uint payload_size;
	int ret;

	if (prm_size > APP_REMOTE_SERVICE_PRM_SIZE_MAX)
		return -EINVAL;

	header = (app_service_msg_header_t *)ctx->rpmsg_tx_msg_buf;
	header->cmd = cmd;
	header->flags = flags;
	header->status = 0;
	header->prm_size = prm_size;
	sprintf(header->service_name, "%s\0", service);
	/* Copy data after header */
	if (prm)
		memcpy((header + 1), prm, prm_size);

	payload_size = sizeof(*header) + prm_size;
	ret = write(ctx->fd, ctx->rpmsg_tx_msg_buf, payload_size);

	if (ret < 0) {
		printf("ERROR: Fail to send rpmsg_char message to %s\n", ctx->name);
		return ret;
	}

	if (flags & APP_REMOTE_SERVICE_FLAG_NO_WAIT_ACK)
		return 0;

	/* Read the data after header and copy back to buffer */
	ret = read(ctx->fd, ctx->rpmsg_tx_msg_buf, payload_size);
	if (ret < 0 || ret < payload_size) {
		printf("ERROR: Fail to send rpmsg_char message to %s\n", ctx->name);
		return ret;
	}
	memcpy(prm, (header + 1), prm_size);
	return header->status;
}

void *stat_collector_task_rpmsg(void *data) {

	app_perf_stats_cpu_load_t cpuload;
	struct metric_cpuload *mc;
	struct rpmsg_context *ctx;
	int i;

	while(running) {

		for (i = 0; i < MAX_RPMSG_CONTEXTS; i++) {

			ctx = &g_rpmsg_contexts[i];
			if (!ctx->name)
				continue;

			remote_service_run(ctx, APP_PERF_STATS_SERVICE_NAME,
				APP_PERF_STATS_CMD_GET_CPU_LOAD,
				&cpuload, sizeof(cpuload), 0);
			ctx->m_cpuload->load = cpuload.cpu_load * 1.0 / 100;
		}

		usleep(400 * 1000);
	}
}

void *stat_collector_task_print(void *data) {
	int i;

	for (i = 0; running; i++) {

		if (i % 4 == 3) {
			print_cpuload();
			if (g_ddr_ctx)
				print_ddrbw();
			if (g_ethfw_ctx)
				print_ethfw_stats();
		}
		usleep(100 * 1000);
	}
}

int parse_args(int argc, char **argv) {

	/* Accept arg to parse config file */
	/* config to select core for requesting DDR bandwidth */
	/* config arg to select frequency of measuring each metric */
	return 0;
}

int main(int argc, char *argv[]) {
	pthread_t remote_service, print;

	parse_args(argc, argv);
	scan_rpmsg_char_nodes();

	pthread_create(&remote_service, NULL, stat_collector_task_rpmsg, NULL);
	pthread_create(&print, NULL, stat_collector_task_print, NULL);

	pthread_join(print, NULL);
	pthread_join(remote_service, NULL);
	return 0;
}
