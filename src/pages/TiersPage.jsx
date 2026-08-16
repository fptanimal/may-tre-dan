import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { useAuthUser } from '../context/AuthUserContext';
import { ArrowLeft, Crown, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TIERS, getNextTier } from '../lib/membership';

export default function TiersPage() {
    const { t, lang } = useLang();
    const { userProfile, user } = useAuthUser();
    const navigate = useNavigate();

    const currentTier = userProfile?.membership_tier || 'bronze';
    const totalOrders = userProfile?.total_orders || 0;
    const nextTier = getNextTier(currentTier);
    const nextTierInfo = nextTier ? TIERS[nextTier] : null;

    const progress = nextTierInfo ? Math.min(100, Math.max(0, (totalOrders / nextTierInfo.minOrders) * 100)) : 100;

    const tr = (vi, en) => lang === 'vi' ? vi : (en || vi);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {tr('Quay lại', 'Back')}
                    </button>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                        <Crown className="w-4 h-4" /> {tr('Hạng Thành Viên', 'Loyalty Tiers')}
                    </div>
                </div>

                {/* User Status Card */}
                {user && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                        className={`mb-12 p-6 md:p-8 rounded-3xl bg-gradient-to-br ${TIERS[currentTier].color} text-white shadow-xl relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-lg border border-white/30">
                                    {TIERS[currentTier].emoji}
                                </div>
                                <div>
                                    <p className="text-white/80 font-medium mb-1">{tr('Hạng hiện tại của bạn', 'Your current tier')}</p>
                                    <h2 className="text-3xl font-bold tracking-tight">{TIERS[currentTier].name}</h2>
                                    <p className="text-sm text-white/90 mt-1 flex items-center gap-1">
                                        <ShoppingBag className="w-4 h-4" /> {totalOrders} {tr('đơn hàng đã hoàn thành', 'completed orders')}
                                    </p>
                                </div>
                            </div>

                            {nextTierInfo && (
                                <div className="w-full md:w-1/3 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span>{tr('Tiến trình lên hạng', 'Progress to next tier')}</span>
                                        <span>{totalOrders} / {nextTierInfo.minOrders}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <p className="text-xs text-center mt-3 text-white/80">
                                        {tr(`Chỉ cần ${nextTierInfo.minOrders - totalOrders} đơn nữa để lên hạng`, `Only ${nextTierInfo.minOrders - totalOrders} more orders to reach`)} <strong>{nextTierInfo.name}</strong> {nextTierInfo.emoji}
                                    </p>
                                </div>
                            )}
                            {!nextTierInfo && (
                                <div className="w-full md:w-1/3 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                                    <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                                    <p className="text-sm font-bold text-yellow-300">{tr('Hạng Cao Nhất', 'Highest Tier reached')}</p>
                                    <p className="text-xs text-white/80 mt-1">{tr('Cảm ơn bạn đã luôn đồng hành cùng Phú Vinh', 'Thank you for your incredible loyalty')}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {!user && (
                    <div className="mb-12 text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
                        <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{tr('Quyền lợi Thành viên', 'Membership Tiers')}</h2>
                        <p className="text-slate-500 mb-6">{tr('Đăng nhập để xem hạng thành viên của bạn và bắt đầu tích lũy đơn hàng.', 'Login to view your tier and start accumulating orders.')}</p>
                        <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-all">
                            {t('user.login')}
                        </button>
                    </div>
                )}

                {/* Tiers List */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center mb-8">{tr('Các Cấp Độ Thành Viên', 'Membership Levels')}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(TIERS).map(([tierKey, tierInfo], idx) => {
                            const isCurrent = currentTier === tierKey;
                            return (
                                <motion.div 
                                    key={tierKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative p-6 rounded-3xl bg-white border-2 transition-all duration-300 hover:shadow-xl ${isCurrent ? tierInfo.border + ' shadow-lg scale-[1.02]' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    {isCurrent && (
                                        <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tierInfo.color} shadow-lg`}>
                                            {tr('Hạng của bạn', 'Your Tier')}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md ${tierInfo.bg} ${tierInfo.text}`}>
                                            {tierInfo.emoji}
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-bold ${tierInfo.text}`}>{tierInfo.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {tierInfo.minOrders === 0 ? tr('Mặc định khi đăng ký', 'Default on signup') : tr(`Từ ${tierInfo.minOrders} đơn hàng`, `From ${tierInfo.minOrders} orders`)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {tierInfo.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 rounded-full p-1 ${tierInfo.bg} ${tierInfo.text}`}>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium leading-relaxed">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {tierInfo.discount > 0 && (
                                        <div className={`mt-6 p-4 rounded-xl ${tierInfo.bg} border ${tierInfo.border} border-dashed`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-bold ${tierInfo.text}`}>{tr('Quyền lợi Voucher', 'Voucher Perks')}</span>
                                                <span className={`text-xs px-2 py-1 rounded-md bg-white font-bold ${tierInfo.text}`}>
                                                    {tierInfo.vouchers.length} Vouchers
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
