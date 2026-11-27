# HANDOFF v38 – Gom admin / thống kê / QR / poster về luutru (Đua Cọp 9 Sạch)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, làm từng phần; sửa code dạng tìm-và-thay (đoạn "tìm" đầy đủ + code thay đầy đủ) hoặc đẩy thẳng lên repo.
- Sau MỖI phiên làm việc luôn gửi prompt bàn giao chi tiết (.md) để phiên sau (không biết gì) vẫn làm đúng; luôn luôn như vậy.
- Điều tra bằng bằng chứng trước khi sửa; nói rõ cái gì đã kiểm chứng, cái gì chưa; không bịa kết quả test.

## YÊU CẦU CỦA GIANG
Gom toàn bộ admin / quản lý / thống kê về repo luutru, KHÔNG ảnh hưởng game đua cọp. Trang `/admin` hiển thị QR + link chính xác của từng cửa hàng theo tên miền Vercel; admin & thống kê cũng hiển thị link Vercel. Poster A5: dùng ảnh Giang gửi (THÊM 1K - ĐUA NGAY NHẬN QUÀ), thay QR bằng QR riêng từng cửa hàng, chèn TÊN cửa hàng dưới chữ "THÊM 1K – ĐUA NGAY NHẬN QUÀ".

## ĐÃ LÀM (chỉ THÊM file mới trong thư mục `admin/`, không sửa file nào của game)
- `admin/index.html`, `admin/admin.css`, `admin/admin.js` → https://tp9sach-ops.github.io/luutru/admin/ và https://duacop.vercel.app/admin/
- Dùng CHUNG backend Apps Script (cùng URL /exec trong app.js; KHÔNG sửa Code.gs). Các lệnh gọi: login, pending, hist, adminAll, storeLinks, resetKey, savePrize, delPrize, saveImg, saveStore, saveCfg, confirm.
- Các mục: 🎁 Trao thưởng, 📊 Thống kê (tính từ `hist`, tối đa 500 lượt mới nhất; lọc ngày, KPI, theo cửa hàng/quà/ngày, kho quà, tải CSV), 📱 QR & Poster, 🎄 Quà tặng, 🖼️ Ảnh quà, 🏬 Cửa hàng, ⚙️ Cài đặt.
- Link tạo ra (tên miền mặc định `https://duacop.vercel.app`, đổi được trong mục QR, lưu localStorage `dc_base`):
  - Khách: `https://duacop.vercel.app/?ch=<encodeURIComponent(tên cửa hàng)>` (khớp đúng mẫu Giang đưa).
  - Admin cửa hàng: `https://duacop.vercel.app/admin/#ch=<tên>&k=<mã cửa hàng>`.
  - Admin tổng: `https://duacop.vercel.app/admin/`; Thống kê tổng hợp: `https://duacop.vercel.app/admin/#thong-ke`. Nếu sheet CauHinh có MaTong thì thêm `#mk=<mã>&t=thong-ke`.
  - Hash hỗ trợ: #trao-thuong #thong-ke #qr #qua-tang #anh-qua #cua-hang #cai-dat.
- Poster A5: canvas, nền `admin/poster-base.jpg` (1748x2472, đã xóa QR cũ, khung trắng chừa chỗ), vẽ QR cửa hàng tại (1741,2857) cỡ 410 và nhãn xanh tên cửa hàng tâm (1240,1085) — toạ độ theo ảnh gốc 2480x3508. Font FiraSans-Black lấy từ https://tp9sach-ops.github.io/vongquay/FiraSans-Black.ttf. Có xem trước, in A5/lưu PDF, tải ảnh, in tất cả cửa hàng.

## ĐÃ KIỂM CHỨNG
- node --check admin.js OK; chạy jsdom với backend giả: quản lý thấy đủ 7 mục, admin cửa hàng thấy 4 mục, mục Thống kê đếm đúng, mục QR tạo đúng link khách/admin/tổng/thống kê, không lỗi JS. File trên GitHub so khớp byte-by-byte với bản đã test.
- Vị trí QR và khung trắng đo từ ảnh gốc, đã xem lại ảnh nền sau khi xóa QR.

## CHƯA KIỂM CHỨNG / CẦN LÀM
- CHƯA chạy trên trình duyệt/điện thoại thật; CHƯA thử Apps Script thật; CHƯA xem poster dựng xong bằng mắt (cần mở mục QR & Poster, bấm Poster A5).
- `admin/poster-base.jpg` là file ảnh nhị phân: công cụ đẩy GitHub của phiên làm việc chỉ đẩy được văn bản → Giang cần tự tải file này vào thư mục admin của repo luutru (Add file → Upload files). Chưa có file thì mục Poster báo thiếu ảnh nền, các mục còn lại vẫn chạy.
- Kiểm tra Vercel đã tự deploy /admin/ chưa (project duacop).

## RỦI RO BẢO MẬT
- Link API công khai; khi CauHinh chưa có khóa MaTong, ai mở /admin/ cũng có quyền quản lý tổng. Nên đặt MaTong (hàng Khoa=MaTong trong CauHinh) rồi dùng link có #mk=.
- Link admin cửa hàng chứa mã bí mật: chỉ gửi cho nhân viên.

## PROMPT CHO PHIÊN SAU
Mình làm game Đua Cọp 9 Sạch (repo tp9sach-ops/luutru; backend ở tp9sach-ops/vongquay; Vercel duacop.vercel.app). Đọc HANDOFF-v38.md. Việc: mở /admin/ trên điện thoại thật, kiểm tra mục Thống kê, QR & Poster (poster-base.jpg đã tải lên chưa, tên cửa hàng + QR có đúng chỗ), link khách /?ch= quét ra đúng cửa hàng. Nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay; cuối mỗi câu trả lời gửi handoff .md cập nhật.
