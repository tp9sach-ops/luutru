# HANDOFF v7 – Premium Skin (19/11/2026)

## ĐÃ LÀM
- premium.css (MỚI): lớp giao diện cao cấp phủ lên style.css – font Playfair Display (tiêu đề vàng kim loại có ánh chạy) + Be Vietnam Pro (chữ UI), khung sân khấu viền vàng 3 lớp + vignette điện ảnh, thẻ nhập liệu kính mờ, nút vàng kim loại có vệt sáng quét, cổng vào có tia sáng xoay, hộp trúng thưởng viền vàng nảy vào.
- app.js: thêm 1 dòng đầu file – nạp premium.css và bật tone mapping ACES cho renderer Three.js (không đụng game.js). Thêm `?classic=1` vào URL để tắt tone mapping khi cần so sánh.

## CHƯA LÀM / CHƯA KIỂM CHỨNG
- CHƯA nhìn hình thật (môi trường không tải/render được Three.js) – mọi chỉnh sửa là theo tính toán, cần xem trên điện thoại và chụp ảnh gửi lại.
- CHƯA nâng cấp mô hình 3D trong game.js: cọp (hàm tiger), đường đua (trackMesh), phông cảnh, hạt/ánh sáng, bloom. Đây là phần lớn nhất, làm tiếp từng mục.
- Nếu ACES làm màu tối/ngả cam: thêm ?classic=1 để so, hoặc sửa toneMappingExposure trong app.js dòng 1.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md và HANDOFF-v7.md trước). Nói tiếng Việt, ngắn gọn, làm từng mục một; sửa dạng find-and-replace, đẩy thẳng lên main; cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test. Việc hiện tại: đã có premium.css + tone mapping (v7). Mục tiếp theo: nâng cấp đồ họa 3D trong game.js theo thứ tự: (1) cọp: thêm viền sáng/rim light, bóng mềm, lông mịn hơn; (2) đường đua + sân khấu: ánh sáng nền, phản chiếu, đèn; (3) hiệu ứng: bloom giả bằng sprite, pháo giấy, tia sáng khi cọp thắng. Nhận xét của mình: [DÁN ẢNH + NHẬN XÉT].
