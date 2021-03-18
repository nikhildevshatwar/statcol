CROSS_COMPILE ?= aarch64-none-linux-gnu-
CFLAGS += -Iscript_src/include -g -O0
STATCOL_LIBS:= -lti_rpmsg_char -lpthread
LIBS := $(STATCOL_LIBS) -Lscript_src/ -lstatcol
SYSROOT ?= /
CFLAGS += --sysroot=$(SYSROOT)

all: scripts/remote_cpuload_binary scripts/ddr_binary scripts/ethfw_binary

script_src/statcol.o: script_src/statcol.c
	$(CROSS_COMPILE)gcc $(CFLAGS) $(STATCOL_LIBS) -o $@ -c $^

script_src/libstatcol.a: script_src/statcol.o
	ar rcs $@ $^

scripts/remote_cpuload_binary: script_src/remote_cpuload.c script_src/libstatcol.a
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

scripts/ddr_binary: script_src/ddr.c script_src/libstatcol.a
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

scripts/ethfw_binary: script_src/ethfw.c script_src/libstatcol.a
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

clean:
	rm -rf scripts/remote_cpuload_binary scripts/ddr_binary scripts/ethfw_binary