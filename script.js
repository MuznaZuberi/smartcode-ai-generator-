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

// State
var state = {
    history: JSON.parse(localStorage.getItem('smartcode_history') || '[]'),
    generatedCode: null,
    isGenerating: false,
    lastPrompt: ''
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
    emptyState: document.getElementById('emptyState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    previewContent: document.getElementById('previewContent'),
    htmlContent: document.getElementById('htmlContent'),
    cssContent: document.getElementById('cssContent'),
    jsContent: document.getElementById('jsContent')
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

    // Show selected content
    if (tab === 'preview') elements.previewContent.classList.add('active');
    else if (tab === 'html') elements.htmlContent.classList.add('active');
    else if (tab === 'css') elements.cssContent.classList.add('active');
    else if (tab === 'js') elements.jsContent.classList.add('active');

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

    var combined = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n' + html + '\n<script>\n' + js + '\n<\/script>\n</body>\n</html>';

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

// Generate website code - returns object with html, css, js
function generateWebsiteCode(prompt) {
    var p = prompt.toLowerCase();

    // Get website name from input or extract from prompt
    var websiteName = elements.websiteName.value.trim();
    if (!websiteName) {
        var nameMatch = prompt.match(/(?:create|make|build)\s+(?:a|an)?\s*(.+?)(?:website|for|with|that|$)/i);
        websiteName = nameMatch && nameMatch[1] ? nameMatch[1].trim() : 'My Website';
    }

    // Detect website type from prompt
    var isPortfolio = p.indexOf('portfolio') >= 0 || p.indexOf('developer') >= 0 || p.indexOf('personal') >= 0 || p.indexOf('resume') >= 0 || p.indexOf('cv') >= 0;
    var isBusiness = p.indexOf('business') >= 0 || p.indexOf('company') >= 0 || p.indexOf('corporate') >= 0 || p.indexOf('agency') >= 0;
    var isLanding = p.indexOf('landing') >= 0 || p.indexOf('product') >= 0 || p.indexOf('app') >= 0 || p.indexOf('startup') >= 0;
    var isEcommerce = p.indexOf('ecommerce') >= 0 || p.indexOf('shop') >= 0 || p.indexOf('store') >= 0;

    // Detect sections from prompt - ONLY if explicitly mentioned
    var hasHome = p.indexOf('home') >= 0;
    var hasAbout = p.indexOf('about') >= 0;
    var hasServices = p.indexOf('service') >= 0 || p.indexOf('offering') >= 0 || p.indexOf('what we do') >= 0;
    var hasAboutUs = p.indexOf('about us') >= 0 || p.indexOf('aboutus') >= 0 || p.indexOf('team') >= 0 || p.indexOf('our story') >= 0;
    var hasContact = p.indexOf('contact') >= 0;
    var hasProjects = p.indexOf('project') >= 0 || p.indexOf('work') >= 0;
    var hasSkills = p.indexOf('skill') >= 0 || p.indexOf('expertise') >= 0 || p.indexOf('abilities') >= 0;
    var hasTestimonials = p.indexOf('testimonial') >= 0 || p.indexOf('review') >= 0;
    var hasPricing = p.indexOf('pricing') >= 0 || p.indexOf('plan') >= 0;
    
    // If no sections specified, use defaults
    if (!hasHome && !hasAbout && !hasServices && !hasAboutUs && !hasContact && !hasProjects && !hasSkills && !hasTestimonials && !hasPricing) {
        hasHome = true;
        hasAbout = true;
        hasServices = true;
        hasContact = true;
    }

    // Detect style preferences
    var isDark = p.indexOf('dark') >= 0 || p.indexOf('black') >= 0;
    var isMinimal = p.indexOf('minimal') >= 0 || p.indexOf('clean') >= 0 || p.indexOf('simple') >= 0;
    var isCreative = p.indexOf('creative') >= 0 || p.indexOf('modern') >= 0 || p.indexOf('unique') >= 0;
    var hasAnimation = p.indexOf('animation') >= 0 || p.indexOf('animated') >= 0 || p.indexOf('dynamic') >= 0;
    var isProfessional = p.indexOf('professional') >= 0 || p.indexOf('business') >= 0 || p.indexOf('corporate') >= 0;

    var primaryColor = isDark ? '#00f5a0' : '#2563eb';
    var secondaryColor = isDark ? '#00d9f5' : '#7c3aed';
    var bgColor = isDark ? '#000000' : '#ffffff';
    var textColor = isDark ? '#ffffff' : '#1a1a2e';
    var navBg = isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)';
    var navBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    var cardBg = isDark ? 'rgba(20,20,30,0.8)' : '#f8fafc';
    var mutedColor = isDark ? '#a0a0b0' : '#666666';

    // Build navigation based on sections
    var navItems = [];
    if (hasHome) navItems.push('Home');
    if (hasAbout) navItems.push('About');
    if (hasServices) navItems.push('Services');
    if (hasAboutUs) navItems.push('About Us');
    if (hasProjects) navItems.push('Projects');
    if (hasSkills) navItems.push('Skills');
    if (hasTestimonials) navItems.push('Testimonials');
    if (hasPricing) navItems.push('Pricing');
    if (hasContact) navItems.push('Contact');

    var navLinks = '';
    for (var i = 0; i < navItems.length; i++) {
        navLinks += '<a href="#' + navItems[i].toLowerCase().replace(/\s+/g, '-') + '" class="nav-link">' + navItems[i] + '</a>';
    }

    // Generate HTML
    var html = '<nav>\n  <div class="container">\n    <a href="#home" class="logo">⚡ ' + websiteName + '</a>\n    <ul class="nav-links">\n      ' + navLinks + '\n    </ul>\n  </div>\n</nav>\n\n';

    // Home/Hero section
    if (isPortfolio) {
        html += '<section class="hero" id="home">\n  <div class="hero-content">\n    <h1 class="hero-title">Hi, I\'m <span class="highlight">' + websiteName + '</span></h1>\n    <p class="hero-subtitle">Professional Developer & Designer</p>\n    <p class="hero-desc">I create beautiful, functional websites and applications that help businesses grow.</p>\n    <div class="hero-buttons">\n      <a href="#about" class="btn btn-primary">View My Work</a>\n      <a href="#contact" class="btn btn-secondary">Contact Me</a>\n    </div>\n  </div>\n</section>\n\n';
    } else if (isLanding) {
        html += '<section class="hero" id="home">\n  <div class="hero-content">\n    <span class="hero-badge">🚀 Launching Soon</span>\n    <h1 class="hero-title">Build Something <span class="highlight">Amazing</span></h1>\n    <p class="hero-subtitle">The all-in-one platform for your business</p>\n    <div class="hero-buttons">\n      <a href="#contact" class="btn btn-primary">Get Started</a>\n    </div>\n  </div>\n</section>\n\n';
    } else {
        html += '<section class="hero" id="home">\n  <div class="hero-content">\n    <h1 class="hero-title">Welcome to <span class="highlight">' + websiteName + '</span></h1>\n    <p class="hero-subtitle">Professional Solutions for Your Business</p>\n    <p class="hero-desc">We deliver excellence and innovation to help you succeed.</p>\n    <div class="hero-buttons">\n      <a href="#services" class="btn btn-primary">Our Services</a>\n      <a href="#contact" class="btn btn-secondary">Contact Us</a>\n    </div>\n  </div>\n</section>\n\n';
    }

    // About section
    if (hasAbout) {
        var aboutHtml = '<section class="section" id="about">\n  <div class="container">\n    <h2 class="section-title">About Me</h2>\n    <div class="about-content">\n      <p>I am a passionate professional with years of experience in creating digital solutions. My expertise spans across multiple technologies and industries.</p>\n      <p>I believe in delivering quality work that exceeds expectations and builds lasting relationships with clients.</p>\n';
        if (hasSkills) {
            aboutHtml += '      <div class="skills">\n        <span class="skill-tag">HTML/CSS</span>\n        <span class="skill-tag">JavaScript</span>\n        <span class="skill-tag">React</span>\n        <span class="skill-tag">Node.js</span>\n        <span class="skill-tag">UI/UX Design</span>\n      </div>\n';
        }
        aboutHtml += '    </div>\n  </div>\n</section>\n\n';
        html += aboutHtml;
    }

    // Services section
    if (hasServices) {
        html += '<section class="section" id="services">\n  <div class="container">\n    <h2 class="section-title">My Services</h2>\n    <div class="services-grid">\n      <div class="service-card">\n        <span class="service-icon">🎨</span>\n        <h3>Web Design</h3>\n        <p>Beautiful, modern designs that capture your brand essence</p>\n      </div>\n      <div class="service-card">\n        <span class="service-icon">💻</span>\n        <h3>Development</h3>\n        <p>Robust, scalable solutions using latest technologies</p>\n      </div>\n      <div class="service-card">\n        <span class="service-icon">📱</span>\n        <h3>Responsive</h3>\n        <p>Websites that work perfectly on all devices</p>\n      </div>\n    </div>\n  </div>\n</section>\n\n';
    }

    // About Us section (separate from About)
    if (hasAboutUs) {
        html += '<section class="section section-alt" id="about-us">\n  <div class="container">\n    <h2 class="section-title">About Us</h2>\n    <div class="about-content">\n      <p>We are a team of dedicated professionals committed to delivering exceptional results. Our journey began with a simple mission: to help businesses succeed in the digital world.</p>\n      <p>With years of experience and a passion for innovation, we have helped countless clients achieve their goals.</p>\n      <div class="skills">\n        <span class="skill-tag">Team Work</span>\n        <span class="skill-tag">Innovation</span>\n        <span class="skill-tag">Quality</span>\n        <span class="skill-tag">Support</span>\n      </div>\n    </div>\n  </div>\n</section>\n\n';
    }

    // Projects section
    if (hasProjects) {
        html += '<section class="section section-alt" id="projects">\n  <div class="container">\n    <h2 class="section-title">Featured Projects</h2>\n    <div class="projects-grid">\n      <div class="project-card">\n        <div class="project-image"><span class="project-placeholder">📱</span></div>\n        <div class="project-content">\n          <h3>E-Commerce App</h3>\n          <p>Modern online shopping platform</p>\n        </div>\n      </div>\n      <div class="project-card">\n        <div class="project-image"><span class="project-placeholder">💼</span></div>\n        <div class="project-content">\n          <h3>Business Dashboard</h3>\n          <p>Analytics and management tool</p>\n        </div>\n      </div>\n      <div class="project-card">\n        <div class="project-image"><span class="project-placeholder">🎨</span></div>\n        <div class="project-content">\n          <h3>Design System</h3>\n          <p>Comprehensive UI library</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n\n';
    }

    // Skills section
    if (hasSkills && !hasAbout) {
        html += '<section class="section" id="skills">\n  <div class="container">\n    <h2 class="section-title">My Skills</h2>\n    <div class="skills">\n      <span class="skill-tag">HTML5</span>\n      <span class="skill-tag">CSS3</span>\n      <span class="skill-tag">JavaScript</span>\n      <span class="skill-tag">React</span>\n      <span class="skill-tag">Node.js</span>\n      <span class="skill-tag">Python</span>\n      <span class="skill-tag">UI/UX</span>\n      <span class="skill-tag">Git</span>\n    </div>\n  </div>\n</section>\n\n';
    }

    // Testimonials section
    if (hasTestimonials) {
        html += '<section class="section section-alt" id="testimonials">\n  <div class="container">\n    <h2 class="section-title">Client Testimonials</h2>\n    <div class="services-grid">\n      <div class="service-card">\n        <p>"Excellent work! Delivered beyond expectations."</p>\n        <h4>- John Doe, CEO</h4>\n      </div>\n      <div class="service-card">\n        <p>"Professional, timely, and great communication."</p>\n        <h4>- Jane Smith, Manager</h4>\n      </div>\n      <div class="service-card">\n        <p>"Highly recommended! Will work with again."</p>\n        <h4>- Mike Johnson, Founder</h4>\n      </div>\n    </div>\n  </div>\n</section>\n\n';
    }

    // Pricing section
    if (hasPricing) {
        html += '<section class="section" id="pricing">\n  <div class="container">\n    <h2 class="section-title">Pricing Plans</h2>\n    <div class="services-grid">\n      <div class="service-card">\n        <h3>Basic</h3>\n        <p class="hero-subtitle">$499</p>\n        <p>Perfect for small projects</p>\n      </div>\n      <div class="service-card">\n        <h3>Standard</h3>\n        <p class="hero-subtitle">$999</p>\n        <p>For growing businesses</p>\n      </div>\n      <div class="service-card">\n        <h3>Premium</h3>\n        <p class="hero-subtitle">$1999</p>\n        <p>Enterprise solutions</p>\n      </div>\n    </div>\n  </div>\n</section>\n\n';
    }

    // Contact section
    if (hasContact) {
        html += '<section class="section section-alt" id="contact">\n  <div class="container">\n    <h2 class="section-title">Get In Touch</h2>\n    <div class="contact-grid">\n      <div class="contact-info">\n        <h3>Contact ' + websiteName + '</h3>\n        <p>Ready to start your project? Let\'s talk!</p>\n        <div class="contact-details">\n          <div class="contact-item">📧 hello@example.com</div>\n          <div class="contact-item">📍 123 Business Street</div>\n          <div class="contact-item">📱 +1 234 567 890</div>\n        </div>\n      </div>\n      <form class="contact-form" onsubmit="event.preventDefault(); alert(\'Message sent!\');">\n        <div class="form-group"><input type="text" placeholder="Your Name" required></div>\n        <div class="form-group"><input type="email" placeholder="Your Email" required></div>\n        <div class="form-group"><textarea placeholder="Your Message" rows="4" required></textarea></div>\n        <button type="submit" class="btn btn-primary btn-full">Send Message</button>\n      </form>\n    </div>\n  </div>\n</section>\n\n';
    }

    html += '<footer>\n  <p>&copy; 2024 ' + websiteName + '. All rights reserved.</p>\n</footer>';

    // Generate CSS
    var css = '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n';
    css += '@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(30px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n';
    css += '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n';
    css += '@keyframes slideIn {\n  from { transform: translateX(-50px); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}\n\n';
    css += '@keyframes float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}\n\n';
    css += '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}\n\n';
    css += '@keyframes gradient {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n';
    css += 'html {\n  scroll-behavior: smooth;\n}\n\n';
    css += 'body {\n  font-family: "Segoe UI", sans-serif;\n  background: ' + bgColor + ';\n  color: ' + textColor + ';\n  line-height: 1.6;\n  overflow-x: hidden;\n}\n\n';
    css += '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n';
    css += 'nav {\n  position: fixed;\n  top: 0;\n  width: 100%;\n  padding: 20px 0;\n  background: ' + navBg + ';\n  backdrop-filter: blur(10px);\n  z-index: 1000;\n  border-bottom: 1px solid ' + navBorder + ';\n}\n\n';
    css += 'nav .container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n';
    css += '.logo {\n  font-size: 24px;\n  font-weight: 700;\n  color: ' + primaryColor + ';\n  cursor: pointer;\n  transition: all 0.3s;\n  text-decoration: none;\n}\n\n';
    css += '.logo:hover {\n  transform: scale(1.05);\n  opacity: 0.8;\n}\n\n';
    css += '.nav-links {\n  display: flex;\n  gap: 30px;\n  list-style: none;\n}\n\n';
    css += '.nav-link {\n  color: ' + textColor + ';\n  text-decoration: none;\n  transition: color 0.3s;\n}\n\n';
    css += '.nav-link:hover {\n  color: ' + primaryColor + ';\n}\n\n';
    css += '.hero {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  padding: 100px 20px;\n  background: radial-gradient(ellipse at 50% 50%, rgba(0,245,160,0.1) 0%, transparent 70%);\n}\n\n';
    css += '.hero-content {\n  max-width: 600px;\n  animation: fadeInUp 1s ease;\n}\n\n';
    css += '.hero-badge {\n  display: inline-block;\n  padding: 8px 16px;\n  background: linear-gradient(135deg, ' + primaryColor + ', ' + secondaryColor + ');\n  border-radius: 20px;\n  font-size: 14px;\n  margin-bottom: 20px;\n  animation: pulse 2s infinite;\n}\n\n';
    css += '.hero-title {\n  font-size: 48px;\n  margin-bottom: 20px;\n  line-height: 1.2;\n  animation: slideIn 1s ease 0.2s both;\n}\n\n';
    css += '.highlight {\n  background: linear-gradient(135deg, ' + primaryColor + ', ' + secondaryColor + ');\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  background-size: 200% 200%;\n  animation: gradient 3s ease infinite;\n}\n\n';
    css += '.hero-subtitle {\n  font-size: 20px;\n  color: ' + mutedColor + ';\n  margin-bottom: 15px;\n  animation: fadeIn 1s ease 0.4s both;\n}\n\n';
    css += '.hero-desc {\n  color: ' + mutedColor + ';\n  margin-bottom: 30px;\n  animation: fadeIn 1s ease 0.6s both;\n}\n\n';
    css += '.hero-buttons {\n  display: flex;\n  gap: 15px;\n  flex-wrap: wrap;\n  margin-top: 20px;\n  animation: fadeInUp 1s ease 0.8s both;\n}\n\n';
    css += '.btn {\n  padding: 14px 28px;\n  border-radius: 10px;\n  text-decoration: none;\n  font-weight: 600;\n  transition: all 0.3s;\n  display: inline-block;\n}\n\n';
    css += '.btn-primary {\n  background: linear-gradient(135deg, ' + primaryColor + ', ' + secondaryColor + ');\n  color: ' + (isDark ? '#0a0a0f' : '#ffffff') + ';\n  background-size: 200% 200%;\n}\n\n';
    css += '.btn-primary:hover {\n  animation: gradient 2s ease;\n  transform: translateY(-2px);\n  box-shadow: 0 10px 30px rgba(0,245,160,0.3);\n}\n\n';
    css += '.btn-secondary {\n  border: 2px solid ' + primaryColor + ';\n  color: ' + primaryColor + ';\n}\n\n';
    css += '.btn-secondary:hover {\n  background: ' + primaryColor + ';\n  color: ' + (isDark ? '#000' : '#fff') + ';\n  transform: translateY(-2px);\n}\n\n';
    css += '.section {\n  padding: 100px 20px;\n}\n\n';
    css += '.section-alt {\n  background: ' + (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc') + ';\n}\n\n';
    css += '.section-title {\n  font-size: 36px;\n  text-align: center;\n  margin-bottom: 60px;\n}\n\n';
    css += '.about-content p {\n  color: ' + mutedColor + ';\n  margin-bottom: 20px;\n}\n\n';
    css += '.skills {\n  display: flex;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin-top: 20px;\n}\n\n';
    css += '.skill-tag {\n  padding: 8px 16px;\n  background: rgba(0,245,160,0.1);\n  color: ' + primaryColor + ';\n  border-radius: 20px;\n  font-size: 14px;\n  transition: all 0.3s;\n}\n\n';
    css += '.skill-tag:hover {\n  transform: scale(1.1);\n  background: rgba(0,245,160,0.2);\n}\n\n';
    css += '.services-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 30px;\n}\n\n';
    css += '.service-card {\n  text-align: center;\n  padding: 40px 30px;\n  background: ' + cardBg + ';\n  border-radius: 15px;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n';
    css += '.service-card:nth-child(1) { animation-delay: 0.1s; }\n';
    css += '.service-card:nth-child(2) { animation-delay: 0.2s; }\n';
    css += '.service-card:nth-child(3) { animation-delay: 0.3s; }\n\n';
    css += '.service-card:hover {\n  transform: translateY(-10px) scale(1.02);\n  border: 1px solid ' + primaryColor + ';\n  box-shadow: 0 20px 40px rgba(0,245,160,0.2);\n}\n\n';
    css += '.service-icon {\n  font-size: 48px;\n  margin-bottom: 20px;\n  display: block;\n  animation: float 3s ease-in-out infinite;\n}\n\n';
    css += '.service-card h3 {\n  margin-bottom: 15px;\n}\n\n';
    css += '.service-card p {\n  color: ' + mutedColor + ';\n}\n\n';
    css += '.projects-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 30px;\n}\n\n';
    css += '.project-card {\n  background: ' + cardBg + ';\n  border-radius: 15px;\n  overflow: hidden;\n  transition: all 0.3s;\n  opacity: 0;\n  animation: fadeInUp 0.6s ease forwards;\n}\n\n';
    css += '.project-card:nth-child(1) { animation-delay: 0.1s; }\n';
    css += '.project-card:nth-child(2) { animation-delay: 0.2s; }\n';
    css += '.project-card:nth-child(3) { animation-delay: 0.3s; }\n\n';
    css += '.project-card:hover {\n  transform: translateY(-15px) scale(1.02);\n  box-shadow: 0 25px 50px rgba(0,245,160,0.25);\n}\n\n';
    css += '.project-image {\n  height: 200px;\n  background: linear-gradient(135deg, ' + primaryColor + ', ' + secondaryColor + ');\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-size: 200% 200%;\n  animation: gradient 3s ease infinite;\n}\n\n';
    css += '.project-placeholder {\n  font-size: 64px;\n}\n\n';
    css += '.project-content {\n  padding: 25px;\n}\n\n';
    css += '.project-content h3 {\n  margin-bottom: 10px;\n}\n\n';
    css += '.project-content p {\n  color: ' + mutedColor + ';\n  margin-bottom: 15px;\n}\n\n';
    css += '.contact-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 60px;\n}\n\n';
    css += '.contact-info h3 {\n  margin-bottom: 15px;\n}\n\n';
    css += '.contact-info p {\n  color: ' + mutedColor + ';\n  margin-bottom: 30px;\n}\n\n';
    css += '.contact-details {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n';
    css += '.contact-item {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n\n';
    css += '.contact-form {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n';
    css += '.form-group input,\n.form-group textarea {\n  width: 100%;\n  padding: 15px;\n  background: ' + (isDark ? 'rgba(0,0,0,0.3)' : '#ffffff') + ';\n  border: 1px solid ' + navBorder + ';\n  border-radius: 10px;\n  color: ' + textColor + ';\n  font-family: inherit;\n  font-size: 16px;\n}\n\n';
    css += '.form-group input:focus,\n.form-group textarea:focus {\n  outline: none;\n  border-color: ' + primaryColor + ';\n}\n\n';
    css += '.btn-full {\n  width: 100%;\n}\n\n';
    css += 'footer {\n  padding: 40px 20px;\n  text-align: center;\n  color: ' + mutedColor + ';\n  border-top: 1px solid ' + navBorder + ';\n}\n\n';
    css += '@media (max-width: 768px) {\n  .hero-title { font-size: 32px; }\n  .hero { flex-direction: column; text-align: center; }\n  .hero-buttons { justify-content: center; }\n  .contact-grid, .projects-grid, .services-grid { grid-template-columns: 1fr; }\n  .nav-links { display: none; }\n}';

    // Generate JavaScript
    var js = '// Smooth scroll for navigation links\ndocument.querySelectorAll(\'a[href^="#"]\').forEach(function(anchor) {\n  anchor.addEventListener(\'click\', function(e) {\n    e.preventDefault();\n    var target = document.querySelector(this.getAttribute(\'href\'));\n    if (target) {\n      target.scrollIntoView({ behavior: \'smooth\' });\n    }\n  });\n});\n\n';
    js += '// Scroll animations\nvar observer = new IntersectionObserver(function(entries) {\n  entries.forEach(function(entry) {\n    if (entry.isIntersecting) {\n      entry.target.style.opacity = \'1\';\n      entry.target.style.transform = \'translateY(0)\';\n    }\n  });\n}, { threshold: 0.1 });\n\n';
    js += 'document.querySelectorAll(\'.service-card, .project-card, .skill-tag\').forEach(function(el) {\n  el.style.opacity = \'0\';\n  el.style.transform = \'translateY(20px)\';\n  observer.observe(el);\n});\n\n';
    js += '// Form submission\ndocument.querySelectorAll(\'.contact-form\').forEach(function(form) {\n  form.addEventListener(\'submit\', function(e) {\n    e.preventDefault();\n    alert(\'Thank you! Your message has been sent.\');\n    form.reset();\n  });\n});';

    return { html: html, css: css, js: js };
}

// Update UI for loading state
function updateUIForLoading(loading) {
    elements.generateBtn.disabled = loading;
    elements.generateBtn.innerHTML = loading
        ? '<span>⏳</span><span>Generating...</span>'
        : '<span>🚀</span><span>Generate Code</span>';
    elements.loadingOverlay.classList.toggle('active', loading);
    elements.emptyState.style.display = loading ? 'none' : 'flex';
    elements.errorState.classList.remove('active');
}

// Display generated code
function displayCode(code) {
    elements.emptyState.style.display = 'none';
    elements.errorState.classList.remove('active');

    // Set code in separate viewers
    elements.htmlViewer.value = code.html;
    elements.cssViewer.value = code.css;
    elements.jsViewer.value = code.js;

    // Update preview
    updateLivePreview();

    // Switch to preview tab
    document.querySelectorAll('.tab-btn').forEach(function(btn) { btn.classList.remove('active'); });
    document.querySelector('.tab-btn:first-child').classList.add('active');
    elements.previewContent.classList.add('active');
    elements.htmlContent.classList.remove('active');
    elements.cssContent.classList.remove('active');
    elements.jsContent.classList.remove('active');
}

// Show error
function showError(message) {
    elements.emptyState.style.display = 'none';
    elements.loadingOverlay.classList.remove('active');
    elements.errorState.classList.add('active');
    elements.errorMessage.textContent = message;
    console.error('Generation error:', message);
}

// Retry generation
function retryGenerate() {
    elements.promptInput.value = state.lastPrompt;
    generateCode();
}

// Main generate function
function generateCode() {
    var prompt = elements.promptInput.value.trim();

    if (!prompt) {
        showToast('Please enter a prompt', 'error');
        return;
    }

    // Check if prompt is website-related
    var websiteKeywords = ['website', 'web', 'site', 'page', 'portfolio', 'business', 'landing', 'blog', 'store', 'shop', 'ecommerce', 'company', 'personal', 'professional', 'design', 'html', 'css', 'javascript', 'code', 'developer', 'create', 'build', 'make', 'home', 'about', 'contact', 'service', 'project', 'skill', 'feature', 'pricing', 'testimonial', 'dark', 'light', 'theme', 'modern', 'responsive', 'animated', 'animation'];
    
    var isWebsiteRelated = false;
    for (var i = 0; i < websiteKeywords.length; i++) {
        if (prompt.toLowerCase().indexOf(websiteKeywords[i]) >= 0) {
            isWebsiteRelated = true;
            break;
        }
    }

    // If website-related keyword found, allow it
    if (isWebsiteRelated) {
        state.isGenerating = true;
        state.lastPrompt = prompt;
        updateUIForLoading(true);

        setTimeout(function() {
            try {
                var code = generateWebsiteCode(prompt);
                state.generatedCode = code;
                addToHistory(prompt);
                displayCode(code);
                showToast('Code generated successfully!', 'success');
            } catch (error) {
                console.error('Error details:', error);
                showError(error.message || 'Unknown error occurred');
                showToast('Generation failed: ' + error.message, 'error');
            } finally {
                state.isGenerating = false;
                updateUIForLoading(false);
            }
        }, 1500);
        return;
    }

    // If no website keyword found, show error
    showToast('This app is only for website-related queries. Please ask about websites, portfolios, business sites, etc.', 'error');
}

// Copy code
function copyCode() {
    if (!state.generatedCode) {
        showToast('No code to copy', 'error');
        return;
    }
    // Combine all code into single HTML file
    var combined = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n' + state.generatedCode.css + '\n</style>\n</head>\n<body>\n' + state.generatedCode.html + '\n<script>\n' + state.generatedCode.js + '\n<\/script>\n</body>\n</html>';

    navigator.clipboard.writeText(combined).then(function() {
        showToast('Code copied to clipboard!', 'success');
    }).catch(function() {
        showToast('Code copied!', 'success');
    });
}

// Download code
function downloadCode() {
    if (!state.generatedCode) {
        showToast('No code to download', 'error');
        return;
    }
    // Combine all code into single HTML file
    var combined = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n' + state.generatedCode.css + '\n</style>\n</head>\n<body>\n' + state.generatedCode.html + '\n<script>\n' + state.generatedCode.js + '\n<\/script>\n</body>\n</html>';

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
