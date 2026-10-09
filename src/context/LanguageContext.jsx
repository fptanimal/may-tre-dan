import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations } from '../lib/translations';
import { localeExtras } from '../lib/localeExtras';
import { normalizeLanguage, translateText, SUPPORTED_LANGUAGES, LOCALES } from '../lib/localization';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, updateLang] = useState(() => {
        try { return normalizeLanguage(localStorage.getItem('lang')); }
        catch { return 'vi'; }
    });

    useEffect(() => {
        try { localStorage.setItem('lang', lang); } catch { }
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    }, [lang]);

    const setLang = useCallback(value => updateLang(previous => normalizeLanguage(typeof value === 'function' ? value(previous) : value)), []);
    const text = useCallback(value => translateText(value, lang), [lang]);
    const t = useCallback((key, params = {}) => {
        const value = localeExtras[lang]?.[key] ?? translations[lang]?.[key]
            ?? translateText(translations.vi?.[key] ?? translations.en?.[key] ?? key, lang);
        return Object.entries(params).reduce((result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)), translateText(value, lang));
    }, [lang]);
    const toggle = useCallback(() => updateLang(previous => SUPPORTED_LANGUAGES[(SUPPORTED_LANGUAGES.indexOf(previous) + 1) % SUPPORTED_LANGUAGES.length]), []);
    const value = useMemo(() => ({ lang, setLang, toggle, t, text, locale: LOCALES[lang] }), [lang, setLang, toggle, t, text]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLang = () => useContext(LanguageContext);
