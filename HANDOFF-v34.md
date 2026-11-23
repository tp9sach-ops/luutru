# HANDOFF v34 – Đua Cọp 9 Sạch (repo tp9sach-ops/luutru)

Quy ước giữ nguyên: nói tiếng Việt, ngắn gọn, sửa dạng tìm-và-thay, đẩy thẳng main.

## Phiên này (CHƯA thử trên máy thật)
1. **Lóa sáng ảnh về đích + bục** -> file mới `glare-fix.js` (nạp cuối index.html, móc vào `FIN.tick`, không sửa game.js/finale.js).
   - Nguyên nhân: sau khi về đích có nhiều hiệu ứng cộng sáng chồng nhau trước ống kính replay: 8 chùm đèn pha nón (patches-scene.js `bm2`), quầng 26x26 độ sáng .8 (`celebrate()` game.js), quầng cổng đích, đèn đường, quầng hộp quà từng cọp; và finale.js bắn 160 hạt pháo giấy tại 1 điểm rồi chụp ngay cùng khung.
   - Sửa: từ DUR+0,5 s chặn trần opacity các sprite/nón cộng sáng (giảm dần 0,8 s), thu nhỏ hạt CNF/PUF; lùi lần chụp khung `fin` 0,45 s; chỉnh nhẹ ảnh chụp (nén vùng sáng, +14% bão hòa) trước khi ghép collage.
   - Chỉnh độ mạnh: hằng số trong `capFor()` (.05/.12/.25/.03), `HOLD`, và hàm `roll()`. So sánh: thêm `?glare=0` vào link.
2. **Link mở trong Zalo bị chặn chia sẻ Facebook** -> không sửa được từ phía game (trình duyệt Zalo không có menu chia sẻ hệ thống, không đưa ảnh sang app FB). Làm phương án dự phòng: file mới `zalo-open.js` (nạp đầu body).
   - Phát hiện UA có "Zalo" -> bảng toàn màn hình "MỞ BẰNG TRÌNH DUYỆT": Android dùng `intent://`, iPhone dùng `x-safari-https://`; sau 1,6 s vẫn còn trang thì hiện hướng dẫn ⋯ > Mở bằng trình duyệt + nút Sao chép liên kết. Có nút "Tiếp tục trong Zalo" (nhớ trong phiên).
   - Trúng quà trong Zalo mà bấm CHIA SẺ LÊN FACEBOOK: hiện hướng dẫn lưu ảnh + dán caption (caption tự sao chép).
   - Thử trên máy tính: `?zalo=1`. Tắt hẳn: `?noz=1`.

## Cần Giang xác nhận
- Gửi link qua Zalo, mở bằng Zalo: có hiện bảng không; bấm nút có nhảy sang Chrome/Safari không (Android và iPhone khác nhau, iPhone khó nhất).
- Đua 1 hóa đơn mới: ảnh "chạm đích" và bục còn lóa không. Còn lóa thì giảm các số trong `capFor()` hoặc tăng độ nén trong `roll()`.
- Link khách dùng thật là Google Sites (khung nhúng): nút mở trình duyệt mở link GitHub Pages trực tiếp, không phải trang Google Sites.
