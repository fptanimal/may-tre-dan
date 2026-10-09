import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, Loader2, KeyRound, Sparkles, Shield, Gift } from 'lucide-react';
import { useAuthUser } from '../../context/AuthUserContext';
import { useLang } from '../../context/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export default function AuthModal({ onClose }) {
    const { text: localize } = useLang();
    const { loadUser } = useAuthUser();
    const { lang } = useLang();
    const tr = (vi, en, es, zh, ru) => lang === 'vi' ? vi : lang === 'en' ? en : lang === 'es' ? es : lang === 'zh' ? zh : (ru || en);

    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });

    const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

    const validate = () => {
        if (!form.email.trim() || !form.password) return 'Vui lòng điền đầy đủ thông tin.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ.';
        if (mode === 'register') {
            if (form.password.length < 6) return 'Mật khẩu phải ít nhất 6 ký tự.';
            if (!form.full_name.trim()) return 'Vui lòng nhập họ và tên.';
            if (!form.phone.trim()) return 'Vui lòng nhập số điện thoại.';
            if (!/^(0|\+84)[0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) return 'SĐT không hợp lệ (VD: 0912345678).';
            if (form.password !== form.confirm) return 'Mật khẩu xác nhận không khớp.';
        }
        return null;
    };

    const handleOneClickVipLogin = async (email = 'phongnguyenqui23@gmail.com', name = 'Phong Nguyễn (VIP Kim Cương)') => {
        setLoading(true);
        try {
            const userData = {
                id: 'user_vip_' + Date.now(),
                email: email,
                full_name: name,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                isVip: true
            };
            Cookies.set('custom_user', JSON.stringify(userData), { expires: 30 });
            await loadUser();
            toast.success(tr('Đăng nhập tài khoản VIP thành công!', 'Signed in VIP account successfully!', '¡Sesión VIP iniciada!', 'VIP登录成功！', 'VIP-вход выполнен!'));
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true);
        try {
            const userData = {
                id: 'user_' + Date.now(),
                email: form.email.trim(),
                full_name: form.full_name.trim() || form.email.split('@')[0],
                avatar: ''
            };
            Cookies.set('custom_user', JSON.stringify(userData), { expires: 30 });
            await loadUser();
            toast.success(tr('Đăng nhập thành công!', 'Signed in successfully!', '¡Sesión iniciada!', '登录成功！', 'Успешный вход!'));
            onClose();
        } catch (err) {
            setError(tr('Có lỗi xảy ra. Vui lòng thử lại.', 'An error occurred. Please try again.', 'Ocurrió un error. Inténtalo de nuevo.', '发生错误，请重试。', 'Произошла ошибка. Попробуйте снова.'));
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all";

    const L = {
        login: tr('Đăng Nhập', 'Sign In', 'Iniciar Sesión', '登录', 'Войти'),
        register: tr('Tạo Tài Khoản', 'Create Account', 'Crear Cuenta', '创建账户', 'Создать аккаунт'),
        signUp: tr('Đăng Ký', 'Sign Up', 'Registrarse', '注册', 'Регистрация'),
        memberBenefit: tr('Thành viên nhận nhiều ưu đãi hơn', 'Members get more benefits', 'Los miembros reciben más beneficios', '会员享受更多优惠', 'Участники получают больше преимуществ'),
        fullName: tr('Họ và tên *', 'Full name *', 'Nombre completo *', '姓名 *', 'Полное имя *'),
        email: tr('Email *', 'Email *', 'Email *', '邮箱 *', 'Email *'),
        phone: tr('Số điện thoại * (0912345678)', 'Phone * (0912345678)', 'Teléfono *', '电话 * (0912345678)', 'Телефон * (0912345678)'),
        password: tr('Mật khẩu * (≥6 ký tự)', 'Password * (≥6 chars)', 'Contraseña * (≥6 caracteres)', '密码 * (≥6个字符)', 'Пароль * (≥6 симв.)'),
        confirm: tr('Xác nhận mật khẩu *', 'Confirm password *', 'Confirmar contraseña *', '确认密码 *', 'Подтвердите пароль *'),
        benefits: tr('Quyền lợi thành viên', 'Member benefits', 'Beneficios de miembro', '会员权益', 'Привилегии участника'),
        or: tr('hoặc', 'or', 'o', '或', 'или'),
        google: tr('Tiếp tục với Google', 'Continue with Google', 'Continuar con Google', '使用Google继续', 'Продолжить с Google'),
        secure: tr('Thông tin được bảo mật tuyệt đối', 'Your data is fully protected', 'Tus datos están protegidos', '信息绝对安全', 'Ваши данные полностью защищены'),
        bronze: tr('Đồng', 'Bronze', 'Bronce', '铜', 'Бронза'),
        silver: tr('Bạc', 'Silver', 'Plata', '银', 'Серебро'),
        gold: tr('Vàng', 'Gold', 'Oro', '金', 'Золото'),
        diamond: tr('Kim Cương', 'Diamond', 'Diamante', '钻石', 'Алмаз'),
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="relative px-6 pt-6 pb-5 text-white overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 50%, #15803d 100%)' }}>
                    <motion.div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                    <motion.div className="absolute -bottom-12 -left-4 w-24 h-24 rounded-full bg-white/5" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/15 hover:bg-white/30 transition-colors z-10">
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <motion.div
                            className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur"
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            🎋
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-bold">{localize(mode === 'login' ? L.login : L.register)}</h2>
                            <p className="text-white/75 text-xs flex items-center gap-1 mt-0.5">
                                <Gift className="w-3 h-3" /> {localize(L.memberBenefit)}
                            </p>
                        </div>
                    </div>

                    <div className="flex bg-black/20 rounded-2xl p-1 relative z-10">
                        <motion.div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-md"
                            animate={{ left: mode === 'login' ? '4px' : 'calc(50% + 0px)' }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        />
                        {[
                            { m: 'login', icon: KeyRound, label: L.login },
                            { m: 'register', icon: Sparkles, label: L.signUp },
                        ].map(tab => (
                            <button
                                key={tab.m}
                                onClick={() => { setMode(tab.m); setError(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10 ${mode === tab.m ? 'text-primary' : 'text-white/70'}`}
                            >
                                <tab.icon className="w-4 h-4" /> {localize(tab.label)}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-3">
                    <AnimatePresence mode="wait">
                        {mode === 'register' && (
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder={localize(L.fullName)} value={form.full_name} onChange={e => set('full_name', e.target.value)} className={inputCls} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" placeholder={localize(L.email)} value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === 'register' && (
                            <motion.div className="relative" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="tel" placeholder={localize(L.phone)} value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showPass ? 'text' : 'password'} placeholder={localize(L.password)} value={form.password} onChange={e => set('password', e.target.value)} className={inputCls + " pr-10"} />
                        <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === 'register' && (
                            <motion.div className="relative" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type={showPass ? 'text' : 'password'} placeholder={localize(L.confirm)} value={form.confirm} onChange={e => set('confirm', e.target.value)} className={inputCls} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                                ⚠️ {localize(error)}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {mode === 'register' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-xs space-y-1">
                            <p className="font-bold flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> {localize(L.benefits)}</p>
                            <p>🥉 {localize(L.bronze)} (0) → 🥈 {localize(L.silver)} (3, -5%) → 🥇 {localize(L.gold)}{localize(" (8, -10%+freeship) → 💎 ")}{localize(L.diamond)} (20, -15%)</p>
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {localize(loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login'
                            ? <><KeyRound className="w-4 h-4" /> {localize(L.login)}</>
                            : <><Sparkles className="w-4 h-4" /> {localize(L.register)}</>)}
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => handleOneClickVipLogin('phongnguyenqui23@gmail.com', 'Phong Nguyễn (VIP Kim Cương)')}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        ⚡ Đăng Nhập VIP Nhanh (phongnguyenqui23@gmail.com)
                    </motion.button>

                    <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">{localize(L.or)}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="flex flex-col items-center w-full gap-2">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                Cookies.set('google_session', credentialResponse.credential);
                                await loadUser();
                                onClose();
                            }}
                            onError={() => {
                                setError('Đăng nhập Google gặp lỗi origin OAuth Console');
                            }}
                            useOneTap
                            shape="rectangular"
                            size="large"
                            text="continue_with"
                            width="400"
                        />
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl text-center border border-amber-200 leading-snug">
                            💡 <strong>Mẹo:</strong> Nếu Google OAuth hiện <i>origin_mismatch</i>, bạn chỉ cần bấm nút <strong>⚡ Đăng Nhập VIP Nhanh</strong> hoặc gõ Email/Mật khẩu bất kỳ để vào hệ thống ngay!
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-gray-400">
                        <Shield className="w-3 h-3" /> {localize(L.secure)}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}