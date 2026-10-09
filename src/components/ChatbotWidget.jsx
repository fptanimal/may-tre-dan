import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Send, Loader2, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import MayAvatar from './MayAvatar';
import { useLang } from '../context/LanguageContext';
import { PRODUCTS as SHOP_PRODUCTS } from '../lib/shopProducts';

// Tạo danh sách sản phẩm đầy đủ từ shopProducts.js (40+ sản phẩm thay vì 6 cái cũ)
const CATEGORY_MAP = { toys: { vi: 'Đồ chơi', en: 'Toys' }, decor: { vi: 'Trang trí', en: 'Decor' }, office: { vi: 'Văn phòng', en: 'Office' }, home: { vi: 'Gia dụng', en: 'Home' } };
const PRODUCTS = SHOP_PRODUCTS.map(p => ({
    id: p.id,
    name_vi: p.name_vi,
    name_en: p.name_en,
    name_zh: p.name_zh,
    price: `${p.price.toLocaleString('vi-VN')}đ`,
    priceNum: p.price,
    image: p.image,
    category_vi: CATEGORY_MAP[p.category]?.vi || p.category,
    category_en: CATEGORY_MAP[p.category]?.en || p.category,
    materials: p.materials || [],
    care_vi: p.guide?.care?.vi || ''
}));

const SYSTEM_PROMPT = `You are the AI Sales Consultant for Phú Vinh Shop — a 400-year-old bamboo & rattan weaving village in Phú Vinh, Chương Mỹ, Hanoi, Vietnam. You are an experienced, knowledgeable sales expert who helps customers find the PERFECT product.

PRODUCTS: The full product catalog (40+ items, prices from 17,000đ to 96,000đ) is provided dynamically in each request. ONLY use the product list attached to each message — NEVER invent products or prices that are not in the list.

BUSINESS & POLICIES:
- Free shipping: Gold+ members (8+ orders)
- Vouchers: SILVER5 (5% off), GOLD10 (10%), DIAMOND15 (15%), VIP20 (20%), FREESHIP
- Membership tiers: Bronze → Silver (3 orders) → Gold (8 orders) → Diamond (20 orders)
- Custom design: use the AI Design tool to create custom patterns, then order with an artisan
- Shipping: nationwide, Hanoi 1-2 days, provinces 3-5 days
- Returns: 7 days for manufacturer defects
- Bulk orders: 10+ items get 10% discount, 50+ items get 15% discount

CULTURE:
- 400+ year old village, ~80% of households in the craft
- Recognized as national intangible heritage
- UNESCO recognized traditional craft village of Southeast Asia (2019)

CARE & MATERIALS:
- Rattan (Mây): most flexible, best for fine weaving
- Bamboo (Tre): sturdier, best for frames
- Reed (Giang): softest, best for base weaving
- Keep dry, dust regularly, avoid direct sunlight

=== YOUR ROLE AS SMART SALES CONSULTANT ===

You are NOT just answering questions. You are a PROACTIVE sales expert who:

1. REMEMBERS CONTEXT: Throughout the conversation, remember the customer's budget, preferences, purchase purpose (gift, decor, personal use), and products they've shown interest in. NEVER ask for information they already provided.

2. PROACTIVELY DISCOVERS NEEDS: Ask targeted questions to understand what they need:
   - Is it a gift? For whom? (child, adult, elder, corporate)
   - What occasion? (birthday, housewarming, wedding, Tet)
   - Budget range?
   - Style preference? (rustic, modern, traditional, cute)
   - Where will it be used? (living room, office, bedroom, kids room)

3. RECOMMENDS WITH REASONING: When suggesting a product, explain WHY:
   - Why this product fits their specific need
   - What makes it special (weave technique, material, cultural meaning)
   - How it solves their problem or matches their taste

4. CROSS-SELLS & UPSELLS naturally:
   - If they like a toy, suggest a matching basket for storage.
   - If they want decor, suggest a complementary piece.
   - If they're gifting, suggest wrapping or a set.
   - ONLY suggest when genuinely helpful, never pushy.

5. ACTS LIKE A HIGH-END, EMPATHETIC CONSULTANT:
   - Be extremely warm, personal, and conversational. Speak like a friendly human expert.
   - Show genuine interest in the customer's story (e.g. "That sounds like a lovely gift for your mother!").
   - Concise but rich in value (2-4 sentences typically). Do not write long essays.
   - Share cultural stories or craftsmanship details only when it adds emotional value.
   - Build trust through empathy and expertise, NEVER through sales pressure.

6. HANDLES OBJECTIONS gracefully:
   - Price concerns: highlight value, durability, cultural significance
   - Quality doubts: explain craftsmanship, warranty, certification
   - Uncertainty: ask clarifying questions to narrow down

Respond in the selected website language specified below, unless the user explicitly asks you to use another language.
If you recommend any products, you MUST append their IDs at the VERY END of your response in this exact format: [PRODUCTS: id1, id2]. 
Example: "This basket is great for you! [PRODUCTS: 2, 5]"
Do NOT use markdown JSON blocks. Respond naturally and empathetically as a human expert.`;

export default function ChatbotWidget() {
    const { text: localize } = useLang();
    const { t, lang } = useLang();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'assistant', content: t('chat.greeting'), greeting: true }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    // Session memory — tracks customer context
    const [userContext, setUserContext] = useState({ budget: null, preferences: [], intent: null, viewedProducts: [] });
    const bottomRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
    useEffect(() => {
        const previous = requestRef.current;
        requestRef.current = null;
        previous?.abort();
        setLoading(false);
        setMessages(previous => previous.map(message => message.greeting ? { ...message, content: t('chat.greeting') } : message));
        return () => { const request = requestRef.current; requestRef.current = null; request?.abort(); };
    }, [lang, t]);

    const QUICK_REPLIES = lang === 'vi' ? [
        '🎁 Tìm quà tặng', '🏠 Decor phòng khách', '🧸 Đồ chơi cho bé', '💼 Quà công sở', '💰 Dưới 50K', '🌿 Cao cấp',
    ] : lang === 'en' ? [
        '🎁 Find a gift', '🏠 Living room decor', '🧸 Kids toys', '💼 Office gifts', '💰 Under 50K', '🌿 Premium',
    ] : lang === 'es' ? [
        '🎁 Buscar regalo', '🏠 Decoración', '🧸 Juguetes', '💼 Regalos oficina', '💰 Menos 50K', '🌿 Premium',
    ] : lang === 'zh' ? [
        '🎁 找礼物', '🏠 客厅装饰', '🧸 儿童玩具', '💼 办公礼品', '💰 50K以下', '🌿 高级',
    ] : lang === 'ru' ? [
        '🎁 Найти подарок', '🏠 Декор', '🧸 Игрушки', '💼 Офис', '💰 До 50K', '🌿 Премиум',
    ] : lang === 'ja' ? [
        '🎁 ギフト探し', '🏠 リビング装饰', '🧸 おもちゃ', '💼 オフィスギフト', '💰 50K以下', '🌿 高級',
    ] : lang === 'ko' ? [
        '🎁 선물 찾기', '🏠 거실 장식', '🧸 장난감', '💼 오피스 선물', '💰 50K 이하', '🌿 프리미엄',
    ] : [
        '🎁 Find a gift', '🏠 Living room decor', '🧸 Kids toys', '💼 Office gifts', '💰 Under 50K', '🌿 Premium',
    ];

    const PRICE_RANGES = lang === 'vi' ? [
        { label: 'Dưới 30K', value: '0-30000' }, { label: '30K – 50K', value: '30000-50000' },
        { label: '50K – 80K', value: '50000-80000' }, { label: '80K – 100K', value: '80000-100000' },
    ] : [
        { label: t('chat.under30'), value: '0-30000' },
        { label: lang === 'ja' ? '30K–50K' : lang === 'ko' ? '30K–50K' : '30K – 50K', value: '30000-50000' },
        { label: lang === 'ja' ? '50K–80K' : lang === 'ko' ? '50K–80K' : '50K – 80K', value: '50000-80000' },
        { label: lang === 'ja' ? '80K–100K' : lang === 'ko' ? '80K–100K' : '80K – 100K', value: '80000-100000' },
    ];

    const send = async (text, budgetOverride = null) => {
        const userText = text || input.trim();
        if (!userText || loading) return;
        setInput('');
        const history = [...messages, { role: 'user', content: userText }];
        setMessages(history);
        setLoading(true);
        setSuggestedProducts([]);
        const controller = new AbortController();
        requestRef.current = controller;
        let timeoutId;

        // 1. Check greeting cứng
        const textLower = userText.toLowerCase().trim();
        const greetings = ["hello", "hi", "chào", "chào bạn", "xin chào", "你好", "您好"];
        if (greetings.includes(textLower)) {
            const reply = t('chat.hello');
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setLoading(false);
            return;
        }

        // 2. Query Database TRƯỚC (Không dùng AI để query)
        let availableProducts = PRODUCTS;
        const currentBudget = budgetOverride || userContext.budget;
        if (currentBudget) {
            const [min, max] = currentBudget.split('-').map(Number);
            availableProducts = PRODUCTS.filter(p => p.priceNum >= min && p.priceNum <= max);
        }

        // Rút gọn danh sách để gửi cho AI
        const productsJson = availableProducts.map(p => ({ id: p.id, name: p[`name_${lang}`] || p.name_en, price: p.price, priceNum: p.priceNum }));

        // Build context summary for the AI
        const contextSummary = `Customer context so far: Budget=${currentBudget || 'unknown'}, Preferences=${userContext.preferences.join(', ') || 'unknown'}.

[DANH SÁCH SẢN PHẨM KHỚP VỚI BỘ LỌC CỦA NGƯỜI DÙNG]:
${JSON.stringify(productsJson)}

RÀNG BUỘC BẮT BUỘC:
- TUYỆT ĐỐI KHÔNG tự bịa ra sản phẩm hoặc mức giá không có trong danh sách trên.
- Nếu danh sách trống, hãy nói: "Hiện tại hệ thống chưa có sản phẩm nào trong tầm giá này, bạn tham khảo loại khác nhé".
- Trả lời ngắn gọn, thân thiện.`;

        const langMap = { vi: 'Trả lời bằng tiếng Việt.', en: 'Respond in English.', es: 'Responde en español.', zh: '请用中文回答。', ru: 'Отвечайте на русском.', th: 'ตอบเป็นภาษาไทย', hi: 'हिंदी में उत्तर दें', ja: '日本語で答えてください。', ko: '한국어로 답변해 주세요.' };
        const langInstruction = langMap[lang] || langMap.vi;

        try {
            const systemPrompt = `${SYSTEM_PROMPT}\n\n${contextSummary}\n\n${langInstruction}`;
            timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
            
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history, lang, systemPrompt }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (controller.signal.aborted) return;

            if (!res.ok) throw new Error("API Error");
            
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullReply = '';
            let buffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (controller.signal.aborted) return;
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                let newlineIdx;
                while ((newlineIdx = buffer.indexOf('\n')) >= 0) {
                    const line = buffer.slice(0, newlineIdx).trim();
                    buffer = buffer.slice(newlineIdx + 1);
                    
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices?.[0]?.delta?.content) {
                                fullReply += data.choices[0].delta.content;
                            } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                fullReply += data.candidates[0].content.parts[0].text;
                            }
                        } catch (e) {
                            // ignore partials
                        }
                    }
                }

                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    lastMsg.content = fullReply;
                    return newMessages;
                });
            }
            
            let finalReply = fullReply;
            let matchedIds = [];
            
            const productMatch = finalReply.match(/\[PRODUCTS:\s*([\d,\s]+)\]/);
            if (productMatch) {
                const idString = productMatch[1];
                matchedIds = idString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                finalReply = finalReply.replace(productMatch[0], '').trim();
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = finalReply;
                    return newMessages;
                });
            }
            
            // Basic local product recommendation based on keywords (fallback)
            if (matchedIds.length === 0) {
                const textLower = userText.toLowerCase();
                if (textLower.includes('voi') || textLower.includes('chơi')) matchedIds.push(1);
                if (textLower.includes('hoa') || textLower.includes('trang trí')) matchedIds.push(2);
                if (textLower.includes('bút') || textLower.includes('văn phòng')) matchedIds.push(3);
                if (textLower.includes('tường') || textLower.includes('phượng')) matchedIds.push(4);
                if (textLower.includes('ảnh') || textLower.includes('khung')) matchedIds.push(5);
                if (textLower.includes('rổ') || textLower.includes('đựng')) matchedIds.push(6);
                
                // Randomly suggest if asking for price/gift and no match
                if (matchedIds.length === 0 && (textLower.includes('quà') || textLower.includes('giá') || textLower.includes('rẻ'))) {
                    matchedIds.push(1, 2);
                }
            }
            
            if (matchedIds.length > 0) {
                setSuggestedProducts(PRODUCTS.filter(p => matchedIds.includes(p.id)));
            }
        } catch (error) {
            if (controller.signal.aborted && requestRef.current !== controller) return;
            // Fallback response if API fails
            const fallbackMsg = t('chat.fallback');
            setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
            
            // Still run local product recommendation even if API fails
            const textLower = userText.toLowerCase();
            const matchedIds = [];
            if (textLower.includes('voi') || textLower.includes('chơi')) matchedIds.push(1);
            if (textLower.includes('hoa') || textLower.includes('trang trí')) matchedIds.push(2);
            if (textLower.includes('bút') || textLower.includes('văn phòng')) matchedIds.push(3);
            if (textLower.includes('tường') || textLower.includes('phượng')) matchedIds.push(4);
            if (textLower.includes('ảnh') || textLower.includes('khung')) matchedIds.push(5);
            if (textLower.includes('rổ') || textLower.includes('đựng')) matchedIds.push(6);
            if (matchedIds.length === 0) matchedIds.push(1, 2);
            setSuggestedProducts(PRODUCTS.filter(p => matchedIds.includes(p.id)));
        } finally { clearTimeout(timeoutId); }
        
        setLoading(false);
    };

    const pName = (p) => p[`name_${lang}`] || p.name_en;
    const pCat = (p) => p[`category_${lang}`] || p.category_en;

    return (
        <>
            {open && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="fixed bottom-24 left-3 sm:left-6 z-50 w-[min(380px,calc(100vw-1.5rem))] h-[550px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-purple-500/10 bg-card">
                    <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 border border-white/30 flex items-center justify-center">
                                <MayAvatar className="w-full h-full rounded-full" label={t('chat.name')} />
                            </div>
                            <div>
                                <span className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
                                    {t('chat.name')}
                                </span>
                                <p className="text-white/80 text-xs flex items-center gap-1.5 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                    {localize(t('chat.online') || 'Always Active')}
                                </p>
                            </div>
                        </div>
                        <button aria-label={localize(t('chat.close'))} onClick={() => setOpen(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/60">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MayAvatar className="w-full h-full rounded-lg" label={t('chat.name')} />
                                    </div>
                                )}
                                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user' ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-br-sm' : 'bg-secondary/60 border border-border/30 text-foreground rounded-bl-sm'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                                    <MayAvatar className="w-full h-full rounded-lg" label={t('chat.name')} />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-secondary/60 border border-border/30">
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                </div>
                            </div>
                        )}

                        {suggestedProducts.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <p className="text-xs text-muted-foreground px-1 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-violet-400" /> {t('chat.suggested')}
                                </p>
                                {suggestedProducts.map(p => (
                                    <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/40 border border-border/20 hover:border-primary/30 transition-all group">
                                        <img src={p.image} alt={localize(pName(p))} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate">{localize(pName(p))}</p>
                                            <p className="text-[10px] text-muted-foreground">{localize(pCat(p))} · {p.materials.map(material => t(`shop.mat.${material}`)).join(', ')}</p>
                                            <p className="text-xs text-primary font-bold">{localize(p.price)}</p>
                                        </div>
                                        <button onClick={() => navigate('/products')}
                                            className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all opacity-0 group-hover:opacity-100">
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Context indicator */}
                    {(userContext.budget || userContext.intent) && (
                        <div className="px-3 py-1.5 bg-violet-500/5 border-t border-violet-500/10 flex items-center gap-2 flex-wrap">
                            <TrendingUp className="w-3 h-3 text-violet-400 flex-shrink-0" />
                            {userContext.budget && <span className="text-[10px] text-violet-400 font-medium">💰 {localize(userContext.budget)}</span>}
                            {userContext.intent && <span className="text-[10px] text-violet-400 font-medium">🎯 {localize(userContext.intent)}</span>}
                            {userContext.preferences?.length > 0 && <span className="text-[10px] text-violet-400 font-medium">✨ {localize(userContext.preferences.join(', '))}</span>}
                        </div>
                    )}

                    <div className="px-3 py-2 border-t border-border/20 bg-background/40 space-y-1.5">
                        <p className="text-xs text-muted-foreground px-1">{t('chat.priceFilter')}</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {PRICE_RANGES.map((pr) => (
                                <button key={pr.value} onClick={() => {
                                    setSelectedPrice(selectedPrice === pr.value ? null : pr.value);
                                    setUserContext(prev => ({ ...prev, budget: pr.value }));
                                    send(t('chat.findPrice', { price: pr.label }), pr.value);
                                }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${selectedPrice === pr.value ? 'bg-primary text-white border-primary' : 'border-green-200 text-green-700 bg-green-50 hover:bg-primary/10 hover:border-primary/40'}`}>
                                    {localize(pr.label)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {messages.length <= 2 && (
                        <div className="px-3 py-2 border-t border-border/20 bg-background/40 flex gap-2 overflow-x-auto scrollbar-hide">
                            {QUICK_REPLIES.map((q, i) => (
                                <button key={i} onClick={() => send(q)}
                                    className="flex-shrink-0 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs hover:bg-violet-500/20 transition-all whitespace-nowrap">
                                    {localize(q)}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="px-3 py-3 border-t border-border/20 bg-background/60 flex gap-2">
                        <input value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && send()}
                            placeholder={localize(t('chat.placeholder'))}
                            className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/40 transition-colors" />
                        <button aria-label={localize(t('chat.send'))} onClick={() => send()} disabled={!input.trim() || loading}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-40 transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}

            {!open && (
                <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-6 z-40 flex items-center mb-16 md:mb-0">
                    <button
                        onClick={() => setOpen(true)}
                        className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-[1.5rem] bg-[#8B3DFF] text-white shadow-xl hover:scale-105 hover:bg-[#7e34ef] transition-all shadow-purple-500/30 font-bold"
                    >
                        <MayAvatar className="w-9 h-9 rounded-xl shrink-0" label={t('chat.name')} />
                        <span className="text-base whitespace-nowrap tracking-wide">{t('chat.name')}</span>
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#4ADE80] border-2 border-white rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    </button>
                </div>
            )}
        </>
    );
}
