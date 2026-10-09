import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { ArrowRight, PlayCircle } from 'lucide-react';

const SKIP = {
    vi: 'Bỏ qua', en: 'Skip', es: 'Saltar', zh: '跳过', ru: 'Пропустить', th: 'ข้าม', hi: 'छोड़ें', ja: 'スキップ', ko: '건너뛰기',
};

export default function SplashIntro({ onFinish }) {
    const { text: localize } = useLang();
    const { lang } = useLang();
    const [show, setShow] = useState(true);
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playBlocked, setPlayBlocked] = useState(false);
    const videoRef = useRef(null);
    const c = (obj) => obj[lang] || obj.vi;

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('intro') === '1') {
                sessionStorage.removeItem('splashShown');
            } else if (sessionStorage.getItem('splashShown')) {
                setShow(false);
                onFinish?.();
                return;
            }
        } catch { }
    }, [onFinish]);

    useEffect(() => {
        // Automatically start the video and handle autoplay blocks
        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.play();
                } catch (error) {
                    console.log("Autoplay blocked by browser. User interaction required.");
                    setPlayBlocked(true);
                }
            }
        };
        playVideo();
    }, []);

    const handleManualPlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlayBlocked(false);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleSkip = () => {
        if (exiting) return;
        setExiting(true);
        try { sessionStorage.setItem('splashShown', '1'); } catch { }
        setTimeout(() => {
            setShow(false);
            onFinish?.();
        }, 800); // sync with exit animation
    };

    const handleVideoEnd = () => {
        handleSkip();
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: 'blur(15px)', transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
                >
                    <video
                        ref={videoRef}
                        src="/intro.mp4"
                        className="absolute inset-0 w-full h-full object-cover"
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnd}
                    />

                    {/* Play button if autoplay is blocked */}
                    {playBlocked && (
                        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/40 backdrop-blur-sm">
                            <button
                                onClick={handleManualPlay}
                                className="flex flex-col items-center gap-3 text-white hover:text-primary transition-colors group"
                            >
                                <PlayCircle className="w-16 h-16 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium tracking-wide">{localize("Bấm để phát video")}</span>
                            </button>
                        </div>
                    )}

                    {/* Progress Bar Container */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-10">
                        {/* Progress Indicator */}
                        <div
                            className="h-full bg-emerald-500 shadow-[0_0_10px_#2ECC71] transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Skip button bottom right */}
                    <button
                        onClick={handleSkip}
                        className="absolute bottom-8 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full text-white/80 hover:text-white text-sm font-medium bg-black/40 hover:bg-black/70 border border-white/20 hover:border-white/40 backdrop-blur-md transition-all group"
                    >
                        {localize(c(SKIP))}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* White flash on exit for smoother transition */}
                    <AnimatePresence>
                        {exiting && (
                            <motion.div className="absolute inset-0 z-50 pointer-events-none bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0, 0.6, 1] }}
                                transition={{ duration: 1.2, times: [0, 0.5, 0.8, 1] }} />
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}