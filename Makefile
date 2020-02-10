CROSS_COMPILE ?= aarch64-linux-gnu-
CC := gcc
CFLAGS += -I include -g -O0
LIBS := -lrpmsg_char_helper -lpthread
SYSROOT ?= $(HOME)/targetfs
CFLAGS += --sysroot=$(SYSROOT)

SOURCES := statcol.c
all: statcol

statcol: $(SOURCES)
	$(CROSS_COMPILE)$(CC) $(CFLAGS) $(LIBS) -o $@ $^

clean:
	rm -rf statcol

install:
	install -d ${DESTDIR}/usr/bin/
	install -m 0755 statcol ${DESTDIR}/usr/bin/

