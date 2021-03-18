#include "statcol.h"

struct rpmsg_context *g_ddr_ctx = NULL;

void *print_ddr_bw(void *data) {
    app_perf_stats_ddr_stats_t ddr_stats;

    struct arg_object *args = (struct arg_object *)(data);

    while (g_ddr_ctx != NULL) {
        remote_service_run(g_ddr_ctx, APP_PERF_STATS_SERVICE_NAME,
                           APP_PERF_STATS_CMD_GET_DDR_STATS, &ddr_stats,
                           sizeof(ddr_stats), 0);

        remote_service_run(g_ddr_ctx, APP_PERF_STATS_SERVICE_NAME,
                           APP_PERF_STATS_CMD_RESET_DDR_STATS, NULL, 0, 0);

        printf("3 Read_avg %06d Write_avg %06d Total_avg %06d\n",
               ddr_stats.read_bw_avg, ddr_stats.write_bw_avg,
               ddr_stats.total_available_bw);

        usleep(args->sampling_interval);
    }
}

int main(int argc, char *argv[]) {
    pthread_t thr_collect, thr_print;
    struct arg_object args = {400 * 1000};

    if (argc > 1) {
        args.sampling_interval = (uint32_t)(strtod(argv[1], NULL) * 1000000);
    }

    rpmsg_char_init(NULL);
    if (scan_rpmsg_char_nodes()) {
        /* Create the threads and wait for them */
        pthread_create(&thr_print, NULL, print_ddr_bw, &args);
        pthread_join(thr_print, NULL);
    }

    rpmsg_char_exit();

    return 0;
}