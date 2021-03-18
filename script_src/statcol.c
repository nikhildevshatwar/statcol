#include "statcol.h"

int scan_rpmsg_char_nodes(void) {
    struct rpmsg_context *ctx;
    rpmsg_char_dev_t *dev;
    int i, num_ctx = 0;

    ctx = &g_rpmsg_contexts[num_ctx];
    for (i = 0; i < RPROC_ID_MAX; i++) {
        sprintf(ctx->name, "statcol_rproc%d", i);
        dev = rpmsg_char_open(i, NULL, APP_IPC_REMOTE_SERVICE_RPMSG_PORT_ID,
                              ctx->name, 0);
        if (!dev) continue;

        pthread_mutex_init(&ctx->lock, NULL);
        ctx->dev = dev;
        num_ctx++;

        debug(">> Opened RPMSG char device. Local ep = %d, fd = %d\n",
              dev->endpt, dev->fd);

        if (i == R5F_MAIN0_0) {
            g_ddr_ctx = ctx;
            g_ethfw_ctx = ctx;
        }
    }
    return num_ctx;
}

int remote_service_run(struct rpmsg_context *ctx, char *service, uint cmd,
                       void *prm, uint prm_size, uint flags) {
    app_service_msg_header_t *header;
    uint payload_size;
    int ret;

    if (prm_size > APP_REMOTE_SERVICE_PRM_SIZE_MAX) return -EINVAL;

    pthread_mutex_lock(&ctx->lock);

    header = (app_service_msg_header_t *)ctx->rpmsg_tx_msg_buf;
    header->cmd = cmd;
    header->flags = flags;
    header->status = 0;
    header->prm_size = prm_size;
    sprintf(header->service_name, "%s", service);
    /* Copy data after header */
    if (prm) memcpy((header + 1), prm, prm_size);

    payload_size = sizeof(*header) + prm_size;
    ret = write(ctx->dev->fd, ctx->rpmsg_tx_msg_buf, payload_size);

    if (ret < 0) {
        printf("ERROR: Fail to send rpmsg_char message to %s\n", ctx->name);
        pthread_mutex_unlock(&ctx->lock);
        return ret;
    }

    if (flags & APP_REMOTE_SERVICE_FLAG_NO_WAIT_ACK) {
        pthread_mutex_unlock(&ctx->lock);
        return 0;
    }

    /* Read the data after header and copy back to buffer */
    ret = read(ctx->dev->fd, ctx->rpmsg_tx_msg_buf, payload_size);
    if (ret < 0 || ret < payload_size) {
        printf("ERROR: Fail to send rpmsg_char message to %s\n", ctx->name);
        pthread_mutex_unlock(&ctx->lock);
        return ret;
    }
    memcpy(prm, (header + 1), prm_size);
    pthread_mutex_unlock(&ctx->lock);
    return header->status;
}
