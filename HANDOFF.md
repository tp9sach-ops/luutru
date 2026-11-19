# HANDOFF – Đua Cọp May Mắn 9 Sạch (cập nhật 19/11/2026, bản v6: cọp vàng, đường đua mới, camera cao, nhạc)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, thẳng vào việc; làm TỪNG MỤC MỘT, xong mỗi mục viết prompt bàn giao.
- Mỗi phiên làm việc phải kết thúc bằng một prompt bàn giao chi tiết cho phiên sau (phiên sau không có memory, không biết gì vẫn làm đúng).
- Giao file hoàn chỉnh (dán là chạy) hoặc đẩy thẳng lên repo; không đưa đoạn code rời rạc.
- Luôn điều tra bằng bằng chứng trước khi sửa; không bịa kết quả test; nói rõ cái gì đã kiểm chứng, cái gì chưa.

## BỐI CẢNH
- Repo: https://github.com/tp9sach-ops/luutru (main, GitHub Pages https://tp9sach-ops.github.io/luutru/). Tệp: index.html, style.css, app.js, game.js (Three.js r128 CDN). index.html gọi `game.js?v=6`, `app.js?v=4`, `style.css?v=4` để phá cache.
- Game thay Vòng Quay: bấm ĐUA CỌP, mỗi quà = 1 cọp; cọp đội quà nào về đích thì khách nhận quà đó (tối đa 12 cọp). Máy chủ quyết định quà trúng (spin), game chỉ dàn cảnh.
- Backend dùng chung repo vongquay: Apps Script /exec (CFG.API trong app.js), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4. app.js tương thích cả Apps Script cũ/mới.

## ĐÃ LÀM (phiên này, v6 – 19/11/2026 chiều)
1. CỌP VÀNG THEO ẢNH MẪU (game.js, hàm tiger): thân vàng tươi #ffd21f, mõm + bụng trắng kem, đầu tròn to, tai tròn viền nâu có lòng hồng, mắt to nâu có điểm sáng, má hồng, miệng cười có lưỡi hồng, sọc nâu, tay chân trắng có đệm hồng; khăn quàng đỏ/xanh theo từng cọp. Trang cổng vào (SVG) cũng đổi vàng.
2. ĐƯỜNG ĐUA MỚI (hàm trackMesh): texture vẽ bằng canvas – làn xanh thông / đỏ cherry xen kẽ có độ bóng, mũi tên chạy mờ, kim tuyến, vạch ngăn làn trắng ngà, mép vàng, vạch xuất phát. Thêm 8 cột đèn lồng ấm phía sau.
3. CAMERA (hàm camShot, thuần, đã kiểm bằng tính toán): chạy = góc cao chếch nhẹ nhìn cả hàng cọp; 2,4s cuối = góc cao hơn nhìn rõ quà nào dẫn đầu; người thắng = xoay quanh từ trên cao nhìn cọp + hộp quà. TVC 4s: toàn cảnh bay dọc đường đua -> lao vào cọp giữa vẫy tay (thấy hộp quà) -> lùi lại + chữ Merry Christmas -> đếm 3-2-1 -> đua (đã bỏ cú cắt giật, camera liên tục).
4. Hộp quà trên đầu to hơn 22%, nhãn tên quà nhỏ + cao hơn để đỡ chồng.
5. NHẠC: đã đưa file `alex-morgan-car-car-music-545487.mp3` (nhạc lúc đua, 18,7s lặp) và `nhac-nen.mp3` (nhạc nền, lấy từ repo vongquay) vào GỐC repo. Nhạc nền phát từ lúc chạm cổng; vào TVC dừng nhạc nền; bắt đầu đua ("ĐUA!") thì phát nhạc đua từ đầu; xong đua trở lại nhạc nền.

## ĐÃ KIỂM CHỨNG / CHƯA
- ĐÃ: cú pháp (node --check); chạy thử toàn bộ luồng (cổng -> bấm ĐUA -> TVC -> đếm -> đua -> về đích) với 3, 5, 12 cọp trên three.js GIẢ LẬP (stub) không lỗi; tính toán chiếu hình học cho thấy mọi cọp nằm trong khung ở 3/6/12 cọp, màn ngang 1.6 và dọc 0.62 (riêng 12 cọp màn ngang có 1 điểm lọt khung thoáng qua ở giây 6,75-7,5, đã nới camera sau đó nhưng chưa đo lại).
- CHƯA (môi trường phiên này chặn tải three.js nên KHÔNG render được hình): chưa nhìn hình thật của cọp vàng, đường đua, góc máy; chưa nghe nhạc thật; chưa đo FPS. Việc đầu tiên của phiên sau là xem ảnh/video người dùng gửi rồi chỉnh.

## VIỆC NGƯỜI DÙNG LÀM
- Mở trang bằng tab ẩn danh (thêm ?v=6), chạm cổng, xem TVC + đua trên điện thoại; chụp ảnh/quay màn hình phần chưa đẹp (cọp, đường đua, góc máy) và báo mức giật, nhạc có phát không.
- (Làm sau) Triển khai lại Code.gs mới của vongquay lên link /exec hiện tại.

## CHƯA LÀM / Ý TƯỞNG TIẾP
- Tinh chỉnh cọp/đường đua/góc máy theo ảnh thật người dùng gửi. Ảnh quà (tab AnhQua). Tiếng vó/bước chân thật.
- Nếu nhãn tên quà chồng nhau khi nhiều cọp: thu nhỏ nhãn hoặc chỉ hiện nhãn cọp gần camera.
- Nếu giật trên máy yếu: giảm số bóng đèn (bulbI), số cây, hoặc hạt tuyết 700.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md trước; dùng chung Apps Script + Google Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 của repo tp9sach-ops/vongquay). Nói tiếng Việt, ngắn gọn, thẳng vào việc, làm từng mục một; sửa xong đẩy thẳng lên repo luutru (main) và cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test, nói rõ cái gì đã/chưa kiểm chứng. Việc hiện tại: mình đã xem bản v6 (cọp vàng đội hộp quà, đường đua mới, camera cao chếch, TVC 4s, nhạc nền + nhạc đua đã nằm trong repo). Nhận xét của mình: [DÁN ẢNH/NHẬN XÉT: cổng vào, cọp đội quà, góc máy, màu sắc, độ giật, nhạc]. Hãy chỉnh đúng mục mình nêu.
