import { useLang } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { WandSparkles, Store, Compass, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
    {
        title: "Bạn Đan AI",
        desc: "Trí tuệ nhân tạo phác thảo ý tưởng thành bản vẽ mây tre đan chuyên nghiệp chỉ trong vài giây.",
        icon: WandSparkles,
        link: "/ai-design",
        color: "bg-emerald-100 text-emerald-600 border-emerald-200",
        img: "/images/feature_ai_design.jpg"
    },
    {
        title: "Cửa Hàng (MTĐ Shop)",
        desc: "Khám phá và mua sắm các sản phẩm thủ công tinh xảo, chất lượng cao từ làng nghề Phú Vinh.",
        icon: Store,
        link: "/products",
        color: "bg-amber-100 text-amber-600 border-amber-200",
        img: "/images/feature_shop.jpg"
    },
    {
        title: "Làng Nghề VR",
        desc: "Trải nghiệm tham quan làng nghề thực tế ảo 360°, đắm chìm vào không gian văn hoá đặc sắc.",
        icon: Compass,
        link: "/village",
        color: "bg-sky-100 text-sky-600 border-sky-200",
        img: "/images/feature_vr.jpg"
    },
    {
        title: "Bạn Mây",
        desc: "Chatbot thông minh luôn túc trực, hỗ trợ giải đáp văn hoá và tư vấn mua sắm tận tình.",
        icon: MessageCircle,
        link: "#",
        color: "bg-violet-100 text-violet-600 border-violet-200",
        img: "/images/feature_chatbot.jpg"
    }
];

export default function FeaturesSection() {
    const { text: localize } = useLang();
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-slate-900 mb-6 leading-tight">{localize("Có gì?")}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">{localize("Khám phá bộ tứ tính năng đột phá của Phú Vinh AI.")}</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <Link to={feat.link} className="block h-full bg-slate-50 rounded-[2rem] p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border`}>
                                    <feat.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{localize(feat.title)}</h3>
                                <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed">{localize(feat.desc)}</p>
                                <div className="h-40 rounded-2xl overflow-hidden relative">
                                    <img src={feat.img} alt={localize(feat.title)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
