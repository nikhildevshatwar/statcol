CROSS_COMPILE ?= aarch64-none-linux-gnu-
CFLAGS += -I include -g -O0
LIBS := -lti_rpmsg_char -lpthread
SYSROOT ?= $(HOME)/targetfs
CFLAGS += --sysroot=$(SYSROOT)

SOURCES := statcol.c
all: statcol

statcol: $(SOURCES)
	$(CROSS_COMPILE)gcc $(CFLAGS) $(LIBS) -o $@ $^

clean:
	rm -rf statcol

install: statcol
	install -d ${DESTDIR}/$(bindir)
	install -m 0755 statcol ${DESTDIR}/$(bindir)
	# Install the web related stuff
	install -d ${DESTDIR}/$(datadir)/statcol
	cp -r static ${DESTDIR}/$(datadir)/statcol/
	cp -r scripts ${DESTDIR}/$(datadir)/statcol/
