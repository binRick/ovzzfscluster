#!/bin/sh
#vzctl create XXX --ostemplate yyy
#export HN=myHostname && export TEMPLATE=/z/T.conf && export OS=centos-7-x86_64 && export CTID=135 && 
cacheCount=10
CTID=$2
OS=$4
TEMPLATE=/z/T.conf


ls /z/${CTID}.conf 2>/dev/null && exit -1

cat $TEMPLATE | sed "s/CTID/${CTID}/g" >  /etc/sysconfig/vz-scripts/${CTID}.conf || exit -1

zfsRename=""
for x in `seq 1 $cacheCount`; do
	src="tank/Templates/${OS}__copies/${x}"
	zfs list $src 2>/dev/null && \
	time zfs rename tank/Templates/${OS}__copies/${x} tank/${CTID} && \
	zfs get mounted tank/$CTID -o value -H | grep ^yes$ && \
	mkdir /tank/$CTID/root 2>/dev/null &&  mkdir /tank/$CTID/private && mv /tank/$CTID/os /tank/$CTID/private/$CTID && \
	exit 0
done
zfs send tank/Templates/${OS}@1 | pv | zfs recv tank/${CTID} || exit -1

zfs get mounted tank/$CTID -o value -H | grep ^yes$ && \
	mkdir /tank/$CTID/root 2>/dev/null &&  mkdir /tank/$CTID/private && mv /tank/$CTID/os /tank/$CTID/private/$CTID && \
	exit 0
	#vzlist $CTID && vzctl start $CTID && sleep 5 && vzctl stop $CTID && sleep 5 && vzctl start $CTID && vzctl stop $CTID && exit 0
