# HANDOFF v39 – Quà VIP (giới hạn ra/ngày, gợi ý %) trong Admin Đua Cọp 9 Sạch

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, làm từng phần; sửa code dạng tìm-và-thay hoặc đẩy thẳng lên repo.
- Sau MỖI phiên làm việc luôn gửi prompt bàn giao chi tiết (.md) để phiên sau (không biết gì) vẫn làm đúng.
- Điều tra bằng bằng chứng trước khi sửa; nói rõ cái gì đã kiểm chứng, cái gì chưa; không bịa kết quả test.

## YÊU CẦU CỦA GIANG
Trong Admin phần nhập quà thêm mục cập nhật quà VIP: nhập số lượng ra trong ngày; ra đúng số đó thì tỷ lệ tự động = 0%. Phần quà hiển thị: số quà ban đầu, đã tặng, thời gian chạy, TB ra/ngày, số ra trong ngày (nhập), % nhập vào, % tự động, gợi ý %, diễn giải nếu chọn % gợi ý thì ra bao nhiêu trong ngày và bao nhiêu đến hết chương trình.

## ĐÃ LÀM
### Backend – vongquay/Code.gs (CẦN DÁN LẠI + TRIỂN KHAI PHIÊN BẢN MỚI trên Apps Script)
- GiaiThuong thêm 5 cột G..K: Vip, SlNgay, NgayBD, NgayKT (yyyy-mm-dd, định dạng text), SlBanDau. `ensureG()` tự thêm tiêu đề cột cho sheet cũ.
- `vipOpen(r,tm,t)`: quà VIP bị loại khỏi lượt quay khi ngoài [NgayBD..NgayKT] hoặc hôm nay đã trúng >= SlNgay (đếm MỌI trạng thái, kể cả chưa trao; ngày theo giờ Asia/Ho_Chi_Minh; quét tối đa 3000 dòng cuối KhachQuay). Áp dụng ở `draw()` (trong khóa) và `pub`.
- `savePrize` nhận thêm vip, slNgay, ngayBD, ngayKT, slBanDau; trường không gửi thì GIỮ giá trị cũ (nên bảng quà cũ lưu không làm mất dữ liệu VIP). Ngày kết thúc < bắt đầu → báo lỗi.
- `adminAll` trả thêm v:2, today, stores[{n,d0,nt}], prizes[{vip,sln,bd,kt,sb,won,given,td}].
### Frontend – luutru/admin
- `vip.js` (mới, nạp sau patch.js): thay `vG` (bảng quà thêm cột VIP) + `sp`; thẻ "👑 Cập nhật quà VIP" cho từng quà VIP: ban đầu, đã tặng (+chờ trao), còn quay được, thời gian chạy, TB ra/ngày, ra hôm nay/giới hạn, % nhập, % tự động (kèm lý do nếu 0%), gợi ý %, ô nhập, nút Lưu VIP, nút Dùng % gợi ý, dự báo cập nhật khi gõ %.
- Công thức gợi ý: mục tiêu/ngày = (còn quay được)/(số ngày còn lại), chặn trên bởi giới hạn/ngày; % gợi ý = mục tiêu / lượt đua TB mỗi ngày của cửa hàng; trọng số cần nhập = s*(tổng trọng số quà khác đang mở)/(100-s).
- `patch.js` (sửa 2 chỗ): quà VIP bị chặn tính là "0% + lý do" trong Thống kê; `index.html` thêm vip.js, patch.js?v=2.

## ĐÃ KIỂM CHỨNG
- node --check cả 3 file JS + Code.gs; chạy Code.gs trên bộ giả lập Apps Script: VIP ra đúng 2/ngày với giới hạn 2 (300 lượt đua), sang ngày mới mở lại đúng 2, sau NgayKT = 0, `pub` loại VIP khi đủ số, lưu từng phần giữ trường VIP, ngày sai bị chặn.
- Chạy admin trên jsdom với backend giả: hiển thị đủ thông số, dự báo, gõ % cập nhật, Lưu VIP gửi đủ trường, Thống kê có lý do VIP, cảnh báo khi máy chủ chưa cập nhật.
- Đã đẩy lên GitHub (main) và so khớp từng byte với bản đã test.
## CHƯA KIỂM CHỨNG
- CHƯA chạy trên Apps Script/Sheet thật, CHƯA mở trên trình duyệt/điện thoại thật. Quà thường không đổi hành vi (không tích VIP).
- Cửa hàng chưa có lượt đua → chưa tính được gợi ý (hiện "—"). Gợi ý dựa trung bình lượt đua từ ngày đầu tiên của cửa hàng, nên lệch nếu lưu lượng đổi mạnh.

## PROMPT CHO PHIÊN SAU
Mình làm game Đua Cọp 9 Sạch (repo tp9sach-ops/luutru; backend ở tp9sach-ops/vongquay/Code.gs). Đọc HANDOFF-v39.md. Việc: kiểm tra quà VIP trên bản thật (đã dán Code.gs mới và triển khai chưa; tích VIP, nhập số ra/ngày, xem % tự động về 0 khi đủ số, xem gợi ý %). Nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay; cuối mỗi câu trả lời gửi handoff .md cập nhật.
