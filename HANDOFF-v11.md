# HANDOFF v11 – 20/11/2026 (loader v15)

## KIẾN TRÚC (không đổi)
index.html -> app.js -> loader.js. loader tải game.js?v=13, áp mảng P (find-and-replace theo thứ tự), rồi chạy. ?debug=1 hiện `patch ok/tổng` + vá hụt. ?classic=1 = bản gốc.

## ĐÃ LÀM (v15): DỰNG LẠI CỌP THEO ẢNH MẪU 9 SẠCH
- Hàm `tiger()` mới nằm trong mảng P của loader.js (thay `function tiger(col){`; hàm cũ giữ dưới tên `tigerOld`, không dùng).
- Theo ảnh mẫu: đầu to chibi (~50% chiều cao), tai tròn lòng hồng viền sọc đen, mắt to đen bóng 2 điểm sáng, mõm + cằm trắng, má hồng, mũi hồng, miệng mở lưỡi hồng, 3 sọc má mỗi bên, sọc ngang + sọc dọc sau đầu, nhúm tóc đen; áo vàng sọc đen tay dang ra, găng trắng; yếm xanh lá có huy hiệu 9 SẠCH (texture logo thật từ v14); ống chân vàng sọc đen, giày trắng; đuôi vàng khoang đen cuộn ra sau, chóp đen.
- Không có khăn/vòng cổ/mũ Noel (ảnh mẫu không có). Cọp khác nhau chỉ phân biệt bằng hộp quà màu khác nhau và nhãn tên.
- Mỗi bộ phận (đầu, từng tay, từng chân, đuôi, thân) được gộp mesh theo vật liệu: khoảng 30 mesh/cọp, ~38k tam giác/cọp.
- Chỉnh pose trong game: tay dang ra (rotation.x ±.95, `base=.12+.75*k`), vẫy tay lúc intro; hộp quà đặt ở phía sau đỉnh đầu (`tg.bx`, `tg.top`) để chừa chỗ cho tóc.
- Gỡ các vá cọp cũ (YL, mắt, mũ, khăn, logo bụng...). Vá logo cổng/biển/texture logo (v14) giữ nguyên.

## ĐÃ KIỂM / CHƯA
- ĐÃ: node --check loader; áp thử 48/48 vá lên game.js (sha 139d2a4…) không hụt, game đã vá qua node --check; chạy hàm tiger() mới + bước gộp mesh trong bộ giả lập three tối giản và vẽ ảnh 4 góc (trước/45/ngang/sau), tư thế đứng và chạy.
- CHƯA: chưa chạy bằng three.js thật + WebGL thật (môi trường không tải được three). Ảnh xem thử chỉ là bộ vẽ phần mềm tô bóng phẳng, màu có thể khác trên màn hình thật (game dùng tone mapping ACES + emissive). Cần xem: màu vàng có đúng mẫu không (đang 0xf9cb1c), hộp quà có che mặt/tóc không, tay có chạm cọp làn bên cạnh không (cọp scale 1.18, LS=2.7), đuôi có xuyên thân khi chạy không, mắt/tóc khi camera ở xa.
- Lưu ý: index.html vẫn gọi loader.js?v=1 -> mở tab ẩn danh hoặc đợi ~10 phút cache GitHub Pages.

## CHƯA LÀM
1. Cổng vào (SVG phẳng ở index.html) vẫn vẽ cọp cũ có mũ Noel -> đồng bộ với cọp mới. 2. Bloom mạnh hơn. 3. Gộp vá vào game.js, bỏ loader. 4. Có thể thêm mũ Noel nhỏ nếu muốn giữ chủ đề (ảnh mẫu không có).

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v11.md, loader.js). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối phiên viết prompt bàn giao mới. Không bịa kết quả test. Mình sẽ gửi ảnh chụp cọp mới trong game (tab ẩn danh + ?debug=1) và ảnh mẫu 9 Sạch để chỉnh màu, tỉ lệ, tóc, mắt, tay chân. Nhận xét của mình: [DÁN ẢNH + NHẬN XÉT].
