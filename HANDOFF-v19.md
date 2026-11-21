# HANDOFF v19 – Đua Cọp 9 Sạch (repo tp9sach-ops/luutru)

Commit mới nhất: c93faef (main). Nói tiếng Việt, ngắn gọn, sửa dạng tìm-và-thay, đẩy thẳng lên main, cuối mỗi câu trả lời gửi handoff .md mới.

## Đã làm (đã đẩy, đã kiểm cú pháp, CHƯA xem trên máy thật)
1. Cọp giữa hết vẫy: ép cache bằng cách tăng `patches-fall.js?v=1 -> v=2` (loader.js) và `loader.js?v=7 -> v=8` (index.html). Nguyên nhân khả dĩ nhất: trình duyệt còn giữ file cũ. Điều kiện vẫy chỉ 2,3 giây đầu intro (`performance.now()-introT0<2300`) vẫn nằm ở tham số `mid` trong patches-fall.js.
2. Nhịp đua kịch tính hơn: `TIGER_PACE` amp .22 -> .26, burst .18 -> .2 (patches-fall.js).
3. Bình luận chữ trực tiếp (hàm `cmt`, chèn vào relab, gọi từ `cmt(rt,n)`): "Xuất phát!", "Cọp X vượt lên dẫn đầu!", "Ối! Cọp X vấp ngã!", "Nước rút cuối!", "Cọp X về nhất!". Chip nổi ở 7% phía trên sân khấu.
4. Hiệu ứng về đích: chớp sáng trắng toàn sân khấu (opacity .85 rồi mờ dần .7s) cùng bình luận "về nhất".
5. Giãn nhãn quà (từ v17): hiện đủ mọi nhãn, đẩy lên bằng sprite.center.y, tối đa 7 lần chiều cao nhãn.

Đã test logic bình luận bằng node (cmtest.js, giả lập): thứ tự câu đúng. Chưa chạy được cảnh đua thật (máy ảo vẽ 3D phần mềm rất chậm).

## Chưa làm
- Cảnh về đích quay chậm (slow-mo).
- Chưa xác nhận trên máy thật: cọp giữa đã vào thế chuẩn bị chưa; nhãn còn chồng/xếp quá cao không; chữ bình luận có che đồ vật không; bình luận có trùng với đoạn đếm ngược/chữ khác không.

## Giang làm bây giờ
- Đóng hẳn tab, mở lại (hoặc xóa cache). Thêm `?debug=1` vào link: góc dưới trái phải hiện "patch N/N" không có "hụt". Nếu có "hụt: N..." thì chụp gửi lại.
- Đua vài ván, ghi nhận 4 điểm: cọp giữa, nhãn, chữ bình luận, chớp sáng cuối.

## Việc tiếp theo
[DÁN NHẬN XÉT CỦA GIANG]. Sau đó: cảnh về đích quay chậm (giảm timeScale đoạn cuối); chỉnh vị trí/cỡ chữ bình luận nếu cần; nếu cọp giữa vẫn vẫy thì xem lại `introT0` có được gán trước khi dựng cọp không.

## Ghi chú kỹ thuật
- Vá chạy lúc tải: loader.js nối `window.P22` (patches.js) và `window.P23` (patches-fall.js) vào game.js bằng find-and-replace; vá mới lỗi cú pháp thì tự quay về vá cũ.
- Tên biến: `PC` đã dùng trong game.js nên cấu hình nhịp là `TPC`.
- Khi thêm vá mới: thêm mục vào mảng P23, tăng `?v=` của patches-fall.js trong loader.js và loader.js trong index.html.


## v19 (phiên sau)
- Cọp giữa vẫn vẫy dù v18 -> sửa tận gốc: tiger/tiger-runtime.js tắt nhánh vẫy (`if (false && st === 'intro' && ctx.mid)`), cọp giữa vào thế sẵn sàng như các cọp khác. Ép cache: tiger-runtime.js?v=2, patches-fall.js?v=4, loader.js?v=9 (index.html).
- Quay chậm về đích: mục vá mới ở cuối P23 (kéo plan.t0 để rt chạy 0,45x trong DUR-1,8..DUR+0,4). Cấu hình `window.SLOWMO={a:1.8,b:.4,s:.45}` đầu patches-fall.js.
- Chưa xem máy thật. Cần Giang xác nhận: cọp giữa đứng thế chuẩn bị chưa; quay chậm có mượt/đúng lúc không; chữ "về nhất" và chớp sáng có khớp lúc chậm không.
