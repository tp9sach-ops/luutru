# HANDOFF v33 – Đua Cọp 9 Sạch (repo tp9sach-ops/luutru, backend dùng chung tp9sach-ops/vongquay/Code.gs)

Quy ước: nói tiếng Việt, ngắn gọn, hành động luôn không hỏi lại từng bước, sửa dạng tìm-và-thay, đẩy thẳng main, cuối mỗi phiên gửi handoff mới.

## Bối cảnh Facebook (v31 -> v33)
- Game chạy ở 2 nơi: link GitHub Pages trực tiếp, và khung nhúng (iframe) Google Sites tại baocaonoibo.io.vn/duacop (đây là nơi khách dùng thật).
- v7 (gate.js): đăng nhập FB bằng CHUYỂN TRANG (location.href sang facebook.com/dialog/oauth). Trong iframe Google Sites, Facebook cấm hiện trang đăng nhập bên trong khung -> trang xám/sập. Trên link GitHub, app Facebook trên điện thoại chặn bằng "Sự cố tải" (lỗi phía app FB).
- v31: tắt WebGL trước khi chuyển trang (đoán sai nguyên nhân). v32: tắt hẳn FB (share-fix.js gán CFG.FB_APP_ID=''), chỉ nhập SĐT; Giang báo "lỗi tùm lum" (ảnh chụp, chưa rõ lỗi cụ thể) và nói game vẫn mở được trong Google Sites.
- v33 (phiên này, CHƯA thử trên máy thật): bật lại FB nhưng đăng nhập bằng CỬA SỔ BẬT LÊN `FB.login` (SDK connect.facebook.net). Cửa sổ bật lên là cửa sổ riêng nên không bị cấm khung. Cài trong share-fix.js bằng cách bọc `window.DCclaim`: gọi bản gốc (gate.js) rồi thay onclick của nút #cb; có token thì gọi lại `DCclaim(r,hd,token,'')` để gate.js tự gửi `claim` với `fbt`; lỗi/hủy/bị chặn -> hiện thông báo, khách bấm "Không dùng Facebook? Nhập số điện thoại" (id #cs) vẫn còn. gate.js và index.html KHÔNG đổi (share-fix.js vẫn ?v=3 nên cần chờ cache hoặc dùng tab ẩn danh; nếu cần ép cache thì tăng ?v=3 -> ?v=4 trong index.html).
- Chia sẻ: giữ nguyên v32 (sao chép nội dung + liên kết "Bấm đây để mở Facebook" mở tab mới, url chia sẻ = document.referrer tức trang Google Sites).

## Điều kiện phía Facebook (Giang tự kiểm tra ở developers.facebook.com, app ID 1783896373169535)
1. App ở chế độ Live (không phải Development).
2. Facebook Login > Settings: bật "Login with the JavaScript SDK", thêm vào "Allowed Domains for the JavaScript SDK": https://tp9sach-ops.github.io
3. Settings > Basic > App Domains: tp9sach-ops.github.io; quyền chỉ cần public_profile (không cần duyệt).

## Backend (không đổi)
Code.gs `claim`: có `fbt` thì hỏi graph.facebook.com/me xác minh, ghi cột SDT dạng "FB:<uid>"; không có thì cần sdt 10 số + hd + tok. Chỉ thử lại claim khi lỗi mạng, không thử lại race.

## Cần Giang xác nhận
- Mở baocaonoibo.io.vn/duacop bằng tab ẩn danh, đua 1 hóa đơn mới, bấm ĐĂNG NHẬP FACEBOOK: có hiện cửa sổ Facebook riêng không, đăng nhập xong có hiện "Đã ghi nhận quà" không.
- Nếu lỗi: chụp màn hình đúng thông báo đỏ và ghi rõ (a) không hiện cửa sổ, (b) cửa sổ hiện nhưng game không nhận, (c) báo lỗi từ máy chủ.
- Lỗi "tùm lum" của v32 (nhập SĐT): chưa rõ nội dung, cần ảnh chụp thông báo lỗi.

## Việc tiếp theo nếu cửa sổ bị chặn
- Google Sites có thể đặt sandbox cho khung nhúng không cho popup -> không thể đăng nhập FB trong khung. Khi đó dùng phương án an toàn: chỉ SĐT + chia sẻ (thêm dòng gán CFG.FB_APP_ID='' lên đầu share-fix.js), hoặc chuyển game sang tên miền riêng không nhúng.
