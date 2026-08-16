import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../lib/images';

const MISSIONS = [
    {
        id: 1,
        title: "Sứ mệnh 1",
        main: "Giữ cái hồn của nghề thủ công Việt",
        sub: "để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        image: IMAGES.product1
    },
    {
        id: 2,
        title: "Sứ mệnh 2",
        main: "Kể chuyện di sản bằng ngôn ngữ mới",
        sub: "đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        image: IMAGES.product2
    },
    {
        id: 3,
        title: "Sứ mệnh 3",
        main: "Nối người trẻ với làng nghề",
        sub: "biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        image: IMAGES.product3
    },
    {
        id: 4,
        title: "Sứ mệnh 4",
        main: "Đưa công nghệ phục vụ văn hóa",
        sub: "để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        image: IMAGES.product4
    },
    {
        id: 5,
        title: "Sứ mệnh 5",
        main: "Để Phú Vinh được nhớ, được yêu và được tiếp nối",
        sub: "không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        image: IMAGES.vrHero
    }
];

export default function MissionInteractiveSlide() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Tầm Nhìn & Sứ Mệnh
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Mỗi sản phẩm không chỉ là một món đồ, mà là một câu chuyện văn hóa được kể lại bằng ngôn ngữ đương đại.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left: Navigation / Text */}
                    <div className="flex flex-col gap-6">
                        {MISSIONS.map((mission, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <div 
                                    key={mission.id}
                                    onClick={() => setActiveIndex(index)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={elative cursor-pointer transition-all duration-300 pl-6 border-l-4 py-2 \}
                                >
                                    {/* Typography Layout */}
                                    <div className="flex flex-col gap-2">
                                        <h3 className={ont-serif font-bold transition-all duration-300 \}>
                                            {mission.main}
                                        </h3>
                                        
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.p 
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: '8px' }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-[16px] md:text-[18px] text-slate-600 italic border-l-2 border-emerald-200 pl-4 py-1"
                                                >
                                                    {mission.sub}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Image Frame */}
                    <div className="relative w-full h-[400px] md:h-[460px] lg:h-[480px] rounded-[16px] overflow-hidden shadow-2xl bg-slate-100">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={activeIndex}
                                src={MISSIONS[activeIndex].image}
                                alt={MISSIONS[activeIndex].main}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full object-cover origin-center"
                            />
                        </AnimatePresence>
                        
                        {/* Subtle gradient overlay to make it look premium */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-6 left-6 pointer-events-none">
                            <motion.div 
                                key={adge-\}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-bold text-slate-900 shadow-lg"
                            >
                                {MISSIONS[activeIndex].title}
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
