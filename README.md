# Đua Cọp May Mắn – 9 Sạch

Game thay cho Vòng Quay: khách bấm **ĐUA CỌP**, mỗi món quà là một chú cọp con đeo sừng hưu kéo quà chạy trên đường đua. Cọp kéo quà nào về đích trước thì khách nhận quà đó.

## Thể lệ (giống Vòng Quay)
- Dùng chung backend Google Apps Script của repo `vongquay` (cùng link `/exec`, cùng Google Sheet).
- Máy chủ quyết định quà trúng (`spin`), game chỉ dàn cảnh để cọp kéo đúng quà đó về nhất.
- Số cọp = số quà còn của cửa hàng đã chọn (tối đa 12 cọp).
- Khách nhập cửa hàng, họ tên, SĐT, số hóa đơn rồi bấm đua.

## Tệp
- `duacop/index.html` – giao diện
- `duacop/style.css` – kiểu dáng
- `duacop/app.js` – kết nối máy chủ (CFG.API)
- `duacop/game.js` – cảnh 3D (Three.js r128 qua CDN), cọp, đường đua

## Mở game
Bật GitHub Pages cho repo, mở `/duacop/`.
