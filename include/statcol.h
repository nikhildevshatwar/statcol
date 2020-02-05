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
#include <rpmsg_char_helper.h>
#include "app_remote_service_priv.h"
#include "app_perf_stats_priv.h"
#include "app_perf_stats.h"

#define DEBUG
#define MAX_RPMSG_CONTEXTS				20
#define MAX_CPU_CORES					20

#ifdef DEBUG
#define debug printf
#else
#define debug(str, ...)
#endif

struct metric_cpuload {
	char *name;
	float load;
};

struct rpmsg_context {
	uint8_t rpmsg_tx_msg_buf[IPC_RPMESSAGE_MSG_SIZE] __attribute__ ((aligned(1024)));
	char *name;
	int fd;
	int port;
	struct metric_cpuload *m_cpuload;
};
