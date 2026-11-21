# Đường Đua Quà Giáng Sinh (Đua Cọp) – 9 Sạch

Game thay cho Vòng Quay: khách bấm **ĐUA CỌP**, mỗi món quà là một chú cọp vàng đội hộp quà trên đầu chạy trên đường đua. Cọp đội quà nào về đích trước thì khách nhận quà đó.

## Thể lệ (giống Vòng Quay)
- Dùng chung backend Google Apps Script của repo `vongquay` (cùng link `/exec`, cùng Google Sheet).
- Máy chủ quyết định quà trúng (`spin`), game chỉ dàn cảnh để cọp kéo đúng quà đó về nhất.
- Số cọp = số quà còn của cửa hàng đã chọn (tối đa 12 cọp).
- Cửa hàng nào hết quà (không có quà đang bật, còn số lượng, tỉ lệ > 0) sẽ hiện "(hết quà)" và không chọn được.

## Tệp (đều nằm ở thư mục gốc)
- `index.html` – giao diện
- `style.css` – kiểu dáng
- `app.js` – kết nối máy chủ (CFG.API)
- `game.js` – cảnh 3D (Three.js r128 qua CDN), cọp, đường đua, camera, âm thanh
- `nhac-nen.mp3` – nhạc nền; `alex-morgan-car-car-music-545487.mp3` – nhạc lúc đua

## Mở game
Bật GitHub Pages (nhánh main, thư mục gốc), mở https://tp9sach-ops.github.io/luutru/
