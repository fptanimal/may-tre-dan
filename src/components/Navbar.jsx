import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import UserMenu from './auth/UserMenu';
import AuthModal from './auth/AuthModal';
import SettingsDropdown from './SettingsDropdown';
import NotificationBell from './user/NotificationBell';
export default function Navbar() {
    const { text: localize } = useLang();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const { t } = useLang();
    const location = useLocation();

    const NAV_LINKS = [
        { label: t('nav.home'), to: '/' },
        { label: t('nav.ai') || 'Đan AI', to: '/ai-design' },
        { label: t('nav.shop'), to: '/products' },
        { label: t('nav.village'), to: '/village' },
        { 
            label: t('nav.commitments') || 'Cam kết', 
            subLinks: [
                { label: t('nav.privacy') || 'Chính sách bảo mật', to: '/privacy' },
                { label: t('nav.impact') || 'Tác động thực tế', to: '/commitments' },
            ]
        },
        { label: t('nav.membership'), to: '/membership' },
    ];

    const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-background/75 backdrop-blur-xl border-b border-border/40 shadow-sm">
                <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between gap-8">
                    {/* Zone 1: Logo */}
                    <div className="flex-1 flex items-center justify-start">
                        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <div className="w-9 h-9 rounded-xl border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 overflow-hidden">
                                <img src="/logo.png" alt={localize("Logo")} className="w-full h-full object-contain" />
                            </div>
                            <div className="hidden sm:block leading-none">
                                <span className="text-[15px] font-semibold text-foreground tracking-tight block">{localize("Đan Mây")}</span>
                                <span className="text-[10px] text-primary/60 mt-0.5 block">{t('nav.tagline')}</span>
                            </div>
                        </Link>
                    </div>

                    {/* Zone 2: Navigation — centered */}
                    <div className="hidden xl:flex items-center justify-center gap-5 xl:gap-8">
                        {NAV_LINKS.map((link, idx) => {
                            if (link.subLinks) {
                                return (
                                    <div key={idx} className="relative group">
                                        <button className="relative py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-primary flex items-center gap-1">
                                            {localize(link.label)}
                                            <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                                        </button>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col p-2 z-50">
                                            {link.subLinks.map((sub, sidx) => (
                                                <Link key={sidx} to={sub.to} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 rounded-lg transition-colors">
                                                    {localize(sub.label)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            const active = isActive(link.to);
                            return (
                                <Link key={link.to} to={link.to} className={`relative py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 group ${active ? 'text-primary' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}>
                                    <span className="flex items-center gap-2">
                                        {localize(link.label)}
                                        {link.demo && (
                                            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 leading-none">{localize("DEMO")}</span>
                                        )}
                                    </span>
                                    <span className={`absolute -bottom-1.5 left-0 h-[3px] bg-primary rounded-full transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Zone 3: Utilities */}
                    <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3 flex-shrink-0">
                        <Link to="/products" aria-label={localize("Cart")} className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200">
                            <ShoppingCart className="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
                        </Link>
                        
                        <div className="hidden sm:flex items-center gap-1 sm:gap-3">
                            <SettingsDropdown />
                            <NotificationBell />
                        </div>
                        <div className="scale-90 sm:scale-100 origin-right">
                            <UserMenu onOpenAuth={() => setAuthOpen(true)} />
                        </div>
                        <button className="xl:hidden p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label={localize("Menu")}>
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                <div className={`xl:hidden fixed top-[72px] inset-x-0 bottom-0 z-50 bg-background border-t border-border/40 shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto flex flex-col ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                    <div className="px-5 py-6 space-y-2 flex-1">
                        {NAV_LINKS.map((link, idx) => {
                            if (link.subLinks) {
                                return (
                                    <div key={idx} className="flex flex-col gap-1 py-2">
                                        <div className="px-4 text-[16px] font-bold text-slate-900 dark:text-slate-100 opacity-70">
                                            {localize(link.label)}
                                        </div>
                                        <div className="flex flex-col pl-6 border-l-[3px] border-emerald-100 dark:border-emerald-900/30 ml-4 gap-1 mt-2">
                                            {link.subLinks.map((sub, sidx) => (
                                                <Link key={sidx} to={sub.to} onClick={() => setMobileOpen(false)} className="py-3 px-2 min-h-[44px] flex items-center text-[15px] text-slate-600 dark:text-slate-400 hover:text-emerald-600 active:bg-emerald-50 rounded-lg">
                                                    {localize(sub.label)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            const active = isActive(link.to);
                            return (
                                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-4 min-h-[48px] text-[16px] font-semibold rounded-2xl transition-all ${active ? 'text-primary bg-primary/10 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                                    {localize(link.label)}
                                    {link.demo && <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 leading-none">{localize("DEMO")}</span>}
                                    {active && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {/* Utilities at bottom of mobile menu */}
                    <div className="px-5 py-6 mt-auto border-t border-border/40 sm:hidden flex items-center justify-around pb-10">
                        <SettingsDropdown />
                        <NotificationBell />
                    </div>
                </div>
            </nav>

            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
        </>
    );
}