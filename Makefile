CROSS_COMPILE ?= aarch64-none-linux-gnu-
CFLAGS += -I script_src/include -g -O0
LIBS := -lti_rpmsg_char -lpthread
SYSROOT ?= /
CFLAGS += --sysroot=$(SYSROOT)

all: scripts/cpuload

scripts/cpuload: script_src/cpuload.c script_src/statcol.c
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

clean:
	rm -rf scripts/cpuload