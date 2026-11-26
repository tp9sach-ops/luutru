# HANDOFF v37 – Đua Cọp 9 Sạch: thêm nút ▶ BẮT ĐẦU trong màn đua

(Quy tắc làm việc và bối cảnh: xem HANDOFF-v35.md, HANDOFF-v36.md)

## YÊU CẦU CỦA GIANG
Thêm nút bắt đầu trong màn đua cọp, bấm vào thì cọp mới bắt đầu chạy.

## ĐÃ SỬA (chỉ patches-drama.js, mục 5; chưa thử trên máy thật)
- Sau phần mở đầu (intro), game dừng ở trạng thái chờ: cọp ĐỨNG YÊN (v=0), hiện nút vàng ▶ BẮT ĐẦU (id `bd`, cố định giữa màn hình, cách đáy 15%).
- Bấm nút → ẩn nút → đếm ngược 3-2-1-ĐUA → cọp chạy → replay → bục → bảng nhận thưởng.
- Áp cho cả 2 đường vào đua: `go()` (nút ĐUA CỌP cũ) và `DC.start()` (luồng gate.js/QR cửa hàng) vì vá thay mọi chỗ `intro(tk).then(...countdown...)`.
- Nếu người chơi thoát/đặt lại (cdTok đổi) thì nút tự ẩn sau ≤0,3 s.
- Thời gian chờ do khách bấm nên KHÔNG nằm trong mục tiêu 35 s; từ lúc bấm BẮT ĐẦU tới bảng nhận thưởng ≈ 2,5 + 18 + 1,7 + 0,8 + 4,0 + 0,15 + 4,0 ≈ 31 s.

## ĐÃ KIỂM CHỨNG
- Cú pháp patches-drama.js OK; mô phỏng loader: cả 80 cặp vá áp được lên game.js (không cặp nào hụt), game.js sau vá qua `new Function` không lỗi, `waitStart` được gắn vào cả 2 đường.

## CHƯA KIỂM CHỨNG / LƯU Ý
- CHƯA chạy trên trình duyệt/điện thoại thật: cần thử bấm ĐUA/quét QR → thấy nút → cọp đứng yên → bấm → đếm ngược → chạy. Chưa kiểm cọp có tư thế đứng đẹp khi v=0, nút có che gì trên màn nhỏ không.
- Lúc khách bấm ĐUA/vào đua, máy chủ đã chốt kết quả (api race/spin) TRƯỚC khi bấm BẮT ĐẦU; khách bỏ ngang ở màn chờ vẫn có lượt đã ghi (như hành vi cũ khi bỏ giữa đua). Nếu muốn chỉ ghi lượt sau khi bấm BẮT ĐẦU thì phải đổi thứ tự gọi API (phiên sau, cần hỏi Giang).
- Cache GitHub Pages ~10 phút; nếu vẫn thấy bản cũ, tăng `patches-drama.js?v=` (hiện v=2 trong loader.js).

## PROMPT CHO PHIÊN SAU
Mình làm game Đua Cọp 9 Sạch (tp9sach-ops/luutru, backend/admin ở tp9sach-ops/vongquay). Đọc HANDOFF-v37.md. Việc: thử nút BẮT ĐẦU trên điện thoại, đo thời gian từ BẮT ĐẦU tới bảng nhận thưởng (≤35 s). Nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay. Cuối mỗi câu trả lời gửi handoff .md cập nhật.
