# Đan Mây — dữ liệu ý tưởng ba góc

Mục tiêu: 1.000 loại đồ vật, mỗi loại có ba ảnh PNG riêng: chính diện (`front`), bên phải (`side`) và sau (`rear`), tổng 3.000 ảnh. Bộ đang được tạo; số lượng thực tế nằm trong `manifest.json`. Chỉ những món có đủ ba file và qua kiểm tra mới được tính là bộ ba góc hoàn chỉnh.

Tiến độ đã kiểm kê: **500 PNG, 172 loại đã bắt đầu, 158 bộ ba góc đã qua đối chiếu**. Công cụ tạo ảnh đã chạm hạn mức; thời gian mở lại được báo là **13:40:43 ngày 13/10/2026, giờ Việt Nam**. Mục tiêu 3.000 ảnh chưa hoàn thành. Còn 2.500 ảnh chưa tạo và 5 ảnh cần tạo lại vì sai hướng nhìn. Chỉ dùng `ready_objects.json` để nạp các bộ đã qua đối chiếu.

Ảnh không có chữ, nhãn, logo hay số đo. Tên món, góc và các thuộc tính nằm trong tên file và JSON/CSV. Mỗi mã `Mxxxx` nhận diện một thiết kế. Ảnh bên và sau tham chiếu ảnh chính diện của cùng mã, không tính ba thiết kế khác nhau thành một món.

- `images/`: PNG nguyên bản, chia nhóm sản phẩm; tên file chứa mã món, loại món và góc.
- `records/`: một bản ghi cho từng file đã tạo, được lưu ngay sau khi nhập ảnh.
- `objects.json`: danh mục 1.000 loại dự kiến; mục có trạng thái `planned` chưa phải ảnh đã tạo và không được nạp như dữ liệu hình ảnh.
- `ready_objects.json`: các món đã đủ ba ảnh và qua đối chiếu bằng mắt, mỗi món có ba đường dẫn ảnh hiện hành. Đây là danh mục để nạp bộ ba góc đã kiểm tra; các món còn chờ kiểm tra được loại khỏi danh mục này.
- `manifest.json`: số lượng thực tế, mục tiêu, lựa chọn thiết kế và danh mục ảnh.
- `catalog.csv`: danh mục UTF-8 có BOM, gồm tên tiếng Việt, mô tả và góc.
- `prompts.jsonl`: prompt thực tế, công cụ tạo ảnh và liên kết ảnh chính diện tham chiếu.
- `generation_state.json`: tiến độ và thời gian mở lại hạn mức được công cụ báo.
- `pending_tasks.json`: các góc chưa tạo hoặc cần sửa, kèm mã món và ảnh chính diện hiện hành.
- `validation_report.json`: kết quả kiểm tra toàn bộ file PNG, dấu kiểm tra nội dung và liên kết ảnh tham chiếu; không phải xác nhận kỹ thuật chế tác.

Các lựa chọn: Boho/Sang trọng/Zen/Modern/Royal/Rustic; Nhỏ/Vừa/Lớn; Xương cá/Mắt cáo/Nong/Nan; Tự nhiên/Nhuộm/Sơn mài. Đây là thuộc tính yêu cầu trong prompt, chưa được nghệ nhân kiểm định. Kích cỡ tương đối trong từng loại; không suy ra số đo thật từ ảnh.

Ảnh được tạo bằng công cụ image_gen tích hợp. Nguồn `ai_generated`, `is_real_product_photo: false`, `artisan_verified: false`. Các mặt khuất là hình học AI suy diễn; ba góc chưa phải bản dựng 3D hoặc ảnh chụp sản phẩm thật. Cần đối chiếu kết cấu, vật liệu và tính nhất quán của từng bộ, rồi xác nhận với nghệ nhân trước khi dùng làm dữ liệu kỹ thuật. Bổ sung ảnh thật và số đo kiểm chứng được để giảm sai lệch; ảnh AI không tự loại bỏ hallucination.
