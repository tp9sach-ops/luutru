# HANDOFF – Đua Cọp May Mắn 9 Sạch (cập nhật 19/11/2026, bản Noel v4: trời chạng vạng + nhà gỗ + camera điện ảnh + nhạc)

## QUY TẮC LÀM VIỆC (chép nguyên văn vào mọi handoff)
- Nói tiếng Việt, ngắn gọn, thẳng vào việc; làm TỪNG MỤC MỘT, xong mỗi mục viết prompt bàn giao.
- Mỗi phiên làm việc phải kết thúc bằng một prompt bàn giao chi tiết cho phiên sau (phiên sau không có memory, không biết gì vẫn làm đúng).
- Giao file hoàn chỉnh (dán là chạy) hoặc đẩy thẳng lên repo; không đưa đoạn code rời rạc.
- Luôn điều tra bằng bằng chứng trước khi sửa; không bịa kết quả test; nói rõ cái gì đã kiểm chứng, cái gì chưa.

## BỐI CẢNH
- Repo: https://github.com/tp9sach-ops/luutru (main, GitHub Pages https://tp9sach-ops.github.io/luutru/). Tệp gốc: index.html, style.css, app.js, game.js (Three.js r128 CDN). Script/CSS gọi kèm `?v=4` để phá cache.
- Game thay Vòng Quay: bấm ĐUA CỌP, mỗi quà = 1 cọp đeo sừng hưu kéo hộp quà; cọp kéo quà nào về đích thì khách nhận quà đó (tối đa 12 cọp). Máy chủ quyết định quà trúng (spin), game chỉ dàn cảnh.
- Backend dùng chung repo vongquay: Apps Script /exec (CFG.API trong app.js), Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4. app.js tương thích cả Apps Script cũ/mới.

## ĐÃ LÀM (phiên này: làm lại hoàn toàn cảnh theo ảnh mẫu Noel)
1. Không gian: bầu trời chạng vạng xanh tím (dome gradient), sao, 2 dải cực quang chuyển động, trăng + quầng sáng, đồi tuyết xa + hàng thông xa, sương mù tím; tuyết rơi 700 hạt.
2. Nhà gỗ Noel 4 căn (đá + gỗ, mái tuyết, ống khói có khói bay, cửa vòm cam có vòng nguyệt quế, cửa sổ vàng phát sáng, dây đèn mái, vệt sáng cam trên tuyết); đèn nhấp nháy đa màu (InstancedMesh ~520 bóng); 2 cây thông lớn có sao phát sáng; hàng thông 2 bên; đống quà, 4 người tuyết, biển 9 SẠCH, xe trượt Santa trang trí; cọc kẹo + dây đèn dọc đường; vòm XUẤT PHÁT + cổng ĐÍCH.
3. Màu giao diện đổi sang xanh đêm + đỏ/vàng ấm (style.css, viền khung đỏ).
4. Cọp: thêm má hồng, đuôi chóp trắng, to hơn 2%; xe trượt có ván hông + mũi cong; hộp quà có quầng sáng vàng nhấp nháy.
5. TVC 4s: 0-1.6s cẩu cảnh toàn cảnh (zoom ra) -> 1.6-2.6s cắt cận cọp giữa vẫy tay (dolly vào) -> 2.6-4s chữ Merry Christmas nảy từng chữ + phụ đề + camera lùi về xuất phát, 2 dải đen, vignette; rồi đếm 3-2-1-ĐUA.
6. Camera đua (có làm mượt, đổi FOV, rung nhẹ): 0-3.4s bám sau/thấp nhìn rõ xe kéo quà; sau đó toàn cảnh; 3.4s trước đích bay vọt tới trước cổng đích nhìn ngược lại, zoom hẹp + rung tăng dần (hồi hộp); về đích thì quay vòng quanh cọp thắng, pháo giấy; hiện quà sau 3,4s. Có bụi tuyết tung sau chân cọp.
7. Nhạc: nhạc nền `nhac-nen.mp3` (lặp, bật từ lần chạm đầu tiên; giữ suốt TVC) -> chuyển mượt sang nhạc đua `alex-morgan-car-car-music-545487.mp3` đúng lúc "ĐUA!" -> về đích nhạc nền quay lại. Nút 🔊 tắt/bật cả hai. Thiếu file mp3 thì game vẫn chạy im lặng (không lỗi).
8. Hiệu năng: toàn bộ cảnh tĩnh gộp batch (vài draw call); 12 cọp ~876 mesh (trước đây ~2000+).

## ĐÃ KIỂM CHỨNG / CHƯA
- ĐÃ (Node + three r128 thật, giả lập DOM/WebGL): cú pháp; chạy đủ chuỗi bấm ĐUA -> TVC -> đếm -> đua -> về đích -> hiện quà với 1, 8, 12 cọp, không lỗi; đường đi camera và FOV đúng kịch bản; âm thanh chuyển bgm/race/bgm đúng thứ tự (audio giả lập).
- CHƯA: chưa nhìn hình render thật (màu sắc, bố cục nhà/cây, chữ Merry Christmas, góc máy 12 cọp, màn dọc điện thoại); chưa đo FPS thật; chưa nghe nhạc thật; chưa gọi Apps Script thật.

## VIỆC NGƯỜI DÙNG LÀM
- BẮT BUỘC: tải 2 file nhạc lên GỐC repo (Add file -> Upload files), đặt đúng tên: `nhac-nen.mp3` và `alex-morgan-car-car-music-545487.mp3` (AI không đẩy được file nhị phân qua công cụ).
- Mở trang bằng tab ẩn danh (thêm ?v=4), xem TVC + đua trên điện thoại; chụp ảnh/quay màn hình phần chưa đẹp (góc máy, màu, cọp, nhà, cây, quà) và báo mức giật.
- (Làm sau) Triển khai lại Code.gs mới của vongquay lên link /exec hiện tại.

## CHƯA LÀM / Ý TƯỞNG TIẾP
- Tinh chỉnh ngoại hình cọp theo ảnh mẫu (chibi 3D: đầu tròn to, tai tròn viền nâu, bụng kem). Ảnh quà (tab AnhQua). Tiếng vó/bước chân thật. TVC chạy cả lúc mới vào trang nếu muốn.
- Nếu giật trên máy yếu: giảm số bóng đèn (bulbI), số cây, hoặc hạt tuyết 700.

## PROMPT CHO PHIÊN SAU (dán nguyên văn)
Mình làm game "Đua Cọp May Mắn" 9 Sạch, repo https://github.com/tp9sach-ops/luutru (đọc HANDOFF.md trước; dùng chung Apps Script + Google Sheet ID 1t3FMhGuPOhnNK3ywyauBG4c6BVsKr9cDPlbuWfVUwh4 của repo tp9sach-ops/vongquay). Nói tiếng Việt, ngắn gọn, thẳng vào việc, làm từng mục một; sửa xong đẩy thẳng lên repo luutru (main) và cuối phiên viết prompt bàn giao mới (phiên sau không có memory). Điều tra bằng bằng chứng, không bịa kết quả test, nói rõ cái gì đã/chưa kiểm chứng. Việc hiện tại: mình đã xem bản Noel v4 (trời chạng vạng, nhà gỗ, TVC 4s, camera điện ảnh, nhạc). Nhận xét của mình: [DÁN ẢNH/NHẬN XÉT: góc máy, cọp, quà, cây thông, nhà, màu sắc, độ giật, nhạc]. Hãy chỉnh đúng mục mình nêu.
