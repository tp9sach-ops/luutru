# Cọp 3D có xương (mô hình của chủ game)
- `tiger.bin` + `tiger.json`: lưới 24k tam giác, trọng số da, 21 xương (root, hips, spine, chest, neck, head, ear.L/R, hair, upperarm/forearm/hand L/R, thigh/shin/foot L/R)
- `tiger_color.webp`, `tiger_normal.webp`: texture
- `tiger-rig.js`: định nghĩa xương + chuyển động (đứng, chạy IK chân, vẫy tay, ăn mừng)
- `tiger-runtime.js`: nạp và điều khiển trong game (loader.js tự nạp; lỗi thì quay về cọp dựng bằng mã)
- `tiger_rigged.glb`: bản chuẩn glTF có xương + clip Idle/Run/Wave/Cheer, mở được bằng Blender
- `build/`: script dựng trọng số, đóng gói, xuất GLB (cần dữ liệu giải nén từ GLB gốc)
