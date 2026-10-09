import { useId } from 'react';

/** Local vector avatar: crisp at every size and available without an external service. */
export default function MayAvatar({ className = '', label = 'Bạn Mây AI' }) {
    const id = useId().replace(/:/g, '');
    return (
        <svg viewBox="0 0 80 80" role="img" aria-label={label} className={className}>
            <defs>
                <linearGradient id={`${id}-bg`} x2="1" y2="1">
                    <stop stopColor="#ede9fe" /><stop offset="1" stopColor="#d1fae5" />
                </linearGradient>
                <linearGradient id={`${id}-cloud`} x2="0" y2="1">
                    <stop stopColor="#fffef7" /><stop offset="1" stopColor="#f4eedf" />
                </linearGradient>
            </defs>
            <rect width="80" height="80" rx="26" fill={`url(#${id}-bg)`} />
            <circle cx="63" cy="19" r="3" fill="#fff" opacity=".8" />
            <path d="M16 22h6m-3-3v6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="40" cy="66" rx="22" ry="4" fill="#7c3aed" opacity=".09" />
            <path d="M24 57c-9 0-15-6-15-13s5-12 12-13c0-9 7-16 16-16 8 0 14 5 16 12 8-1 15 5 15 13 5 2 7 5 7 9 0 7-6 11-13 11H25Z" fill={`url(#${id}-cloud)`} stroke="#fff" strokeWidth="2" />
            <path d="M42 20c-1-8 3-12 10-12 0 7-3 11-10 12Z" fill="#34a77a" />
            <path d="M43 19l6-7" stroke="#16794f" strokeWidth="1.3" strokeLinecap="round" />
            <ellipse cx="27" cy="46" rx="5" ry="3" fill="#f9b6c5" opacity=".8" />
            <ellipse cx="55" cy="46" rx="5" ry="3" fill="#f9b6c5" opacity=".8" />
            <ellipse cx="31" cy="40" rx="2.4" ry="3.2" fill="#4c3568" />
            <ellipse cx="51" cy="40" rx="2.4" ry="3.2" fill="#4c3568" />
            <path d="M36 46q5 6 10 0" fill="none" stroke="#4c3568" strokeWidth="2" strokeLinecap="round" />
            <path d="M27 57q13 5 27 0l-2 8H29Z" fill="#c5a16e" />
            <path d="M30 60h21m-20 3h19m-15-5v7m6-6v6m6-7v7" stroke="#926d40" strokeWidth=".8" opacity=".65" />
            <path d="M51 56l7 6-6 1-4-5" fill="#9b83cf" />
        </svg>
    );
}
