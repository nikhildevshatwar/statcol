CROSS_COMPILE ?= aarch64-linux-gnu-
CC := gcc
CFLAGS += -I include -g -O0
LIBS := -lrpmsg_char_helper -lpthread
SYSROOT ?= $(HOME)/targetfs
CFLAGS += --sysroot=$(SYSROOT)

SOURCES := statcol.c

statcol: $(SOURCES)
	$(CROSS_COMPILE)$(CC) $(CFLAGS) $(LIBS) -o $@ $^
