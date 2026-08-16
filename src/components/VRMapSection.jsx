import { motion } from 'framer-motion';
import { Compass, MapPin, Navigation, Eye } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function VRMapSection() {
    const { t } = useLang();

    return (
        <section id="vr-tour" className="py-24 relative bg-gradient-to-b from-emerald-50/40 via-background to-background overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-4">
                        <Compass className="w-3.5 h-3.5" /> {t('vr.badge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
                        {t('vr.title')} <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('vr.titleAccent')}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{t('vr.desc')}</p>
                    <p className="text-xs text-amber-600 font-medium mt-3 bg-amber-100/50 inline-block px-3 py-1 rounded-full border border-amber-200">Đang trong quá trình phát triển</p>
                </motion.div>

                {/* Google Street View Full Container */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 bg-card aspect-[4/3] sm:aspect-video relative"
                >
                    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent px-5 py-4 pointer-events-none flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">⛩️</div>
                            <div>
                                <h3 className="font-bold text-base">Cổng Làng Phú Vinh</h3>
                                <p className="text-white/80 text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> 20.8981°N, 105.6829°E
                                </p>
                            </div>
                        </div>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1715000000000!6m8!1m7!1sr90_gUOyH8sOLqQaw1h6LA!2m2!1d20.9374982!2d105.645589!3f151.81!4f0!5f0.78"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', inset: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mt-10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: MapPin, value: '1', label: t('vr.stats1') },
                        { icon: Compass, value: '360°', label: t('vr.stats2') },
                        { icon: Eye, value: '3D', label: t('vr.stats3') },
                        { icon: Navigation, value: '35km', label: t('vr.stats4') },
                    ].map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-2xl bg-card border border-border">
                            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                            <p className="text-xl font-bold text-foreground">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}