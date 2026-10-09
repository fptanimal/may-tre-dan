import { useLang } from '../context/LanguageContext';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ZH_MARKDOWN from '../lib/privacy.zh.md?raw';

const VI_MARKDOWN = `
**Cập nhật lần cuối: Tháng 7, 2025**

Phú Vinh AI tôn trọng và cam kết bảo vệ quyền riêng tư, dữ liệu cá nhân của người dùng. Chính sách Bảo mật này quy định rõ phạm vi thông tin được thu thập, mục đích sử dụng, nguyên tắc bảo mật, quyền của người dùng và trách nhiệm của Phú Vinh AI trong quá trình cung cấp website và dịch vụ.

Khi sử dụng website hoặc dịch vụ của Phú Vinh AI, bạn xác nhận đã đọc, hiểu và đồng ý với các nguyên tắc được quy định tại Chính sách này.

## 1. THÔNG TIN CHÚNG TÔI THU THẬP

Tùy thuộc vào cách bạn sử dụng website và dịch vụ, Phú Vinh AI có thể thu thập các thông tin cần thiết, bao gồm:

* Họ và tên;
* Số điện thoại;
* Địa chỉ email;
* Địa chỉ giao hàng;
* Thông tin tài khoản;
* Thông tin liên quan đến đơn hàng và giao dịch;
* Nội dung trao đổi hoặc yêu cầu hỗ trợ do bạn chủ động cung cấp;
* Dữ liệu kỹ thuật và dữ liệu sử dụng website như địa chỉ IP, loại thiết bị, trình duyệt, thời gian truy cập và cookie.

Phú Vinh AI chỉ thu thập thông tin trong phạm vi cần thiết để vận hành, cung cấp và bảo đảm chất lượng dịch vụ. Chúng tôi **không chủ động thu thập, lưu trữ hoặc yêu cầu người dùng cung cấp những thông tin cá nhân không cần thiết cho mục đích cung cấp dịch vụ**, trừ trường hợp pháp luật có quy định khác.

## 2. NGUYÊN TẮC SỬ DỤNG THÔNG TIN CÁ NHÂN

Thông tin cá nhân được thu thập chỉ được sử dụng cho các mục đích hợp pháp và phù hợp với phạm vi mà thông tin đó được cung cấp, bao gồm:

* Xác nhận và xử lý đơn hàng;
* Thực hiện giao hàng;
* Quản lý tài khoản người dùng;
* Cung cấp dịch vụ và hỗ trợ khách hàng;
* Gửi thông báo liên quan trực tiếp đến đơn hàng, tài khoản hoặc dịch vụ;
* Cải thiện chất lượng website và dịch vụ;
* Phát hiện, ngăn chặn hành vi gian lận, lạm dụng hoặc truy cập trái phép;
* Thực hiện các nghĩa vụ pháp lý khi cơ quan có thẩm quyền yêu cầu theo quy định pháp luật.

**Phú Vinh AI cam kết không bán, cho thuê, trao đổi hoặc thương mại hóa thông tin cá nhân của người dùng dưới bất kỳ hình thức nào.**

Thông tin cá nhân của người dùng **không được công khai, đăng tải, cung cấp hoặc chia sẻ cho bất kỳ cá nhân, tổ chức hay bên thứ ba nào nếu không có căn cứ hợp pháp hoặc sự đồng ý phù hợp của người dùng**, ngoại trừ các trường hợp được quy định rõ tại Chính sách này hoặc trường hợp pháp luật bắt buộc.

## 3. CUNG CẤP THÔNG TIN CHO BÊN THỨ BA

Trong trường hợp cần thiết để thực hiện dịch vụ, một số thông tin tối thiểu có thể được cung cấp cho các đơn vị có liên quan, chẳng hạn như đơn vị vận chuyển, đơn vị cung cấp hạ tầng kỹ thuật hoặc đối tác cung cấp dịch vụ thanh toán.

Việc cung cấp này chỉ được thực hiện **trong phạm vi cần thiết cho mục đích cụ thể**, không cho phép bên nhận thông tin sử dụng dữ liệu vào mục đích trái với thỏa thuận hoặc quy định pháp luật.

Phú Vinh AI yêu cầu các bên có quyền tiếp cận thông tin phải thực hiện nghĩa vụ bảo mật và áp dụng các biện pháp phù hợp để bảo vệ dữ liệu được cung cấp.

Trong trường hợp cơ quan nhà nước hoặc cơ quan có thẩm quyền yêu cầu cung cấp thông tin theo đúng quy định pháp luật, Phú Vinh AI có trách nhiệm thực hiện yêu cầu đó trong phạm vi pháp luật cho phép.

## 4. COOKIE VÀ CÔNG NGHỆ THEO DÕI

Website có thể sử dụng cookie và các công nghệ tương tự nhằm:

* Duy trì trạng thái đăng nhập;
* Ghi nhớ các lựa chọn của người dùng;
* Phân tích hoạt động và lưu lượng truy cập;
* Cải thiện hiệu suất và trải nghiệm website;
* Cá nhân hóa một số nội dung hoặc chức năng.

Người dùng có thể quản lý hoặc vô hiệu hóa cookie thông qua cài đặt của trình duyệt. Tuy nhiên, việc vô hiệu hóa một số loại cookie có thể khiến một số chức năng của website hoạt động không đầy đủ.

## 5. BẢO VỆ VÀ LƯU TRỮ DỮ LIỆU

Phú Vinh AI có trách nhiệm áp dụng các biện pháp kỹ thuật và tổ chức hợp lý nhằm ngăn chặn việc:

* Truy cập trái phép;
* Thu thập trái phép;
* Sử dụng sai mục đích;
* Tiết lộ trái phép;
* Thay đổi hoặc phá hủy dữ liệu cá nhân.

Các biện pháp bảo vệ có thể bao gồm mã hóa kết nối bằng TLS, kiểm soát quyền truy cập, phân quyền nội bộ, giám sát hệ thống và sao lưu dữ liệu định kỳ.

**Quyền truy cập thông tin cá nhân được giới hạn đối với những cá nhân hoặc hệ thống thực sự cần thiết để thực hiện chức năng được giao.**

Phú Vinh AI không cho phép nhân sự hoặc bên được ủy quyền sử dụng thông tin cá nhân ngoài phạm vi công việc và mục đích đã được xác định.

Dữ liệu cá nhân chỉ được lưu giữ trong thời gian cần thiết để thực hiện mục đích thu thập, cung cấp dịch vụ, giải quyết tranh chấp hoặc đáp ứng nghĩa vụ pháp lý.

Mặc dù chúng tôi áp dụng các biện pháp bảo mật phù hợp, không có hệ thống truyền tải hoặc lưu trữ dữ liệu nào trên Internet có thể được bảo đảm an toàn tuyệt đối. Trong trường hợp phát hiện sự cố có khả năng ảnh hưởng đến dữ liệu cá nhân, Phú Vinh AI sẽ thực hiện các biện pháp xử lý và thông báo theo quy định pháp luật hiện hành.

## 6. QUYỀN CỦA NGƯỜI DÙNG

Trong phạm vi pháp luật cho phép, người dùng có quyền:

* Yêu cầu biết thông tin cá nhân mà Phú Vinh AI đang lưu trữ;
* Yêu cầu kiểm tra hoặc chỉnh sửa thông tin không chính xác;
* Yêu cầu xóa thông tin cá nhân khi có căn cứ phù hợp;
* Yêu cầu hạn chế hoặc phản đối một số hoạt động xử lý dữ liệu;
* Hủy đăng ký nhận thông tin tiếp thị hoặc ưu đãi;
* Yêu cầu cung cấp hoặc xuất dữ liệu cá nhân theo điều kiện và phạm vi phù hợp.

Mọi yêu cầu liên quan đến dữ liệu cá nhân sẽ được tiếp nhận, xác minh và xử lý trong phạm vi quyền hạn của Phú Vinh AI và theo quy định pháp luật hiện hành.

## 7. TRÁCH NHIỆM CỦA NGƯỜI DÙNG

Người dùng có trách nhiệm cung cấp thông tin chính xác và cập nhật khi cần thiết.

Người dùng không được cung cấp thông tin cá nhân của người khác cho Phú Vinh AI nếu chưa có quyền hoặc sự đồng ý hợp pháp của người đó.

Người dùng cũng có trách nhiệm bảo vệ thông tin đăng nhập, mật khẩu và các thông tin xác thực thuộc tài khoản của mình. Phú Vinh AI không chịu trách nhiệm đối với các thiệt hại phát sinh trực tiếp từ việc người dùng tự ý tiết lộ hoặc để lộ thông tin xác thực của mình.

## 8. XỬ LÝ VI PHẠM VÀ SỰ CỐ BẢO MẬT

Mọi hành vi truy cập trái phép, khai thác, thu thập, sao chép, sử dụng, tiết lộ hoặc phát tán trái phép dữ liệu cá nhân được xem là hành vi vi phạm Chính sách này.

Phú Vinh AI có quyền áp dụng các biện pháp cần thiết để ngăn chặn, hạn chế hoặc xử lý hành vi vi phạm, bao gồm khóa hoặc hạn chế quyền truy cập tài khoản, điều tra sự cố và thực hiện các biện pháp pháp lý cần thiết theo quy định hiện hành.

## 9. THAY ĐỔI CHÍNH SÁCH BẢO MẬT

Phú Vinh AI có thể cập nhật Chính sách Bảo mật để phản ánh thay đổi về dịch vụ, công nghệ hoặc yêu cầu pháp lý.

Mọi thay đổi quan trọng sẽ được công bố trên website cùng với ngày cập nhật mới. Người dùng có trách nhiệm kiểm tra phiên bản Chính sách Bảo mật được công bố tại thời điểm tiếp tục sử dụng dịch vụ.

## 10. LIÊN HỆ VỀ QUYỀN RIÊNG TƯ

Nếu bạn có yêu cầu, khiếu nại hoặc câu hỏi liên quan đến việc thu thập, sử dụng, lưu trữ hoặc bảo vệ dữ liệu cá nhân, vui lòng liên hệ:

**Phú Vinh AI**  
**Email:** [contact@phuvinhmaytredan.vn](mailto:contact@phuvinhmaytredan.vn)  
**Điện thoại:** 0912 345 678  
**Địa chỉ:** Phú Vinh, Chương Mỹ, Hà Nội

Phú Vinh AI cam kết tiếp nhận và xử lý các yêu cầu liên quan đến quyền riêng tư một cách nghiêm túc, minh bạch và có trách nhiệm, phù hợp với quy định pháp luật hiện hành.
`;

const EN_MARKDOWN = `
**Last Updated: July 2025**

Phú Vinh AI respects and is committed to protecting the privacy and personal data of our users. This Privacy Policy outlines the scope of collected information, purposes of use, security principles, user rights, and the responsibilities of Phú Vinh AI in providing our website and services.

By using the website or services of Phú Vinh AI, you acknowledge that you have read, understood, and agreed to the principles set forth in this Policy.

## 1. INFORMATION WE COLLECT

Depending on how you use our website and services, Phú Vinh AI may collect necessary information, including:

* Full name;
* Phone number;
* Email address;
* Shipping address;
* Account information;
* Information related to orders and transactions;
* Content of exchanges or support requests actively provided by you;
* Technical and usage data of the website such as IP address, device type, browser, access time, and cookies.

Phú Vinh AI only collects information within the scope necessary to operate, provide, and ensure the quality of services. We **do not actively collect, store, or require users to provide unnecessary personal information for the purpose of providing services**, unless otherwise required by law.

## 2. PRINCIPLES OF USING PERSONAL INFORMATION

Collected personal information is only used for lawful purposes and consistent with the scope for which it was provided, including:

* Confirming and processing orders;
* Delivering shipments;
* Managing user accounts;
* Providing services and customer support;
* Sending notifications directly related to orders, accounts, or services;
* Improving the quality of the website and services;
* Detecting and preventing fraud, abuse, or unauthorized access;
* Fulfilling legal obligations when requested by competent authorities in accordance with the law.

**Phú Vinh AI is committed to not selling, renting, exchanging, or commercializing users' personal information in any form.**

Users' personal information **will not be made public, posted, provided, or shared with any individual, organization, or third party without a lawful basis or appropriate consent from the user**, except in cases explicitly stated in this Policy or mandated by law.

## 3. PROVIDING INFORMATION TO THIRD PARTIES

In necessary cases to perform services, minimal information may be provided to relevant entities, such as shipping providers, technical infrastructure providers, or payment service partners.

This provision is only made **within the scope necessary for the specific purpose**, and does not allow the receiving party to use the data for purposes contrary to agreements or legal regulations.

Phú Vinh AI requires parties with access to information to fulfill confidentiality obligations and implement appropriate measures to protect the provided data.

In cases where state agencies or competent authorities require the provision of information in accordance with the law, Phú Vinh AI is responsible for fulfilling that request within the extent permitted by law.

## 4. COOKIES AND TRACKING TECHNOLOGIES

The website may use cookies and similar technologies to:

* Maintain login state;
* Remember user preferences;
* Analyze activity and traffic;
* Improve the performance and experience of the website;
* Personalize certain content or functions.

Users can manage or disable cookies through their browser settings. However, disabling certain types of cookies may cause some features of the website to not function fully.

## 5. DATA PROTECTION AND STORAGE

Phú Vinh AI is responsible for implementing reasonable technical and organizational measures to prevent:

* Unauthorized access;
* Unauthorized collection;
* Misuse;
* Unauthorized disclosure;
* Alteration or destruction of personal data.

Protection measures may include TLS connection encryption, access control, internal authorization, system monitoring, and periodic data backups.

**Access to personal information is restricted to individuals or systems strictly necessary to perform assigned functions.**

Phú Vinh AI does not allow personnel or authorized parties to use personal information outside the scope of their defined work and purposes.

Personal data is only retained for the time necessary to fulfill the purposes of collection, service provision, dispute resolution, or meeting legal obligations.

Although we implement appropriate security measures, no data transmission or storage system on the Internet can be guaranteed to be absolutely secure. In the event of an incident that may affect personal data, Phú Vinh AI will implement handling measures and notify in accordance with applicable laws.

## 6. USER RIGHTS

To the extent permitted by law, users have the right to:

* Request to know what personal information Phú Vinh AI is storing;
* Request inspection or correction of inaccurate information;
* Request deletion of personal information when there is an appropriate basis;
* Request restriction or object to certain data processing activities;
* Unsubscribe from receiving marketing information or offers;
* Request provision or export of personal data under appropriate conditions and scope.

All requests related to personal data will be received, verified, and processed within the authority of Phú Vinh AI and in accordance with applicable laws.

## 7. USER RESPONSIBILITIES

Users are responsible for providing accurate and updated information when necessary.

Users must not provide another person's personal information to Phú Vinh AI without their lawful right or consent.

Users are also responsible for protecting their login information, passwords, and authentication credentials belonging to their account. Phú Vinh AI is not liable for damages arising directly from the user's voluntary or negligent disclosure of their authentication information.

## 8. HANDLING VIOLATIONS AND SECURITY INCIDENTS

Any unauthorized access, exploitation, collection, copying, use, disclosure, or unauthorized distribution of personal data is considered a violation of this Policy.

Phú Vinh AI has the right to implement necessary measures to prevent, limit, or handle violations, including locking or restricting account access, investigating incidents, and taking necessary legal actions in accordance with current regulations.

## 9. CHANGES TO THE PRIVACY POLICY

Phú Vinh AI may update the Privacy Policy to reflect changes in services, technologies, or legal requirements.

Any significant changes will be published on the website along with the new update date. Users are responsible for reviewing the version of the Privacy Policy published at the time they continue to use the services.

## 10. PRIVACY CONTACT

If you have requests, complaints, or questions regarding the collection, use, storage, or protection of personal data, please contact:

**Phú Vinh AI**  
**Email:** [contact@phuvinhmaytredan.vn](mailto:contact@phuvinhmaytredan.vn)  
**Phone:** 0912 345 678  
**Address:** Phú Vinh, Chương Mỹ, Hà Nội

Phú Vinh AI is committed to receiving and processing privacy-related requests seriously, transparently, and responsibly, in accordance with applicable laws.
`;

const CONTENT = {
    vi: VI_MARKDOWN,
    en: EN_MARKDOWN,
    zh: ZH_MARKDOWN,
};

export default function PrivacyPolicy() {
    const { text: localize } = useLang();
    const { lang, t } = useLang();
    const markdownContent = CONTENT[lang] || CONTENT.vi;

    return (
        <div className="min-h-screen bg-gray-50 text-foreground pt-20 pb-16">
            {/* Beautiful Gradient Header */}
            <div className="bg-gradient-to-br from-primary/90 via-emerald-800 to-teal-900 text-white py-16 px-4 mb-12 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="container mx-auto max-w-4xl relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition-colors mb-6 font-medium">
                        <ArrowLeft className="w-4 h-4" /> {t('privacy.back')}
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-xl">
                            <Shield className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-sm">
                                {localize(lang === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy')}
                            </h1>
                            <p className="text-emerald-100 font-medium mt-2">
                                {localize(lang === 'vi' ? 'Cam kết bảo vệ quyền riêng tư của bạn' : 'Committed to protecting your privacy')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Markdown Content Area */}
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 border border-green-100 p-8 md:p-12">
                    <div className="max-w-none text-gray-800">
                        <ReactMarkdown
                            components={{
                                h2: ({node, ...props}) => (
                                    <div className="mt-12 mb-6">
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-600 inline-block pb-2" {...props} />
                                        <div className="w-16 h-1 bg-gradient-to-r from-primary to-teal-400 rounded-full mt-1"></div>
                                    </div>
                                ),
                                p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-5 text-[15px] md:text-base font-medium" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-8 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50" {...props} />,
                                li: ({node, children, ...props}) => (
                                    <li className="flex items-start gap-3 text-gray-600 font-medium" {...props}>
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-sm shadow-primary/40"></div>
                                        <span>{children}</span>
                                    </li>
                                ),
                                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                a: ({node, ...props}) => <a className="text-primary font-semibold hover:text-emerald-700 hover:underline transition-all" {...props} />
                            }}
                        >
                            {localize(markdownContent)}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
