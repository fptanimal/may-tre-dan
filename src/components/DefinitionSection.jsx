import { useLang } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export default function DefinitionSection() {
    const { text: localize } = useLang();
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
            
            <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">{localize("Nền Tảng Tiên Phong")}</div>
                    <h2 className="text-[clamp(2rem,6vw,4rem)] font-black text-slate-900 mb-8 leading-[1.25]">{localize("Mây Tre Đan Phú Vinh ")}<br className="hidden sm:block" />
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xl whitespace-nowrap mb-1 inline-block sm:mb-0">{localize("Di sản 400 năm")}</span>
                        <br className="sm:hidden" />
                        <span className="ml-0 sm:ml-1 mt-1 sm:mt-0 inline-block">{localize("trên nền tảng số")}</span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">{localize("Chúng tôi là nền tảng số đầu tiên kết nối trực tiếp những giá trị thủ công truyền thống tinh hoa với công nghệ hiện đại. Mang đến hệ sinh thái toàn diện giúp bảo tồn, sáng tạo và lan tỏa văn hóa Việt Nam ra toàn cầu.")}</p>
                </motion.div>
            </div>
        </section>
    );
}
