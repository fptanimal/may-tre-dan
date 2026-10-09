import { useLang } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Sparkles, 
    Compass, 
    HeartHandshake, 
    Cpu, 
    Globe, 
    ArrowUpRight,
    Flame,
    Layers,
    ShieldCheck
} from 'lucide-react';

const MISSIONS = [
    {
        number: "01",
        title: "Sứ mệnh 1",
        tag: "Bảo tồn di sản",
        main: "Giữ cái hồn của nghề thủ công Việt",
        desc: "Để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        highlights: ["Kỹ nghệ 400 năm", "Đôi tay nghệ nhân", "Hồn cốt Việt Nam"],
        icon: Sparkles,
        theme: {
            wrapper: "from-emerald-500/10 via-teal-500/5 to-transparent",
            cardBg: "bg-white/95 dark:bg-slate-900/90",
            border: "border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400 dark:hover:border-emerald-500",
            shadow: "hover:shadow-emerald-500/15",
            badge: "bg-emerald-100/90 text-emerald-800 border-emerald-200/90 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800",
            iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30",
            bar: "from-emerald-500 via-teal-500 to-emerald-400",
            number: "text-emerald-500/15 dark:text-emerald-400/15",
            pill: "bg-emerald-50/90 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
        }
    },
    {
        number: "02",
        title: "Sứ mệnh 2",
        tag: "Sáng tạo đương đại",
        main: "Kể chuyện di sản bằng ngôn ngữ mới",
        desc: "Đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        highlights: ["Ngôn ngữ thiết kế mới", "Thẩm mỹ hiện đại", "Gần gũi thế hệ trẻ"],
        icon: Compass,
        theme: {
            wrapper: "from-amber-500/10 via-orange-500/5 to-transparent",
            cardBg: "bg-white/95 dark:bg-slate-900/90",
            border: "border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400 dark:hover:border-amber-500",
            shadow: "hover:shadow-amber-500/15",
            badge: "bg-amber-100/90 text-amber-800 border-amber-200/90 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
            iconBg: "bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-600/30",
            bar: "from-amber-500 via-orange-500 to-amber-400",
            number: "text-amber-500/15 dark:text-amber-400/15",
            pill: "bg-amber-50/90 text-amber-800 border-amber-200/70 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
        }
    },
    {
        number: "03",
        title: "Sứ mệnh 3",
        tag: "Cầu nối thế hệ",
        main: "Nối người trẻ với làng nghề",
        desc: "Biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        highlights: ["Khơi gợi tò mò", "Thấu hiểu làng nghề", "Trân trọng di sản"],
        icon: HeartHandshake,
        theme: {
            wrapper: "from-violet-500/10 via-purple-500/5 to-transparent",
            cardBg: "bg-white/95 dark:bg-slate-900/90",
            border: "border-violet-200/80 dark:border-violet-800/60 hover:border-violet-400 dark:hover:border-violet-500",
            shadow: "hover:shadow-violet-500/15",
            badge: "bg-violet-100/90 text-violet-800 border-violet-200/90 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800",
            iconBg: "bg-gradient-to-tr from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-600/30",
            bar: "from-violet-500 via-purple-500 to-violet-400",
            number: "text-violet-500/15 dark:text-violet-400/15",
            pill: "bg-violet-50/90 text-violet-800 border-violet-200/70 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60"
        }
    },
    {
        number: "04",
        title: "Sứ mệnh 4",
        tag: "AI & Công nghệ số",
        main: "Đưa công nghệ phục vụ văn hóa",
        desc: "Để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        highlights: ["Trợ lý AI Bạn Mây", "Mô phỏng 3D & VR", "Công nghệ vị nhân sinh"],
        icon: Cpu,
        theme: {
            wrapper: "from-cyan-500/10 via-blue-500/5 to-transparent",
            cardBg: "bg-white/95 dark:bg-slate-900/90",
            border: "border-cyan-200/80 dark:border-cyan-800/60 hover:border-cyan-400 dark:hover:border-cyan-500",
            shadow: "hover:shadow-cyan-500/15",
            badge: "bg-cyan-100/90 text-cyan-800 border-cyan-200/90 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800",
            iconBg: "bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-600/30",
            bar: "from-cyan-500 via-blue-500 to-cyan-400",
            number: "text-cyan-500/15 dark:text-cyan-400/15",
            pill: "bg-cyan-50/90 text-cyan-800 border-cyan-200/70 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60"
        }
    },
    {
        number: "05",
        title: "Sứ mệnh 5",
        tag: "Tầm nhìn trường tồn",
        main: "Để Phú Vinh được nhớ, được yêu và tiếp nối",
        desc: "Không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        highlights: ["Biểu tượng văn hóa", "Bản sắc sống động", "Vươn tầm thế giới"],
        icon: Globe,
        isFeatured: true,
        theme: {
            wrapper: "from-rose-500/15 via-amber-500/10 to-teal-500/5",
            cardBg: "bg-gradient-to-br from-white via-rose-50/20 to-amber-50/30 dark:from-slate-900/95 dark:via-rose-950/20 dark:to-slate-900/95",
            border: "border-rose-200/90 dark:border-rose-800/70 hover:border-rose-400 dark:hover:border-rose-500",
            shadow: "hover:shadow-rose-500/20",
            badge: "bg-gradient-to-r from-rose-100 to-amber-100 text-rose-900 border-rose-200/90 dark:from-rose-950 dark:to-amber-950 dark:text-rose-300 dark:border-rose-800",
            iconBg: "bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 text-white shadow-xl shadow-rose-600/35",
            bar: "from-rose-500 via-amber-500 to-teal-400",
            number: "text-rose-500/20 dark:text-rose-400/20",
            pill: "bg-rose-50/90 text-rose-900 border-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
        }
    }
];

export default function MissionsSection() {
    const { text: localize } = useLang();

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-stone-50/80 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-300/15 dark:bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-300/15 dark:bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-rose-300/10 dark:bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Bamboo Lattice SVG Pattern */}
            <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 24 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Shimmer Pill Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs md:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {localize("Sứ Mệnh & Tầm Nhìn")}
                        </div>

                        {/* Title with cultural essence */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
                            {localize("Để làm gì?")}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                            {localize("5 sứ mệnh cốt lõi xuyên suốt mọi hoạt động của chúng tôi.")}
                        </p>
                    </motion.div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
                    {MISSIONS.map((mission, i) => {
                        const Icon = mission.icon;

                        // Standard 4 Cards (Col-span 6 on lg)
                        if (!mission.isFeatured) {
                            return (
                                <motion.div
                                    key={mission.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                    className={`relative group ${mission.theme.cardBg} rounded-[2rem] p-7 md:p-9 border ${mission.theme.border} transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden shadow-sm ${mission.theme.shadow} lg:col-span-6`}
                                >
                                    {/* Hover Ambient Mesh */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${mission.theme.wrapper} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                    {/* Giant Decorative Index Number */}
                                    <div className={`absolute -top-3 right-5 text-7xl md:text-8xl font-black ${mission.theme.number} select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-1 font-serif`}>
                                        {mission.number}
                                    </div>

                                    {/* Card Top: Badges & Icon */}
                                    <div className="relative z-10 mb-6">
                                        <div className="flex items-start justify-between gap-4 mb-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${mission.theme.badge}`}>
                                                    {localize(mission.title)}
                                                </span>
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                                                    {localize(mission.tag)}
                                                </span>
                                            </div>

                                            {/* Glowing Icon Container */}
                                            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center ${mission.theme.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                        </div>

                                        {/* Main Heading */}
                                        <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-slate-950 dark:group-hover:text-emerald-300 transition-colors leading-tight">
                                            {localize(mission.main)}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                            {localize(mission.desc)}
                                        </p>
                                    </div>

                                    {/* Card Bottom: Highlights & Accent Bar */}
                                    <div className="relative z-10 pt-5 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="flex flex-wrap gap-2">
                                            {mission.highlights.map((h, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`text-xs md:text-sm px-3 py-1 rounded-xl border font-medium transition-colors ${mission.theme.pill}`}
                                                >
                                                    {localize(h)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive expanding bottom bar */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${mission.theme.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                </motion.div>
                            );
                        }

                        // Featured Mission 05 (Full Width Capstone Showcase)
                        return (
                            <motion.div
                                key={mission.number}
                                initial={{ opacity: 0, y: 35 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                                className={`relative group ${mission.theme.cardBg} rounded-[2.5rem] p-8 md:p-12 border ${mission.theme.border} transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-lg ${mission.theme.shadow} md:col-span-2 lg:col-span-12`}
                            >
                                {/* Luxury Ambient Mesh */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${mission.theme.wrapper} opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                {/* Giant Background Watermark */}
                                <div className="absolute -bottom-8 right-6 text-8xl md:text-9xl font-black text-rose-500/10 dark:text-rose-400/10 select-none pointer-events-none transition-transform duration-500 group-hover:scale-105 font-serif">
                                    05
                                </div>

                                <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                    {/* Left Content Column */}
                                    <div className="lg:col-span-7">
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${mission.theme.badge}`}>
                                                ★ {localize(mission.title)} • {localize(mission.tag)}
                                            </span>
                                            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-800/80">
                                                {localize("Di sản sống")}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                            {localize(mission.main)}
                                        </h3>

                                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light mb-6">
                                            {localize(mission.desc)}
                                        </p>

                                        {/* Highlights */}
                                        <div className="flex flex-wrap gap-2.5">
                                            {mission.highlights.map((h, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`text-xs md:text-sm px-3.5 py-1.5 rounded-xl border font-semibold ${mission.theme.pill}`}
                                                >
                                                    {localize(h)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Content Showcase Panel */}
                                    <div className="lg:col-span-5">
                                        <div className="rounded-3xl p-6 md:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-rose-200/80 dark:border-rose-900/60 shadow-md relative overflow-hidden group/panel">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mission.theme.iconBg} shrink-0 group-hover/panel:scale-110 group-hover/panel:rotate-6 transition-all duration-300`}>
                                                    <Globe className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-0.5">
                                                        Phú Vinh • Di Sản 400 Năm
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                                        {localize("400 năm vàng son di sản")}
                                                    </h4>
                                                </div>
                                            </div>

                                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                                                "{localize("Bàn tay nghệ nhân kiến tạo, công nghệ AI kết nối tương lai.")}"
                                            </p>

                                            <Link 
                                                to="/village"
                                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-700 dark:bg-white dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 group/btn"
                                            >
                                                <span>{localize("Khám phá làng nghề Phú Vinh")}</span>
                                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom luxury glow bar */}
                                <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${mission.theme.bar}`} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
