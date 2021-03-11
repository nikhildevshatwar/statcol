#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <fcntl.h>
#include <argp.h>
#include <pthread.h>
#include <ti_rpmsg_char.h>
#include "app_remote_service_priv.h"
#include "app_perf_stats_priv.h"
#include "app_perf_stats.h"
#include "app_ethfw_stats.h"

#define DEBUG

#define APP_IPC_REMOTE_SERVICE_RPMSG_PORT_ID 21
#define RPMSG_ADDR_ANY 0xffffffff

#define MAX_RPMSG_CONTEXTS 20
#define MAX_CPU_CORES 20

#ifdef DEBUG
#define debug printf
#else
#define debug(str, ...)
#endif

struct rpmsg_context {
	uint8_t rpmsg_tx_msg_buf[IPC_RPMESSAGE_MSG_SIZE] __attribute__((aligned(1024)));
	char name[32];

	rpmsg_char_dev_t *dev;
	float load;
	pthread_mutex_t lock;
};

struct rpmsg_context g_rpmsg_contexts[RPROC_ID_MAX];

int scan_rpmsg_char_nodes(void);

int remote_service_run(struct rpmsg_context *ctx, char *service, uint cmd,
                       void *prm, uint prm_size, uint flags);


