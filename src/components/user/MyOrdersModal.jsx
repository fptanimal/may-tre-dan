import { useLang } from '../../context/LanguageContext';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, Loader2, Package, Clock, CheckCircle2, Truck, XCircle, FileText } from 'lucide-react';
import { db } from '@/api/firebaseClient';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { useAuthUser } from '../../context/AuthUserContext';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceModal from './InvoiceModal';

const fmt = (n) => (typeof n === 'number' && !isNaN(n) ? n : 0).toLocaleString('vi-VN') + 'đ';

const STATUS = {
    pending: { label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', step: 1 },
    confirmed: { label: 'Đã xác nhận', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200', step: 2 },
    shipping: { label: 'Đang giao', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200', step: 3 },
    delivered: { label: 'Đã giao', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', step: 4 },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', step: 0 },
};

export default function MyOrdersModal({ onClose }) {
    const { text: localize, locale } = useLang();
    const { user } = useAuthUser() || {};
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        const email = user?.email;
        if (!email) { 
            setLoading(false); 
            return; 
        }
        
        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("customer_email", "==", email),
                    limit(50)
                );
                const snap = await getDocs(q);
                let data = [];
                snap.forEach(d => data.push({ id: d.id, ...d.data() }));
                
                // Sort locally by created_at desc
                data.sort((a, b) => {
                    const t1 = a.created_at?.toMillis ? a.created_at.toMillis() : (new Date(a.created_date || 0)).getTime();
                    const t2 = b.created_at?.toMillis ? b.created_at.toMillis() : (new Date(b.created_date || 0)).getTime();
                    return (t2 || 0) - (t1 || 0);
                });
                
                setOrders(data);
            } catch (err) {
                console.error("Failed to load orders", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0 text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold leading-tight">{localize("Đơn Hàng Của Tôi")}</h2>
                            <p className="text-white/80 text-xs">{orders.length} {localize("đơn hàng")}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/15 hover:bg-white/30 transition-colors">
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Content area */}
                <div className="overflow-y-auto flex-1 p-5 space-y-4 bg-gray-50/60">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-xs text-gray-500 font-medium">{localize("Đang tải danh sách đơn hàng...")}</span>
                        </div>
                    )}
                    
                    {!loading && orders.length === 0 && (
                        <div className="text-center py-12 px-6 space-y-3 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-primary mb-1">
                                <Package className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-gray-800 font-bold text-base">{localize("Chưa có đơn hàng nào")}</p>
                            <p className="text-gray-500 text-xs max-w-xs">{localize("Các đơn hàng mây tre đan bạn đã đặt sẽ hiển thị đầy đủ tại đây.")}</p>
                        </div>
                    )}

                    {orders.map((order, i) => {
                        const st = STATUS[order.status] || STATUS.pending;
                        const Icon = st.icon;
                        const dateStr = order.created_at?.toDate 
                            ? order.created_at.toDate().toLocaleString(locale)
                            : (order.created_date ? new Date(order.created_date).toLocaleString(locale) : new Date().toLocaleString(locale));
                        const currentStep = st.step;

                        return (
                            <motion.div 
                                key={order.id || i} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: i * 0.04 }}
                                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{localize("Mã đơn: #")}{localize((order.id || '').slice(-8).toUpperCase())}</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{localize(dateStr)}</p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${st.color}`}>
                                        <Icon className="w-3.5 h-3.5" />{localize(st.label)}
                                    </span>
                                </div>

                                {/* Timeline step indicator */}
                                {order.status !== 'cancelled' && (
                                    <div className="relative pt-2 pb-1">
                                        <div className="absolute left-0 top-4 w-full h-1 bg-gray-100 rounded-full" />
                                        <div 
                                            className="absolute left-0 top-4 h-1 bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(0, (currentStep - 1)) * 33.33}%` }}
                                        />
                                        <div className="relative flex justify-between">
                                            {[
                                                { step: 1, label: 'Đặt hàng' },
                                                { step: 2, label: 'Xác nhận' },
                                                { step: 3, label: 'Đang giao' },
                                                { step: 4, label: 'Hoàn thành' }
                                            ].map((s) => (
                                                <div key={s.step} className="flex flex-col items-center gap-1 relative z-10 w-14">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${currentStep >= s.step ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200'}`}>
                                                        {currentStep >= s.step && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                    </div>
                                                    <span className={`text-[10px] font-medium text-center ${currentStep >= s.step ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                                        {localize(s.label)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Item list */}
                                <div className="space-y-1.5 py-2">
                                    {(order.items || []).map((item, j) => (
                                        <div key={j} className="flex justify-between items-center text-xs sm:text-sm text-gray-700">
                                            <span className="flex-1 truncate pr-3">{localize(item.name || item.title || 'Sản phẩm mây tre')}</span>
                                            <span className="text-gray-400 mr-3">x{item.qty || 1}</span>
                                            <span className="font-semibold min-w-[70px] text-right">{fmt((item.price || 0) * (item.qty || 1))}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer summary & actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                                    <div className="text-xs sm:text-sm">
                                        <span className="text-gray-500">{localize("Tổng cộng: ")}</span>
                                        <span className="font-bold text-primary text-base sm:text-lg">{fmt(order.total_price)}</span>
                                    </div>
                                    {order.status === 'delivered' && (
                                        <button 
                                            onClick={() => setSelectedInvoice(order)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                                        >
                                            <FileText className="w-3.5 h-3.5" />{localize("Hóa đơn")}</button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
                )}
            </AnimatePresence>
        </motion.div>,
        document.body
    );
}
