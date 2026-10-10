export const TIERS = {
    bronze: {
        id: 'bronze',
        name: 'Đồng',
        emoji: '🥉',
        minOrders: 0,
        color: 'from-amber-600 via-amber-700 to-yellow-800',
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        discount: 0,
        freeship: false,
        vouchers: ['WELCOME10'],
        benefits: [
            'Mặc định khi đăng ký thành viên',
            'Tích lũy Điểm di sản cho mỗi đơn hàng',
            'Quyền truy cập tính năng thiết kế Đan AI'
        ]
    },
    silver: {
        id: 'silver',
        name: 'Bạc',
        emoji: '🥈',
        minOrders: 20,
        color: 'from-slate-600 via-slate-700 to-zinc-800',
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        text: 'text-slate-900',
        discount: 5,
        freeship: false,
        vouchers: ['WELCOME10', 'SILVER50'],
        benefits: [
            'Từ 20 đơn hàng trở lên',
            'Giảm 5% cho tất cả đơn hàng',
            'Voucher giảm 50k cho đơn từ 500k',
            'Nhân đôi điểm thưởng các dịp lễ'
        ]
    },
    gold: {
        id: 'gold',
        name: 'Vàng',
        emoji: '🥇',
        minOrders: 50,
        color: 'from-amber-500 via-yellow-600 to-amber-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-400',
        text: 'text-yellow-900',
        discount: 10,
        freeship: true,
        vouchers: ['WELCOME10', 'SILVER50', 'FREESHIP'],
        benefits: [
            'Từ 50 đơn hàng trở lên',
            'Giảm 10% tất cả đơn hàng',
            'Miễn phí vận chuyển toàn quốc',
            'Ưu tiên chế tác nghệ nhân làng nghề'
        ]
    },
    diamond: {
        id: 'diamond',
        name: 'Kim Cương',
        emoji: '💎',
        minOrders: 70,
        color: 'from-cyan-600 via-blue-700 to-indigo-800',
        bg: 'bg-cyan-50',
        border: 'border-cyan-400',
        text: 'text-cyan-900',
        discount: 15,
        freeship: true,
        vouchers: ['WELCOME10', 'SILVER50', 'FREESHIP', 'DIAMOND15'],
        benefits: [
            'Từ 70 đơn hàng trở lên',
            'Giảm 15% độc quyền không giới hạn',
            'Freeship ưu tiên cao cấp',
            'Hỗ trợ chế tác mây tre 1-1 riêng biệt'
        ]
    }
};

export const VOUCHER_CODES = {
    'WELCOME10': { label: 'Giảm 10%', desc: 'Cho đơn hàng đầu tiên', points_cost: 50, min_spend: 100000 },
    'SILVER50': { label: 'Giảm 50k', desc: 'Cho đơn hàng từ 500k', points_cost: 100, min_spend: 500000 },
    'FREESHIP': { label: 'Miễn phí vận chuyển', desc: 'Tối đa 30k', points_cost: 150, min_spend: 200000 },
    'DIAMOND15': { label: 'Giảm 15%', desc: 'Áp dụng mọi đơn hàng', points_cost: 300, min_spend: 300000 }
};

export const REDEEMABLE_VOUCHERS = ['WELCOME10', 'SILVER50', 'FREESHIP', 'DIAMOND15'];

export function getTierByOrders(orders) {
    if (orders >= 70) return 'diamond';
    if (orders >= 50) return 'gold';
    if (orders >= 20) return 'silver';
    return 'bronze';
}

export function getNextTier(currentTier) {
    if (currentTier === 'bronze') return 'silver';
    if (currentTier === 'silver') return 'gold';
    if (currentTier === 'gold') return 'diamond';
    return null;
}

export function getPoints(orders, spent) {
    return Math.floor((spent || 0) / 1000) + (orders || 0) * 10;
}

// Display defaults for legacy tier records. Pricing and membership rules stay in TIERS.
export function getTierPresentation(tier) {
    const minimum = { bronze: 0, silver: 20, gold: 50, diamond: 70 };
    return { ...tier, minOrders: tier.minOrders ?? minimum[tier.id], benefits: tier.benefits ?? [] };
}
