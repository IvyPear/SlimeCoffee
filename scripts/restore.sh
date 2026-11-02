#!/bin/bash
# Yêu cầu nhập tên file backup muốn khôi phục
read -p "Nhập đường dẫn file SQL muốn khôi phục (vd: backups/file.sql): " FILE_NAME

echo "Đang tiến hành khôi phục dữ liệu..."
# Bơm file sql ngược lại vào container
cat $FILE_NAME | sudo docker exec -i slime_mysql mysql -u root -p221105 slime_coffee

echo "Khôi phục thành công!"