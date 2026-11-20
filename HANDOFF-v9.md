# HANDOFF v9 – 19/11/2026 (loader v13)

## KIẾN TRÚC
index.html -> app.js -> loader.js. loader tải game.js?v=13, áp mảng P (find-and-replace theo thứ tự; vá sau phải khớp CHỮ ĐÃ VÁ TRƯỚC), rồi chạy. ?debug=1 hiện `patch ok/tổng` + vá hụt. ?classic=1 = bản gốc. game.js được sửa trực tiếp ở phiên khác (nhãn quà so le i%3) -> mỗi lần game.js đổi phải đối chiếu lại chuỗi trong loader.

## ĐÃ LÀM (v13, chưa nhìn hình thật)
- Sửa vá nhãn quà bị hụt sau khi game.js đổi (giữ so le i%3 + mọc lên từ đỉnh hộp, cỡ cố định).
- Vật liệu cọp/hộp/mũ emissive nhẹ (màu rực dưới trời đêm).
- Cân màu điện ảnh bằng CSS soft-light trên khung 3D (.stage:before).
- Hiệu ứng thắng: pháo giấy 460 hạt + mưa pháo giấy 3.4s + quầng sáng vàng sau cọp thắng.
- Popup trúng thưởng: tia sáng xoay phía sau hộp (.box:before).
- Biển “9 SẠCH” khổng lồ trên cổng về đích.

## CHƯA LÀM
1. Mô hình cọp vẫn ghép từ khối cầu (cần dựng lại tai, đuôi, chân, tư thế chạy).
2. Màn hình cổng vào dùng SVG phẳng, lệch phong cách 3D.
3. Chưa có bloom thật (mới chỉ có sprite cộng sáng).
4. Khi ổn: gộp toàn bộ vá vào game.js, bỏ loader.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v9.md rồi HANDOFF-v8.md, loader.js). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối phiên viết prompt bàn giao mới. Không bịa kết quả test. Trước khi sửa: đối chiếu game.js hiện tại với mảng P trong loader.js (game.js có thể đã bị sửa tay). Mình sẽ gửi ảnh v13 (mở tab ẩn danh + ?debug=1). Việc tiếp: (1) dựng lại cọp 3D đẹp hơn; (2) cổng vào đồng bộ phong cách 3D; (3) bloom giả mạnh hơn; (4) gộp vá vào game.js. Nhận xét của mình: [DÁN ẢNH + NHẬN XÉT].
