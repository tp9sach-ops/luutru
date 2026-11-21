# HANDOFF v12 – cập nhật sau mục 5 (21/11/2026)

## KIẾN TRÚC
index.html -> app.js -> loader.js (v20). loader nạp tiger/ + patches.js (window.P22) + game.js?v=21 rồi vá game.js bằng find-and-replace: mảng P trong loader.js (cũ) rồi P22 (mới). ?debug=1 hiện "patch ok/tổng + vá hụt". Mục mới: thêm cặp [tìm, thay] vào cuối patches.js (tăng ?v= của patches.js trong loader.js khi đổi; loader.js?v= / gate.js?v= trong index.html khi sửa các file đó). LƯU Ý: chuỗi TÌM phải khớp game.js SAU khi mảng P của loader đã vá (ví dụ FOV là 62/44, không phải 58/40).
"Màn hình chọn cửa hàng" = #gate do gate.js dựng (1 cọp 3D nhỏ + ô tìm cửa hàng + số hóa đơn), không phải cảnh 3D của game.
Backend: Apps Script, mã nguồn ở repo tp9sach-ops/vongquay (Code.gs). Người dùng tự dán Code.gs vào Apps Script rồi triển khai lại (/exec).

## ĐÃ LÀM
- MỤC 1 (patches.js): fitCam() canh khung camera giữa cọp + lọt tên quà; tên quà to, hiện cả lúc chờ.
- MỤC 2 (gate.js): cọp ở cổng khởi động + chạy bộ tại chỗ; 2 cây thông Noel SVG + tuyết rơi.
- MỤC 3: 2 logo ở màn đua – logo/chữ XUẤT PHÁT đã gỡ từ trước; còn biển logo ở đích + logo ngực/băng đô từng cọp. Chờ người dùng xác nhận.
- MỤC 4 (patches.js): tốc độ mỗi cọp = 3 sóng sin chu kỳ ~3-6 s, vượt mặt nhiều lần, mượt; cọp trúng quà về đích đúng giờ + nước rút cuối (WS).
- CỔNG v5 (gate.js?v=5): bỏ vẫy chào; chạy -> dừng khởi động cổ tay/chân -> chạy lại (chu kỳ 10 s); giao diện đỏ Noel (nền đỏ, kẹo gậy, dây đèn bóng đỏ, hộp quà, cây có ruy băng đỏ).
- MỤC 5 (patches.js, cặp vá cuối): game dùng D.show[cửa hàng] (mọi quà đang bật kể cả hết kho/tỷ lệ 0%) để dựng cọp; D.prizes[cửa hàng] vẫn là quà còn quay được (dùng báo hết quà/khóa cửa hàng). Máy chủ cũ chưa có D.show thì chạy như trước. CẦN dán Code.gs mới (hàm API.pub trả thêm show) và triển khai lại thì mới thấy quà hết trên đường đua. Chưa kiểm bằng trình duyệt thật.

## CÒN LẠI (làm từng mục)
6. Hình quà hiện trên chữ tên quà (label sprite có ảnh IM[ten]).
7. Chữ "Hóa đơn từ…" đổi kiểu nhãn vàng bo tròn như ảnh mẫu, ghi 155k được tham gia đường đua (index.html .rule + game.js apply() đang ghi đè #mn bằng MinTien).
8. Tư thế sẵn sàng trước khi chạy trong cảnh game; vừa bắt đầu là chạy luôn (không đơ rồi bị kéo): TR.pose/tiger-rig solve, pha bước theo vận tốc.
(Tùy chọn: đổi nền/khung màn đua từ xanh sang đỏ Noel.)

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v12.md, loader.js, patches.js, gate.js; backend ở repo tp9sach-ops/vongquay/Code.gs). Nói tiếng Việt, ngắn gọn, làm từng mục một theo danh sách CÒN LẠI, đẩy thẳng lên main, cuối phiên cập nhật HANDOFF. Khi sửa mã mình tự dán thì đưa đủ đoạn TÌM và đoạn THAY BẰNG. Không bịa kết quả test. Nhận xét của mình sau khi xem mục 4-5 và cổng v5: [DÁN ẢNH + NHẬN XÉT].
