#!/bin/bash
useradd -M -r -s /bin/false node_exporter
yum install -y wget
wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
tar xvfz node_exporter-1.5.0.linux-amd64.tar.gz
cp node_exporter-1.5.0.linux-amd64/node_exporter /usr/bin/
chown node_exporter:node_exporter /usr/bin/node_exporter
cat <<EOF > /etc/systemd/system/node_exporter.service
[Unit]
Description=Prometheus Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl start node_exporter
systemctl enable node_exporter
firewall-cmd --add-port=9100/tcp --permanent
firewall-cmd --reload

