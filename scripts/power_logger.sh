#!/bin/bash

# TODO
# Add support for other platforms by discovering the instances of
# GPIO chips, GPIO controllers, and board specific hwmon connections, etc

init() {
	#Find all the gpiochip instances
	find /sys/class/gpio -name '*gpiochip*' | grep -o '...$' > index
	str=601000.gpio
	a=0
	cat index | while read line
	do
		#Get the gpiochip instance matching 601000.gpio
		#Set the gpio0 of the instance to output low
		temp=`cat /sys/class/gpio/gpiochip$line/label`
		if [[ "$str" == "$temp" ]]; then
			echo $line > /sys/class/gpio/export
			echo out > /sys/class/gpio/gpio$line/direction
			echo 0 > /sys/class/gpio/gpio$line/value
			break
		fi
	done
}

#logging function to log the MCU/CORE/USB/CPU/Total_of_first_set of 16 rails
#This can be captured by teh websocket interface in the host side.
logger() {
	a=0
	val=0
	tmp=0
	t=0
	volt_uW=(0 0 0 0 0)
	volt_W=(0 0 0 0 0)

	while [ $t -lt $1 ]
	do
		val=0
		tmp=0
		a=0
		while [ $a -lt 16 ]
		do
			tmp=`cat /sys/class/hwmon/hwmon$a/power1_input`
			val=`expr $val + $tmp`
			a=`expr $a + 1`
		done
		sleep 1

		volt_uW[0]=`cat /sys/class/hwmon/hwmon0/power1_input`
		volt_uW[1]=`cat /sys/class/hwmon/hwmon5/power1_input`
		volt_uW[2]=`cat /sys/class/hwmon/hwmon8/power1_input`
		volt_uW[3]=`cat /sys/class/hwmon/hwmon14/power1_input`
		volt_uW[4]=$val

		volt_W[0]=`echo "scale=6; ${volt_uW[0]} / 1000000" | bc`
		volt_W[1]=`echo "scale=6; ${volt_uW[1]} / 1000000" | bc`
		volt_W[2]=`echo "scale=6; ${volt_uW[2]} / 1000000" | bc`
		volt_W[3]=`echo "scale=6; ${volt_uW[3]} / 1000000" | bc`
		volt_W[4]=`echo "scale=6; ${volt_uW[4]} / 1000000" | bc`

		echo "Temp: 5 MCU `echo ${volt_W[0]}` CORE `echo ${volt_W[1]}` CPU `echo ${volt_W[2]}` USB `echo ${volt_W[3]}` TOTAL_16_RAILS `echo ${volt_W[4]}`"
		t=`expr $t + 1`
	done
}
#Invoke gpio initialization set it to output low so we choose first 16 INA rails
init
#Invoke logger for a good long time
#websocketd --devconsole --port=8090 bash -c logger 1000
logger $1
