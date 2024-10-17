#!/bin/bash
useradd -M -r -s /bin/false prometheus
mkdir /etc/prometheus /var/lib/prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.7/prometheus-2.40.7.linux-amd64.tar.gz
tar xzf prometheus-2.40.7.linux-amd64.tar.gz
cp prometheus-2.40.7.linux-amd64/{prometheus,promtool} /usr/bin/
cp -r prometheus-2.40.7.linux-amd64/{consoles,console_libraries} /etc/prometheus/
cp prometheus-2.40.7.linux-amd64/prometheus.yml /etc/prometheus/
chown -R prometheus:prometheus /etc/prometheus
chown prometheus:prometheus /var/lib/prometheus
cat <<EOF > /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Time Series Collection and Processing Server
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
EOF
#!/bin/bash
useradd -M -r -s /bin/false prometheus
mkdir /etc/prometheus /var/lib/prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.7/prometheus-2.40.7.linux-amd64.tar.gz
tar xzf prometheus-2.40.7.linux-amd64.tar.gz
cp prometheus-2.40.7.linux-amd64/{prometheus,promtool} /usr/bin/
cp -r prometheus-2.40.7.linux-amd64/{consoles,console_libraries} /etc/prometheus/
cp prometheus-2.40.7.linux-amd64/prometheus.yml /etc/prometheus/
chown -R prometheus:prometheus /etc/prometheus
chown prometheus:prometheus /var/lib/prometheus
cat <<EOF > /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Time Series Collection and Processing Server
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl start prometheus
systemctl enable prometheus
firewall-cmd --add-port=9090/tcp --permanent
firewall-cmd --reload

