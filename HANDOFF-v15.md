# HANDOFF v15 – Đua Cọp May Mắn 9 Sạch – CỌP VẤP TÉ rồi đứng dậy chạy tiếp (21/11/2026)

## QUY TẮC (chép nguyên văn vào mọi handoff)
For the 9 Sạch monthly-archive project (and any long multi-session build): after EVERY reply, attach an updated handoff .md so a fresh session with no memory can continue exactly and in detail; if there isn't room to finish everything, send the handoff first; copy this rule verbatim into every handoff.
Kèm quy ước cũ: nói tiếng Việt, ngắn gọn; sửa code mình tự dán thì đưa ĐỦ đoạn TÌM (nguyên văn, không viết tắt) và đoạn THAY BỚ; cần đoạn code nào thì hỏi mình; không bịa kết quả test. Làm từng mục một, sau mỗi mục viết prompt bàn giao.

## KIẾN TRÚC (như v13/v14, thêm phần té)
index.html -> loader.js (v21; nạp tiger/ + patches.js + patches-fall.js + game.js rồi vá bằng find-and-replace: mảng P trong loader.js, rồi window.P22 (patches.js), rồi window.P23 (patches-fall.js)). Backend: repo tp9sach-ops/vongquay (Code.gs), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4.

## PHIÊN NÀY ĐÃ LÀM (đã đẩy lên main, đã đối chiếu raw GitHub == bản test, khác 0 byte)
Lưu ý: phiên trước đã làm một bản cọp té nhưng KHÔNG BAO GIỜ đẩy lên GitHub (máy ảo mất) nên phiên này viết lại từ đầu. Không dùng lại bảng khung hình cũ nào.
1. tiger/tiger-fall.js (MỚI): bảng khung hình KF (vấp -> đổ -> úp mặt chống tay -> nằm choáng -> chống tay đẩy người -> gối đứng dậy -> vào dáng chạy), tổng 3,4 giây (T_END). Trộn lên dáng chạy theo trọng số w. Chạm đất tự tính bằng FK (điểm thấp nhất của tay/chân/gối/ngực/đầu luôn trên mặt đất). Móc vào R.solve + TR.pose nên KHÔNG sửa tiger-runtime.js.
2. patches-fall.js (MỚI, P23 + cấu hình window.TIGER_FALL): base 0.18 (xác suất mỗi cọp té/ván), row[12] (hệ số nhân THEO HÀNG/làn 1..12, 0 = không bao giờ té), maxFalls 2, tMin 3.5 s, tEndGuard 8.5 (té muộn nhất tại giây DUR-8.5 = 13.5). Thêm: fallSpd (hệ số tốc độ khi té), pickFalls, mkTab nhận thêm tham số FT, plan.FT, ctx.fall truyền vào TR.pose, bụi PUF 26 hạt lúc chạm đất (cờ l.dz).
3. loader.js v21 + index.html (loader.js?v=7): nạp tiger-fall.js (sau tiger-runtime.js) và patches-fall.js; nếu file té lỗi thì game vẫn chạy bình thường (không té).
4. Cọp trúng quà có thể té (không loại trừ) và VẪN VỀ NHẤT: mkTab chuẩn hóa tổng quãng đường nên giờ về đích không đổi; sau khi té cọp tăng tốc để bù. Kết quả gắn liền tỷ lệ quà KHÔNG đổi (máy chủ chọn quà, game chỉ dàn cảnh).

## Bằng chứng test (mô phỏng Node, KHÔNG phải trình duyệt thật)
- Áp các bản vá lên game.js: 57/57 vá khớp, game.js sau vá không lỗi cú pháp.
- 5000 ván ngẫu nhiên (2-12 cọp, dùng nguyên văn mkTab + fallSpd + pickFalls đã vá): 0 ván cọp trúng quà không về nhất (kể cả 784 ván nó có té); khoảng cách nhất-nhì nhỏ nhất 0,60 s. Tỷ lệ té thực ~13-16% mỗi cọp (thấp hơn 18% vì bị trần maxFalls=2); hàng cuối thấp hơn hàng đầu nhẹ do cắt trần.
- Dáng té kiểm bằng FK: chân/tay/thân chạm đất trong sai số ~0,03 đơn vị mô hình (tay cách đáy ~0,04), liền mạch đầu/cuối (u=0 và u=3,4 trùng dáng chạy).

## CHƯA KIỂM ĐƯỢC (nói thẳng)
- CHƯA ai nhìn dáng té trên trình duyệt/điện thoại. Tư thế tính bằng toán, có thể còn hơi cứng hoặc tăng/gối nhìn chưa đẹp. Người dùng cần mở tp9sach-ops.github.io/luutru/?debug=1 (xóa cache) đua vài ván, chụp/quay màn hình lúc cọp té rồi báo lại để chỉnh KF (gốc, tốc độ, thời gian nằm).
- Muốn thấy cọp té ngay để xem: tạm đặt window.TIGER_FALL.base=1 (sửa base trong patches-fall.js).
- Buộc phải xem thêm: camera fitCam có theo kịp khi cọp nằm không; bụi PUF có hiện đúng chỗ không.

## CÒN LẠI (từ v14, chờ người dùng)
- Tỷ lệ quà: người dùng TỰ NHẬP LẠI tổng đúng 100 trong Sheet (tab GiaiThuong) – không sửa admin. Sau khi nhập xong, chạy thử ~100 lượt (49 HÀNG BÀI) đối chiếu tần suất. Cần dọn dòng test trong tab KhachQuay (giữ chỗ không hết hạn trừ kho; Voucher 49 HB đang bị loại vì 34 lượt giữ chỗ = SoLuong 34). Vẫn nợ: kiểm bản Apps Script đang triển khai có đúng Code.gs trong repo vongquay không (lịch sử 86 lượt lệch rất xa tỷ lệ).
- Các mục cũ 4-11 xem HANDOFF-v13.md; cache ?v= của loader.js (đã lên v=7) / patches.js (v=22) / patches-fall.js (v=1) / tiger-fall.js (v=1).

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v15.md rồi HANDOFF-v14.md, HANDOFF-v13.md; backend tp9sach-ops/vongquay/Code.gs; Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối MỖI câu trả lời đính kèm handoff .md mới (chép nguyên văn quy tắc trong HANDOFF-v15.md). Việc: cọp vấp té đã lên main (tiger/tiger-fall.js + patches-fall.js + loader v21) nhưng mình mới xem thử: [DÁN NHẬN XÉT DÁNG TÉ: gốc ngã, tốc độ, nằm bao lâu, tỷ lệ té, hàng nào dễ té]. Hãy chỉnh KF/TIGER_FALL theo đó và chạy lại mô phỏng 5000 ván (cọp trúng quà phải luôn về nhất). Tỷ lệ quà mình đã tự nhập lại trong Sheet; việc tiếp: chạy thử 100 lượt và đối chiếu tần suất.
