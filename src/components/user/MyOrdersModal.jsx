import { useState, useEffect } from 'react';
import { X, ShoppingBag, Loader2, Package, Clock, CheckCircle2, Truck, XCircle, FileText } from 'lucide-react';
import { db } from '@/api/firebaseClient';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuthUser } from '../../context/AuthUserContext';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceModal from './InvoiceModal';

const fmt = (n) => n?.toLocaleString('vi-VN') + 'đ';
const STATUS = {
    pending: { label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', step: 1 },
    confirmed: { label: 'Đã xác nhận', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200', step: 2 },
    shipping: { label: 'Đang giao', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200', step: 3 },
    delivered: { label: 'Đã giao', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', step: 4 },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', step: 0 },
};

export default function MyOrdersModal({ onClose }) {
    const { user } = useAuthUser() || {};
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        const email = user?.email;
        if (!email) { setLoading(false); return; }
        
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
                    return t2 - t1;
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

    return (
        <motion.div
            className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
                onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-primary to-emerald-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-white" />
                        <h2 className="text-white font-bold">Đơn Hàng Của Tôi</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"><X className="w-4 h-4 text-white" /></button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 bg-gray-50/50">
                    {loading && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
                    {!loading && orders.length === 0 && (
                        <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-gray-100">
                            <Package className="w-12 h-12 text-gray-200 mx-auto" />
                            <p className="text-gray-400 font-medium">Bạn chưa có đơn hàng nào.</p>
                        </div>
                    )}
                    {orders.map((order, i) => {
                        const st = STATUS[order.status] || STATUS.pending;
                        const Icon = st.icon;
                        const dateStr = order.created_at?.toDate 
                            ? order.created_at.toDate().toLocaleString('vi-VN') 
                            : new Date().toLocaleString('vi-VN');
                        const currentStep = st.step;

                        return (
                            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Mã đơn: #{(order.id || '').slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${st.color}`}>
                                        <Icon className="w-3.5 h-3.5" />{st.label}
                                    </span>
                                </div>

                                {/* Timeline */}
                                {order.status !== 'cancelled' && (
                                    <div className="relative pt-4 pb-2">
                                        <div className="absolute left-0 top-6 w-full h-1 bg-gray-100 rounded-full" />
                                        <div 
                                            className="absolute left-0 top-6 h-1 bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${(currentStep - 1) * 33.33}%` }}
                                        />
                                        <div className="relative flex justify-between">
                                            {[
                                                { step: 1, label: 'Đặt hàng' },
                                                { step: 2, label: 'Xác nhận' },
                                                { step: 3, label: 'Đang giao' },
                                                { step: 4, label: 'Hoàn thành' }
                                            ].map((s) => (
                                                <div key={s.step} className="flex flex-col items-center gap-2 relative z-10 w-16">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${currentStep >= s.step ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200'}`}>
                                                        {currentStep >= s.step && <CheckCircle2 className="w-3 h-3" />}
                                                    </div>
                                                    <span className={`text-[10px] sm:text-xs font-medium text-center ${currentStep >= s.step ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 py-3 border-y border-gray-100">
                                    {(order.items || []).map((item, j) => (
                                        <div key={j} className="flex justify-between items-center text-sm text-gray-700">
                                            <span className="flex-1 truncate pr-4">{item.name}</span>
                                            <span className="text-gray-400 mr-4">x{item.qty}</span>
                                            <span className="font-medium min-w-[80px] text-right">{fmt(item.price * item.qty)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Tổng thanh toán: </span>
                                        <span className="font-bold text-primary text-lg">{fmt(order.total_price)}</span>
                                    </div>
                                    {order.status === 'delivered' && (
                                        <button 
                                            onClick={() => setSelectedInvoice(order)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" /> Xem hoá đơn
                                        </button>
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
        </motion.div>
    );
}