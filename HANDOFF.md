# HANDOFF – Đua Cọp May Mắn 9 Sạch (cập nhật 19/11/2026, bản v5: trang cổng vào + cọp đội hộp quà)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, thẳng vào việc; làm TỪNG MỤC MỘT, xong mỗi mục viết prompt bàn giao.
- Mỗi phiên làm việc phải kết thúc bằng một prompt bàn giao chi tiết cho phiên sau (phiên sau không có memory, không biết gì vẫn làm đúng).
- Giao file hoàn chỉnh (dán là chạy) hoặc đẩy thẳng lên repo; không đưa đoạn code rời rạc.
- Luôn điều tra bằng bằng chứng trước khi sửa; không bịa kết quả test; nói rõ cái gì đã kiểm chứng, cái gì chưa.

## BỐI CẢNH
- Repo: https://github.com/tp9sach-ops/luutru (main, GitHub Pages https://tp9sach-ops.github.io/luutru/). Tệp: index.html, style.css, app.js, game.js (Three.js r128 CDN). index.html gọi `game.js?v=5`, `app.js?v=4`, `style.css?v=4` để phá cache.
- Game thay Vòng Quay: bấm ĐUA CỌP, mỗi quà = 1 cọp; cọp đội quà nào về đích thì khách nhận quà đó (tối đa 12 cọp). Máy chủ quyết định quà trúng (spin), game chỉ dàn cảnh.
- Backend dùng chung repo vongquay: Apps Script /exec (CFG.API trong app.js), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4. app.js tương thích cả Apps Script cũ/mới.

## ĐÃ LÀM (phiên này, v5)
1. TRANG CỔNG VÀO (index.html, #gate): mở trang là hiện màn hình xanh đêm có cọp đội hộp quà (SVG), chữ ĐUA CỌP / Merry Christmas, nút "Chạm để vào · Bật nhạc" giống trang vongquay. Chạm là gọi `window.dcEnter()` (định nghĩa trong game.js/auInit) -> mở khóa âm thanh + phát nhạc nền ngay, cổng mờ dần rồi biến mất, vào trang chính nhạc đã chạy. Nếu chạm trước khi game.js tải xong thì cờ `window.__gate=1` làm game.js tự gọi dcEnter lúc khởi tạo.
2. CỌP ĐỘI HỘP QUÀ TRÊN ĐẦU (game.js): bỏ xe trượt, dây kéo và sừng hưu; hộp quà (7 màu xoay vòng, nơ + ruy băng, quầng sáng) gắn vào nhóm đầu cọp nên lắc theo nhịp chạy; hai tay dang ra giữ thăng bằng; nhãn tên quà nổi phía trên hộp. Ở TVC, cọp giữa vẫy tay bằng cách nâng tay cao hơn.
3. Camera cận (TVC 1,6-4s) và vòng quay quanh cọp thắng được nâng cao lên để thấy cả hộp quà trên đầu.
4. Nhạc nền có dự phòng: thử `nhac-nen.mp3` cùng thư mục; nếu lỗi/không có file thì tự chuyển sang https://tp9sach-ops.github.io/vongquay/nhac-nen.mp3 (cùng file, 940.402 byte).
5. Chữ giao diện đổi từ "kéo quà" sang "đội quà".

## ĐÃ KIỂM CHỨNG / CHƯA
- ĐÃ (Node + three r128 thật, giả lập DOM/WebGL/Audio): game.js trên GitHub (commit dcf6d10) khớp bản đã test (chỉ khác 1 dòng chú thích); cú pháp OK; chạy đủ chuỗi chạm cổng -> nhạc nền -> bấm ĐUA -> TVC -> đếm 3/2/1 -> đua -> hiện quà với 1, 8, 12 cọp và màn dọc 390x500, không lỗi; thứ tự âm thanh nhạc nền -> nhạc đua -> nhạc nền đúng; thiếu file mp3 cục bộ thì nhạc nền vẫn phát qua link dự phòng; index.html trên GitHub hiển thị đúng tiếng Việt.
- CHƯA: chưa nhìn hình render thật (hộp quà có che tai/đầu không, tay dang có đẹp không, nhãn tên quà có chồng nhau khi 12 cọp, màu cổng vào); chưa nghe nhạc thật trên điện thoại; chưa đo FPS; chưa gọi Apps Script thật.

## VIỆC NGƯỜI DÙNG LÀM
- BẮT BUỘC: tải file `alex-morgan-car-car-music-545487.mp3` (nhạc lúc đua) lên GỐC repo luutru (Add file -> Upload files), đúng tên đó. AI không đẩy được file nhị phân qua công cụ nên chưa có; thiếu file này thì lúc đua chỉ còn tiếng bíp, nhạc nền không bị ảnh hưởng. (Tùy chọn: tải thêm `nhac-nen.mp3` vào luutru để không phụ thuộc repo vongquay.)
- Mở trang bằng tab ẩn danh (thêm ?v=5), chạm cổng, xem TVC + đua trên điện thoại; chụp ảnh/quay màn hình phần chưa đẹp và báo mức giật.
- (Làm sau) Triển khai lại Code.gs mới của vongquay lên link /exec hiện tại.

## CHƯA LÀM / Ý TƯỞNG TIẾP
- Tinh chỉnh ngoại hình cọp theo ảnh mẫu (chibi 3D: đầu tròn to, tai tròn viền nâu, bụng kem). Ảnh quà (tab AnhQua). Tiếng vó/bước chân thật.
- Nếu nhãn tên quà chồng nhau khi nhiều cọp: thu nhỏ nhãn hoặc chỉ hiện nhãn cọp gần camera.
- Nếu giật trên máy yếu: giảm số bóng đèn (bulbI), số cây, hoặc hạt tuyết 700.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md trước; dùng chung Apps Script + Google Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 của repo tp9sach-ops/vongquay). Nói tiếng Việt, ngắn gọn, thẳng vào việc, làm từng mục một; sửa xong đẩy thẳng lên repo luutru (main) và cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test, nói rõ cái gì đã/chưa kiểm chứng. Việc hiện tại: mình đã xem bản v5 (trang cổng vào chạm để bật nhạc, cọp đội hộp quà trên đầu, TVC 4s, nhạc). Nhận xét của mình: [DÁN ẢNH/NHẬN XÉT: cổng vào, cọp đội quà, góc máy, màu sắc, độ giật, nhạc]. Hãy chỉnh đúng mục mình nêu.
