# HANDOFF v35 – Đua Cọp 9 Sạch (luutru) + admin theo cửa hàng (vongquay)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- nói tiếng Việt, ngắn gọn; sửa code dạng TÌM → THAY đầy đủ (không viết tắt); làm từng phiên
- sau MỖI phiên luôn gửi prompt bàn giao chi tiết (.md) để phiên sau không biết gì vẫn làm đúng
- điều tra bằng bằng chứng, không đoán; nói rõ cái gì đã kiểm chứng, cái gì chưa

## YÊU CẦU CỦA GIANG (phiên này)
1. Cuộc đua tổng thể ~45 giây cho khách đỡ mất thời gian.
2. Mỗi cửa hàng: 1 trang admin riêng + 1 trang đua cọp riêng. Trang admin tạo 2 QR: khách quét → vào đúng trang đua cọp cửa hàng đó; nhân viên quét → vào đúng admin cửa hàng đó, thấy quà, nhập số lượng, tỷ lệ, kiểm soát trao thưởng.

## ĐÃ ĐIỀU TRA
- Repo luutru: game 3D (index.html, game.js bị loader.js vá lúc chạy). Backend + admin dùng chung repo vongquay (Code.gs, admin.html), cùng Google Sheet.
- Thời gian hiện tại (TÍNH TỪ CODE, chưa đo máy thật): mở đầu 4 s + đếm ngược ~2,9 s + đua DUR=22 s (+0,2–2,5 s cọp cuối về) + replay chậm 5,5 s + bục ~5,6 s ≈ 41–43 s từ lúc bấm VÀO ĐUA tới bảng chúc mừng. Hằng số: loader.js (`DUR=22`), finale.js (`REP`, +5.6), game.js `intro()` (4000 ms).
- Admin cũ đã có: Trao thưởng (xác nhận → trừ kho), Quà tặng (tỷ lệ, số lượng, bật/tắt), thông báo có người trúng.

## ĐÃ LÀM – ĐÃ ĐẨY LÊN GITHUB (nhánh main, 25/11/2026), CHƯA thử trên máy thật, CHƯA triển khai Apps Script
- vongquay/Code.gs: mã riêng mỗi cửa hàng (cột `Ma` tab CuaHang), `auth` nhận `au:{ch,k}` → admin cửa hàng chỉ thấy/sửa cửa hàng mình (savePrize/delPrize/adminAll/hist/pending/confirm), API `storeLinks`, `resetKey` (quản lý tổng), tùy chọn khóa admin tổng bằng dòng CauHinh `MaTong`.
- vongquay/admin.html: vào bằng `#ch=<tên>&k=<mã>`; tab mới 📱 QR cửa hàng (2 QR + tải ảnh); admin cửa hàng ẩn tab Cửa hàng/Ảnh/Cài đặt, khóa ô chọn cửa hàng.
- luutru/gate.js (+ index.html đổi `gate.js?v=12`): link `?ch=<tên>` khóa cửa hàng (ẩn ô chọn, hết quà thì báo, không chuyển cửa hàng khác). Đã sửa lỗi trùng tên biến `lt` (nay là `lkt`) trước khi đẩy.
- Đã kiểm chứng: cú pháp 3 file; file trên GitHub khớp bản gốc (Code.gs, admin.html); máy chủ giả: khóa sai/khóa cửa hàng khác bị chặn, admin A không sửa được quà B, không gọi được saveStore/storeLinks, đổi mã vô hiệu mã cũ, MaTong hoạt động.

## VIỆC NGƯỜI DÙNG PHẢI LÀM
1. Apps Script: dán Code.gs mới (hoặc áp bản vá) → Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai (đừng tạo triển khai mới để link /exec không đổi).
2. Mở admin.html → tab 📱 QR cửa hàng → chọn cửa hàng → in 2 QR; thử quét bằng điện thoại.
3. (Nên) thêm dòng CauHinh `MaTong` = mã bí mật để khóa admin tổng; sau đó vào `admin.html#mk=<mã>`.

## CHƯA LÀM / RỦI RO
- Chưa đo thời gian thật; nếu đo >45 s: giảm `DUR` trong loader.js (mỗi 1 s DUR = 1 s tổng) hoặc rút `intro` 4000→2500 ms.
- QR khách mặc định trỏ GitHub Pages trực tiếp vì Google Sites (baocaonoibo.io.vn/duacop) KHÔNG chuyển `?ch=` vào khung nhúng. Cần kiểm tra đăng nhập/chia sẻ Facebook (FB_APP_ID, redirect) có chạy trên tên miền github.io không. Đổi gốc link: localStorage `vq_game` trong admin.
- Khóa phía khách chỉ là giao diện; máy chủ vẫn nhận bất kỳ cửa hàng nào trong `race`.
- Nếu chưa thêm `MaTong`, API vẫn mở quyền quản lý tổng cho SĐT/tên rỗng.
- Sau khi Facebook đăng nhập quay lại, trang mở không còn `?ch=` (redirect_uri không kèm query) – không ảnh hưởng bước nhận quà nhưng chưa kiểm trên máy thật.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game Đua Cọp 9 Sạch (repo tp9sach-ops/luutru, backend/admin ở repo tp9sach-ops/vongquay). Đọc HANDOFF-v35.md. Bản vá v35 đã đẩy lên main. Mình không rành kỹ thuật: nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay. Việc: (1) hướng dẫn triển khai lại Apps Script, thử QR khách + QR admin trên điện thoại thật; (2) đo thời gian đua thực tế, chỉnh về ~45 s; (3) kiểm tra Facebook login/chia sẻ khi link khách là GitHub Pages. Cuối mỗi câu trả lời gửi handoff .md cập nhật.
