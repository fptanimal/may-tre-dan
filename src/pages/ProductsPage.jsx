import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import EcoShopSection from '../components/EcoShopSection';
import { useLang } from '../context/LanguageContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function ProductsPage() {
    const { lang } = useLang();

    const backText = { vi: 'Về trang chủ', en: 'Back to home', es: 'Volver al inicio', zh: '返回首页', ru: 'На главную', th: 'กลับหน้าหลัก', hi: 'मुख्य पर वापस', ja: 'ホームに戻る', ko: '홈으로' }[lang] || 'Về trang chủ';

    return (
        <div className="pt-16 min-h-screen relative bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/40 overflow-hidden">
            {/* Soft decorative blobs & icons for Shop */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="absolute top-1/4 right-1/4 text-amber-600/10 animate-[bounce_10s_infinite] pointer-events-none rotate-12">
                <ShoppingBag className="w-24 h-24" />
            </div>
            <div className="absolute bottom-1/3 left-10 text-emerald-600/10 animate-[pulse_6s_infinite] pointer-events-none -rotate-45">
                <Leaf className="w-32 h-32" />
            </div>
            <div className="absolute top-1/2 left-1/3 text-yellow-600/10 animate-[pulse_8s_infinite] pointer-events-none">
                <Sparkles className="w-16 h-16" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl py-4 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-600 transition-colors bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-200/50 shadow-sm">
                    <ArrowLeft className="w-4 h-4" /> {backText}
                </Link>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="relative z-10">
                <ErrorBoundary>
                    <EcoShopSection />
                </ErrorBoundary>
            </motion.div>
        </div>
    );
}