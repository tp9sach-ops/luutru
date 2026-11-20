# HANDOFF v10 – 20/11/2026 (loader v14)

## KIẾN TRÚC (không đổi)
index.html -> app.js -> loader.js. loader tải game.js?v=13, áp mảng P (find-and-replace theo thứ tự; vá sau phải khớp CHỮ ĐÃ VÁ TRƯỚC), rồi chạy. ?debug=1 hiện `patch ok/tổng` + vá hụt. ?classic=1 = bản gốc (không vá, không đổi cổng).

## ĐÃ LÀM (v14, CHƯA nhìn hình thật)
Thay các chi tiết cọp bằng logo 9 SẠCH thật (vẽ lại từ ảnh logo gốc: nền vàng, viền xanh lá mảnh, 2 lát sầu riêng vỏ gai xanh, chữ 9 SẠCH đỏ viền trắng):
- window.L9D (đầu loader) = 4 chuỗi path của lát sầu riêng; dùng chung cho canvas (drawLogo9, texture 256x256 thay texture 128 cũ) và SVG cổng vào.
- Bụng cọp: huy hiệu logo to hơn (scale .56, y .66). Vòng cổ: dây đỏ thương hiệu 0xda0e2a (bỏ màu khăn theo làn) + mặt dây chuyền logo (scale .3, y 1.1) + hạt vàng.
- Biển xuất phát (cột gỗ phía sau): sprite logo thay chữ. Cổng đích: biển chữ “9 SẠCH” của v13 thay bằng sprite logo 4.4. Cổng xuất phát: thêm sprite logo 3.0 phía trên nhãn XUẤT PHÁT.
- Cổng vào (SVG phẳng, sửa bằng DOM trong loader): bỏ băng bụng + chữ 9 cũ, thêm dây chuyền đỏ + logo thật.
- Nếu drawLogo9 lỗi (không có Path2D...) tự quay về huy hiệu cũ.

## ĐÃ KIỂM / CHƯA
- ĐÃ: node --check loader; áp thử 55/55 vá lên game.js hiện tại (sha 139d2a4…) không hụt, game đã vá qua node --check; so hình logo SVG với ảnh gốc.
- CHƯA: không render được three.js trong môi trường này -> chưa thấy logo trên cọp thật. Cần xem: huy hiệu bụng và mặt dây có bị chồng/đè lên cằm (đầu cọp scale 1.14), có lơ lửng quá xa bụng không (mặt phẳng đặt trước bụng ~.1), chữ 9 SẠCH có đúng font Baloo 2 chưa (canvas vẽ lại khi font tải xong), sprite logo ở cổng có che cột/nhãn không.
- Lưu ý: index.html vẫn gọi loader.js?v=1 -> mở tab ẩn danh hoặc thêm ?v=14.

## CHƯA LÀM (từ v9)
1. Dựng lại mô hình cọp (tai, đuôi, chân, tư thế chạy). 2. Cổng vào đồng bộ phong cách 3D. 3. Bloom mạnh hơn. 4. Gộp vá vào game.js, bỏ loader.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v10.md, HANDOFF-v9.md, loader.js). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối phiên viết prompt bàn giao mới. Không bịa kết quả test. Trước khi sửa: đối chiếu game.js hiện tại với mảng P trong loader.js (game.js có thể đã bị sửa tay). Mình sẽ gửi ảnh v14 (tab ẩn danh + ?debug=1 + ?v=14) để chỉnh vị trí/kích thước logo trên bụng, vòng cổ, cổng. Nhận xét của mình: [DÁN ẢNH + NHẬN XÉT].
