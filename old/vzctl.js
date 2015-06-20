#!/bin/sh
#vzctl create XXX --ostemplate yyy
#export HN=myHostname && export TEMPLATE=/z/T.conf && export OS=centos-7-x86_64 && export CTID=135 && 
CTID=$2
OS=$4
TEMPLATE=/z/T.conf
#ls /z/${CTID}.conf 2>/dev/null && exit -1 ||  


zfs send tank/Templates/${OS}@1 | pv | zfs recv tank/${CTID} && \
	zfs get mounted tank/$CTID -o value -H | grep ^yes$ && \
	mkdir /tank/$CTID/root && mkdir /tank/$CTID/private && mv /tank/$CTID/os /tank/$CTID/private/$CTID && \
	cat $TEMPLATE | sed "s/CTID/${CTID}/g" >  /etc/sysconfig/vz-scripts/${CTID}.conf && \
	vzlist $CTID && vzctl start $CTID && sleep 1 && vzctl stop $CTID && sleep 3 && vzctl start $CTID && exit 0
