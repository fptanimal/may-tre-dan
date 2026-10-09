import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Feather, Sparkles, Wind, TreePine, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import VillageSection from '../components/VillageSection';
import VRMapSection from '../components/VRMapSection';
import StoriesSection from '../components/StoriesSection';
import VillageVideoGallery from '../components/VillageVideoGallery';
import { useLang } from '../context/LanguageContext';

export default function VillagePage() {
    const { text: localize } = useLang();
    const { lang } = useLang();
    const [activeVideo, setActiveVideo] = useState({ 
        id: 'MW-88Rn9A_0', 
        title_vi: 'Làng nghề mây tre đan Phú Vinh', 
        title_en: 'Phú Vinh Bamboo & Rattan Village' 
    });

    return (
        <div className="pt-16 min-h-screen relative bg-gradient-to-b from-stone-50 via-green-50/40 to-stone-50 overflow-hidden">
            {/* Soft decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-200/30 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="absolute top-40 left-10 text-green-600/30 animate-[pulse_6s_infinite] pointer-events-none -rotate-45">
                <Leaf className="w-32 h-32" />
            </div>
            <div className="absolute top-20 right-1/4 text-emerald-600/25 animate-[bounce_10s_infinite] pointer-events-none rotate-12">
                <Leaf className="w-16 h-16" />
            </div>
            <div className="absolute top-1/3 right-10 text-amber-600/30 animate-[bounce_8s_infinite] pointer-events-none rotate-12">
                <Feather className="w-24 h-24" />
            </div>
            <div className="absolute top-1/2 left-1/4 text-teal-600/20 animate-[pulse_9s_infinite] pointer-events-none -rotate-12">
                <Wind className="w-20 h-20" />
            </div>
            <div className="absolute bottom-1/4 left-20 text-emerald-600/30 animate-[pulse_7s_infinite] pointer-events-none rotate-90">
                <Leaf className="w-40 h-40" />
            </div>
            <div className="absolute bottom-1/3 right-1/4 text-green-700/25 animate-[bounce_12s_infinite] pointer-events-none -rotate-45">
                <TreePine className="w-24 h-24" />
            </div>
            <div className="absolute top-10 left-1/2 text-orange-500/20 animate-[spin_20s_linear_infinite] pointer-events-none">
                <Sun className="w-28 h-28" />
            </div>
            <div className="absolute top-2/3 right-20 text-yellow-600/30 animate-pulse pointer-events-none rotate-45">
                <Sparkles className="w-20 h-20" />
            </div>
            <div className="absolute bottom-10 right-1/2 text-amber-700/20 animate-[pulse_8s_infinite] pointer-events-none rotate-180">
                <Feather className="w-16 h-16" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-4 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                    <ArrowLeft className="w-4 h-4" /> {localize(lang === 'vi' ? 'Về trang chủ' : lang === 'en' ? 'Back to home' : lang === 'es' ? 'Volver al inicio' : '返回首页')}
                </Link>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="relative z-10">
                <VRMapSection />
                <VillageSection activeVideo={activeVideo} />
                <StoriesSection />
                <VillageVideoGallery activeVideo={activeVideo} setActiveVideo={setActiveVideo} />
            </motion.div>
        </div>
    );
}