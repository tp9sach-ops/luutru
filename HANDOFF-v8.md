# HANDOFF v8 – 19/11/2026 (loader v12)

## QUY TẮC
Tiếng Việt, ngắn gọn; làm TỪNG MỤC MỘT; cuối phiên viết prompt bàn giao mới (phiên sau không có memory); không bịa kết quả test.

## KIẾN TRÚC (đọc kỹ)
index.html -> app.js (nạp premium.css, ACES) -> loader.js. loader.js tải game.js, áp mảng P (find-and-replace theo thứ tự, vá sau phải khớp CHỮ ĐÃ ĐƯỢC VÁ TRƯỚC), rồi chạy. ?debug=1 hiện `patch ok/tổng` + vá hụt. ?classic=1 = bản gốc.

## ĐÃ LÀM (v12, chưa nhìn hình thật)
- Mục 7: cảnh về đích lùi xa (rr=25+hw*.4, cao 11) vì ảnh 1 sát cọp.
- Mục 8: nhãn quà so le độ cao theo làn (i%3*1.3).
- Mục 9: dải đen TVC 9%->6%; bỏ emoji nút ĐUA CỌP.
- CSS trong loader: chữ Merry Christmas gọn (hết cắt chữ), hào quang mascot cổng, đồi tuyết cổng chuyển màu.
- game.js?v=13 (bump để phá cache). index.html vẫn gọi loader.js?v=1 -> mở bằng tab ẩn danh.

## NHẬN ĐỊNH TỪ ẢNH 19/11 (chưa sửa)
1. Mascot cổng là SVG phẳng, lệch phong cách với cảnh 3D -> cần cọp 3D/ảnh render đồng bộ.
2. Cọp nhìn từ sau = khối vàng; thiếu rim light, bóng mềm, lông.
3. Không có bloom/hậu kỳ; cảnh vẫn "đồ chơi" thấp poly, tím nhạt thiếu tương phản.
4. Hiệu ứng thắng (pháo giấy, tia sáng, popup quà) còn yếu so với brand lớn.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF-v8.md rồi HANDOFF.md). Nói tiếng Việt, ngắn gọn, làm từng mục một, đẩy thẳng lên main, cuối phiên viết prompt bàn giao mới. Không bịa kết quả test. Việc: đã có loader v12. Mình sẽ gửi ảnh bản v12 (mở ?v=13 tab ẩn danh, thêm ?debug=1 để thấy số vá). Mục tiếp theo: (1) cọp 3D đẹp hơn: rim light, bóng mềm, lông; (2) bloom giả + tia sáng + pháo giấy khi thắng; (3) cổng vào dùng cọp đồng bộ phong cách 3D; (4) popup trúng thưởng. Nhận xét của mình: [DÁN ẢNH + NHẬN XÉT].
