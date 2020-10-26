# Statistics Collector Tools

This application is used for collecting various statistics data from differnt CPUs, operating systems, applications running on TI SoCs. This acts as a reference framework for collection and visualization of statistics data.

## What kind of statistics?

Currently, the application uses rpmsg_char based remote services to collect CPU load, DDR memory bandwidth and network bandwidth from the remote procs in the system. However, this can be easily expanded to collect other data like memory usage in Linux, GPU usage, application metrics like rendering frame per seconds, processing latency, etc

## How does the visualization work?

By default, the application only dumps the data on command line. Each line represents a statistics data. For visualization, this data can be sent over websocket to a webpage running in a broser on a host machine. **Websockets** allow to send the output of the web socket seamlessly. It also supports serving static webpages.

## Usage

Follow these steps to use the statistics collector tools.

* Find out the IP address of the target board, where you want to measure the statistics data
* Start a webserver by using following command

    websocketd --port=8090 --staticdir=/usr/share/statcol/static --dir=/usr/share/statcol/scripts