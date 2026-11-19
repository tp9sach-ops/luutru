# HANDOFF – Đua Cọp May Mắn 9 Sạch (cập nhật 19/11/2026)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, thẳng vào việc; làm TỪNG MỤC MỘT, xong mỗi mục viết prompt bàn giao.
- Mỗi phiên làm việc phải kết thúc bằng một prompt bàn giao chi tiết cho phiên sau (phiên sau không có memory, không biết gì vẫn làm đúng).
- Giao file hoàn chỉnh (dán là chạy) hoặc đẩy thẳng lên repo; không đưa đoạn code rời rạc.
- Luôn điều tra bằng bằng chứng trước khi sửa (đọc repo + dữ liệu Sheet); không bịa kết quả test; nói rõ cái gì đã kiểm chứng, cái gì chưa.

## BỐI CẢNH
- Repo game: https://github.com/tp9sach-ops/luutru (nhánh main, GitHub Pages: https://tp9sach-ops.github.io/luutru/). Tệp ở thư mục gốc: index.html, style.css, app.js, game.js (Three.js r128 qua CDN).
- Game thay Vòng Quay: bấm ĐUA CỌP, mỗi món quà = 1 cọp đeo sừng hưu kéo quà chạy; cọp kéo quà nào về đích thì khách nhận quà đó. Tối đa 12 cọp. Máy chủ quyết định quà trúng (lệnh spin), game chỉ dàn cảnh.
- Backend dùng chung với repo vongquay: Google Apps Script /exec (CFG.API trong app.js), Google Sheet "Vòng quay may mắn" (ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4). Tab: Admin, CuaHang, GiaiThuong, KhachQuay, CauHinh.
- Dữ liệu Sheet (file Excel người dùng gửi 19/11): 10 cửa hàng, tên khớp tuyệt đối giữa CuaHang và GiaiThuong. 49 Hàng Bài có 8 quà; 9 cửa hàng còn lại mỗi nơi 1 quà (Voucher giảm 20K) -> chỉ 1 cọp.

## LỖI "CỬA HÀNG NÀY TẠM HẾT QUÀ" – ĐÃ ĐIỀU TRA & SỬA
- Bằng chứng: ảnh lỗi hiện `nhóm quà=0, prizes=[{id..},...]` = Apps Script đang triển khai là BẢN CŨ: lệnh `pub` trả quà của MỘT cửa hàng dạng MẢNG (theo tham số `store`, khớp tên tuyệt đối), không gom theo cửa hàng như Code.gs mới trong repo vongquay. Dữ liệu Sheet không sai.
- Đã sửa app.js: nhận cả 2 kiểu máy chủ (cũ: hỏi riêng từng cửa hàng; mới: object theo cửa hàng). Thêm: thử lại tối đa 2 lần khi lỗi mạng (chỉ lệnh pub, KHÔNG thử lại spin); cửa hàng hỏi lỗi mạng được đánh dấu `unk` (chưa biết) chứ không báo hết quà, game.js tự tải lại riêng cửa hàng đó khi được chọn; đổi khóa cache localStorage sang `dc_pub2` (bỏ dữ liệu cũ sai định dạng); dòng "Chẩn đoán" chỉ hiện khi mở trang với `?debug=1`.
- ĐÃ KIỂM CHỨNG (mô phỏng bằng Node, dữ liệu từ file Excel, máy chủ cũ/mới giả lập): mạng ổn -> 49 Hàng Bài 8 cọp, 9 cửa hàng kia 1 cọp, không cửa hàng nào bị báo hết quà; lỗi mạng 40%/95%/100% -> không báo hết quà nhầm; chọn cửa hàng chưa biết -> tự tải lại và hiện đúng số cọp; máy chủ bỏ qua tham số store -> không gán nhầm quà.
- CHƯA KIỂM CHỨNG: chưa gọi được Apps Script thật (môi trường không truy cập script.google.com); chưa chạy trên trình duyệt/điện thoại thật; chưa thấy hình 3D render thật (Three.js chỉ được giả lập khi test).

## VIỆC NGƯỜI DÙNG LÀM
1. Mở https://tp9sach-ops.github.io/luutru/ bằng tab ẩn danh (hoặc thêm ?v=2), chọn lần lượt 49 Hàng Bài và 1 cửa hàng chỉ có 1 quà; nếu còn lỗi thì chụp ảnh và mở thêm `?debug=1` rồi chụp lại.
2. (Khuyến nghị, làm sau) Triển khai lại Code.gs MỚI của repo vongquay lên đúng link /exec hiện tại (Triển khai -> Quản lý triển khai -> bút chì -> Phiên bản mới -> Triển khai; KHÔNG tạo triển khai mới để giữ nguyên link). Khi đó `pub` trả gọn 1 lần, nhanh hơn 10 lượt gọi. app.js đã tương thích cả hai.

## CHƯA LÀM / Ý TƯỞNG TIẾP
- Cửa hàng chỉ có 1 quà thì cuộc đua chỉ có 1 cọp (không còn tính "đua"); cân nhắc có thêm quà hoặc chế độ hiển thị riêng cho trường hợp 1 quà.
- Đối chiếu ngoại hình cọp với 4 ảnh mẫu (cọp 3D chibi: đầu tròn to, tai tròn viền nâu đậm, bụng kem, sọc đen, đuôi sọc) và tinh chỉnh tiếp nếu người dùng muốn giống hơn.
- Chưa có nhạc/âm thanh thật (hiện chỉ bíp bằng WebAudio); chưa có ảnh quà (tab AnhQua).

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md trước; dùng chung Apps Script + Google Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 của repo tp9sach-ops/vongquay). Nói tiếng Việt, ngắn gọn, thẳng vào việc, làm từng mục một; sửa xong thì đẩy thẳng lên repo luutru (nhánh main) và cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test, nói rõ cái gì đã/chưa kiểm chứng. Việc hiện tại: mình đã mở lại trang sau bản sửa lỗi "tạm hết quà" (app.js hỗ trợ máy chủ cũ, thử lại khi lỗi mạng, cache dc_pub2). Kết quả mình báo: [DÁN KẾT QUẢ / ẢNH LỖI + TÊN CỬA HÀNG + GIỜ]. Hãy kiểm tra và xử lý tiếp theo đúng mục mình nêu.
