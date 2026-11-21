# HANDOFF v12 – cập nhật sau mục 2 (21/11/2026)

## KIẾN TRÚC
index.html -> app.js -> loader.js (v20). loader nạp tiger/ + patches.js (window.P22) + game.js?v=21 rồi vá game.js bằng find-and-replace: mảng P trong loader.js (cũ) rồi P22 (mới). ?debug=1 hiện "patch ok/tổng + vá hụt". Mục mới: thêm cặp [tìm, thay] vào cuối patches.js (tăng ?v= của patches.js trong loader.js khi đổi; loader.js?v= / gate.js?v= trong index.html khi sửa các file đó).
"Màn hình chọn cửa hàng" = #gate do gate.js dựng (1 cọp 3D nhỏ + ô tìm cửa hàng + số hóa đơn), không phải cảnh 3D của game.

## ĐÃ LÀM
- MỤC 1 (patches.js): fitCam() canh khung camera giữa cọp + lọt tên quà; tên quà to, hiện cả lúc chờ.
- MỤC 2 (gate.js v4, index.html gate.js?v=4): cọp ở cổng lặp chu kỳ 12 s: vẫy chào -> khởi động (xoay cổ tay, xoay cổ chân, nhấc chân luân phiên) -> chạy bộ tại chỗ (nghiêng 3/4 người). Thêm 2 cây thông Noel SVG hai bên cọp (bóng đèn nhấp nháy, sao vàng) và tuyết rơi toàn màn cổng (canvas 90 hạt). Cảnh 3D chờ trong game chưa đổi (đã có cây thông giữa + tuyết từ trước).
- CHƯA KIỂM bằng WebGL thật (chỉ đọc mã): cần xem trên điện thoại: chiều xoay cổ tay/cổ chân có tự nhiên không (nếu ngược chiều đổi dấu trong gate.js: qe(...), qa([1,0,0],-.7*lf) cho đùi và 1.0*lf cho cẳng), cây có che cọp/ô nhập không, tuyết có bị che sau nội dung không.

## CÒN LẠI (làm từng mục)
3. Lỗi 2 logo trong màn đua (còn bn: biển logo ở đích + logo ngực/băng đô từ tiger-extras.js) – thay còn 1.
4. Chạy hồi hộp, vượt mặt tự nhiên (mkTab/startRace: tốc độ mượt, không tăng/giảm đột ngột).
5. Quà hết (0%) vẫn xuất hiện trên đường đua.
6. Hình quà hiện trên chữ tên quà (label sprite có ảnh IM[ten]).
7. Chữ "Hóa đơn từ…" đổi kiểu nhãn vàng bo tròn như ảnh mẫu, ghi 155k được tham gia đường đua (index.html .rule + game.js apply() đang ghi đè #mn bằng MinTien).
8. Tư thế sẵn sàng trước khi chạy trong cảnh game; vừa bắt đầu là chạy luôn (không đơ rồi bị kéo): TR.pose/tiger-rig solve, pha bước theo vận tốc.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v12.md, loader.js, patches.js, gate.js). Nói tiếng Việt, ngắn gọn, làm từng mục một theo danh sách CÒN LẠI, đẩy thẳng lên main, cuối phiên cập nhật HANDOFF. Không bịa kết quả test. Nhận xét của mình sau khi xem mục 1-2: [DÁN ẢNH + NHẬN XÉT].
