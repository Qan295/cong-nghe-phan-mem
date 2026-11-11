
# 📱 Phân hệ Mobile App - Smart Heritage

Ứng dụng di động được xây dựng bằng **Flutter (Dart)**, chạy trên cả hai nền tảng Android và iOS, tích hợp công nghệ Bluetooth Low Energy (BLE) để nhận diện iBeacon tự động tại các khu di tích lịch sử.

## 🛠️ Cấu trúc thư mục mã nguồn (`lib/`)

- `models/`: Chứa các lớp dữ liệu (Hiện vật, Di tích, Beacon).
- `services/`: Chứa file `beacon_service.dart` (Xử lý quét BLE, tính toán khoảng cách RSSI và chống lặp).
- `screens/`: Chứa các màn hình giao diện (Trang chủ, Bản đồ số, Chi tiết hiện vật).
- `widgets/`: Các thành phần giao diện dùng chung (Popup, Button,...).
- `main.dart`: Điểm khởi chạy ứng dụng.

## ⚙️ Hướng dẫn cài đặt & Chạy ứng dụng

1. Đảm bảo đã cài đặt Flutter SDK và cấu hình môi trường.
2. Mở terminal tại thư mục `mobile/` và chạy lệnh tải thư viện:
   ```bash
   flutter pub get
   ```
