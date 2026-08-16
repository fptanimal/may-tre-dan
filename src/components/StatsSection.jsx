import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const STATS = [
    { value: '95%', label_vi: 'Vật liệu tái tạo', label_en: 'Recycled materials', color: 'text-green-500' },
    { value: '0', label_vi: 'Hóa chất độc hại', label_en: 'Toxic chemicals', color: 'text-teal-500' },
    { value: '400+', label_vi: 'Nghệ nhân hỗ trợ', label_en: 'Artisans supported', color: 'text-amber-500' },
];

export default function StatsSection() {
    const { lang } = useLang();

    return (
        <section className="py-16 bg-slate-900 text-white relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-3 gap-8 divide-x divide-slate-800/50">
                    {STATS.map((s, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            whileInView={{ opacity: 1, scale: 1 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.1 }}
                            className="text-center px-4"
                        >
                            <div className={`text-4xl md:text-5xl font-black mb-2 ${s.color}`}>{s.value}</div>
                            <div className="text-sm md:text-base text-slate-400 font-medium">{s[`label_${lang}`] || s.label_vi}</div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-wide">
                        <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">"Mang Tre Đây</span>
                        <span className="text-slate-500 mx-3 font-medium">—</span>
                        <span className="text-white">Ta Cùng Viết Tiếp Câu Chuyện</span>
                        <span className="text-slate-500 mx-3 font-medium">—</span>
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Mây Tre Đan!"</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
