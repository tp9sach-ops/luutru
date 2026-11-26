# HANDOFF v36 – Đua Cọp 9 Sạch: rút toàn bộ từ bấm VÀO ĐUA tới bảng nhận thưởng còn ~33–34 s

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- nói tiếng Việt, ngắn gọn; sửa code dạng TÌM → THAY đầy đủ (không viết tắt); làm từng phiên
- sau MỖI phiên luôn gửi prompt bàn giao chi tiết (.md) để phiên sau không biết gì vẫn làm đúng
- điều tra bằng bằng chứng, không đoán; nói rõ cái gì đã kiểm chứng, cái gì chưa

## YÊU CẦU CỦA GIANG
Cọp chạy và nhận thưởng luôn trong 35 s (trước đó ~41–43 s).

## ĐÃ SỬA (tính từ code, CHƯA đo trên máy thật)
| Phần | Trước | Sau | File |
|---|---|---|---|
| Mở đầu (intro) | 4,0 s | 2,6 s | patches-drama.js vá `intro()` (1500/2000/2600 ms) |
| Đếm ngược 3-2-1 + ĐUA | 2,9 s | 2,5 s | patches-drama.js vá `countdown()` (700 ms/số, 400 ms ĐUA) |
| Đua DUR | 22 s | 18 s | patches-drama.js (vá `DUR=22`→`DUR=18` sau vá cũ trong loader.js; giữ TOTA=4π) |
| Cọp cuối về đích sau cọp thắng | tối đa 2,45 s | tối đa 1,7 s | patches-drama.js `RGAP` |
| Replay chậm | 5,5 s (s=.4) | 4,0 s (s=.55) | finale.js `REP.s` |
| Cảnh bục tới bảng chúc mừng | 5,6 s | 4,0 s | finale.js `finDelay` (+4.0) |
Cộng dồn xấu nhất ≈ 5,1 + 18 + 1,7 + 0,8 + 4,0 + 0,15 + 4,0 ≈ 33,8 s. Còn dư ~1,2 s: muốn đua dài hơn thì tăng `DUR` tối đa +1.
Không đổi loader.js/index.html (không tăng version): trình duyệt có thể giữ bản cũ tới ~10 phút (cache GitHub Pages); nếu còn chạy bản cũ thì tăng `patches-drama.js?v=` trong loader.js và `finale.js?v=` trong index.html.
Lưu ý: SLOWMO về đích đã bị finale.js tắt (s=1) nên không cộng thêm thời gian. patches-fall: té phải xong trước DUR-8,5 = 9,5 s (vẫn đủ khoảng 3,5–9,5 s).

## CHƯA KIỂM CHỨNG
- Cú pháp patches-drama.js và finale.js OK. CHƯA chạy game thật, CHƯA bấm giờ. Cần đo: bấm VÀO ĐUA → hiện bảng chúc mừng (điện thoại thật, mạng 4G).
- Nếu >35 s: giảm DUR 18→16 (mỗi 1 giây DUR = 1 giây tổng).
- Nếu cảnh bục bị cắt cụt: tăng +4.0 → +4.5 trong finale.js.

## PROMPT CHO PHIÊN SAU
Mình làm game Đua Cọp 9 Sạch (tp9sach-ops/luutru, backend/admin ở tp9sach-ops/vongquay). Đọc HANDOFF-v36.md. Việc: đo thời gian thật từ VÀO ĐUA tới bảng nhận thưởng (mục tiêu ≤35 s), chỉnh DUR nếu cần. Nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay. Cuối mỗi câu trả lời gửi handoff .md cập nhật.
