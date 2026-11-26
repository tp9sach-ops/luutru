# HANDOFF v37 – Đua Cọp 9 Sạch: nút 🏁 BẮT ĐẦU ĐUA + cọp đứng yên chờ; sửa lỗi mất nút

(Quy tắc làm việc và bối cảnh: xem HANDOFF-v35.md, HANDOFF-v36.md)

## YÊU CẦU CỦA GIANG
Thêm nút bắt đầu trong màn đua cọp, bấm vào thì cọp mới bắt đầu chạy. Sau đó Giang báo quét QR vào đua KHÔNG thấy nút.

## NGUYÊN NHÂN (đã kiểm chứng bằng mô phỏng vá)
- Game đã có SẴN nút `#go` "🏁 BẮT ĐẦU ĐUA!" (index.html + flow.css + patches-fix.js mục v49): nút hiện sau phần mở đầu, bấm xong mới đếm ngược.
- Phiên v36 tôi sửa chuỗi `k--;setTimeout(step,800)}` và `el.hidden=true;res()},500)...` trong countdown() (patches-drama.js, áp TRƯỚC patches-fix.js) → vá countdown() của patches-fix.js không còn khớp → HỤT → nút #go mất. Thử vá phiên trước thiếu patches-fix.js nên không phát hiện.
- Bản v37 đầu của tôi còn thêm nút `bd` trùng lặp (bị bỏ).

## ĐÃ SỬA
- patches-drama.js: BỎ 2 vá countdown (800/500 ms) để vá nút #go khớp lại. Bỏ nút `bd` tự thêm.
- Thêm `window.__wt`: =1 khi hết phần mở đầu (cọp chờ, `v=0` đứng yên trong trạng thái warm), =0 khi intro bắt đầu/startRace → cọp chạy khi đua bắt đầu.
- DUR 18 → 17 để bù đếm ngược thật của patches-fix (900 ms/số + 600 ms, ~3,3 s, không phải 2,9 s như ước tính cũ).
- TƒÉng version để ép trình duyệt/Zalo tải bản mới: patches-drama.js?v=5 (loader.js), loader.js?v=16 + finale.js?v=4 (index.html).
- Thời gian từ lúc bấm 🏁 BẮT ĐẦU ĐUA tới bảng nhận thưởng ≈ 3,3 + 17 + 1,7 + 0,8 + 4,0 + 0,15 + 4,0 ≈ 31 s (cộng mở đầu 2,6 s ≈ 34 s từ lúc bấm vào đua).

## ĐÃ KIỂM CHỨNG
- Mô phỏng vá đúng thứ tự thật (patches-fix.js → patches.js, scene, drama, fall): 91 cặp, 0 hụt, game.js sau vá qua `new Function`, countdown() có nút #go. Bản lỗi cũ trên GitHub thì hụt 1 cặp (countdown) → xác nhận nguyên nhân.

## CHƯA KIỂM CHỨNG
- CHƯA chạy trên trình duyệt/điện thoại thật (không vào được GitHub Pages từ máy làm việc). Cần thử quét QR → thấy nút → cọp đứng yên → bấm → đếm ngược → cọp chạy. Dùng `?debug=1` trên link để xem `patch X/Y` và vá hụt.
- Nhớ: khi thử vá phải nạp ƒëủ patches-fix.js (ƒëịnh nghƒ©a getter P25).
- Lúc khách vào đua, máy chủ đã chốt kết quả (api race/spin) TRƯỚC khi bấm BẮT ĐẦU; bỏ ngang ở màn chờ vẫn có lượt đã ghi.

## PROMPT CHO PHIÊN SAU
Mình làm game Đua Cọp 9 Sạch (tp9sach-ops/luutru, backend/admin ở tp9sach-ops/vongquay). Đọc HANDOFF-v37.md. Việc: thử trên điện thoại quét QR: nút 🏁 BẮT ĐẦU ĐUA có hiện, cọp đứng yên trước khi bấm không; đo thời gian (≤35 s). Nói tiếng Việt ngắn gọn, sửa dạng tìm-và-thay. Cuối mỗi câu trả lời gửi handoff .md cập nhật.
