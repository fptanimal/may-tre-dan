import { useLang } from '../../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Bell, Truck, CheckCircle2, Clock, XCircle, Package } from 'lucide-react';
import { db } from '@/api/firebaseClient';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuthUser } from '../../context/AuthUserContext';
import { motion, AnimatePresence } from 'framer-motion';
import MyOrdersModal from './MyOrdersModal';

const STATUS = {
    pending: { label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    confirmed: { label: 'Đã xác nhận', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
    shipping: { label: 'Đang giao', icon: Truck, color: 'text-purple-600 bg-purple-50' },
    delivered: { label: 'Đã giao', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export default function NotificationBell() {
    const { text: localize } = useLang();
    const { user } = useAuthUser() || {};
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [unread, setUnread] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (!user?.email) return;

        const q = query(
            collection(db, "orders"),
            where("customer_email", "==", user.email),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            let data = [];
            let hasActive = false;
            snap.forEach(d => {
                const order = { id: d.id, ...d.data() };
                data.push(order);
                if (order.status !== 'pending' && order.status !== 'cancelled') {
                    hasActive = true;
                }
            });
            
            // Sort locally
            data.sort((a, b) => {
                const t1 = a.created_at?.toMillis ? a.created_at.toMillis() : (new Date(a.created_date || 0)).getTime();
                const t2 = b.created_at?.toMillis ? b.created_at.toMillis() : (new Date(b.created_date || 0)).getTime();
                return t2 - t1;
            });
            
            setOrders(data);
            
            // Check if there are active orders (shipping, confirmed, delivered)
            // Ideally we should track "read" status in DB, but for now we just show red dot if there are active orders
            setUnread(hasActive);
        });

        return () => unsubscribe();
    }, [user?.email]);

    if (!user) return null;

    const handleOpen = () => {
        setOpen(!open);
        setUnread(false); // Mark as read locally
    };

    const handleViewOrder = () => {
        setOpen(false);
        setShowOrdersModal(true);
    };

    return (
        <div className="relative" ref={ref}>
            <button onClick={handleOpen} className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
                {unread && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">{localize("Thông báo")}</h3>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                            {localize(orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">{localize("Chưa có thông báo nào")}</p>
                                </div>
                            ) : (
                                orders.map(order => {
                                    const st = STATUS[order.status] || STATUS.pending;
                                    const Icon = st.icon;
                                    return (
                                        <div key={order.id} onClick={handleViewOrder} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${st.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 font-medium">{localize("Đơn hàng ")}<span className="font-bold">#{localize(order.id.slice(-6).toUpperCase())}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {localize(order.status === 'confirmed' ? 'Đã được xác nhận và đang chuẩn bị.' :
                                                     order.status === 'shipping' ? 'Đang được giao đến bạn.' : 
                                                     order.status === 'delivered' ? 'Đã giao thành công!' :
                                                     order.status === 'cancelled' ? 'Đã bị huỷ.' : 'Đang chờ xác nhận.')}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {localize(order.created_at?.toDate ? order.created_at.toDate().toLocaleString('vi-VN') : '')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100">
                            <button onClick={handleViewOrder} className="w-full py-2 rounded-lg text-sm text-primary font-medium hover:bg-primary/10 transition-colors">{localize("Xem tất cả đơn hàng")}</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {showOrdersModal && <MyOrdersModal onClose={() => setShowOrdersModal(false)} />}
        </div>
    );
}
