// Google Analytics 4 + Firebase Analytics integration (mock)

// Replace with your GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

let gaInitialized = false;

export const initAnalytics = () => {
    if (typeof window === 'undefined' || gaInitialized) return;
    
    // Create script tag for GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // We will handle page views manually for SPA
    });

    gaInitialized = true;
};

export const trackPageView = (path) => {
    try {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: path || window.location.pathname
            });
        }
    } catch (err) {
        console.error('Analytics error:', err);
    }
};

// Track a product view
export function trackProductView(product) {
    if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        window.gtag('event', 'view_item', {
            items: [{ item_id: product.id, item_name: product.name_en || product.name_vi, price: product.price, item_category: product.category }],
        });
    }
        // base44 mock removed
}

// Track add to cart
export function trackAddToCart(product, qty = 1) {
    if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        window.gtag('event', 'add_to_cart', {
            items: [{ item_id: product.id, item_name: product.name_en || product.name_vi, price: product.price, quantity: qty }],
        });
    }
}

// Track checkout / order placed
export function trackCheckout(total, itemCount) {
    if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        window.gtag('event', 'purchase', { value: total, currency: 'VND', items: itemCount });
    }
}

// Track custom event
export function trackEvent(eventName, properties = {}) {
    if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        window.gtag('event', eventName, properties);
    }
}