import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WandSparkles, PlayCircle } from 'lucide-react';
import { IMAGES } from '../lib/images';

export default function HeroSection() {
    return (
        <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#FAFAF8]">
            {/* Custom Background Image */}
            <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundImage: 'url(/bg-home.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            {/* Optional Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-0"></div>
            
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Text */}
                    <div className="max-w-2xl">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
                                <WandSparkles className="w-4 h-4" />
                                AI Thiết Kế Độc Quyền
                            </div>
                            <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-black text-slate-900 leading-[1.2] tracking-tight mb-6">
                                <span className="whitespace-normal sm:whitespace-nowrap block sm:inline">Gìn giữ di sản còn mãi,</span> <br className="hidden sm:block" />
                                <span className="text-emerald-600 italic whitespace-normal sm:whitespace-nowrap block sm:inline">AI nối tiếp tương lai</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                                Hệ thống AI học hỏi từ hàng ngàn mẫu đan lát Phú Vinh — phác thảo ý tưởng chỉ trong vài giây.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4">
                                <Link to="/ai-design" className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2">
                                    <WandSparkles className="w-5 h-5" />
                                    Bắt đầu tạo bản vẽ
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, x: 40 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden md:block"
                    >
                        {/* Decorative background blob */}
                        <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-3xl scale-110" />
                        
                        {/* Seamless rattan background pattern */}
                        <div 
                            className="absolute inset-[-40%] z-0 opacity-[0.05] pointer-events-none"
                            style={{ 
                                backgroundImage: 'url(/images/rattan_pattern.jpg)', 
                                backgroundSize: '150px',
                                maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
                            }}
                        />
                        
                        {/* CSS Laptop Mockup */}
                        <div className="relative z-10 w-full max-w-[650px] mx-auto drop-shadow-2xl">
                            {/* Screen Bezel */}
                            <div className="bg-[#1a1c23] rounded-t-[1.5rem] p-3 pb-4 md:p-4 md:pb-5 shadow-2xl relative border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-slate-700/50">
                                {/* Webcam */}
                                <div className="absolute top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-black border border-slate-800"></div>
                                
                                {/* Screen Overlay Content (Now native) */}
                                <div className="bg-slate-50 overflow-hidden flex flex-col rounded shadow-inner relative aspect-[16/10] w-full">
                                    {/* Fake UI Header */}
                                    <div className="h-6 md:h-8 bg-slate-100 border-b flex items-center px-3 md:px-4 gap-3 shrink-0">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-rose-400" />
                                            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="h-3 md:h-4 w-24 md:w-32 bg-slate-300/50 rounded-md" />
                                    </div>
                                    {/* Fake UI Body */}
                                    <div className="p-2 md:p-4 flex gap-2 md:gap-4 flex-1 min-h-0">
                                        {/* Sidebar */}
                                        <div className="w-12 md:w-20 flex flex-col gap-2 border-r pr-2 md:pr-4 shrink-0">
                                            {[1,2,3,4,5].map(i => <div key={i} className="h-4 md:h-5 bg-slate-200/60 rounded-md" />)}
                                        </div>
                                        {/* Main Content */}
                                        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-2 md:p-3 flex flex-col gap-2 md:gap-3 overflow-hidden">
                                            {/* Top Toolbar */}
                                            <div className="flex justify-between items-center shrink-0">
                                                <div className="h-3 md:h-4 w-16 md:w-24 bg-slate-200 rounded" />
                                                <div className="flex gap-2">
                                                    <div className="h-5 md:h-6 w-5 md:w-6 bg-slate-200 rounded-full" />
                                                    <div className="h-5 md:h-6 w-12 md:w-16 bg-emerald-100 rounded-md" />
                                                </div>
                                            </div>
                                            {/* Image Area */}
                                            <div className="flex-1 bg-slate-100 rounded-md md:rounded-lg overflow-hidden relative shadow-inner min-h-0">
                                                <img src={IMAGES.product1} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 md:w-12 h-8 md:h-12 border-2 border-emerald-500 rounded-full animate-ping opacity-30" />
                                                </div>
                                                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-[9px] font-bold text-emerald-600">Generated</div>
                                            </div>
                                            {/* Variations Grid */}
                                            <div className="grid grid-cols-4 gap-1.5 md:gap-2 shrink-0">
                                                {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-slate-50 rounded border border-slate-200 shadow-sm" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Laptop Base (Keyboard area profile) */}
                            <div className="relative">
                                {/* Main deck */}
                                <div className="h-4 md:h-5 bg-gradient-to-b from-[#e2e4e9] to-[#c1c5ce] rounded-b-[2rem] md:rounded-b-[2.5rem] relative shadow-2xl border-t border-white/50 flex justify-center">
                                    {/* Thumb groove */}
                                    <div className="absolute top-0 w-24 md:w-32 h-1.5 md:h-2 bg-[#d1d4db] rounded-b-lg shadow-inner"></div>
                                </div>
                                {/* Bottom lip */}
                                <div className="h-1 md:h-1.5 bg-[#a3a7b0] mx-4 md:mx-6 rounded-b-xl shadow-xl"></div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute top-0 right-0 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-100 z-30"
                        >
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                <WandSparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Phác thảo ý tưởng</p>
                                <p className="text-[10px] text-slate-500">Chỉ trong vài giây</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-emerald-100 z-30 w-36"
                        >
                            <p className="text-xs font-bold text-emerald-600 mb-2 text-center">3D Preview</p>
                            <div className="aspect-square bg-emerald-50 rounded-xl overflow-hidden relative border border-emerald-100">
                                <img src={IMAGES.product3} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
