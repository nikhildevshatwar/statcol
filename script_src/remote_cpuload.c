#include "statcol.h"

void *collect_remote_cpu_data(void *data) {
    app_perf_stats_cpu_load_t cpuload;
    struct rpmsg_context *ctx;

    while (true) {
        for (int i = 0; i < MAX_RPMSG_CONTEXTS; i++) {
            ctx = &g_rpmsg_contexts[i];
            if (!ctx->dev) continue;

            remote_service_run(ctx, APP_PERF_STATS_SERVICE_NAME,
                               APP_PERF_STATS_CMD_GET_CPU_LOAD, &cpuload,
                               sizeof(cpuload), 0);
            ctx->load = cpuload.cpu_load * 1.0 / 100;
        }

        usleep(400 * 1000);
    }
}

void *print_remote_cpu_data(void *data) {
    struct rpmsg_context *ctx;
    char buffer[200], *ptr;
    int count, i = 0;

    while (true) {
        if (i % 4 == 0) {
            ptr = &buffer[0];
            count = 0;
            for (int j = 0; j < MAX_RPMSG_CONTEXTS; j++) {
                ctx = &g_rpmsg_contexts[j];

                if (ctx->name[0] == 0) continue;

                ptr += sprintf(ptr, " %s %03.2f", ctx->name, ctx->load);
                count++;
            }
            *ptr = '\0';

            if (count) {
                printf("%d%s\n", count, buffer);
            }
        }

        usleep(100 * 1000);
        i++;
    }
}

// TODO: Add config to select core for requesting DDR bandwidth
// TODO: Add config to select frequncy of measuring each metric

int main(int argc, char *argv[]) {
    pthread_t thr_collect, thr_print;

    rpmsg_char_init(NULL);
    if (scan_rpmsg_char_nodes()) {
        /* Create the threads and wait for them */
        pthread_create(&thr_collect, NULL, collect_remote_cpu_data, NULL);
        pthread_create(&thr_print, NULL, print_remote_cpu_data, NULL);
        pthread_join(thr_print, NULL);
        pthread_join(thr_collect, NULL);
    }

    rpmsg_char_exit();
    return 0;
}
