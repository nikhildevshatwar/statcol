#include "statcol.h"

struct rpmsg_context *g_ethfw_ctx = NULL;

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

void *print_ethfw_stats(void *data) {
    app_ethfw_port_bandwidth_t ethfw_stats = {};
    uint32_t tx_bw, rx_bw;
    char *tx_unit, *rx_unit;
    char buffer[200], *ptr;
    int count, i;

    while (g_ethfw_ctx != NULL) {
        remote_service_run(g_ethfw_ctx, APP_ETHFW_STATS_SERVICE_NAME,
                           APP_ETHFW_STATS_CMD_GET_BANDWIDTH, &ethfw_stats,
                           sizeof(ethfw_stats), 0);

        ptr = &buffer[0];
        for (i = 0, count = 0; i < APP_ETHFW_PORT_NUM_MAX; i++) {
            if (ethfw_stats.isportenabled[i] == 0) continue;

            tx_bw = get_bits_per_sec(ethfw_stats.tx_bandwidth[i], &tx_unit);
            rx_bw = get_bits_per_sec(ethfw_stats.rx_bandwidth[i], &rx_unit);
            ptr += sprintf(ptr, " port%d_TX %03d%sbps port%d_RX %03d%sbps", i,
                           tx_bw, tx_unit, i, rx_bw, rx_unit);
            count++;
        }
        *ptr = '\0';

        if (count) {
            printf("%d%s\n", count * 2, buffer);
        }

        usleep(400 * 1000);
    }
}

int main(int argc, char *argv[]) {
    pthread_t thr_collect, thr_print;

    rpmsg_char_init(NULL);
    if (scan_rpmsg_char_nodes()) {
        /* Create the threads and wait for them */
        pthread_create(&thr_print, NULL, print_ethfw_stats, NULL);
        pthread_join(thr_print, NULL);
    }

    rpmsg_char_exit();

    return 0;
}