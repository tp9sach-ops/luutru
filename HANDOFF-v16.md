# HANDOFF v16 – Đua Cọp May Mắn 9 Sạch – NHỊP ĐUA MƯỢT HƠN (21/11/2026)

## QUY TẮC (chép nguyên văn vào mọi handoff)
For the 9 Sạch monthly-archive project (and any long multi-session build): after EVERY reply, attach an updated handoff .md so a fresh session with no memory can continue exactly and in detail; if there isn't room to finish everything, send the handoff first; copy this rule verbatim into every handoff.
Kèm quy ước cũ: nói tiếng Việt, ngắn gọn; sửa code mình tự dán thì đưa ĐỦ đoạn TÌM (nguyên văn, không viết tắt) và đoạn THAY BỚ; cần đoạn code nào thì hỏi mình; không bịa kết quả test. Làm từng mục một, sau mỗi mục viết prompt bàn giao.

## VIỆC ĐÃ LÀM (v16)
Phiên trước đo nhịp đua và định sửa nhưng KHÔNG đẩy được lên GitHub (máy ảo mất) -> phiên này đo lại + sửa lại từ đầu.
Chẩn đoán (đã đo): nhịp cũ = 3 sóng sin biên độ 0,36+0,20+0,12 -> tốc độ dao động ~30% quanh TB, đổi ngôi dẫn đầu 12,3 lần/ván, cọp trúng quà tụt bét (8/8) trong 56% ván.
Sửa (chỉ patches-fall.js, P23 + window.TIGER_PACE):
- mkPace(f): nhiễu mượt ngẫu nhiên (nút ngẫu nhiên cách nhau kmin..kmax giây, nội suy smoothstep, mỗi cọp một nhịp riêng, KHÔNG tuần hoàn) + 0..nb cú bứt ngắn (0,45-0,85 s, có đoạn hụt nhẹ sau) + giới hạn độ dốc amax. mkTab gọi nz=mkPace(f).
- Công thức tốc độ: m=1+g0*nz(t) (g0 = vào dần 2,5 s đầu, giữ từ mục 8); nước rút cuối cọp trúng quà nhân PC.spr (0,3); PC.win (lợi thế tăng dần) để 0.
- LƯU Ý ĐÃ DÒ RA: đặt win>0 làm cọp trúng quà TỤT ĐẦU ĐUA (mkTab chuẩn hóa quãng đường: dồn tốc độ về sau thì đầu phải chậm). Giảm spr cũng giảm tụt. Cọp trúng quà đã có lợi thế sẵn do giờ về đích định sẵn (22 s so với 22,6-24,3 s).
- Cấu hình hiện tại: TIGER_PACE = {amp:.22, burst:.18, nb:3, kmin:1.1, kmax:2.6, amax:.5, win:0, spr:.3}.
- loader.js / index.html GIỮ NGUYÊN (patches-fall.js?v=1, loader.js?v=7): trình duyệt có thể giữ bản cũ tới ~10 phút hoặc đến khi xóa cache. Muốn ép ngay: đổi patches-fall.js?v=1 -> ?v=2 trong loader.js rồi loader.js?v=7 -> ?v=8 trong index.html.

## SỐ ĐO (mô phỏng Node, 8 cọp, 4000 ván, nguyên văn mkTab đã vá; KHÔNG phải trình duyệt thật)
| Chỉ số | Trước | Sau |
|---|---|---|
| Dao động tốc độ (độ lệch chuẩn/TB) | 0,302 | 0,103 |
| Đổi ngôi dẫn đầu / ván | 12,3 | 3,2 |
| Gia tốc đột ngột lớn nhất (TB mỗi giây) | 1,0 | 0,4 |
| Cọp trúng quà: hạng tệ nhất từ giây 3 (TB, /8) | 7,3 | 4,4 |
| Cọp trúng quà: hạng ở giây 11 (TB) | 4,0 | 2,3 |
| Cọp trúng quà tụt bét 8/8 | 56% | 8% |
| Khoảng cách nhất-bét lớn nhất (vòng) | 0,099 | 0,092 |
Cọp trúng quà về nhất: 5000 ván (2-12 cọp, có té) = 0 ván sai. Lưu ý: kiểm này chủ yếu xác nhận giờ về đích định sẵn (mkTab chuẩn hóa) còn đúng; nó không đo cảnh thật.
57/57 vá khớp, game.js sau vá không lỗi cú pháp.

## CHƯA KIỂM ĐƯỢC (nói thẳng)
- CHƯA xem trên trình duyệt/điện thoại thật: nhịp chân có hết "giật cục" không, và đua có còn đủ kịch tính không (đổi ngôi còn ~3 lần/ván, thấp hơn trước).
- Chưa đo riêng cảnh cọp té + nhịp mới (tốc độ té vẫn do fallSpd, không đổi).
- Chỉnh nhanh nếu cần (chỉ sửa window.TIGER_PACE trong patches-fall.js, nhớ tăng ?v= của patches-fall.js trong loader.js): muốn kịch tính hơn -> tăng amp (0,26) / burst (0,2); muốn êm hơn -> giảm amp, tăng kmin/kmax; cọp trúng quà vẫn hay tụt -> giảm spr (0,15).

## CÒN LẠI (từ v14/v15, chờ người dùng)
- Xem dáng té trên máy thật (xem HANDOFF-v15.md: ?debug=1, đặt tạm TIGER_FALL.base=1).
- Tỷ lệ quà: người dùng tự nhập lại tổng 100 trong Sheet (tab GiaiThuong), dọn dòng test tab KhachQuay, chạy thử ~100 lượt đối chiếu tần suất; kiểm bản Apps Script đang triển khai có đúng Code.gs trong repo vongquay (xem HANDOFF-v14.md).

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v16.md rồi HANDOFF-v15.md, HANDOFF-v14.md, HANDOFF-v13.md; backend tp9sach-ops/vongquay/Code.gs; Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối MỖI câu trả lời đính kèm handoff .md mới (chép nguyên văn quy tắc trong HANDOFF-v16.md). Việc: nhịp đua mới (TIGER_PACE) và cọp té đã lên main nhưng mình mới xem thử: [DÁN NHẬN XÉT: chỗ nào còn giật (đầu/giữa/sau té), có đủ kịch tính không, cọp té trông thế nào]. Chỉnh TIGER_PACE/KF theo đó, chạy lại mô phỏng (cọp trúng quà luôn về nhất).
