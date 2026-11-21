# HANDOFF v14 – Đua Cọp May Mắn 9 Sạch – kiểm toán tỷ lệ quà (21/11/2026 tối)

## QUY TẮC (chép nguyên văn vào mọi handoff)
For the 9 Sạch monthly-archive project (and any long multi-session build): after EVERY reply, attach an updated handoff .md so a fresh session with no memory can continue exactly and in detail; if there isn't room to finish everything, send the handoff first; copy this rule verbatim into every handoff.
Kèm quy ước cũ: nói tiếng Việt, ngắn gọn; sửa code mình tự dán thì đưa ĐỦ đoạn TÌM (nguyên văn, không viết tắt) và đoạn THAY BẰNG; cần đoạn code nào thì hỏi mình; không bịa kết quả test.

## KIẾN TRÚC (như v13)
index.html -> loader.js (nạp tiger/ + patches.js + game.js rồi vá bằng find-and-replace: mảng P trong loader.js rồi window.P22 trong patches.js). Backend: repo tp9sach-ops/vongquay (Code.gs), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 (tab GiaiThuong, KhachQuay, CuaHang...).

## YÊU CẦU QUAN TRỌNG CỦA NGƯỜI DÙNG
Tỷ lệ trúng các phần thưởng phải CHÍNH XÁC đúng tỷ lệ đã chỉnh.

## ĐÃ KIỂM (phiên này, bằng chứng thật)
1. Máy chủ quyết định quà trúng: Code.gs draw(): lọc quà của cửa hàng (Bat=TRUE, TyLe>0, còn kho = SoLuong - lượt đang giữ chỗ), rồi x=Math.random()*tổng; trừ dần TyLe; x<0 thì chọn. Mô phỏng 2 triệu lần với trọng số 49 HÀNG BÀI: khớp lý thuyết (sai lệch <0.1%). => thuật toán CHÍNH XÁC.
2. Phía game không can thiệp kết quả: startRace tìm cọp theo id quà máy chủ trả về; mkTab ép cọp đó về đích lúc DUR, cọp khác về DUR+0.6..2.3 s. Mô phỏng 3000 ván (2-12 cọp, công thức đã vá mục 4+8, DUR=22): 0 ván cọp trúng không về nhất, cách nhì tối thiểu 0.60 s.
3. Dữ liệu Sheet thật (49 HÀNG BÀI): Voucher 30, Vòng đeo tay 30, Gấu noel 20, Sữa chua 10, Panna cotta 10, Túi giữ nhiệt 10, Ly nhựa 5, Móc khóa 5 => TỔNG 120, không phải 100.

## PHÁT HIỆN (chưa sửa gì trong code)
A. Tổng trọng số 120 => xác suất thật = số nhập/120 (Voucher 25%, Vòng 25%, Gấu 16.67%, Sữa/Panna/Túi 8.33%, Ly/Móc 4.17%). Admin ghi "Tỷ lệ %" nên dễ hiểu nhầm số nhập là % thật. Cần người dùng quyết: (1) chỉnh số nhập cho tổng = 100, hoặc (2) thêm cột "% thực tế" + cảnh báo tổng ≠ 100 trong admin.html.
B. Quà hết kho tự bị loại, các quà còn lại được chia lại (bắt buộc, vì ai đua cũng phải trúng 1 quà). Đây là lý do % thực tế lệch khi kho cạn.
C. Giữ chỗ không hết hạn: dòng KhachQuay trạng thái "Chờ nhập thông tin" / "Chưa trao" đều trừ kho ảo. Có nhiều dòng test/bỏ dở; Voucher 49 HB có 34 lượt giữ chỗ = đúng SoLuong 34 => Voucher đã bị loại khỏi lượt đua kế tiếp ở cửa hàng này. Cần dọn dòng test trước khi chạy thật (hoặc cho giữ chỗ hết hạn sau X phút – cần người dùng quyết).
D. Lịch sử 86 lượt ở 49 HB lệch xa tỷ lệ hiện tại (Voucher 34 so với kỳ vọng 21.5; Vòng đeo tay 6 so với 21.5; chi-bình-phương 27.5 > 14.07). 33 lượt gần nhất (từ 13:45 21/11) không có Sữa chua/Túi/Móc khóa nào (xác suất ~0.05%). Chưa rõ nguyên nhân: nhiều khả năng TyLe trong Sheet được đổi trong lúc test, hoặc bản Code.gs đang triển khai khác bản trong repo. CẦN: xem Apps Script đang chạy (Triển khai > Quản lý) có đúng bản repo, và hỏi người dùng đã đổi tỷ lệ lúc nào.
E. 9 cửa hàng còn lại chỉ có đúng 1 quà (Voucher giảm 20K) nên luôn trúng Voucher (100%).
F. ID "1383b5ec" trùng giữa 177 LONG BIÊN và GIGAMALL TĐ (không ảnh hưởng vì khớp theo cửa hàng + tên).

## CÒN LẠI
- Chờ người dùng chọn hướng cho A (và C), rồi làm: admin hiện % thực tế + cảnh báo tổng ≠ 100; (tuỳ chọn) hết hạn giữ chỗ.
- Sau khi dọn dữ liệu test, chạy thử ~100 lượt (cửa hàng 49 HB) rồi đối chiếu tần suất với % thực tế.
- Các mục cũ chờ người dùng xem: 4-11 (xem HANDOFF-v13.md), cache ?v= của loader.js / patches.js.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v14.md rồi HANDOFF-v13.md; backend tp9sach-ops/vongquay/Code.gs; Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4). Nói tiếng Việt, ngắn gọn, làm từng mục, đẩy thẳng lên main, cuối MỖI câu trả lời đính kèm handoff .md mới (chép nguyên văn quy tắc trong HANDOFF-v14.md). Việc chính: tỷ lệ quà phải chính xác đúng tỷ lệ đã chỉnh – xử lý phát hiện A, C, D. Quyết định của mình: [DÁN].
