import { useLang } from '../../context/LanguageContext';
import { X, Printer, Download, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const fmt = (n) => n?.toLocaleString('vi-VN') + 'đ';

export default function InvoiceModal({ order, onClose }) {
    const { text: localize, locale } = useLang();
    if (!order) return null;

    const dateStr = order.created_at?.toDate 
        ? order.created_at.toDate().toLocaleString(locale)
        : new Date().toLocaleString(locale);

    const handlePrint = () => {
        window.print();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header (No print) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 print:hidden">
                    <h2 className="font-bold text-lg text-gray-800">{localize("Hoá Đơn Bán Hàng")}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium text-sm transition-colors">
                            <Printer className="w-4 h-4" />{localize(" In / Lưu PDF")}</button>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-200 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Invoice Content (Printable) */}
                <div className="overflow-y-auto flex-1 p-8 sm:p-12 print:p-0 print:overflow-visible text-gray-800 bg-white" id="invoice-content">
                    {/* Brand */}
                    <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">{localize("PV")}</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{localize("PHÚ VINH AI")}</h1>
                                    <p className="text-xs text-primary font-medium tracking-widest uppercase">{localize("Mây Tre Đan Truyền Thống")}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">{localize("Phú Nghĩa, Chương Mỹ, Hà Nội")}</p>
                            <p className="text-sm text-gray-500">{localize("Email: contact@phuvinh.com")}</p>
                            <p className="text-sm text-gray-500">{localize("Hotline: 0912.345.678")}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest mb-2">{localize("Invoice")}</h2>
                            <p className="text-sm font-semibold">{localize("Mã đơn: #")}{localize(order.id?.slice(-8).toUpperCase())}</p>
                            <p className="text-sm text-gray-500">{localize("Ngày lập: ")}{localize(dateStr)}</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-200">
                                <CheckCircle2 className="w-3 h-3" />{localize(" ĐÃ THANH TOÁN")}</div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100 print:bg-transparent print:border-none print:p-0">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{localize("Thông tin khách hàng")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="font-bold text-gray-900">{order.customer_name || localize('Khách hàng')}</p>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {order.customer_phone}</p>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {order.customer_email || localize('Không có')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><MapPin className="w-3.5 h-3.5" />{localize(" Địa chỉ giao hàng")}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{order.customer_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-900 text-sm font-bold">
                                    <th className="py-3 px-2">{localize("Sản phẩm")}</th>
                                    <th className="py-3 px-2 text-center w-20">{localize("SL")}</th>
                                    <th className="py-3 px-2 text-right w-32">{localize("Đơn giá")}</th>
                                    <th className="py-3 px-2 text-right w-32">{localize("Thành tiền")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.items || []).map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100 text-sm">
                                        <td className="py-4 px-2 font-medium text-gray-900">{localize(item.name)}</td>
                                        <td className="py-4 px-2 text-center text-gray-600">{localize(item.qty)}</td>
                                        <td className="py-4 px-2 text-right text-gray-600">{localize(fmt(item.price))}</td>
                                        <td className="py-4 px-2 text-right font-bold text-gray-900">{localize(fmt(item.price * item.qty))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end">
                        <div className="w-full sm:w-1/2 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600 px-2">
                                <span>{localize("Tạm tính:")}</span>
                                <span>{localize(fmt(order.original_price))}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 px-2">
                                <span>{localize("Phí vận chuyển:")}</span>
                                <span>{localize(order.freeship ? 'Miễn phí' : fmt(15000))}</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600 px-2">
                                    <span>{localize("Giảm giá (")}{localize(order.voucher_code || 'Hạng TV')}):</span>
                                    <span>-{localize(fmt(order.discount_amount))}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center px-2 py-4 mt-2 border-t-2 border-gray-900">
                                <span className="font-bold text-lg uppercase">{localize("Tổng cộng:")}</span>
                                <span className="font-black text-2xl text-primary">{localize(fmt(order.total_price))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                        <p>{localize("Cảm ơn quý khách đã mua sắm tại Phú Vinh AI.")}</p>
                        <p>{localize("Mọi thắc mắc về đơn hàng vui lòng liên hệ hotline để được hỗ trợ.")}</p>
                    </div>
                </div>
                
                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #invoice-content, #invoice-content * { visibility: visible; }
                        #invoice-content { position: absolute; left: 0; top: 0; width: 100%; }
                    }
                `}</style>
            </motion.div>
        </motion.div>
    );
}
