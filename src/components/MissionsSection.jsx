import { useLang } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { IMAGES } from '../lib/images';

const MISSIONS = [
    {
        title: "Sứ mệnh 1",
        tag: "Bảo tồn di sản",
        main: "Giữ cái hồn của nghề thủ công Việt",
        desc: "Để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        image: IMAGES.product1,
        theme: {
            border: "border-teal-200/80 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-500",
            shadow: "hover:shadow-teal-500/10",
            badge: "bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800/60",
            dot: "bg-teal-600 dark:bg-teal-400"
        }
    },
    {
        title: "Sứ mệnh 2",
        tag: "Sáng tạo đương đại",
        main: "Kể chuyện di sản bằng ngôn ngữ mới",
        desc: "Đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        image: IMAGES.product2,
        theme: {
            border: "border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-500",
            shadow: "hover:shadow-amber-500/10",
            badge: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60",
            dot: "bg-amber-600 dark:bg-amber-400"
        }
    },
    {
        title: "Sứ mệnh 3",
        tag: "Cầu nối thế hệ",
        main: "Nối người trẻ với làng nghề",
        desc: "Biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        image: IMAGES.mission3,
        theme: {
            border: "border-violet-200/80 dark:border-violet-900/60 hover:border-violet-400 dark:hover:border-violet-500",
            shadow: "hover:shadow-violet-500/10",
            badge: "bg-violet-50 text-violet-800 border-violet-200/80 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800/60",
            dot: "bg-violet-600 dark:bg-violet-400"
        }
    },
    {
        title: "Sứ mệnh 4",
        tag: "AI & Công nghệ số",
        main: "Đưa công nghệ phục vụ văn hóa",
        desc: "Để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        image: IMAGES.mission4,
        theme: {
            border: "border-cyan-200/80 dark:border-cyan-900/60 hover:border-cyan-400 dark:hover:border-cyan-500",
            shadow: "hover:shadow-cyan-500/10",
            badge: "bg-cyan-50 text-cyan-800 border-cyan-200/80 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800/60",
            dot: "bg-cyan-600 dark:bg-cyan-400"
        }
    },
    {
        title: "Sứ mệnh 5",
        tag: "Tầm nhìn trường tồn",
        main: "Để Phú Vinh được nhớ, được yêu và tiếp nối",
        desc: "Không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        image: IMAGES.mission5,
        isFeatured: true,
        theme: {
            border: "border-rose-200/80 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500",
            shadow: "hover:shadow-rose-500/10",
            badge: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60",
            dot: "bg-rose-600 dark:bg-rose-400"
        }
    }
];

export default function MissionsSection() {
    const { text: localize } = useLang();

    return (
        <section className="py-14 md:py-18 bg-slate-50/50 dark:bg-slate-950 relative overflow-hidden border-y border-slate-100 dark:border-slate-800/60">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 14 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium tracking-wide mb-3 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {localize("Sứ Mệnh & Tầm Nhìn")}
                        </span>
                        
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 leading-snug">
                            {localize("Để làm gì?")}
                        </h2>

                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                            {localize("5 sứ mệnh cốt lõi xuyên suốt mọi hoạt động của chúng tôi.")}
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                    {MISSIONS.map((mission, i) => {
                        // Standard Cards (Col-span 6 on lg)
                        if (!mission.isFeatured) {
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07, duration: 0.4 }}
                                    className={`group bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border ${mission.theme.border} shadow-2xs ${mission.theme.shadow} transition-all duration-300 hover:-translate-y-1 lg:col-span-6 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center`}
                                >
                                    {/* Image matching intro */}
                                    <div className="w-full sm:w-40 md:w-44 h-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                        <img 
                                            src={mission.image} 
                                            alt={localize(mission.main)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${mission.theme.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${mission.theme.dot}`} />
                                                {localize(mission.title)}
                                            </span>
                                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                                {localize(mission.tag)}
                                            </span>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                            {localize(mission.main)}
                                        </h3>

                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                            {localize(mission.desc)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        }

                        // Featured Mission 5 Card (Col-span 12)
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className={`group bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 border ${mission.theme.border} shadow-2xs ${mission.theme.shadow} transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-12 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center`}
                            >
                                {/* Image matching intro */}
                                <div className="w-full sm:w-52 md:w-64 h-40 sm:h-44 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                    <img 
                                        src={mission.image} 
                                        alt={localize(mission.main)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${mission.theme.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${mission.theme.dot}`} />
                                            {localize(mission.title)}
                                        </span>
                                        <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {localize(mission.tag)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                        {localize(mission.main)}
                                    </h3>

                                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                        {localize(mission.desc)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
