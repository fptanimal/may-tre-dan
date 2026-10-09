import { useState, useEffect, useRef } from 'react';
import { Settings, Volume2, VolumeX, Music, Music2, ChevronDown, Languages, Check } from 'lucide-react';
import FlagIcon from './FlagIcon';
import {
    isSoundEnabled, setSoundEnabled, getSoundVolume, setSoundVolume,
    isMusicEnabled, setMusicEnabled, getMusicVolume, setMusicVolume,
} from '../lib/soundManager';
import { useLang } from '../context/LanguageContext';

export default function SettingsDropdown() {
    const { text: localize } = useLang();
    const { t, lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const [soundOn, setSoundOn] = useState(isSoundEnabled());
    const [musicOn, setMusicOn] = useState(isMusicEnabled());
    const [sfxVol, setSfxVol] = useState(getSoundVolume());
    const [musicVol, setMusicVol] = useState(getMusicVolume());
    const ref = useRef(null);

    useEffect(() => {
        setSoundOn(isSoundEnabled());
        setMusicOn(isMusicEnabled());
        setSfxVol(getSoundVolume());
        setMusicVol(getMusicVolume());
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', onKey); };
    }, []);

    const toggleSound = () => {
        const v = !soundOn;
        setSoundEnabled(v);
        setSoundOn(v);
    };

    const toggleMusic = () => {
        const v = !musicOn;
        setMusicEnabled(v);
        setMusicOn(v);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                aria-label={localize(t('settings.title'))}
                aria-expanded={open}
                aria-controls="site-settings"
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
                <Settings className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div
                    id="site-settings"
                    className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-50 origin-top-right"
                    style={{ animation: 'fadeInUp 0.15s ease-out' }}
                >
                    <div className="px-4 pt-4 pb-3 border-b border-border/50">
                        <div className="flex items-center gap-2 mb-2.5 text-sm font-semibold">
                            <Languages className="w-4 h-4 text-primary" />
                            <span id="settings-language-label">{t('settings.language')}</span>
                        </div>
                        <div role="group" aria-labelledby="settings-language-label" className="space-y-1">
                            {[
                                { code: 'vi', label: 'Tiếng Việt' },
                                { code: 'en', label: 'English' },
                                { code: 'zh', label: '中文' },
                            ].map(option => (
                                <button key={option.code} type="button" lang={option.code === 'zh' ? 'zh-CN' : option.code}
                                    onClick={() => setLang(option.code)} aria-pressed={lang === option.code}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${lang === option.code ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-accent'}`}>
                                    <FlagIcon code={option.code} className="w-6 h-4 shrink-0 rounded shadow-sm" />
                                    <span>{option.label}</span>
                                    {option.code === 'vi' && <span className="text-[9px] opacity-70">{t('settings.default')}</span>}
                                    {lang === option.code && <Check className="w-3.5 h-3.5 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Sound effects */}
                    <div className="px-4 py-3 border-b border-border/50">
                        <button onClick={toggleSound}
                            role="switch" aria-checked={soundOn}
                            className="w-full flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                {soundOn ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                                {t('settings.sfx')}
                            </span>
                            <span className={`relative w-10 h-5 rounded-full transition-colors ${soundOn ? 'bg-primary' : 'bg-muted'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${soundOn ? 'left-5' : 'left-0.5'}`} />
                            </span>
                        </button>
                        {soundOn && (
                            <div className="flex items-center gap-2 mt-2">
                                <VolumeX className="w-3 h-3 text-muted-foreground" />
                                <input type="range" min="0" max="1" step="0.05" value={sfxVol}
                                    aria-label={localize(t('settings.sfx'))}
                                    onChange={e => { const v = parseFloat(e.target.value); setSfxVol(v); setSoundVolume(v); }}
                                    className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                                <Volume2 className="w-3 h-3 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Healing music */}
                    <div className="px-4 py-3">
                        <button onClick={toggleMusic}
                            role="switch" aria-checked={musicOn}
                            className="w-full flex items-center justify-between mb-2">
                            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                {musicOn ? <Music2 className="w-4 h-4 text-primary" /> : <Music className="w-4 h-4 text-muted-foreground" />}
                                {t('settings.music')}
                            </span>
                            <span className={`relative w-10 h-5 rounded-full transition-colors ${musicOn ? 'bg-primary' : 'bg-muted'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${musicOn ? 'left-5' : 'left-0.5'}`} />
                            </span>
                        </button>
                        {musicOn && (
                            <div className="flex items-center gap-2 mt-2">
                                <VolumeX className="w-3 h-3 text-muted-foreground" />
                                <input type="range" min="0" max="1" step="0.05" value={musicVol}
                                    aria-label={localize(t('settings.music'))}
                                    onChange={e => { const v = parseFloat(e.target.value); setMusicVol(v); setMusicVolume(v); }}
                                    className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                                <Volume2 className="w-3 h-3 text-muted-foreground" />
                            </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{t('settings.musicHint')}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
