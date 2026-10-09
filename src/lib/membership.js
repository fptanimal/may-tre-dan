export const TIERS = {
    bronze: {
        id: 'bronze',
        name: 'Đồng',
        emoji: '🥉',
        vouchers: ['WELCOME10']
    },
    silver: {
        id: 'silver',
        name: 'Bạc',
        emoji: '🥈',
        vouchers: ['WELCOME10', 'SILVER50']
    },
    gold: {
        id: 'gold',
        name: 'Vàng',
        emoji: '🥇',
        vouchers: ['WELCOME10', 'SILVER50', 'FREESHIP']
    },
    diamond: {
        id: 'diamond',
        name: 'Kim Cương',
        emoji: '💎',
        vouchers: ['WELCOME10', 'SILVER50', 'FREESHIP', 'DIAMOND15']
    }
};

export const VOUCHER_CODES = {
    'WELCOME10': { label: 'Giảm 10%', desc: 'Cho đơn hàng đầu tiên' },
    'SILVER50': { label: 'Giảm 50k', desc: 'Cho đơn hàng từ 500k' },
    'FREESHIP': { label: 'Miễn phí vận chuyển', desc: 'Tối đa 30k' },
    'DIAMOND15': { label: 'Giảm 15%', desc: 'Áp dụng mọi đơn hàng' }
};

export function getTierByOrders(orders) {
    if (orders >= 20) return 'diamond';
    if (orders >= 8) return 'gold';
    if (orders >= 3) return 'silver';
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
    const minimum = { bronze: 0, silver: 3, gold: 8, diamond: 20 };
    return { ...tier, minOrders: tier.minOrders ?? minimum[tier.id], benefits: tier.benefits ?? [] };
}
