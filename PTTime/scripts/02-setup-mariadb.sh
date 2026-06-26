#!/usr/bin/env bash
set -e
sudo service mariadb start
sudo mysql <<'SQL'
DROP DATABASE IF EXISTS pt_db;
CREATE DATABASE pt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'testuser'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON pt_db.* TO 'testuser'@'localhost';
FLUSH PRIVILEGES;
SQL
mysql -u testuser -p1234 -e "SHOW DATABASES LIKE 'pt_db';"
echo "MariaDB reset complete: pt_db / testuser / 1234"
