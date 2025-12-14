// ===== Global Variables =====
const API_BASE_URL = '/api';
let currentUser = null;
let currentFontSize = 16; // Base font size in pixels

// ===== Font Size Control =====
function changeFontSize(action) {
    const body = document.body;
    
    if (action === 'increase' && currentFontSize < 20) {
        currentFontSize += 2;
    } else if (action === 'decrease' && currentFontSize > 12) {
        currentFontSize -= 2;
    } else if (action === 'normal') {
        currentFontSize = 16;
    }
    
    body.style.fontSize = currentFontSize + 'px';
    
    // Store preference in localStorage
    try {
        localStorage.setItem('preferredFontSize', currentFontSize);
    } catch (e) {
        console.log('Could not save font size preference');
    }
}

// Load font size preference on page load
function loadFontSizePreference() {
    try {
        const savedSize = localStorage.getItem('preferredFontSize');
        if (savedSize) {
            currentFontSize = parseInt(savedSize);
            document.body.style.fontSize = currentFontSize + 'px';
        }
    } catch (e) {
        console.log('Could not load font size preference');
    }
}
// ===== Page Navigation Function =====
function navigateTo(page) {
    // Map page names to their content sections or show placeholder
    const pageContent = {
        'home': showHomePage,
        'digital-archives': showDigitalArchives,
        'collections': showCollections,
        'gallery': showGalleryPage,
        'research': showResearch,
        'education': showEducation,
        'services': showServices,
        'about': showAbout,
        'contact': showContact,
        'admin-login': showAdminLogin
    };
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show content
    if (pageContent[page]) {
        pageContent[page]();
    } else {
        showPlaceholderPage(page);
    }
}

function showHomePage() {
    window.location.href = 'index.html';
}

function showDigitalArchives() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Digital Archives</h1>
                <p>Search and explore our digitized collection</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="search-container">
                    <h2>Advanced Search</h2>
                    <form class="advanced-search-form" id="advancedSearchForm" onsubmit="return false;">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="searchKeyword">Keyword</label>
                                <input type="text" id="searchKeyword" placeholder="Enter keywords...">
                            </div>
                            <div class="form-group">
                                <label for="searchLanguage">Language</label>
                                <select id="searchLanguage">
                                    <option value="">All Languages</option>
                                    <option value="Meitei">Meitei/Manipuri</option>
                                    <option value="English">English</option>
                                    <option value="Bengali">Bengali</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="searchDateFrom">Date From</label>
                                <input type="date" id="searchDateFrom">
                            </div>
                            <div class="form-group">
                                <label for="searchDateTo">Date To</label>
                                <input type="date" id="searchDateTo">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="searchType">Document Type</label>
                                <select id="searchType">
                                    <option value="">All Types</option>
                                    <option value="Administrative">Administrative Records</option>
                                    <option value="Legal">Legal Documents</option>
                                    <option value="Photographs">Photographs</option>
                                    <option value="Manuscripts">Manuscripts</option>
                                    <option value="Maps">Maps</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="searchCollection">Collection</label>
                                <select id="searchCollection">
                                    <option value="">All Collections</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                </div>
                <div id="searchResults" class="search-results">
                    <p class="text-center">Enter search criteria and click Search to view results</p>
                </div>
            </div>
        </section>
    `;
    
    // Load collections for dropdown
    loadCollectionsForSearch();
    
    // Handle search form
    document.getElementById('advancedSearchForm').addEventListener('submit', handleAdvancedSearch);
}

function showCollections() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Collections</h1>
                <p>Browse our curated collections</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div id="collectionsGrid" class="collections-grid">
                    <div class="loading">Loading collections...</div>
                </div>
            </div>
        </section>
    `;
    
    loadAllCollections();
}

function showResearch() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Research Services</h1>
                <p>Resources and assistance for researchers</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="content-grid">
                    <div class="content-card">
                        <h3><i class="fas fa-book-open"></i> Research Guides</h3>
                        <p>Comprehensive guides on genealogy, local history, land records, and more.</p>
                        <ul class="resource-list">
    <li><a href="#" onclick="showResearchGuides(); return false;">Genealogy Research Guide</a></li>
    <li><a href="#" onclick="showResearchGuides(); return false;">Local History Resources</a></li>
    <li><a href="#" onclick="showResearchGuides(); return false;">Land Records & Property</a></li>
    <li><a href="#" onclick="showResearchGuides(); return false;">Colonial Period Documents</a></li>
</ul>
                    </div>
                    <div class="content-card">
                        <h3><i class="fas fa-search"></i> Finding Aids</h3>
                        <p>Detailed inventories of our archival holdings organized by collection.</p>
                       <a href="#" class="btn btn-secondary" onclick="showFindingAids(); return false;">Browse Finding Aids</a>
                    </div>
                    <div class="content-card">
                        <h3><i class="fas fa-file-alt"></i> Request Research Assistance</h3>
                        <p>Submit a research request and our archivists will help locate relevant materials.</p>
                        <button class="btn btn-primary" onclick="showResearchRequestForm()">Submit Request</button>
                    </div>
                    <div class="content-card">
                        <h3><i class="fas fa-graduation-cap"></i> Reference Tools</h3>
                        <ul class="resource-list">
                            <li><a href="#" onclick="showTimeline(); return false;">Historical Timeline of Manipur</a></li>
                            <li><a href="#" onclick="showGlossary(); return false;">Glossary of Archival Terms</a></li>
                            <li><a href="#" onclick="showScriptGuide(); return false;">Guide to Reading Old Scripts</a></li>
                            <li><a href="#" onclick="showAdminHistory(); return false;">Administrative History</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showEducation() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Educational Resources</h1>
                <p>Learning materials for students and teachers</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="tabs">
                    <button class="tab-btn active" onclick="showEducationTab('students')">For Students</button>
                    <button class="tab-btn" onclick="showEducationTab('teachers')">For Teachers</button>
                    <button class="tab-btn" onclick="showEducationTab('exhibitions')">Virtual Exhibitions</button>
                </div>
               <div id="educationContent" class="tab-content">
                    <h2>For Students</h2>
                    <div class="content-grid">
                        <div class="content-card">
                            <h3>Primary School (Classes 1-5)</h3>
                            <ul class="resource-list">
                                <li><a href="#" onclick="showEducationalResource('stories'); return false;">Stories from Manipur's Past</a></li>
                                <li><a href="#" onclick="showEducationalResource('coloring'); return false;">Historical Coloring Pages</a></li>
                                <li><a href="#" onclick="showEducationalResource('timeline'); return false;">Interactive Timeline</a></li>
                            </ul>
                        </div>
                        <div class="content-card">
                            <h3>Secondary School (Classes 6-10)</h3>
                            <ul class="resource-list">
                                <li><a href="#" onclick="showEducationalResource('freedom'); return false;">Freedom Movement Documents</a></li>
                                <li><a href="#" onclick="showEducationalResource('heritage'); return false;">Cultural Heritage Project Ideas</a></li>
                                <li><a href="#" onclick="showEducationalResource('worksheets'); return false;">Historical Research Worksheets</a></li>
                            </ul>
                        </div>
                        <div class="content-card">
                            <h3>Higher Secondary (Classes 11-12)</h3>
                            <ul class="resource-list">
                                <li><a href="#" onclick="showEducationalResource('analysis'); return false;">Primary Source Analysis</a></li>
                                <li><a href="#" onclick="showEducationalResource('methodology'); return false;">Research Methodology Guide</a></li>
                                <li><a href="#" onclick="showEducationalResource('essays'); return false;">Historical Essays & Papers</a></li>
                            </ul>
                        </div>
                        <div class="content-card">
                            <h3>Virtual Tours</h3>
                            <p>Take a virtual tour of the archives and learn about preservation.</p>
                            <button class="btn btn-secondary" onclick="showVirtualTour()">Start Virtual Tour</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}
function showServices() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Services</h1>
                <p>How we can help you</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="services-grid">
                    <div class="service-card">
                        <i class="fas fa-map-marker-alt service-icon"></i>
                        <h3>Visit Us</h3>
                        <p><strong>Location:</strong> Palace Compound, Imphal, Manipur 795001</p>
                        <p><strong>Hours:</strong> Monday-Friday, 10:00 AM - 5:00 PM</p>
                        <p><strong>Closed:</strong> Saturdays, Sundays, and Public Holidays</p>
                        <h4>What to Bring:</h4>
                        <ul>
                            <li>Valid photo ID (Aadhaar, Driving License, etc.)</li>
                            <li>Research request or topic of interest</li>
                            <li>Notebook and pencil (pens not allowed)</li>
                        </ul>
                        <h4>Rules & Regulations:</h4>
                        <ul>
                            <li>No food or drinks in reading room</li>
                            <li>Handle documents with care</li>
                            <li>Photography requires permission</li>
                            <li>Laptops allowed, no flash photography</li>
                        </ul>
                        <button class="btn btn-primary" onclick="showMap()">View Map</button>
                    </div>
                    
                    <div class="service-card">
                        <i class="fas fa-copy service-icon"></i>
                        <h3>Document Reproduction</h3>
                        <p>Request copies of documents for research or personal use.</p>
                        <h4>Services Available:</h4>
                        <ul>
                            <li>Digital Scanning (High Resolution)</li>
                            <li>Photocopying</li>
                            <li>Certified Copies</li>
                            <li>Photography Services</li>
                        </ul>
                        <h4>Pricing:</h4>
                        <ul>
                            <li>Digital Scan: ₹20 per page</li>
                            <li>Photocopy: ₹5 per page</li>
                            <li>Certified Copy: ₹50 per page</li>
                        </ul>
                        <button class="btn btn-secondary" onclick="showReproductionForm()">Request Copies</button>
                    </div>                
                    <div class="service-card">
                        <i class="fas fa-hands-helping service-icon"></i>
                        <h3>Donate Materials</h3>
                        <p>Help preserve Manipur's heritage by donating historical documents, photographs, or manuscripts.</p>
                        <h4>What We Accept:</h4>
                        <ul>
                            <li>Personal and family papers</li>
                            <li>Historical photographs</li>
                            <li>Manuscripts and diaries</li>
                            <li>Maps and plans</li>
                            <li>Newspapers and publications</li>
                        </ul>
                        <button class="btn btn-secondary" onclick="showDonationForm()">Submit Donation</button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showAbout() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>About Us</h1>
                <p>Preserving Manipur's Documentary Heritage</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="about-content">
                    <h2>History</h2>
                    <p>The Manipur State Archives was established in 1972 with the mission to collect, preserve, and provide access to the documentary heritage of Manipur. Our collections span over three centuries, from the early Manipur Kingdom through the colonial period to modern times.</p>
                    
                    <h2>Mission & Vision</h2>
                    <div class="mission-vision">
                        <div class="mv-card">
                            <h3>Mission</h3>
                            <p>To acquire, preserve, and make accessible the archival records of Manipur for present and future generations, supporting research, education, and cultural heritage.</p>
                        </div>
                        <div class="mv-card">
                            <h3>Vision</h3>
                            <p>To be a leading center for archival excellence, preserving Manipur's unique heritage and making it accessible globally through digital innovation.</p>
                        </div>
                    </div>
                    
                    <h2>Our Collections</h2>
                    <p>The archives holds over 15,000 documents, 8,000 photographs, and 3,000 manuscripts covering:</p>
                    <ul class="about-list">
                        <li>Royal Chronicles and Administrative Records (1709-1947)</li>
                        <li>Colonial Correspondence and Reports (1891-1947)</li>
                        <li>Freedom Movement Documentation</li>
                        <li>Cultural and Religious Manuscripts</li>
                        <li>Land Settlement Records</li>
                        <li>Historical Photographs and Maps</li>
                        <li>Post-Independence Government Records</li>
                    </ul>
                    
                    <h2>Policies</h2>
                    <div class="policies-grid">
                        <a href="#" class="policy-link">
                            <i class="fas fa-file-alt"></i>
                            Collection Development Policy
                        </a>
                        <a href="#" class="policy-link">
                            <i class="fas fa-file-alt"></i>
                            Access and Use Policy
                        </a>
                        <a href="#" class="policy-link">
                            <i class="fas fa-file-alt"></i>
                            Preservation Policy
                        </a>
                        <a href="#" class="policy-link">
                            <i class="fas fa-file-alt"></i>
                            Digital Preservation Policy
                        </a>
                        <a href="#" class="policy-link">
                            <i class="fas fa-file-alt"></i>
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
}

async function showContact() {
    // Load settings first
    let settings;
    try {
        settings = await apiRequest('/settings');
    } catch (error) {
        console.error('Failed to load settings:', error);
        settings = {
            address: 'Palace Compound, Imphal, Manipur 795001',
            phone: '+91-385-2450888',
            email: 'archives@manipur.gov.in',
            hours: 'Monday - Friday\n10:00 AM - 5:00 PM'
        };
    }

    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Contact Us</h1>
                <p>Get in touch with our team</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="contact-container">
                    <div class="contact-info">
                        <h2>Visit Us</h2>
                        <div class="contact-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Address</strong>
                                <p>${settings.address.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                        <div class="contact-detail">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Phone</strong>
                                <p>${settings.phone}</p>
                            </div>
                        </div>
                        <div class="contact-detail">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <p>${settings.email}</p>
                            </div>
                        </div>
                        <div class="contact-detail">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Hours</strong>
                                <p>${settings.hours.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-form-container">
                        <h2>Send us a Message</h2>
                        <form id="contactForm" class="contact-form">
                            <div class="form-group">
                                <label for="contactName">Name *</label>
                                <input type="text" id="contactName" required>
                            </div>
                            <div class="form-group">
                                <label for="contactEmail">Email *</label>
                                <input type="email" id="contactEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="contactPhone">Phone</label>
                                <input type="tel" id="contactPhone">
                            </div>
                            <div class="form-group">
                                <label for="contactSubject">Subject *</label>
                                <input type="text" id="contactSubject" required>
                            </div>
                            <div class="form-group">
                                <label for="contactMessage">Message *</label>
                                <textarea id="contactMessage" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
                
                <div class="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-list">
                        <div class="faq-item">
                            <h3 class="faq-question">How do I access the archives?</h3>
                            <div class="faq-answer">
                                <p>You can visit us during our opening hours with a valid photo ID. You can also access many of our digitized materials online through the Digital Archives section.</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <h3 class="faq-question">Can I get copies of documents?</h3>
                            <div class="faq-answer">
                                <p>Yes, we provide document reproduction services including digital scanning, photocopying, and certified copies. Please visit our Services page for pricing and to submit a request.</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <h3 class="faq-question">How can I donate materials to the archives?</h3>
                            <div class="faq-answer">
                                <p>We welcome donations of historical materials related to Manipur. Please use our donation submission form on the Services page, and our staff will contact you regarding the appraisal and acquisition process.</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <h3 class="faq-question">Do I need an appointment to visit?</h3>
                            <div class="faq-answer">
                                <p>Walk-ins are welcome during our opening hours. However, we recommend booking an appointment if you need specialized research assistance or want to consult with an archivist.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Handle contact form submission
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    
    // FAQ accordion functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });
}

function showAdminLogin() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-login-section">
            <div class="login-container">
                <div class="login-box">
                    <h2>Admin Login</h2>
                    <p>Manipur State Archives</p>
                    <form id="adminLoginForm" class="login-form">
                        <div class="form-group">
                            <label for="loginUsername">Username</label>
                            <input type="text" id="loginUsername" required autocomplete="username">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required autocomplete="current-password">
                        </div>
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox" id="rememberMe">
                                Remember me
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Login</button>
                    </form>
                </div>
            </div>
        </section>
    `;
    
    // Handle login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}

function showPlaceholderPage(pageName) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>${pageName.replace('-', ' ').toUpperCase()}</h1>
                <p>This page is under construction</p>
            </div>
        </section>
        <section class="section">
            <div class="container text-center">
                <i class="fas fa-tools" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 2rem;"></i>
                <p>This feature is currently being developed. Please check back soon!</p>
                <button class="btn btn-primary" onclick="navigateTo('home')">Return to Homepage</button>
            </div>
        </section>
    `;
}

// ===== Utility Functions =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;  // Construct full URL
        console.log('API Request:', url, options);  // Debug log
        
        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}`, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// ===== Navigation Menu Toggle =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ===== Hero Slider =====
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    let currentSlide = 0;
    let autoplayInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.hero-dot');
    
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });
    
    startAutoplay();
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
}

// ===== Statistics Counter Animation =====
async function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    // Fetch actual statistics from database
    try {
        const db = await apiRequest('/analytics/stats');
        
        // Update data-target attributes with actual values
        if (counters[0]) counters[0].setAttribute('data-target', db.totalDocuments || 0);
        if (counters[1]) counters[1].setAttribute('data-target', db.totalPhotographs || 0);
        if (counters[2]) counters[2].setAttribute('data-target', db.totalManuscripts || 0);
        if (counters[3]) counters[3].setAttribute('data-target', db.yearsCovered || 0);
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== Collections Carousel =====
function initCollectionsCarousel() {
    const carousel = document.getElementById('collectionsCarousel');
    if (!carousel) return;
    
    const prevBtn = document.getElementById('collectionPrev');
    const nextBtn = document.getElementById('collectionNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
}

// ===== Load Latest Documents =====
async function loadLatestDocuments() {
    const container = document.getElementById('latestDocuments');
    if (!container) return;
    
    try {
        console.log('Fetching documents...'); // Debug log
        const response = await apiRequest('/documents?limit=8&sort=createdAt&order=desc');
        console.log('Documents response:', response); // Debug log
        
        const documents = response.documents || [];
        
        if (documents.length === 0) {
            container.innerHTML = '<p class="text-center">No documents available yet.</p>';
            return;
        }
        
        container.innerHTML = documents.map(doc => {
            // Use coverImage if available, otherwise use first file
            let thumbnailURL = doc.coverImage || (doc.files && doc.files[0] ? doc.files[0].thumbnail : '');
            
            let thumbnailHTML = '';
            if (thumbnailURL) {
                thumbnailHTML = `
                    <img src="${thumbnailURL}" 
                         alt="${doc.title}" 
                         class="document-thumbnail"
                         loading="lazy"
                         onerror="this.parentElement.innerHTML='<div class=\\'document-pdf-icon\\'><i class=\\'fas fa-file\\'></i><span>Document</span></div>'">
                `;
            } else {
                thumbnailHTML = `
                    <div class="document-pdf-icon">
                        <i class="fas fa-file"></i>
                        <span>No Preview</span>
                    </div>
                `;
            }
            
            return `
                <div class="document-card" onclick="viewDocumentDetail('${doc.id}')" style="cursor: pointer;">
                    ${thumbnailHTML}
                    <div class="document-info">
                        <h4 class="document-title">${doc.title}</h4>
                        <div class="document-meta">
                            <span><i class="fas fa-calendar"></i> ${doc.date ? doc.date.from : 'Date unknown'}</span>
                            <span><i class="fas fa-language"></i> ${doc.language ? doc.language.join(', ') : 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load documents:', error); // Debug log
        container.innerHTML = '<p class="text-center error-message">Failed to load documents. Please refresh the page.</p>';
    }
}

// ===== Load News =====
async function loadNews() {
    const container = document.getElementById('newsGrid');
    if (!container) return;
    
    try {
        const response = await apiRequest('/news?limit=3&sort=publishedAt&order=desc');
        const news = response.news || [];
        
        if (news.length === 0) {
            container.innerHTML = '<p class="text-center">No news available yet.</p>';
            return;
        }
        
        container.innerHTML = news.map(item => `
    <div class="news-card">
        <img src="${item.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 dy=%22.3em%22%3ENews Image%3C/text%3E%3C/svg%3E'}" 
             alt="${item.title}" 
             class="news-image"
             loading="lazy"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 dy=%22.3em%22%3ENews Image%3C/text%3E%3C/svg%3E'">
        <div class="news-content">
            <div class="news-date">${formatDate(item.publishedAt)}</div>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-excerpt">${item.excerpt || item.content.substring(0, 150) + '...'}</p>
            <a href="#" class="news-link" onclick="viewNewsDetail('${item.id}'); return false;">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </div>
`).join('');
    } catch (error) {
        console.error('Failed to load news:', error);
        container.innerHTML = '<p class="text-center">No news available yet.</p>';
    }
}

// ===== Testimonials Carousel =====
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentCard = 0;
    let autoplayInterval;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToCard(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    
    function goToCard(n) {
        cards[currentCard].classList.remove('active');
        dots[currentCard].classList.remove('active');
        
        currentCard = (n + cards.length) % cards.length;
        
        cards[currentCard].classList.add('active');
        dots[currentCard].classList.add('active');
    }
    
    function nextCard() {
        goToCard(currentCard + 1);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextCard, 6000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    startAutoplay();
    
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

// ===== Quick Search Form =====
function initQuickSearch() {
    const form = document.getElementById('quickSearchForm');
    const input = document.getElementById('quickSearchInput');
    
    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = input.value.trim();
            if (query) {
                // Navigate to digital archives with search
                navigateTo('digital-archives');
                // Wait for page to load, then perform search
                setTimeout(() => {
                    const searchInput = document.getElementById('searchKeyword');
                    if (searchInput) {
                        searchInput.value = query;
                        // Trigger the search
                        const searchForm = document.getElementById('advancedSearchForm');
                        if (searchForm) {
                            handleAdvancedSearch({ preventDefault: () => {} });
                        }
                    }
                }, 500);
            }
        });
        
        // Also add enter key support
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
}
// ===== Newsletter Form =====
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            try {
                await apiRequest('/newsletter/subscribe', {
                    method: 'POST',
                    body: JSON.stringify({ email })
                });
                
                showToast('Successfully subscribed to newsletter!', 'success');
                form.reset();
            } catch (error) {
                showToast('Failed to subscribe. Please try again.', 'error');
            }
        });
    }
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
        });
    }
}

// ===== Lazy Load Images =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== Check Authentication Status =====
async function checkAuthStatus() {
    try {
        const response = await apiRequest('/auth/check');
        if (response.authenticated) {
            currentUser = response.user;
            updateUIForAuthUser();
        }
    } catch (error) {
        console.log('User not authenticated');
    }
}

function updateUIForAuthUser() {
    const loginLink = document.querySelector('a[href="admin-login.html"]');
    if (loginLink && currentUser) {
        loginLink.textContent = 'Dashboard';
        loginLink.href = 'admin-dashboard.html';
    }
}

// ===== Form Handlers =====
async function handleAdvancedSearch(e) {
    e.preventDefault();
    console.log('Search triggered');
    
    const keyword = document.getElementById('searchKeyword').value;
    console.log('Search keyword:', keyword);
    const language = document.getElementById('searchLanguage').value;
    const dateFrom = document.getElementById('searchDateFrom').value;
    const dateTo = document.getElementById('searchDateTo').value;
    const type = document.getElementById('searchType').value;
    const collection = document.getElementById('searchCollection').value;
    
    const params = new URLSearchParams();
    if (keyword) params.append('search', keyword);
    if (language) params.append('language', language);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (type) params.append('type', type);
    if (collection) params.append('collection', collection);
    
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="loading">Searching...</div>';
    
    try {
        const response = await apiRequest(`/documents?${params.toString()}`);
        console.log('Search response:', response);
        displaySearchResults(response.documents, resultsDiv);
        
        // Track search analytics via API (removed direct call)
        if (keyword) {
            try {
                await apiRequest('/analytics/track', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'search', data: { query: keyword } })
                });
            } catch (analyticsError) {
                console.log('Analytics tracking failed (non-critical):', analyticsError);
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = '<p class="error-message">Search failed. Please try again.</p>';
    }
}

function displaySearchResults(documents, container) {
    if (documents.length === 0) {
        container.innerHTML = '<p class="text-center">No documents found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="results-header">
            <h3>${documents.length} Result${documents.length > 1 ? 's' : ''} Found</h3>
        </div>
        <div class="documents-grid">
            ${documents.map(doc => {
                // Use placeholder image if thumbnail is missing
                let thumbnailUrl = '/images/placeholder-document.svg';
                if (doc.coverImage) {
                    thumbnailUrl = doc.coverImage;
                } else if (doc.files && doc.files[0] && doc.files[0].thumbnail) {
                    thumbnailUrl = doc.files[0].thumbnail;
                }
                
                return `
                    <div class="document-card" onclick="viewDocumentDetail('${doc.id}')" style="cursor: pointer;">
                        <img src="${thumbnailUrl}" 
                             alt="${doc.title}" 
                             class="document-thumbnail"
                             loading="lazy"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22300%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EDocument%3C/text%3E%3C/svg%3E'">
                        <div class="document-info">
                            <h4 class="document-title">${doc.title}</h4>
                            <div class="document-meta">
                                <span><i class="fas fa-calendar"></i> ${doc.date && doc.date.from ? doc.date.from : 'Date unknown'}</span>
                                <span><i class="fas fa-language"></i> ${doc.language && doc.language.length > 0 ? doc.language.join(', ') : 'Unknown'}</span>
                            </div>
                            ${doc.description ? `<p class="document-description">${doc.description.substring(0, 100)}...</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function viewDocument(docId) {
    showToast('Document viewer will open here', 'success');
    // In full implementation, this would open a detailed document viewer
}

async function loadCollectionsForSearch() {
    try {
        const response = await apiRequest('/collections');
        const select = document.getElementById('searchCollection');
        if (select && response.collections) {
            response.collections.forEach(col => {
                const option = document.createElement('option');
                option.value = col.id;
                option.textContent = col.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load collections:', error);
    }
}

async function loadAllCollections() {
    const container = document.getElementById('collectionsGrid');
    
    try {
        const response = await apiRequest('/collections');
        const collections = response.collections || [];
        
        if (collections.length === 0) {
            container.innerHTML = '<p class="text-center">No collections available yet.</p>';
            return;
        }
        
        container.innerHTML = collections.map(col => `
            <div class="collection-card">
                <img src="${col.coverImage || '/images/placeholder.jpg'}" 
                     alt="${col.name}" 
                     loading="lazy">
                <div class="collection-info">
                    <h3>${col.name}</h3>
                    <p>${col.description}</p>
                    <div class="collection-meta">
                        <span><i class="fas fa-file"></i> ${col.itemCount || 0} items</span>
                        <span><i class="fas fa-calendar"></i> ${col.dateRange || 'Various dates'}</span>
                    </div>
                    <button class="btn btn-secondary" onclick="viewCollectionDetail('${col.id}')">View Collection</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load collections:', error);
        container.innerHTML = '<p class="text-center error-message">Failed to load collections.</p>';
    }
}

function viewCollection(colId) {
    showToast('Collection viewer will open here', 'success');
    // In full implementation, this would show collection details
}

function showResearchRequestForm() {
    const modal = createModal('Research Request', `
        <form id="researchRequestForm" class="modal-form">
            <div class="form-group">
                <label for="reqName">Your Name *</label>
                <input type="text" id="reqName" required>
            </div>
            <div class="form-group">
                <label for="reqEmail">Email *</label>
                <input type="email" id="reqEmail" required>
            </div>
            <div class="form-group">
                <label for="reqPhone">Phone</label>
                <input type="tel" id="reqPhone">
            </div>
            <div class="form-group">
                <label for="reqAffiliation">Affiliation</label>
                <input type="text" id="reqAffiliation" placeholder="University, Organization, etc.">
            </div>
            <div class="form-group">
                <label for="reqTopic">Research Topic *</label>
                <input type="text" id="reqTopic" required>
            </div>
            <div class="form-group">
                <label for="reqDetails">Specific Requirements *</label>
                <textarea id="reqDetails" rows="4" required placeholder="Please describe what you're looking for..."></textarea>
            </div>
            <div class="form-group">
                <label for="reqTimeframe">Timeframe</label>
                <input type="text" id="reqTimeframe" placeholder="e.g., 2-3 weeks">
            </div>
            <button type="submit" class="btn btn-primary">Submit Request</button>
        </form>
    `);
    
    document.getElementById('researchRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            researcherName: document.getElementById('reqName').value,
            email: document.getElementById('reqEmail').value,
            phone: document.getElementById('reqPhone').value,
            affiliation: document.getElementById('reqAffiliation').value,
            researchTopic: document.getElementById('reqTopic').value,
            specificRequirements: document.getElementById('reqDetails').value,
            timeframe: document.getElementById('reqTimeframe').value
        };
        
        try {
            await apiRequest('/research-requests', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            closeModal(modal);
            showToast('Research request submitted successfully!', 'success');
        } catch (error) {
            showToast('Failed to submit request. Please try again.', 'error');
        }
    });
}

function showReproductionForm() {
    showToast('Document reproduction request form', 'success');
    // Implementation would show a form modal
}

function showDonationForm() {
    showToast('Donation submission form', 'success');
    // Implementation would show a donation form
}

function showMap() {
    const modal = createModal('Location', `
        <div class="map-container">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.123456789!2d93.9368!3d24.8170!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ5JzAxLjIiTiA5M8KwNTYnMTIuNSJF!5e0!3m2!1sen!2sin!4v1234567890" 
                    width="100%" 
                    height="450" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy"></iframe>
        </div>
        <div style="margin-top: 1rem;">
            <p><strong>Address:</strong> Palace Compound, Imphal, Manipur 795001</p>
            <p><strong>Phone:</strong> +91-385-2450888</p>
        </div>
    `);
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    try {
        await apiRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        showToast('Message sent successfully! We will respond soon.', 'success');
        e.target.reset();
    } catch (error) {
        showToast('Failed to send message. Please try again.', 'error');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, rememberMe })
        });
        
        if (response.success) {
            currentUser = response.user;
            showToast('Login successful!', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                showAdminDashboard();
            }, 1000);
        }
    } catch (error) {
        showToast('Invalid username or password', 'error');
    }
}

function showAdminDashboard() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section mt-5">
            <div class="container">
                <div class="admin-header">
                    <h1>Admin Dashboard</h1>
                    <button class="btn btn-warning" onclick="confirmLogout()">
                        <i class="fas fa-sign-out-alt"></i> LOGOUT
                    </button>
                </div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Total Documents</h3>
                        <div class="stat-value" id="statDocuments">-</div>
                    </div>
                    <div class="stat-card">
                        <h3>Collections</h3>
                        <div class="stat-value" id="statCollections">-</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Views</h3>
                        <div class="stat-value" id="statViews">-</div>
                    </div>
                    <div class="stat-card">
                        <h3>Pending Requests</h3>
                        <div class="stat-value" id="statRequests">0</div>
                    </div>
                </div>
                
                <div class="admin-actions">
    <button class="btn btn-info" onclick="showSiteInfoEditor()">
    <i class="fas fa-info-circle"></i> EDIT SITE INFO
</button>
<button class="btn btn-primary" onclick="showManageNotifications()">
    <i class="fas fa-bell"></i> MANAGE NOTIFICATIONS
</button>
<button class="btn btn-primary" onclick="showUploadDocuments()">
    <i class="fas fa-upload"></i> UPLOAD DOCUMENTS
</button>
    <button class="btn btn-primary" onclick="showManageDocuments()">
        <i class="fas fa-file-alt"></i> MANAGE DOCUMENTS
    </button>
                    <button class="btn btn-primary" onclick="showUploadGallery()">
                        <i class="fas fa-images"></i> UPLOAD GALLERY
                    </button>
                    <button class="btn btn-primary" onclick="showManageGallery()">
                        <i class="fas fa-image"></i> MANAGE GALLERY
                    </button>
                    <button class="btn btn-primary" onclick="showManageCollections()">
                        <i class="fas fa-folder"></i> MANAGE COLLECTIONS
                    </button>
                    <button class="btn btn-primary" onclick="showManageNews()">
                        <i class="fas fa-newspaper"></i> MANAGE NEWS
                    </button>
                    <button class="btn btn-primary" onclick="showViewRequests()">
                        <i class="fas fa-inbox"></i> VIEW REQUESTS
                    </button>
                    <button class="btn btn-primary" onclick="showViewMessages()">
                        <i class="fas fa-envelope"></i> VIEW MESSAGES
                    </button>
                    <button class="btn btn-primary" onclick="showAnalytics()">
                        <i class="fas fa-chart-bar"></i> ANALYTICS
                    </button>
                </div>
            </div>
        </section>
    `;
    
    // Update login button in header
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.textContent = 'Admin Dashboard';
        loginBtn.onclick = () => showAdminDashboard();
    }
    
    loadDashboardStats();
}

async function loadDashboardStats() {
    try {
        const stats = await apiRequest('/analytics/overview');
        if (document.getElementById('statDocuments')) {
            document.getElementById('statDocuments').textContent = stats.totalDocuments || 0;
        }
        if (document.getElementById('statCollections')) {
            document.getElementById('statCollections').textContent = stats.totalCollections || 0;
        }
        if (document.getElementById('statViews')) {
            document.getElementById('statViews').textContent = stats.totalViews || 0;
        }
        if (document.getElementById('statRequests')) {
            document.getElementById('statRequests').textContent = stats.pendingRequests || 0;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
        // Set default values on error
        if (document.getElementById('statDocuments')) document.getElementById('statDocuments').textContent = '0';
        if (document.getElementById('statCollections')) document.getElementById('statCollections').textContent = '0';
        if (document.getElementById('statViews')) document.getElementById('statViews').textContent = '0';
        if (document.getElementById('statRequests')) document.getElementById('statRequests').textContent = '0';
    }
}

async function handleLogout() {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
        currentUser = null;
        
        // Reset login button
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = 'Admin Login';
            loginBtn.onclick = () => navigateTo('admin-login');
        }
        
        showToast('Logged out successfully', 'success');
        navigateTo('home');
    } catch (error) {
        showToast('Logout failed', 'error');
    }
}

// Confirmation Dialog for Logout
function confirmLogout() {
    const modal = createConfirmDialog(
        'Confirm Logout',
        'Are you sure you want to logout?',
        () => {
            handleLogout();
            closeModal(modal);
        }
    );
}

// Upload Documents Feature
function showUploadDocuments() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-upload"></i> Upload Documents</h1>
                    <button class="btn btn-secondary" onclick="showAdminDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
                
                <div class="upload-container">
                    <div class="upload-area" id="uploadArea">
                        <i class="fas fa-cloud-upload-alt upload-icon"></i>
                        <h3>Drag & Drop Files Here</h3>
                        <p>or</p>
                        <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                            <i class="fas fa-folder-open"></i> Browse Files
                        </button>
                        <input type="file" id="fileInput" multiple accept="image/*,.pdf" style="display: none;">
                        <p class="upload-info">Supported formats: JPG, PNG, PDF, TIFF (Max 50MB per file)</p>
                    </div>
                    
                    <div id="filePreview" class="file-preview"></div>
                    
                    <div id="metadataForm" class="metadata-form" style="display: none;">
                        <h3>Document Metadata</h3>
                        <form id="documentMetadataForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="docTitle">Title *</label>
                                    <input type="text" id="docTitle" required>
                                </div>
                                <div class="form-group">
                                    <label for="docRefNumber">Reference Number</label>
                                    <input type="text" id="docRefNumber" placeholder="e.g., MSA/2024/001">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="docDateFrom">Date From</label>
                                    <input type="date" id="docDateFrom">
                                </div>
                                <div class="form-group">
                                    <label for="docDateTo">Date To</label>
                                    <input type="date" id="docDateTo">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="docDescription">Description</label>
                                <textarea id="docDescription" rows="4"></textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="docCreator">Creator/Author</label>
                                    <input type="text" id="docCreator">
                                </div>
                                <div class="form-group">
                                    <label for="docLanguage">Language</label>
                                    <select id="docLanguage" multiple>
                                        <option value="Meitei">Meitei/Manipuri</option>
                                        <option value="English">English</option>
                                        <option value="Bengali">Bengali</option>
                                        <option value="Hindi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="docCollection">Collection</label>
                                    <select id="docCollection">
                                        <option value="">Select Collection</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="docSubjects">Subjects/Keywords</label>
                                    <input type="text" id="docSubjects" placeholder="Separate with commas">
                                </div>
                            </div>

                            <div class="form-group">
    <label for="docCoverImage">Cover Image (Optional)</label>
    <div class="image-upload-group">
        <input type="file" id="docCoverImageInput" accept="image/*" style="display: none;">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('docCoverImageInput').click()">
            <i class="fas fa-image"></i> Choose Cover Image
        </button>
        <span id="coverImageName" style="margin-left: 10px; color: #666;"></span>
    </div>
    <div id="coverImagePreview" style="margin-top: 10px;"></div>
</div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="docPublished" checked>
                                    Publish document immediately
                                </label>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Save Document
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="cancelUpload()">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    initUploadArea();
    loadCollectionsForUpload();
}

function initUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const metadataForm = document.getElementById('metadataForm');
    let selectedFiles = [];
    
    if (!uploadArea || !fileInput) return;
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Add cover image handler
const coverImageInput = document.getElementById('docCoverImageInput');
if (coverImageInput) {
    coverImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show filename
            document.getElementById('coverImageName').textContent = file.name;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('coverImagePreview').innerHTML = `
                    <img src="${e.target.result}" style="max-width: 200px; border-radius: 8px; border: 2px solid #ddd;">
                `;
            };
            reader.readAsDataURL(file);
            
            // Store globally
            window.currentCoverImage = file;
        }
    });
}
    
    function handleFiles(files) {
        selectedFiles = Array.from(files);
        // Store globally immediately
        window.currentUploadFiles = selectedFiles;
        
        displayFilePreview(selectedFiles);
        if (metadataForm) {
            metadataForm.style.display = 'block';
        }
    }
    
    function displayFilePreview(files) {
        if (!filePreview) return;
        
        filePreview.innerHTML = '<h3>Selected Files</h3>';
        files.forEach((file, index) => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            
            const fileIcon = file.type.startsWith('image/') ? 
                '<i class="fas fa-image"></i>' : 
                '<i class="fas fa-file-pdf"></i>';
            
            fileCard.innerHTML = `
                ${fileIcon}
                <div class="file-info">
                    <strong>${file.name}</strong>
                    <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button class="btn-remove" type="button" onclick="window.removeFileAt(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            filePreview.appendChild(fileCard);
        });
    }
    
    // Make removeFile function global
    window.removeFileAt = (index) => {
        selectedFiles.splice(index, 1);
        window.currentUploadFiles = selectedFiles; // Update global
        
        if (selectedFiles.length === 0) {
            filePreview.innerHTML = '';
            if (metadataForm) {
                metadataForm.style.display = 'none';
            }
        } else {
            displayFilePreview(selectedFiles);
        }
    };
    
    // Handle form submission
    const form = document.getElementById('documentMetadataForm');
    if (form) {
        // Remove any existing listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('Form submitted, checking files...');
            console.log('window.currentUploadFiles:', window.currentUploadFiles);
            console.log('selectedFiles:', selectedFiles);
            
            // Get current files
            const filesToUpload = window.currentUploadFiles || selectedFiles;
            
            if (!filesToUpload || filesToUpload.length === 0) {
                showToast('Please select files to upload', 'error');
                return;
            }
            
            await uploadDocumentWithMetadata(filesToUpload);
        });
    }
}

async function uploadDocumentWithMetadata(files) {
    if (!files || files.length === 0) {
        showToast('Please select files to upload', 'error');
        return;
    }
    
    const formData = new FormData();
    
    // Add document files
    files.forEach(file => {
        formData.append('files', file);
    });
    
    showToast('Uploading documents...', 'success');
    
    try {
        // Upload files first
        const uploadResponse = await fetch('/api/documents/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Upload failed');
        }
        
        const { files: uploadedFiles } = await uploadResponse.json();
        
        // Upload cover image if selected
        let coverImageUrl = '';
        if (window.currentCoverImage) {
            const coverFormData = new FormData();
            coverFormData.append('files', window.currentCoverImage);
            
            const coverUploadResponse = await fetch('/api/documents/upload', {
                method: 'POST',
                credentials: 'include',
                body: coverFormData
            });
            
            if (coverUploadResponse.ok) {
                const coverResult = await coverUploadResponse.json();
                if (coverResult.files && coverResult.files[0]) {
                    coverImageUrl = coverResult.files[0].url;
                }
            }
        }
        
        // Get metadata from form
        const languageSelect = document.getElementById('docLanguage');
        const languages = languageSelect ? Array.from(languageSelect.selectedOptions).map(opt => opt.value) : [];
        
        const subjectsInput = document.getElementById('docSubjects');
        const subjects = subjectsInput ? subjectsInput.value.split(',').map(s => s.trim()).filter(s => s) : [];
        
        const metadata = {
            title: document.getElementById('docTitle')?.value || 'Untitled',
            referenceNumber: document.getElementById('docRefNumber')?.value || '',
            date: {
                from: document.getElementById('docDateFrom')?.value || '',
                to: document.getElementById('docDateTo')?.value || ''
            },
            description: document.getElementById('docDescription')?.value || '',
            creator: document.getElementById('docCreator')?.value || '',
            language: languages,
            subjects: subjects,
            collection: document.getElementById('docCollection')?.value || '',
            files: uploadedFiles,
            coverImage: coverImageUrl || (uploadedFiles[0] ? uploadedFiles[0].thumbnail : ''),
            published: document.getElementById('docPublished')?.checked || false
        };
        
        // Save document with metadata
        const saveResponse = await apiRequest('/documents', {
            method: 'POST',
            body: JSON.stringify(metadata)
        });
        
        if (saveResponse.success || saveResponse.id) {
            showToast('Document uploaded successfully!', 'success');
            
            // Reset form and files
            document.getElementById('documentMetadataForm').reset();
            document.getElementById('filePreview').innerHTML = '';
            document.getElementById('coverImagePreview').innerHTML = '';
            document.getElementById('coverImageName').textContent = '';
            document.getElementById('metadataForm').style.display = 'none';
            window.currentUploadFiles = [];
            window.currentCoverImage = null;
            
            setTimeout(() => {
                showAdminDashboard();
            }, 1500);
        } else {
            throw new Error('Failed to save document metadata');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showToast(error.message || 'Upload failed. Please try again.', 'error');
    }
}

async function loadCollectionsForUpload() {
    try {
        const response = await apiRequest('/collections');
        const select = document.getElementById('docCollection');
        if (select && response.collections) {
            response.collections.forEach(col => {
                const option = document.createElement('option');
                option.value = col.id;
                option.textContent = col.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load collections:', error);
    }
}

function cancelUpload() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        showAdminDashboard();
    }
}

// Manage Collections Feature
function showManageCollections() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-folder"></i> Manage Collections</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="showCreateCollectionModal()">
                            <i class="fas fa-plus"></i> New Collection
                        </button>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <div id="collectionsTable" class="admin-table-container">
                    <div class="loading">Loading collections...</div>
                </div>
            </div>
        </section>
    `;
    
    loadCollectionsTable();
}

async function loadCollectionsTable() {
    const container = document.getElementById('collectionsTable');
    
    try {
        const response = await apiRequest('/collections');
        const collections = response.collections || [];
        
        if (collections.length === 0) {
            container.innerHTML = '<p class="text-center">No collections yet. Create your first collection!</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Collection Name</th>
                        <th>Items</th>
                        <th>Date Range</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${collections.map(col => `
                        <tr>
                            <td><strong>${col.name}</strong></td>
                            <td>${col.itemCount || 0}</td>
                            <td>${col.dateRange || 'N/A'}</td>
                            <td>
                                <span class="badge ${col.featured ? 'badge-success' : 'badge-default'}">
                                    ${col.featured ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-icon" onclick="editCollection('${col.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteCollection('${col.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        container.innerHTML = '<p class="error-message">Failed to load collections.</p>';
    }
}

function showCreateCollectionModal() {
    const modal = createModal('Create New Collection', `
        <form id="createCollectionForm" class="modal-form">
            <div class="form-group">
                <label for="colName">Collection Name *</label>
                <input type="text" id="colName" required>
            </div>
            <div class="form-group">
                <label for="colDescription">Description *</label>
                <textarea id="colDescription" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="colDateRange">Date Range</label>
                <input type="text" id="colDateRange" placeholder="e.g., 1709-1947">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="colFeatured">
                    Feature this collection on homepage
                </label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> Create Collection
            </button>
        </form>
    `);
    
    document.getElementById('createCollectionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('colName').value,
            description: document.getElementById('colDescription').value,
            dateRange: document.getElementById('colDateRange').value,
            featured: document.getElementById('colFeatured').checked,
            itemCount: 0
        };
        
        try {
            await apiRequest('/collections', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            closeModal(modal);
            showToast('Collection created successfully!', 'success');
            showManageCollections();
        } catch (error) {
            showToast('Failed to create collection', 'error');
        }
    });
}

// View Requests Feature
function showViewRequests() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-inbox"></i> Research Requests</h1>
                    <button class="btn btn-secondary" onclick="showAdminDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div class="requests-filters">
                    <button class="filter-btn active" onclick="filterRequests('all')">All</button>
                    <button class="filter-btn" onclick="filterRequests('pending')">Pending</button>
                    <button class="filter-btn" onclick="filterRequests('in-progress')">In Progress</button>
                    <button class="filter-btn" onclick="filterRequests('completed')">Completed</button>
                </div>
                
                <div id="requestsTable" class="admin-table-container">
                    <div class="loading">Loading requests...</div>
                </div>
            </div>
        </section>
    `;
    
    loadRequestsTable();
}

async function loadRequestsTable() {
    const container = document.getElementById('requestsTable');
    
    try {
        const response = await apiRequest('/research-requests');
        const requests = response.requests || [];
        
        if (requests.length === 0) {
            container.innerHTML = '<p class="text-center">No research requests yet.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Researcher</th>
                        <th>Topic</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${requests.map(req => `
                        <tr>
                            <td>
                                <strong>${req.researcherName}</strong><br>
                                <small>${req.email}</small>
                            </td>
                            <td>${req.researchTopic}</td>
                            <td>${formatDate(req.submittedAt)}</td>
                            <td>
                                <span class="badge badge-${req.status}">
                                    ${req.status.toUpperCase()}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-icon" onclick="viewRequestDetails('${req.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        container.innerHTML = '<p class="error-message">Failed to load requests.</p>';
    }
}

// Analytics Feature
function showAnalytics() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-chart-line"></i> Analytics Dashboard</h1>
                    <div class="header-actions">
                        <select id="analyticsTimeRange" class="analytics-select">
                            <option value="7">Last 7 Days</option>
                            <option value="30" selected>Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last Year</option>
                        </select>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <!-- Key Metrics -->
                <div class="analytics-metrics">
                    <div class="metric-card">
                        <div class="metric-icon" style="background: #4CAF50;">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="metric-content">
                            <h3 id="metricDocuments">-</h3>
                            <p>Total Documents</p>
                            <span class="metric-change positive" id="docsChange">+0% from last month</span>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon" style="background: #2196F3;">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="metric-content">
                            <h3 id="metricViews">-</h3>
                            <p>Total Views</p>
                            <span class="metric-change positive" id="viewsChange">+0% from last month</span>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon" style="background: #FF9800;">
                            <i class="fas fa-download"></i>
                        </div>
                        <div class="metric-content">
                            <h3 id="metricDownloads">-</h3>
                            <p>Total Downloads</p>
                            <span class="metric-change positive" id="downloadsChange">+0% from last month</span>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon" style="background: #9C27B0;">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="metric-content">
                            <h3 id="metricRequests">-</h3>
                            <p>Research Requests</p>
                            <span class="metric-change" id="requestsChange">0 pending</span>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="analytics-charts">
                    <div class="chart-card">
                        <h3><i class="fas fa-chart-line"></i> Document Growth</h3>
                        <canvas id="documentGrowthChart"></canvas>
                    </div>
                    
                    <div class="chart-card">
                        <h3><i class="fas fa-chart-pie"></i> Documents by Collection</h3>
                        <canvas id="collectionDistChart"></canvas>
                    </div>
                </div>
                
                <div class="analytics-charts">
                    <div class="chart-card">
                        <h3><i class="fas fa-search"></i> Top Search Keywords</h3>
                        <div id="topKeywords" class="keywords-list">
                            <div class="loading">Loading search data...</div>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <h3><i class="fas fa-star"></i> Most Viewed Documents</h3>
                        <div id="topDocuments" class="documents-list">
                            <div class="loading">Loading documents...</div>
                        </div>
                    </div>
                </div>
                
                <!-- Activity Log -->
                <div class="chart-card full-width">
                    <h3><i class="fas fa-history"></i> Recent Activity</h3>
                    <div id="activityLog" class="activity-log">
                        <div class="loading">Loading activity...</div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    loadAnalyticsData();
}

async function loadAnalyticsData() {
    try {
        // Load overview stats
        const overview = await apiRequest('/analytics/overview');
        
        // Update metrics
        document.getElementById('metricDocuments').textContent = overview.totalDocuments || 0;
        document.getElementById('metricViews').textContent = (overview.totalViews || 0).toLocaleString();
        document.getElementById('metricDownloads').textContent = (overview.totalDownloads || 0).toLocaleString();
        document.getElementById('metricRequests').textContent = overview.pendingRequests || 0;
        
        // Calculate growth percentages
        const monthlyGrowth = overview.monthlyUploads || 0;
        const totalDocs = overview.totalDocuments || 1;
        const growthPercent = ((monthlyGrowth / totalDocs) * 100).toFixed(1);
        document.getElementById('docsChange').textContent = `+${monthlyGrowth} this month`;
        
        // Load documents for charts
        const docsResponse = await apiRequest('/documents?limit=1000');
        const documents = docsResponse.documents || [];
        
        // Load collections
        const colsResponse = await apiRequest('/collections');
        const collections = colsResponse.collections || [];
        
        // Create charts
        createDocumentGrowthChart(documents);
        createCollectionDistributionChart(documents, collections);
        loadTopKeywords();
        loadTopDocuments(documents);
        loadActivityLog();
        
    } catch (error) {
        console.error('Failed to load analytics:', error);
        showToast('Failed to load analytics data', 'error');
    }
}

function createDocumentGrowthChart(documents) {
    const ctx = document.getElementById('documentGrowthChart');
    if (!ctx) return;
    
    // Group documents by month
    const monthlyData = {};
    documents.forEach(doc => {
        const date = new Date(doc.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    
    // Get last 6 months
    const labels = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        labels.push(monthName);
        data.push(monthlyData[monthKey] || 0);
    }
    
    // Create simple line chart with canvas
    const canvas = ctx.getContext('2d');
    const width = ctx.width = ctx.offsetWidth;
    const height = ctx.height = 300;
    
    // Clear canvas
    canvas.clearRect(0, 0, width, height);
    
    // Draw chart
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data, 10);
    
    // Draw axes
    canvas.strokeStyle = '#ddd';
    canvas.lineWidth = 1;
    canvas.beginPath();
    canvas.moveTo(padding, padding);
    canvas.lineTo(padding, height - padding);
    canvas.lineTo(width - padding, height - padding);
    canvas.stroke();
    
    // Draw line
    canvas.strokeStyle = '#2196F3';
    canvas.lineWidth = 3;
    canvas.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            canvas.moveTo(x, y);
        } else {
            canvas.lineTo(x, y);
        }
        
        // Draw points
        canvas.fillStyle = '#2196F3';
        canvas.fillRect(x - 3, y - 3, 6, 6);
    });
    
    canvas.stroke();
    
    // Draw labels
    canvas.fillStyle = '#666';
    canvas.font = '12px Arial';
    canvas.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        canvas.fillText(label, x, height - padding + 20);
        canvas.fillText(data[index], x, height - padding - (data[index] / maxValue) * chartHeight - 10);
    });
}

function createCollectionDistributionChart(documents, collections) {
    const ctx = document.getElementById('collectionDistChart');
    if (!ctx) return;
    
    // Count documents per collection
    const collectionCounts = {};
    collections.forEach(col => {
        collectionCounts[col.name] = documents.filter(doc => doc.collection === col.id).length;
    });
    
    const canvas = ctx.getContext('2d');
    const width = ctx.width = ctx.offsetWidth;
    const height = ctx.height = 300;
    
    canvas.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    const total = Object.values(collectionCounts).reduce((a, b) => a + b, 0) || 1;
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
    
    let currentAngle = -Math.PI / 2;
    
    Object.entries(collectionCounts).forEach(([name, count], index) => {
        const sliceAngle = (count / total) * 2 * Math.PI;
        
        // Draw slice
        canvas.fillStyle = colors[index % colors.length];
        canvas.beginPath();
        canvas.moveTo(centerX, centerY);
        canvas.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        canvas.closePath();
        canvas.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        canvas.fillStyle = '#fff';
        canvas.font = 'bold 14px Arial';
        canvas.textAlign = 'center';
        canvas.fillText(count, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    let legendY = 20;
    Object.entries(collectionCounts).forEach(([name, count], index) => {
        canvas.fillStyle = colors[index % colors.length];
        canvas.fillRect(10, legendY, 15, 15);
        
        canvas.fillStyle = '#333';
        canvas.font = '12px Arial';
        canvas.textAlign = 'left';
        canvas.fillText(`${name} (${count})`, 30, legendY + 12);
        
        legendY += 25;
    });
}

async function loadTopKeywords() {
    const container = document.getElementById('topKeywords');
    
    try {
        const response = await apiRequest('/analytics/search-trends');
        const keywords = response.keywords || [];
        
        if (keywords.length === 0) {
            container.innerHTML = '<p class="no-data">No search data available yet</p>';
            return;
        }
        
        container.innerHTML = keywords.slice(0, 10).map((kw, index) => `
            <div class="keyword-item">
                <span class="keyword-rank">${index + 1}</span>
                <span class="keyword-text">${kw.keyword}</span>
                <span class="keyword-count">${kw.count} searches</span>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="no-data">No search data available yet</p>';
    }
}

async function loadTopDocuments(documents) {
    const container = document.getElementById('topDocuments');
    
    const topDocs = documents
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);
    
    if (topDocs.length === 0) {
        container.innerHTML = '<p class="no-data">No documents viewed yet</p>';
        return;
    }
    
    container.innerHTML = topDocs.map((doc, index) => `
        <div class="document-item">
            <span class="doc-rank">${index + 1}</span>
            <div class="doc-info">
                <strong>${doc.title}</strong>
                <span>${doc.views || 0} views</span>
            </div>
        </div>
    `).join('');
}

async function loadActivityLog() {
    const container = document.getElementById('activityLog');
    
    try {
        const docsResponse = await apiRequest('/documents?limit=10&sort=createdAt&order=desc');
        const documents = docsResponse.documents || [];
        
        if (documents.length === 0) {
            container.innerHTML = '<p class="no-data">No recent activity</p>';
            return;
        }
        
        container.innerHTML = documents.map(doc => `
            <div class="activity-item">
                <i class="fas fa-file-upload activity-icon"></i>
                <div class="activity-content">
                    <strong>Document Uploaded</strong>
                    <p>${doc.title}</p>
                    <span class="activity-time">${formatDate(doc.createdAt)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="no-data">Failed to load activity</p>';
    }
}

// View Collection Detail
async function viewCollectionDetail(collectionId) {
    try {
        const response = await apiRequest(`/collections/${collectionId}`);
        const collection = response;
        
        if (!collection) {
            showToast('Collection not found', 'error');
            return;
        }
        
        // Get documents in this collection
        const docsResponse = await apiRequest(`/documents?collection=${collectionId}&limit=1000`);
        const documents = docsResponse.documents || [];
        
        const main = document.querySelector('main');
        main.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                        <button class="btn btn-secondary" onclick="navigateTo('collections')" style="padding: 10px 20px;">
                            <i class="fas fa-arrow-left"></i> Back to Collections
                        </button>
                    </div>
                    <h1>${collection.name}</h1>
                    <p>${collection.description}</p>
                    <div class="collection-meta" style="display: flex; gap: 30px; margin-top: 20px; font-size: 1.1rem;">
                        <span><i class="fas fa-file"></i> ${documents.length} items</span>
                        <span><i class="fas fa-calendar"></i> ${collection.dateRange || 'Various dates'}</span>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="container">
                    ${documents.length > 0 ? `
                        <div class="documents-grid">
                            ${documents.map(doc => {
                                let thumbnailHTML = '';
                                if (doc.files && doc.files.length > 0) {
                                    const firstFile = doc.files[0];
                                    const isPDF = firstFile.url.toLowerCase().endsWith('.pdf');
                                    
                                    if (isPDF) {
                                        thumbnailHTML = `
                                            <div class="document-pdf-icon">
                                                <i class="fas fa-file-pdf"></i>
                                                <span>PDF</span>
                                            </div>
                                        `;
                                    } else {
                                        thumbnailHTML = `
                                            <img src="${firstFile.thumbnail}" 
                                                 alt="${doc.title}" 
                                                 class="document-thumbnail"
                                                 loading="lazy"
                                                 onerror="this.parentElement.innerHTML='<div class=\\'document-pdf-icon\\'><i class=\\'fas fa-file\\'></i><span>Document</span></div>'">
                                        `;
                                    }
                                } else {
                                    thumbnailHTML = `
                                        <div class="document-pdf-icon">
                                            <i class="fas fa-file"></i>
                                            <span>No Preview</span>
                                        </div>
                                    `;
                                }
                                
                                return `
                                    <div class="document-card" onclick="viewDocumentDetail('${doc.id}')" style="cursor: pointer;">
                                        ${thumbnailHTML}
                                        <div class="document-info">
                                            <h4 class="document-title">${doc.title}</h4>
                                            <div class="document-meta">
                                                <span><i class="fas fa-calendar"></i> ${doc.date ? doc.date.from : 'Date unknown'}</span>
                                                <span><i class="fas fa-language"></i> ${doc.language ? doc.language.join(', ') : 'Unknown'}</span>
                                            </div>
                                            ${doc.description ? `<p class="document-description">${doc.description.substring(0, 100)}...</p>` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : '<p class="text-center" style="padding: 60px 20px; color: #999; font-size: 1.2rem;"><i class="fas fa-folder-open" style="font-size: 4rem; display: block; margin-bottom: 20px; color: #ddd;"></i>No documents in this collection yet.</p>'}
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Failed to load collection:', error);
        showToast('Failed to load collection', 'error');
    }
}

async function viewDocumentDetail(docId) {
    try {
        const doc = await apiRequest(`/documents/${docId}`);
        
        if (!doc) {
            showToast('Document not found', 'error');
            return;
        }
        
        const modal = createModal('', `
            <div class="document-viewer">
                <div class="document-viewer-header">
                    <div class="document-info-header">
                        <h2>${doc.title}</h2>
                        <div class="document-meta-inline">
                            ${doc.referenceNumber ? `<span><i class="fas fa-barcode"></i> ${doc.referenceNumber}</span>` : ''}
                            ${doc.date && doc.date.from ? `<span><i class="fas fa-calendar"></i> ${doc.date.from}</span>` : ''}
                            ${doc.language ? `<span><i class="fas fa-language"></i> ${doc.language.join(', ')}</span>` : ''}
                            ${doc.creator ? `<span><i class="fas fa-user"></i> ${doc.creator}</span>` : ''}
                        </div>
                    </div>
                    <div class="document-actions-header">
                        <button class="btn btn-primary" onclick="downloadDocument('${doc.id}', '${doc.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
                
                <div class="document-viewer-content">
                    ${doc.files && doc.files.length > 0 ? `
                        <div class="document-images">
                            ${doc.files.map((file, index) => `
                                <div class="document-image-container">
                                    <img src="${file.url}" 
                                         alt="Page ${index + 1}" 
                                         class="document-page-image"
                                         onclick="zoomImage(this)"
                                         onerror="this.parentElement.innerHTML='<div class=\\'no-preview\\'><i class=\\'fas fa-file-pdf\\'></i><p>Preview not available</p></div>'">
                                    <p class="page-number"><i class="fas fa-file-alt"></i> Page ${index + 1} of ${doc.files.length}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="no-preview"><i class="fas fa-file-alt"></i><p>No preview available</p></div>'}
                </div>
                
                <div class="document-details">
                    <h3><i class="fas fa-info-circle"></i> Document Information</h3>
                    <div class="details-grid">
                        ${doc.description ? `
                            <div class="detail-item full-width">
                                <strong><i class="fas fa-align-left"></i> Description</strong>
                                <span>${doc.description}</span>
                            </div>
                        ` : ''}
                        ${doc.subjects && doc.subjects.length > 0 ? `
                            <div class="detail-item full-width">
                                <strong><i class="fas fa-tags"></i> Subjects</strong>
                                <span>${doc.subjects.join(', ')}</span>
                            </div>
                        ` : ''}
                        ${doc.physicalDescription ? `
                            <div class="detail-item">
                                <strong><i class="fas fa-file-alt"></i> Physical Description</strong>
                                <span>${doc.physicalDescription}</span>
                            </div>
                        ` : ''}
                        ${doc.location ? `
                            <div class="detail-item">
                                <strong><i class="fas fa-map-marker-alt"></i> Location</strong>
                                <span>${doc.location}</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <strong><i class="fas fa-lock"></i> Access</strong>
                            <span>${doc.accessRestrictions || 'Public'}</span>
                        </div>
                        <div class="detail-item">
                            <strong><i class="fas fa-copyright"></i> Copyright</strong>
                            <span>${doc.copyrightStatus || 'Unknown'}</span>
                        </div>
                        <div class="detail-item">
                            <strong><i class="fas fa-eye"></i> Views</strong>
                            <span>${(doc.views || 0).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <strong><i class="fas fa-download"></i> Downloads</strong>
                            <span>${(doc.downloads || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
    } catch (error) {
        console.error('Failed to load document:', error);
        showToast('Failed to load document', 'error');
    }
}

// Add zoom functionality
function zoomImage(img) {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
        <img src="${img.src}" alt="Zoomed image">
        <div class="zoom-close"><i class="fas fa-times"></i></div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function() {
        overlay.remove();
    });
}

async function downloadDocument(docId, docTitle) {
    try {
        const doc = await apiRequest(`/documents/${docId}`);
        
        if (!doc || !doc.files || doc.files.length === 0) {
            showToast('No files available for download', 'error');
            return;
        }
        
        showToast('Preparing download...', 'success');
        
        // If there's only one file and it's a PDF, download directly
        if (doc.files.length === 1 && doc.files[0].url.endsWith('.pdf')) {
            const link = document.createElement('a');
            link.href = doc.files[0].url;
            link.download = `${docTitle}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Track download
            await apiRequest(`/documents/${docId}/download`, { method: 'POST' });
            showToast('Download started!', 'success');
            return;
        }
        
        // For images, we'll need to convert to PDF
        // For now, download the first file
        const link = document.createElement('a');
        link.href = doc.files[0].url;
        link.download = `${docTitle}${doc.files[0].url.substring(doc.files[0].url.lastIndexOf('.'))}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track download
        await apiRequest(`/documents/${docId}/download`, { method: 'POST' });
        showToast('Download started!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showToast('Download failed', 'error');
    }
}

// View All News
function viewAllNews() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>News & Events</h1>
                <p>Stay updated with our latest announcements</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div id="allNewsGrid" class="news-grid">
                    <div class="loading">Loading all news...</div>
                </div>
            </div>
        </section>
    `;
    
    loadAllNews();
}

async function loadAllNews() {
    const container = document.getElementById('allNewsGrid');
    
    try {
        const response = await apiRequest('/news?limit=100');
        const news = response.news || [];
        
        if (news.length === 0) {
            container.innerHTML = '<p class="text-center">No news available yet.</p>';
            return;
        }
        
        container.innerHTML = news.map(item => `
            <div class="news-card">
                <img src="${item.image || '/images/news-placeholder.jpg'}" 
                     alt="${item.title}" 
                     class="news-image"
                     loading="lazy">
                <div class="news-content">
                    <div class="news-date">${formatDate(item.publishedAt)}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt || item.content.substring(0, 150) + '...'}</p>
                    <button class="news-link" onclick="viewNewsDetail('${item.id}')">
                        Read More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load news:', error);
        container.innerHTML = '<p class="text-center">Failed to load news.</p>';
    }
}

function viewNewsDetail(newsId) {
    showToast(`Loading news article ${newsId}...`, 'success');
    // Full implementation would show news details
}

// Edit Collection
function editCollection(collectionId) {
    showToast(`Edit collection ${collectionId}`, 'success');
    // Full implementation would show edit form
}

// Delete Collection
function deleteCollection(collectionId) {
    const modal = createConfirmDialog(
        'Delete Collection',
        'Are you sure you want to delete this collection? This action cannot be undone.',
        async () => {
            try {
                await apiRequest(`/collections/${collectionId}`, {
                    method: 'DELETE'
                });
                closeModal(modal);
                showToast('Collection deleted successfully!', 'success');
                showManageCollections();
            } catch (error) {
                showToast('Failed to delete collection', 'error');
            }
        }
    );
}

// View Request Details
async function viewRequestDetails(requestId) {
    try {
        const response = await apiRequest('/research-requests');
        const request = response.requests.find(r => r.id === requestId);
        
        if (!request) {
            showToast('Request not found', 'error');
            return;
        }
        
        const modal = createModal('Research Request Details', `
            <div class="request-detail">
                <div class="request-header">
                    <h3>${request.researchTopic}</h3>
                    <span class="badge badge-${request.status}">
                        ${request.status.toUpperCase()}
                    </span>
                </div>
                
                <div class="request-info-grid">
                    <div class="info-item">
                        <label><i class="fas fa-user"></i> Researcher:</label>
                        <p>${request.researcherName}</p>
                    </div>
                    <div class="info-item">
                        <label><i class="fas fa-envelope"></i> Email:</label>
                        <p><a href="mailto:${request.email}">${request.email}</a></p>
                    </div>
                    <div class="info-item">
                        <label><i class="fas fa-phone"></i> Phone:</label>
                        <p>${request.phone || 'Not provided'}</p>
                    </div>
                    <div class="info-item">
                        <label><i class="fas fa-building"></i> Affiliation:</label>
                        <p>${request.affiliation || 'Not provided'}</p>
                    </div>
                    <div class="info-item">
                        <label><i class="fas fa-calendar"></i> Submitted:</label>
                        <p>${formatDate(request.submittedAt)}</p>
                    </div>
                    <div class="info-item">
                        <label><i class="fas fa-clock"></i> Timeframe:</label>
                        <p>${request.timeframe || 'Not specified'}</p>
                    </div>
                </div>
                
                <div class="request-requirements">
                    <label><i class="fas fa-list"></i> Requirements:</label>
                    <p>${request.specificRequirements}</p>
                </div>
                
                <div class="request-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-success" onclick="updateRequestStatus('${requestId}', 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger" onclick="updateRequestStatus('${requestId}', 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : request.status === 'approved' ? `
                        <button class="btn btn-primary" onclick="updateRequestStatus('${requestId}', 'in-progress')">
                            <i class="fas fa-play"></i> In Progress
                        </button>
                        <button class="btn btn-success" onclick="updateRequestStatus('${requestId}', 'completed')">
                            <i class="fas fa-check-circle"></i> Complete
                        </button>
                    ` : request.status === 'in-progress' ? `
                        <button class="btn btn-success" onclick="updateRequestStatus('${requestId}', 'completed')">
                            <i class="fas fa-check-circle"></i> Complete
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Close</button>
                </div>
            </div>
        `);
    } catch (error) {
        showToast('Failed to load request', 'error');
    }
}

async function updateRequestStatus(requestId, newStatus) {
    try {
        await apiRequest(`/research-requests/${requestId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        showToast(`Request ${newStatus}!`, 'success');
        
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
        
        showViewRequests();
    } catch (error) {
        showToast('Failed to update status', 'error');
    }
}

// Filter Requests
async function filterRequests(status) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load and filter requests
    const container = document.getElementById('requestsTable');
    container.innerHTML = '<div class="loading">Loading requests...</div>';
    
    try {
        const response = await apiRequest('/research-requests');
        let requests = response.requests || [];
        
        // Filter by status
        if (status !== 'all') {
            requests = requests.filter(req => req.status === status);
        }
        
        if (requests.length === 0) {
            container.innerHTML = `<p class="text-center">No ${status === 'all' ? '' : status} requests found.</p>`;
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Researcher</th>
                        <th>Topic</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${requests.map(req => `
                        <tr>
                            <td>
                                <strong>${req.researcherName}</strong><br>
                                <small>${req.email}</small>
                            </td>
                            <td>${req.researchTopic}</td>
                            <td>${formatDate(req.submittedAt)}</td>
                            <td>
                                <span class="badge badge-${req.status}">
                                    ${req.status.toUpperCase()}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-icon" onclick="viewRequestDetails('${req.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        container.innerHTML = '<p class="error-message">Failed to load requests.</p>';
    }
}
// Upload Gallery Feature
function showUploadGallery() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-images"></i> Upload Gallery</h1>
                    <button class="btn btn-secondary" onclick="showAdminDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
                
                <div class="upload-container">
                    <div class="upload-area" id="galleryUploadArea">
                        <i class="fas fa-cloud-upload-alt upload-icon"></i>
                        <h3>Drag & Drop Gallery Images Here</h3>
                        <p>or</p>
                        <button class="btn btn-primary" onclick="document.getElementById('galleryFileInput').click()">
                            <i class="fas fa-folder-open"></i> Browse Images
                        </button>
                        <input type="file" id="galleryFileInput" multiple accept="image/*" style="display: none;">
                        <p class="upload-info">Supported formats: JPG, PNG (Max 50MB per file)</p>
                    </div>
                    
                    <div id="galleryFilePreview" class="file-preview"></div>
                    
                    <div id="galleryMetadataForm" class="metadata-form" style="display: none;">
                        <h3>Gallery Information</h3>
                        <form id="galleryUploadForm">
                            <div class="form-group">
                                <label for="galleryTitle">Title</label>
                                <input type="text" id="galleryTitle" placeholder="Gallery title (optional)">
                            </div>
                            
                            <div class="form-group">
                                <label for="galleryDescription">Description</label>
                                <textarea id="galleryDescription" rows="3" placeholder="Optional description"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="galleryPublished" checked>
                                    Publish images immediately
                                </label>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Upload Gallery
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="showAdminDashboard()">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    initGalleryUploadArea();
}

function initGalleryUploadArea() {
    const uploadArea = document.getElementById('galleryUploadArea');
    const fileInput = document.getElementById('galleryFileInput');
    const filePreview = document.getElementById('galleryFilePreview');
    const metadataForm = document.getElementById('galleryMetadataForm');
    let selectedFiles = [];
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    function handleFiles(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            showToast('Please select image files only', 'error');
            return;
        }
        selectedFiles = imageFiles;
        // Store globally immediately
        window.currentGalleryFiles = selectedFiles;
        
        displayFilePreview(selectedFiles);
        if (metadataForm) {
            metadataForm.style.display = 'block';
        }
    }
    
    function displayFilePreview(files) {
        if (!filePreview) return;
        
        filePreview.innerHTML = '<h3>Selected Images (' + files.length + ')</h3><div class="gallery-preview-grid"></div>';
        const grid = filePreview.querySelector('.gallery-preview-grid');
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgCard = document.createElement('div');
                imgCard.className = 'gallery-preview-card';
                imgCard.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="gallery-preview-info">
                        <strong>${file.name}</strong>
                        <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button class="btn-remove" type="button" onclick="window.removeGalleryImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                grid.appendChild(imgCard);
            };
            reader.readAsDataURL(file);
        });
    }
    
    window.removeGalleryImage = (index) => {
        selectedFiles.splice(index, 1);
        window.currentGalleryFiles = selectedFiles; // Update global
        
        if (selectedFiles.length === 0) {
            filePreview.innerHTML = '';
            if (metadataForm) {
                metadataForm.style.display = 'none';
            }
        } else {
            displayFilePreview(selectedFiles);
        }
    };
    
    const form = document.getElementById('galleryUploadForm');
    if (form) {
        // Remove any existing listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('Gallery form submitted, checking files...');
            console.log('window.currentGalleryFiles:', window.currentGalleryFiles);
            console.log('selectedFiles:', selectedFiles);
            
            // Get current files
            const filesToUpload = window.currentGalleryFiles || selectedFiles;
            
            if (!filesToUpload || filesToUpload.length === 0) {
                showToast('Please select images to upload', 'error');
                return;
            }
            
            await uploadGalleryImages(filesToUpload);
        });
    }
}

async function uploadGalleryImages(files) {
    if (!files || files.length === 0) {
        showToast('Please select images to upload', 'error');
        return;
    }
    
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });
    
    formData.append('title', document.getElementById('galleryTitle')?.value || 'Gallery Image');
    formData.append('description', document.getElementById('galleryDescription')?.value || '');
    formData.append('published', document.getElementById('galleryPublished')?.checked || false);
    
    showToast('Uploading gallery images...', 'success');
    
    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
            showToast(`Successfully uploaded ${files.length} image(s)!`, 'success');
            
            // Reset form
            document.getElementById('galleryUploadForm').reset();
            document.getElementById('galleryFilePreview').innerHTML = '';
            document.getElementById('galleryMetadataForm').style.display = 'none';
            window.currentGalleryFiles = [];
            
            setTimeout(() => {
                showAdminDashboard();
            }, 1500);
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Gallery upload error:', error);
        showToast(error.message || 'Upload failed. Please try again.', 'error');
    }
}

// View Messages Feature
function showViewMessages() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-envelope"></i> Contact Messages</h1>
                    <button class="btn btn-secondary" onclick="showAdminDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div id="messagesTable" class="admin-table-container">
                    <div class="loading">Loading messages...</div>
                </div>
            </div>
        </section>
    `;
    
    loadContactMessages();
}

async function loadContactMessages() {
    const container = document.getElementById('messagesTable');
    
    try {
        const response = await apiRequest('/contact-messages');
        const messages = response.messages || [];
        
        if (messages.length === 0) {
            container.innerHTML = '<p class="text-center">No messages yet.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${messages.map(msg => `
                        <tr class="${msg.read ? '' : 'unread'}">
                            <td><strong>${msg.name}</strong></td>
                            <td>${msg.email}</td>
                            <td>${msg.subject}</td>
                            <td>${formatDate(msg.createdAt)}</td>
                            <td>
                                <span class="badge ${msg.read ? 'badge-success' : 'badge-pending'}">
                                    ${msg.read ? 'READ' : 'UNREAD'}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-icon" onclick="viewMessageDetail('${msg.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteMessage('${msg.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Failed to load messages:', error);
        container.innerHTML = '<p class="error-message">Failed to load messages.</p>';
    }
}

async function viewMessageDetail(messageId) {
    try {
        const response = await apiRequest('/contact-messages');
        const message = response.messages.find(m => m.id === messageId);
        
        if (!message) {
            showToast('Message not found', 'error');
            return;
        }
        
        const modal = createModal('Message Details', `
            <div class="message-detail">
                <div class="message-header">
                    <h3>${message.subject}</h3>
                    <span class="badge ${message.read ? 'badge-success' : 'badge-pending'}">
                        ${message.read ? 'READ' : 'UNREAD'}
                    </span>
                </div>
                <div class="message-meta">
                    <p><strong>From:</strong> ${message.name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${message.email}">${message.email}</a></p>
                    <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
                    <p><strong>Date:</strong> ${formatDate(message.createdAt)}</p>
                </div>
                <div class="message-body">
                    <h4>Message:</h4>
                    <p>${message.message}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Close</button>
                </div>
            </div>
        `);
        
        // Mark as read
        if (!message.read) {
            await apiRequest(`/contact-messages/${messageId}/read`, { method: 'PUT' });
        }
    } catch (error) {
        showToast('Failed to load message details', 'error');
    }
}

async function deleteMessage(messageId) {
    const modal = createConfirmDialog(
        'Delete Message',
        'Are you sure you want to delete this message? This action cannot be undone.',
        async () => {
            try {
                await apiRequest(`/contact-messages/${messageId}`, { method: 'DELETE' });
                closeModal(modal);
                showToast('Message deleted successfully!', 'success');
                showViewMessages();
            } catch (error) {
                showToast('Failed to delete message', 'error');
            }
        }
    );
}

// Public Gallery Page
function showGalleryPage() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Gallery</h1>
                <p>Explore our collection of historical photographs and images</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div id="publicGallery" class="public-gallery-grid">
                    <div class="loading">Loading gallery...</div>
                </div>
            </div>
        </section>
    `;
    
    loadPublicGallery();
}

async function loadPublicGallery() {
    const container = document.getElementById('publicGallery');
    
    try {
        const response = await apiRequest('/gallery');
        const gallery = response.gallery || [];
        
        if (gallery.length === 0) {
            container.innerHTML = '<p class="text-center">No gallery images available yet.</p>';
            return;
        }
        
        container.innerHTML = gallery.map(item => `
            <div class="gallery-item" onclick="viewGalleryImage('${item.id}')">
                <img src="${item.url}" 
                     alt="${item.title}" 
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 dy=%22.3em%22%3EImage%3C/text%3E%3C/svg%3E'">
                <div class="gallery-item-overlay">
                    <h4>${item.title}</h4>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    <span class="gallery-date">${formatDate(item.uploadedAt)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load gallery:', error);
        container.innerHTML = '<p class="text-center">No gallery images available yet.</p>';
    }
}

function viewGalleryImage(imageId) {
    apiRequest('/gallery').then(response => {
        const image = response.gallery.find(img => img.id === imageId);
        if (!image) return;
        
        const modal = createModal('Gallery Image', `
            <div class="gallery-lightbox">
                <img src="${image.url}" alt="${image.title}">
                <div class="gallery-lightbox-info">
                    <h3>${image.title}</h3>
                    ${image.description ? `<p>${image.description}</p>` : ''}
                    <p class="gallery-date"><i class="fas fa-calendar"></i> ${formatDate(image.uploadedAt)}</p>
                </div>
            </div>
        `);
    }).catch(error => {
        showToast('Failed to load image', 'error');
    });
}

// Manage Documents Feature
function showManageDocuments() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-file-alt"></i> Manage Documents</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="showUploadDocuments()">
                            <i class="fas fa-plus"></i> Add New
                        </button>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <div class="table-filters">
                    <input type="text" id="searchDocuments" placeholder="Search documents..." class="search-input">
                    <select id="filterCollection" class="filter-select">
                        <option value="">All Collections</option>
                    </select>
                    <select id="filterStatus" class="filter-select">
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                
                <div id="documentsTable" class="admin-table-container">
                    <div class="loading">Loading documents...</div>
                </div>
            </div>
        </section>
    `;
    
    loadDocumentsTable();
    loadCollectionsForFilter();
}

async function loadDocumentsTable() {
    const container = document.getElementById('documentsTable');
    
    try {
        const response = await apiRequest('/documents?limit=1000');
        const documents = response.documents || [];
        
        if (documents.length === 0) {
            container.innerHTML = '<p class="text-center">No documents yet. Upload your first document!</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Reference</th>
                        <th>Date</th>
                        <th>Collection</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                   ${documents.map(doc => {
                        // Determine which image to show - prioritize coverImage
                        let imageHtml = '';
                        if (doc.coverImage) {
                            imageHtml = `<img src="${doc.coverImage}" alt="" class="doc-thumb" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                                        <i class="fas fa-file doc-icon" style="display:none;"></i>`;
                        } else if (doc.files && doc.files[0] && doc.files[0].thumbnail) {
                            imageHtml = `<img src="${doc.files[0].thumbnail}" alt="" class="doc-thumb" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                                        <i class="fas fa-file doc-icon" style="display:none;"></i>`;
                        } else {
                            imageHtml = '<i class="fas fa-file doc-icon"></i>';
                        }
                        
                        return `
                        <tr>
                            <td>
                                <div class="doc-title-cell">
                                    ${imageHtml}
                                    <strong>${doc.title}</strong>
                                </div>
                            </td>
                            <td>${doc.referenceNumber || '-'}</td>
                            <td>${doc.date ? doc.date.from : '-'}</td>
                            <td>${doc.collection || 'None'}</td>
                            <td>
                                <span class="badge ${doc.published ? 'badge-success' : 'badge-default'}">
                                    ${doc.published ? 'Published' : 'Draft'}
                                </span>
                            </td>
                            <td>${doc.views || 0}</td>
                            <td class="actions">
                                <button class="btn-icon" onclick="editDocument('${doc.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-icon-danger" onclick="deleteDocument('${doc.id}', '${doc.title.replace(/'/g, "\\'")}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Failed to load documents:', error);
        container.innerHTML = '<p class="error-message">Failed to load documents.</p>';
    }
}

async function loadCollectionsForFilter() {
    try {
        const response = await apiRequest('/collections');
        const select = document.getElementById('filterCollection');
        if (select && response.collections) {
            response.collections.forEach(col => {
                const option = document.createElement('option');
                option.value = col.id;
                option.textContent = col.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load collections for filter');
    }
}

function editDocument(docId) {
    apiRequest(`/documents/${docId}`).then(doc => {
        const modal = createModal('Edit Document', `
            <form id="editDocumentForm" class="modal-form">
                <div class="form-group">
                    <label for="editTitle">Title *</label>
                    <input type="text" id="editTitle" value="${doc.title}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editRefNumber">Reference Number</label>
                        <input type="text" id="editRefNumber" value="${doc.referenceNumber || ''}">
                    </div>
                    <div class="form-group">
                        <label for="editCreator">Creator/Author</label>
                        <input type="text" id="editCreator" value="${doc.creator || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="editDescription">Description</label>
                    <textarea id="editDescription" rows="4">${doc.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDateFrom">Date From</label>
                        <input type="date" id="editDateFrom" value="${doc.date ? doc.date.from : ''}">
                    </div>
                    <div class="form-group">
                        <label for="editDateTo">Date To</label>
                        <input type="date" id="editDateTo" value="${doc.date ? doc.date.to : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editPublished" ${doc.published ? 'checked' : ''}>
                        Published
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Document
                    </button>
                </div>
            </form>
        `);
        
        document.getElementById('editDocumentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedData = {
                title: document.getElementById('editTitle').value,
                referenceNumber: document.getElementById('editRefNumber').value,
                creator: document.getElementById('editCreator').value,
                description: document.getElementById('editDescription').value,
                date: {
                    from: document.getElementById('editDateFrom').value,
                    to: document.getElementById('editDateTo').value
                },
                published: document.getElementById('editPublished').checked
            };
            
            try {
                await apiRequest(`/documents/${docId}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedData)
                });
                
                closeModal(modal);
                showToast('Document updated successfully!', 'success');
                showManageDocuments();
            } catch (error) {
                showToast('Failed to update document', 'error');
            }
        });
    }).catch(error => {
        showToast('Failed to load document details', 'error');
    });
}

function deleteDocument(docId, docTitle) {
    const modal = createProfessionalConfirmDialog(
        'Delete Document',
        'Are you sure you want to delete this document?',
        `<strong>${docTitle}</strong><br><br>This action cannot be undone. The document will be permanently removed from the system.`,
        'danger',
        async () => {
            try {
                const response = await fetch(`/api/documents/${docId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    closeModal(modal);
                    showToast('Document deleted successfully!', 'success');
                    
                    // Wait a moment then reload
                    setTimeout(() => {
                        showManageDocuments();
                    }, 500);
                } else {
                    const errorData = await response.json();
                    showToast(errorData.error || 'Failed to delete document', 'error');
                }
            } catch (error) {
                console.error('Delete error:', error);
                showToast('Failed to delete document', 'error');
            }
        }
    );
}

// Manage Gallery Feature
function showManageGallery() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-image"></i> Manage Gallery</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="showUploadGallery()">
                            <i class="fas fa-plus"></i> Add Images
                        </button>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <div id="galleryManageGrid" class="gallery-manage-grid">
                    <div class="loading">Loading gallery...</div>
                </div>
            </div>
        </section>
    `;
    
    loadGalleryManage();
}

async function loadGalleryManage() {
    const container = document.getElementById('galleryManageGrid');
    
    try {
        const response = await fetch('/api/gallery', {
            credentials: 'include'
        });
        const data = await response.json();
        const gallery = data.gallery || [];
        
        if (gallery.length === 0) {
            container.innerHTML = '<p class="text-center">No gallery images yet. Upload your first images!</p>';
            return;
        }
        
        container.innerHTML = gallery.map(item => `
            <div class="gallery-manage-card">
                <img src="${item.url}" alt="${item.title}">
                <div class="gallery-manage-info">
                    <h4>${item.title}</h4>
                    <span class="badge ${item.published ? 'badge-success' : 'badge-default'}">
                        ${item.published ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div class="gallery-manage-actions">
                    <button class="btn-icon" onclick="editGalleryImage('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" onclick="deleteGalleryImage('${item.id}', '${item.title.replace(/'/g, "\\'")}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load gallery:', error);
        container.innerHTML = '<p class="error-message">Failed to load gallery.</p>';
    }
}

function editGalleryImage(imageId) {
    fetch('/api/gallery', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const image = data.gallery.find(img => img.id === imageId);
            if (!image) {
                showToast('Image not found', 'error');
                return;
            }
            
            const modal = createModal('Edit Gallery Image', `
                <form id="editGalleryForm" class="modal-form">
                    <div class="form-group">
                        <img src="${image.url}" alt="${image.title}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;">
                    </div>
                    <div class="form-group">
                        <label for="editGalleryTitle">Title</label>
                        <input type="text" id="editGalleryTitle" value="${image.title}">
                    </div>
                    <div class="form-group">
                        <label for="editGalleryDescription">Description</label>
                        <textarea id="editGalleryDescription" rows="3">${image.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="editGalleryPublished" ${image.published ? 'checked' : ''}>
                            Published
                        </label>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Update
                        </button>
                    </div>
                </form>
            `);
            
            document.getElementById('editGalleryForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const updatedData = {
                    title: document.getElementById('editGalleryTitle').value,
                    description: document.getElementById('editGalleryDescription').value,
                    published: document.getElementById('editGalleryPublished').checked
                };
                
                try {
                    const response = await fetch(`/api/gallery/${imageId}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedData)
                    });
                    
                    if (response.ok) {
                        closeModal(modal);
                        showToast('Gallery image updated!', 'success');
                        showManageGallery();
                    } else {
                        const errorData = await response.json();
                        showToast(errorData.error || 'Update failed', 'error');
                    }
                } catch (error) {
                    console.error('Update error:', error);
                    showToast('Update failed', 'error');
                }
            });
        })
        .catch(error => {
            console.error('Error loading gallery image:', error);
            showToast('Failed to load image details', 'error');
        });
}

function deleteGalleryImage(imageId, imageTitle) {
    const modal = createProfessionalConfirmDialog(
        'Delete Gallery Image',
        'Are you sure you want to delete this image?',
        `<strong>${imageTitle}</strong><br><br>This action cannot be undone. The image will be permanently removed from the gallery.`,
        'danger',
        async () => {
            try {
                await apiRequest(`/gallery/${imageId}`, {
                    method: 'DELETE'
                });
                
                closeModal(modal);
                showToast('Image deleted successfully!', 'success');
                showManageGallery();
            } catch (error) {
                showToast('Failed to delete image', 'error');
            }
        }
    );
}

// Manage News & Events
function showManageNews() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-newspaper"></i> Manage News & Events</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="showCreateNewsModal()">
                            <i class="fas fa-plus"></i> Create News
                        </button>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <div id="newsTable" class="admin-table-container">
                    <div class="loading">Loading news...</div>
                </div>
            </div>
        </section>
    `;
    
    loadNewsTable();
}

async function loadNewsTable() {
    const container = document.getElementById('newsTable');
    
    try {
        const response = await apiRequest('/news?limit=1000');
        const news = response.news || [];
        
        if (news.length === 0) {
            container.innerHTML = '<p class="text-center">No news articles yet. Create your first article!</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Published Date</th>
                        <th>Author</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${news.map(item => `
                        <tr>
                            <td>
                                <div class="doc-title-cell">
                                    ${item.image ? 
                                        `<img src="${item.image}" alt="" class="doc-thumb">` : 
                                        '<i class="fas fa-newspaper doc-icon"></i>'
                                    }
                                    <strong>${item.title}</strong>
                                </div>
                            </td>
                            <td>${formatDate(item.publishedAt)}</td>
                            <td>${item.author || 'Admin'}</td>
                            <td>
                                <span class="badge ${item.featured ? 'badge-success' : 'badge-default'}">
                                    ${item.featured ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-icon" onclick="editNews('${item.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-icon-danger" onclick="deleteNews('${item.id}', '${item.title.replace(/'/g, "\\'")}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Failed to load news:', error);
        container.innerHTML = '<p class="error-message">Failed to load news.</p>';
    }
}

function showCreateNewsModal() {
    const modal = createModal('Create News Article', `
        <form id="createNewsForm" class="modal-form">
            <div class="form-group">
                <label for="newsTitle">Title *</label>
                <input type="text" id="newsTitle" required>
            </div>
            <div class="form-group">
                <label for="newsExcerpt">Excerpt</label>
                <textarea id="newsExcerpt" rows="2" placeholder="Short summary..."></textarea>
            </div>
            <div class="form-group">
                <label for="newsContent">Content *</label>
                <textarea id="newsContent" rows="6" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="newsAuthor">Author</label>
                    <input type="text" id="newsAuthor" value="Archives Team">
                </div>
                <div class="form-group">
                    <label for="newsDate">Published Date</label>
                    <input type="date" id="newsDate" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <div class="form-group">
    <label for="newsImage">News Image</label>
    <div class="image-upload-group">
        <input type="file" id="newsImageUpload" accept="image/*" style="display: none;">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('newsImageUpload').click()">
            <i class="fas fa-image"></i> Upload Image
        </button>
        <span id="newsImageName" style="margin-left: 10px; color: #666;"></span>
    </div>
    <div id="newsImagePreview" style="margin-top: 10px;"></div>
</div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="newsFeatured">
                    Featured Article
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Create Article
                </button>
            </div>
        </form>
    `);
    
    document.getElementById('createNewsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = '';
    
    // Upload image first if selected
    if (window.currentNewsImage) {
        const formData = new FormData();
        formData.append('images', window.currentNewsImage);
        
        try {
            const uploadResponse = await fetch('/api/gallery', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success && uploadResult.items[0]) {
                imageUrl = uploadResult.items[0].url;
            }
        } catch (error) {
            console.error('Image upload error:', error);
        }
    }
    
    const newsData = {
        title: document.getElementById('newsTitle').value,
        excerpt: document.getElementById('newsExcerpt').value,
        content: document.getElementById('newsContent').value,
        author: document.getElementById('newsAuthor').value,
        publishedAt: document.getElementById('newsDate').value + 'T00:00:00Z',
        image: imageUrl,  // Use uploaded image URL instead
        featured: document.getElementById('newsFeatured').checked
    };
    
    try {
        await apiRequest('/news', {
            method: 'POST',
            body: JSON.stringify(newsData)
        });
            
            closeModal(modal);
            showToast('News article created successfully!', 'success');
            showManageNews();
        } catch (error) {
            showToast('Failed to create article', 'error');
        }
    });
}

// Add image preview handler
const newsImageInput = document.getElementById('newsImageUpload');
if (newsImageInput) {
    newsImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show filename
            document.getElementById('newsImageName').textContent = file.name;
            
            // Show image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('newsImagePreview').innerHTML = `
                    <img src="${e.target.result}" style="max-width: 200px; border-radius: 8px; border: 2px solid #ddd;">
                `;
            };
            reader.readAsDataURL(file);
            
            // Store file to upload later
            window.currentNewsImage = file;
        }
    });
}

function editNews(newsId) {
    apiRequest(`/news/${newsId}`).then(news => {
        const modal = createModal('Edit News Article', `
            <form id="editNewsForm" class="modal-form">
                <div class="form-group">
                    <label for="editNewsTitle">Title *</label>
                    <input type="text" id="editNewsTitle" value="${news.title}" required>
                </div>
                <div class="form-group">
                    <label for="editNewsExcerpt">Excerpt</label>
                    <textarea id="editNewsExcerpt" rows="2">${news.excerpt || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editNewsContent">Content *</label>
                    <textarea id="editNewsContent" rows="6" required>${news.content}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editNewsAuthor">Author</label>
                        <input type="text" id="editNewsAuthor" value="${news.author || 'Archives Team'}">
                    </div>
                    <div class="form-group">
                        <label for="editNewsDate">Published Date</label>
                        <input type="date" id="editNewsDate" value="${news.publishedAt.split('T')[0]}">
                    </div>
                </div>
                <div class="form-group">
    <label for="editNewsImage">News Image</label>
    <div class="image-upload-group">
        <input type="file" id="editNewsImageUpload" accept="image/*" style="display: none;">
        <button type="button" class="btn btn-secondary" onclick="document.getElementById('editNewsImageUpload').click()">
            <i class="fas fa-image"></i> ${news.image ? 'Change Image' : 'Upload Image'}
        </button>
        <span id="editNewsImageName" style="margin-left: 10px; color: #666;"></span>
    </div>
    ${news.image ? `
        <div style="margin-top: 10px;">
            <p style="font-size: 12px; color: #666;">Current Image:</p>
            <img src="${news.image}" style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
        </div>
    ` : ''}
    <div id="editNewsImagePreview" style="margin-top: 10px;"></div>
</div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editNewsFeatured" ${news.featured ? 'checked' : ''}>
                        Featured Article
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Article
                    </button>
                </div>
            </form>
        `);

        // Handle image upload and preview for edit
const editNewsImageInput = document.getElementById('editNewsImageUpload');
if (editNewsImageInput) {
    editNewsImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show filename
            document.getElementById('editNewsImageName').textContent = file.name;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('editNewsImagePreview').innerHTML = `
                    <p style="font-size: 12px; color: #666;">New Image Preview:</p>
                    <img src="${e.target.result}" style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
                `;
            };
            reader.readAsDataURL(file);
            
            // Store file globally
            window.currentNewsImage = file;
        }
    });
}
        
        document.getElementById('editNewsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = news.image || '';  // Keep existing image by default
    
    // Upload new image if one was selected
    if (window.currentNewsImage) {
        showToast('Uploading new image...', 'success');
        
        const formData = new FormData();
        formData.append('images', window.currentNewsImage);
        
        try {
            const uploadResponse = await fetch('/api/gallery', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success && uploadResult.items && uploadResult.items[0]) {
                imageUrl = uploadResult.items[0].url;
                console.log('New image uploaded:', imageUrl);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            showToast('Image upload failed, keeping old image', 'error');
        }
        
        // Clear the stored image
        window.currentNewsImage = null;
    }
    
    const updatedData = {
        title: document.getElementById('editNewsTitle').value,
        excerpt: document.getElementById('editNewsExcerpt').value,
        content: document.getElementById('editNewsContent').value,
        author: document.getElementById('editNewsAuthor').value,
        publishedAt: document.getElementById('editNewsDate').value + 'T00:00:00Z',
        image: imageUrl,  // Use new or existing image URL
        featured: document.getElementById('editNewsFeatured').checked
    };
            
            try {
                await apiRequest(`/news/${newsId}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedData)
                });
                
                closeModal(modal);
                showToast('News article updated successfully!', 'success');
                showManageNews();
            } catch (error) {
                showToast('Failed to update article', 'error');
            }
        });
    }).catch(error => {
        showToast('Failed to load news details', 'error');
    });
}

function deleteNews(newsId, newsTitle) {
    const modal = createProfessionalConfirmDialog(
        'Delete News Article',
        'Are you sure you want to delete this article?',
        `<strong>${newsTitle}</strong><br><br>This action cannot be undone. The article will be permanently removed.`,
        'danger',
        async () => {
            try {
                await apiRequest(`/news/${newsId}`, {
                    method: 'DELETE'
                });
                
                closeModal(modal);
                showToast('News article deleted successfully!', 'success');
                showManageNews();
            } catch (error) {
                showToast('Failed to delete article', 'error');
            }
        }
    );
}

function showEducationTab(tab) {
    const content = document.getElementById('educationContent');
    const buttons = document.querySelectorAll('.tab-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tabContent = {
        'students': `
            <h2>For Students</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Primary School (Classes 1-5)</h3>
                    <ul class="resource-list">
                        <li>
                            <a href="#" onclick="showEducationalResource('stories'); return false;">Stories from Manipur's Past</a>
                            <button class="btn-icon-small" onclick="downloadResourceFile('stories', 'pdf'); return false;" title="Download PDF">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn-icon-small" onclick="downloadResourceFile('stories', 'image'); return false;" title="Download Image">
                                <i class="fas fa-image"></i> IMG
                            </button>
                        </li>
                        <li>
                            <a href="#" onclick="showEducationalResource('coloring'); return false;">Historical Coloring Pages</a>
                            <button class="btn-icon-small" onclick="downloadResourceFile('coloring', 'pdf'); return false;" title="Download PDF">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn-icon-small" onclick="downloadResourceFile('coloring', 'image'); return false;" title="Download Image">
                                <i class="fas fa-image"></i> IMG
                            </button>
                        </li>
                        <li>
                            <a href="#" onclick="showEducationalResource('timeline'); return false;">Interactive Timeline</a>
                            <button class="btn-icon-small" onclick="downloadResourceFile('timeline', 'pdf'); return false;" title="Download PDF">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn-icon-small" onclick="downloadResourceFile('timeline', 'image'); return false;" title="Download Image">
                                <i class="fas fa-image"></i> IMG
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Secondary School (Classes 6-10)</h3>
                    <ul class="resource-list">
                        <li><a href="#" onclick="showEducationalResource('freedom'); return false;">Freedom Movement Documents</a></li>
                        <li><a href="#" onclick="showEducationalResource('heritage'); return false;">Cultural Heritage Project Ideas</a></li>
                        <li><a href="#" onclick="showEducationalResource('worksheets'); return false;">Historical Research Worksheets</a></li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Higher Secondary (Classes 11-12)</h3>
                    <ul class="resource-list">
                        <li><a href="#" onclick="showEducationalResource('analysis'); return false;">Primary Source Analysis</a></li>
                        <li><a href="#" onclick="showEducationalResource('methodology'); return false;">Research Methodology Guide</a></li>
                        <li><a href="#" onclick="showEducationalResource('essays'); return false;">Historical Essays & Papers</a></li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Virtual Tours</h3>
                    <p>Take a virtual tour of the archives and learn about preservation.</p>
                    <button class="btn btn-secondary" onclick="showVirtualTour()">Start Virtual Tour</button>
                </div>
            </div>
        `,
        'teachers': `
            <h2>For Teachers</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Lesson Plans</h3>
                    <p>Ready-to-use lesson plans incorporating primary sources.</p>
                    <ul class="resource-list">
                        <li><a href="#" onclick="showTeacherResource('colonial-lessons'); return false;">Colonial Period Lesson Plans</a></li>
                        <li><a href="#" onclick="showTeacherResource('freedom-activities'); return false;">Freedom Movement Activities</a></li>
                        <li><a href="#" onclick="showTeacherResource('heritage-units'); return false;">Cultural Heritage Units</a></li>
                    </ul>
                </div>
                <div class="content-card">
                    <h3>Educational Visits</h3>
                    <p>Book a guided tour for your class to visit the archives.</p>
                    <button class="btn btn-primary" onclick="navigateTo('contact')">Contact Us to Book Visit</button>
                </div>
                <div class="content-card">
                    <h3>Teaching Resources</h3>
                    <ul class="resource-list">
                        <li><a href="#" onclick="showTeacherResource('source-analysis'); return false;">How to Analyze Primary Sources</a></li>
                        <li><a href="#" onclick="showTeacherResource('dbq'); return false;">Document-Based Questions</a></li>
                        <li><a href="#" onclick="showTeacherResource('rubrics'); return false;">Assessment Rubrics</a></li>
                    </ul>
                </div>
            </div>
        `,
        'exhibitions': `
            <h2>Virtual Exhibitions</h2>
            <div class="content-grid">
                <div class="content-card">
                    <h3>Freedom Fighters of Manipur</h3>
                    <p>Explore the stories of brave individuals who fought for independence.</p>
                    <button class="btn btn-secondary" onclick="showExhibition('freedom-fighters')">View Exhibition</button>
                </div>
                <div class="content-card">
                    <h3>Royal Manipur</h3>
                    <p>Journey through the history of the Manipur Kingdom.</p>
                    <button class="btn btn-secondary" onclick="showExhibition('royal-manipur')">View Exhibition</button>
                </div>
                <div class="content-card">
                    <h3>Cultural Heritage</h3>
                    <p>Discover Manipur's rich cultural traditions through historical documents.</p>
                    <button class="btn btn-secondary" onclick="showExhibition('cultural-heritage')">View Exhibition</button>
                </div>
            </div>
        `
    };
    
    content.innerHTML = tabContent[tab] || tabContent['students'];
}

// ===== Modal Helper Functions =====
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function createConfirmDialog(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content confirm-dialog">
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn btn-warning" id="confirmBtn">
                        <i class="fas fa-check"></i> Confirm
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle confirm button
    document.getElementById('confirmBtn').addEventListener('click', () => {
        onConfirm();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function closeModal(modal) {
    if (modal && modal.remove) {
        modal.remove();
    }
}

// Professional Confirmation Dialog with Warning Style
function createProfessionalConfirmDialog(title, subtitle, message, type = 'warning', onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal professional-modal';
    
    const iconMap = {
        'warning': { icon: 'fa-exclamation-triangle', color: '#FF9800' },
        'danger': { icon: 'fa-trash-alt', color: '#F44336' },
        'info': { icon: 'fa-info-circle', color: '#2196F3' }
    };
    
    const iconData = iconMap[type] || iconMap['warning'];
    
    modal.innerHTML = `
        <div class="modal-content professional-confirm">
            <div class="confirm-icon" style="background-color: ${iconData.color}20;">
                <i class="fas ${iconData.icon}" style="color: ${iconData.color};"></i>
            </div>
            <div class="confirm-header">
                <h2>${title}</h2>
                <p class="confirm-subtitle">${subtitle}</p>
            </div>
            <div class="confirm-body">
                <p>${message}</p>
            </div>
            <div class="confirm-actions">
                <button class="btn btn-secondary btn-lg" id="cancelBtn">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn btn-danger btn-lg" id="confirmBtn" style="background-color: ${iconData.color};">
                    <i class="fas fa-check"></i> ${type === 'danger' ? 'Delete' : 'Confirm'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle buttons
    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('confirmBtn').addEventListener('click', () => {
        onConfirm();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on Escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    return modal;
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\d\s()-]{10,}$/;
    return re.test(phone);
}

function addFormValidation(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
    
    formElement.addEventListener('submit', (e) => {
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showToast('Please fix the errors in the form', 'error');
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (input.type === 'tel' && value && !validatePhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Min length check
    if (input.minLength && value.length < input.minLength) {
        isValid = false;
        errorMessage = `Minimum ${input.minLength} characters required`;
    }
    
    // Update UI
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (isValid) {
        input.classList.remove('error');
        if (errorDiv) errorDiv.remove();
    } else {
        input.classList.add('error');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'error-message';
            div.textContent = errorMessage;
            input.parentElement.appendChild(div);
        } else {
            errorDiv.textContent = errorMessage;
        }
    }
    
    return isValid;
}

function showSiteInfoEditor() {
    apiRequest('/settings').then(settings => {
        const modal = createModal('Edit Site Information', `
            <form id="siteInfoForm" class="modal-form">
                <div class="form-group">
                    <label for="siteAddress">Address *</label>
                    <input type="text" id="siteAddress" value="${settings.address}" required>
                </div>
                <div class="form-group">
                    <label for="sitePhone">Phone *</label>
                    <input type="tel" id="sitePhone" value="${settings.phone}" required>
                </div>
                <div class="form-group">
                    <label for="siteEmail">Email *</label>
                    <input type="email" id="siteEmail" value="${settings.email}" required>
                </div>
                <div class="form-group">
                    <label for="siteHours">Hours *</label>
                    <input type="text" id="siteHours" value="${settings.hours}" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        `);
        
        document.getElementById('siteInfoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedSettings = {
                ...settings,
                address: document.getElementById('siteAddress').value,
                phone: document.getElementById('sitePhone').value,
                email: document.getElementById('siteEmail').value,
                hours: document.getElementById('siteHours').value
            };
            
            try {
                await apiRequest('/settings', {
                    method: 'PUT',
                    body: JSON.stringify(updatedSettings)
                });
                
                closeModal(modal);
                showToast('Site info updated!', 'success');
            } catch (error) {
                showToast('Update failed', 'error');
            }
        });
    }).catch(error => {
        showToast('Failed to load settings', 'error');
    });
}

// ===== Initialize All Functions =====
function init() {
    loadFontSizePreference();
    initNavigation();
    initHeroSlider();
    initStatsCounter();
    initCollectionsCarousel();
    initTestimonialsCarousel();
    initQuickSearch();
    initNewsletterForm();
    initBackToTop();
    initHeaderScroll();
    initLazyLoading();
    initScrollAnimations();
    checkAuthStatus();
    initNotifications();
    
    // Load dynamic content
    loadNews();
    
    // Add form validation to all forms
    document.querySelectorAll('form').forEach(form => {
        if (!form.id || !['quickSearchForm', 'newsletterForm'].includes(form.id)) {
            addFormValidation(form);
        }
    });
}

// ===== Page Load =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Export for other scripts =====
window.archivesApp = {
    apiRequest,
    showToast,
    formatDate,
    validateEmail,
    validatePhone,
    currentUser
};

// ===== Research Page Functions =====

function showResearchGuides() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="navigateTo('research')" style="padding: 10px 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Research
                    </button>
                </div>
                <h1>Research Guides</h1>
                <p>Comprehensive guides to help you navigate our collections</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="research-guides-grid">
                    <div class="guide-card">
                        <div class="guide-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>Genealogy Research Guide</h3>
                        <p>Learn how to trace your family history using our extensive collection of birth, marriage, death records, and census data.</p>
                        <div class="guide-topics">
                            <h4>Topics Covered:</h4>
                            <ul>
                                <li>Getting Started with Family History</li>
                                <li>Using Census Records</li>
                                <li>Birth, Marriage & Death Records</li>
                                <li>Land and Property Records</li>
                                <li>Military Service Records</li>
                                <li>Immigration Documents</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showGuideDetail('genealogy')">
                            <i class="fas fa-book-open"></i> View Full Guide
                        </button>
                    </div>

                    <div class="guide-card">
                        <div class="guide-icon">
                            <i class="fas fa-landmark"></i>
                        </div>
                        <h3>Local History Resources</h3>
                        <p>Discover resources for researching the history of communities, buildings, and events in Manipur.</p>
                        <div class="guide-topics">
                            <h4>Topics Covered:</h4>
                            <ul>
                                <li>Community Histories</li>
                                <li>Historical Maps and Surveys</li>
                                <li>Newspaper Archives</li>
                                <li>Photographs and Visual Records</li>
                                <li>Oral Histories</li>
                                <li>Building and Architectural Records</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showGuideDetail('local-history')">
                            <i class="fas fa-book-open"></i> View Full Guide
                        </button>
                    </div>

                    <div class="guide-card">
                        <div class="guide-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        <h3>Land Records & Property</h3>
                        <p>Guide to researching land ownership, property transactions, and settlement records.</p>
                        <div class="guide-topics">
                            <h4>Topics Covered:</h4>
                            <ul>
                                <li>Land Settlement Records</li>
                                <li>Property Deeds and Transfers</li>
                                <li>Revenue Records</li>
                                <li>Survey Maps</li>
                                <li>Boundary Disputes</li>
                                <li>Agricultural Records</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showGuideDetail('land-records')">
                            <i class="fas fa-book-open"></i> View Full Guide
                        </button>
                    </div>

                    <div class="guide-card">
                        <div class="guide-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <h3>Colonial Period Documents</h3>
                        <p>Navigate British administrative records and correspondence from the colonial era.</p>
                        <div class="guide-topics">
                            <h4>Topics Covered:</h4>
                            <ul>
                                <li>Political Agent Correspondence</li>
                                <li>Administrative Reports</li>
                                <li>Legal Documents</li>
                                <li>Revenue and Tax Records</li>
                                <li>Military Records</li>
                                <li>Treaty Documents</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showGuideDetail('colonial-period')">
                            <i class="fas fa-book-open"></i> View Full Guide
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showGuideDetail(guideType) {
    const guides = {
        'genealogy': {
            title: 'Genealogy Research Guide',
            icon: 'fa-users',
            intro: 'This comprehensive guide will help you trace your family history using the resources available at Manipur State Archives.',
            sections: [
                {
                    title: '1. Getting Started',
                    content: `
                        <p><strong>Before you visit:</strong></p>
                        <ul>
                            <li>Gather information you already know about your family</li>
                            <li>Talk to older relatives and record their memories</li>
                            <li>Collect family documents, photos, and letters</li>
                            <li>Create a basic family tree with known information</li>
                        </ul>
                    `
                },
                {
                    title: '2. Using Census Records',
                    content: `
                        <p>Census records are valuable for:</p>
                        <ul>
                            <li>Confirming names, ages, and relationships</li>
                            <li>Discovering where ancestors lived</li>
                            <li>Finding occupations and literacy status</li>
                            <li>Tracking family migration patterns</li>
                        </ul>
                        <p><strong>Available Census Years:</strong> 1881, 1891, 1901, 1911, 1921, 1931, 1941</p>
                    `
                },
                {
                    title: '3. Birth, Marriage & Death Records',
                    content: `
                        <p>Vital records available include:</p>
                        <ul>
                            <li><strong>Birth Records:</strong> Name, date, parents, place of birth</li>
                            <li><strong>Marriage Records:</strong> Names, ages, parents, witnesses</li>
                            <li><strong>Death Records:</strong> Name, age, cause, place of death</li>
                        </ul>
                        <p><strong>Coverage:</strong> 1870s onwards (varies by district)</p>
                    `
                },
                {
                    title: '4. Land and Property Records',
                    content: `
                        <p>Land records can reveal:</p>
                        <ul>
                            <li>Property ownership and transfers</li>
                            <li>Residency in specific areas</li>
                            <li>Economic status and wealth</li>
                            <li>Family relationships through inheritance</li>
                        </ul>
                    `
                },
                {
                    title: '5. Tips for Success',
                    content: `
                        <ul>
                            <li>Start with what you know and work backwards</li>
                            <li>Verify information using multiple sources</li>
                            <li>Consider variant spellings of names</li>
                            <li>Note all sources and document references</li>
                            <li>Be patient - research takes time</li>
                            <li>Contact us for assistance when needed</li>
                        </ul>
                    `
                }
            ]
        },
        'local-history': {
            title: 'Local History Resources Guide',
            icon: 'fa-landmark',
            intro: 'Research the history of communities, buildings, and events in Manipur using our diverse collections.',
            sections: [
                {
                    title: '1. Starting Your Research',
                    content: `
                        <p>Define your research question:</p>
                        <ul>
                            <li>What place or community are you studying?</li>
                            <li>What time period interests you?</li>
                            <li>What specific aspects (social, economic, cultural)?</li>
                        </ul>
                    `
                },
                {
                    title: '2. Historical Maps',
                    content: `
                        <p>Our map collection includes:</p>
                        <ul>
                            <li>Survey maps from 1870s onwards</li>
                            <li>District and village boundaries</li>
                            <li>Topographical surveys</li>
                            <li>Urban development plans</li>
                            <li>Historical route maps</li>
                        </ul>
                    `
                },
                {
                    title: '3. Newspaper Archives',
                    content: `
                        <p>Newspapers provide insights into:</p>
                        <ul>
                            <li>Daily life and social events</li>
                            <li>Political developments</li>
                            <li>Business and commerce</li>
                            <li>Advertisements and announcements</li>
                            <li>Local controversies and debates</li>
                        </ul>
                    `
                },
                {
                    title: '4. Photographs and Visual Records',
                    content: `
                        <p>Visual materials document:</p>
                        <ul>
                            <li>Street scenes and buildings</li>
                            <li>Events and ceremonies</li>
                            <li>People and daily activities</li>
                            <li>Infrastructure development</li>
                        </ul>
                    `
                }
            ]
        },
        'land-records': {
            title: 'Land Records & Property Guide',
            icon: 'fa-home',
            intro: 'Navigate land ownership records, property transactions, and settlement documentation.',
            sections: [
                {
                    title: '1. Types of Land Records',
                    content: `
                        <ul>
                            <li><strong>Settlement Records:</strong> Initial land distribution</li>
                            <li><strong>Revenue Records:</strong> Tax and assessment documents</li>
                            <li><strong>Deed Registers:</strong> Property transfers and sales</li>
                            <li><strong>Survey Maps:</strong> Property boundaries and measurements</li>
                            <li><strong>Court Records:</strong> Disputes and legal proceedings</li>
                        </ul>
                    `
                },
                {
                    title: '2. How to Search Land Records',
                    content: `
                        <p>Information you'll need:</p>
                        <ul>
                            <li>Property location (village/district)</li>
                            <li>Survey number or plot number</li>
                            <li>Owner's name (if known)</li>
                            <li>Approximate time period</li>
                        </ul>
                    `
                },
                {
                    title: '3. Understanding Land Documents',
                    content: `
                        <p>Common terms and abbreviations:</p>
                        <ul>
                            <li><strong>Patta:</strong> Land title deed</li>
                            <li><strong>Khata:</strong> Revenue account</li>
                            <li><strong>Jamabandi:</strong> Register of holdings</li>
                            <li><strong>Khasra:</strong> Field survey map</li>
                        </ul>
                    `
                }
            ]
        },
        'colonial-period': {
            title: 'Colonial Period Documents Guide',
            icon: 'fa-university',
            intro: 'Access and understand British administrative records from 1891-1947.',
            sections: [
                {
                    title: '1. Political Agent Correspondence',
                    content: `
                        <p>Letters and reports between:</p>
                        <ul>
                            <li>Political Agent and Maharaja</li>
                            <li>Political Agent and British India Government</li>
                            <li>Local officials and British authorities</li>
                        </ul>
                        <p>Topics include: Administration, law and order, revenue, military affairs</p>
                    `
                },
                {
                    title: '2. Administrative Reports',
                    content: `
                        <ul>
                            <li><strong>Annual Reports:</strong> Overview of state affairs</li>
                            <li><strong>Department Reports:</strong> Specific areas (education, health, etc.)</li>
                            <li><strong>Statistical Returns:</strong> Population, revenue, trade data</li>
                            <li><strong>Judicial Reports:</strong> Court proceedings and cases</li>
                        </ul>
                    `
                },
                {
                    title: '3. Treaties and Agreements',
                    content: `
                        <p>Key documents include:</p>
                        <ul>
                            <li>Treaty of Yandabo (1826)</li>
                            <li>Agreement of 1891</li>
                            <li>Subsequent modifications and agreements</li>
                            <li>Boundary settlements</li>
                        </ul>
                    `
                }
            ]
        }
    };

    const guide = guides[guideType];
    if (!guide) return;

    const modal = createModal(guide.title, `
        <div class="guide-detail">
            <div class="guide-header">
                <i class="fas ${guide.icon} guide-header-icon"></i>
                <p class="guide-intro">${guide.intro}</p>
            </div>
            <div class="guide-content">
                ${guide.sections.map(section => `
                    <div class="guide-section">
                        <h3>${section.title}</h3>
                        ${section.content}
                    </div>
                `).join('')}
            </div>
            <div class="guide-footer">
                <div class="guide-help-box">
                    <i class="fas fa-question-circle"></i>
                    <div>
                        <strong>Need Help?</strong>
                        <p>Our archivists are available to assist you with your research.</p>
                        <button class="btn btn-primary" onclick="showResearchRequestForm(); closeModal(document.querySelector('.modal'))">
                            <i class="fas fa-envelope"></i> Request Research Assistance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function showFindingAids() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="navigateTo('research')" style="padding: 10px 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Research
                    </button>
                </div>
                <h1>Finding Aids</h1>
                <p>Detailed inventories of our archival holdings organized by collection</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="finding-aids-intro">
                    <p>Finding aids are detailed descriptions of our archival collections that help you locate relevant materials for your research. Each finding aid includes information about the collection's contents, organization, and historical context.</p>
                </div>
                
                <div class="finding-aids-search">
                    <input type="text" id="findingAidsSearch" placeholder="Search finding aids..." class="search-input">
                    <select id="findingAidsFilter" class="filter-select">
                        <option value="">All Collections</option>
                        <option value="royal">Royal Chronicles</option>
                        <option value="freedom">Freedom Movement</option>
                        <option value="colonial">Colonial Administration</option>
                        <option value="cultural">Cultural Heritage</option>
                    </select>
                </div>

                <div class="finding-aids-grid">
                    <div class="finding-aid-card">
                        <div class="finding-aid-header">
                            <h3>Royal Chronicles Collection</h3>
                            <span class="finding-aid-code">MSA/RC/001</span>
                        </div>
                        <div class="finding-aid-body">
                            <p><strong>Dates:</strong> 1709-1947</p>
                            <p><strong>Extent:</strong> 342 items (45 linear feet)</p>
                            <p><strong>Creator:</strong> Manipur Royal Court</p>
                            <p><strong>Language:</strong> Meitei Mayek, English</p>
                            <p><strong>Abstract:</strong> Official records, correspondence, and administrative documents from the Manipur Kingdom rulers, including royal decrees, court proceedings, diplomatic correspondence, and administrative orders.</p>
                            <div class="finding-aid-series">
                                <h4>Series:</h4>
                                <ul>
                                    <li>Series 1: Royal Decrees and Proclamations (1709-1947)</li>
                                    <li>Series 2: Court Proceedings (1790-1947)</li>
                                    <li>Series 3: Diplomatic Correspondence (1826-1947)</li>
                                    <li>Series 4: Administrative Orders (1850-1947)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="finding-aid-footer">
                            <button class="btn btn-primary" onclick="downloadFindingAid('royal-chronicles')">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                            <button class="btn btn-secondary" onclick="viewCollectionDetail('COL001')">
                                <i class="fas fa-folder-open"></i> Browse Collection
                            </button>
                        </div>
                    </div>

                    <div class="finding-aid-card">
                        <div class="finding-aid-header">
                            <h3>Freedom Movement Collection</h3>
                            <span class="finding-aid-code">MSA/FM/001</span>
                        </div>
                        <div class="finding-aid-body">
                            <p><strong>Dates:</strong> 1930-1950</p>
                            <p><strong>Extent:</strong> 218 items (28 linear feet)</p>
                            <p><strong>Creator:</strong> Various freedom fighters and organizations</p>
                            <p><strong>Language:</strong> English, Hindi, Meitei</p>
                            <p><strong>Abstract:</strong> Documents related to Manipur's participation in India's independence movement, including correspondence between freedom fighters, organizational records, newspaper clippings, and personal papers.</p>
                            <div class="finding-aid-series">
                                <h4>Series:</h4>
                                <ul>
                                    <li>Series 1: Correspondence (1930-1947)</li>
                                    <li>Series 2: Organizational Records (1935-1950)</li>
                                    <li>Series 3: Personal Papers (1940-1947)</li>
                                    <li>Series 4: Newspapers and Publications (1942-1950)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="finding-aid-footer">
                            <button class="btn btn-primary" onclick="downloadFindingAid('freedom-movement')">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                            <button class="btn btn-secondary" onclick="viewCollectionDetail('COL002')">
                                <i class="fas fa-folder-open"></i> Browse Collection
                            </button>
                        </div>
                    </div>

                    <div class="finding-aid-card">
                        <div class="finding-aid-header">
                            <h3>Colonial Administration Collection</h3>
                            <span class="finding-aid-code">MSA/CA/001</span>
                        </div>
                        <div class="finding-aid-body">
                            <p><strong>Dates:</strong> 1891-1947</p>
                            <p><strong>Extent:</strong> 456 items (62 linear feet)</p>
                            <p><strong>Creator:</strong> British Political Agent's Office</p>
                            <p><strong>Language:</strong> English, Meitei</p>
                            <p><strong>Abstract:</strong> British administrative records including correspondence between Political Agents and the Maharaja, annual reports, judicial records, revenue documents, and survey reports.</p>
                            <div class="finding-aid-series">
                                <h4>Series:</h4>
                                <ul>
                                    <li>Series 1: Political Agent Correspondence (1891-1947)</li>
                                    <li>Series 2: Annual Reports (1891-1947)</li>
                                    <li>Series 3: Judicial Records (1891-1947)</li>
                                    <li>Series 4: Revenue Documents (1891-1947)</li>
                                    <li>Series 5: Survey and Settlement Reports (1900-1940)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="finding-aid-footer">
                            <button class="btn btn-primary" onclick="downloadFindingAid('colonial-admin')">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                            <button class="btn btn-secondary" onclick="viewCollectionDetail('COL003')">
                                <i class="fas fa-folder-open"></i> Browse Collection
                            </button>
                        </div>
                    </div>

                    <div class="finding-aid-card">
                        <div class="finding-aid-header">
                            <h3>Cultural Heritage Collection</h3>
                            <span class="finding-aid-code">MSA/CH/001</span>
                        </div>
                        <div class="finding-aid-body">
                            <p><strong>Dates:</strong> 1800-2000</p>
                            <p><strong>Extent:</strong> 567 items (38 linear feet)</p>
                            <p><strong>Creator:</strong> Various authors and collectors</p>
                            <p><strong>Language:</strong> Meitei Mayek, English, Bengali</p>
                            <p><strong>Abstract:</strong> Manuscripts, photographs, and documents related to Manipuri culture, including religious texts, performing arts documentation, traditional medicine records, and folklore collections.</p>
                            <div class="finding-aid-series">
                                <h4>Series:</h4>
                                <ul>
                                    <li>Series 1: Religious Manuscripts (1800-1950)</li>
                                    <li>Series 2: Performing Arts Documentation (1900-2000)</li>
                                    <li>Series 3: Photographs (1890-1990)</li>
                                    <li>Series 4: Folklore and Oral Traditions (1920-1980)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="finding-aid-footer">
                            <button class="btn btn-primary" onclick="downloadFindingAid('cultural-heritage')">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                            <button class="btn btn-secondary" onclick="viewCollectionDetail('COL004')">
                                <i class="fas fa-folder-open"></i> Browse Collection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function downloadFindingAid(aidType) {
    showToast('Preparing finding aid PDF for download...', 'success');
    // In a real implementation, this would download a PDF file
    setTimeout(() => {
        showToast('Finding aid download started!', 'success');
    }, 1000);
}

function showReferenceTools() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <button class="btn btn-secondary" onclick="navigateTo('research')" style="padding: 10px 20px;">
                        <i class="fas fa-arrow-left"></i> Back to Research
                    </button>
                </div>
                <h1>Reference Tools</h1>
                <p>Essential resources for understanding historical documents and conducting research</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="reference-tools-grid">
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3>Historical Timeline of Manipur</h3>
                        <p>Interactive timeline covering major events from ancient times to modern era</p>
                        <div class="timeline-preview">
                            <ul>
                                <li><strong>33 CE:</strong> Establishment of Manipur Kingdom</li>
                                <li><strong>1709:</strong> Introduction of Hindu Vaishnavism</li>
                                <li><strong>1826:</strong> Treaty of Yandabo</li>
                                <li><strong>1891:</strong> Anglo-Manipur War</li>
                                <li><strong>1947:</strong> India's Independence</li>
                                <li><strong>1972:</strong> Manipur becomes full state</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showTimeline()">
                            <i class="fas fa-eye"></i> View Full Timeline
                        </button>
                    </div>

                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <h3>Glossary of Archival Terms</h3>
                        <p>Definitions of common terms used in archival research and historical documents</p>
                        <div class="glossary-preview">
                            <dl>
                                <dt>Accession</dt>
                                <dd>The formal acceptance of archives or manuscripts into a repository</dd>
                                <dt>Provenance</dt>
                                <dd>The origin or source of materials and their chain of custody</dd>
                                <dt>Finding Aid</dt>
                                <dd>A tool that facilitates discovery of archival materials</dd>
                            </dl>
                        </div>
                        <button class="btn btn-primary" onclick="showGlossary()">
                            <i class="fas fa-search"></i> Browse Full Glossary
                        </button>
                    </div>

                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-language"></i>
                        </div>
                        <h3>Guide to Reading Old Scripts</h3>
                        <p>Learn to read historical Meitei Mayek and understand paleography basics</p>
                        <div class="script-preview">
                            <p><strong>Topics covered:</strong></p>
                            <ul>
                                <li>Evolution of Meitei Mayek script</li>
                                <li>Reading handwritten documents</li>
                                <li>Common abbreviations</li>
                                <li>Dating conventions</li>
                                <li>Deciphering difficult texts</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showScriptGuide()">
                            <i class="fas fa-graduation-cap"></i> View Guide
                        </button>
                    </div>

                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-sitemap"></i>
                        </div>
                        <h3>Administrative History</h3>
                        <p>Overview of governmental and administrative structures throughout history</p>
                        <div class="admin-preview">
                            <p><strong>Periods covered:</strong></p>
                            <ul>
                                <li>Manipur Kingdom (33 CE - 1891)</li>
                                <li>British Political Agency (1891-1947)</li>
                                <li>Chief Commissioner's Province (1947-1950)</li>
                                <li>Part C State (1950-1956)</li>
                                <li>Union Territory (1956-1972)</li>
                                <li>Full Statehood (1972-present)</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="showAdminHistory()">
                            <i class="fas fa-university"></i> Explore History
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showTimeline() {
    const modal = createModal('Historical Timeline of Manipur', `
        <div class="timeline-detail">
            <div class="timeline-container">
                ${timelineEvents.map(event => `
                    <div class="timeline-event">
                        <div class="timeline-date">
                            <span class="year">${event.year}</span>
                        </div>
                        <div class="timeline-content">
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

const timelineEvents = [
    { year: '33 CE', title: 'Kingdom Establishment', description: 'Traditional date for the establishment of the Manipur Kingdom under King Nongda Lairen Pakhangba.' },
    { year: '1709', title: 'Introduction of Vaishnavism', description: 'King Charairongba adopts Hindu Vaishnavism, marking a significant cultural transformation.' },
    { year: '1762', title: 'Burmese Invasions Begin', description: 'First of seven Burmese invasions (Chahi-Taret Khuntakpa) begins, lasting until 1819.' },
    { year: '1826', title: 'Treaty of Yandabo', description: 'Treaty signed ending First Anglo-Burmese War; Manipur becomes British protectorate.' },
    { year: '1891', title: 'Anglo-Manipur War', description: 'Conflict between British India and Manipur Kingdom, resulting in British annexation.' },
    { year: '1944', title: 'Battle of Imphal', description: 'Major World War II battle fought in Manipur between Allied and Japanese forces.' },
    { year: '1947', title: 'Indian Independence', description: 'Maharaja Bodhchandra Singh signs Instrument of Accession to India.' },
    { year: '1949', title: 'Merger Agreement', description: 'Manipur merges with Indian Union, becoming a Chief Commissioner\'s Province.' },
    { year: '1972', title: 'Full Statehood', description: 'Manipur becomes the 19th state of the Indian Union on January 21.' }
];

function showGlossary() {
    const modal = createModal('Glossary of Archival Terms', `
        <div class="glossary-detail">
            <div class="glossary-search">
                <input type="text" id="glossarySearch" placeholder="Search terms..." class="search-input">
            </div>
            <div class="glossary-list">
                ${glossaryTerms.map(term => `
                    <div class="glossary-item">
                        <dt>${term.term}</dt>
                        <dd>${term.definition}</dd>
                    </div>
                `).join('')}
            </div>
        </div>
    `);
}

const glossaryTerms = [
    { term: 'Accession', definition: 'The formal acceptance of archives, records, or manuscripts into the physical and legal custody of a repository.' },
    { term: 'Appraisal', definition: 'The process of determining the value and thus the disposition of records based on their current administrative, legal, and fiscal use; their evidential and informational value; their arrangement and condition; their intrinsic value; and their relationship to other records.' },
    { term: 'Archival Description', definition: 'The process of capturing, collating, analyzing, and organizing any information that serves to identify archival materials and explain the context and records systems that produced them.' },
    { term: 'Collection', definition: 'An artificial accumulation of materials assembled by an individual or organization on the basis of some common characteristic.' },
    { term: 'Conservation', definition: 'The treatment of materials to stabilize them chemically and/or strengthen them physically, sustaining their survival as long as possible in their original form.' },
    { term: 'Donor', definition: 'An individual, family, or organization that gives archival materials to a repository.' },
    { term: 'Finding Aid', definition: 'A tool that facilitates discovery of information within a collection of records.' },
    { term: 'Fonds', definition: 'The entire body of records of an organization, family, or individual that have been created and accumulated as the result of an organic process.' },
    { term: 'Manuscript', definition: 'A handwritten or typed document, as distinguished from a printed document.' },
    { term: 'Original Order', definition: 'The principle that records should be maintained in the order in which they were placed by the creator.' },
    { term: 'Preservation', definition: 'The protection of cultural property through activities that minimize chemical and physical deterioration and damage.' },
    { term: 'Provenance', definition: 'The origin or source of something; information regarding the origins, custody, and ownership of an item or collection.' },
    { term: 'Patta', definition: 'A land title deed or grant document issued by the government recognizing ownership of land.' },
    { term: 'Jamabandi', definition: 'A register of holdings showing details of land ownership, area, revenue assessment, and cultivation.' },
    { term: 'Darbar', definition: 'Royal court or formal assembly held by the Maharaja for administrative and ceremonial purposes.' }
];

function showScriptGuide() {
    const modal = createModal('Guide to Reading Old Scripts', `
        <div class="script-guide">
            <p>Learn to read historical Meitei Mayek and understand paleography basics.</p>
            <h3>Topics Covered:</h3>
            <ul>
                <li>Evolution of Meitei Mayek script</li>
                <li>Reading handwritten documents</li>
                <li>Common abbreviations</li>
                <li>Dating conventions</li>
                <li>Deciphering difficult texts</li>
            </ul>
            <p class="text-center" style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="showResearchRequestForm(); closeModal(document.querySelector('.modal'))">
                    Request Workshop or Consultation
                </button>
            </p>
        </div>
    `);
}

function showAdminHistory() {
    const modal = createModal('Administrative History of Manipur', `
        <div class="admin-history">
            <h3>Manipur Kingdom (33 CE - 1891)</h3>
            <p>Independent kingdom with hereditary monarchy, traditional administrative structure.</p>
            
            <h3>British Political Agency (1891-1947)</h3>
            <p>After Anglo-Manipur War, British Political Agent oversaw administration while Maharaja retained ceremonial role.</p>
            
            <h3>Chief Commissioner's Province (1947-1950)</h3>
            <p>After independence, Manipur merged with Indian Union as Chief Commissioner's Province.</p>
            
            <h3>Part C State (1950-1956)</h3>
            <p>Classified as Part C state under Indian Constitution with appointed Chief Commissioner.</p>
            
            <h3>Union Territory (1956-1972)</h3>
            <p>Reorganized as Union Territory with Lieutenant Governor and elected Legislative Assembly.</p>
            
            <h3>Full Statehood (1972-present)</h3>
            <p>Became 19th state of Indian Union on January 21, 1972 with elected Chief Minister and Governor.</p>
        </div>
    `);
}

// Add these functions for Research page navigation
function navigateToResearchGuides() {
    showResearchGuides();
}

function navigateToFindingAids() {
    showFindingAids();
}

function navigateToReferenceTools() {
    showReferenceTools();
}

// ===== Educational Resources Functions =====

function showEducationalResource(resourceType) {
    const resources = {
        'stories': {
            title: 'Stories from Manipur\'s Past',
            icon: 'fa-book-open',
            content: `
                <div class="educational-resource">
                    <p>Engaging historical stories designed for young learners to discover Manipur's rich heritage.</p>
                    <div class="resource-list-detail">
                        <h4>Available Stories:</h4>
                        <ul>
                            <li><strong>The Legend of Kangla:</strong> How Manipur's ancient capital came to be</li>
                            <li><strong>Princess Thoibi and Khamba:</strong> A tale of love and courage</li>
                            <li><strong>The Seven Years Devastation:</strong> Stories from Manipur's history</li>
                            <li><strong>The Brave Warriors:</strong> Tales of Manipuri heroes</li>
                            <li><strong>Festivals of Manipur:</strong> Origins of traditional celebrations</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('stories', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Story Collection
                        </button>
                    </div>
                </div>
            `
        },
        'coloring': {
            title: 'Historical Coloring Pages',
            icon: 'fa-palette',
            content: `
                <div class="educational-resource">
                    <p>Fun coloring activities featuring historical buildings, traditional costumes, and cultural symbols of Manipur.</p>
                    <div class="resource-list-detail">
                        <h4>Coloring Themes:</h4>
                        <ul>
                            <li>Kangla Fort and Historical Buildings</li>
                            <li>Traditional Manipuri Dress</li>
                            <li>Classical Dance Poses</li>
                            <li>Historical Maps</li>
                            <li>Ancient Scripts and Symbols</li>
                            <li>Royal Emblems and Flags</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('coloring', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Coloring Pages
                        </button>
                    </div>
                </div>
            `
        },
        'timeline': {
            title: 'Interactive Timeline',
            icon: 'fa-clock',
            content: `
                <div class="educational-resource">
                    <p>Explore Manipur's history through an interactive timeline with images and stories.</p>
                    <div class="timeline-simple">
                        <div class="timeline-item">
                            <div class="timeline-year">33 CE</div>
                            <div class="timeline-content">
                                <h4>Kingdom Founded</h4>
                                <p>Manipur Kingdom established</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">1762</div>
                            <div class="timeline-content">
                                <h4>Burmese Invasions</h4>
                                <p>Seven years of invasions begin</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">1891</div>
                            <div class="timeline-content">
                                <h4>Anglo-Manipur War</h4>
                                <p>Conflict with British forces</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">1947</div>
                            <div class="timeline-content">
                                <h4>Independence</h4>
                                <p>India gains independence</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">1972</div>
                            <div class="timeline-content">
                                <h4>Full Statehood</h4>
                                <p>Manipur becomes a state</p>
                            </div>
                        </div>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('timeline', 'image'); return false;">
                            <i class="fas fa-download"></i> Download Timeline
                        </button>
                    </div>
                </div>
            `
        },
        'freedom': {
            title: 'Freedom Movement Documents',
            icon: 'fa-flag',
            content: `
                <div class="educational-resource">
                    <p>Primary source documents and materials about Manipur's role in India's independence movement.</p>
                    <div class="resource-list-detail">
                        <h4>Document Collections:</h4>
                        <ul>
                            <li><strong>Letters from Freedom Fighters:</strong> Personal correspondence</li>
                            <li><strong>Newspaper Clippings:</strong> Reports from 1940s</li>
                            <li><strong>Photographs:</strong> Historical images from the movement</li>
                            <li><strong>Pamphlets:</strong> Original independence campaign materials</li>
                            <li><strong>Biographies:</strong> Stories of Manipuri freedom fighters</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('freedom-movement', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Collection
                        </button>
                        <button class="btn btn-secondary" onclick="navigateTo('digital-archives'); closeModal(document.querySelector('.modal'));">
                            <i class="fas fa-search"></i> Browse Digital Archives
                        </button>
                    </div>
                </div>
            `
        },
        'heritage': {
            title: 'Cultural Heritage Project Ideas',
            icon: 'fa-lightbulb',
            content: `
                <div class="educational-resource">
                    <p>Creative project ideas for students to explore and present Manipur's cultural heritage.</p>
                    <div class="resource-list-detail">
                        <h4>Project Ideas:</h4>
                        <ul>
                            <li><strong>Family History Project:</strong> Trace your family tree using archival records</li>
                            <li><strong>Traditional Arts Documentation:</strong> Research and present on Manipuri dance or crafts</li>
                            <li><strong>Historical Building Study:</strong> Investigate the history of local monuments</li>
                            <li><strong>Oral History Interview:</strong> Record stories from elderly community members</li>
                            <li><strong>Museum Exhibition:</strong> Create a mini-exhibition on a historical topic</li>
                            <li><strong>Historical Newspaper:</strong> Design a newspaper from a past era</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('project-guide', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Project Guide
                        </button>
                    </div>
                </div>
            `
        },
        'worksheets': {
            title: 'Historical Research Worksheets',
            icon: 'fa-file-alt',
            content: `
                <div class="educational-resource">
                    <p>Worksheets to help students develop historical research and critical thinking skills.</p>
                    <div class="resource-list-detail">
                        <h4>Worksheet Types:</h4>
                        <ul>
                            <li><strong>Document Analysis:</strong> How to read and interpret primary sources</li>
                            <li><strong>Timeline Creation:</strong> Organizing historical events chronologically</li>
                            <li><strong>Map Skills:</strong> Reading historical maps of Manipur</li>
                            <li><strong>Comparison Charts:</strong> Comparing past and present</li>
                            <li><strong>Research Planning:</strong> How to plan a history project</li>
                            <li><strong>Citation Practice:</strong> Properly citing historical sources</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('worksheets', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Worksheets
                        </button>
                    </div>
                </div>
            `
        },
        'analysis': {
            title: 'Primary Source Analysis',
            icon: 'fa-search',
            content: `
                <div class="educational-resource">
                    <p>Advanced guide to analyzing historical documents and developing research skills.</p>
                    <div class="resource-list-detail">
                        <h4>Topics Covered:</h4>
                        <ul>
                            <li><strong>Types of Primary Sources:</strong> Letters, photographs, official documents</li>
                            <li><strong>Critical Reading:</strong> Questions to ask when analyzing sources</li>
                            <li><strong>Context Analysis:</strong> Understanding historical context</li>
                            <li><strong>Bias Detection:</strong> Identifying perspective and bias</li>
                            <li><strong>Cross-Referencing:</strong> Verifying information across sources</li>
                            <li><strong>Evidence Building:</strong> Constructing historical arguments</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('analysis-guide', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Analysis Guide
                        </button>
                    </div>
                </div>
            `
        },
        'methodology': {
            title: 'Research Methodology Guide',
            icon: 'fa-clipboard-list',
            content: `
                <div class="educational-resource">
                    <p>Comprehensive guide to conducting historical research for advanced students.</p>
                    <div class="resource-list-detail">
                        <h4>Methodology Steps:</h4>
                        <ul>
                            <li><strong>Step 1:</strong> Formulating research questions</li>
                            <li><strong>Step 2:</strong> Literature review and background research</li>
                            <li><strong>Step 3:</strong> Locating primary sources</li>
                            <li><strong>Step 4:</strong> Organizing and analyzing data</li>
                            <li><strong>Step 5:</strong> Developing arguments and conclusions</li>
                            <li><strong>Step 6:</strong> Writing and presenting research</li>
                            <li><strong>Step 7:</strong> Proper citation and bibliography</li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('methodology', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Complete Guide
                        </button>
                    </div>
                </div>
            `
        },
        'essays': {
            title: 'Historical Essays & Papers',
            icon: 'fa-graduation-cap',
            content: `
                <div class="educational-resource">
                    <p>Collection of scholarly essays and research papers on Manipur's history.</p>
                    <div class="resource-list-detail">
                        <h4>Available Papers:</h4>
                        <ul>
                            <li><strong>"The Manipur Kingdom: Political Structure and Administration"</strong></li>
                            <li><strong>"Cultural Transformation During Colonial Period"</strong></li>
                            <li><strong>"Women in Manipur's History"</strong></li>
                            <li><strong>"Trade and Economy in Pre-Colonial Manipur"</strong></li>
                            <li><strong>"The Anglo-Manipur War of 1891: Causes and Consequences"</strong></li>
                            <li><strong>"Manipur's Role in India's Freedom Struggle"</strong></li>
                        </ul>
                    </div>
                    <div class="resource-download">
                        <button class="btn btn-primary" onclick="downloadResourceFile('essays-collection', 'pdf'); return false;">
                            <i class="fas fa-download"></i> Download Essay Collection
                        </button>
                    </div>
                </div>
            `
        }
    };

    const resource = resources[resourceType];
    if (!resource) {
        showToast('Resource not found', 'error');
        return;
    }

    const modal = createModal(resource.title, `
        <div class="resource-modal">
            <div class="resource-header">
                <i class="fas ${resource.icon} resource-icon"></i>
            </div>
            ${resource.content}
        </div>
    `);
}

function showVirtualTour() {
    const modal = createModal('Virtual Tour of Manipur State Archives', `
        <div class="virtual-tour">
            <div class="tour-intro">
                <p>Welcome to the virtual tour of Manipur State Archives! Explore our facilities and learn about how we preserve historical documents.</p>
            </div>
            
            <div class="tour-sections">
                <div class="tour-section">
                    <img src="images/tour-entrance.jpg" alt="Archives Entrance" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EArchives Entrance%3C/text%3E%3C/svg%3E'">
                    <h4>Main Entrance & Reception</h4>
                    <p>Our welcoming entrance hall where visitors check in and receive orientation.</p>
                </div>
                
                <div class="tour-section">
                    <img src="images/tour-reading-room.jpg" alt="Reading Room" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EReading Room%3C/text%3E%3C/svg%3E'">
                    <h4>Reading Room</h4>
                    <p>A quiet space equipped with research materials and digital access terminals.</p>
                </div>
                
                <div class="tour-section">
                    <img src="images/tour-storage.jpg" alt="Climate-Controlled Storage" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2220%22%3EClimate-Controlled Storage%3C/text%3E%3C/svg%3E'">
                    <h4>Climate-Controlled Storage</h4>
                    <p>Our state-of-the-art storage facility maintains optimal temperature and humidity.</p>
                </div>
                
                <div class="tour-section">
                    <img src="images/tour-conservation.jpg" alt="Conservation Lab" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EConservation Lab%3C/text%3E%3C/svg%3E'">
                    <h4>Conservation Laboratory</h4>
                    <p>Where our experts carefully restore and preserve fragile documents.</p>
                </div>
                
                <div class="tour-section">
                    <img src="images/tour-digitization.jpg" alt="Digitization Center" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EDigitization Center%3C/text%3E%3C/svg%3E'">
                    <h4>Digitization Center</h4>
                    <p>High-tech equipment for scanning and digitizing historical materials.</p>
                </div>
                
                <div class="tour-section">
                    <img src="images/tour-exhibition.jpg" alt="Exhibition Gallery" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e9ecef%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-size=%2224%22%3EExhibition Gallery%3C/text%3E%3C/svg%3E'">
                    <h4>Exhibition Gallery</h4>
                    <p>Rotating displays of historical documents, photographs, and artifacts.</p>
                </div>
            </div>
            
            <div class="tour-footer">
                <p><strong>Want to visit in person?</strong></p>
                <button class="btn btn-primary" onclick="navigateTo('services'); closeModal(document.querySelector('.modal'))">
                    <i class="fas fa-calendar"></i> Plan Your Visit
                </button>
            </div>
        </div>
    `);
}

function downloadResource(resourceType) {
    showToast('Preparing resource for download...', 'success');
    
    // In a real implementation, this would download actual PDF files
    setTimeout(() => {
        showToast('Resource download started!', 'success');
    }, 1000);
}

function showTeacherResource(resourceType) {
    const resources = {
        'colonial-lessons': {
            title: 'Colonial Period Lesson Plans',
            content: 'Comprehensive lesson plans covering British colonial administration in Manipur (1891-1947).'
        },
        'freedom-activities': {
            title: 'Freedom Movement Activities',
            content: 'Interactive classroom activities about Manipur\'s role in India\'s independence movement.'
        },
        'heritage-units': {
            title: 'Cultural Heritage Units',
            content: 'Complete teaching units on Manipuri culture, traditions, and performing arts.'
        },
        'source-analysis': {
            title: 'How to Analyze Primary Sources',
            content: 'Step-by-step guide for teaching students to analyze historical documents.'
        },
        'dbq': {
            title: 'Document-Based Questions',
            content: 'Ready-to-use DBQ exercises with historical documents from our collection.'
        },
        'rubrics': {
            title: 'Assessment Rubrics',
            content: 'Rubrics for evaluating student work on history projects and research papers.'
        }
    };

    const resource = resources[resourceType];
    if (!resource) return;

    const modal = createModal(resource.title, `
        <div class="teacher-resource">
            <p>${resource.content}</p>
            <div style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="downloadResource('${resourceType}')">
                    <i class="fas fa-download"></i> Download Resource
                </button>
            </div>
        </div>
    `);
}

function showExhibition(exhibitionType) {
    const exhibitions = {
        'freedom-fighters': {
            title: 'Freedom Fighters of Manipur',
            description: 'Explore the courageous individuals who fought for India\'s independence.'
        },
        'royal-manipur': {
            title: 'Royal Manipur',
            description: 'Journey through centuries of the Manipur Kingdom\'s rich history.'
        },
        'cultural-heritage': {
            title: 'Cultural Heritage of Manipur',
            description: 'Discover traditional arts, crafts, and cultural practices through historical records.'
        }
    };

    const exhibition = exhibitions[exhibitionType];
    if (!exhibition) return;

    const modal = createModal(exhibition.title, `
        <div class="virtual-exhibition">
            <p>${exhibition.description}</p>
            <p style="margin-top: 20px; text-align: center;">
                <em>Virtual exhibition coming soon...</em>
            </p>
            <div style="margin-top: 20px; text-align: center;">
                <button class="btn btn-primary" onclick="navigateTo('gallery'); closeModal(document.querySelector('.modal'))">
                    <i class="fas fa-images"></i> Browse Gallery
                </button>
            </div>
        </div>
    `);

    // Download educational resources
// Download educational resources
async function downloadResourceAs(resourceType, format) {
    showToast(`Preparing ${resourceType} for download as ${format.toUpperCase()}...`, 'success');
    
    try {
        // Create a temporary link element
        const link = document.createElement('a');
        
        // Set the appropriate file path based on format
        if (format === 'pdf') {
            link.href = `/resources/${resourceType}.pdf`;
            link.download = `${resourceType}-resource.pdf`;
        } else if (format === 'image') {
            link.href = `/resources/${resourceType}.jpg`;
            link.download = `${resourceType}-resource.jpg`;
        }
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message after a short delay
        setTimeout(() => {
            showToast(`Download started: ${resourceType}.${format}`, 'success');
        }, 500);
        
    } catch (error) {
        console.error('Download error:', error);
        showToast('Download failed. Please try again.', 'error');
    }
}
}

// Download educational resource files - FIXED VERSION
function downloadResourceFile(resourceType, format) {
    // Prevent any event bubbling
    if (window.event) {
        window.event.preventDefault();
        window.event.stopPropagation();
    }
    
    console.log('Download clicked:', resourceType, format);
    showToast(`Preparing ${resourceType} for download...`, 'success');
    
    try {
        // Create download content based on resource type and format
        let content, mimeType, filename, extension;
        
        if (format === 'pdf') {
            // Create a simple text file as placeholder (replace with actual PDF generation later)
            content = `MANIPUR STATE ARCHIVES
Educational Resource

Title: ${resourceType.toUpperCase()}

This is a sample educational resource for students.

[In production, this would be a properly formatted PDF with images, 
text, activities, and educational content about ${resourceType}]

For more information, visit Manipur State Archives.`;
            
            mimeType = 'text/plain';
            extension = 'txt';
            filename = `manipur-archives-${resourceType}.${extension}`;
            
        } else if (format === 'image') {
            // Create an SVG image
            content = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <!-- Background -->
    <rect width="1200" height="900" fill="#f8f9fa"/>
    
    <!-- Header -->
    <rect width="1200" height="150" fill="#1976D2"/>
    <text x="600" y="85" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">
        MANIPUR STATE ARCHIVES
    </text>
    <text x="600" y="125" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">
        Educational Resource
    </text>
    
    <!-- Title -->
    <text x="600" y="250" font-family="Arial, sans-serif" font-size="42" fill="#333" text-anchor="middle" font-weight="bold">
        ${resourceType.toUpperCase().replace(/-/g, ' ')}
    </text>
    
    <!-- Content Box -->
    <rect x="100" y="300" width="1000" height="450" fill="white" stroke="#ddd" stroke-width="2" rx="10"/>
    
    <!-- Sample Content -->
    <text x="150" y="370" font-family="Arial, sans-serif" font-size="24" fill="#555">
        Educational Resource for Students
    </text>
    
    <text x="150" y="430" font-family="Arial, sans-serif" font-size="18" fill="#666">
        This is a sample image resource for ${resourceType}.
    </text>
    
    <text x="150" y="470" font-family="Arial, sans-serif" font-size="18" fill="#666">
        In production, this would contain:
    </text>
    
    <text x="180" y="510" font-family="Arial, sans-serif" font-size="16" fill="#777">
        • Historical images and photographs
    </text>
    <text x="180" y="540" font-family="Arial, sans-serif" font-size="16" fill="#777">
        • Educational illustrations
    </text>
    <text x="180" y="570" font-family="Arial, sans-serif" font-size="16" fill="#777">
        • Activities and worksheets
    </text>
    <text x="180" y="600" font-family="Arial, sans-serif" font-size="16" fill="#777">
        • Timeline graphics
    </text>
    
    <!-- Footer -->
    <text x="600" y="820" font-family="Arial, sans-serif" font-size="16" fill="#999" text-anchor="middle">
        © 2024 Manipur State Archives | www.manipurarchives.gov.in
    </text>
</svg>`;
            
            mimeType = 'image/svg+xml';
            extension = 'svg';
            filename = `manipur-archives-${resourceType}.${extension}`;
        }
        
        // Create blob and download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        // Add to document, click, and cleanup
        document.body.appendChild(link);
        link.click();
        
        // Cleanup after a short delay
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast(`Download started: ${filename}`, 'success');
        }, 100);
        
        return false;
        
    } catch (error) {
        console.error('Download error:', error);
        showToast('Download failed. Please try again.', 'error');
        return false;
    }
}

// ===== Footer Navigation Functions =====

function showMissionVision() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Mission & Vision</h1>
                <p>Our commitment to preserving Manipur's heritage</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="mission-vision">
                    <div class="mv-card">
                        <div class="mv-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h2>Our Mission</h2>
                        <p>To acquire, preserve, and make accessible the archival records of Manipur for present and future generations, supporting research, education, and cultural heritage preservation.</p>
                        <ul class="mission-points">
                            <li><i class="fas fa-check"></i> Collect and preserve historical documents and records</li>
                            <li><i class="fas fa-check"></i> Provide access to archival materials for research and education</li>
                            <li><i class="fas fa-check"></i> Promote awareness of Manipur's documentary heritage</li>
                            <li><i class="fas fa-check"></i> Support scholarly research and academic inquiry</li>
                            <li><i class="fas fa-check"></i> Foster cultural understanding through historical documentation</li>
                        </ul>
                    </div>
                    
                    <div class="mv-card">
                        <div class="mv-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <h2>Our Vision</h2>
                        <p>To be a leading center for archival excellence in Northeast India, preserving Manipur's unique heritage and making it accessible globally through digital innovation and professional archival practices.</p>
                        <ul class="mission-points">
                            <li><i class="fas fa-check"></i> Become a model archival institution in the region</li>
                            <li><i class="fas fa-check"></i> Digitize and provide online access to collections</li>
                            <li><i class="fas fa-check"></i> Establish partnerships with national and international institutions</li>
                            <li><i class="fas fa-check"></i> Train the next generation of archivists and historians</li>
                            <li><i class="fas fa-check"></i> Ensure long-term preservation of Manipur's documentary heritage</li>
                        </ul>
                    </div>
                </div>
                
                <div class="values-section" style="margin-top: 50px;">
                    <h2>Our Core Values</h2>
                    <div class="content-grid">
                        <div class="content-card">
                            <i class="fas fa-shield-alt" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                            <h3>Preservation</h3>
                            <p>Protecting historical materials for future generations through professional conservation practices.</p>
                        </div>
                        <div class="content-card">
                            <i class="fas fa-unlock-alt" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                            <h3>Access</h3>
                            <p>Providing open and equitable access to our collections for all researchers and the public.</p>
                        </div>
                        <div class="content-card">
                            <i class="fas fa-balance-scale" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                            <h3>Integrity</h3>
                            <p>Maintaining the highest standards of professional ethics and archival practices.</p>
                        </div>
                        <div class="content-card">
                            <i class="fas fa-users" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                            <h3>Service</h3>
                            <p>Supporting researchers, educators, and the community with expert assistance and resources.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showPolicies() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Policies</h1>
                <p>Guidelines and regulations governing our operations</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="policies-list">
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-file-alt"></i>
                            <h3>Collection Development Policy</h3>
                        </div>
                        <p>Guidelines for acquiring, appraising, and accessioning new materials into our collections.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('collection')">Read Policy</button>
                    </div>
                    
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-key"></i>
                            <h3>Access and Use Policy</h3>
                        </div>
                        <p>Rules and procedures for accessing archival materials and using our facilities.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('access')">Read Policy</button>
                    </div>
                    
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-archive"></i>
                            <h3>Preservation Policy</h3>
                        </div>
                        <p>Standards and practices for the long-term preservation of archival materials.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('preservation')">Read Policy</button>
                    </div>
                    
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-database"></i>
                            <h3>Digital Preservation Policy</h3>
                        </div>
                        <p>Framework for preserving digital materials and ensuring long-term accessibility.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('digital')">Read Policy</button>
                    </div>
                    
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-user-shield"></i>
                            <h3>Privacy Policy</h3>
                        </div>
                        <p>How we handle personal information and protect user privacy.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('privacy')">Read Policy</button>
                    </div>
                    
                    <div class="policy-card">
                        <div class="policy-header">
                            <i class="fas fa-copyright"></i>
                            <h3>Copyright and Use Policy</h3>
                        </div>
                        <p>Guidelines for using and reproducing materials from our collections.</p>
                        <button class="btn btn-secondary" onclick="showPolicyDetail('copyright')">Read Policy</button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showPolicyDetail(policyType) {
    const policies = {
        collection: {
            title: 'Collection Development Policy',
            content: `
                <h3>Purpose</h3>
                <p>This policy guides the acquisition and development of collections at Manipur State Archives.</p>
                
                <h3>Scope</h3>
                <p>We collect materials that document:</p>
                <ul>
                    <li>Political and administrative history of Manipur</li>
                    <li>Social, cultural, and economic development</li>
                    <li>Significant individuals, families, and organizations</li>
                    <li>Traditional knowledge and cultural practices</li>
                </ul>
                
                <h3>Acquisition Methods</h3>
                <ul>
                    <li>Donations from individuals and organizations</li>
                    <li>Transfers from government departments</li>
                    <li>Purchases when appropriate and within budget</li>
                </ul>
            `
        },
        access: {
            title: 'Access and Use Policy',
            content: `
                <h3>Access Rights</h3>
                <p>The archives is open to all researchers, subject to the following conditions:</p>
                
                <h3>Registration</h3>
                <ul>
                    <li>All visitors must register and provide valid identification</li>
                    <li>Researchers must complete a registration form</li>
                    <li>Regular visitors may apply for a researcher card</li>
                </ul>
                
                <h3>Reading Room Rules</h3>
                <ul>
                    <li>Only pencils are permitted (no pens)</li>
                    <li>No food or drinks allowed</li>
                    <li>Handle materials with care</li>
                    <li>Photography requires permission</li>
                </ul>
                
                <h3>Restrictions</h3>
                <p>Some materials may be restricted due to:</p>
                <ul>
                    <li>Fragile physical condition</li>
                    <li>Privacy concerns</li>
                    <li>Legal restrictions</li>
                    <li>Donor-imposed limitations</li>
                </ul>
            `
        },
        preservation: {
            title: 'Preservation Policy',
            content: `
                <h3>Preservation Goals</h3>
                <p>To ensure the long-term survival of archival materials through:</p>
                
                <h3>Environmental Controls</h3>
                <ul>
                    <li>Climate-controlled storage facilities</li>
                    <li>Temperature: 18-20°C</li>
                    <li>Relative Humidity: 35-45%</li>
                    <li>Protection from light, pests, and pollutants</li>
                </ul>
                
                <h3>Conservation Treatment</h3>
                <ul>
                    <li>Assessment of materials condition</li>
                    <li>Preventive conservation measures</li>
                    <li>Stabilization of fragile items</li>
                    <li>Professional conservation treatment when needed</li>
                </ul>
                
                <h3>Reformatting</h3>
                <ul>
                    <li>Digitization of at-risk materials</li>
                    <li>Microfilming of important documents</li>
                    <li>Creation of access copies</li>
                </ul>
            `
        },
        digital: {
            title: 'Digital Preservation Policy',
            content: `
                <h3>Digital Preservation Framework</h3>
                <p>Ensuring long-term access to digital materials through:</p>
                
                <h3>File Formats</h3>
                <ul>
                    <li>Use of open, non-proprietary formats when possible</li>
                    <li>Regular format migration as needed</li>
                    <li>Maintenance of format registries</li>
                </ul>
                
                <h3>Storage and Backup</h3>
                <ul>
                    <li>Multiple copies in different locations</li>
                    <li>Regular integrity checks</li>
                    <li>Redundant backup systems</li>
                    <li>Disaster recovery procedures</li>
                </ul>
                
                <h3>Metadata Standards</h3>
                <ul>
                    <li>Comprehensive descriptive metadata</li>
                    <li>Technical metadata for file management</li>
                    <li>Preservation metadata</li>
                </ul>
            `
        },
        privacy: {
            title: 'Privacy Policy',
            content: `
                <h3>Information Collection</h3>
                <p>We collect personal information when you:</p>
                <ul>
                    <li>Register as a researcher</li>
                    <li>Submit research requests</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us</li>
                </ul>
                
                <h3>Use of Information</h3>
                <p>Your information is used to:</p>
                <ul>
                    <li>Provide access to our services</li>
                    <li>Respond to your inquiries</li>
                    <li>Send updates and announcements (with consent)</li>
                    <li>Improve our services</li>
                </ul>
                
                <h3>Data Security</h3>
                <ul>
                    <li>Secure storage of personal information</li>
                    <li>Limited access to authorized staff only</li>
                    <li>No sharing with third parties without consent</li>
                </ul>
                
                <h3>Your Rights</h3>
                <ul>
                    <li>Access your personal information</li>
                    <li>Request corrections or updates</li>
                    <li>Withdraw consent for communications</li>
                    <li>Request deletion of your data</li>
                </ul>
            `
        },
        copyright: {
            title: 'Copyright and Use Policy',
            content: `
                <h3>Copyright Status</h3>
                <p>Materials in our collections may have different copyright statuses:</p>
                <ul>
                    <li>Public Domain</li>
                    <li>Copyright held by archives</li>
                    <li>Copyright held by creator or donor</li>
                    <li>Unknown copyright status</li>
                </ul>
                
                <h3>Fair Use</h3>
                <p>Use of copyrighted materials may be permitted under fair use for:</p>
                <ul>
                    <li>Research and scholarship</li>
                    <li>Teaching and education</li>
                    <li>News reporting</li>
                    <li>Commentary and criticism</li>
                </ul>
                
                <h3>Reproduction Services</h3>
                <ul>
                    <li>We provide copies for research and personal use</li>
                    <li>Publication requires additional permission</li>
                    <li>Users are responsible for copyright compliance</li>
                    <li>Credit line must be provided: "Manipur State Archives"</li>
                </ul>
                
                <h3>Permission Requests</h3>
                <p>For publication or commercial use:</p>
                <ul>
                    <li>Submit request in writing</li>
                    <li>Provide details of intended use</li>
                    <li>Allow time for review and clearance</li>
                    <li>Pay applicable fees</li>
                </ul>
            `
        }
    };
    
    const policy = policies[policyType];
    if (!policy) return;
    
    const modal = createModal(policy.title, `
        <div class="policy-detail">
            ${policy.content}
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p><strong>Questions about this policy?</strong></p>
                <button class="btn btn-primary" onclick="navigateTo('contact'); closeModal(document.querySelector('.modal'))">
                    <i class="fas fa-envelope"></i> Contact Us
                </button>
            </div>
        </div>
    `);
}

function showNewsEvents() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>News & Events</h1>
                <p>Stay updated with our latest announcements and activities</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div id="allNewsGrid" class="news-grid">
                    <div class="loading">Loading news and events...</div>
                </div>
            </div>
        </section>
    `;
    
    loadAllNews();
}

function showFAQ() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="page-header">
            <div class="container">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about our services</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="faq-categories">
                    <button class="faq-category-btn active" onclick="filterFAQ('all')">All Questions</button>
                    <button class="faq-category-btn" onclick="filterFAQ('access')">Access & Visiting</button>
                    <button class="faq-category-btn" onclick="filterFAQ('research')">Research</button>
                    <button class="faq-category-btn" onclick="filterFAQ('services')">Services</button>
                    <button class="faq-category-btn" onclick="filterFAQ('digital')">Digital Archives</button>
                </div>
                
                <div class="faq-section" id="faqContainer">
                    ${getFAQHTML()}
                </div>
                
                <div class="faq-contact" style="margin-top: 50px; padding: 30px; background: #f8f9fa; border-radius: 10px; text-align: center;">
                    <h3>Still have questions?</h3>
                    <p>Can't find what you're looking for? Our team is here to help!</p>
                    <button class="btn btn-primary" onclick="navigateTo('contact')">
                        <i class="fas fa-envelope"></i> Contact Us
                    </button>
                </div>
            </div>
        </section>
    `;
    
    // Initialize FAQ accordion
    initFAQAccordion();
}

function getFAQHTML() {
    const faqs = [
        {
            category: 'access',
            question: 'How do I access the archives?',
            answer: 'You can visit us during our opening hours (Monday-Friday, 10:00 AM - 5:00 PM) with a valid photo ID. You can also access many of our digitized materials online through the Digital Archives section.'
        },
        {
            category: 'access',
            question: 'Do I need an appointment to visit?',
            answer: 'Walk-ins are welcome during our opening hours. However, we recommend booking an appointment if you need specialized research assistance or want to consult with an archivist.'
        },
        {
            category: 'access',
            question: 'What should I bring when visiting?',
            answer: 'Please bring a valid photo ID (Aadhaar, Driving License, etc.), information about your research topic, and a notebook with pencils. Pens are not allowed in the reading room to protect the documents.'
        },
        {
            category: 'research',
            question: 'How do I start my research?',
            answer: 'Begin by searching our online catalog or browsing our finding aids. You can also submit a research request, and our archivists will help identify relevant materials for your topic.'
        },
        {
            category: 'research',
            question: 'Can I get help with my research?',
            answer: 'Yes! Our archivists are available to provide research assistance. You can submit a research request form or schedule a consultation appointment.'
        },
        {
            category: 'research',
            question: 'How long can I keep materials?',
            answer: 'Materials must be used in the reading room and cannot be taken out. You can request copies of documents through our reproduction services.'
        },
        {
            category: 'services',
            question: 'Can I get copies of documents?',
            answer: 'Yes, we provide document reproduction services including digital scanning (₹20/page), photocopying (₹5/page), and certified copies (₹50/page).'
        },
        {
            category: 'services',
            question: 'How do I donate materials to the archives?',
            answer: 'We welcome donations of historical materials related to Manipur. Please use our donation submission form on the Services page, and our staff will contact you regarding the appraisal and acquisition process.'
        },
        {
            category: 'services',
            question: 'Do you offer educational programs?',
            answer: 'Yes! We offer educational resources for students and teachers, virtual exhibitions, and can arrange group visits. Contact us to arrange an educational visit.'
        },
        {
            category: 'digital',
            question: 'How do I search the digital archives?',
            answer: 'Use our Digital Archives search feature where you can filter by keyword, date range, language, document type, and collection. Advanced search options are available for more specific queries.'
        },
        {
            category: 'digital',
            question: 'Can I download documents?',
            answer: 'Yes, many digitized documents can be downloaded for personal research use. Please respect copyright restrictions and provide proper attribution when using materials.'
        },
        {
            category: 'digital',
            question: 'Are all collections digitized?',
            answer: 'We are continuously working on digitizing our collections. Currently, a significant portion of our holdings are available online, with new materials being added regularly.'
        }
    ];
    
    return faqs.map((faq, index) => `
        <div class="faq-item" data-category="${faq.category}">
            <h3 class="faq-question">
                <i class="fas fa-question-circle"></i>
                ${faq.question}
            </h3>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

function initFAQAccordion() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }




        });
    });
}
// ===== Dark Mode Toggle =====
function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('dark-mode');
    
    // Update icon
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // Save preference
    try {
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    } catch (e) {
        console.log('Could not save dark mode preference');
    }
}

// Load dark mode preference on page load
function loadDarkModePreference() {
    try {
        const darkMode = localStorage.getItem('darkMode');
        const themeIcon = document.getElementById('themeIcon');
        
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    } catch (e) {
        console.log('Could not load dark mode preference');
    }
}
function filterFAQ(category) {
    // Update active button
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

async function viewNewsDetail(newsId) {
    try {
        const response = await apiRequest(`/news/${newsId}`);
        const news = response;
        
        if (!news) {
            showToast('News article not found', 'error');
            return;
        }
        
        const modal = createModal(news.title, `
            <div class="news-detail">
                ${news.image ? `
                    <img src="${news.image}" alt="${news.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
                ` : ''}
                <div class="news-meta" style="display: flex; gap: 20px; margin-bottom: 20px; color: #666; font-size: 0.9rem;">
                    <span><i class="fas fa-calendar"></i> ${formatDate(news.publishedAt)}</span>
                    ${news.author ? `<span><i class="fas fa-user"></i> ${news.author}</span>` : ''}
                </div>
                <div class="news-content" style="line-height: 1.8; color: #333;">
                    ${news.content.split('\n').map(para => `<p style="margin-bottom: 15px;">${para}</p>`).join('')}
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Failed to load news details:', error);
        showToast('Failed to load news article', 'error');
    }


}// ===== Notification System =====

// Sample notifications (replace with API calls in production)
let notifications = [
    {
        id: 1,
        type: 'info',
        title: 'New Collection Added',
        message: 'Royal Chronicles collection has been updated with 25 new documents',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
    },
    {
        id: 2,
        type: 'success',
        title: 'Document Digitized',
        message: 'Your requested document "Freedom Movement Letter 1942" is now available',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false
    },
    {
        id: 3,
        type: 'warning',
        title: 'Maintenance Schedule',
        message: 'Digital archives will be under maintenance on Dec 20, 2024',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true
    },
    {
        id: 4,
        type: 'info',
        title: 'New Research Guide',
        message: 'Genealogy Research Guide has been updated with new resources',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true
    }
];

// Initialize notifications on page load
function initNotifications() {
    updateNotificationBadge();
    loadNotifications();
}

// Toggle notification panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    const overlay = document.getElementById('notificationOverlay');
    
    if (panel && overlay) {
        panel.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (panel.classList.contains('active')) {
            loadNotifications();
        }
    }
    
    return false;
}

// Close notification panel
function closeNotifications() {
    const panel = document.getElementById('notificationPanel');
    const overlay = document.getElementById('notificationOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Load notifications into panel
function loadNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notif => {
        const timeAgo = getTimeAgo(notif.time);
        return `
            <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="markAsRead(${notif.id})">
                <div class="notification-icon ${notif.type}">
                    <i class="fas fa-${getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notif.title}</div>
                    <div class="notification-message">${notif.message}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Get icon for notification type
function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'bell';
}

// Calculate time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
}

// Update notification badge count
function updateNotificationBadge() {
    const badge = document.getElementById('notificationCount');
    if (!badge) return;
    
    const unreadCount = notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    
    if (unreadCount === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
}

// Mark notification as read
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
        notification.read = true;
        updateNotificationBadge();
        loadNotifications();
        
        // Save to backend in production
        // apiRequest(`/notifications/${id}/read`, { method: 'POST' });
    }
}

// Mark all as read
function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    updateNotificationBadge();
    loadNotifications();
    showToast('All notifications marked as read', 'success');
    
    // Save to backend in production
    // apiRequest('/notifications/mark-all-read', { method: 'POST' });
}

// Clear all notifications
function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        updateNotificationBadge();
        loadNotifications();
        showToast('All notifications cleared', 'success');
        
        // Save to backend in production
        // apiRequest('/notifications/clear-all', { method: 'DELETE' });
    }
}

// Close notification panel when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeNotifications);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNotifications();
        }
    });
    
    // Initialize notifications
    initNotifications();
});

// Add notification (for admin or system)
function addNotification(type, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: new Date(),
        read: false
    };
    
    notifications.unshift(newNotification);
    updateNotificationBadge();
    
    // If panel is open, reload
    const panel = document.getElementById('notificationPanel');
    if (panel && panel.classList.contains('active')) {
        loadNotifications();
    }
    
    // Save to backend in production
    // apiRequest('/notifications', { method: 'POST', body: JSON.stringify(newNotification) });
}

// Example: Simulate receiving new notification (remove in production)
function simulateNewNotification() {
    const types = ['info', 'success', 'warning'];
    const titles = [
        'New Document Available',
        'Collection Updated',
        'Research Request Processed',
        'System Update'
    ];
    const messages = [
        'A new document has been added to the archives',
        'The Freedom Movement collection has been updated',
        'Your research request has been completed',
        'System maintenance completed successfully'
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    addNotification(randomType, randomTitle, randomMessage);
    showToast('New notification received!', 'info');
}

// ===== Notification System =====

// Store read notifications in localStorage
function getReadNotifications() {
    try {
        var read = localStorage.getItem('readNotifications');
        return read ? JSON.parse(read) : [];
    } catch (e) {
        return [];
    }
}

function markNotificationAsRead(id) {
    try {
        var read = getReadNotifications();
        if (read.indexOf(id) === -1) {
            read.push(id);
            localStorage.setItem('readNotifications', JSON.stringify(read));
        }
    } catch (e) {
        console.log('Could not save read status');
    }
}

// Initialize notifications on page load
async function initNotifications() {
    await loadNotifications();
    updateNotificationBadge();
}

// Load notifications from API
async function loadNotifications() {
    try {
        var response = await fetch('/api/notifications', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.error('Notifications response not ok:', response.status);
            window.currentNotifications = [];
            updateNotificationBadge();
            return;
        }
        
        var data = await response.json();
        
        if (data.success) {
            window.currentNotifications = data.notifications || [];
        } else {
            window.currentNotifications = [];
        }
        
        updateNotificationBadge();
        
    } catch (error) {
        console.error('Failed to load notifications:', error);
        window.currentNotifications = [];
        updateNotificationBadge();
    }
}

// Toggle notification panel
function toggleNotifications() {
    var panel = document.getElementById('notificationPanel');
    var overlay = document.getElementById('notificationOverlay');
    
    if (panel && overlay) {
        var isActive = panel.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (isActive) {
            displayNotifications();
        }
    }
    
    return false;
}

// Close notification panel
function closeNotifications() {
    var panel = document.getElementById('notificationPanel');
    var overlay = document.getElementById('notificationOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Replace the displayNotifications function
function displayNotifications() {
    var container = document.getElementById('notificationList');
    if (!container) return;
    
    var notifications = window.currentNotifications || [];
    var readNotifications = getReadNotifications();
    
    if (notifications.length === 0) {
        container.innerHTML = '<div class="empty-notifications"><i class="fas fa-bell-slash"></i><p>No notifications</p></div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var timeAgo = getTimeAgo(new Date(notif.createdAt));
        var isRead = readNotifications.indexOf(notif.id) !== -1;
        
        html += '<div class="notification-item ' + (isRead ? '' : 'unread') + '" onclick="viewNotificationDetail(\'' + notif.id + '\')">';
        html += '<div class="notification-icon ' + notif.type + '"><i class="fas fa-' + getNotificationIcon(notif.type) + '"></i></div>';
        html += '<div class="notification-content">';
        html += '<div class="notification-title">' + notif.title + '</div>';
        
        // Show truncated message in list
        var messagePreview = notif.message.length > 80 ? notif.message.substring(0, 80) + '...' : notif.message;
        html += '<div class="notification-message">' + messagePreview + '</div>';
        
        html += '<div class="notification-time">' + timeAgo + '</div>';
        html += '</div></div>';
    }
    
    container.innerHTML = html;
}

// Update the viewNotificationDetail function
function viewNotificationDetail(notificationId) {
    var notifications = window.currentNotifications || [];
    var notification = null;
    
    for (var i = 0; i < notifications.length; i++) {
        if (notifications[i].id === notificationId) {
            notification = notifications[i];
            break;
        }
    }
    
    if (!notification) {
        showToast('Notification not found', 'error');
        return;
    }
    
    // Mark as read
    markNotificationAsRead(notificationId);
    updateNotificationBadge();
    
    // Close notification panel
    closeNotifications();
    
    // Create modal without title (we'll add custom header)
    var modal = createModal('', `
        <div class="notification-detail-view">
            <div class="notification-detail-header">
                <div class="notification-type-badge ${notification.type}">
                    <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    ${notification.type.toUpperCase()}
                </div>
                <div class="notification-date">
                    <i class="fas fa-calendar-alt"></i> ${formatDate(notification.createdAt)}
                </div>
            </div>
            
            <div class="notification-detail-body">
                <h3>${notification.title}</h3>
                <div class="notification-full-message">
                    ${notification.message}
                </div>
            </div>
            
            ${notification.link ? `
                <div class="notification-detail-actions">
                    <button class="btn btn-secondary" onclick="closeModal(document.querySelector('.modal'))">
                        <i class="fas fa-times"></i> Close
                    </button>
                    <button class="btn btn-primary" onclick="navigateTo('${notification.link}'); closeModal(document.querySelector('.modal'));">
                        <i class="fas fa-arrow-right"></i> ${notification.linkText || 'View Details'}
                    </button>
                </div>
            ` : `
                <div class="notification-detail-actions">
                    <button class="btn btn-primary" onclick="closeModal(document.querySelector('.modal'))">
                        <i class="fas fa-check"></i> Got it
                    </button>
                </div>
            `}
        </div>
    `);
    
    // Remove the default modal header since we have custom header
    var modalHeader = modal.querySelector('.modal-header');
    if (modalHeader) {
        modalHeader.style.display = 'none';
    }
}
// Handle notification click
function handleNotificationClick(notificationId, link) {
    viewNotificationDetail(notificationId);
}
    markNotificationAsRead(notificationId);
    updateNotificationBadge();
    displayNotifications();
    closeNotifications();
    
    if (link) {
        navigateTo(link);
    }


// Get icon for notification type
function getNotificationIcon(type) {
    var icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'bell';
}

// Calculate time ago
function getTimeAgo(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    
    var interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
}

// Update notification badge count
function updateNotificationBadge() {
    var badge = document.getElementById('notificationCount');
    if (!badge) return;
    
    var notifications = window.currentNotifications || [];
    var readNotifications = getReadNotifications();
    var unreadCount = 0;
    
    for (var i = 0; i < notifications.length; i++) {
        if (readNotifications.indexOf(notifications[i].id) === -1) {
            unreadCount++;
        }
    }
    
    badge.textContent = unreadCount;
    
    if (unreadCount === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
}

// Mark all as read
function markAllAsRead() {
    var notifications = window.currentNotifications || [];
    for (var i = 0; i < notifications.length; i++) {
        markNotificationAsRead(notifications[i].id);
    }
    updateNotificationBadge();
    displayNotifications();
    showToast('All notifications marked as read', 'success');
}

// Clear all notifications
function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        markAllAsRead();
        showToast('All notifications cleared', 'success');
    }
}

// Reload notifications every 5 minutes
setInterval(loadNotifications, 5 * 60 * 1000);

// Close notification panel when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeNotifications);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNotifications();
        }
    });
    
    // Reload notifications every 5 minutes
    setInterval(loadNotifications, 5 * 60 * 1000);
});

// ===== ADMIN: Manage Notifications =====

function showManageNotifications() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section class="admin-section">
            <div class="container">
                <div class="admin-header">
                    <h1><i class="fas fa-bell"></i> Manage Notifications</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="showCreateNotificationModal()">
                            <i class="fas fa-plus"></i> Create Notification
                        </button>
                        <button class="btn btn-secondary" onclick="showAdminDashboard()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
                
                <div id="notificationsTable" class="admin-table-container">
                    <div class="loading">Loading notifications...</div>
                </div>
            </div>
        </section>
    `;
    
    loadNotificationsTable();
}

async function loadNotificationsTable() {
    const container = document.getElementById('notificationsTable');
    
    try {
        const response = await fetch('/api/notifications/admin', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP error! status: ' + response.status + ' - ' + errorText);
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const data = await response.json();
        const notifications = data.notifications || [];
        
        if (notifications.length === 0) {
            container.innerHTML = '<p class="text-center">No notifications yet. Create your first notification!</p>';
            return;
        }
        
        const tableHTML = '<table class="admin-table">' +
            '<thead>' +
            '<tr>' +
            '<th>Type</th>' +
            '<th>Title</th>' +
            '<th>Message</th>' +
            '<th>Link</th>' +
            '<th>Status</th>' +
            '<th>Created</th>' +
            '<th>Actions</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        
        const rowsHTML = notifications.map(function(notif) {
            return '<tr>' +
                '<td>' +
                '<span class="notification-type-badge ' + notif.type + '">' +
                '<i class="fas fa-' + getNotificationIcon(notif.type) + '"></i> ' +
                notif.type.toUpperCase() +
                '</span>' +
                '</td>' +
                '<td><strong>' + notif.title + '</strong></td>' +
                '<td>' + notif.message.substring(0, 50) + (notif.message.length > 50 ? '...' : '') + '</td>' +
                '<td>' + (notif.link ? '<span class="badge badge-info">' + notif.link + '</span>' : '<span class="text-muted">None</span>') + '</td>' +
                '<td>' +
                '<span class="badge ' + (notif.published ? 'badge-success' : 'badge-default') + '">' +
                (notif.published ? 'Published' : 'Draft') +
                '</span>' +
                '</td>' +
                '<td>' + formatDate(notif.createdAt) + '</td>' +
                '<td class="actions">' +
                '<button class="btn-icon" onclick="editNotification(\'' + notif.id + '\')" title="Edit">' +
                '<i class="fas fa-edit"></i>' +
                '</button>' +
                '<button class="btn-icon btn-icon-danger" onclick="deleteNotification(\'' + notif.id + '\', \'' + notif.title.replace(/'/g, "\\'") + '\');" title="Delete">' +
                '<i class="fas fa-trash"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';
        }).join('');
        
        container.innerHTML = tableHTML + rowsHTML + '</tbody></table>';
        
    } catch (error) {
        console.error('Failed to load notifications:', error);
        container.innerHTML = '<p class="error-message">Failed to load notifications. Error: ' + error.message + '</p>';
    }
}
function showCreateNotificationModal() {
    const modal = createModal('Create Notification', `
        <form id="createNotificationForm" class="modal-form">
            <div class="form-group">
                <label for="notifType">Type *</label>
                <select id="notifType" required>
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Orange)</option>
                    <option value="error">Error (Red)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="notifTitle">Title *</label>
                <input type="text" id="notifTitle" required placeholder="e.g., New Collection Available">
            </div>
            
            <div class="form-group">
                <label for="notifMessage">Message *</label>
                <textarea id="notifMessage" rows="3" required placeholder="Describe what this notification is about..."></textarea>
            </div>
            
            <div class="form-group">
                <label for="notifLink">Link To (Optional)</label>
                <select id="notifLink">
                    <option value="">No Link</option>
                    <option value="home">Home</option>
                    <option value="digital-archives">Digital Archives</option>
                    <option value="collections">Collections</option>
                    <option value="gallery">Gallery</option>
                    <option value="research">Research</option>
                    <option value="education">Education</option>
                    <option value="services">Services</option>
                    <option value="about">About</option>
                    <option value="contact">Contact</option>
                </select>
                <small class="form-help">Where should users go when they click this notification?</small>
            </div>
            
            <div class="form-group">
                <label for="notifLinkText">Link Text</label>
                <input type="text" id="notifLinkText" placeholder="e.g., View, Learn More, Explore" value="View">
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifPublished" checked>
                    Publish immediately
                </label>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-bell"></i> Create Notification
                </button>
            </div>
        </form>
    `);
    
    document.getElementById('createNotificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const notificationData = {
        type: document.getElementById('notifType').value,
        title: document.getElementById('notifTitle').value,
        message: document.getElementById('notifMessage').value,
        link: document.getElementById('notifLink').value,
        linkText: document.getElementById('notifLinkText').value || 'View',
        published: document.getElementById('notifPublished').checked
    };
    
    try {
        const response = await apiRequest('/notifications', {
            method: 'POST',
            body: JSON.stringify(notificationData)
        });
        
        if (response.success) {
            closeModal(modal);
            showToast('Notification created successfully!', 'success');
            
            // IMPORTANT: Reload public notifications immediately
            await loadNotifications();
            
            // Then reload the admin table
            showManageNotifications();
        } else {
            showToast('Failed to create notification', 'error');
        }
    } catch (error) {
        console.error('Create notification error:', error);
        showToast('Failed to create notification', 'error');
    }
});
}

function editNotification(notificationId) {
    // FIXED: Use fetch instead of apiRequest
    fetch('/api/notifications/admin', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const notification = data.notifications.find(n => n.id === notificationId);
        
        if (!notification) {
            showToast('Notification not found', 'error');
            return;
        }
        
        const modal = createModal('Edit Notification', `
            <form id="editNotificationForm" class="modal-form">
                <div class="form-group">
                    <label for="editNotifType">Type *</label>
                    <select id="editNotifType" required>
                        <option value="info" ${notification.type === 'info' ? 'selected' : ''}>Info (Blue)</option>
                        <option value="success" ${notification.type === 'success' ? 'selected' : ''}>Success (Green)</option>
                        <option value="warning" ${notification.type === 'warning' ? 'selected' : ''}>Warning (Orange)</option>
                        <option value="error" ${notification.type === 'error' ? 'selected' : ''}>Error (Red)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editNotifTitle">Title *</label>
                    <input type="text" id="editNotifTitle" required value="${notification.title}">
                </div>
                
                <div class="form-group">
                    <label for="editNotifMessage">Message *</label>
                    <textarea id="editNotifMessage" rows="3" required>${notification.message}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="editNotifLink">Link To (Optional)</label>
                    <select id="editNotifLink">
                        <option value="" ${!notification.link ? 'selected' : ''}>No Link</option>
                        <option value="home" ${notification.link === 'home' ? 'selected' : ''}>Home</option>
                        <option value="digital-archives" ${notification.link === 'digital-archives' ? 'selected' : ''}>Digital Archives</option>
                        <option value="collections" ${notification.link === 'collections' ? 'selected' : ''}>Collections</option>
                        <option value="gallery" ${notification.link === 'gallery' ? 'selected' : ''}>Gallery</option>
                        <option value="research" ${notification.link === 'research' ? 'selected' : ''}>Research</option>
                        <option value="education" ${notification.link === 'education' ? 'selected' : ''}>Education</option>
                        <option value="services" ${notification.link === 'services' ? 'selected' : ''}>Services</option>
                        <option value="about" ${notification.link === 'about' ? 'selected' : ''}>About</option>
                        <option value="contact" ${notification.link === 'contact' ? 'selected' : ''}>Contact</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editNotifLinkText">Link Text</label>
                    <input type="text" id="editNotifLinkText" value="${notification.linkText || 'View'}">
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editNotifPublished" ${notification.published ? 'checked' : ''}>
                        Published
                    </label>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Notification
                    </button>
                </div>
            </form>
        `);
        
        document.getElementById('editNotificationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedData = {
                type: document.getElementById('editNotifType').value,
                title: document.getElementById('editNotifTitle').value,
                message: document.getElementById('editNotifMessage').value,
                link: document.getElementById('editNotifLink').value,
                linkText: document.getElementById('editNotifLinkText').value || 'View',
                published: document.getElementById('editNotifPublished').checked
            };
            
            try {
                const response = await fetch(`/api/notifications/${notificationId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    closeModal(modal);
                    showToast('Notification updated successfully!', 'success');
                    
                    // Reload public notifications
                    await loadNotifications();
                    
                    // Reload admin table
                    showManageNotifications();
                } else {
                    showToast('Failed to update notification', 'error');
                }
            } catch (error) {
                console.error('Update notification error:', error);
                showToast('Failed to update notification', 'error');
            }
        });
    })
    .catch(error => {
        console.error('Load notification error:', error);
        showToast('Failed to load notification details', 'error');
    });
}

function deleteNotification(notificationId, notificationTitle) {
    const modal = createProfessionalConfirmDialog(
        'Delete Notification',
        'Are you sure you want to delete this notification?',
        `<strong>${notificationTitle}</strong><br><br>This action cannot be undone.`,
        'danger',
        async () => {
            try {
                const response = await apiRequest(`/notifications/${notificationId}`, {
                    method: 'DELETE'
                });
                
                if (response.success) {
                    closeModal(modal);
                    showToast('Notification deleted successfully!', 'success');
                    
                    // IMPORTANT: Reload public notifications immediately
                    await loadNotifications();
                    
                    // Then reload the admin table
                    showManageNotifications();
                } else {
                    showToast('Failed to delete notification', 'error');
                }
            } catch (error) {
                console.error('Delete notification error:', error);
                showToast('Failed to delete notification', 'error');
            }
        }
    );
}