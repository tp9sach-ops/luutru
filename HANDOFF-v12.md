# HANDOFF v12 – 21/11/2026 (loader v20 + patches.js)

## KIẾN TRÚC HIỆN TẠI
index.html -> app.js -> loader.js. loader nạp: tiger/ (cọp có xương), patches.js (mảng window.P22), game.js?v=21; rồi vá game.js bằng find-and-replace: mảng P trong loader.js (cũ, v18/v19) rồi P22 (mới). ?debug=1 hiện "patch ok/tổng + vá hụt" ở góc trái dưới. Vá mới lỗi cú pháp thì tự quay về chỉ dùng P cũ.
Từ nay mỗi mục mới chỉ cần thêm cặp [tìm, thay] vào cuối patches.js (nhớ tăng ?v= của patches.js trong loader.js khi đổi, và loader.js?v= trong index.html nếu sửa loader).

## ĐÃ LÀM – MỤC 1 (camera + tên quà)
- Thêm hàm fitCam() (patches.js): tính vị trí từng cọp theo tiến độ đua, căn tâm khung theo cọp (sx, sy), rồi lùi camera đúng khoảng cần để mọi cọp + tên quà lọt khung (cả ngang lẫn dọc, có lề). Dùng cho idle, warm, race (trừ intro và cảnh quay cọp thắng). Màn dọc (asp<1) nhìn chếch hơn.
- Cảnh quay cọp thắng bắt đầu từ đúng vị trí camera đang đứng (không giật).
- Tên quà: hiện cả lúc chờ + lúc đua (trước đây chỉ hiện sau 1,4 s đua), cao 38–68 px thay vì 28–44, chữ Be Vietnam Pro đậm 52px, hạ sát đầu cọp (y 5.7 + 0.8*(i%3)).
- Loader: bản v20 có gỡ vá camera cũ (khối "var m=LN.length,q,cx=0,cz=0..."), thêm ?debug=1 và kiểm cú pháp.

## CHƯA KIỂM
Chưa chạy được WebGL thật trong môi trường làm việc. Cần xem trên điện thoại (tab ẩn danh + ?debug=1): cọp có giữa khung ở màn chờ và lúc đua không, camera có lùi quá xa khi 12 cọp tản ra không, tên quà có chồng nhau không (nếu chồng: giảm px hoặc tăng bước so le).

## CÒN LẠI (làm từng mục)
2. Cọp xoay cổ tay/cổ chân + dáng chạy ở màn chọn cửa hàng; thêm cây thông Noel + tuyết (tiger-rig.js, game.js buildScene/snow).
3. Lỗi 2 logo trong màn đua (còn bn: biển logo ở đích + logo ngực/băng đô từ tiger-extras.js) – thay còn 1.
4. Chạy hồi hộp, vượt mặt tự nhiên (mkTab/startRace: tốc độ mượt, không tăng/giảm đột ngột).
5. Quà hết (0%) vẫn xuất hiện trên đường đua.
6. Hình quà hiện trên chữ tên quà (label sprite có ảnh IM[ten]).
7. Chữ "Hóa đơn từ…" đổi kiểu nhãn vàng bo tròn như ảnh mẫu, ghi 155k được tham gia đường đua (index.html .rule + game.js apply() đang ghi đè #mn bằng MinTien).
8. Tư thế sẵn sàng trước khi chạy; vừa bắt đầu là chạy luôn (không đơ rồi bị kéo): TR.pose/tiger-rig solve, pha bước theo vận tốc.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v12.md, loader.js, patches.js). Nói tiếng Việt, ngắn gọn, làm từng mục một theo danh sách CÒN LẠI, đẩy thẳng lên main, cuối phiên cập nhật HANDOFF. Không bịa kết quả test. Nhận xét của mình sau khi xem mục 1: [DÁN ẢNH + NHẬN XÉT].
