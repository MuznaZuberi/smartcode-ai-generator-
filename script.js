// ============================================
// SmartCode AI - Professional Website Generator
// Advanced Prompt Parsing & Complete Generation
// ============================================

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function showToast(message, type) {
    type = type || 'success';
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    toastIcon.textContent = type === 'success' ? '✓' : '✕';
    toastMessage.textContent = message;
    toast.className = 'toast ' + type + ' active';
    setTimeout(function() { toast.classList.remove('active'); }, 3000);
}

// Restriction Modal Functions
function closeRestrictionModal() {
    const overlay = document.getElementById('restrictionOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function showRestrictionModal() {
    const overlay = document.getElementById('restrictionOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Validate if prompt is website-related
function isWebsiteRelatedPrompt(prompt) {
    if (!prompt || prompt.trim() === '') {
        return false;
    }

    const p = prompt.toLowerCase();

    // Question patterns (should be rejected - these are questions, not website requests)
    const questionPatterns = [
        'what is', 'what are', 'who is', 'who are', 'where is', 'where are',
        'when is', 'when are', 'why is', 'why are', 'how to', 'how does',
        'how can', 'how do', 'how will', 'tell me', 'explain', 'describe',
        'define', 'meaning of', 'definition of', 'what about', 'how about',
        'can you', 'could you', 'would you', 'will you', 'do you',
        'is this', 'are these', 'does this', 'did you', 'have you',
        'whatis', 'whatare', 'whois', 'howto'
    ];

    // Non-website topics (should be rejected)
    const nonWebsiteTopics = [
        'weather', 'forecast', 'temperature', 'climate', 'rain', 'sunny',
        'news', 'politics', 'sports', 'celebrity', 'cricket', 'football',
        'recipe', 'cooking', 'food order', 'restaurant', 'chef',
        'movie', 'film', 'cinema', 'music', 'song', 'album', 'artist',
        'game', 'gaming', 'esports', 'play', 'player',
        'python', 'java', 'c++', 'c#', 'ruby', 'perl', 'php code',
        'machine learning', 'ai model', 'training model', 'dataset',
        'calculate', 'calculator', 'math', 'mathematics', 'equation', 'solve',
        'translate', 'translation', 'language translator',
        'joke', 'funny', 'humor', 'laugh', 'comedy',
        'image generator', 'draw image', 'paint', 'picture create',
        'email send', 'message send', 'chat bot', 'conversation',
        'voice', 'audio', 'speech', 'sound', 'music player',
        'file convert', 'pdf', 'word', 'excel', 'document',
        'password generator', 'random number', 'otp',
        'api', 'backend', 'database', 'sql', 'mongodb', 'server',
        'stock', 'crypto', 'bitcoin', 'trading', 'finance',
        'health', 'medical', 'doctor', 'hospital', 'disease',
        'travel', 'flight', 'hotel', 'booking', 'ticket',
        'shopping online', 'amazon', 'ebay', 'product buy',
        'social media', 'facebook', 'instagram', 'twitter', 'tiktok',
        'youtube', 'video player', 'streaming', 'netflix',
        'education', 'course', 'tutorial', 'learn', 'study',
        'job', 'career', 'resume', 'cv', 'interview',
        'dating', 'friend', 'chat room', 'social',
        'fitness', 'gym', 'workout', 'diet', 'exercise',
        'real estate', 'property', 'house', 'rent', 'sale',
        'car', 'bike', 'vehicle', 'automobile', 'taxi', 'uber'
    ];

    // Check if it's a question (reject all questions)
    for (let i = 0; i < questionPatterns.length; i++) {
        if (p.indexOf(questionPatterns[i]) >= 0) {
            return false;
        }
    }

    // Check if prompt ends with question mark
    if (p.trim().endsWith('?')) {
        return false;
    }

    // Check for non-website topics
    for (let i = 0; i < nonWebsiteTopics.length; i++) {
        if (p.indexOf(nonWebsiteTopics[i]) >= 0) {
            return false;
        }
    }

    // Website creation keywords (must have at least one)
    const websiteKeywords = [
        'website', 'web site', 'webpage', 'web page', 'landing page',
        'portfolio', 'blog', 'ecommerce', 'online store', 'shop',
        'dashboard', 'admin panel', 'admin dashboard',
        'html', 'css', 'javascript', 'frontend design',
        'navbar', 'header', 'footer', 'section',
        'button', 'form', 'contact form', 'input field',
        'card design', 'modal', 'popup',
        'responsive design', 'mobile design', 'desktop design',
        'layout', 'theme', 'template',
        'color scheme', 'gradient design', 'animation', 'transition effect',
        'menu', 'navigation', 'sidebar', 'toolbar', 'tab',
        'list design', 'grid layout', 'table design', 'chart design',
        'login page', 'signup page', 'register page', 'profile page',
        'product page', 'cart page', 'checkout page', 'payment page',
        'service section', 'feature section', 'pricing section', 'testimonial section',
        'contact page', 'about page', 'home page', 'gallery', 'image gallery',
        'search bar', 'filter', 'sort', 'pagination', 'dropdown menu',
        'create website', 'build website', 'make website', 'design website',
        'generate website', 'develop website', 'website builder',
        'portfolio website', 'business website', 'company website',
        'personal website', 'professional website', 'modern website',
        'website design', 'web design', 'site design',
        'hero section', 'banner', 'carousel', 'slider',
        'testimonial', 'review section', 'rating',
        'team section', 'member', 'staff',
        'faq section', 'question answer',
        'footer section', 'copyright', 'social links'
    ];

    // Must contain at least one website keyword
    for (let i = 0; i < websiteKeywords.length; i++) {
        if (p.indexOf(websiteKeywords[i]) >= 0) {
            return true;
        }
    }

    // If no website keyword found, reject by default
    return false;
}

// State
var state = {
    history: JSON.parse(localStorage.getItem('smartcode_history') || '[]'),
    generatedCode: null,
    fileStructure: null,
    isGenerating: false,
    lastPrompt: '',
    techStack: 'html'  // Only HTML/CSS/JS supported
};

// DOM Elements
var elements = {
    websiteName: document.getElementById('websiteName'),
    promptInput: document.getElementById('promptInput'),
    generateBtn: document.getElementById('generateBtn'),
    historyList: document.getElementById('historyList'),
    previewFrame: document.getElementById('previewFrame'),
    htmlViewer: document.getElementById('htmlViewer'),
    cssViewer: document.getElementById('cssViewer'),
    jsViewer: document.getElementById('jsViewer'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingStatus: document.getElementById('loadingStatus'),
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    previewContent: document.getElementById('previewContent'),
    htmlContent: document.getElementById('htmlContent'),
    cssContent: document.getElementById('cssContent'),
    jsContent: document.getElementById('jsContent'),
    structureContent: document.getElementById('structureContent'),
    fileStructure: document.getElementById('fileStructure')
};

// Render history
function renderHistory() {
    if (!elements.historyList) return;
    if (state.history.length === 0) {
        elements.historyList.innerHTML = '<div class="history-item" style="cursor: default;">No recent prompts</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < state.history.length; i++) {
        var prompt = state.history[i];
        var display = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;
        html += '<div class="history-item-wrapper"><div class="history-item" onclick="loadPrompt(' + i + ')">' + escapeHtml(display) + '</div><button class="history-remove" onclick="removeHistory(' + i + ')" title="Remove">✕</button></div>';
    }
    elements.historyList.innerHTML = html;
}

function addToHistory(prompt) {
    var filtered = [];
    for (var i = 0; i < state.history.length; i++) {
        if (state.history[i] !== prompt) {
            filtered.push(state.history[i]);
        }
    }
    filtered.unshift(prompt);
    if (filtered.length > 10) {
        filtered = filtered.slice(0, 10);
    }
    state.history = filtered;
    localStorage.setItem('smartcode_history', JSON.stringify(state.history));
    renderHistory();
}

function loadPrompt(index) {
    elements.promptInput.value = state.history[index];
}

function removeHistory(index) {
    state.history.splice(index, 1);
    localStorage.setItem('smartcode_history', JSON.stringify(state.history));
    renderHistory();
}

function clearHistory() {
    state.history = [];
    localStorage.setItem('smartcode_history', JSON.stringify(state.history));
    renderHistory();
}

// Tab switching
function switchTab(tab, btn) {
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    btn.classList.add('active');

    // Hide all content
    elements.previewContent.classList.remove('active');
    elements.htmlContent.classList.remove('active');
    elements.cssContent.classList.remove('active');
    elements.jsContent.classList.remove('active');
    elements.structureContent.classList.remove('active');

    // Show selected content
    if (tab === 'preview') elements.previewContent.classList.add('active');
    else if (tab === 'html') elements.htmlContent.classList.add('active');
    else if (tab === 'css') elements.cssContent.classList.add('active');
    else if (tab === 'js') elements.jsContent.classList.add('active');
    else if (tab === 'structure') elements.structureContent.classList.add('active');

    // Update preview if switching to preview tab
    if (tab === 'preview') {
        updateLivePreview();
    }
}

// Live preview update
function updateLivePreview() {
    var html = elements.htmlViewer.value;
    var css = elements.cssViewer.value;
    var js = elements.jsViewer.value;

    var combined = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Live Preview</title>\n  <style>\n' + css + '\n  </style>\n</head>\n<body>\n' + html + '\n  <script>\n' + js + '\n  <\/script>\n</body>\n</html>';

    elements.previewFrame.srcdoc = combined;
}

// Add event listeners for live preview
function addLivePreviewListeners() {
    elements.htmlViewer.addEventListener('input', function() {
        if (elements.previewContent.classList.contains('active')) {
            updateLivePreview();
        }
    });
    elements.cssViewer.addEventListener('input', function() {
        if (elements.previewContent.classList.contains('active')) {
            updateLivePreview();
        }
    });
    elements.jsViewer.addEventListener('input', function() {
        if (elements.previewContent.classList.contains('active')) {
            updateLivePreview();
        }
    });
}

// ============================================
// ADVANCED PROMPT PARSING ENGINE
// ============================================

function parseUserPrompt(prompt) {
    var p = prompt.toLowerCase();
    var requirements = {
        websiteType: 'business',
        pages: [],
        sections: [],
        theme: {},
        features: [],
        components: [],
        animations: false,
        count: {}
    };

    // Detect website type
    if (p.indexOf('portfolio') >= 0 || p.indexOf('personal') >= 0 || p.indexOf('resume') >= 0 || p.indexOf('cv') >= 0) {
        requirements.websiteType = 'portfolio';
    } else if (p.indexOf('ecommerce') >= 0 || p.indexOf('shop') >= 0 || p.indexOf('store') >= 0) {
        requirements.websiteType = 'ecommerce';
    } else if (p.indexOf('landing') >= 0 || p.indexOf('saas') >= 0 || p.indexOf('product') >= 0) {
        requirements.websiteType = 'landing';
    } else if (p.indexOf('blog') >= 0 || p.indexOf('article') >= 0 || p.indexOf('news') >= 0) {
        requirements.websiteType = 'blog';
    } else if (p.indexOf('dashboard') >= 0 || p.indexOf('admin') >= 0 || p.indexOf('panel') >= 0) {
        requirements.websiteType = 'dashboard';
    } else if (p.indexOf('business') >= 0 || p.indexOf('company') >= 0 || p.indexOf('corporate') >= 0) {
        requirements.websiteType = 'business';
    }

    // Detect pages
    if (p.indexOf('home') >= 0) requirements.pages.push('home');
    if (p.indexOf('about') >= 0) requirements.pages.push('about');
    if (p.indexOf('service') >= 0 || p.indexOf('offering') >= 0) requirements.pages.push('services');
    if (p.indexOf('contact') >= 0) requirements.pages.push('contact');
    if (p.indexOf('project') >= 0 || p.indexOf('work') >= 0 || p.indexOf('portfolio') >= 0) requirements.pages.push('projects');
    if (p.indexOf('skill') >= 0 || p.indexOf('expertise') >= 0) requirements.pages.push('skills');
    if (p.indexOf('testimonial') >= 0 || p.indexOf('review') >= 0) requirements.pages.push('testimonials');
    if (p.indexOf('pricing') >= 0 || p.indexOf('plan') >= 0) requirements.pages.push('pricing');
    if (p.indexOf('feature') >= 0) requirements.pages.push('features');
    if (p.indexOf('blog') >= 0 || p.indexOf('article') >= 0) requirements.pages.push('blog');
    if (p.indexOf('faq') >= 0 || p.indexOf('question') >= 0) requirements.pages.push('faq');
    if (p.indexOf('team') >= 0 || p.indexOf('member') >= 0) requirements.pages.push('team');
    if (p.indexOf('cart') >= 0 || p.indexOf('checkout') >= 0) requirements.pages.push('cart');
    if (p.indexOf('login') >= 0 || p.indexOf('signin') >= 0) requirements.pages.push('login');
    if (p.indexOf('signup') >= 0 || p.indexOf('register') >= 0) requirements.pages.push('signup');

    // Detect theme colors
    var isPurple = p.indexOf('purple') >= 0 || p.indexOf('violet') >= 0 || p.indexOf('pink') >= 0;
    var isBlue = p.indexOf('blue') >= 0 || p.indexOf('navy') >= 0;
    var isRed = p.indexOf('red') >= 0 || p.indexOf('orange') >= 0;
    var isGreen = p.indexOf('green') >= 0 || p.indexOf('teal') >= 0;
    var isYellow = p.indexOf('yellow') >= 0 || p.indexOf('gold') >= 0;
    var isDark = p.indexOf('dark') >= 0 || p.indexOf('black') >= 0;
    var isLight = p.indexOf('light') >= 0 || p.indexOf('white') >= 0;

    if (isPurple && isDark) {
        requirements.theme = {
            name: 'purple-dark',
            primary: '#a855f7',
            secondary: '#ec4899',
            bg: '#0a0a0a',
            text: '#ffffff',
            card: 'rgba(30,20,40,0.8)'
        };
    } else if (isPurple) {
        requirements.theme = {
            name: 'purple',
            primary: '#9333ea',
            secondary: '#ec4899',
            bg: '#faf5ff',
            text: '#1a1a2e',
            card: '#f3e8ff'
        };
    } else if (isBlue && isDark) {
        requirements.theme = {
            name: 'blue-dark',
            primary: '#3b82f6',
            secondary: '#06b6d4',
            bg: '#0a0a0a',
            text: '#ffffff',
            card: 'rgba(20,30,40,0.8)'
        };
    } else if (isBlue) {
        requirements.theme = {
            name: 'blue',
            primary: '#3b82f6',
            secondary: '#06b6d4',
            bg: '#eff6ff',
            text: '#1a1a2e',
            card: '#dbeafe'
        };
    } else if (isRed && isDark) {
        requirements.theme = {
            name: 'red-dark',
            primary: '#ef4444',
            secondary: '#f97316',
            bg: '#0a0a0a',
            text: '#ffffff',
            card: 'rgba(40,20,20,0.8)'
        };
    } else if (isRed) {
        requirements.theme = {
            name: 'red',
            primary: '#ef4444',
            secondary: '#f97316',
            bg: '#fef2f2',
            text: '#1a1a2e',
            card: '#fee2e2'
        };
    } else if (isGreen && isDark) {
        requirements.theme = {
            name: 'green-dark',
            primary: '#22c55e',
            secondary: '#10b981',
            bg: '#0a0a0a',
            text: '#ffffff',
            card: 'rgba(20,40,30,0.8)'
        };
    } else if (isGreen) {
        requirements.theme = {
            name: 'green',
            primary: '#22c55e',
            secondary: '#10b981',
            bg: '#f0fdf4',
            text: '#1a1a2e',
            card: '#dcfce7'
        };
    } else if (isDark) {
        requirements.theme = {
            name: 'dark',
            primary: '#00f5a0',
            secondary: '#00d9f5',
            bg: '#000000',
            text: '#ffffff',
            card: 'rgba(20,20,30,0.8)'
        };
    } else {
        requirements.theme = {
            name: 'light',
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            bg: '#ffffff',
            text: '#1a1a2e',
            card: '#f8fafc'
        };
    }

    // Detect features
    if (p.indexOf('animation') >= 0 || p.indexOf('animated') >= 0 || p.indexOf('dynamic') >= 0) {
        requirements.animations = true;
        requirements.features.push('animations');
    }
    if (p.indexOf('cart') >= 0 || p.indexOf('shopping') >= 0) requirements.features.push('cart');
    if (p.indexOf('checkout') >= 0) requirements.features.push('checkout');
    if (p.indexOf('payment') >= 0) requirements.features.push('payment');
    if (p.indexOf('auth') >= 0 || p.indexOf('login') >= 0 || p.indexOf('register') >= 0) requirements.features.push('authentication');
    if (p.indexOf('form') >= 0 || p.indexOf('contact') >= 0) requirements.features.push('forms');
    if (p.indexOf('chart') >= 0 || p.indexOf('graph') >= 0 || p.indexOf('analytics') >= 0) requirements.features.push('charts');
    if (p.indexOf('search') >= 0) requirements.features.push('search');
    if (p.indexOf('filter') >= 0) requirements.features.push('filter');
    if (p.indexOf('responsive') >= 0) requirements.features.push('responsive');
    if (p.indexOf('seo') >= 0) requirements.features.push('seo');

    // Detect count (unlimited)
    var countMatch = prompt.match(/(\d+)|(one|two|three|four|five|six|seven|eight|nine|ten|10|12|15|20)/i);
    if (countMatch) {
        var num = parseInt(countMatch[1]) || 0;
        if (num > 0) {
            requirements.count.items = num;
            requirements.count.services = num;
            requirements.count.projects = num;
        } else {
            var words = { 'one':1, 'two':2, 'three':3, 'four':4, 'five':5, 'six':6, 'seven':7, 'eight':8, 'nine':9, 'ten':10 };
            var wordCount = words[countMatch[2].toLowerCase()] || 3;
            requirements.count.items = wordCount;
            requirements.count.services = wordCount;
            requirements.count.projects = wordCount;
        }
    }

    // Set defaults if nothing specified
    if (requirements.pages.length === 0) {
        requirements.pages = ['home', 'about', 'services', 'contact'];
    }

    return requirements;
}

// ============================================
// COMPLETE WEBSITE GENERATION ENGINE
// ============================================

function generateCompleteWebsite(requirements, websiteName) {
    var html = '';
    var css = '';
    var js = '';
    var files = {};

    // Generate HTML/CSS/JS (only supported stack)
    html = generateHTML(requirements, websiteName);
    css = generateCSS(requirements);
    js = generateJavaScript(requirements);

    files = {
        'index.html': { type: 'file', content: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n' + css + '\n  </style>\n</head>\n<body>\n' + html + '\n  <script>\n' + js + '\n  <\/script>\n</body>\n</html>' },
        'style.css': { type: 'file', content: css },
        'script.js': { type: 'file', content: js }
    };

    return { html: html, css: css, js: js, files: files };
}

function generateHTML(requirements, websiteName) {
    var theme = requirements.theme;
    var html = '';

    // Navigation
    html += '<nav class="navbar">\n';
    html += '  <div class="container">\n';
    html += '    <a href="#home" class="logo">⚡ ' + websiteName + '</a>\n';
    html += '    <ul class="nav-links">\n';
    
    var navItems = requirements.pages.slice(0, 6); // Max 6 nav items
    for (var i = 0; i < navItems.length; i++) {
        var page = navItems[i];
        html += '      <li><a href="#' + page + '">' + page.charAt(0).toUpperCase() + page.slice(1) + '</a></li>\n';
    }
    
    // Add cart icon for ecommerce
    if (requirements.websiteType === 'ecommerce') {
        html += '      <li><a href="#cart" class="cart-icon">🛒 Cart <span class="cart-count">0</span></a></li>\n';
    }
    
    html += '    </ul>\n';
    html += '  </div>\n';
    html += '</nav>\n\n';

    // Home/Hero Section
    if (requirements.pages.indexOf('home') >= 0 || true) {
        html += '<section class="hero" id="home">\n';
        html += '  <div class="container">\n';
        html += '    <div class="hero-content">\n';
        
        if (requirements.websiteType === 'portfolio') {
            html += '      <h1 class="hero-title">Hi, I\'m <span class="highlight">' + websiteName + '</span></h1>\n';
            html += '      <p class="hero-subtitle">Professional Developer & Designer</p>\n';
            html += '      <p class="hero-desc">I create beautiful, functional websites and applications that help businesses grow.</p>\n';
        } else if (requirements.websiteType === 'ecommerce') {
            html += '      <h1 class="hero-title">Welcome to <span class="highlight">' + websiteName + '</span></h1>\n';
            html += '      <p class="hero-subtitle">Your One-Stop Shopping Destination</p>\n';
            html += '      <p class="hero-desc">Discover amazing products at unbeatable prices with fast shipping and secure checkout.</p>\n';
            html += '      <div class="hero-buttons">\n';
            html += '        <a href="#products" class="btn btn-primary">Shop Now</a>\n';
            html += '        <a href="#contact" class="btn btn-secondary">Contact Us</a>\n';
            html += '      </div>\n';
        } else if (requirements.websiteType === 'landing') {
            html += '      <span class="hero-badge">🚀 Launching Soon</span>\n';
            html += '      <h1 class="hero-title">Build Something <span class="highlight">Amazing</span></h1>\n';
            html += '      <p class="hero-subtitle">The all-in-one platform for your business</p>\n';
        } else {
            html += '      <h1 class="hero-title">Welcome to <span class="highlight">' + websiteName + '</span></h1>\n';
            html += '      <p class="hero-subtitle">Professional Solutions for Your Business</p>\n';
            html += '      <p class="hero-desc">We deliver excellence and innovation to help you succeed.</p>\n';
        }
        
        if (requirements.websiteType !== 'ecommerce') {
            html += '      <div class="hero-buttons">\n';
            html += '        <a href="#services" class="btn btn-primary">Get Started</a>\n';
            html += '        <a href="#contact" class="btn btn-secondary">Contact Us</a>\n';
            html += '      </div>\n';
        }
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Products Section (E-commerce)
    if (requirements.websiteType === 'ecommerce' || requirements.pages.indexOf('products') >= 0) {
        var productCount = requirements.count.items || 8;
        var productImages = ['📱', '💻', '🎧', '⌚', '📷', '🎮', '👟', '👜', '🕶️', '🎒'];
        var productNames = ['Smartphone Pro', 'Laptop Ultra', 'Wireless Headphones', 'Smart Watch', 'Camera 4K', 'Gaming Console', 'Running Shoes', 'Designer Bag', 'Sunglasses', 'Travel Backpack'];
        var productPrices = ['$699', '$1299', '$199', '$299', '$899', '$499', '$129', '$159', '$89', '$79'];
        
        html += '<section class="section" id="products">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Featured Products</h2>\n';
        html += '    <div class="products-grid">\n';
        
        for (var i = 0; i < productCount; i++) {
            html += '      <div class="product-card">\n';
            html += '        <div class="product-image"><span class="product-placeholder">' + productImages[i % productImages.length] + '</span></div>\n';
            html += '        <div class="product-info">\n';
            html += '          <h3>' + productNames[i % productNames.length] + '</h3>\n';
            html += '          <p class="product-price">' + productPrices[i % productPrices.length] + '</p>\n';
            html += '          <button class="btn btn-primary btn-add-cart" onclick="addToCart()">Add to Cart</button>\n';
            html += '        </div>\n';
            html += '      </div>\n';
        }
        
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Cart Section (E-commerce)
    if (requirements.websiteType === 'ecommerce' || requirements.features.indexOf('cart') >= 0) {
        html += '<section class="section section-alt" id="cart">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Shopping Cart</h2>\n';
        html += '    <div class="cart-container">\n';
        html += '      <div class="cart-items">\n';
        html += '        <div class="cart-item">\n';
        html += '          <span class="cart-item-image">📱</span>\n';
        html += '          <div class="cart-item-details">\n';
        html += '            <h4>Smartphone Pro</h4>\n';
        html += '            <p class="cart-item-price">$699</p>\n';
        html += '          </div>\n';
        html += '          <button class="btn-remove">Remove</button>\n';
        html += '        </div>\n';
        html += '      </div>\n';
        html += '      <div class="cart-summary">\n';
        html += '        <h3>Order Summary</h3>\n';
        html += '        <div class="summary-row"><span>Subtotal:</span><span>$699</span></div>\n';
        html += '        <div class="summary-row"><span>Shipping:</span><span>$10</span></div>\n';
        html += '        <div class="summary-row"><span>Tax:</span><span>$56</span></div>\n';
        html += '        <div class="summary-row total"><span>Total:</span><span>$765</span></div>\n';
        html += '        <button class="btn btn-primary btn-full" onclick="checkout()">Proceed to Checkout</button>\n';
        html += '      </div>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Checkout Section
    if (requirements.features.indexOf('checkout') >= 0 || requirements.pages.indexOf('checkout') >= 0) {
        html += '<section class="section" id="checkout">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Checkout</h2>\n';
        html += '    <div class="checkout-grid">\n';
        html += '      <div class="checkout-form">\n';
        html += '        <h3>Shipping Information</h3>\n';
        html += '        <div class="form-group"><input type="text" placeholder="Full Name" required></div>\n';
        html += '        <div class="form-group"><input type="email" placeholder="Email" required></div>\n';
        html += '        <div class="form-group"><input type="text" placeholder="Address" required></div>\n';
        html += '        <div class="form-row">\n';
        html += '          <div class="form-group"><input type="text" placeholder="City" required></div>\n';
        html += '          <div class="form-group"><input type="text" placeholder="ZIP Code" required></div>\n';
        html += '        </div>\n';
        html += '        <h3>Payment Information</h3>\n';
        html += '        <div class="form-group"><input type="text" placeholder="Card Number" required></div>\n';
        html += '        <div class="form-row">\n';
        html += '          <div class="form-group"><input type="text" placeholder="MM/YY" required></div>\n';
        html += '          <div class="form-group"><input type="text" placeholder="CVV" required></div>\n';
        html += '        </div>\n';
        html += '        <button class="btn btn-primary btn-full" onclick="placeOrder()">Place Order</button>\n';
        html += '      </div>\n';
        html += '      <div class="order-summary">\n';
        html += '        <h3>Order Summary</h3>\n';
        html += '        <div class="summary-row"><span>Subtotal:</span><span>$699</span></div>\n';
        html += '        <div class="summary-row"><span>Shipping:</span><span>$10</span></div>\n';
        html += '        <div class="summary-row total"><span>Total:</span><span>$765</span></div>\n';
        html += '      </div>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // About Section
    if (requirements.pages.indexOf('about') >= 0) {
        html += '<section class="section" id="about">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">About Us</h2>\n';
        html += '    <div class="about-content">\n';
        html += '      <p>We are a team of passionate professionals dedicated to delivering exceptional results. With years of experience in the industry, we understand what it takes to succeed.</p>\n';
        html += '      <p>Our mission is to provide innovative solutions that help our clients achieve their goals and stay ahead of the competition.</p>\n';
        html += '      <div class="skills">\n';
        html += '        <span class="skill-tag">Strategy</span>\n';
        html += '        <span class="skill-tag">Design</span>\n';
        html += '        <span class="skill-tag">Development</span>\n';
        html += '        <span class="skill-tag">Marketing</span>\n';
        html += '      </div>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Services Section
    if (requirements.pages.indexOf('services') >= 0) {
        var serviceCount = requirements.count.services || 10;
        var serviceIcons = ['🎨', '💻', '📱', '🚀', '⚡', '🔧', '📊', '🎯', '💡', '🎬', '🎵', '🎮'];
        var serviceTitles = ['Web Design', 'Development', 'Mobile App', 'SEO', 'Marketing', 'Support', 'Analytics', 'Consulting', 'Innovation', 'Video', 'Music', 'Gaming'];
        var serviceDescs = ['Beautiful, modern designs', 'Robust technical solutions', 'Cross-platform mobile apps', 'Search engine optimization', 'Digital marketing campaigns', '24/7 customer support', 'Data analytics & insights', 'Business consulting', 'Creative innovation', 'Video production', 'Music streaming', 'Gaming platforms'];
        
        html += '<section class="section" id="services">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Our Services</h2>\n';
        html += '    <div class="services-grid">\n';
        
        for (var i = 0; i < serviceCount; i++) {
            html += '      <div class="service-card">\n';
            html += '        <span class="service-icon">' + serviceIcons[i % serviceIcons.length] + '</span>\n';
            html += '        <h3>' + serviceTitles[i % serviceTitles.length] + '</h3>\n';
            html += '        <p>' + serviceDescs[i % serviceDescs.length] + '</p>\n';
            html += '      </div>\n';
        }
        
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Projects Section
    if (requirements.pages.indexOf('projects') >= 0) {
        var projectCount = requirements.count.projects || 6;
        var projectPlaceholders = ['📱', '💼', '🎨', '🛒', '🎮', '📊', '🎬', '🎵'];
        var projectTitles = ['E-Commerce App', 'Business Dashboard', 'Design System', 'Shopping Platform', 'Gaming App', 'Analytics Tool', 'Video Platform', 'Music App'];
        var projectDescs = ['Modern online shopping', 'Business analytics', 'UI component library', 'E-commerce solution', 'Gaming platform', 'Data visualization', 'Video streaming', 'Music streaming'];
        
        html += '<section class="section section-alt" id="projects">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Featured Projects</h2>\n';
        html += '    <div class="projects-grid">\n';
        
        for (var i = 0; i < projectCount; i++) {
            html += '      <div class="project-card">\n';
            html += '        <div class="project-image"><span class="project-placeholder">' + projectPlaceholders[i % projectPlaceholders.length] + '</span></div>\n';
            html += '        <div class="project-content">\n';
            html += '          <h3>' + projectTitles[i % projectTitles.length] + '</h3>\n';
            html += '          <p>' + projectDescs[i % projectDescs.length] + '</p>\n';
            html += '        </div>\n';
            html += '      </div>\n';
        }
        
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Contact Section
    if (requirements.pages.indexOf('contact') >= 0) {
        html += '<section class="section section-alt" id="contact">\n';
        html += '  <div class="container">\n';
        html += '    <h2 class="section-title">Get In Touch</h2>\n';
        html += '    <div class="contact-grid">\n';
        html += '      <div class="contact-info">\n';
        html += '        <h3>Contact ' + websiteName + '</h3>\n';
        html += '        <p>Ready to start your project? We would love to hear from you!</p>\n';
        html += '        <div class="contact-details">\n';
        html += '          <div class="contact-item">📧 hello@example.com</div>\n';
        html += '          <div class="contact-item">📍 123 Business Street</div>\n';
        html += '          <div class="contact-item">📱 +1 234 567 890</div>\n';
        html += '        </div>\n';
        html += '      </div>\n';
        html += '      <form class="contact-form" onsubmit="event.preventDefault(); alert(\'Message sent! We will get back to you soon.\');">\n';
        html += '        <div class="form-group"><input type="text" placeholder="Your Name" required></div>\n';
        html += '        <div class="form-group"><input type="email" placeholder="Your Email" required></div>\n';
        html += '        <div class="form-group"><textarea placeholder="Your Message" rows="4" required></textarea></div>\n';
        html += '        <button type="submit" class="btn btn-primary btn-full">Send Message</button>\n';
        html += '      </form>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '</section>\n\n';
    }

    // Footer
    html += '<footer>\n';
    html += '  <div class="container">\n';
    html += '    <p>&copy; 2024 ' + websiteName + '. All rights reserved.</p>\n';
    html += '  </div>\n';
    html += '</footer>\n';

    return html;
}

function generateCSS(requirements) {
    var theme = requirements.theme;
    var css = '';

    // Reset & Base
    css += '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n';
css += 'html {\n  scroll-behavior: smooth;\n}\n\n';
    css += 'body {\n  font-family: "Segoe UI", sans-serif;\n  background: ' + theme.bg + ';\n  color: ' + theme.text + ';\n  line-height: 1.6;\n  overflow-x: hidden;\n}\n\n';
    css += '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n';

    // Animations
    if (requirements.animations) {
        css += '@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(30px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n';
        css += '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n';
        css += '@keyframes slideIn {\n  from { transform: translateX(-50px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}\n\n';
        css += '@keyframes float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}\n\n';
        css += '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}\n\n';
        css += '@keyframes gradient {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n';
    }

    // Navigation
    css += '.navbar {\n  position: fixed;\n  top: 0;\n  width: 100%;\n  padding: 20px 0;\n  background: ' + theme.bg + ';\n  backdrop-filter: blur(10px);\n  z-index: 1000;\n  border-bottom: 1px solid ' + theme.primary + '33;\n}\n\n';
    css += '.navbar .container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n';
    css += '.logo {\n  font-size: 24px;\n  font-weight: 700;\n  color: ' + theme.primary + ';\n  text-decoration: none;\n  transition: all 0.3s;\n}\n\n';
    css += '.logo:hover {\n  transform: scale(1.05);\n  opacity: 0.8;\n}\n\n';
    css += '.nav-links {\n  display: flex;\n  gap: 30px;\n  list-style: none;\n}\n\n';
    css += '.nav-links a {\n  color: ' + theme.text + ';\n  text-decoration: none;\n  transition: color 0.3s;\n}\n\n';
    css += '.nav-links a:hover {\n  color: ' + theme.primary + ';\n}\n\n';

    // Hero Section
    css += '.hero {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  padding: 120px 20px 80px;\n  background: radial-gradient(ellipse at 50% 50%, ' + theme.primary + '15 0%, transparent 70%);\n}\n\n';
    css += '.hero-content {\n  max-width: 600px;\n  animation: fadeInUp 1s ease;\n}\n\n';
    css += '.hero-badge {\n  display: inline-block;\n  padding: 8px 16px;\n  background: linear-gradient(135deg, ' + theme.primary + ', ' + theme.secondary + ');\n  border-radius: 20px;\n  font-size: 14px;\n  margin-bottom: 20px;\n  animation: pulse 2s infinite;\n}\n\n';
    css += '.hero-title {\n  font-size: 48px;\n  margin-bottom: 20px;\n  line-height: 1.2;\n  animation: slideIn 1s ease 0.2s both;\n}\n\n';
    css += '.highlight {\n  background: linear-gradient(135deg, ' + theme.primary + ', ' + theme.secondary + ');\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  background-size: 200% 200%;\n  animation: gradient 3s ease infinite;\n}\n\n';
    css += '.hero-subtitle {\n  font-size: 20px;\n  color: ' + theme.text + ';\n  margin-bottom: 15px;\n  animation: fadeIn 1s ease 0.4s both;\n}\n\n';
    css += '.hero-desc {\n  color: ' + theme.text + ';\n  margin-bottom: 30px;\n  animation: fadeIn 1s ease 0.6s both;\n}\n\n';
    css += '.hero-buttons {\n  display: flex;\n  gap: 15px;\n  flex-wrap: wrap;\n  margin-top: 20px;\n  animation: fadeInUp 1s ease 0.8s both;\n}\n\n';

    // Buttons
    css += '.btn {\n  padding: 14px 28px;\n  border-radius: 10px;\n  text-decoration: none;\n  font-weight: 600;\n  transition: all 0.3s;\n  display: inline-block;\n  cursor: pointer;\n  border: none;\n}\n\n';
    css += '.btn-primary {\n  background: linear-gradient(135deg, ' + theme.primary + ', ' + theme.secondary + ');\n  color: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? '#0a0a0a' : '#ffffff') + ';\n  background-size: 200% 200%;\n}\n\n';
    css += '.btn-primary:hover {\n  animation: gradient 2s ease;\n  transform: translateY(-2px);\n  box-shadow: 0 10px 30px ' + theme.primary + '40;\n}\n\n';
    css += '.btn-secondary {\n  border: 2px solid ' + theme.primary + ';\n  color: ' + theme.primary + ';\n  background: transparent;\n}\n\n';
    css += '.btn-secondary:hover {\n  background: ' + theme.primary + ';\n  color: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? '#0a0a0a' : '#ffffff') + ';\n  transform: translateY(-2px);\n}\n\n';

    // Sections
    css += '.section {\n  padding: 100px 20px;\n}\n\n';
    css += '.section-alt {\n  background: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? 'rgba(255,255,255,0.02)' : '#f8fafc') + ';\n}\n\n';
    css += '.section-title {\n  font-size: 36px;\n  text-align: center;\n  margin-bottom: 60px;\n}\n\n';

    // Services Grid
    css += '.services-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 30px;\n}\n\n';
    css += '.service-card {\n  text-align: center;\n  padding: 40px 30px;\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  border: 1px solid ' + theme.primary + '33;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n';
    css += '.service-card:nth-child(1) { animation-delay: 0.1s; }\n';
    css += '.service-card:nth-child(2) { animation-delay: 0.2s; }\n';
    css += '.service-card:nth-child(3) { animation-delay: 0.3s; }\n';
    css += '.service-card:nth-child(4) { animation-delay: 0.4s; }\n';
    css += '.service-card:nth-child(5) { animation-delay: 0.5s; }\n';
    css += '.service-card:nth-child(6) { animation-delay: 0.6s; }\n';
    css += '.service-card:nth-child(7) { animation-delay: 0.7s; }\n';
    css += '.service-card:nth-child(8) { animation-delay: 0.8s; }\n';
    css += '.service-card:hover {\n  transform: translateY(-10px) scale(1.02);\n  border-color: ' + theme.primary + ';\n  box-shadow: 0 20px 40px ' + theme.primary + '30;\n}\n\n';
    css += '.service-icon {\n  font-size: 48px;\n  margin-bottom: 20px;\n  display: block;\n  animation: float 3s ease-in-out infinite;\n}\n\n';
    css += '.service-card h3 {\n  margin-bottom: 15px;\n}\n\n';
    css += '.service-card p {\n  color: ' + theme.text + ';\n}\n\n';

    // Projects Grid
    css += '.projects-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 30px;\n}\n\n';
    css += '.project-card {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  overflow: hidden;\n  border: 1px solid ' + theme.primary + '33;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n';
    css += '.project-card:nth-child(1) { animation-delay: 0.1s; }\n';
    css += '.project-card:nth-child(2) { animation-delay: 0.2s; }\n';
    css += '.project-card:nth-child(3) { animation-delay: 0.3s; }\n';
    css += '.project-card:nth-child(4) { animation-delay: 0.4s; }\n';
    css += '.project-card:nth-child(5) { animation-delay: 0.5s; }\n';
    css += '.project-card:nth-child(6) { animation-delay: 0.6s; }\n';
    css += '.project-card:hover {\n  transform: translateY(-15px) scale(1.02);\n  box-shadow: 0 25px 50px ' + theme.primary + '30;\n}\n\n';
    css += '.project-image {\n  height: 200px;\n  background: linear-gradient(135deg, ' + theme.primary + ', ' + theme.secondary + ');\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-size: 200% 200%;\n  animation: gradient 3s ease infinite;\n}\n\n';
    css += '.project-placeholder {\n  font-size: 64px;\n}\n\n';
    css += '.project-content {\n  padding: 25px;\n}\n\n';
    css += '.project-content h3 {\n  margin-bottom: 10px;\n}\n\n';
    css += '.project-content p {\n  color: ' + theme.text + ';\n  margin-bottom: 15px;\n}\n\n';

    // Contact
    css += '.contact-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 60px;\n}\n\n';
    css += '.contact-info h3 {\n  margin-bottom: 15px;\n}\n\n';
    css += '.contact-info p {\n  color: ' + theme.text + ';\n  margin-bottom: 30px;\n}\n\n';
    css += '.contact-details {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n';
    css += '.contact-item {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n\n';
    css += '.contact-form {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n';
    css += '.form-group input,\n.form-group textarea {\n  width: 100%;\n  padding: 15px;\n  background: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? 'rgba(0,0,0,0.3)' : '#ffffff') + ';\n  border: 1px solid ' + theme.primary + '33;\n  border-radius: 10px;\n  color: ' + theme.text + ';\n  font-family: inherit;\n  font-size: 16px;\n}\n\n';
    css += '.form-group input:focus,\n.form-group textarea:focus {\n  outline: none;\n  border-color: ' + theme.primary + ';\n}\n\n';
    css += '.btn-full {\n  width: 100%;\n}\n\n';

    // Footer
    css += 'footer {\n  padding: 40px 20px;\n  text-align: center;\n  color: ' + theme.text + ';\n  border-top: 1px solid ' + theme.primary + '33;\n}\n\n';

    // Skills
    css += '.skills {\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin-top: 20px;\n}\n\n';
    css += '.skill-tag {\n  padding: 8px 16px;\n  background: ' + theme.primary + '20;\n  color: ' + theme.primary + ';\n  border-radius: 20px;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n\n';
    css += '.skill-tag:hover {\n  transform: scale(1.1);\n  background: ' + theme.primary + '40;\n}\n\n';

    // Responsive
    css += '@media (max-width: 768px) {\n';
    css += '  .hero-title { font-size: 32px; }\n';
    css += '  .hero-subtitle { font-size: 18px; }\n';
    css += '  .hero { flex-direction: column; text-align: center; padding-top: 100px; }\n';
    css += '  .hero-buttons { justify-content: center; }\n';
    css += '  .contact-grid, .projects-grid, .services-grid { grid-template-columns: 1fr; }\n';
    css += '  .nav-links { display: none; }\n';
    css += '  .section { padding: 60px 15px; }\n';
    css += '  .section-title { font-size: 28px; }\n';
    css += '}\n';

    // Products
    css += '.products-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 30px;\n}\n\n';
    css += '.product-card {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  overflow: hidden;\n  border: 1px solid ' + theme.primary + '33;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n';
    css += '.product-card:nth-child(1) { animation-delay: 0.1s; }\n';
    css += '.product-card:nth-child(2) { animation-delay: 0.2s; }\n';
    css += '.product-card:nth-child(3) { animation-delay: 0.3s; }\n';
    css += '.product-card:nth-child(4) { animation-delay: 0.4s; }\n';
    css += '.product-card:nth-child(5) { animation-delay: 0.5s; }\n';
    css += '.product-card:nth-child(6) { animation-delay: 0.6s; }\n';
    css += '.product-card:nth-child(7) { animation-delay: 0.7s; }\n';
    css += '.product-card:nth-child(8) { animation-delay: 0.8s; }\n';
    css += '.product-card:hover {\n  transform: translateY(-10px) scale(1.02);\n  border-color: ' + theme.primary + ';\n  box-shadow: 0 20px 40px ' + theme.primary + '30;\n}\n\n';
    css += '.product-image {\n  height: 200px;\n  background: linear-gradient(135deg, ' + theme.primary + ', ' + theme.secondary + ');\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-size: 200% 200%;\n  animation: gradient 3s ease infinite;\n}\n\n';
    css += '.product-placeholder {\n  font-size: 64px;\n}\n\n';
    css += '.product-info {\n  padding: 20px;\n}\n\n';
    css += '.product-info h3 {\n  margin-bottom: 10px;\n  font-size: 18px;\n}\n\n';
    css += '.product-price {\n  font-size: 24px;\n  font-weight: 700;\n  color: ' + theme.primary + ';\n  margin-bottom: 15px;\n}\n\n';
    css += '.btn-add-cart {\n  width: 100%;\n  margin-top: 10px;\n}\n\n';

    // Cart
    css += '.cart-container {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 40px;\n}\n\n';
    css += '.cart-items {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  padding: 30px;\n  border: 1px solid ' + theme.primary + '33;\n}\n\n';
    css += '.cart-item {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  padding: 20px;\n  background: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? 'rgba(0,0,0,0.3)' : '#ffffff') + ';\n  border-radius: 10px;\n  margin-bottom: 20px;\n}\n\n';
    css += '.cart-item-image {\n  font-size: 48px;\n}\n\n';
    css += '.cart-item-details {\n  flex: 1;\n}\n\n';
    css += '.cart-item-details h4 {\n  margin-bottom: 5px;\n}\n\n';
    css += '.cart-item-price {\n  color: ' + theme.primary + ';\n  font-weight: 700;\n}\n\n';
    css += '.btn-remove {\n  background: rgba(255, 71, 87, 0.1);\n  border: 1px solid var(--error);\n  color: var(--error);\n  padding: 8px 16px;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\n';
    css += '.btn-remove:hover {\n  background: var(--error);\n  color: #fff;\n}\n\n';
    css += '.cart-summary {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  padding: 30px;\n  border: 1px solid ' + theme.primary + '33;\n  height: fit-content;\n}\n\n';
    css += '.cart-summary h3 {\n  margin-bottom: 20px;\n}\n\n';
    css += '.summary-row {\n  display: flex;\n  justify-content: space-between;\n  padding: 10px 0;\n  border-bottom: 1px solid ' + theme.primary + '33;\n}\n\n';
    css += '.summary-row.total {\n  border-bottom: none;\n  font-size: 20px;\n  font-weight: 700;\n  color: ' + theme.primary + ';\n}\n\n';

    // Checkout
    css += '.checkout-grid {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 40px;\n}\n\n';
    css += '.checkout-form {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  padding: 30px;\n  border: 1px solid ' + theme.primary + '33;\n}\n\n';
    css += '.checkout-form h3 {\n  margin: 20px 0 15px;\n}\n\n';
    css += '.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 15px;\n}\n\n';
    css += '.order-summary {\n  background: ' + theme.card + ';\n  border-radius: 15px;\n  padding: 30px;\n  border: 1px solid ' + theme.primary + '33;\n  height: fit-content;\n}\n\n';
    css += '.order-summary h3 {\n  margin-bottom: 20px;\n}\n\n';

    // Cart Icon
    css += '.cart-icon {\n  position: relative;\n}\n\n';
    css += '.cart-count {\n  position: absolute;\n  top: -8px;\n  right: -15px;\n  background: ' + theme.primary + ';\n  color: ' + (theme.bg === '#000000' || theme.bg === '#0a0a0a' ? '#0a0a0a' : '#ffffff') + ';\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 10px;\n  font-weight: 700;\n}\n\n';

    return css;
}

function generateJavaScript(requirements) {
    var js = '';

    js += '// Smooth scroll for navigation links\n';
    js += 'document.querySelectorAll(\'a[href^="#"]\').forEach(function(anchor) {\n';
    js += '  anchor.addEventListener(\'click\', function(e) {\n';
    js += '    e.preventDefault();\n';
    js += '    var target = document.querySelector(this.getAttribute(\'href\'));\n';
    js += '    if (target) {\n';
    js += '      target.scrollIntoView({ behavior: \'smooth\' });\n';
    js += '    }\n';
    js += '  });\n';
    js += '});\n\n';

    js += '// Scroll animations\n';
    js += 'var observer = new IntersectionObserver(function(entries) {\n';
    js += '  entries.forEach(function(entry) {\n';
    js += '    if (entry.isIntersecting) {\n';
    js += '      entry.target.style.opacity = \'1\';\n';
    js += '      entry.target.style.transform = \'translateY(0)\';\n';
    js += '    }\n';
    js += '  });\n';
    js += '}, { threshold: 0.1 });\n\n';

    js += 'document.querySelectorAll(\'.service-card, .project-card, .product-card, .skill-tag\').forEach(function(el) {\n';
    js += '  el.style.opacity = \'0\';\n';
    js += '  el.style.transform = \'translateY(20px)\';\n';
    js += '  observer.observe(el);\n';
    js += '});\n\n';

    js += '// Form submission\n';
    js += 'document.querySelectorAll(\'.contact-form\').forEach(function(form) {\n';
    js += '  form.addEventListener(\'submit\', function(e) {\n';
    js += '    e.preventDefault();\n';
    js += '    alert(\'Thank you! Your message has been sent. We will get back to you soon.\');\n';
    js += '    form.reset();\n';
    js += '  });\n';
    js += '});\n\n';

    // E-commerce functions
    if (requirements.websiteType === 'ecommerce' || requirements.features.indexOf('cart') >= 0) {
        js += '// Shopping Cart\n';
        js += 'var cartCount = 0;\n';
        js += 'var cartTotal = 0;\n\n';
        
        js += 'function addToCart() {\n';
        js += '  cartCount++;\n';
        js += '  cartTotal += Math.random() * 1000;\n';
        js += '  document.querySelector(\'.cart-count\').textContent = cartCount;\n';
        js += '  alert(\'Product added to cart! Total items: \' + cartCount);\n';
        js += '}\n\n';
        
        js += 'function checkout() {\n';
        js += '  if (cartCount === 0) {\n';
        js += '    alert(\'Your cart is empty! Add some products first.\');\n';
        js += '  } else {\n';
        js += '    alert(\'Proceeding to checkout with \' + cartCount + \' items. Total: $\' + cartTotal.toFixed(2));\n';
        js += '    document.querySelector(\'#checkout\').scrollIntoView({ behavior: \'smooth\' });\n';
        js += '  }\n';
        js += '}\n\n';
        
        js += 'function placeOrder() {\n';
        js += '  alert(\'Order placed successfully! Thank you for your purchase. Your order will be delivered soon.\');\n';
        js += '  cartCount = 0;\n';
        js += '  cartTotal = 0;\n';
        js += '  document.querySelector(\'.cart-count\').textContent = \'0\';\n';
        js += '}\n\n';
        
        js += '// Remove from cart\n';
        js += 'document.querySelectorAll(\'.btn-remove\').forEach(function(btn) {\n';
        js += '  btn.addEventListener(\'click\', function() {\n';
        js += '    this.closest(\'.cart-item\').remove();\n';
        js += '    cartCount = Math.max(0, cartCount - 1);\n';
        js += '    document.querySelector(\'.cart-count\').textContent = cartCount;\n';
        js += '  });\n';
        js += '});\n\n';
    }

    return js;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

function generateCode() {
    var prompt = elements.promptInput.value.trim();
    var websiteName = elements.websiteName.value.trim() || 'My Website';

    if (!prompt) {
        showToast('Please enter a prompt', 'error');
        return;
    }

    // Check if prompt is website-related
    if (!isWebsiteRelatedPrompt(prompt)) {
        showRestrictionModal();
        return;
    }

    state.isGenerating = true;
    state.lastPrompt = prompt;
    updateUIForLoading(true);
    updateLoadingStatus('Analyzing requirements...');

    setTimeout(function() {
        try {
            updateLoadingStatus('Parsing prompt...');
            var requirements = parseUserPrompt(prompt);
            
            updateLoadingStatus('Generating complete website...');
            var code = generateCompleteWebsite(requirements, websiteName);
            
            state.generatedCode = code;
            addToHistory(prompt);
            displayCode(code);
            
            updateLoadingStatus('Complete!');
            showToast('Website generated successfully!', 'success');
        } catch (error) {
            console.error('Error details:', error);
            showError(error.message || 'Unknown error occurred');
            showToast('Generation failed: ' + error.message, 'error');
        } finally {
            state.isGenerating = false;
            updateUIForLoading(false);
        }
    }, 2000);
}

function updateUIForLoading(loading) {
    elements.generateBtn.disabled = loading;
    elements.generateBtn.innerHTML = loading
        ? '<span>⏳</span><span>Generating...</span>'
        : '<span>🚀</span><span>Generate Complete Website</span>';
    elements.loadingOverlay.classList.toggle('active', loading);
    elements.emptyState.style.display = loading ? 'none' : 'flex';
    elements.errorState.classList.remove('active');
}

function updateLoadingStatus(status) {
    if (elements.loadingStatus) {
        elements.loadingStatus.textContent = status;
    }
}

function displayCode(code) {
    elements.emptyState.style.display = 'none';
    elements.errorState.classList.remove('active');

    // Set code in viewers
    elements.htmlViewer.value = code.html;
    elements.cssViewer.value = code.css;
    elements.jsViewer.value = code.js;

    // Display file structure
    if (code.files) {
        var structureHtml = '<h3>📁 Project Structure</h3>\n<ul>\n';
        for (var filename in code.files) {
            var file = code.files[filename];
            structureHtml += '  <li><span class="' + file.type + '">' + (file.type === 'folder' ? '📁 ' : '📄 ') + filename + '</span></li>\n';
        }
        structureHtml += '</ul>\n';
        elements.fileStructure.innerHTML = structureHtml;
    }

    // Update preview
    updateLivePreview();

    // Switch to preview tab
    document.querySelectorAll('.tab-btn').forEach(function(btn) { btn.classList.remove('active'); });
    document.querySelector('.tab-btn:first-child').classList.add('active');
    elements.previewContent.classList.add('active');
}

function showError(message) {
    elements.emptyState.style.display = 'none';
    elements.loadingOverlay.classList.remove('active');
    elements.errorState.classList.add('active');
    elements.errorMessage.textContent = message;
}

function retryGenerate() {
    elements.promptInput.value = state.lastPrompt;
    generateCode();
}

function copyCode() {
    if (!state.generatedCode) {
        showToast('No code to copy', 'error');
        return;
    }
    var combined = '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n' + state.generatedCode.css + '\n  </style>\n</head>\n<body>\n' + state.generatedCode.html + '\n  <script>\n' + state.generatedCode.js + '\n  <\/script>\n</body>\n</html>';
    navigator.clipboard.writeText(combined).then(function() {
        showToast('Code copied to clipboard!', 'success');
    }).catch(function() {
        showToast('Code copied!', 'success');
    });
}

function downloadCode() {
    if (!state.generatedCode) {
        showToast('No code to download', 'error');
        return;
    }
    var combined = '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n' + state.generatedCode.css + '\n  </style>\n</head>\n<body>\n' + state.generatedCode.html + '\n  <script>\n' + state.generatedCode.js + '\n  <\/script>\n</body>\n</html>';
    var blob = new Blob([combined], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'website-' + Date.now() + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('File downloaded!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') generateCode();
});

// Initialize
renderHistory();
addLivePreviewListeners();
