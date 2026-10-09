import { useLang } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MISSIONS = [
    {
        title: "Sứ mệnh 1",
        tag: "Bảo tồn di sản",
        main: "Giữ cái hồn của nghề thủ công Việt",
        desc: "Để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        highlights: ["Kỹ nghệ 400 năm", "Đôi tay nghệ nhân", "Hồn cốt Việt Nam"],
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50",
        accentHover: "group-hover:border-emerald-300 dark:group-hover:border-emerald-700"
    },
    {
        title: "Sứ mệnh 2",
        tag: "Sáng tạo đương đại",
        main: "Kể chuyện di sản bằng ngôn ngữ mới",
        desc: "Đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        highlights: ["Ngôn ngữ thiết kế mới", "Thẩm mỹ hiện đại", "Gần gũi thế hệ trẻ"],
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50",
        accentHover: "group-hover:border-amber-300 dark:group-hover:border-amber-700"
    },
    {
        title: "Sứ mệnh 3",
        tag: "Cầu nối thế hệ",
        main: "Nối người trẻ với làng nghề",
        desc: "Biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        highlights: ["Khơi gợi tò mò", "Thấu hiểu làng nghề", "Trân trọng di sản"],
        badgeStyle: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50",
        accentHover: "group-hover:border-violet-300 dark:group-hover:border-violet-700"
    },
    {
        title: "Sứ mệnh 4",
        tag: "AI & Công nghệ số",
        main: "Đưa công nghệ phục vụ văn hóa",
        desc: "Để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        highlights: ["Trợ lý AI Bạn Mây", "Mô phỏng 3D & VR", "Công nghệ vị nhân sinh"],
        badgeStyle: "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50",
        accentHover: "group-hover:border-cyan-300 dark:group-hover:border-cyan-700"
    },
    {
        title: "Sứ mệnh 5",
        tag: "Tầm nhìn trường tồn",
        main: "Để Phú Vinh được nhớ, được yêu và tiếp nối",
        desc: "Không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        highlights: ["Biểu tượng văn hóa", "Bản sắc sống động", "Vươn tầm thế giới"],
        isFeatured: true,
        badgeStyle: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50",
        accentHover: "group-hover:border-rose-300 dark:group-hover:border-rose-700"
    }
];

export default function MissionsSection() {
    const { text: localize } = useLang();

    return (
        <section className="py-16 md:py-20 bg-slate-50/60 dark:bg-slate-950 relative overflow-hidden border-y border-slate-100 dark:border-slate-800/60">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
                    <motion.div 
                        initial={{ opacity: 0, y: 16 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium tracking-wide mb-3 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {localize("Sứ Mệnh & Tầm Nhìn")}
                        </span>
                        
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 leading-snug">
                            {localize("Để làm gì?")}
                        </h2>

                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                            {localize("5 sứ mệnh cốt lõi xuyên suốt mọi hoạt động của chúng tôi.")}
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
                    {MISSIONS.map((mission, i) => {
                        // Regular 4 cards
                        if (!mission.isFeatured) {
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className={`group bg-white dark:bg-slate-900/90 rounded-2xl p-6 md:p-7 border border-slate-200/70 dark:border-slate-800 ${mission.accentHover} shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between lg:col-span-6`}
                                >
                                    <div>
                                        {/* Header Tags */}
                                        <div className="flex items-center gap-2 mb-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${mission.badgeStyle}`}>
                                                {localize(mission.title)}
                                            </span>
                                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {localize(mission.tag)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                            {localize(mission.main)}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-5">
                                            {localize(mission.desc)}
                                        </p>
                                    </div>

                                    {/* Footer Highlights */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/70">
                                        <div className="flex flex-wrap gap-1.5">
                                            {mission.highlights.map((h, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 font-normal"
                                                >
                                                    {localize(h)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }

                        // Featured Mission 5 Card
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                                className={`group bg-white dark:bg-slate-900/90 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 ${mission.accentHover} shadow-2xs hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-12`}
                            >
                                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                                    <div className="lg:col-span-7">
                                        <div className="flex items-center gap-2 mb-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${mission.badgeStyle}`}>
                                                {localize(mission.title)}
                                            </span>
                                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {localize(mission.tag)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                            {localize(mission.main)}
                                        </h3>

                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-5">
                                            {localize(mission.desc)}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {mission.highlights.map((h, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 font-normal"
                                                >
                                                    {localize(h)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Minimalist Action & Quote Side */}
                                    <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed font-light">
                                            "{localize("Bàn tay nghệ nhân kiến tạo, công nghệ AI kết nối tương lai.")}"
                                        </p>
                                        <div>
                                            <Link 
                                                to="/village"
                                                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group/link"
                                            >
                                                <span>{localize("Khám phá làng nghề Phú Vinh")}</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
