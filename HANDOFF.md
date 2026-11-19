# HANDOFF – Đua Cọp May Mắn 9 Sạch (cập nhật 19/11/2026, bản Noel + TVC)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, thẳng vào việc; làm TỪNG MỤC MỘT, xong mỗi mục viết prompt bàn giao.
- Mỗi phiên làm việc phải kết thúc bằng một prompt bàn giao chi tiết cho phiên sau (phiên sau không có memory, không biết gì vẫn làm đúng).
- Giao file hoàn chỉnh (dán là chạy) hoặc đẩy thẳng lên repo; không đưa đoạn code rời rạc.
- Luôn điều tra bằng bằng chứng trước khi sửa; không bịa kết quả test; nói rõ cái gì đã kiểm chứng, cái gì chưa.

## BỐI CẢNH
- Repo: https://github.com/tp9sach-ops/luutru (main, GitHub Pages https://tp9sach-ops.github.io/luutru/). Tệp gốc: index.html, style.css, app.js, game.js (Three.js r128 CDN).
- Game thay Vòng Quay: bấm ĐUA CỌP, mỗi quà = 1 cọp đeo sừng hưu kéo hộp quà; cọp kéo quà nào về đích thì khách nhận quà đó (tối đa 12 cọp). Máy chủ quyết định quà trúng (spin), game chỉ dàn cảnh.
- Backend dùng chung repo vongquay: Apps Script /exec (CFG.API trong app.js), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4. Hiện Apps Script là BẢN CŨ (pub trả mảng quà 1 cửa hàng); app.js đã tương thích cả cũ/mới, thử lại khi lỗi mạng, cache dc_pub2.
- Dữ liệu: 10 cửa hàng; 49 Hàng Bài 8 quà; 9 cửa hàng còn lại mỗi nơi 1 quà (-> 1 cọp).

## ĐÃ LÀM (phiên này)
1. Sửa lỗi "tạm hết quà" (xem app.js: fixPub/pubTry/storePrizes; trạng thái unk).
2. Làm lại cảnh Noel trong game.js: nền xanh thông + trăng + đồi tuyết xa; tuyết rơi (Points); đường đua làn đỏ/xanh xen kẽ, vạch trắng; đèn nhấp nháy màu dọc 2 mép; 2 hàng cây thông (3 tầng, mũ tuyết, sao vàng, bóng đèn); cổng đích cột sọc kẹo + xà đỏ viền vàng + dây đèn; cọp to hơn, khăn đỏ/xanh theo làn + chuông vàng, sừng hưu vàng nâu to hơn có bi đỏ; xe trượt đỏ viền vàng, hộp quà đỏ/xanh luân phiên, nơ + ruy băng vàng/trắng; ánh sáng ấm.
3. Camera thấp hơn, gần hơn, hơi lắc nhẹ (hàm cam()).
4. TVC mở đầu 4 giây khi bấm ĐUA CỌP (hàm intro()/cam()): 0-1.5s toàn cảnh đường đua lướt qua; 1.5-2.6s cận cọp giữa làn đang vẫy tay; 2.6-4.0s chữ "Merry Christmas" vàng bật lên (có chime) + camera lùi về vị trí xuất phát, có 2 dải đen điện ảnh; sau đó đếm 3-2-1-ĐUA rồi đua. Lệnh spin gọi song song trong lúc TVC. Lỗi spin -> reset() tắt TVC.
- ĐÃ KIỂM CHỨNG (Node, Three.js giả lập): cú pháp; chuỗi bấm ĐUA -> TVC 4,0s -> đếm 3/2/1/ĐUA đúng nhịp -> đua -> hiện quà (Vòng đeo tay) ở ~17,6s; 808 khung hình vẽ không lỗi; 8 cọp dựng ~1209 mesh.
- CHƯA KIỂM CHỨNG: chưa nhìn hình render thật (màu, góc máy, chữ Merry Christmas, font); chưa đo FPS trên điện thoại (1209 mesh/8 cọp, 12 cọp nặng hơn -> nếu giật: giảm bóng đèn/cây hàng sau, hoặc dùng InstancedMesh); chưa gọi Apps Script thật.

## VIỆC NGƯỜI DÙNG LÀM
- Mở trang bằng tab ẩn danh (thêm ?v=3), xem TVC + cuộc đua trên điện thoại; chụp ảnh/quay màn hình phần chưa đẹp (góc máy, màu, cọp, quà, cây thông) và báo mức giật.
- (Làm sau) Triển khai lại Code.gs mới của vongquay lên link /exec hiện tại (Quản lý triển khai -> Phiên bản mới).

## CHƯA LÀM / Ý TƯỞNG TIẾP
- Tinh chỉnh ngoại hình cọp theo 4 ảnh mẫu (chibi 3D: đầu tròn to, tai tròn viền nâu, bụng kem).
- Nhạc nền Noel + tiếng vó thật (hiện bíp WebAudio). Ảnh quà (tab AnhQua). TVC cũng chạy lúc mới vào trang nếu muốn (hiện chỉ khi bấm ĐUA).
- Cửa hàng chỉ 1 quà -> 1 cọp.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md trước; dùng chung Apps Script + Google Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 của repo tp9sach-ops/vongquay). Nói tiếng Việt, ngắn gọn, thẳng vào việc, làm từng mục một; sửa xong đẩy thẳng lên repo luutru (main) và cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test, nói rõ cái gì đã/chưa kiểm chứng. Việc hiện tại: mình đã xem bản Noel + TVC 4s (game.js). Nhận xét của mình: [DÁN ẢNH/NHẬN XÉT: góc máy, cọp, quà, cây thông, màu sắc, độ giật]. Hãy chỉnh đúng mục mình nêu.
