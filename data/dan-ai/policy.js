export default {
  "version": "1.0.0",
  "workflowVersion": "1.0.0",
  "scope": "active_concept_only",
  "sourceStatus": "proposal_not_artisan_verified",
  "sourceSha256": "5fb0d30b42c9c95c850c2b00f16eb029ab1a88d463aca57cfb3a3fa648a81485",
  "rules": [
    {
      "id": "MAT01",
      "title": "Định danh vật liệu",
      "group": "MAT",
      "description": "Mỗi bộ phận phải có mã vật liệu, vai trò và nguồn thông tin. Phân biệt vật liệu đan với vật liệu khung, dây, keo và phụ kiện.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "deterministic",
      "severity": "blocking",
      "evidence": "Danh mục vật liệu có nguồn; bảng vật liệu theo bộ phận.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "MAT02",
      "title": "Tương thích vật liệu và công dụng",
      "group": "MAT",
      "description": "Đối chiếu tổ hợp vật liệu với công dụng và cấu tạo đúng phạm vi đã được nghệ nhân xác nhận; không coi mây, tre, nứa, giang là thay thế tương đương.",
      "stages": [
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Phiếu tương thích có người xác nhận và phạm vi áp dụng.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "MAT03",
      "title": "Quy cách nan và vật tư",
      "group": "MAT",
      "description": "Bề rộng, bề dày nan, quy cách thanh và vật tư phụ phải thực hiện được tại xưởng. Ảnh chỉ biểu diễn bề mặt, không chứng minh quy cách thực.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Quy cách đã duyệt và xác nhận nguồn vật tư.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "MAT04",
      "title": "Màu và hoàn thiện",
      "group": "MAT",
      "description": "Hoàn thiện phải tương thích vật liệu và công dụng. Hình ảnh có thể minh họa màu; không được suy ra loại hóa chất hoặc tính năng lớp phủ từ ảnh.",
      "stages": [
        3,
        4,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Quy trình hoàn thiện được xưởng xác nhận; ảnh so với bảng màu.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "WEA01",
      "title": "Chuẩn hóa tên kiểu đan",
      "group": "WEA",
      "description": "Dùng mã kỹ thuật kèm ảnh mẫu và tên nghệ nhân xác nhận. Các tên xương cá, mắt cáo, nong, nan trên giao diện chỉ là nhãn tham khảo khi chưa chuẩn hóa.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "deterministic",
      "severity": "blocking",
      "evidence": "Hồ sơ kỹ thuật đan có mã và ảnh mẫu.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "WEA02",
      "title": "Tổ hợp kiểu đan và vật liệu",
      "group": "WEA",
      "description": "Kiểm tra tổ hợp kỹ thuật, quy cách nan và hình dạng theo mẫu đã duyệt. Không tự suy rộng khả năng từ một mẫu sang mọi sản phẩm.",
      "stages": [
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Bảng tương thích và mẫu chế tác đúng phạm vi.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "WEA03",
      "title": "Mật độ và kết thúc mép",
      "group": "WEA",
      "description": "Khe đan và cách khóa mép phù hợp công dụng; có giải pháp cho miệng, đáy, góc, quai và vùng đổi kiểu đan.",
      "stages": [
        3,
        4,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Chi tiết mép và mật độ đan được duyệt; ảnh để kiểm tra biểu hiện nhìn thấy.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "DIM01",
      "title": "Kích thước có đơn vị và nguồn",
      "group": "DIM",
      "description": "Số đo phải dương, có đơn vị và ý nghĩa trục. Đánh dấu số đo do khách đo, do xưởng xác nhận hay AI đề xuất. Không đo kích thước thật từ một ảnh phòng thiếu mốc chuẩn.",
      "stages": [
        1,
        2,
        3,
        6,
        7
      ],
      "evaluator": "deterministic",
      "severity": "blocking",
      "evidence": "Kích thước theo trục hoặc đường kính; nguồn của từng số đo.",
      "missing": "request_input",
      "failure": "request_input",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "DIM02",
      "title": "Khoảng kích thước đúng mẫu",
      "group": "DIM",
      "description": "So sánh với min/max đã xác nhận cho loại sản phẩm, vật liệu, kiểu đan và khung cụ thể. Nhãn nhỏ/vừa/lớn không phải giới hạn chế tác chung.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "deterministic",
      "severity": "blocking",
      "evidence": "Giới hạn còn hiệu lực, người duyệt và phạm vi trùng khớp.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "DIM03",
      "title": "Dung sai và lắp khớp",
      "group": "DIM",
      "description": "Nắp, bản lề, phụ kiện, vật lót và bộ phận ghép có kích thước lắp và dung sai được chấp nhận. Số đo kỹ thuật trong hồ sơ là nguồn chuẩn, không lấy từ chữ AI vẽ trên ảnh.",
      "stages": [
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Bản kích thước lắp và dung sai được xưởng xác nhận.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "DIM04",
      "title": "Phù hợp vị trí đặt",
      "group": "DIM",
      "description": "Đối chiếu không gian đặt, lối vận chuyển và thao tác sử dụng khi có số đo thật. Nếu chỉ có ảnh, ghi rõ phối cảnh và kích thước đề xuất chưa xác nhận.",
      "stages": [
        1,
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Ảnh phòng; số đo vị trí đặt hoặc ghi nhận chưa có số đo.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "GEO01",
      "title": "Hình dạng chế tác được",
      "group": "GEO",
      "description": "Cấu tạo có phương án đan, khóa mép và lắp ráp; không tự chấp nhận chi tiết xuyên nhau, lơ lửng hoặc thể tích kín không có đường gia công.",
      "stages": [
        3,
        4,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Mẫu tương tự đã chế tác và giải thích trình tự làm.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "GEO02",
      "title": "Giới hạn uốn cong",
      "group": "GEO",
      "description": "Bán kính uốn và độ xoắn được duyệt theo vật liệu, tiết diện, xử lý và thiết bị. Không tự đặt một ngưỡng bán kính chung cho cả mây, tre, nứa, giang.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Thử uốn hoặc quy trình và thông số đã xác nhận tại xưởng.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "GEO03",
      "title": "Khuôn và tiếp cận gia công",
      "group": "GEO",
      "description": "Có khuôn nếu cần, có đường tiếp cận để đan và có thể tháo hoặc lắp các chi tiết theo trình tự thực tế.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Phương án khuôn và quy trình gia công được xưởng duyệt.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "STR01",
      "title": "Tách lớp đan và khung",
      "group": "STR",
      "description": "Hồ sơ nêu bộ phận chịu lực, lớp đan, chân, quai và liên kết. Không coi lớp đan trong ảnh là bằng chứng thay thế khung chịu lực.",
      "stages": [
        3,
        4,
        5,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Sơ đồ kết cấu và vật liệu theo bộ phận được duyệt.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "STR02",
      "title": "Liên kết và ổn định",
      "group": "STR",
      "description": "Xưởng xác nhận loại liên kết, chống lật, chống tuột và cách treo/lắp theo công dụng. AI chỉ phát hiện dấu hiệu bất thường nhìn thấy được.",
      "stages": [
        3,
        4,
        6
      ],
      "evaluator": "artisan",
      "severity": "critical",
      "evidence": "Chi tiết liên kết và kết quả xác nhận hoặc thử mẫu.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "STR03",
      "title": "Chịu tải và thử nghiệm",
      "group": "STR",
      "description": "Sản phẩm chịu lực hoặc treo phải có yêu cầu tải, kế hoạch thử và bằng chứng phù hợp trước khi được xác nhận sử dụng an toàn. Không suy ra tải từ ảnh.",
      "stages": [
        3,
        4,
        6
      ],
      "evaluator": "artisan",
      "severity": "critical",
      "evidence": "Yêu cầu sử dụng, thử mẫu và kết quả của người có chuyên môn phù hợp.",
      "missing": "manual_review",
      "failure": "block_manufacturing",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "STR04",
      "title": "Mức thay đổi kết cấu",
      "group": "STR",
      "description": "Xếp loại C0 giữ cấu tạo mẫu; C1 thay đổi trong phạm vi được duyệt; C2 thay đổi hình dạng/liên kết; C3 chịu lực, điện, trẻ em hoặc kỹ thuật mới. C2/C3 luôn cần duyệt chuyên môn và xem xét làm mẫu.",
      "stages": [
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "So sánh phiên bản mới với mẫu gốc; lý do xếp loại.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "CAP01",
      "title": "Năng lực đúng sản phẩm",
      "group": "CAP",
      "description": "Nghệ nhân/xưởng xác nhận kỹ thuật và cấu tạo cụ thể. Tiểu sử, rating, kỹ năng khai báo và cờ available trong catalog chỉ giúp tìm ứng viên.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Xác nhận chuyên môn theo phạm vi và người chịu trách nhiệm.",
      "missing": "manual_review",
      "failure": "block_manufacturing",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "CAP02",
      "title": "Thiết bị và nguồn vật tư",
      "group": "CAP",
      "description": "Có thiết bị uốn, khuôn, xử lý bề mặt, liên kết và vật tư cần thiết hoặc đối tác đã xác nhận.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Phiếu năng lực xưởng và xác nhận vật tư theo thiết kế.",
      "missing": "manual_review",
      "failure": "block_manufacturing",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "CAP03",
      "title": "Số lượng và tiến độ",
      "group": "CAP",
      "description": "Xưởng xác nhận số lượng, lịch làm mẫu và lịch giao thực tế. Số ngày có sẵn trong hồ sơ bán hàng không tự trở thành cam kết cho thiết kế mới.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Xác nhận đơn cụ thể và ngày cập nhật.",
      "missing": "manual_review",
      "failure": "block_manufacturing",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "SYS01",
      "title": "Đầu vào đủ để hiểu yêu cầu",
      "group": "SYS",
      "description": "Có prompt hoặc ảnh đọc được; xác định loại sản phẩm, công dụng và chi tiết bắt buộc. Nếu ảnh phòng không chỉ rõ muốn làm gì, hỏi thêm. Phân biệt mô hình trang trí với thiết bị hoạt động thật.",
      "stages": [
        1
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Yêu cầu khách, kết quả phân tích ảnh và các câu trả lời bổ sung.",
      "missing": "request_input",
      "failure": "request_input",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "SYS02",
      "title": "Nguồn context và phiên bản",
      "group": "SYS",
      "description": "Chỉ dùng rule/context do hệ thống cung cấp theo phiên bản được kích hoạt. Tách lời khách và nội dung ảnh khỏi chính sách. Nguồn catalog chưa xác minh không được nâng thành bằng chứng chế tác.",
      "stages": [
        2,
        3,
        6
      ],
      "evaluator": "deterministic",
      "severity": "critical",
      "evidence": "Danh sách context, trạng thái xác minh, phiên bản rule và dấu kiểm toàn vẹn.",
      "missing": "stop_pipeline",
      "failure": "stop_pipeline",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "SYS03",
      "title": "Không bỏ qua bước khi lỗi",
      "group": "SYS",
      "description": "Mỗi bước có nhật ký và kết quả. Lỗi, timeout, thiếu evaluator hoặc fallback đổi nhà cung cấp không được coi là pass. Ảnh từ fallback vẫn qua cùng toàn bộ kiểm tra.",
      "stages": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "evaluator": "deterministic",
      "severity": "critical",
      "evidence": "Nhật ký bảy bước, lỗi và thử lại.",
      "missing": "stop_pipeline",
      "failure": "stop_pipeline",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "SYS04",
      "title": "Mọi thay đổi tạo phiên bản mới",
      "group": "SYS",
      "description": "Thay đổi prompt, vật liệu, kích thước, cấu tạo hoặc bất kỳ ảnh nào làm mất hiệu lực các kết quả liên quan và duyệt cũ. Chạy lại chuỗi bị ảnh hưởng trên phiên bản mới.",
      "stages": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "evaluator": "deterministic",
      "severity": "critical",
      "evidence": "Mã thiết kế, revision, hash hồ sơ và hash từng ảnh.",
      "missing": "stop_pipeline",
      "failure": "stop_pipeline",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "SYS05",
      "title": "Tách hiển thị và xác nhận chế tác",
      "group": "SYS",
      "description": "Cho phép ảnh ý tưởng khi kiểm tra hình ảnh đạt nhưng còn mục chế tác cần duyệt; phải hiển thị nhãn và danh sách chưa xác minh. AI không được đặt manufacturing_status thành artisan_approved.",
      "stages": [
        4,
        5,
        6,
        7
      ],
      "evaluator": "deterministic",
      "severity": "critical",
      "evidence": "Điều kiện xuất ảnh và sự kiện duyệt bởi người được phân quyền.",
      "missing": "stop_pipeline",
      "failure": "stop_pipeline",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "USE01",
      "title": "Phân loại công dụng có rủi ro",
      "group": "USE",
      "description": "Gắn cờ chịu lực, treo, điện/nhiệt, trẻ em, tiếp xúc thực phẩm, ngoài trời/ẩm và chứa nước theo công dụng thực; một đèn trong mục office vẫn chịu kiểm tra đèn.",
      "stages": [
        1,
        3,
        6
      ],
      "evaluator": "mixed",
      "severity": "critical",
      "evidence": "Mô tả công dụng và cờ kiểm tra được xác nhận.",
      "missing": "request_input",
      "failure": "request_input",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "USE02",
      "title": "Duyệt chuyên môn theo công dụng",
      "group": "USE",
      "description": "Công dụng điện, chịu lực, treo, trẻ em hoặc thực phẩm cần người có chuyên môn phù hợp và kiểm tra thực tế theo yêu cầu sử dụng. Nghệ nhân duyệt hình thức không thay thế thử nghiệm cần thiết.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "critical",
      "evidence": "Hồ sơ kiểm tra công dụng, người xác nhận và kết quả thực tế.",
      "missing": "manual_review",
      "failure": "block_manufacturing",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "USE03",
      "title": "Điều kiện môi trường",
      "group": "USE",
      "description": "Khả năng dùng ngoài trời, nơi ẩm, gần nhiệt hoặc giữ nước phải có giải pháp được xác nhận. Với bình mây, xác định có bình lót nếu cần giữ nước.",
      "stages": [
        3,
        6
      ],
      "evaluator": "artisan",
      "severity": "blocking",
      "evidence": "Giải pháp lớp phủ/vật lót, môi trường sử dụng và xác nhận xưởng.",
      "missing": "manual_review",
      "failure": "revise_design",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "VIS01",
      "title": "Ảnh chính bám hồ sơ",
      "group": "VIS",
      "description": "Ảnh chính đúng loại sản phẩm, hình dáng, số bộ phận và yêu cầu bắt buộc. Kiểm tra phải nhận chính ảnh đầu ra, không chỉ đọc prompt hay mô tả AI.",
      "stages": [
        4,
        6
      ],
      "evaluator": "vision",
      "severity": "blocking",
      "evidence": "Ảnh chính, hồ sơ thiết kế, vùng ảnh hoặc mô tả quan sát.",
      "missing": "human_visual_review",
      "failure": "regenerate_image",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "VIS02",
      "title": "Không có lỗi hình học nhìn thấy",
      "group": "VIS",
      "description": "Kiểm tra chân/quai thừa, chi tiết đứt, bộ phận xuyên nhau, vùng đan bất thường và vật thể lơ lửng. Vùng bị che hoặc quá mờ là chưa xác minh.",
      "stages": [
        4,
        5,
        6
      ],
      "evaluator": "vision",
      "severity": "blocking",
      "evidence": "Quan sát từng ảnh và chi tiết cần sửa.",
      "missing": "human_visual_review",
      "failure": "regenerate_image",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "VIS03",
      "title": "Ba góc của cùng một thiết kế",
      "group": "VIS",
      "description": "Ảnh front, side, rear dùng cùng hồ sơ và ảnh chính làm tham chiếu. Có đủ ba tài sản ảnh khác nhau, góc nhìn thực sự khác; nền phòng không được làm che chi tiết cần kiểm.",
      "stages": [
        5,
        6,
        7
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Ba ảnh có vai trò, mã tài sản, hash và ghi nhận góc nhìn.",
      "missing": "human_visual_review",
      "failure": "regenerate_image",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "VIS04",
      "title": "Nhất quán giữa các góc",
      "group": "VIS",
      "description": "Đối chiếu số chân/quai, khung, nắp, chân đế, đường bao, bố trí hoa văn và bảng màu theo góc. Chi tiết mới ở mặt sau phải phù hợp hồ sơ, không được AI tự sáng chế kết cấu.",
      "stages": [
        5,
        6
      ],
      "evaluator": "vision",
      "severity": "blocking",
      "evidence": "Đối chiếu cả ba ảnh với cùng hồ sơ; danh sách chênh lệch.",
      "missing": "human_visual_review",
      "failure": "regenerate_image",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "ART01",
      "title": "Tỷ lệ và bố cục",
      "group": "ART",
      "description": "Tỷ lệ thân, miệng, đế và chi tiết phụ có chủ ý; sản phẩm rõ ràng, không méo hình hoặc bị phối cảnh che mất bố cục.",
      "stages": [
        6
      ],
      "evaluator": "vision",
      "severity": "quality",
      "evidence": "Nhận xét theo rubric và vùng ảnh liên quan.",
      "missing": "human_visual_review",
      "failure": "revise_visual",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "ART02",
      "title": "Nhịp điệu đan và bản sắc",
      "group": "ART",
      "description": "Hoa văn và nhịp đan có sự liên tục phù hợp thiết kế; bề mặt biểu đạt ý đồ thủ công. Không yêu cầu mọi mẫu bất đối xứng phải trở thành đối xứng.",
      "stages": [
        6
      ],
      "evaluator": "vision",
      "severity": "quality",
      "evidence": "Ảnh tham chiếu kỹ thuật và lý do đánh giá thẩm mỹ.",
      "missing": "human_visual_review",
      "failure": "revise_visual",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "ART03",
      "title": "Cá nhân hóa đúng yêu cầu",
      "group": "ART",
      "description": "Chi tiết cá nhân hóa và phong cách đã chốt được thể hiện; không sao chép máy móc mẫu gốc, không thêm chi tiết trái nhu cầu.",
      "stages": [
        1,
        4,
        5,
        6
      ],
      "evaluator": "mixed",
      "severity": "quality",
      "evidence": "Danh sách yêu cầu bắt buộc và ưu tiên của khách; so sánh với ảnh.",
      "missing": "request_input",
      "failure": "revise_visual",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "ART04",
      "title": "Màu sắc phù hợp không gian",
      "group": "ART",
      "description": "Bảng màu, chất cảm và mức trang trí phù hợp phong cách đã chốt và ảnh phòng nếu có; đánh giá thẩm mỹ là nhận xét có lý do, không phải chứng nhận chất lượng vật liệu.",
      "stages": [
        6
      ],
      "evaluator": "vision",
      "severity": "quality",
      "evidence": "Ảnh phòng hoặc phong cách khách chọn; bảng màu và nhận xét.",
      "missing": "human_visual_review",
      "failure": "revise_visual",
      "sourceId": "owner-rules-20261008"
    },
    {
      "id": "EST01",
      "title": "Dự toán có căn cứ",
      "group": "EST",
      "description": "Chỉ công bố dự toán khi có định mức, đơn giá và nguồn thời gian phù hợp. Thiếu dữ liệu thì báo chưa có dự toán; không dùng số ngẫu nhiên hoặc giá mặc định làm báo giá xác nhận.",
      "stages": [
        3,
        6,
        7
      ],
      "evaluator": "mixed",
      "severity": "blocking",
      "evidence": "Định mức, đơn giá có ngày cập nhật, công thức và người xác nhận khi chốt.",
      "missing": "omit_unverified_estimate",
      "failure": "omit_unverified_estimate",
      "sourceId": "owner-rules-20261008"
    }
  ],
  "checklist": [
    {
      "id": "S1C01",
      "stage": 1,
      "question": "Có prompt hoặc ảnh phòng thực sự đọc được không?",
      "acceptance": "Dữ liệu đầu vào hợp lệ và ảnh đã được đưa cho bộ phân tích ảnh nếu có.",
      "ruleIds": [
        "SYS01"
      ]
    },
    {
      "id": "S1C02",
      "stage": 1,
      "question": "Đã biết loại sản phẩm và công dụng thực tế chưa?",
      "acceptance": "Phân biệt vật trang trí, thiết bị thật và sản phẩm dùng để chịu lực.",
      "ruleIds": [
        "SYS01",
        "USE01"
      ]
    },
    {
      "id": "S1C03",
      "stage": 1,
      "question": "Đã tách yêu cầu bắt buộc khỏi sở thích chưa?",
      "acceptance": "Khách có thể nhận biết các giả định và các yêu cầu bắt buộc.",
      "ruleIds": [
        "SYS01",
        "ART03"
      ]
    },
    {
      "id": "S1C04",
      "stage": 1,
      "question": "Số đo có đơn vị và nguồn; số đo thiếu đã được đánh dấu chưa?",
      "acceptance": "Số đo đã có được chuẩn hóa; số AI đề xuất được gắn proposed_unconfirmed.",
      "ruleIds": [
        "DIM01",
        "DIM04"
      ]
    },
    {
      "id": "S1C05",
      "stage": 1,
      "question": "Đã gắn các cờ công dụng đặc biệt chưa?",
      "acceptance": "Chịu lực, treo, điện, trẻ em, thực phẩm, ẩm/ngoài trời, giữ nước đều được xem xét.",
      "ruleIds": [
        "USE01"
      ]
    },
    {
      "id": "S1C06",
      "stage": 1,
      "question": "Có mâu thuẫn quan trọng cần hỏi khách trước khi tiếp tục không?",
      "acceptance": "Không còn mâu thuẫn về loại sản phẩm, công dụng hoặc chi tiết bắt buộc.",
      "ruleIds": [
        "SYS01",
        "ART03"
      ]
    },
    {
      "id": "S2C01",
      "stage": 2,
      "question": "Rule set và workflow có cùng phiên bản được kích hoạt không?",
      "acceptance": "Không dùng draft hoặc phiên bản trộn lẫn trong một lần chạy.",
      "ruleIds": [
        "SYS02"
      ]
    },
    {
      "id": "S2C02",
      "stage": 2,
      "question": "Đã lấy đúng context theo loại sản phẩm, vật liệu và công dụng chưa?",
      "acceptance": "Có danh sách context và ghi nguồn; chỉ nguồn xác minh dùng cho kết luận chế tác.",
      "ruleIds": [
        "SYS02",
        "MAT01",
        "WEA01"
      ]
    },
    {
      "id": "S2C03",
      "stage": 2,
      "question": "Dữ liệu catalog chưa xác minh đã được tách khỏi bằng chứng chế tác chưa?",
      "acceptance": "Catalog chỉ dùng gợi ý mẫu hoặc tìm ứng viên.",
      "ruleIds": [
        "SYS02",
        "CAP01"
      ]
    },
    {
      "id": "S2C04",
      "stage": 2,
      "question": "Đã lập hồ sơ thiết kế có revision và ghi các giả định chưa?",
      "acceptance": "Hồ sơ có phiên bản; thông số được phân biệt confirmed và proposed_unconfirmed.",
      "ruleIds": [
        "SYS04",
        "DIM01"
      ]
    },
    {
      "id": "S2C05",
      "stage": 2,
      "question": "Các giới hạn thiếu hoặc xung đột đã được liệt kê chưa?",
      "acceptance": "Không tự điền ngưỡng chế tác; xung đột nguồn chuyển người duyệt.",
      "ruleIds": [
        "SYS02",
        "DIM02",
        "GEO02"
      ]
    },
    {
      "id": "S3C01",
      "stage": 3,
      "question": "Vật liệu theo bộ phận và hoàn thiện phù hợp phạm vi được xác nhận?",
      "acceptance": "Tổ hợp hợp lệ theo bằng chứng hoặc manual_review có lý do.",
      "ruleIds": [
        "MAT01",
        "MAT02",
        "MAT03",
        "MAT04"
      ]
    },
    {
      "id": "S3C02",
      "stage": 3,
      "question": "Kiểu đan, mật độ và khóa mép phù hợp cấu tạo?",
      "acceptance": "Có mã kỹ thuật và phạm vi tương thích hoặc ghi cần nghệ nhân xác nhận.",
      "ruleIds": [
        "WEA01",
        "WEA02",
        "WEA03"
      ]
    },
    {
      "id": "S3C03",
      "stage": 3,
      "question": "Kích thước, dung sai và vị trí đặt phù hợp?",
      "acceptance": "Không vi phạm giới hạn đã xác nhận; không biến ảnh phòng thành số đo thật.",
      "ruleIds": [
        "DIM01",
        "DIM02",
        "DIM03",
        "DIM04"
      ]
    },
    {
      "id": "S3C04",
      "stage": 3,
      "question": "Hình dạng, uốn cong và khuôn có phương án thực hiện?",
      "acceptance": "Có căn cứ chế tác hoặc điểm chưa đủ dữ liệu được giữ ở manual_review.",
      "ruleIds": [
        "GEO01",
        "GEO02",
        "GEO03"
      ]
    },
    {
      "id": "S3C05",
      "stage": 3,
      "question": "Khung, liên kết, độ phức tạp và yêu cầu tải đã được xét?",
      "acceptance": "Xếp C0-C3 có lý do; các kiểm tra vật lý chưa làm không được ghi pass.",
      "ruleIds": [
        "STR01",
        "STR02",
        "STR03",
        "STR04"
      ]
    },
    {
      "id": "S3C06",
      "stage": 3,
      "question": "Năng lực xưởng, thiết bị, vật tư và tiến độ đã được xét?",
      "acceptance": "Có xác nhận phạm vi cụ thể hoặc chuyển manual_review.",
      "ruleIds": [
        "CAP01",
        "CAP02",
        "CAP03"
      ]
    },
    {
      "id": "S3C07",
      "stage": 3,
      "question": "Công dụng đặc biệt và môi trường có yêu cầu duyệt phù hợp?",
      "acceptance": "Lập yêu cầu kiểm tra thực tế cho công dụng áp dụng.",
      "ruleIds": [
        "USE01",
        "USE02",
        "USE03"
      ]
    },
    {
      "id": "S3C08",
      "stage": 3,
      "question": "Có dữ liệu đủ để công bố dự toán không?",
      "acceptance": "Có nguồn định mức và giá; nếu thiếu thì không công bố số tiền/giờ chưa xác minh.",
      "ruleIds": [
        "EST01"
      ]
    },
    {
      "id": "S4C01",
      "stage": 4,
      "question": "Ảnh được tạo từ đúng hồ sơ và context đã chốt?",
      "acceptance": "Hash hồ sơ và revision khớp đầu vào tạo ảnh.",
      "ruleIds": [
        "SYS04",
        "VIS01"
      ]
    },
    {
      "id": "S4C02",
      "stage": 4,
      "question": "Bộ kiểm tra đã nhận chính ảnh đầu ra?",
      "acceptance": "Có asset_id/hash và ghi nhận ảnh đã được đưa vào bộ đọc ảnh.",
      "ruleIds": [
        "VIS01"
      ]
    },
    {
      "id": "S4C03",
      "stage": 4,
      "question": "Ảnh đúng loại sản phẩm và công dụng biểu đạt?",
      "acceptance": "Không biến yêu cầu thành một loại sản phẩm khác.",
      "ruleIds": [
        "VIS01"
      ]
    },
    {
      "id": "S4C04",
      "stage": 4,
      "question": "Hình dáng và bộ phận nhìn thấy khớp hồ sơ?",
      "acceptance": "Không thừa/thiếu chân, quai, nắp, đế hoặc bộ phận chủ chốt nhìn thấy.",
      "ruleIds": [
        "VIS01",
        "VIS02"
      ]
    },
    {
      "id": "S4C05",
      "stage": 4,
      "question": "Có chi tiết xuyên nhau, đứt đoạn hoặc lơ lửng không?",
      "acceptance": "Không có lỗi nhìn thấy; vùng che/mờ không được coi đã xác minh.",
      "ruleIds": [
        "VIS02",
        "GEO01"
      ]
    },
    {
      "id": "S4C06",
      "stage": 4,
      "question": "Biểu hiện kiểu đan và hoàn thiện có bám thiết kế không?",
      "acceptance": "Không có sai lệch nhìn thấy; không suy ra vật liệu thật hoặc lớp phủ thật.",
      "ruleIds": [
        "WEA03",
        "MAT04",
        "VIS01"
      ]
    },
    {
      "id": "S4C07",
      "stage": 4,
      "question": "Chi tiết cá nhân hóa bắt buộc đã có đủ chưa?",
      "acceptance": "Đối chiếu từng yêu cầu bắt buộc với ảnh.",
      "ruleIds": [
        "ART03"
      ]
    },
    {
      "id": "S4C08",
      "stage": 4,
      "question": "Nhận xét chế tác trước đó có bị nâng lên thành xác nhận bởi ảnh không?",
      "acceptance": "Kết quả kiểm tra vật lý vẫn giữ trạng thái cần nghệ nhân xác nhận.",
      "ruleIds": [
        "SYS05",
        "STR03"
      ]
    },
    {
      "id": "S5C01",
      "stage": 5,
      "question": "Hai ảnh bổ sung có dùng ảnh chính và cùng hồ sơ làm tham chiếu?",
      "acceptance": "Cùng revision và hash hồ sơ; ghi asset tham chiếu.",
      "ruleIds": [
        "VIS03",
        "SYS04"
      ]
    },
    {
      "id": "S5C02",
      "stage": 5,
      "question": "Có đủ front, side, rear là ba ảnh khác nhau không?",
      "acceptance": "Ba asset/hash khác nhau và kiểm tra góc bằng quan sát ảnh.",
      "ruleIds": [
        "VIS03"
      ]
    },
    {
      "id": "S5C03",
      "stage": 5,
      "question": "Số chân, quai, nắp, đế và khung có nhất quán theo góc?",
      "acceptance": "Chi tiết bị khuất được đối chiếu ở góc khác; bất định chuyển người duyệt ảnh.",
      "ruleIds": [
        "VIS04"
      ]
    },
    {
      "id": "S5C04",
      "stage": 5,
      "question": "Đường bao và tỷ lệ có phù hợp cùng một vật thể không?",
      "acceptance": "Không có thay đổi cấu tạo ngoài hồ sơ giữa các góc.",
      "ruleIds": [
        "VIS04"
      ]
    },
    {
      "id": "S5C05",
      "stage": 5,
      "question": "Hoa văn, bảng màu và vị trí chi tiết cá nhân hóa có nhất quán?",
      "acceptance": "Có nhận xét về chênh lệch do góc/ánh sáng và chênh lệch do thiết kế.",
      "ruleIds": [
        "VIS04",
        "ART03"
      ]
    },
    {
      "id": "S5C06",
      "stage": 5,
      "question": "Mặt sau có tự phát sinh cấu tạo không được thiết kế không?",
      "acceptance": "Chi tiết bổ sung được giải thích bởi hồ sơ, nếu đổi thiết kế thì tạo revision mới.",
      "ruleIds": [
        "VIS04",
        "STR01"
      ]
    },
    {
      "id": "S5C07",
      "stage": 5,
      "question": "Các góc có đủ rõ để kiểm tra và không bị nền che chi tiết?",
      "acceptance": "Các bộ phận cần xem được biểu diễn rõ.",
      "ruleIds": [
        "VIS02",
        "VIS03"
      ]
    },
    {
      "id": "S5C08",
      "stage": 5,
      "question": "Đã ghi rõ ba ảnh không thay thế mô hình 3D và bản vẽ kỹ thuật?",
      "acceptance": "Nhãn đầu ra không khẳng định kích thước/tải/3D chính xác từ bộ ảnh.",
      "ruleIds": [
        "SYS05"
      ]
    },
    {
      "id": "S6C01",
      "stage": 6,
      "question": "Sáu nhóm ràng buộc đã được đối chiếu lại với bộ ảnh cuối?",
      "acceptance": "Có đánh giá cuối cho cả sáu nhóm, giữ các mục vật lý ở manual_review khi thiếu chứng cứ.",
      "ruleIds": [
        "MAT02",
        "WEA02",
        "DIM02",
        "GEO02",
        "STR01",
        "CAP01"
      ]
    },
    {
      "id": "S6C02",
      "stage": 6,
      "question": "Tất cả kết quả kiểm tra thuộc đúng phiên bản ảnh cuối?",
      "acceptance": "Không dùng kết quả hoặc duyệt từ revision cũ.",
      "ruleIds": [
        "SYS04"
      ]
    },
    {
      "id": "S6C03",
      "stage": 6,
      "question": "Tỷ lệ và bố cục đạt rubric đã công bố?",
      "acceptance": "Không có lỗi tỷ lệ/bố cục rõ ràng; có lý do đánh giá.",
      "ruleIds": [
        "ART01"
      ]
    },
    {
      "id": "S6C04",
      "stage": 6,
      "question": "Nhịp điệu đan và bản sắc thủ công phù hợp ý đồ?",
      "acceptance": "Có sự liên tục và thống nhất với mẫu tham chiếu, tôn trọng bất đối xứng chủ ý.",
      "ruleIds": [
        "ART02"
      ]
    },
    {
      "id": "S6C05",
      "stage": 6,
      "question": "Cá nhân hóa và phong cách đúng yêu cầu khách?",
      "acceptance": "Mọi chi tiết bắt buộc được đối chiếu; ưu tiên thẩm mỹ được ghi nhận.",
      "ruleIds": [
        "ART03"
      ]
    },
    {
      "id": "S6C06",
      "stage": 6,
      "question": "Màu sắc phù hợp ảnh phòng hoặc phong cách đã chốt?",
      "acceptance": "Nhận xét gắn với context thực, không tự đặt gu thẩm mỹ chung.",
      "ruleIds": [
        "ART04"
      ]
    },
    {
      "id": "S6C07",
      "stage": 6,
      "question": "Không còn lỗi ảnh hoặc bất định về sự nhất quán cần người duyệt?",
      "acceptance": "Tất cả kiểm tra ảnh áp dụng đạt, hoặc đã được người duyệt ảnh giải quyết.",
      "ruleIds": [
        "VIS01",
        "VIS02",
        "VIS03",
        "VIS04"
      ]
    },
    {
      "id": "S6C08",
      "stage": 6,
      "question": "Không còn vi phạm rule cứng đã xác nhận?",
      "acceptance": "Không dùng điểm thẩm mỹ để bù vi phạm; mục chưa rõ chế tác có nhãn concept_only.",
      "ruleIds": [
        "SYS03",
        "SYS05",
        "USE02"
      ]
    },
    {
      "id": "S6C09",
      "stage": 6,
      "question": "Danh sách cần nghệ nhân duyệt và phần dự toán có nguồn đã chốt?",
      "acceptance": "Danh sách chưa xác minh đầy đủ; dự toán không có nguồn được bỏ khỏi output.",
      "ruleIds": [
        "CAP01",
        "STR03",
        "EST01",
        "SYS05"
      ]
    },
    {
      "id": "S7C01",
      "stage": 7,
      "question": "Bảy bước đều có nhật ký hoàn thành trên cùng revision?",
      "acceptance": "Không có bước error/pending bị bỏ qua; stage 7 ghi atomically cùng đầu ra ready.",
      "ruleIds": [
        "SYS03",
        "SYS04"
      ]
    },
    {
      "id": "S7C02",
      "stage": 7,
      "question": "Ba ảnh đủ vai trò và đúng asset đã kiểm tra?",
      "acceptance": "Ảnh xuất có hash/asset khớp những ảnh đã được kiểm tra cuối.",
      "ruleIds": [
        "VIS03",
        "SYS04"
      ]
    },
    {
      "id": "S7C03",
      "stage": 7,
      "question": "Nhãn và điểm chưa xác minh có được trả cùng ảnh?",
      "acceptance": "Có concept_only, pending_artisan và review_items khi chưa có duyệt thực.",
      "ruleIds": [
        "SYS05"
      ]
    },
    {
      "id": "S7C04",
      "stage": 7,
      "question": "Hồ sơ thiết kế và giả định có được trình bày rõ?",
      "acceptance": "Số đo đề xuất chưa xác nhận được phân biệt với số khách/xưởng xác nhận.",
      "ruleIds": [
        "DIM01",
        "SYS05"
      ]
    },
    {
      "id": "S7C05",
      "stage": 7,
      "question": "Có thông báo xử lý khi chưa đủ điều kiện xuất ảnh?",
      "acceptance": "Trả câu hỏi/lý do và hướng sửa; không xuất ảnh chưa kiểm tra thay cho thành công.",
      "ruleIds": [
        "SYS03",
        "SYS05"
      ]
    }
  ]
};
