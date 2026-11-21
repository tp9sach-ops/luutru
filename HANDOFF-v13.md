# HANDOFF v13 – cập nhật sau mục 7 và 8 (21/11/2026)

## KIẾN TRÚC (như v12)
index.html -> loader.js (nạp tiger/ + patches.js + game.js rồi vá game.js bằng find-and-replace: mảng P trong loader.js rồi window.P22 trong patches.js). ?debug=1 hiện "patch ok/tổng + vá hụt". Mục mới: thêm cặp [tìm, thay] vào cuối patches.js. Chuỗi TÌM phải khớp game.js SAU khi mảng P của loader đã vá, và SAU các cặp P22 đứng trước nó.
Chuyển động cọp trong game: tiger/tiger-runtime.js (TR.pose) gọi TigerRig.solve ở tiger/tiger-rig.js. Cổng #gate (gate.js) dùng solve riêng, không qua TR.pose.
Backend: repo tp9sach-ops/vongquay (Code.gs, đã có bản mới).

## ĐÃ LÀM THÊM TRONG PHIÊN NÀY
- MỤC 7 (skin2.css, index.html, patches.js): nhãn "Hóa đơn từ 155k được tham gia đường đua" kiểu vàng bo tròn, số trong viên đỏ; #mn cố định 155k (game.js apply() không ghi đè MinTien nữa).
- MỤC 8a (tiger/tiger-runtime.js): TƯ THẾ SẴN SÀNG khi chưa chạy (state idle, giới thiệu trừ cọp giữa đang vẫy, đếm ngược): chân trái trước, chân phải lùi sau (gót nhấc nhẹ), gối khuỵu, chúi người, nhún nhẹ; tay lấy từ dáng chạy ở pha 0. Trọng số l.rd trộn mượt sang/khỏi tư thế này.
- MỤC 8b (tiger-runtime.js + patches.js): xuất phát chạy luôn. Tốc độ vị trí khởi đầu 55% rồi lên 100% trong 1.2 s (trước: smoothstep 2.4 s từ 0); biên độ sóng vượt mặt tăng dần trong 2.5 s đầu; chân cọp có sàn tốc độ .55 trong ~2.6 s đầu cuộc đua. mkTab vẫn chuẩn hóa nên cọp về đích đúng giờ.

## CHƯA KIỂM BẰNG TRÌNH DUYỆT THẬT (cần người dùng xem)
- Tư thế sẵn sàng có tự nhiên không (độ khuỵu gối dy=-.035, chân trước .05, chân sau -.045 trong readyLegs của tiger-runtime.js; chỉnh các số này nếu quá thấp/quá cao).
- Lúc bấm ĐUA CỌP rồi "ĐUA!": cọp có vào nhịp chạy ngay, không khựng không.
- Cache: loader vẫn nạp tiger-runtime.js?v=1 và patches.js?v=22 (chưa tăng số), nên cần tab ẩn danh hoặc tải lại cứng. Muốn dứt điểm: tăng ?v= trong loader.js (tiger-runtime.js?v=2, patches.js?v=23) và loader.js?v= trong index.html.

## CÒN LẠI
- Chờ người dùng xem mục 4-8 và cổng v6 rồi nhận xét.
- (Tùy chọn) Thêm vật phẩm đỏ Noel vào cảnh đua / khung trang, không đổi nền xanh.
- Mục 3 (2 logo): chờ người dùng xác nhận còn thấy 2 logo không (biển logo ở đích + logo ngực/băng đô từng cọp).

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v13.md, loader.js, patches.js, tiger/tiger-runtime.js, gate.js; backend ở repo tp9sach-ops/vongquay/Code.gs). Nói tiếng Việt, ngắn gọn, làm từng mục một theo danh sách CÒN LẠI, đẩy thẳng lên main, cuối phiên cập nhật HANDOFF. Khi sửa mã mình tự dán thì đưa đủ đoạn TÌM và đoạn THAY BẰNG. Không bịa kết quả test. Nhận xét của mình sau khi xem mục 4-8: [DÁN ẢNH + NHẬN XÉT].
