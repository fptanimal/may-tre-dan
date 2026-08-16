import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Leaf, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ValuesSection from '../components/ValuesSection';
import { useLang } from '../context/LanguageContext';

export default function CommitmentsPage() {
    const { lang } = useLang();

    const backText = { vi: 'Về trang chủ', en: 'Back to home', es: 'Volver al inicio', zh: '返回首页', ru: 'На главную' }[lang] || 'Về trang chủ';

    return (
        <div className="pt-16 min-h-screen relative bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="absolute top-1/4 left-10 text-emerald-600/15 animate-[pulse_6s_infinite] pointer-events-none -rotate-12">
                <Shield className="w-28 h-28" />
            </div>
            <div className="absolute top-1/3 right-1/4 text-green-600/10 animate-[bounce_10s_infinite] pointer-events-none rotate-12">
                <Leaf className="w-20 h-20" />
            </div>
            <div className="absolute bottom-1/3 right-10 text-rose-500/10 animate-pulse pointer-events-none rotate-45">
                <Heart className="w-24 h-24" />
            </div>
            <div className="absolute top-2/3 left-1/4 text-yellow-500/15 animate-[pulse_8s_infinite] pointer-events-none">
                <Sparkles className="w-16 h-16" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-4 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-200/50 shadow-sm">
                    <ArrowLeft className="w-4 h-4" /> {backText}
                </Link>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="relative z-10">
                <ValuesSection />
            </motion.div>
        </div>
    );
}
