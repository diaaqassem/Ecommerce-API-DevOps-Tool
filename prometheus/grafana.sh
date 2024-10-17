#!/bin/bash

cat <<EOF > /etc/yum.repos.d/grafana.repo
[grafana]
name=grafana
baseurl=https://packages.grafana.com/oss/rpm
repo_gpgcheck=1
enabled=1
gpgkey=https://packages.grafana.com/gpg.key
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
EOF

yum install -y grafana

systemctl start grafana-server

systemctl enable grafana-server

firewall-cmd --add-port=3000/tcp --permanent

firewall-cmd --reload

systemctl status grafana-server

