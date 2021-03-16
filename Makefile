CROSS_COMPILE ?= aarch64-none-linux-gnu-
CFLAGS += -I script_src/include -g -O0
LIBS := -lti_rpmsg_char -lpthread
SYSROOT ?= /
CFLAGS += --sysroot=$(SYSROOT)

all: scripts/remote_cpuload

scripts/remote_cpuload: script_src/remote_cpuload.c script_src/statcol.c
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

clean:
	rm -rf scripts/remote_cpuload