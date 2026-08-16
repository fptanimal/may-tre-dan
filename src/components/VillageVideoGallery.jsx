import { motion } from 'framer-motion';
import { Play, Construction, Film } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const VIDEOS = [
    { id: 'MW-88Rn9A_0', title_vi: 'Làng nghề mây tre đan Phú Vinh', title_en: 'Phú Vinh Bamboo & Rattan Village', title_es: 'Pueblo Artesanal de Bambú y Ratán Phú Vinh', title_zh: '富荣竹藤编织村', title_ru: 'Ремесленная деревня бамбука и ротанга Phú Vinh' },
    { id: 'FBmeBeAIFLQ', title_vi: 'Một thế kỷ, một tinh hoa', title_en: 'A Century, A Heritage', title_es: 'Un Siglo, Una Herencia', title_zh: '一个世纪，一种精华', title_ru: 'Век, наследие' },
    { id: 'Nsp_YtE8PZs', title_vi: 'Tinh hoa làng nghề | Chuyện Hà Nội', title_en: 'Craft Village Essence | Hanoi Stories', title_es: 'Esencia del Pueblo Artesanal | Historias de Hanói', title_zh: '工艺村精华 | 河内故事', title_ru: 'Суть ремесла | Истории Ханоя' },
    { id: 'svgxjHARil8', title_vi: 'Giữ lửa nghề Mây Tre Đan', title_en: 'Keeping the Craft Alive', title_es: 'Manteniendo Viva la Tradición', title_zh: '传承竹藤编织工艺', title_ru: 'Сохраняя ремесло живым' },
    { id: '_ciSTNrNJlw', title_vi: 'Hành trình tìm về làng Phú Vinh', title_en: 'Journey to Phú Vinh Village', title_es: 'Viaje al Pueblo de Phú Vinh', title_zh: '富荣村之旅', title_ru: 'Путешествие в деревню Phú Vinh' },
    { id: 'Kd_6-4yGMis', title_vi: 'Làng nghề mây tre đan thôn Phú Vinh', title_en: 'Phú Vinh Hamlet Craft Village', title_es: 'Pueblo Artesanal de Phú Vinh', title_zh: '富荣屯工艺村', title_ru: 'Ремесленная деревня Phú Vinh' },
];

const PLACEHOLDER_VIDEOS = [
    { title_vi: 'Tập 1: Khám phá nguyên liệu', title_en: 'Ep 1: Discovering Materials' },
    { title_vi: 'Tập 2: Nghệ nhân kể chuyện', title_en: 'Ep 2: Artisan Stories' },
    { title_vi: 'Tập 3: Từ tre đến tác phẩm', title_en: 'Ep 3: From Bamboo to Art' },
    { title_vi: 'Tập 4: Thế hệ tiếp nối', title_en: 'Ep 4: Next Generation' },
    { title_vi: 'Tập 5: Hành trình xuất khẩu', title_en: 'Ep 5: Export Journey' },
    { title_vi: 'Tập 6: Tương lai làng nghề', title_en: 'Ep 6: Future of the Craft' },
];

export default function VillageVideoGallery({ activeVideo, setActiveVideo }) {
    const { t, lang } = useLang();

    return (
        <>
            {/* Section 2: Mang Tre Đây — Upcoming Series (Placeholders) */}
            <section className="py-12 bg-background relative z-10 border-t border-border/50">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container max-w-5xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                            <Film className="w-5 h-5 text-amber-500" /> Mang Tre Đây
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {lang === 'vi' ? 'Series video về cuộc sống và nghề mây tre đan' : 'Video series about life and bamboo craft'}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {PLACEHOLDER_VIDEOS.map((v, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden border-2 border-dashed border-amber-300/50 bg-amber-50/30 dark:bg-amber-950/10 aspect-video flex flex-col items-center justify-center gap-2 p-4">
                                <Construction className="w-8 h-8 text-amber-400/60" />
                                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-semibold text-center leading-tight">
                                    {v[`title_${lang}`] || v.title_en}
                                </p>
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                    {lang === 'vi' ? 'Đang được phát triển và xây dựng' : 'Coming Soon'}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Section 3: Mây Tre Đan — Existing Videos */}
            <section className="py-12 bg-background relative z-10 border-t border-border/50">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container max-w-5xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                            <Play className="w-5 h-5 text-red-500" /> Mây Tre Đan
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {lang === 'vi' ? 'Video về làng nghề mây tre đan Phú Vinh' : 'Videos about Phú Vinh bamboo & rattan craft village'}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {VIDEOS.map((v) => (
                            <button key={v.id} onClick={() => {
                                if (setActiveVideo) setActiveVideo(v);
                                const el = document.getElementById('village');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                                className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300
                                ${activeVideo?.id === v.id ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-transparent hover:border-green-200 hover:scale-[1.01]'}`}>
                                <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title_vi}
                                    className="w-full aspect-video object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                                    <p className="text-[10px] text-white font-medium leading-tight line-clamp-2">{v[`title_${lang}`] || v.title_en}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-3.5 h-3.5 text-white ml-0.5 fill-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </section>
        </>
    );
}
