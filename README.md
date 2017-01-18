CTECH Hub
 

install jessie-lite
enable ssh with raspi config
clone repo
install nodejs
run npm install
add user pi to group dialout:  usermod -a -G dialout pi
copy ctech.service to /etc/systemd/system
update directory in service file to point to app.js
run systemctl enable ctech.service

