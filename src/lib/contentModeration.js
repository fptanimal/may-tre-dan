// Content moderation system for the Community
// Detects profanity, spam, and toxic content in Vietnamese (with variants) and English
// Uses normalization + keyword matching + AI context analysis

import { BAD_WORDS_L33T } from './l33tWords';

// Vietnamese profanity and toxic words with common variants/l33t speak
const BAD_WORDS_VI = [
    // 1. Từ ngữ dung tục, chửi thề (Profanity & Vulgarity)
    'địt', 'đụ', 'đm', 'đcm', 'đmm', 'dkm', 'dcmm', 'clm', 'clmm', 'cml', 'vkl', 'vcl', 'vl', 'vilon',
    'cặc', 'lồn', 'đĩ', 'phò', 'đbrr', 'cái loz', 'buồi', 'dái', 'nứng', 'bướm', 'cứt',
    'chó đẻ', 'thằng chó', 'mẹ mày', 'bố mày', 'óc chó', 'sủa', 'mả cha mày', 'thằng khốn', 'chó má',
    'súc sinh', 'súc vật', 'cầm thú', 'khốn nạn', 'mất dạy', 'vô giáo dục', 'điếm thúy', 'con đĩ', 'thằng lồn',

    // 2. Từ lóng, nói giảm nói tránh mang ý thô tục
    'đậu xanh', 'đậu má', 'đệt', 'đệch', 'đờ mờ', 'vãi chưởng', 'vãi lúa', 'vãi đái', 'vãi nhái',
    'vãi linh hồn', 'vãi nồi', 'cái đinh công mạnh', 'củ lạc giòn tan', 'cái bíp', 'cmn', 'cái lề gì thốn',
    'xếp hình', 'đá phò', 'cắm sừng', 'đổ vỏ', 'húp sò', 'ăn chuối',

    // 3. Từ khóa 18+, gạ tình, tình dục (18+ & Sexual)
    'yếu sinh lý', 'xuất tinh sớm', 'rối loạn cương dương', 'liệt dương', 'tăng kích thước cậu nhỏ',
    'kéo dài thời gian quan hệ', 'bao cao su', 'gel bôi trơn', 'đồ chơi tình dục', 'sextoy', 'máy massage điểm G',
    'phụ khoa', 'nam khoa', 'viêm nhiễm vùng kín', 'hôi vùng kín', 'se khít âm đạo', 'làm hồng cô bé',
    'nhũ hoa', 'dương vật', 'âm đạo', 'tử cung', 'tinh trùng', 'thuốc kích dục',
    'thuốc xịt lâu ra', 'kẹo ngậm phòng the', 'mại dâm', 'gái gọi', 'sugar baby', 'sugar daddy', 'sgdd', 'sgbb',
    'chịch', 'xoạc', 'nện', 'make love', 'tình dục', 'khoái cảm', 'lên đỉnh', 'quần lót lọt khe',
    'đồ lót gợi cảm', 'bơm ngực', 'độn mông', 'cắt bao quy đầu', 'hột le', 'bím', 'dâm dật', 'dâm đãng', 'thủ dâm',
    'qwerty', 'waytay', 'nứng lồn', 'nứng sảng', 'thèm thuồng', 'đít bự', 'hàng họ', 'địt nhau',

    // 4. Bạo lực, vũ khí, tự hại (Violence, Weapons, Self-harm)
    'tự tử', 'tự sát', 'cắt cổ tay', 'treo cổ', 'uống thuốc độc', 'giết người', 'đâm chém', 'tử thi',
    'xác chết', 'chết chóc', 'đẫm máu', 'lựu đạn', 'thuốc nổ', 'pháo sáng', 'pháo nổ', 'dao găm', 'mã tấu',
    'kiếm nhật', 'côn nhị khúc', 'vũ khí sát thương', 'bạo hành', 'đánh đập', 'tra tấn', 'bạo lực gia đình',
    'bạo hành trẻ em', 'khủng bố', 'bạo động', 'phản động', 'lật đổ', 'cướp bóc', 'hiếp dâm', 'tống tiền',
    'bắt cóc', 'săn bắn', 'giết mổ', 'nổ tung', 'thiêu rụi', 'hủy diệt',

    // 5. Y tế, hàng cấm, cờ bạc, lừa đảo (Medical claims, Illegal goods, Gambling, Scams)
    'trị dứt điểm', 'cam kết khỏi bệnh', 'thuốc tiên', 'thần dược', 'thuốc giảm cân', 'thuốc tăng cân',
    'đông y gia truyền', 'mỡ máu', 'tiểu đường', 'ung thư', 'hiv', 'aids', 'viêm gan b', 'xương khớp', 'sẹo rỗ', 'hói đầu',
    'phòng khám', 'cờ bạc', 'cá độ', 'cá cược', 'lô đề', 'xổ số', 'đánh bài', 'casino', 'poker',
    'cho vay nặng lãi', 'bốc bát họ', 'tín dụng đen', 'cầm đồ', 'đòi nợ thuê', 'kiếm tiền nhanh', 'làm giàu không khó',
    'đa cấp', 'lùa gà', 'đầu tư sinh lời', 'tiền ảo', 'crypto', 'bitcoin', 'forex', 'chứng khoán', 'hack', 'rip nick',
    'bẻ khóa', 'phần mềm gián điệp', 'thẻ tín dụng chùa', 'ma túy', 'cần sa', 'thuốc lắc', 'đập đá', 'cỏ mỹ',
    'heroin', 'xì gà', 'thuốc lá điện tử', 'vape', 'pod', 'shisha', 'rượu vang', 'rượu mạnh', 'động vật hoang dã',
    'ngà voi', 'sừng tê giác', 'vảy tê tê', 'cam kết lợi nhuận', 'sàn ảo', 'cờ bạc bịp', 'xóc đĩa', 'tài xỉu', 'banh bóng',

    // 6. Phân biệt đối xử, Hate speech (Discrimination & Hate speech)
    'thanh hóa', 'rau má', 'dân tnt', 'bắc kỳ', 'nam kỳ', 'trung kỳ', 'nhà quê', 'tỉnh lẻ', 'miệt vườn',
    'lợn nái', 'dị dạng', 'khuyết tật', 'sứt môi', 'mù dở', 'mọi rợ', 'dân tộc thiểu số', 'chó đen',
    'tây ba lô', 'khỉ da vàng', 'chink', 'n-word', 'bóng chó', 'bê đê', 'ô môi', 'ái nam ái nữ',
    'đồ ẻo lả', 'gay lọ', 'tởm lợm', 'bệnh hoạn', 'lừa dối đạo', 'mê tín dị đoan', 'phỉ báng', 'báng bổ',
    'đồ vô học', 'cặn bã xã hội', 'nghèo rớt mồng tơi', 'khô rách áo ôm'
];

const BAD_WORDS_EN = [
    'fuck', 'f*ck', 'fck', 'f4ck', 'f.u.c.k',
    'shit', 'sh1t', 'sh!t', 'sh*t',
    'bitch', 'b1tch', 'b!tch',
    'asshole', 'a$$hole', 'a-hole',
    'dick', 'd1ck', 'd!ck',
    'pussy', 'pu$$y',
    'cunt', 'c4nt',
    'bastard', 'b4stard',
    'slut', 'sl4t',
    'whore', 'wh0re',
    'retard', 'ret4rd',
    'idiot', '1d10t',
    'stupid',
    'damn',
    'crap',
    'piss',
];

const SPAM_PATTERNS = [
    /(.)\1{5,}/i, // Repeated characters (aaaaaa)
    /(http|https|www\.|\.com|\.vn|\.net)/gi, // URLs
    /\b\d{10,}\b/, // Long number sequences (phone spam)
];

// Normalize text: remove diacritics, replace l33t, lowercase
function normalize(text) {
    if (!text) return '';
    let s = text.toLowerCase().trim();
    // Remove Vietnamese diacritics
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Replace common substitutions
    s = s.replace(/[4@àáảãạâầấẩẫậăằắẳẵặ]/g, 'a');
    s = s.replace(/[3èéẻẽẹêềếểễệ]/g, 'e');
    s = s.replace(/[1ìíỉĩị]/g, 'i');
    s = s.replace(/[0òóỏõọôồốổỗộơờớởỡợ]/g, 'o');
    s = s.replace(/[5]/g, 's');
    s = s.replace(/[7]/g, 't');
    s = s.replace(/[$]/g, 's');
    s = s.replace(/[!]/g, 'i');
    s = s.replace(/[.]/g, '');
    s = s.replace(/[_-]/g, ' ');
    s = s.replace(/\s+/g, ' ');
    return s;
}

const allBadWords = [...BAD_WORDS_VI, ...BAD_WORDS_EN, ...BAD_WORDS_L33T];
const normalizedBad = [...new Set(allBadWords.map(normalize))];

export function moderateContent(text) {
    if (!text || text.trim().length === 0) {
        return { passed: true, reason: null };
    }

    const normalized = normalize(text);

    // Check for bad words
    for (const bad of normalizedBad) {
        if (!bad || bad.length < 2) continue;
        // Check as whole word or substring
        const regex = new RegExp(`\\b${bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(normalized) || normalized.includes(bad)) {
            return {
                passed: false,
                reason: 'profanity',
                message: 'Nội dung chứa từ ngữ không phù hợp. Vui lòng chỉnh sửa lại.',
                messageEn: 'Content contains inappropriate language. Please edit and resubmit.',
            };
        }
    }

    // Check for spam patterns
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(text)) {
            // URLs are allowed in moderation but flagged
            if (pattern.source.includes('http')) continue;
            return {
                passed: false,
                reason: 'spam',
                message: 'Nội dung có vẻ là spam. Vui lòng viết tự nhiên hơn.',
                messageEn: 'Content appears to be spam. Please write more naturally.',
            };
        }
    }

    // Check for excessive caps
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 10 && upperCount / letterCount > 0.7) {
        return {
            passed: false,
            reason: 'caps',
            message: 'Vui lòng không viết hoa toàn bộ nội dung.',
            messageEn: 'Please avoid writing in all caps.',
        };
    }

    // Check for very short/meaningless content
    if (text.trim().length < 5) {
        return {
            passed: false,
            reason: 'too_short',
            message: 'Nội dung quá ngắn. Vui lòng viết chi tiết hơn.',
            messageEn: 'Content is too short. Please write more detail.',
        };
    }

    return { passed: true, reason: null };
}

// Rate limiting: max posts per user per day
const POST_RATE_LIMIT = 5;
const userPostCount = {};

export function checkRateLimit(userEmail) {
    if (!userEmail) return { allowed: true };
    const today = new Date().toDateString();
    const key = `${userEmail}:${today}`;
    const count = userPostCount[key] || 0;
    if (count >= POST_RATE_LIMIT) {
        return {
            allowed: false,
            message: 'Bạn đã đăng quá nhiều bài hôm nay. Vui lòng thử lại sau.',
            messageEn: 'You have posted too many times today. Please try again later.',
        };
    }
    userPostCount[key] = count + 1;
    return { allowed: true };
}

// Log moderation action
export function logModeration(action, content, reason) {
    console.warn('[MODERATION]', { action, reason, preview: content?.substring(0, 100), timestamp: new Date().toISOString() });
}