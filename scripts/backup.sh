#!/bin/bash
# Tạo thư mục backups nếu chưa có
mkdir -p backups
# Lấy ngày giờ hiện tại
DATE=$(date +%Y%m%d_%H%M%S)
FILE_NAME="backups/slime_coffee_$DATE.sql"

echo "Đang tiến hành sao lưu cơ sở dữ liệu..."
# Dùng docker exec để gọi lệnh mysqldump bên trong container
sudo docker exec slime_mysql mysqldump -u root -p221105 slime_coffee > $FILE_NAME

echo "Sao lưu thành công! File được lưu tại: $FILE_NAME"