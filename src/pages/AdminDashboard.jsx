import { useState, useEffect, useRef, useCallback } from 'react';
import { playSuccess, initSound, setSoundEnabled, isSoundEnabled } from '../lib/soundManager';
import { 
  Loader2, Bell, BellOff, ShoppingBag, 
  CheckCircle2, Clock, Truck, Package, X, ShieldAlert
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuthUser } from '../context/AuthUserContext';
import { db } from '@/api/firebaseClient';
import { collection, getDocs, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuthUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const prevOrdersCount = useRef(0);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    // Initial sound state
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const newVal = !soundOn;
    setSoundEnabled(newVal);
    setSoundOn(newVal);
    if (newVal) {
      initSound();
      playSuccess(); // Test sound
      toast({
        title: "Đã bật âm báo",
        description: "Bạn sẽ nghe tiếng 'Ting' khi có đơn hàng mới.",
      });
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("created_at", "desc"), limit(100));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      setOrders(data);
      
      // Check for new orders
      if (prevOrdersCount.current > 0 && data.length > prevOrdersCount.current) {
        if (soundOn) {
          playSuccess();
        }
        toast({
          title: "🎉 CÓ ĐƠN HÀNG MỚI!",
          description: "Vừa có khách đặt hàng. Vui lòng kiểm tra ngay.",
          variant: "default",
          className: "bg-gradient-to-r from-emerald-500 to-primary text-white border-none"
        });
      }
      prevOrdersCount.current = data.length;
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  }, [soundOn, toast]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // Poll every 15s
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Protect the route
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.email?.toLowerCase() !== 'lam.nguyendang610@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Truy Cập Bị Từ Chối</h2>
          <p className="text-slate-500 mb-6">
            Chỉ có tài khoản quản trị viên (lam.nguyendang610@gmail.com) mới được phép xem trang này.
          </p>
          <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
            Quay Về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  const updateOrderStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast({
        title: "Cập nhật thành công",
        description: `Đơn hàng đã chuyển sang trạng thái: ${newStatus}`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Lỗi cập nhật",
        description: "Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200"><Clock className="w-3.5 h-3.5"/> Chờ xử lý</span>;
      case 'processing': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200"><Package className="w-3.5 h-3.5"/> Đang đóng gói</span>;
      case 'shipped': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200"><Truck className="w-3.5 h-3.5"/> Đang giao</span>;
      case 'delivered': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200"><CheckCircle2 className="w-3.5 h-3.5"/> Đã hoàn thành</span>;
      default: 
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">{status}</span>;
    }
  };

  const fmt = (n) => n?.toLocaleString('vi-VN') + '₫';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Quản Trị Đơn Hàng</h1>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1.5 mt-2 rounded-xl border border-green-200 w-fit">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-green-700 font-medium">Tự động cập nhật realtime. Dữ liệu từ Firebase.</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={toggleSound}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              soundOn 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' 
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            {soundOn ? <Bell className="w-5 h-5 animate-pulse" /> : <BellOff className="w-5 h-5" />}
            {soundOn ? 'Âm Báo Đang Bật' : 'Bật Âm Báo Đơn Mới'}
          </button>
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-medium">Đang tải dữ liệu đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Package className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">Chưa có đơn hàng nào</h3>
              <p className="text-slate-500">Đơn hàng mới sẽ tự động xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="p-5">Khách Hàng</th>
                    <th className="p-5">Sản Phẩm</th>
                    <th className="p-5">Tổng Tiền</th>
                    <th className="p-5">Trạng Thái</th>
                    <th className="p-5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{order.customer_name}</div>
                        <div className="text-slate-500 mt-0.5">{order.customer_phone}</div>
                        <div className="text-xs text-slate-400 mt-1 line-clamp-1" title={order.customer_address}>{order.customer_address}</div>
                        {order.note && <div className="text-xs text-amber-600 mt-1 bg-amber-50 p-1.5 rounded-md inline-block">📝 Ghi chú: {order.note}</div>}
                      </td>
                      <td className="p-5 max-w-[250px]">
                        <ul className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-start text-xs">
                              <span className="font-medium text-slate-700 line-clamp-1 flex-1 pr-2">• {item.name}</span>
                              <span className="text-slate-400 whitespace-nowrap">x{item.qty}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-primary text-base">{fmt(order.total_price)}</div>
                        {order.discount_amount > 0 && <div className="text-xs text-green-600">Đã giảm {fmt(order.discount_amount)}</div>}
                      </td>
                      <td className="p-5">
                        {getStatusBadge(order.status)}
                        <div className="text-[10px] text-slate-400 mt-2 font-medium">
                          {new Date(order.created_at || order.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {order.status === 'pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'processing')} disabled={updatingId === order.id} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Chuyển sang Đang đóng gói">
                              {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Package className="w-4 h-4" />}
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button onClick={() => updateOrderStatus(order.id, 'shipped')} disabled={updatingId === order.id} className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Chuyển sang Đang giao">
                              {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Truck className="w-4 h-4" />}
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button onClick={() => updateOrderStatus(order.id, 'delivered')} disabled={updatingId === order.id} className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Xác nhận Đã giao">
                              {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                          )}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button onClick={() => updateOrderStatus(order.id, 'cancelled')} disabled={updatingId === order.id} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Huỷ đơn">
                              {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <X className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
