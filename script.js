document.addEventListener('DOMContentLoaded', function() {
    // ===== PAGE MANAGEMENT =====
    const pages = {
        login: document.getElementById('login-page'),
        signup: document.getElementById('signup-page'),
        products: document.getElementById('products-page'),
        profile: document.getElementById('profile-page'),
        cart: document.getElementById('cart-page'),
        checkout: document.getElementById('checkout-page')
    };

    // User Data
    let userData = {
        isLoggedIn: false,
        name: '',
        email: '',
        phone: '',
        addresses: [],
        orders: [],
        wishlist: [],
        cart: []
    };

    // Store the current OTP for verification
    let currentOtp = '';

    // Sample saved addresses for demo (will be replaced by userData.addresses)
    const sampleAddresses = {
        1: {
            id: 1,
            name: "John Doe",
            fullName: "John Doe",
            phone: "+91 9876543210",
            street: "123 Main Street, Apt 4B",
            city: "Mumbai",
            pincode: "400001",
            state: "Maharashtra",
            default: true
        },
        2: {
            id: 2,
            name: "John Doe (Work)",
            fullName: "John Doe",
            phone: "+91 8765432109",
            street: "456 Business Park, Tech Tower",
            city: "Bangalore",
            pincode: "560001",
            state: "Karnataka",
            default: false
        }
    };

    // Initialize the application
    function init() {
        console.log('Initializing Organic Mart...');
        
        // First, ensure only one page is active
        initializePages();
        
        // Load data and setup
        loadUserData();
        setupEventListeners();
        checkLoginStatus();
        
        console.log('Initialization complete');
    }

    // Initialize all pages - ensure only one is active
    function initializePages() {
        console.log('Initializing pages...');
        
        // Remove active class from ALL pages first
        Object.keys(pages).forEach(key => {
            if (pages[key]) {
                pages[key].classList.remove('active');
                console.log(`Removed active class from ${key}`);
            }
        });
        
        // Now check which pages have active class in HTML and fix them
        Object.keys(pages).forEach(key => {
            if (pages[key] && pages[key].classList.contains('active')) {
                console.warn(`Page ${key} still has active class after initialization!`);
                pages[key].classList.remove('active');
            }
        });
    }

    // Load user data from localStorage
    function loadUserData() {
        const savedData = localStorage.getItem('organicMartUserData');
        if (savedData) {
            userData = JSON.parse(savedData);
            console.log('User data loaded:', userData);
        }
        
        // If no addresses exist, add sample addresses for demo
        if (userData.addresses.length === 0) {
            userData.addresses = Object.values(sampleAddresses);
            saveUserData();
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('organicMartUserData', JSON.stringify(userData));
        console.log('User data saved');
    }

    // Check login status and show appropriate page
    function checkLoginStatus() {
        console.log('Checking login status:', userData.isLoggedIn);
        
        if (userData.isLoggedIn) {
            showPage('products');
        } else {
            showPage('login');
        }
    }

    // Show specific page and hide others
    function showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Hide all pages first
        Object.keys(pages).forEach(key => {
            if (pages[key]) {
                pages[key].classList.remove('active');
            }
        });
        
        // Show the requested page
        if (pages[pageName]) {
            pages[pageName].classList.add('active');
            
            // Scroll to top when changing pages
            window.scrollTo(0, 0);
            
            // Initialize page-specific functionality
            initializePageContent(pageName);
            
            console.log(`Page ${pageName} shown successfully`);
        } else {
            console.error(`Page ${pageName} not found`);
        }
    }

    function initializePageContent(pageName) {
        console.log('Initializing content for:', pageName);
        switch(pageName) {
            case 'products':
                updateCartCount();
                updateUserProfile();
                initializeLazyLoading();
                break;
            case 'profile':
                loadProfileData();
                break;
            case 'cart':
                renderCart();
                break;
            case 'checkout':
                initializeCheckout();
                break;
            case 'login':
                initializeLoginPage();
                break;
            case 'signup':
                initializeSignupPage();
                break;
        }
    }

    // Initialize login page specifically
    function initializeLoginPage() {
        console.log('Initializing login page...');
        // Reset login form state
        document.getElementById('otp-section').style.display = 'none';
        document.getElementById('get-otp-btn').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('login-form').reset();
        
        // Clear OTP inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach(input => input.value = '');
        
        // Set phone tab as default
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="phone"]').classList.add('active');
        document.getElementById('phone-tab').classList.add('active');
    }

    // Initialize signup page specifically
    function initializeSignupPage() {
        console.log('Initializing signup page...');
        // Reset signup form
        document.getElementById('signup-form').reset();
        
        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    // Setup all event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        setupLoginEvents();
        setupSignupEvents();
        setupNavigationEvents();
        setupProductEvents();
        setupProfileEvents();
        setupCartEvents();
        setupCheckoutEvents();
        setupLazyLoading();
        setupAddressManagement();
    }

    // ===== ADDRESS MANAGEMENT =====
    function setupAddressManagement() {
        // This will be called when checkout page is initialized
        const savedAddressRadios = document.querySelectorAll('input[name="saved-address"]');
        const addressForm = document.getElementById('address-form');
        
        if (!savedAddressRadios.length || !addressForm) return;
        
        const formInputs = addressForm.querySelectorAll('input, textarea');
        
        // Show/hide address form based on selection
        savedAddressRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'new') {
                    addressForm.style.display = 'block';
                    clearForm(formInputs);
                    document.getElementById('save-address').checked = true;
                } else {
                    addressForm.style.display = 'none';
                    // Fill form with selected address data
                    const addressId = parseInt(this.value);
                    const address = userData.addresses.find(addr => addr.id === addressId);
                    if (address) {
                        fillFormWithAddress(address);
                    }
                }
            });
        });
        
        // Edit address button functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit-address')) {
                e.preventDefault();
                const addressId = parseInt(e.target.getAttribute('data-address-id'));
                
                // Select the new address option
                const newAddressRadio = document.getElementById('address-new');
                if (newAddressRadio) {
                    newAddressRadio.checked = true;
                    addressForm.style.display = 'block';
                    
                    // Fill form with address data
                    const address = userData.addresses.find(addr => addr.id === addressId);
                    if (address) {
                        fillFormWithAddress(address);
                    }
                }
            }
        });
    }

    function fillFormWithAddress(address) {
        const elements = {
            'delivery-name': address.fullName || address.name || '',
            'delivery-phone': address.phone || '',
            'delivery-address': address.street || '',
            'delivery-city': address.city || '',
            'delivery-pincode': address.pincode || '',
            'delivery-state': address.state || ''
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = elements[id];
            }
        });
    }

    function clearForm(formInputs) {
        formInputs.forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
            }
        });
    }

    // ===== LOGIN FUNCTIONALITY =====
    function setupLoginEvents() {
        const showSignupLink = document.getElementById('show-signup');
        const loginForm = document.getElementById('login-form');
        const getOtpBtn = document.getElementById('get-otp-btn');
        const loginBtn = document.getElementById('login-btn');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const otpInputs = document.querySelectorAll('.otp-input');
        const resendOtpLink = document.getElementById('resend-otp');
        const socialLoginBtns = document.querySelectorAll('.social-btn');

        console.log('Login events setup:', {
            showSignupLink: !!showSignupLink,
            loginForm: !!loginForm,
            getOtpBtn: !!getOtpBtn,
            loginBtn: !!loginBtn,
            tabBtns: tabBtns.length,
            otpInputs: otpInputs.length
        });

        // Show signup page
        if (showSignupLink) {
            showSignupLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Switching to signup page');
                showPage('signup');
            });
        }

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                console.log('Switching to tab:', tab);
                
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tab}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Get OTP button
        if (getOtpBtn) {
            getOtpBtn.addEventListener('click', function() {
                console.log('Get OTP clicked');
                const currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
                let isValid = false;
                
                if (currentTab === 'phone') {
                    const phoneInput = document.getElementById('phone');
                    if (validatePhone(phoneInput.value)) {
                        isValid = true;
                        simulateOtpSend('phone');
                    } else {
                        showError('phone-error', 'Please enter a valid phone number');
                    }
                } else {
                    const emailInput = document.getElementById('email');
                    if (validateEmail(emailInput.value)) {
                        isValid = true;
                        simulateOtpSend('email');
                    } else {
                        showError('email-error', 'Please enter a valid email address');
                    }
                }
                
                if (isValid) {
                    showOtpSection();
                }
            });
        }

        // OTP input handling
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                // Check if all OTP fields are filled
                const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
                if (allFilled) {
                    document.getElementById('login-btn').style.display = 'block';
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        // Resend OTP
        if (resendOtpLink) {
            resendOtpLink.addEventListener('click', function(e) {
                e.preventDefault();
                simulateOtpSend();
            });
        }

        // Social login
        socialLoginBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
                simulateSocialLogin(provider);
            });
        });

        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }

        // Login button click
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
    }

    // ===== SIGNUP FUNCTIONALITY =====
    function setupSignupEvents() {
        const showLoginLink = document.getElementById('show-login');
        const signupForm = document.getElementById('signup-form');
        const socialSignupBtns = document.querySelectorAll('#signup-page .social-btn');

        // Show login page
        if (showLoginLink) {
            showLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Switching to login page');
                showPage('login');
            });
        }

        // Social signup
        socialSignupBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
                simulateSocialLogin(provider);
            });
        });

        // Signup form submission
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup();
            });
        }
    }

    // ===== NAVIGATION FUNCTIONALITY =====
    function setupNavigationEvents() {
        // User icon
        const userIcon = document.getElementById('user-icon');
        if (userIcon) {
            userIcon.addEventListener('click', function(e) {
                e.preventDefault();
                if (userData.isLoggedIn) {
                    showPage('profile');
                } else {
                    showPage('login');
                }
            });
        }

        // Cart icon
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('cart');
            });
        }

        // Profile cart icon
        const profileCartIcon = document.getElementById('profile-cart-icon');
        if (profileCartIcon) {
            profileCartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('cart');
            });
        }

        // Cart user icon
        const cartUserIcon = document.getElementById('cart-user-icon');
        if (cartUserIcon) {
            cartUserIcon.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('profile');
            });
        }

        // Back to products buttons
        const backToProductsBtns = document.querySelectorAll('#back-to-products, #cart-back-to-products, #checkout-back-to-cart, #empty-cart-shop, #start-shopping, #browse-products, #continue-shopping');
        backToProductsBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showPage('products');
                });
            }
        });

        // Category navigation
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.querySelector('h3').textContent.toLowerCase();
                scrollToSection(category);
            });
        });
    }

    // ===== PRODUCT FUNCTIONALITY =====
    function setupProductEvents() {
        // Delegate events for dynamically generated product cards
        document.addEventListener('click', function(e) {
            // Add to cart
            if (e.target.classList.contains('add-to-cart')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('.product-title').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;
                    const productCategory = productCard.querySelector('.product-category').textContent;
                    const productImage = productCard.querySelector('.product-image img').src;
                    
                    addToCart({
                        name: productName,
                        price: extractPrice(productPrice),
                        category: productCategory,
                        image: productImage
                    });
                }
            }
            
            // Wishlist toggle
            if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                const wishlistBtn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                const productCard = wishlistBtn.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('.product-title').textContent;
                    toggleWishlist(productName, wishlistBtn);
                }
            }
        });
    }

    // ===== PROFILE FUNCTIONALITY =====
    function setupProfileEvents() {
        // Profile navigation
        const profileNavItems = document.querySelectorAll('.profile-nav-item');
        profileNavItems.forEach(item => {
            if (!item.classList.contains('logout-btn')) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tab = this.getAttribute('data-tab');
                    
                    profileNavItems.forEach(navItem => navItem.classList.remove('active'));
                    this.classList.add('active');
                    
                    const profileTabs = document.querySelectorAll('.profile-tab');
                    profileTabs.forEach(tabElement => tabElement.classList.remove('active'));
                    
                    const activeTab = document.getElementById(tab);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                });
            }
        });

        // Logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveProfile();
            });
        }

        // Add address button
        const addAddressBtn = document.getElementById('add-address-btn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', function() {
                showAddAddressModal();
            });
        }

        // Add address form
        const addAddressForm = document.getElementById('add-address-form');
        if (addAddressForm) {
            addAddressForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAddress();
            });
        }

        // Modal close buttons
        const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-cancel');
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                hideAddAddressModal();
            });
        });
    }

    // ===== CART FUNCTIONALITY =====
    function setupCartEvents() {
        // Delegate events for cart items
        document.addEventListener('click', function(e) {
            // Quantity decrease
            if (e.target.classList.contains('quantity-decrease')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productName = cartItem.querySelector('.cart-item-title').textContent;
                    updateCartQuantity(productName, -1);
                }
            }
            
            // Quantity increase
            if (e.target.classList.contains('quantity-increase')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productName = cartItem.querySelector('.cart-item-title').textContent;
                    updateCartQuantity(productName, 1);
                }
            }
            
            // Remove item
            if (e.target.classList.contains('remove-item')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productName = cartItem.querySelector('.cart-item-title').textContent;
                    removeFromCart(productName);
                }
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (userData.cart.length > 0) {
                    showPage('checkout');
                }
            });
        }
    }

    // ===== CHECKOUT FUNCTIONALITY =====
    function setupCheckoutEvents() {
        // Delivery options
        const deliveryOptions = document.querySelectorAll('.delivery-option input');
        deliveryOptions.forEach(option => {
            option.addEventListener('change', function() {
                updateDeliveryOption(this.value);
            });
        });

        // Payment options
        const paymentOptions = document.querySelectorAll('.payment-option input');
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                updatePaymentOption(this.value);
            });
        });

        // Step navigation
        const nextButtons = document.querySelectorAll('.btn-next');
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                navigateToStep(nextStep);
            });
        });

        const prevButtons = document.querySelectorAll('.btn-prev');
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                navigateToStep(prevStep);
            });
        });

        // Track order button
        const trackOrderBtn = document.getElementById('track-order');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', function() {
                alert('Order tracking feature will be available soon!');
            });
        }
    }

    // ===== LAZY LOADING FUNCTIONALITY =====
    function setupLazyLoading() {
        // Initialize lazy loading for images
        initializeLazyLoading();
    }

    function initializeLazyLoading() {
        const lazyImages = [].slice.call(document.querySelectorAll("img.lazy-img"));
        
        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        const dataSrc = lazyImage.getAttribute('data-src');
                        if (dataSrc) {
                            lazyImage.src = dataSrc;
                            lazyImage.classList.remove("lazy-img");
                            lazyImage.onload = function() {
                                lazyImage.classList.add("loaded");
                            };
                            lazyImage.onerror = function() {
                                lazyImage.classList.add("error");
                            };
                            lazyImageObserver.unobserve(lazyImage);
                        }
                    }
                });
            }, {
                rootMargin: "200px 0px"
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(function(lazyImage) {
                const dataSrc = lazyImage.getAttribute('data-src');
                if (dataSrc) {
                    lazyImage.src = dataSrc;
                    lazyImage.classList.remove("lazy-img");
                    lazyImage.onload = function() {
                        lazyImage.classList.add("loaded");
                    };
                    lazyImage.onerror = function() {
                        lazyImage.classList.add("error");
                    };
                }
            });
        }

        // Load hero image immediately
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")';
        }
    }

    // ===== VALIDATION FUNCTIONS =====
    function validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // ===== ERROR HANDLING =====
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }

    // ===== OTP FUNCTIONALITY =====
    function simulateOtpSend(method = null) {
        // Generate random 6-digit OTP
        currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Demo OTP sent via ${method || 'selected method'}: ${currentOtp}`);
        
        // Auto-fill OTP for demo purposes
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.value = currentOtp[index];
        });
        
        // Show login button
        document.getElementById('login-btn').style.display = 'block';
        
        startOtpTimer();
        showSuccessMessage(`OTP sent to your ${method || 'selected method'}`);
    }

    function showOtpSection() {
        const otpSection = document.getElementById('otp-section');
        const getOtpBtn = document.getElementById('get-otp-btn');
        const loginBtn = document.getElementById('login-btn');
        
        if (otpSection) otpSection.style.display = 'block';
        if (getOtpBtn) getOtpBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
    }

    let otpTimer;
    function startOtpTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        let timeLeft = 120;
        
        if (otpTimer) clearInterval(otpTimer);
        
        otpTimer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                timerElement.textContent = '00:00';
                timerElement.style.color = '#e53935';
                currentOtp = ''; // Clear OTP after expiry
            }
        }, 1000);
    }

    // ===== LOGIN HANDLING =====
    function handleLogin() {
        console.log('Login button clicked');
        
        // Get OTP values
        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
        
        console.log('Entered OTP:', enteredOtp);
        console.log('Current OTP:', currentOtp);
        
        // Clear previous errors
        hideError('otp-error');
        
        // Validate OTP
        if (enteredOtp.length !== 6) {
            showError('otp-error', 'Please enter a complete 6-digit OTP');
            return;
        }
        
        // For demo purposes, accept any 6-digit OTP
        if (enteredOtp.length === 6) {
            // Show loading state
            const loginBtn = document.getElementById('login-btn');
            const btnText = loginBtn.querySelector('.btn-text');
            const btnLoader = loginBtn.querySelector('.btn-loader');
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            
            // Simulate API call delay
            setTimeout(() => {
                userData.isLoggedIn = true;
                userData.name = "Demo User";
                userData.email = "demo@organicmart.com";
                userData.phone = "9876543210";
                
                saveUserData();
                showPage('products');
                showSuccessMessage('Login successful!');
                
                // Reset button state
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
            }, 1500);
        } else {
            showError('otp-error', 'Invalid OTP. Please try again.');
        }
    }

    // ===== SIGNUP HANDLING =====
    function handleSignup() {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Clear previous errors
        hideError('name-error');
        hideError('signup-email-error');
        hideError('signup-phone-error');
        hideError('password-error');
        hideError('confirm-password-error');
        hideError('terms-error');
        
        // Validate form
        let hasError = false;
        
        if (!fullname) {
            showError('name-error', 'Please enter your full name');
            hasError = true;
        }
        
        if (!validateEmail(email)) {
            showError('signup-email-error', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!validatePhone(phone)) {
            showError('signup-phone-error', 'Please enter a valid phone number');
            hasError = true;
        }
        
        if (!validatePassword(password)) {
            showError('password-error', 'Password must be at least 6 characters');
            hasError = true;
        }
        
        if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            hasError = true;
        }
        
        if (!terms) {
            showError('terms-error', 'Please accept the terms and conditions');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Show loading state
        const signupBtn = document.getElementById('signup-btn');
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoader = signupBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        
        // Simulate API call delay
        setTimeout(() => {
            // Create user account
            userData.isLoggedIn = true;
            userData.name = fullname;
            userData.email = email;
            userData.phone = phone;
            
            saveUserData();
            showPage('products');
            showSuccessMessage('Account created successfully!');
            
            // Reset button state
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }, 1500);
    }

    // ===== SOCIAL LOGIN =====
    function simulateSocialLogin(provider) {
        userData.isLoggedIn = true;
        userData.name = `${provider} User`;
        userData.email = `user@${provider.toLowerCase()}.com`;
        userData.phone = "9876543210";
        
        saveUserData();
        showPage('products');
        showSuccessMessage(`Logged in with ${provider}!`);
    }

    // ===== LOGOUT HANDLING =====
    function handleLogout() {
        userData.isLoggedIn = false;
        saveUserData();
        showPage('login');
        showSuccessMessage('Logged out successfully!');
    }

    // ===== CART FUNCTIONALITY =====
    function addToCart(product) {
        const existingItem = userData.cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            userData.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveUserData();
        updateCartCount();
        showSuccessMessage(`${product.name} added to cart!`);
        
        // If on cart page, refresh the cart
        if (pages.cart.classList.contains('active')) {
            renderCart();
        }
    }

    function updateCartQuantity(productName, change) {
        const item = userData.cart.find(item => item.name === productName);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveUserData();
            renderCart();
            updateCartCount();
        }
    }

    function removeFromCart(productName) {
        userData.cart = userData.cart.filter(item => item.name !== productName);
        saveUserData();
        renderCart();
        updateCartCount();
        showSuccessMessage('Item removed from cart');
    }

    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    function renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartItemsContainer || !cartSummary) return;
        
        if (userData.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your Cart is Empty</h3>
                    <p>Add some organic goodness to your cart!</p>
                    <a href="#" class="btn" id="empty-cart-shop">Start Shopping</a>
                </div>
            `;
            
            cartSummary.innerHTML = `
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="cart-subtotal">₹0</span>
                </div>
                <div class="summary-row">
                    <span>Delivery</span>
                    <span id="cart-delivery">₹0</span>
                </div>
                <div class="summary-row">
                    <span>Tax</span>
                    <span id="cart-tax">₹0</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span id="cart-total">₹0</span>
                </div>
                <button class="btn btn-checkout" id="checkout-btn" disabled>Proceed to Checkout</button>
            `;
            
            return;
        }
        
        // Render cart items
        cartItemsContainer.innerHTML = userData.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <div>
                            <div class="cart-item-category">${item.category}</div>
                            <h3 class="cart-item-title">${item.name}</h3>
                        </div>
                        <div class="cart-item-price">₹${item.price}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn quantity-decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn quantity-increase">+</button>
                        </div>
                        <button class="remove-item">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotal = userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal > 499 ? 0 : 50;
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + delivery + tax;
        
        // Update cart summary
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span id="cart-subtotal">₹${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Delivery</span>
                <span id="cart-delivery">${delivery === 0 ? 'Free' : `₹${delivery}`}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span id="cart-tax">₹${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span id="cart-total">₹${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-checkout" id="checkout-btn">Proceed to Checkout</button>
        `;
        
        // Update items count
        const cartItemsCount = document.getElementById('cart-items-count');
        if (cartItemsCount) {
            const totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
        
        // Re-attach checkout button event listener
        const newCheckoutBtn = document.getElementById('checkout-btn');
        if (newCheckoutBtn) {
            newCheckoutBtn.addEventListener('click', function() {
                if (userData.cart.length > 0) {
                    showPage('checkout');
                }
            });
        }
    }

    // ===== WISHLIST FUNCTIONALITY =====
    function toggleWishlist(productName, button) {
        const index = userData.wishlist.indexOf(productName);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            userData.wishlist.push(productName);
            button.classList.add('active');
            icon.classList.replace('far', 'fas');
            showSuccessMessage('Added to wishlist!');
        } else {
            userData.wishlist.splice(index, 1);
            button.classList.remove('active');
            icon.classList.replace('fas', 'far');
            showSuccessMessage('Removed from wishlist');
        }
        
        saveUserData();
    }

    // ===== PROFILE FUNCTIONALITY =====
    function loadProfileData() {
        // Update profile info
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-email').textContent = userData.email;
        
        // Populate profile form
        document.getElementById('profile-fullname').value = userData.name;
        document.getElementById('profile-phone').value = userData.phone;
        document.getElementById('profile-email').value = userData.email;
    }

    function saveProfile() {
        const name = document.getElementById('profile-fullname').value;
        const phone = document.getElementById('profile-phone').value;
        const email = document.getElementById('profile-email').value;
        
        userData.name = name;
        userData.phone = phone;
        userData.email = email;
        
        saveUserData();
        updateUserProfile();
        showSuccessMessage('Profile updated successfully!');
    }

    function updateUserProfile() {
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        
        if (profileName) profileName.textContent = userData.name;
        if (profileEmail) profileEmail.textContent = userData.email;
    }

    function showAddAddressModal() {
        const modal = document.getElementById('add-address-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    function hideAddAddressModal() {
        const modal = document.getElementById('add-address-modal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('add-address-form').reset();
        }
    }

    function saveAddress() {
        const name = document.getElementById('address-name').value;
        const fullName = document.getElementById('address-fullname').value;
        const phone = document.getElementById('address-phone').value;
        const street = document.getElementById('address-street').value;
        const city = document.getElementById('address-city').value;
        const pincode = document.getElementById('address-pincode').value;
        const state = document.getElementById('address-state').value;
        const isDefault = document.getElementById('default-address').checked;
        
        const newAddress = {
            id: Date.now(),
            name,
            fullName,
            phone,
            street,
            city,
            pincode,
            state,
            default: isDefault
        };
        
        // If this is set as default, remove default from others
        if (isDefault) {
            userData.addresses.forEach(addr => addr.default = false);
        }
        
        userData.addresses.push(newAddress);
        saveUserData();
        hideAddAddressModal();
        showSuccessMessage('Address saved successfully!');
    }

    // ===== CHECKOUT FUNCTIONALITY =====
    function initializeCheckout() {
        // Populate delivery form with user data
        document.getElementById('delivery-name').value = userData.name;
        document.getElementById('delivery-phone').value = userData.phone;
        
        // Load saved addresses for selection
        renderSavedAddresses();
        
        // Calculate and display order summary
        updateCheckoutSummary();
    }

    function renderSavedAddresses() {
        const savedAddressesContainer = document.querySelector('.saved-addresses');
        if (!savedAddressesContainer) return;
        
        // Clear existing content (except the first radio button)
        const existingItems = savedAddressesContainer.querySelectorAll('.saved-address-item:not(:first-child)');
        existingItems.forEach(item => item.remove());
        
        // Add user's saved addresses
        userData.addresses.forEach(address => {
            const addressItem = document.createElement('div');
            addressItem.className = 'saved-address-item';
            addressItem.innerHTML = `
                <input type="radio" name="saved-address" id="address-${address.id}" value="${address.id}">
                <label for="address-${address.id}">
                    <div class="address-header">
                        <strong>${address.name}</strong>
                        ${address.default ? '<span class="default-badge">Default</span>' : ''}
                        <button class="btn-edit-address" data-address-id="${address.id}">Edit</button>
                    </div>
                    <div class="address-details">
                        <p>${address.street}</p>
                        <p>${address.city}, ${address.state} - ${address.pincode}</p>
                        <p>Phone: ${address.phone}</p>
                    </div>
                </label>
            `;
            
            savedAddressesContainer.appendChild(addressItem);
        });
        
        // Re-attach event listeners for the new address items
        setupAddressManagement();
    }

    function updateCheckoutSummary() {
        const subtotal = userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal > 499 ? 0 : 50;
        const tax = subtotal * 0.05;
        const total = subtotal + delivery + tax;
        
        // Update all summary elements
        const summaryElements = [
            { id: 'checkout-subtotal', value: `₹${subtotal}` },
            { id: 'checkout-delivery', value: delivery === 0 ? 'Free' : `₹${delivery}` },
            { id: 'checkout-tax', value: `₹${tax.toFixed(2)}` },
            { id: 'checkout-total', value: `₹${total.toFixed(2)}` },
            { id: 'confirm-total', value: `₹${total.toFixed(2)}` }
        ];
        
        summaryElements.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.textContent = item.value;
            }
        });
    }

    function navigateToStep(step) {
        // Before proceeding to payment step, validate address
        if (step === 'payment') {
            if (!validateCurrentAddress()) {
                showError('address-error', 'Please select or enter a valid address');
                return;
            }
        }
        
        // Update steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(s => s.classList.remove('active'));
        
        const currentStep = document.querySelector(`.step[data-step="${step}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Update content
        const checkoutSteps = document.querySelectorAll('.checkout-step');
        checkoutSteps.forEach(s => s.classList.remove('active'));
        
        const currentContent = document.getElementById(`${step}-step`);
        if (currentContent) {
            currentContent.classList.add('active');
        }
        
        // Special handling for confirmation step
        if (step === 'confirmation') {
            completeOrder();
        }
    }

    function validateCurrentAddress() {
        const selectedAddress = document.querySelector('input[name="saved-address"]:checked');
        if (!selectedAddress) return false;
        
        if (selectedAddress.value === 'new') {
            // Validate form inputs
            const name = document.getElementById('delivery-name').value;
            const phone = document.getElementById('delivery-phone').value;
            const address = document.getElementById('delivery-address').value;
            const city = document.getElementById('delivery-city').value;
            const pincode = document.getElementById('delivery-pincode').value;
            const state = document.getElementById('delivery-state').value;
            
            return name && phone && address && city && pincode && state;
        } else {
            // Address from saved addresses is already valid
            return true;
        }
    }

    function updateDeliveryOption(option) {
        // Update delivery options UI
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(opt => opt.classList.remove('active'));
        
        const selectedOption = document.querySelector(`.delivery-option input[value="${option}"]`).closest('.delivery-option');
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update delivery cost in summary
        updateCheckoutSummary();
    }

    function updatePaymentOption(option) {
        // Update payment options UI
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        
        const selectedOption = document.querySelector(`.payment-option input[value="${option}"]`).closest('.payment-option');
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Show/hide payment forms
        const paymentForms = document.querySelectorAll('.payment-form');
        paymentForms.forEach(form => form.classList.remove('active'));
        
        const selectedForm = document.getElementById(`${option}-form`);
        if (selectedForm) {
            selectedForm.classList.add('active');
        }
    }

    function completeOrder() {
        // Get selected address data
        const selectedAddress = document.querySelector('input[name="saved-address"]:checked');
        let addressData;
        
        if (selectedAddress.value === 'new') {
            // Get data from form
            addressData = {
                name: document.getElementById('delivery-name').value,
                phone: document.getElementById('delivery-phone').value,
                address: document.getElementById('delivery-address').value,
                city: document.getElementById('delivery-city').value,
                pincode: document.getElementById('delivery-pincode').value,
                state: document.getElementById('delivery-state').value
            };
            
            // Save address if checkbox is checked
            if (document.getElementById('save-address').checked) {
                const newAddress = {
                    id: Date.now(),
                    name: addressData.name,
                    fullName: addressData.name,
                    phone: addressData.phone,
                    street: addressData.address,
                    city: addressData.city,
                    pincode: addressData.pincode,
                    state: addressData.state,
                    default: false
                };
                
                userData.addresses.push(newAddress);
            }
        } else {
            // Get data from saved addresses
            const addressId = parseInt(selectedAddress.value);
            const address = userData.addresses.find(addr => addr.id === addressId);
            if (address) {
                addressData = {
                    name: address.fullName || address.name,
                    phone: address.phone,
                    address: address.street,
                    city: address.city,
                    pincode: address.pincode,
                    state: address.state
                };
            }
        }
        
        // Generate order details
        const orderId = 'OM' + Date.now().toString().slice(-6);
        const orderDate = new Date().toLocaleDateString();
        
        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const paymentText = {
            card: 'Credit Card',
            upi: 'UPI',
            cod: 'Cash on Delivery'
        }[paymentMethod];
        
        // Get delivery option
        const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
        const deliveryText = {
            standard: '2-3 business days',
            express: 'Next day delivery'
        }[deliveryOption];
        
        // Update confirmation details
        if (addressData) {
            document.getElementById('confirm-address').textContent = 
                `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`;
        }
        document.getElementById('confirm-delivery').textContent = deliveryText;
        document.getElementById('confirm-payment').textContent = paymentText;
        
        // Update order ID
        document.querySelector('.order-id').textContent = `Order #${orderId}`;
        
        // Create order record
        const order = {
            id: orderId,
            date: orderDate,
            items: [...userData.cart],
            total: userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'confirmed',
            address: addressData,
            payment: paymentText,
            delivery: deliveryText
        };
        
        userData.orders.push(order);
        
        // Clear cart
        userData.cart = [];
        saveUserData();
        updateCartCount();
    }

    // ===== UTILITY FUNCTIONS =====
    function extractPrice(priceText) {
        // Extract numeric price from text like "₹199 ₹249"
        const match = priceText.match(/₹(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showSuccessMessage(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ===== INITIALIZE THE APPLICATION =====
    init();
});