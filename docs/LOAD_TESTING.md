# Báo Cáo Kiểm Thử Tải & Kích Hoạt Cảnh Báo (Week 4)

## 1. Mục tiêu kiểm thử
- Xác thực tính ổn định của hệ thống Slime Coffee khi chạy sau Nginx Reverse Proxy.
- Giả lập đột biến lưu lượng (Spike Traffic) để kích hoạt luật cảnh báo CPU > 80% đã thiết lập ở Tuần 3.
- Kiểm tra tính thông suốt của chuông báo động gửi về Discord Webhook.

## 2. Kịch bản kiểm thử (Stress Test Scenario)
- **Công cụ:** Script bash `tests/stress_test.sh` (sử dụng curl đa luồng bất đồng bộ).
- **Cổng tiếp nhận:** Port 80 (Nginx Gateway).
- **Tổng lượng request:** 1.200 requests.
- **Mức đồng thời (Concurrency):** 60 requests/lượt.

## 3. Kết quả ghi nhận
- **Tình trạng Nginx/App:** Hệ thống phản hồi ổn định, Nginx phân phối tải thành công vào `slime_app`.
- **CPU Metrics (Prometheus/Grafana):** Mức tải CPU vọt ngưỡng 80% trong chu kỳ đánh giá (Evaluation interval: 1m).
- **Discord Notification:** Bot gửi thông báo trạng thái **[FIRING] Canh_Bao_CPU_Qua_Tai** kèm thông số container tương ứng.
