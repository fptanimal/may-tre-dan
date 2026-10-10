# Database ảnh Đan Mây

Ảnh ý tưởng được tạo bằng công cụ image_gen tích hợp, ngày 10–11/10/2026. Bộ hiện có **256 ảnh PNG của 142 loại đồ vật**, gồm 222 ảnh ban đầu và 34 ảnh thuộc các loại mới. Mỗi file trong `images/` là một ảnh riêng của một món đồ, không chèn chữ, nhãn hay số đo. Tên món và thuộc tính được lưu bên ngoài ảnh.

## Cấu trúc

- `images/`: ảnh PNG nguyên bản, giữ độ phân giải công cụ tạo ảnh trả về.
- `manifest.json`: danh mục đầy đủ, tên tiếng Việt, loại đồ vật, nhóm sản phẩm, thuộc tính yêu cầu, trạng thái file, prompt, kích thước pixel và SHA-256.
- `catalog.csv`: danh mục những file đã tạo, UTF-8 có BOM để đọc tiếng Việt trong Excel; đồ vật bổ sung có mô tả thiết kế chi tiết ở cột `description_en`.
- `prompts.jsonl`: prompt đã dùng cho từng file ảnh đã tạo.

## Các lựa chọn trên giao diện

- Phong cách: Boho, Sang trọng, Zen, Modern, Royal, Rustic.
- Kích thước tương đối: Nhỏ, Vừa, Lớn.
- Kiểu đan yêu cầu: Xương cá, Mắt cáo, Nong, Nan.
- Hoàn thiện yêu cầu: Tự nhiên, Nhuộm, Sơn mài.

Bộ cơ sở gồm 216 ảnh = 6 × 3 × 4 × 3 tổ hợp, với 108 loại đồ vật và hai biến thể cơ sở cho mỗi loại, cộng 6 mẫu theo gợi ý phổ biến trên giao diện. Đợt bổ sung thêm 34 ảnh thuộc 34 loại mới: 12 món phục vụ bàn ăn, 12 loại ghế/băng chuyên dụng và 10 loại bàn chuyên dụng. Mỗi tổ hợp xuất hiện một lần trong bộ cơ sở; mỗi loại đồ vật không có đầy đủ 216 tổ hợp. `generated_images` và `covered_option_combinations` trong manifest cho biết số lượng thực tế.

Ảnh mới có mã 223–256 và `set: expanded_types_2026_10_10`. Mô tả bổ sung nêu hình dáng, ngăn chứa, tay cầm, mép bo, phần đan, khung đỡ và vật liệu phụ cần thiết. Đây là chi tiết được yêu cầu trong prompt, chưa phải thông số chế tác được kiểm định.

Sáu mẫu bổ sung: ghế lưới tổ chim kiểu Nhật (cảm hứng Wabi-sabi, nhãn Zen), đèn chùm hoa sen Bohemian (nhãn Boho), túi xách mây phối da Sang trọng, xích đu ngoài trời Modern, gương mặt trời tia nắng Boho, bàn trà truyền thống Á Đông Zen.

Tên file: `mã_loại-đồ-vật_phong-cách_kích-cỡ_kiểu-đan_hoàn-thiện.png`, dùng dấu gạch dưới và tiếng Việt không dấu.

## Dùng trong dự án

Sao chép nguyên thư mục này vào dự án. Dùng `file` trong manifest để lấy đường dẫn tương đối tới ảnh; lọc theo `object_type`, `style`, `size`, `weave`, `finish`. Đọc `name_vi` để hiển thị tên món. Có thể lập chỉ mục ảnh và mô tả bằng mô hình embedding để truy xuất mẫu tham khảo cho yêu cầu mới. Chỉ nạp những mục có `status: generated` và file thực sự tồn tại.

Các thuộc tính là yêu cầu thiết kế của prompt (`requested_attributes: true`), không phải kết quả đo kiểm kỹ thuật. Cỡ Nhỏ/Vừa/Lớn tương đối trong từng loại đồ vật; không suy ra kích thước thực từ ảnh. Ảnh không chứa số đo và `exact_dimensions_cm` chưa được xác nhận.

## Nguồn gốc và xác nhận

Đây là ảnh AI tạo (`source: ai_generated`, `is_real_product_photo: false`), không phải ảnh chụp sản phẩm thật của Phú Vinh. `artisan_verified: false` và `craft_validation: pending_artisan_review`. Không dùng ảnh này để khẳng định khả năng chế tác, tải trọng, độ bền, chống ẩm, an toàn điện, tiếp xúc thực phẩm hoặc an toàn thú cưng. Lọ/bình và đồ chứa có lớp lót trong prompt chỉ là thiết kế ý tưởng.

Thêm thư mục ảnh sản phẩm thật cùng vật liệu, kiểu đan, kích thước đo thực, kết cấu và xác nhận nghệ nhân để có nguồn tri thức kiểm chứng được. Việc lưu ảnh vào thư mục không tự huấn luyện AI và ảnh AI tham khảo không tự loại bỏ hallucination. Khi xuất thiết kế, giữ bước đối chiếu dữ liệu nghề, kiểm tra ảnh và nghệ nhân xác nhận như định hướng của dự án.
