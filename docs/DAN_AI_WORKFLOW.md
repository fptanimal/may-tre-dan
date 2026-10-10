# Quy trình Đan AI trong giao diện hiện tại

Bản cập nhật ngày 10/10/2026 chỉ nối lại xử lý sau nút **Tạo thiết kế**. Giữ thanh điều hướng, hình nền, bố cục, gợi ý, lựa chọn phong cách/kích cỡ/kiểu đan/hoàn thiện, cửa sổ camera, trình sửa và Design Studio. Dòng chờ hiện tại hiển thị bước thật; ba nút nhỏ ngay trong khung ảnh chọn chính diện, góc bên, phía sau. Không tạo trang quản trị hoặc bảng điều khiển mới.

## Dữ liệu

Database tri thức là các file JSON có cấu trúc, được lưu lâu dài cùng dự án và đóng gói cho API Edge:

- `data/dan-ai/catalog.json`: 10 loại sản phẩm, 8 vật liệu theo vai trò, 4 nhóm kiểu đan, hình dạng, màu và hoàn thiện; quan hệ theo loại sản phẩm; bộ phận, rủi ro và nguồn.
- `data/dan-ai/policy.json`: 38 rule, 49 mục checklist nhập từ tài liệu chủ dự án đã cung cấp; có hash nguồn và phiên bản.
- `server/dan-ai/knowledge.js`: tra cứu bản ghi, kiểm tra mã và quan hệ, vật liệu theo bộ phận, giới hạn kích thước đã xác minh nếu được bổ sung.

Đây là kho dữ liệu JSON đọc bởi máy chủ, không phải database SQL hoặc dữ liệu model tự nghĩ ra mỗi lần. Tập ứng viên minh họa có nhãn chưa được nghệ nhân xác minh. Báo cáo trang 7 cho phép biểu diễn tri thức bằng bảng/JSON. Danh mục dùng nguồn báo cáo, nhãn hiện có và những đề xuất được gắn `concept-seed`; không trình bày đề xuất như thực nghiệm đã xác minh.

Các bảng `verifiedLimits`, `verifiedCompatibility`, `workshopCapabilities`, `verifiedEstimates` hiện rỗng vì chưa có hồ sơ kỹ thuật xác nhận đi kèm. Sáu nhóm chế tác giữ `manual_review`; không suy ra tải trọng, bán kính uốn, giá, kg hoặc giờ công từ ảnh. Dự toán ngẫu nhiên trong luồng tạo ảnh cũ đã được bỏ; các trường thiếu chứng cứ trả `null`. Chức năng này không tự xác nhận an toàn hoặc khả năng sản xuất.

Muốn mở rộng: thêm bản ghi vào JSON và tăng phiên bản. Không cần sửa mã lõi để thêm loại sản phẩm theo cùng cấu trúc. `verifiedLimits` chỉ có hiệu lực khi có `verified`, `confirmedBy`, `evidenceId`, `validUntil` hợp lệ, `axis`, `minMm`, `maxMm`, và phạm vi khớp `productType`, `weaveId`, `shape`, `frameMaterial`, `materialId`. Không điền giới hạn giả để biến kiểm tra thành đạt. Các bảng năng lực/tương thích dành cho bổ sung sau, chưa có bộ máy tự phê duyệt chế tác từ chúng.

Nhập lại tài liệu rule bằng `node scripts/build-dan-knowledge.mjs <đường-dẫn-Markdown>`. Script kiểm tra đủ 38/49 và tham chiếu rule hợp lệ. Nếu sửa nguồn, tăng phiên bản policy/workflow tương ứng trước khi phát hành.

## Bảy bước thực thi

1. Gemini phân tích mô tả và byte ảnh phòng thật, trích xuất thuộc tính, yêu cầu bắt buộc, giả định và câu hỏi. Thiếu loại/công dụng hoặc mâu thuẫn thiết yếu thì dừng hỏi ngay trong khung kết quả. Nhãn nhỏ/vừa/lớn không được biến thành số đo thật. Số đo có số phải trích dẫn văn bản khách và đơn vị.
2. Tra cứu database theo mã loại sản phẩm, vật liệu, kiểu đan, hình dạng, công dụng và hoàn thiện. Tổ hợp ngoài danh mục bị chặn. Lựa chọn hiện tại của khách phải khớp hồ sơ phân tích.
3. Ghi sáu nhóm kiểm tra vật liệu, kiểu đan, kích thước, hình dạng, kết cấu, năng lực chế tác. Không bỏ qua giới hạn đã xác minh; thiếu chứng cứ vật lý được giữ chờ nghệ nhân.
4. Tạo ảnh chính nội bộ. Lần gọi thị giác riêng đọc đúng byte ảnh, kèm checklist/rule, lý do và mã/hash ảnh làm bằng chứng.
5. Sinh góc bên và sau với ảnh chính làm tham chiếu. Kiểm tra cả ba ảnh trong một lần đối chiếu; ảnh trùng byte hoặc không rõ sự nhất quán đều không được xuất.
6. Đối chiếu lại sáu nhóm, checklist hình ảnh, tỷ lệ/bố cục, nhịp điệu đan, phong cách, cá nhân hóa và màu với ảnh phòng. Lỗi/bất định hình ảnh không được ghi đạt. Nếu không đạt, thử sửa tối đa một lần dưới revision mới và chạy lại từ bước 1; giữ nhật ký lần bị loại.
7. Kiểm tra đủ bảy bước, 49 kết quả đúng revision/hash, ba góc khác nhau, toàn bộ kiểm tra thị giác đạt. Chỉ lúc này gửi ảnh về trình duyệt, kèm nhãn `concept_only`, `pending_artisan` và phần cần xác nhận.

Các bước tiến triển được stream NDJSON từ API, không dùng bộ đếm thời gian giả. Sự kiện trước `complete` không chứa ảnh ứng viên. Người dùng sửa qua các nút cũ sẽ dùng ảnh chính đã có làm tham chiếu và chạy lại toàn bộ kiểm tra. Không tái sử dụng kết quả duyệt cũ.

Hồ sơ kiểm tra trả trong `specs.workflow`; kết quả chỉ nằm trong phiên trang hiện tại. Không thêm lịch sử tài khoản, lưu ảnh cloud hay thay luồng đặt nghệ nhân hiện có. Đóng trang sẽ hủy yêu cầu phía trình duyệt; việc hủy không bảo đảm nhà cung cấp ngừng tính phí ngay.

## Gemini và vận hành

Phần đọc `GEMINI_API_KEY2`, `GEMINI_API_KEY` và khóa dự phòng hiện có được giữ nguyên từng biểu thức. Không sửa `.env`, chatbot hay khóa. Model phân tích giữ nguyên `gemini-3.5-flash-lite`. Sau khi chủ dự án đồng ý sửa tiếp, chỉ model ảnh đổi sang `gemini-nano-banana-2.1`. Không còn trả ảnh Pollinations để giả thành kết quả Gemini khi lỗi; lỗi API hoặc bộ kiểm tra đều dừng trước khi xuất ảnh.

Model cũ `gemini-2.0-flash` ngừng phục vụ ngày 01/06/2026 theo [thông báo của Google](https://ai.google.dev/gemini-api/docs/deprecations). Model thay thế hỗ trợ tạo ảnh, ảnh tham chiếu và chỉnh sửa; giao thức `generateContent` được đối chiếu với [tài liệu Google](https://ai.google.dev/gemini-api/docs/generate-content/image-generation). Quyền truy cập model và hạn mức của khóa thực tế chưa được xác minh.

Phép thử live bằng khóa mã hóa trong mã nguồn đã bị hệ thống xét duyệt tự động chặn cả sau yêu cầu tiếp tục triển khai: cần chủ dự án cho phép rõ việc đọc/giải mã khóa hiện có và gửi khóa trong header xác thực tới Google để kiểm tra kết nối, tạo ảnh thử (có thể tính phí). Không thực hiện đường vòng. Không có ảnh Gemini thật nào được tạo trong kiểm thử. Test dùng nhà cung cấp giả lập, không phải bằng chứng chất lượng ảnh thực tế.

Local: `npm run dev`; Vite đã có bộ nối cho riêng `/api/ai/design`. `vite preview` chỉ phục vụ bản frontend. Production giữ Edge runtime. Rewrite chỉ loại riêng API thiết kế khỏi đường dẫn SPA. Phản hồi stream bắt đầu ngay; thời hạn ứng dụng 270 giây, dưới [giới hạn stream Edge của Vercel](https://vercel.com/docs/functions/runtimes/edge). Có tối đa 3 yêu cầu xử lý đồng thời trong một instance, không phải hạn mức toàn hệ thống. Một lần bấm có tối đa 2 bộ ứng viên/6 ảnh; giới hạn thời gian có thể dừng sớm hơn.

Ảnh phòng/ảnh tham chiếu được chuẩn hóa JPEG tối đa 1200 px, bỏ metadata, giới hạn dung lượng trước khi gửi. API chỉ nhận ảnh inline đã kiểm tra MIME/chữ ký; không tải URL tùy ý. Cửa sổ camera hiện tại giữ nguyên; phần tải ảnh của Đan AI đã nối dữ liệu ảnh thật thay cho `mock-url`.

## Kiểm thử và hoàn tác

`node --test tests/dan-workflow.test.mjs` kiểm tra bảy bước, dữ liệu/quan hệ, khóa xuất ảnh, evidence/hash, ảnh phòng, revision, retry có giới hạn, lỗi API, dòng phản hồi và sự nguyên vẹn cấu hình cũ. Fixture là PNG nhân tạo, tuyệt đối không dùng làm ảnh minh chứng dự án.

Chạy Vite tại cổng 5178 rồi `node tests/dan-workflow.browser.mjs` để kiểm tra trang hiện tại qua proxy localhost. Chỉ endpoint thiết kế dùng workflow thật với provider giả lập; không đọc khóa hoặc gửi yêu cầu Gemini. Chrome dùng camera giả lập để kiểm tra đường video/canvas/file thật. Kiểm tra webcam vật lý và bộ ảnh thực tế vẫn cần thực hiện sau.

Mốc gốc: commit `bacbea3`. Bản sao trước sửa: `../dan-ai-before-20261010`. Chỉ bốn file có sẵn được sửa: `src/pages/AIDesignPage.jsx`, `api/ai/design.js`, `vite.config.js`, `vercel.json`. File mới thuộc `server/dan-ai`, `data/dan-ai`, `src/lib/danWorkflow.js`, script nhập, test và tài liệu này. Khi hoàn tác phải đối chiếu những sửa đổi mới của người dùng; không reset toàn repo hoặc khôi phục bản trước ngày 10/10. Chưa deploy/push bản cập nhật.
