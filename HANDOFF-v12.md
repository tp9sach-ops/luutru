# HANDOFF v12 – cập nhật sau mục 4 + cổng v5 (21/11/2026)

## KIẾN TRÚC
index.html -> app.js -> loader.js (v20). loader nạp tiger/ + patches.js (window.P22) + game.js?v=21 rồi vá game.js bằng find-and-replace: mảng P trong loader.js (cũ) rồi P22 (mới). ?debug=1 hiện "patch ok/tổng + vá hụt". Mục mới: thêm cặp [tìm, thay] vào cuối patches.js (tăng ?v= của patches.js trong loader.js khi đổi; loader.js?v= / gate.js?v= trong index.html khi sửa các file đó).
"Màn hình chọn cửa hàng" = #gate do gate.js dựng (1 cọp 3D nhỏ + ô tìm cửa hàng + số hóa đơn), không phải cảnh 3D của game.

## ĐÃ LÀM
- MỤC 1 (patches.js): fitCam() canh khung camera giữa cọp + lọt tên quà; tên quà to, hiện cả lúc chờ.
- MỤC 2 (gate.js): cọp ở cổng khởi động + chạy bộ tại chỗ; 2 cây thông Noel SVG + tuyết rơi.
- MỤC 3: 2 logo ở màn đua – logo/chữ XUẤT PHÁT đã gỡ từ trước; còn biển logo ở đích + logo ngực/băng đô từng cọp. Chờ người dùng xác nhận còn thấy 2 logo không.
- MỤC 4 (patches.js, commit ab0af4d): tốc độ mỗi cọp = 3 sóng sin chu kỳ ~3-6 s (biên độ .36/.2/.12), vượt mặt nhiều lần, vẫn mượt; mkTab chuẩn hóa để cọp trúng quà về đích đúng giờ; cọp thắng có thêm nước rút 7 giây cuối (tham số WS). Chưa chạy thử WebGL.
- CỔNG v5 (gate.js?v=5, index.html): BỎ vẫy chào. Chu kỳ 10 s: chạy bộ tại chỗ (0-3.4 s) -> dừng -> khởi động xoay cổ tay/cổ chân/nhấc chân (4.2-9 s) -> chạy lại. Giao diện đỏ Noel: nền radial đỏ, viền kẹo gậy đỏ-trắng trên cùng, dây đèn xanh nơ đỏ + bóng đỏ treo dưới viền (SVG tile lặp), cây thông có dây ruy băng đỏ + bóng đỏ/vàng, 4 hộp quà đỏ/trắng dưới chân cây, theme-color #a3102a. CSS đỏ nằm trong sty2 của gate.js (nạp sau premium.css). Chưa kiểm bằng trình duyệt thật: xem dây đèn có đè tiêu đề không (padding-top cổng = 58px), hộp quà có bị cọp che không.
- Màu xanh còn lại ở nền game (body premium.css, style.css) và khung trận đua: chưa đổi sang đỏ, làm nếu người dùng muốn.

## CÒN LẠI (làm từng mục)
5. Quà hết (0%) vẫn xuất hiện trên đường đua (tỷ lệ ra 0%). Phụ thuộc máy chủ Apps Script có gửi quà hết về không: kiểm tra trước (DC.d().prizes / unk, game.js đọc danh sách quà).
6. Hình quà hiện trên chữ tên quà (label sprite có ảnh IM[ten]).
7. Chữ "Hóa đơn từ…" đổi kiểu nhãn vàng bo tròn như ảnh mẫu, ghi 155k được tham gia đường đua (index.html .rule + game.js apply() đang ghi đè #mn bằng MinTien).
8. Tư thế sẵn sàng trước khi chạy trong cảnh game; vừa bắt đầu là chạy luôn (không đơ rồi bị kéo): TR.pose/tiger-rig solve, pha bước theo vận tốc.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v12.md, loader.js, patches.js, gate.js). Nói tiếng Việt, ngắn gọn, làm từng mục một theo danh sách CÒN LẠI, đẩy thẳng lên main, cuối phiên cập nhật HANDOFF. Không bịa kết quả test. Nhận xét của mình sau khi xem cổng v5 và mục 4: [DÁN ẢNH + NHẬN XÉT].
