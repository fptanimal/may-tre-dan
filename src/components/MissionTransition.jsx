import { useLang } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../lib/images';

const MISSIONS = [
    {
        id: 1,
        title: "Sứ mệnh 1",
        text: "Giữ cái hồn của nghề thủ công Việt — để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        style: { width: '50vw', height: '100vh', left: 0, top: 0, position: 'absolute' },
        imageStyle: { width: '50vw', height: '100vh', right: 0, top: 0, position: 'absolute' },
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { opacity: 0, transition: { duration: 0.5 } },
        color: "bg-gradient-to-r from-teal-900 to-teal-800",
        image: IMAGES.product1
    },
    {
        id: 2,
        title: "Sứ mệnh 2",
        text: "Kể chuyện di sản bằng ngôn ngữ mới — đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        style: { width: '50vw', height: '100vh', right: 0, top: 0, position: 'absolute' },
        imageStyle: { width: '50vw', height: '100vh', left: 0, top: 0, position: 'absolute' },
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { opacity: 0, transition: { duration: 0.5 } },
        color: "bg-gradient-to-l from-amber-900 to-orange-900",
        image: IMAGES.product2
    },
    {
        id: 3,
        title: "Sứ mệnh 3",
        text: "Nối người trẻ với làng nghề — biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        style: { width: '100vw', height: '50vh', bottom: 0, left: 0, position: 'absolute' },
        imageStyle: { width: '100vw', height: '50vh', top: 0, left: 0, position: 'absolute' },
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { opacity: 0, transition: { duration: 0.5 } },
        color: "bg-gradient-to-t from-violet-900 to-purple-900",
        image: IMAGES.mission3
    },
    {
        id: 4,
        title: "Sứ mệnh 4",
        text: "Đưa công nghệ phục vụ văn hóa — để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        style: { width: '100vw', height: '50vh', top: 0, left: 0, position: 'absolute' },
        imageStyle: { width: '100vw', height: '50vh', bottom: 0, left: 0, position: 'absolute' },
        initial: { y: '-100%' },
        animate: { y: 0 },
        exit: { opacity: 0, transition: { duration: 0.5 } },
        color: "bg-gradient-to-b from-blue-900 to-cyan-900",
        image: IMAGES.mission4
    },
    {
        id: 5,
        title: "Sứ mệnh 5",
        text: "Để Phú Vinh được nhớ, được yêu và được tiếp nối — không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        style: { width: '100vw', height: '100vh', top: 0, left: 0, position: 'absolute', zIndex: 50 },
        imageStyle: { width: '100vw', height: '100vh', top: 0, left: 0, position: 'absolute', zIndex: 40 },
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { opacity: 0, transition: { duration: 1.5 } },
        color: "bg-gradient-to-br from-rose-900 to-pink-900",
        image: IMAGES.mission5,
        isFinal: true
    }
];

export default function MissionTransition({ onFinish }) {
    const { text: localize } = useLang();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitingGlobal, setExitingGlobal] = useState(false);

    useEffect(() => {
        if (currentIndex < MISSIONS.length && !exitingGlobal) {
            // Slide in + wait
            const timer = setTimeout(() => {
                if (currentIndex === MISSIONS.length - 1) {
                    setExitingGlobal(true);
                    setTimeout(() => {
                        onFinish();
                    }, 1500); // Wait for global fade out
                } else {
                    setCurrentIndex(prev => prev + 1);
                }
            }, 3500); 
            return () => clearTimeout(timer);
        }
    }, [currentIndex, onFinish, exitingGlobal]);

    const handleFastForward = () => {
        if (currentIndex < MISSIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (!exitingGlobal) {
            setExitingGlobal(true);
            setTimeout(() => {
                onFinish();
            }, 500);
        }
    };

    const currentMission = MISSIONS[currentIndex];
    
    // Split text into Main Heading and Subheading
    const textParts = currentMission.text.split('—');
    const mainText = textParts[0].trim();
    const subText = textParts.length > 1 ? textParts[1].trim() : '';

    return (
        <AnimatePresence>
            {!exitingGlobal && (
                <motion.div
                    className="fixed inset-0 z-[9998] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                    onClick={handleFastForward}
                >
                    {/* Skip Button */}
                    <button 
                        onClick={() => {
                            setExitingGlobal(true);
                            setTimeout(() => {
                                onFinish();
                            }, 1500);
                        }}
                        className="absolute top-6 right-6 z-[10000] text-white/50 hover:text-white text-sm uppercase tracking-widest font-bold transition-colors px-4 py-2 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-sm border border-white/10"
                    >{localize("Bỏ qua")}</button>

                    {/* Background Images - Exactly filling the other 50% */}
                    {MISSIONS.map((m, idx) => (
                        <motion.div
                            key={`bg-${m.id}`}
                            className="bg-cover bg-center"
                            style={{ 
                                backgroundImage: `url(${m.image})`,
                                ...m.imageStyle
                            }}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ 
                                opacity: currentIndex === idx ? 1 : 0, 
                                scale: currentIndex === idx ? 1 : 1.1
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        >
                            {/* Overlay for image if needed */}
                            <div className="absolute inset-0 bg-black/30" />
                        </motion.div>
                    ))}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMission.id}
                            style={currentMission.style}
                            className={`flex flex-col items-center justify-center p-8 md:p-16 text-center ${currentMission.color} shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
                            initial={currentMission.initial}
                            animate={currentMission.animate}
                            exit={currentMission.exit}
                            transition={{ 
                                duration: 0.8,
                                ease: "circOut"
                            }}
                        >
                            <h2 className="text-lg md:text-2xl font-bold text-white/50 mb-4 md:mb-8 uppercase tracking-[0.3em]">
                                {localize(currentMission.title)}
                            </h2>
                            <div className="flex flex-col gap-3 md:gap-6 w-[90%] md:max-w-[900px] mx-auto text-white text-center">
                                <h3 
                                    className={`font-black leading-tight ${currentMission.isFinal ? 'text-4xl md:text-6xl lg:text-7xl text-amber-300 drop-shadow-[0_0_25px_rgba(252,211,77,0.6)]' : 'text-3xl md:text-5xl lg:text-6xl drop-shadow-xl'}`}
                                    style={{ textWrap: 'balance' }}
                                >
                                    {localize(mainText)}
                                </h3>
                                {subText && (
                                    <p 
                                        className={`font-normal opacity-90 leading-relaxed ${currentMission.isFinal ? 'text-xl md:text-2xl text-white' : 'text-lg md:text-2xl text-slate-200'}`}
                                        style={{ textWrap: 'balance' }}
                                    >
                                        {localize(subText)}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
