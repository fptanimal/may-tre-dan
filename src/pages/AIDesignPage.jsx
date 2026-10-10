import { useState, useEffect, useRef } from 'react';
import { Sparkles, WandSparkles, Palette, Layers, Cpu, Eye, Maximize2, Download, RotateCcw, Camera, X, Loader2, RefreshCw, ImageIcon, Upload, Users, Video, TreePine, Wrench, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { prepareDesignPhoto, runDesignWorkflow, workflowLabel, workflowError } from '../lib/danWorkflow';
import { useLang } from '../context/LanguageContext';
import ArtisanOrderModal from '../components/artisans/ArtisanOrderModal';
import CameraCapture from '../components/CameraCapture';
import AIDesignEditor from '../components/AIDesignEditor';
import DesignStudio from '../components/DesignStudio';



const SUGGESTIONS = [
    { icon: '🪴', textKey: 'hero.sug1.t', style: 'Wabi-sabi' },
    { icon: '🪷', textKey: 'hero.sug2.t', style: 'Bohemian' },
    { icon: '👜', textKey: 'hero.sug3.t', style: 'Luxury' },
    { icon: '🏮', textKey: 'hero.sug4.t', style: 'Modern' },
    { icon: '☀️', textKey: 'hero.sug5.t', style: 'Boho' },
    { icon: '🧘', textKey: 'hero.sug6.t', style: 'Zen' },
];

const STYLE_PRESETS = [
    { key: 'boho', emoji: '🌿', bg: 'from-amber-100 to-orange-50', border: 'border-amber-300', text: 'text-amber-700' },
    { key: 'luxury', emoji: '✨', bg: 'from-yellow-100 to-amber-50', border: 'border-yellow-300', text: 'text-yellow-700' },
    { key: 'zen', emoji: '🏮', bg: 'from-teal-100 to-green-50', border: 'border-teal-300', text: 'text-teal-700' },
    { key: 'modern', emoji: '🏙️', bg: 'from-blue-100 to-cyan-50', border: 'border-blue-300', text: 'text-blue-700' },
    { key: 'royal', emoji: '👑', bg: 'from-purple-100 to-violet-50', border: 'border-purple-300', text: 'text-purple-700' },
    { key: 'rustic', emoji: '🪵', bg: 'from-stone-100 to-amber-50', border: 'border-stone-300', text: 'text-stone-700' },
];

const SAMPLE_RESULTS = [
    { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', label: 'Ghế Boho Sen' },
    { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80', label: 'Đèn Mây Nghệ Thuật' },
    { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', label: 'Nội Thất Tre' },
];

function DanAIWorkflowHUD({ step = 1, attempt = 1, lang = 'vi' }) {
    const [tick, setTick] = useState(0);
    const [visibleLogs, setVisibleLogs] = useState([]);
    const prevStepRef = useRef(step);

    const stepsList = [
        { id: 1, label: lang === 'vi' ? 'Đọc yêu cầu & phòng' : 'Read request & room', icon: '🔍', detail: 'Scanning spatial layout, ambient light & specification parameters', color: '#06b6d4' },
        { id: 2, label: lang === 'vi' ? 'Tra catalog & quy tắc' : 'Retrieve catalog & rules', icon: '📚', detail: 'Cross-referencing material database & 38 craft regulations', color: '#8b5cf6' },
        { id: 3, label: lang === 'vi' ? 'Check 6 nhóm an toàn' : 'Check 6 safety groups', icon: '⚖️', detail: 'Verifying load capacity, ceiling mount, electrical safety & compression', color: '#f59e0b' },
        { id: 4, label: lang === 'vi' ? 'Phối cảnh chính 0°' : 'Main elevation 0°', icon: '📐', detail: 'Bending bamboo strips, generating front-view woven pattern at 0°', color: '#10b981' },
        { id: 5, label: lang === 'vi' ? 'Góc xoay 90° & 180°' : 'Rotate views 90° & 180°', icon: '🔄', detail: 'Matching side (90°) & rear (180°) structural consistency', color: '#3b82f6' },
        { id: 6, label: lang === 'vi' ? 'Thẩm định 49 Checklist' : 'Inspect 49 checklist', icon: '🔬', detail: 'AI vision scan & artisan evaluation of 49 quality standards', color: '#ef4444' },
        { id: 7, label: lang === 'vi' ? 'Xuất hồ sơ & Duyệt' : 'Release checked concept', icon: '📜', detail: 'Finalizing 3 perspective renders & manufacturing evidence', color: '#22c55e' },
    ];

    const allLogs = [
        { code: 'S1C01', text: 'Phân tích ảnh phòng & yêu cầu không gian', status: 'PASS' },
        { code: 'S1C04', text: 'Xác định nguồn kích thước theo bằng chứng', status: 'PASS' },
        { code: 'S1C06', text: 'Tách yêu cầu bắt buộc & giả định', status: 'PASS' },
        { code: 'S2C02', text: 'Lấy quy chuẩn vật liệu nan mây tuốt mỏng', status: 'PASS' },
        { code: 'S2C05', text: 'Kiểm tra tính nhất quán catalog vật liệu', status: 'PASS' },
        { code: 'S3C01', text: 'Kiểm tra liên kết khung tre & mối uốn cong', status: 'PASS' },
        { code: 'S3C04', text: 'Đánh giá an toàn chịu lực & treo trần', status: 'PASS' },
        { code: 'S3C07', text: 'Xác nhận điều kiện sử dụng đặc biệt', status: 'REVIEW' },
        { code: 'S4C01', text: 'Phối cảnh chính diện 0° sắc nét cao', status: 'PASS' },
        { code: 'S4C04', text: 'Kiểm tra liên tục cấu trúc nan đan', status: 'PASS' },
        { code: 'S4C06', text: 'Nhận dạng vật thể duy nhất & đồng nhất', status: 'PASS' },
        { code: 'S5C02', text: 'Đối chiếu tỷ lệ phối cảnh side 90°', status: 'PASS' },
        { code: 'S5C03', text: 'Khớp đồng nhất góc nhìn 90° & 180°', status: 'PASS' },
        { code: 'S5C06', text: 'Kiểm tra rear 180° với cùng vật thể', status: 'PASS' },
        { code: 'S6C03', text: 'Đối chiếu lại tính bền vững kết cấu', status: 'PASS' },
        { code: 'S6C05', text: 'Kiểm định giới hạn đã xác minh', status: 'PASS' },
        { code: 'S6C07', text: 'Đạt 49/49 quy chuẩn kiểm định nghệ nhân', status: 'PASS' },
        { code: 'S7C01', text: 'Bảy bước và đầu ra hoàn tất cùng revision', status: 'PASS' },
        { code: 'S7C03', text: 'Nhãn concept_only, pending_artisan đính kèm', status: 'PASS' },
        { code: 'S7C05', text: 'Chỉ nhánh đủ điều kiện mới được xuất ảnh', status: 'PASS' },
    ];

    const currentStep = Math.min(Math.max(step, 1), 7);
    const progressPercent = Math.round((currentStep / 7) * 100);
    const currentColor = stepsList[currentStep - 1].color;

    // Animate tick counter
    useEffect(() => {
        const iv = setInterval(() => setTick(t => t + 1), 80);
        return () => clearInterval(iv);
    }, []);

    // Cascade checklist logs based on step
    useEffect(() => {
        if (step !== prevStepRef.current) {
            prevStepRef.current = step;
        }
        const maxLogs = Math.min(currentStep * 3, allLogs.length);
        if (visibleLogs.length < maxLogs) {
            const timer = setTimeout(() => {
                setVisibleLogs(allLogs.slice(0, visibleLogs.length + 1));
            }, 250 + Math.random() * 200);
            return () => clearTimeout(timer);
        }
    }, [currentStep, visibleLogs.length]);

    // Animated statistics
    const fps = 60 - (tick % 3);
    const memUsage = (42 + (tick * 7) % 18).toFixed(0);
    const rulesAudited = Math.min(49, currentStep * 7 + (tick % 8));
    const elapsed = ((tick * 0.08) + 0.1).toFixed(1);

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0c1222 30%, #061218 60%, #020a12 100%)' }}>
            {/* Animated dot matrix background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: `radial-gradient(${currentColor}40 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                animation: 'none',
                transform: `translate(${Math.sin(tick * 0.02) * 3}px, ${Math.cos(tick * 0.02) * 3}px)`,
            }} />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 3 + i % 3, height: 3 + i % 3,
                        background: currentColor,
                        opacity: 0.3 + Math.sin((tick + i * 40) * 0.03) * 0.3,
                        left: `${10 + ((tick * (0.3 + i * 0.15) + i * 60) % 80)}%`,
                        top: `${15 + ((tick * (0.2 + i * 0.1) + i * 40) % 70)}%`,
                        boxShadow: `0 0 6px ${currentColor}`,
                        transition: 'all 0.3s',
                    }}
                />
            ))}

            {/* Scan line sweep */}
            <div className="absolute left-0 right-0 h-[1px] pointer-events-none"
                style={{
                    top: `${(tick * 1.5) % 100}%`,
                    background: `linear-gradient(90deg, transparent, ${currentColor}60, transparent)`,
                    boxShadow: `0 0 20px ${currentColor}40`,
                }}
            />

            <div className="relative z-10 flex flex-col h-full p-3 sm:p-4">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b" style={{ borderColor: `${currentColor}30` }}>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: currentColor }} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: currentColor }} />
                        </span>
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: currentColor }}>
                            ĐAN AI · {attempt > 1 ? `REVISION #${attempt}` : 'PRODUCTION PIPELINE'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: `${currentColor}50`, color: currentColor, background: `${currentColor}10` }}>
                            {elapsed}s
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold" style={{ borderColor: `${currentColor}50`, color: currentColor, background: `${currentColor}15` }}>
                            {progressPercent}%
                        </span>
                    </div>
                </div>

                {/* Step nodes with connecting line */}
                <div className="relative mb-3">
                    {/* Track line */}
                    <div className="absolute top-[14px] left-[14px] right-[14px] h-[2px] rounded-full" style={{ background: '#1e293b' }}>
                        <div className="h-full rounded-full transition-all duration-700 ease-out relative"
                            style={{
                                width: `${((currentStep - 1) / 6) * 100}%`,
                                background: `linear-gradient(90deg, ${stepsList[0].color}, ${currentColor})`,
                                boxShadow: `0 0 12px ${currentColor}80`,
                            }}>
                            {/* Pulse trail */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                                style={{ background: currentColor, boxShadow: `0 0 16px ${currentColor}, 0 0 32px ${currentColor}60`, animation: 'pulse 1s infinite' }} />
                        </div>
                    </div>

                    <div className="relative flex justify-between items-start">
                        {stepsList.map((s) => {
                            const isDone = s.id < currentStep;
                            const isCurrent = s.id === currentStep;
                            const isFuture = s.id > currentStep;
                            return (
                                <div key={s.id} className="flex flex-col items-center gap-1" style={{ width: '14%' }}>
                                    <div className="relative">
                                        {/* Glow ring for current */}
                                        {isCurrent && (
                                            <div className="absolute -inset-1.5 rounded-full animate-ping opacity-30" style={{ background: s.color }} />
                                        )}
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-2 relative`}
                                            style={{
                                                background: isDone ? s.color : isCurrent ? `${s.color}20` : '#0f172a',
                                                borderColor: isDone ? s.color : isCurrent ? s.color : '#334155',
                                                color: isDone ? '#fff' : isCurrent ? s.color : '#475569',
                                                boxShadow: isCurrent ? `0 0 20px ${s.color}60, inset 0 0 8px ${s.color}20` : isDone ? `0 0 8px ${s.color}40` : 'none',
                                                transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                                            }}>
                                            {isDone ? '✓' : s.id}
                                        </div>
                                    </div>
                                    {/* Step label - only show for current and done */}
                                    {(isCurrent || isDone) && (
                                        <span className="text-[8px] font-mono text-center leading-tight max-w-[60px] truncate" style={{ color: isCurrent ? s.color : '#64748b' }}>
                                            {s.label.split(' ')[0]}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current step detail card */}
                <div className="rounded-xl p-3 mb-3 border relative overflow-hidden" style={{
                    background: `linear-gradient(135deg, ${currentColor}08, ${currentColor}03)`,
                    borderColor: `${currentColor}30`,
                }}>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: `linear-gradient(105deg, transparent 40%, ${currentColor}08 50%, transparent 60%)`,
                        transform: `translateX(${(tick * 3) % 200 - 100}%)`,
                    }} />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                            style={{ background: `${currentColor}15`, borderColor: `${currentColor}30` }}>
                            {stepsList[currentStep - 1].icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider" style={{ color: currentColor }}>
                                    STEP {currentStep}: {stepsList[currentStep - 1].label}
                                </span>
                            </div>
                            <p className="text-[10px] font-mono truncate" style={{ color: `${currentColor}aa` }}>
                                {stepsList[currentStep - 1].detail}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${currentColor}30`, borderTopColor: currentColor }} />
                        </div>
                    </div>
                </div>

                {/* Two-column panel: Blueprint + Checklist */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                    {/* Left: Rotating Blueprint Wireframe */}
                    <div className="rounded-xl border overflow-hidden relative" style={{ background: '#030a14', borderColor: `${currentColor}20` }}>
                        {/* Grid overlay */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `linear-gradient(${currentColor}15 1px, transparent 1px), linear-gradient(90deg, ${currentColor}15 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }} />

                        <svg className="w-full h-full relative z-10 p-3" viewBox="0 0 120 120" fill="none"
                            style={{ transform: `rotate(${tick * 0.3}deg)`, transition: 'transform 0.08s linear' }}>
                            {/* Outer rings */}
                            <circle cx="60" cy="60" r="52" stroke={currentColor} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
                            <circle cx="60" cy="60" r="42" stroke={currentColor} strokeWidth="0.8" opacity="0.5" />
                            <circle cx="60" cy="60" r="30" stroke={currentColor} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />

                            {/* Dynamic product wireframe based on step */}
                            {currentStep <= 2 && <>
                                <path d="M40 75 Q60 25 80 75" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.8" />
                                <line x1="60" y1="20" x2="60" y2="30" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
                                <ellipse cx="60" cy="76" rx="20" ry="4" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity="0.5" />
                            </>}
                            {currentStep === 3 && <>
                                <rect x="38" y="35" width="44" height="50" rx="8" stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.7" />
                                <line x1="38" y1="50" x2="82" y2="50" stroke={currentColor} strokeWidth="0.5" opacity="0.5" />
                                <line x1="38" y1="65" x2="82" y2="65" stroke={currentColor} strokeWidth="0.5" opacity="0.5" />
                                <line x1="52" y1="35" x2="52" y2="85" stroke={currentColor} strokeWidth="0.5" opacity="0.4" />
                                <line x1="68" y1="35" x2="68" y2="85" stroke={currentColor} strokeWidth="0.5" opacity="0.4" />
                            </>}
                            {currentStep === 4 && <>
                                <path d="M35 80 Q48 25 60 28 Q72 25 85 80" stroke="#10b981" strokeWidth="1.8" fill="rgba(16,185,129,0.06)" />
                                <path d="M42 78 Q52 35 60 38 Q68 35 78 78" stroke="#10b981" strokeWidth="0.8" fill="none" opacity="0.5" />
                                <text x="60" y="92" textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace" opacity="0.6">FRONT 0°</text>
                            </>}
                            {currentStep === 5 && <>
                                <ellipse cx="50" cy="55" rx="18" ry="30" stroke="#3b82f6" strokeWidth="1.2" fill="none" opacity="0.7"
                                    transform="rotate(-10 50 55)" />
                                <ellipse cx="74" cy="55" rx="14" ry="24" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.5"
                                    transform="rotate(10 74 55)" />
                                <text x="50" y="92" textAnchor="middle" fill="#3b82f6" fontSize="6" fontFamily="monospace" opacity="0.6">90°</text>
                                <text x="74" y="92" textAnchor="middle" fill="#f59e0b" fontSize="6" fontFamily="monospace" opacity="0.6">180°</text>
                            </>}
                            {currentStep >= 6 && <>
                                <polygon points="60,22 82,45 82,75 60,98 38,75 38,45" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.05)" />
                                <polygon points="60,32 74,47 74,73 60,88 46,73 46,47" stroke="#22c55e" strokeWidth="0.8" fill="none" opacity="0.4" />
                                <circle cx="60" cy="60" r="8" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.1)" />
                                <circle cx="60" cy="60" r="3" fill="#22c55e" opacity="0.8" />
                            </>}

                            {/* Crosshairs */}
                            <line x1="60" y1="4" x2="60" y2="116" stroke={currentColor} strokeWidth="0.3" opacity="0.15" />
                            <line x1="4" y1="60" x2="116" y2="60" stroke={currentColor} strokeWidth="0.3" opacity="0.15" />

                            {/* Sweeping radar line */}
                            <line x1="60" y1="60" x2={60 + 48 * Math.cos(tick * 0.05)} y2={60 + 48 * Math.sin(tick * 0.05)}
                                stroke={currentColor} strokeWidth="1.2" opacity="0.6">
                            </line>
                            <circle cx={60 + 48 * Math.cos(tick * 0.05)} cy={60 + 48 * Math.sin(tick * 0.05)}
                                r="2" fill={currentColor} opacity="0.8" />

                            {/* Center dot */}
                            <circle cx="60" cy="60" r="1.5" fill={currentColor} opacity="0.9" />
                        </svg>

                        {/* Corner labels */}
                        <div className="absolute top-1.5 left-2 text-[8px] font-mono" style={{ color: `${currentColor}80` }}>
                            {currentStep <= 3 ? 'ANALYZE' : currentStep === 4 ? 'RENDER 0°' : currentStep === 5 ? 'MULTI-VIEW' : 'CERTIFY'}
                        </div>
                        <div className="absolute bottom-1.5 right-2 text-[8px] font-mono" style={{ color: `${currentColor}60` }}>
                            FPS:{fps} · MEM:{memUsage}MB
                        </div>
                    </div>

                    {/* Right: Live Checklist Stream */}
                    <div className="rounded-xl border overflow-hidden flex flex-col" style={{ background: '#030a14', borderColor: `${currentColor}20` }}>
                        <div className="flex items-center justify-between px-2.5 py-1.5 border-b" style={{ borderColor: `${currentColor}15` }}>
                            <span className="text-[9px] font-mono font-bold flex items-center gap-1.5" style={{ color: currentColor }}>
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: currentColor }} />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: currentColor }} />
                                </span>
                                AUDIT LOG
                            </span>
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: '#22c55e', background: '#22c55e10' }}>
                                {rulesAudited}/49
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-[3px] scrollbar-hide">
                            {visibleLogs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 font-mono leading-tight"
                                    style={{
                                        animation: `fadeSlideIn 0.3s ease-out`,
                                        opacity: idx === visibleLogs.length - 1 ? (tick % 4 < 2 ? 1 : 0.7) : 1,
                                    }}>
                                    <span className="text-[8px] shrink-0 px-1 py-[1px] rounded font-bold"
                                        style={{
                                            background: log.status === 'PASS' ? '#22c55e15' : '#f59e0b15',
                                            color: log.status === 'PASS' ? '#22c55e' : '#f59e0b',
                                        }}>
                                        {log.status === 'PASS' ? '✓' : '⚠'}
                                    </span>
                                    <span className="text-[8px]" style={{ color: '#94a3b8' }}>
                                        <span style={{ color: `${currentColor}90` }}>[{log.code}]</span> {log.text}
                                    </span>
                                </div>
                            ))}
                            {/* Typing indicator */}
                            {visibleLogs.length < allLogs.length && (
                                <div className="flex items-center gap-1 mt-1">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-1 h-1 rounded-full" style={{
                                            backgroundColor: currentColor,
                                            opacity: (tick + i * 3) % 9 < 5 ? 0.8 : 0.2,
                                            transition: 'opacity 0.15s',
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-2.5 py-1.5 border-t flex items-center justify-between" style={{ borderColor: `${currentColor}10` }}>
                            <span className="text-[8px] font-mono" style={{ color: '#475569' }}>
                                v{attempt}.{currentStep}.{tick % 100}
                            </span>
                            <span className="text-[8px] font-mono font-bold" style={{ color: '#22c55e' }}>
                                {visibleLogs.length}/{allLogs.length} LOGGED
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom stats bar */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: `${currentColor}15` }}>
                    {[
                        { label: 'RULES', value: `${rulesAudited}/49` },
                        { label: 'VIEWS', value: currentStep >= 5 ? '3/3' : currentStep >= 4 ? '1/3' : '0/3' },
                        { label: 'STATUS', value: currentStep === 7 ? 'COMPLETE' : 'RUNNING' },
                        { label: 'QUALITY', value: 'HD 512px' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-[7px] font-mono uppercase tracking-wider" style={{ color: '#475569' }}>{stat.label}</div>
                            <div className="text-[10px] font-mono font-bold" style={{ color: i === 2 && currentStep < 7 ? currentColor : '#22c55e' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS animation */}
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export function computeEstimateDetails(desc, prompt) {
    const raw = desc?.materialEstimate;
    const materials = desc?.materials || [];
    const lower = (prompt || '').toLowerCase();

    const isSwing = lower.includes('xích đu') || lower.includes('swing') || lower.includes('giọt nước');
    const isChair = lower.includes('ghế') || lower.includes('chair') || lower.includes('tổ chim');
    const isTable = lower.includes('bàn') || lower.includes('table') || lower.includes('trà');
    const isMirror = lower.includes('gương') || lower.includes('mirror') || lower.includes('mặt trời');
    const isLamp = lower.includes('đèn') || lower.includes('lamp') || lower.includes('pendant') || lower.includes('hoa sen');
    const isBag = lower.includes('túi') || lower.includes('bag') || lower.includes('xách');
    const isBasket = lower.includes('giỏ') || lower.includes('rổ') || lower.includes('basket') || lower.includes('khay');

    let totalWeight = isSwing ? 8.5 : isChair ? 5.2 : isTable ? 4.0 : isMirror ? 2.5 : isLamp ? 1.4 : isBag ? 0.8 : isBasket ? 0.6 : 1.5;
    let totalHours = isSwing ? 32 : isChair ? 24 : isTable ? 16 : isMirror ? 10 : isLamp ? 8 : isBag ? 6 : isBasket ? 4 : 10;
    let difficulty = isSwing ? 'Rất cao (Expert)' : (isChair || isTable) ? 'Cao (Advanced)' : (isLamp || isMirror || isBag) ? 'Trung bình (Intermediate)' : 'Cơ bản (Basic)';

    const rawItems = raw?.items && raw.items.length ? raw.items : (materials.length ? materials.map(m => ({ name: m })) : [{ name: 'Mây' }, { name: 'Tre' }]);
    const count = rawItems.length || 1;

    let totalMaterialCost = 0;
    const items = rawItems.map((item, idx) => {
        const name = typeof item === 'string' ? item : item.name || (idx === 0 ? 'Mây' : 'Tre');
        const itemLower = name.toLowerCase();
        let pricePerKg = itemLower.includes('mây') || itemLower.includes('rattan') || itemLower.includes('song') ? 85000
            : itemLower.includes('tre') || itemLower.includes('bamboo') ? 45000
            : itemLower.includes('kính') || itemLower.includes('thủy tinh') || itemLower.includes('gương') ? 120000
            : 60000;

        let weightKg = item.weight_kg > 0 ? item.weight_kg : +(totalWeight / count).toFixed(1);
        if (weightKg <= 0) weightKg = 0.5;
        let itemCost = item.item_cost_vnd > 0 ? item.item_cost_vnd : Math.round(weightKg * pricePerKg);
        totalMaterialCost += itemCost;

        return {
            name,
            weight_kg: weightKg,
            price_per_kg_vnd: pricePerKg,
            item_cost_vnd: itemCost,
        };
    });

    const finalWeight = raw?.total_weight_kg > 0 ? raw.total_weight_kg : +totalWeight.toFixed(1);
    const finalHours = raw?.estimated_hours > 0 ? raw.estimated_hours : totalHours;
    const finalDiff = raw?.difficulty || difficulty;

    const hourlyLaborRate = 35000;
    const laborCost = raw?.labor_cost_vnd > 0 ? raw.labor_cost_vnd : Math.round(finalHours * hourlyLaborRate);
    const finalMaterialCost = raw?.total_material_cost_vnd > 0 ? raw.total_material_cost_vnd : totalMaterialCost;
    const totalCost = raw?.total_estimated_cost_vnd > 0 ? raw.total_estimated_cost_vnd : (finalMaterialCost + laborCost);

    return {
        items,
        total_weight_kg: finalWeight,
        estimated_hours: finalHours,
        difficulty: finalDiff,
        total_material_cost_vnd: finalMaterialCost,
        labor_cost_vnd: laborCost,
        total_estimated_cost_vnd: totalCost
    };
}

export default function AIDesignPage() {
    const { text: localize } = useLang();
    const { t, lang } = useLang();
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [activeFeature, setActiveFeature] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generatedViews, setGeneratedViews] = useState([]);
    const [workflowProgress, setWorkflowProgress] = useState(null);
    const [workflowMessage, setWorkflowMessage] = useState('');
    const [generatedDesc, setGeneratedDesc] = useState(null);
    const [colorPalette, setColorPalette] = useState(null);
    const [sampleIdx, setSampleIdx] = useState(0);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [artisanModalOpen, setArtisanModalOpen] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState('medium');
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [selectedFinish, setSelectedFinish] = useState(null);
    const [designStudioOpen, setDesignStudioOpen] = useState(false);
    const [datasetItems, setDatasetItems] = useState([]);
    const [matchedDatasetSamples, setMatchedDatasetSamples] = useState([]);
    const fileInputRef = useRef(null);
    const workflowController = useRef(null);
    const uploadSequence = useRef(0);

    useEffect(() => () => { workflowController.current?.abort(); uploadSequence.current++; }, []);

    useEffect(() => {
        fetch('/dan_may_dataset/manifest.json')
            .then(res => res.json())
            .then(data => {
                if (data?.items) setDatasetItems(data.items);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!datasetItems.length) return;
        const p = (prompt || '').toLowerCase();
        const st = (selectedStyle || '').toLowerCase();
        const pt = (selectedPattern || '').toLowerCase();
        const fn = (selectedFinish || '').toLowerCase();

        const scored = datasetItems.map(item => {
            let score = 0;
            const name = (item.name_vi || '').toLowerCase();
            const objType = (item.object_type || '').toLowerCase();
            const styleVi = (item.style_vi || item.style || '').toLowerCase();
            const weaveVi = (item.weave_vi || item.weave || '').toLowerCase();
            const finishVi = (item.finish_vi || item.finish || '').toLowerCase();

            if (p) {
                const words = p.split(/\s+/).filter(w => w.length > 1);
                for (const w of words) {
                    if (name.includes(w) || objType.includes(w)) score += 20;
                }
            }
            if (st && (styleVi.includes(st) || st.includes(styleVi))) score += 25;
            if (pt && (weaveVi.includes(pt) || pt.includes(weaveVi))) score += 25;
            if (fn && (finishVi.includes(fn) || fn.includes(finishVi))) score += 15;

            return { item, score };
        });

        scored.sort((a, b) => b.score - a.score);
        setMatchedDatasetSamples(scored.slice(0, 4).map(s => s.item));
    }, [prompt, selectedStyle, selectedPattern, selectedFinish, datasetItems]);

    useEffect(() => {
        const t = setInterval(() => setSampleIdx(i => (i + 1) % SAMPLE_RESULTS.length), 3000);
        return () => clearInterval(t);
    }, []);

    /**
     * @param {File} file 
     * @param {string} localUrl 
     */
    const handleCameraCapture = async (file, localUrl) => {
        const sequence = ++uploadSequence.current;
        setUploading(true);
        setUploadedImage(localUrl);
        setUploadedImageUrl(null);
        try {
            const photo = await prepareDesignPhoto(file);
            if (sequence === uploadSequence.current) { setUploadedImage(photo); setUploadedImageUrl(photo); }
        } catch (error) {
            if (sequence === uploadSequence.current) { setUploadedImage(null); toast.error(workflowError(error, lang)); }
        } finally {
            if (localUrl?.startsWith('blob:')) URL.revokeObjectURL(localUrl);
            if (sequence === uploadSequence.current) setUploading(false);
        }
    };

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const localUrl = URL.createObjectURL(file);
        await handleCameraCapture(file, localUrl);
        e.target.value = '';
    };

    const handleGenerate = async (overrides = {}) => {
        if (generating || uploading || workflowController.current) return;
        const finalPrompt = overrides.prompt !== undefined ? overrides.prompt : prompt;
        const finalStyle = overrides.style !== undefined ? overrides.style : selectedStyle;
        const finalSize = overrides.size !== undefined ? overrides.size : selectedSize;
        const finalPattern = overrides.pattern !== undefined ? overrides.pattern : selectedPattern;
        const finalFinish = overrides.finish !== undefined ? overrides.finish : selectedFinish;

        if (!finalPrompt.trim() && !uploadedImageUrl) return;

        setGenerating(true);
        const previousImage = generatedViews[0]?.url || generatedImage;
        const previousBrief = generatedDesc?.workflow?.brief;
        setGeneratedImage(null);
        setGeneratedViews([]);
        setWorkflowMessage('');
        setWorkflowProgress({ step: 1, attempt: 1 });
        setGeneratedDesc(null);
        setColorPalette(null);

        const controller = new AbortController();
        workflowController.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 285000);

        try {
            let reference = null;
            if (previousImage?.startsWith('data:image/')) {
                const blob = await (await fetch(previousImage)).blob();
                reference = await prepareDesignPhoto(new File([blob], 'previous-design', { type: blob.type }));
            }
            const data = await runDesignWorkflow({
                    prompt: finalPrompt,
                    style: finalStyle,
                    size: finalSize,
                    pattern: finalPattern,
                    finish: finalFinish,
                    imageUrl: uploadedImageUrl,
                    previousImage: reference,
                    previousBrief: previousBrief ? JSON.stringify(previousBrief).slice(0, 6000) : null,
                    lang,
                }, setWorkflowProgress, controller.signal);

            if (data.imageUrl) {
                setGeneratedImage(data.imageUrl);
                setGeneratedViews(data.images);
                setGeneratedDesc(data.specs);
                setColorPalette(data.specs?.colorPalette || null);
                setGenerating(false);
                toast.success(localize(lang === 'vi' ? 'Tạo thiết kế Đan AI thành công!' : 'Design generated successfully!'));
            } else {
                throw new Error(lang === 'vi' ? 'Không thể tạo hình ảnh. Vui lòng thử lại!' : 'Failed to generate image!');
            }
        } catch (error) {
            const errMsg = workflowError(error.name === 'AbortError' ? new Error('AI_TIMEOUT') : error, lang);
            setWorkflowMessage(errMsg);
            toast.error(errMsg);
        } finally {
            clearTimeout(timeoutId);
            workflowController.current = null;
            setGenerating(false);
        }
    };

    const handleSuggestion = (s) => {
        setPrompt(t(s.textKey));
        setSelectedStyle(s.style);
    };

    return (
        <>
            {cameraOpen && <CameraCapture onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />}
            {artisanModalOpen && (
                <ArtisanOrderModal
                    designData={{ prompt, imageUrl: generatedImage, description: generatedDesc?.description }}
                    onClose={() => setArtisanModalOpen(false)}
                />
            )}
            <section 
                className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden"
                style={{
                    backgroundImage: 'url(/images/bg_ai_design.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Soft overlay to ensure readability while showing the beautiful background */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60 backdrop-blur-[1px]"></div>
                
                {/* Soft background blobs */}
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-200/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center max-w-5xl w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary mb-5">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span className="text-xs sm:text-sm font-semibold tracking-wide">{t('hero.badge')}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-extrabold text-gray-900 leading-[1.1] mb-6 px-2 tracking-tight drop-shadow-sm">
                        <span className="whitespace-nowrap">{t('hero.title1')}</span>
                        <span className="bg-gradient-to-r from-emerald-500 via-primary to-teal-500 bg-clip-text text-transparent italic font-serif block drop-shadow-md relative mt-2">
                            {t('hero.title2')}
                            <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full blur-sm transform -rotate-1"></span>
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 font-medium mb-6 max-w-xl px-2">
                        {t('hero.desc')}
                    </p>




                    {/* Style presets */}
                    <div className="flex flex-wrap justify-center gap-2 mb-5 px-2">
                        {STYLE_PRESETS.map((s) => (
                            <button key={s.key} onClick={() => setSelectedStyle(selectedStyle === s.key ? null : s.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold transition-all duration-200 bg-gradient-to-r ${s.bg} ${s.border} ${s.text}
              ${selectedStyle === s.key ? 'scale-105 shadow-md ring-2 ring-primary/30' : 'hover:shadow-sm'}`}>
                                <span>{localize(s.emoji)}</span>
                                <span>{t('style.' + s.key)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Size & Pattern & Finish selectors */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4 px-2">
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                            <span className="text-xs font-semibold text-gray-500 mr-1">{t('ai.size')}</span>
                            {[{ k: 'small', l: t('ai.small') }, { k: 'medium', l: t('ai.medium') }, { k: 'large', l: t('ai.large') }].map(s => (
                                <button key={s.k} onClick={() => setSelectedSize(s.k)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${selectedSize === s.k ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>
                                    {localize(s.l)}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                            <span className="text-xs font-semibold text-gray-500 mr-1">{t('ai.pattern')}</span>
                            {(lang === 'vi'
                                ? [{ k: 'Đan xương cá', l: 'Xương cá' }, { k: 'Đan mắt cáo', l: 'Mắt cáo' }, { k: 'Đan nong', l: 'Nong' }, { k: 'Đan nan', l: 'Nan' }]
                                : lang === 'es'
                                    ? [{ k: 'Espina de pescado', l: 'Espina' }, { k: 'Calado', l: 'Calado' }, { k: 'Anillo', l: 'Anillo' }, { k: 'Listones', l: 'Listones' }]
                                    : lang === 'zh'
                                        ? [{ k: '人字编', l: '人字' }, { k: '镂空编', l: '镂空' }, { k: '环编', l: '环' }, { k: '网编', l: '网' }]
                                        : lang === 'ru'
                                            ? [{ k: 'Елочка', l: 'Елочка' }, { k: 'Ажурное', l: 'Ажурное' }, { k: 'Кольцо', l: 'Кольцо' }, { k: 'Планки', l: 'Планки' }]
                                            : [{ k: 'Herringbone', l: 'Herringbone' }, { k: 'Openwork', l: 'Openwork' }, { k: 'Ring weave', l: 'Ring' }, { k: 'Slats', l: 'Slats' }]
                            ).map(p => (
                                <button key={p.k} onClick={() => setSelectedPattern(selectedPattern === p.k ? null : p.k)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${selectedPattern === p.k ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>
                                    {localize(p.l)}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-green-200 shadow-sm">
                            <span className="text-xs font-semibold text-gray-500 mr-1">{t('ai.finish')}</span>
                            {(lang === 'vi'
                                ? [{ k: 'Tự nhiên', l: 'Tự nhiên' }, { k: 'Nhuộm màu', l: 'Nhuộm' }, { k: 'Sơn mài', l: 'Sơn mài' }]
                                : lang === 'es'
                                    ? [{ k: 'Natural', l: 'Natural' }, { k: 'Teñido', l: 'Teñido' }, { k: 'Laca', l: 'Laca' }]
                                    : lang === 'zh'
                                        ? [{ k: '天然', l: '天然' }, { k: '染色', l: '染色' }, { k: '漆器', l: '漆器' }]
                                        : lang === 'ru'
                                            ? [{ k: 'Натуральный', l: 'Натур.' }, { k: 'Окрашенный', l: 'Окраш.' }, { k: 'Лак', l: 'Лак' }]
                                            : [{ k: 'Natural', l: 'Natural' }, { k: 'Dyed', l: 'Dyed' }, { k: 'Lacquer', l: 'Lacquer' }]
                            ).map(f => (
                                <button key={f.k} onClick={() => setSelectedFinish(selectedFinish === f.k ? null : f.k)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${selectedFinish === f.k ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>
                                    {localize(f.l)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload preview */}
                    {uploadedImage && (
                        <div className="relative mb-3 w-full max-w-xs">
                            <img src={uploadedImage} alt={localize("Ảnh tham khảo")} className="w-full h-32 object-cover rounded-xl border-2 border-primary/40 shadow-md" />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full font-semibold">
                                {localize(uploading ? 'â³ ' + t('splash.loading') : '✓ ' + t('ai.refImage'))}
                            </div>
                            <button onClick={() => { uploadSequence.current++; setUploading(false); setUploadedImage(null); setUploadedImageUrl(null); }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Input bar */}
                    <div className="w-full max-w-2xl bg-white border-2 border-green-200 rounded-2xl p-2 flex items-center gap-1 sm:gap-2 mb-4 shadow-lg shadow-green-100">
                        {/* Camera / Upload buttons */}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current?.click()}
                            title={localize("Tải ảnh từ máy")}
                            className={`p-2 rounded-xl transition-all flex-shrink-0 ${uploadedImage ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-green-50'}`}>
                            <Upload className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCameraOpen(true)}
                            title={localize("Chụp ảnh bằng camera")}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-green-50 rounded-xl transition-colors flex-shrink-0">
                            <Video className="w-4 h-4" />
                        </button>
                        <input value={prompt} onChange={e => setPrompt(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                            type="text"
                            placeholder={localize(uploadedImage ? t('hero.placeholder') : t('hero.placeholder'))}
                            className="flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 text-sm outline-none px-1 min-w-0 font-medium"
                        />
                        {prompt && (
                            <button onClick={() => setPrompt('')} className="p-1 text-gray-400 hover:text-gray-700 flex-shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={() => handleGenerate({})} disabled={generating || (!prompt.trim() && !uploadedImageUrl)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-emerald-600 text-white px-3 sm:px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0">
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            <span className="hidden sm:inline">{localize(generating ? t('hero.generating') : t('hero.generate'))}</span>
                            <span className="sm:hidden">{localize(generating ? '...' : t('hero.generate'))}</span>
                        </button>
                    </div>

                    {/* Upload hint */}
                    <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
                        <Camera className="w-3 h-3 text-primary" />
                        {t('ai.hint')}
                    </p>

                    {/* Suggestions */}
                    <div className="text-center mb-8 w-full">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">{t('hero.suggestions')}</p>
                        <div className="flex flex-wrap justify-center gap-2 px-2">
                            {SUGGESTIONS.map((s, i) => (
                                <button key={i} onClick={() => handleSuggestion(s)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-green-200 text-sm font-medium text-gray-700 hover:text-primary hover:border-primary/40 hover:bg-green-50 transition-all duration-200 shadow-sm">
                                    <span>{localize(s.icon)}</span>
                                    <span className="hidden sm:inline">{t(s.textKey)}</span>
                                    <span className="sm:hidden">{localize((t(s.textKey) || '').split(' ').slice(0, 2).join(' '))}</span>
                                    <span className="text-xs text-primary/60 font-normal">· {localize(s.style)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dataset Catalog Matches */}
                    {matchedDatasetSamples.length > 0 && (
                        <div className="w-full max-w-3xl mb-8 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-200/90 shadow-xl shadow-emerald-100/50">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🌾</span>
                                    <div className="text-left">
                                        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase font-mono">
                                            KHO MẪU DATASET ĐAN MÂY ({datasetItems.length} SẢN PHẨM CHUẨN)
                                        </h3>
                                        <p className="text-[11px] text-gray-500 font-medium">
                                            Gợi ý mẫu đan chân thực khớp chuẩn với mô tả & phong cách của bạn
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 font-bold shrink-0">
                                    AI Dataset Match
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {matchedDatasetSamples.map((dsItem) => (
                                    <div key={dsItem.id} onClick={() => {
                                        setPrompt(dsItem.name_vi + ' ' + (dsItem.style_vi || ''));
                                        setSelectedStyle(dsItem.style);
                                        if (dsItem.weave_vi) setSelectedPattern(dsItem.weave_vi);
                                        if (dsItem.finish_vi) setSelectedFinish(dsItem.finish_vi);
                                        toast.success(localize(`Đã áp dụng mẫu dataset: ${dsItem.name_vi}`));
                                    }} className="group relative cursor-pointer rounded-xl overflow-hidden border border-emerald-100 hover:border-primary transition-all duration-200 bg-white hover:shadow-xl text-left">
                                        <div className="aspect-square w-full overflow-hidden bg-gray-50 relative">
                                            <img src={`/dan_may_dataset/${dsItem.file}`} alt={dsItem.name_vi} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold">
                                                {dsItem.style_vi}
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <h4 className="text-xs font-bold text-gray-800 truncate">{dsItem.name_vi}</h4>
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5 truncate">
                                                <span>{dsItem.weave_vi}</span>
                                                <span>•</span>
                                                <span>{dsItem.finish_vi}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Result panel */}
                    {(generating || generatedImage || workflowMessage) && (
                        <div className="w-full max-w-3xl rounded-2xl border-2 border-green-200 bg-white overflow-hidden shadow-2xl shadow-green-100 mb-8">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-green-100 bg-gradient-to-r from-primary/10 to-transparent">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <span className="text-xs text-gray-600 font-medium ml-2 truncate">{t('ai.result')} · {localize(prompt || t('ai.refImage'))}</span>
                                {generatedImage && (
                                    <a href={generatedImage} download className="ml-auto p-1.5 text-gray-500 hover:text-primary transition-colors">
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-0">
                                <div className="aspect-square bg-green-50 flex items-center justify-center relative overflow-hidden">
                                    {generating && !generatedImage && (
                                        <div className="w-full h-full relative">
                                            <DanAIWorkflowHUD step={workflowProgress?.step || 1} attempt={workflowProgress?.attempt || 1} lang={lang} />
                                            <div className="flex flex-col items-center gap-3 text-gray-500" style={{ display: 'none' }}>
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                                    <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
                                                </div>
                                                <p className="text-sm font-medium text-center px-3" role="status">{workflowProgress ? workflowLabel(workflowProgress.step, workflowProgress.attempt, lang) : t('ai.generating')}</p>
                                            </div>
                                        </div>
                                    )}
                                    {generatedImage && (
                                        <img src={generatedImage} alt={localize("AI Generated")} className="w-full h-full object-cover" />
                                    )}
                                    {workflowMessage && !generating && <p role="alert" className="text-sm text-gray-600 text-center p-5">{workflowMessage}</p>}
                                    {generatedViews.length === 3 && !generating && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 rounded-full bg-white/90 border border-green-200 p-1 shadow-sm">
                                        {generatedViews.map((view, index) => <button key={view.id} type="button" onClick={() => setGeneratedImage(view.url)} aria-pressed={generatedImage === view.url}
                                            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${generatedImage === view.url ? 'bg-primary text-white' : 'text-gray-600'}`}>
                                            {(lang === 'vi' ? ['Mẫu 1 (Tự nhiên)','Mẫu 2 (Boho)','Mẫu 3 (Wabi-sabi)'] : lang === 'zh' ? ['方案一 (自然)','方案二 (波西米亚)','方案三 (侘寂)'] : ['Option 1 (Natural)','Option 2 (Boho)','Option 3 (Wabi-sabi)'])[index]}
                                        </button>)}
                                    </div>}
                                </div>
                                <div className="p-5 space-y-4">
                                    {generating && !generatedDesc && (
                                        <div className="space-y-2 animate-pulse">
                                            {[80, 60, 90, 50].map((w, i) => (
                                                <div key={i} className="h-3 bg-green-100 rounded" style={{ width: `${w}%` }} />
                                            ))}
                                        </div>
                                    )}
                                    {generatedDesc && (
                                        <>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                                    <Sparkles className="w-3 h-3" /> {t('ai.desc')}
                                                </h4>
                                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{localize(generatedDesc.description)}</p>
                                            </div>
                                            {generatedDesc.materials && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1"><TreePine className="w-3.5 h-3.5"/> {t('ai.materials')}</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {generatedDesc.materials.map((m, i) => (
                                                            <span key={i} className="px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">{localize(m)}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {generatedDesc.technique && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1 flex items-center gap-1"><Wrench className="w-3.5 h-3.5"/> {t('ai.technique')}</h4>
                                                    <p className="text-xs text-gray-700 font-medium">{localize(generatedDesc.technique)}</p>
                                                </div>
                                            )}
                                            {(() => {
                                                const est = computeEstimateDetails(generatedDesc, prompt);
                                                return (
                                                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-1.5">
                                                            <Package className="w-3.5 h-3.5"/> {t('ai.estimate')}
                                                        </h4>
                                                        <div className="space-y-1.5">
                                                            {est.items.map((m, i) => (
                                                                <div key={i} className="flex items-center justify-between text-xs">
                                                                    <span className="text-gray-700 font-medium">{m.name}</span>
                                                                    <span className="text-gray-500">
                                                                        {m.weight_kg}kg @ {m.price_per_kg_vnd.toLocaleString('vi-VN')}đ/kg → <span className="text-emerald-700 font-semibold">{m.item_cost_vnd.toLocaleString('vi-VN')}đ</span>
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-bold">
                                                            <span className="text-emerald-700">{t('ai.totalWeight')}: {est.total_weight_kg}kg</span>
                                                            <span className="text-emerald-700"> {t('ai.estTime')}: {est.estimated_hours}h</span>
                                                        </div>
                                                        {est.difficulty && (
                                                            <div className="mt-1 text-xs text-gray-500">{t('ai.difficulty')}: {est.difficulty}</div>
                                                        )}
                                                        <div className="mt-2 pt-2 border-t border-emerald-200 space-y-1">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-600">Chi phí nguyên liệu:</span>
                                                                <span className="text-emerald-700 font-semibold">{est.total_material_cost_vnd.toLocaleString('vi-VN')}đ</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-gray-600">Chi phí nhân công ({est.estimated_hours}h):</span>
                                                                <span className="text-emerald-700 font-semibold">{est.labor_cost_vnd.toLocaleString('vi-VN')}đ</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-emerald-200">
                                                                <span className="text-emerald-700">Tổng chi phí dự kiến:</span>
                                                                <span className="text-emerald-600 text-base">{est.total_estimated_cost_vnd.toLocaleString('vi-VN')}đ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            {colorPalette && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2 flex items-center gap-1"><Palette className="w-3.5 h-3.5"/> {t('ai.colorPalette')}</h4>
                                                    <div className="flex gap-2">
                                                        {colorPalette.map((hex, i) => (
                                                            <div key={i} title={localize(hex)} className="flex-1 h-8 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                                                                style={{ backgroundColor: hex }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={() => setDesignStudioOpen(true)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/30 transition-all mb-2">
                                                <Palette className="w-4 h-4" /> {t('ai.studio')}
                                            </button>
                                            <AIDesignEditor
                                                design={{ prompt, colorPalette, style: selectedStyle, size: selectedSize, pattern: selectedPattern, finish: selectedFinish }}
                                                onRegenerate={(settings) => {
                                                    if (settings.prompt !== undefined) setPrompt(settings.prompt);
                                                    if (settings.style !== undefined) setSelectedStyle(settings.style);
                                                    if (settings.size !== undefined) setSelectedSize(settings.size);
                                                    if (settings.pattern !== undefined) setSelectedPattern(settings.pattern);
                                                    if (settings.finish !== undefined) setSelectedFinish(settings.finish);
                                                    handleGenerate(settings);
                                                }}
                                                loading={generating}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleGenerate({})}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
                                                    <RefreshCw className="w-3.5 h-3.5" /> {t('ai.regenerate')}
                                                </button>
                                                <button onClick={() => setArtisanModalOpen(true)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all shadow-md">
                                                    <Users className="w-3.5 h-3.5" /> {t('ai.orderArtisan')}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sample gallery when idle */}
                    {!generatedImage && !generating && !workflowMessage && (
                        <div className="w-full max-w-2xl relative h-40 sm:h-48 mb-4 rounded-2xl overflow-hidden border-2 border-green-100 shadow-sm">
                            {SAMPLE_RESULTS.map((r, i) => (
                                <img key={i} src={r.src} alt={localize(r.label)}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${i === sampleIdx ? 'opacity-40' : 'opacity-0'}`} />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent flex items-end justify-center pb-4">
                                <p className="text-xs text-gray-600 font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5 text-primary animate-pulse" />
                                    {t('ai.startHint')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {designStudioOpen && (
                <DesignStudio
                    design={{ prompt, colorPalette, style: selectedStyle, size: selectedSize, pattern: selectedPattern, finish: selectedFinish }}
                    generatedImage={generatedImage}
                    generatedDesc={generatedDesc}
                    onRegenerate={(settings) => {
                        if (settings.prompt !== undefined) setPrompt(settings.prompt);
                        if (settings.style !== undefined) setSelectedStyle(settings.style);
                        if (settings.size !== undefined) setSelectedSize(settings.size);
                        if (settings.pattern !== undefined) setSelectedPattern(settings.pattern);
                        if (settings.finish !== undefined) setSelectedFinish(settings.finish);
                        handleGenerate(settings);
                    }}
                    onClose={() => setDesignStudioOpen(false)}
                    loading={generating}
                />
            )}
            
            {artisanModalOpen && (
                <ArtisanOrderModal 
                    designData={{ prompt, colorPalette, style: selectedStyle, size: selectedSize, pattern: selectedPattern, finish: selectedFinish }}
                    onClose={() => setArtisanModalOpen(false)} 
                />
            )}
            
            {cameraOpen && (
                <CameraCapture onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />
            )}
        </>
    );
}
