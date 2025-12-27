// ====== DOM ELEMENTS ======
const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetPasswordSection = document.getElementById('reset-password-section');
const forgotPasswordLinks = document.querySelectorAll('.forgot-password-link');
const backToLoginBtn = document.getElementById('back-to-login');
const successModal = document.getElementById('success-modal');
const resetSuccessModal = document.getElementById('reset-success-modal');

// Feedback System DOM Elements
const marqueeBtn = document.getElementById('feedbackBtnMarquee');
const feedbackModal = document.getElementById('feedbackModal');
const closeModalBtn = document.getElementById('closeModal');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackSuccess = document.getElementById('feedbackSuccess');
const closeSuccessBtn = document.getElementById('closeSuccess');
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');
const ratingButtons = document.querySelectorAll('.rating-btn');
const ratingInput = document.getElementById('rating');
const feedbackType = document.getElementById('feedbackType');
const submitBtn = document.getElementById('submitFeedback');

// ====== STATE MANAGEMENT ======
let currentTab = 'username'; // Changed default to 'username'
let resetStep = 1;
let otpTimer = null;
let otpTimeLeft = 120; // 2 minutes in seconds
let generatedOTP = '';
let resetIdentifier = ''; // Store the email/phone for reset

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializePasswordToggles();
    initializeOTPInputs();
    attachEventListeners();
    checkRememberedUser();
    
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

    // Product Database with quantity-based pricing for ALL 48 products
    const productDatabase = {
        // Fruits (1-16)
        1: { 
            name: "Organic Shimla Apples",
            category: "Fruits",
            originalPrice: 249,
            discount: 20,
            prices: {
                1: 199,  // 500g
                2: 398,  // 1kg
                3: 597,  // 1.5kg
                4: 796,  // 2kg
                5: 995   // 2.5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg",
                5: "2.5kg"
            },
            image: "https://w0.peakpx.com/wallpaper/182/615/HD-wallpaper-fruits-apple-fruit.jpg",
            description: "Crisp and juicy organic apples from Shimla hills",
            rating: 4.5,
            reviews: 128,
            stock: 50,
            organicCertified: true
        },
        2: { 
            name: "Organic Bananas",
            category: "Fruits",
            originalPrice: 79,
            discount: 25,
            prices: {
                1: 59,   // 9 pcs
                2: 99,   // 15 pcs
                3: 132,  // 20 pcs
                4: 79,   // 12 pcs
                5: 158   // 24 pcs
            },
            weight: {
                1: "9 pcs",
                2: "15 pcs",
                3: "20 pcs",
                4: "12 pcs",
                5: "24 pcs"
            },
            image: "https://png.pngtree.com/thumb_back/fh260/background/20220319/pngtree-a-hanging-banana-hd-photography-material-image_1022466.jpg",
            description: "Naturally ripened organic bananas",
            rating: 4.3,
            reviews: 95,
            stock: 100,
            organicCertified: true
        },
        3: { 
            name: "Organic Mangoes",
            category: "Fruits",
            originalPrice: 599,
            discount: 17,
            prices: {
                1: 499,  // 500g
                2: 998,  // 1kg
                3: 1497, // 1.5kg
                4: 1996, // 2kg
                5: 2495  // 2.5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg",
                5: "2.5kg"
            },
            image: "https://wallpapers.com/images/featured/mango-evb0z302mlfebdo0.jpg",
            description: "Sweet Alphonso mangoes, organic farming",
            rating: 4.7,
            reviews: 210,
            stock: 30,
            organicCertified: true,
            seasonal: true
        },
        4: { 
            name: "Organic Pomegranate",
            category: "Fruits",
            originalPrice: 149,
            discount: 13,
            prices: {
                1: 129,  // 250g
                2: 258,  // 500g
                3: 516,  // 1kg
                4: 774,  // 1.5kg
                5: 1032  // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "1.5kg",
                5: "2kg"
            },
            image: "https://t3.ftcdn.net/jpg/04/32/47/36/360_F_432473688_NBFaMH9L7Ls0kvAxnCZnRlvbCaSgxozB.jpg",
            description: "Ruby red pomegranate seeds, antioxidant rich",
            rating: 4.4,
            reviews: 87,
            stock: 45,
            organicCertified: true
        },
        5: { 
            name: "Organic Oranges",
            category: "Fruits",
            originalPrice: 179,
            discount: 17,
            prices: {
                1: 149,  // 250g
                2: 298,  // 500g
                3: 596,  // 1kg
                4: 894,  // 1.5kg
                5: 1192  // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "1.5kg",
                5: "2kg"
            },
            image: "https://t4.ftcdn.net/jpg/02/79/60/69/360_F_279606999_4fItjv1RGj7ogujzQSZqB9hfkbyzxJ4r.jpg",
            description: "Juicy Nagpur oranges, Vitamin C rich",
            rating: 4.6,
            reviews: 142,
            stock: 60,
            organicCertified: true
        },
        6: { 
            name: "Organic Mosambi",
            category: "Fruits",
            originalPrice: 139,
            discount: 14,
            prices: {
                1: 119,  // 500g
                2: 238,  // 1kg
                3: 357,  // 1.5kg
                4: 476,  // 2kg
                5: 595   // 2.5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg",
                5: "2.5kg"
            },
            image: "https://cmsimages.timesgroup.com/image-resizer/Bombaytimes?s3_path=Bombaytimes/posts/1745396124283/assets/images/aFzqTg3LA.png&format=webp",
            description: "Sweet lime, perfect for juices",
            rating: 4.2,
            reviews: 76,
            stock: 55,
            organicCertified: true
        },
        7: { 
            name: "Organic Lemons",
            category: "Fruits",
            originalPrice: 79,
            discount: 25,
            prices: {
                1: 59,   // 250g
                2: 118,  // 500g
                3: 177,  // 750g
                4: 236,  // 1kg
                5: 295   // 1.25kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "750g",
                4: "1kg",
                5: "1.25kg"
            },
            image: "https://www.commodityonline.com/leads/2024/02/1676436444_63ec63dc8dda9_2.webp",
            description: "Fresh organic lemons, pesticide-free",
            rating: 4.8,
            reviews: 203,
            stock: 80,
            organicCertified: true
        },
        8: { 
            name: "Organic Black Grapes",
            category: "Fruits",
            originalPrice: 199,
            discount: 10,
            prices: {
                1: 179,  // 500g
                2: 358,  // 1kg
                3: 537,  // 1.5kg
                4: 716,  // 2kg
                5: 895   // 2.5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg",
                5: "2.5kg"
            },
            image: "https://images.healthshots.com/healthshots/en/uploads/2022/01/18163418/black-grapes.jpg",
            description: "Seedless black grapes, rich in antioxidants",
            rating: 4.5,
            reviews: 91,
            stock: 40,
            organicCertified: true
        },
        9: { 
            name: "Organic Watermelon",
            category: "Fruits",
            originalPrice: 129,
            discount: 23,
            prices: {
                1: 99,   // 3kg
                2: 198,  // 6kg
                3: 297,  // 9kg
                4: 396   // 12kg
            },
            weight: {
                1: "3kg",
                2: "6kg",
                3: "9kg",
                4: "12kg"
            },
            image: "https://watermark.lovepik.com/photo/20211210/large/lovepik-watermelon-for-summer-picture_501768493.jpg",
            description: "Sweet and hydrating watermelon",
            rating: 4.7,
            reviews: 134,
            stock: 25,
            organicCertified: true,
            seasonal: true
        },
        10: { 
            name: "Organic Muskmelon",
            category: "Fruits",
            originalPrice: 109,
            discount: 18,
            prices: {
                1: 89,   // 1.5kg
                2: 178,  // 3kg
                3: 267,  // 4.5kg
                4: 356   // 6kg
            },
            weight: {
                1: "1.5kg",
                2: "3kg",
                3: "4.5kg",
                4: "6kg"
            },
            image: "https://t3.ftcdn.net/jpg/08/56/30/38/360_F_856303873_lysQgpwr108YHHHyEeiGepwZ2Jmg5doG.jpg",
            description: "Aromatic muskmelon, naturally sweet",
            rating: 4.4,
            reviews: 68,
            stock: 35,
            organicCertified: true
        },
        11: { 
            name: "Organic Papaya",
            category: "Fruits",
            originalPrice: 99,
            discount: 20,
            prices: {
                1: 79,   // 1kg
                2: 158,  // 2kg
                3: 237,  // 3kg
                4: 316   // 4kg
            },
            weight: {
                1: "1kg",
                2: "2kg",
                3: "3kg",
                4: "4kg"
            },
            image: "https://media.istockphoto.com/id/1163930184/photo/papaya-on-wooden-background.jpg?s=612x612&w=0&k=20&c=W-1l2k1J8raJGvUb1NM0oeqEdC2DqRbt-2gpzfXL01o=",
            description: "Ripe papaya, digestive aid",
            rating: 4.3,
            reviews: 57,
            stock: 30,
            organicCertified: true
        },
        12: { 
            name: "Organic Pineapple",
            category: "Fruits",
            originalPrice: 89,
            discount: 22,
            prices: {
                1: 69,   // 1.2kg
                2: 138,  // 2.4kg
                3: 207,  // 3.6kg
                4: 276   // 4.8kg
            },
            weight: {
                1: "1.2kg",
                2: "2.4kg",
                3: "3.6kg",
                4: "4.8kg"
            },
            image: "https://cdn.pixabay.com/photo/2018/11/11/15/42/pineapple-3808963_640.jpg",
            description: "Tropical pineapple, enzyme rich",
            rating: 4.6,
            reviews: 89,
            stock: 28,
            organicCertified: true
        },
        13: { 
            name: "Organic Guava",
            category: "Fruits",
            originalPrice: 109,
            discount: 18,
            prices: {
                1: 89,   // 500g
                2: 178,  // 1kg
                3: 267,  // 1.5kg
                4: 356   // 2kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg"
            },
            image: "https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3VhdmF8ZW58MHx8MHx8fDA%3D",
            description: "Vitamin C rich guava, fresh harvest",
            rating: 4.4,
            reviews: 73,
            stock: 42,
            organicCertified: true
        },
        14: { 
            name: "Organic Coconut",
            category: "Fruits",
            originalPrice: 149,
            discount: 13,
            prices: {
                1: 129,  // 1 litre
                2: 258,  // 2 litres
                3: 387,  // 3 litres
                4: 516   // 4 litres
            },
            weight: {
                1: "1 litre",
                2: "2 litres",
                3: "3 litres",
                4: "4 litres"
            },
            image: "https://media.istockphoto.com/id/1407981572/photo/coconut-tree-at-coconut-farm.jpg?s=612x612&w=0&k=20&c=Mheo-LyMZpWcIVGl2Awh-8aK-MNgGTJuH78v4ChvfG0=",
            description: "Fresh tender coconut water",
            rating: 4.8,
            reviews: 156,
            stock: 50,
            organicCertified: true
        },
        15: { 
            name: "Organic Green Grapes",
            category: "Fruits",
            originalPrice: 199,
            discount: 15,
            prices: {
                1: 169,  // 500g
                2: 338,  // 1kg
                3: 507,  // 1.5kg
                4: 676   // 2kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg"
            },
            image: "https://png.pngtree.com/thumb_back/fh260/background/20210827/pngtree-grapes-on-the-table-with-green-grapes-background-image_764501.jpg",
            description: "Seedless green grapes, sweet and tart",
            rating: 4.5,
            reviews: 94,
            stock: 38,
            organicCertified: true
        },
        16: { 
            name: "Organic Cherry",
            category: "Fruits",
            originalPrice: 249,
            discount: 20,
            prices: {
                1: 199,  // 250g
                2: 398,  // 500g
                3: 597,  // 750g
                4: 796   // 1kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "750g",
                4: "1kg"
            },
            image: "https://cdn.pixabay.com/photo/2017/07/30/13/35/cherry-2554364_1280.jpg",
            description: "Imported cherries, antioxidant rich",
            rating: 4.9,
            reviews: 187,
            stock: 20,
            organicCertified: true,
            imported: true
        },

        // Vegetables (17-36)
        17: { 
            name: "Organic Potatoes",
            category: "Vegetables",
            originalPrice: 49,
            discount: 20,
            prices: {
                1: 39,   // 500g
                2: 78,   // 1kg
                3: 156,  // 2kg
                4: 234,  // 3kg
                5: 390   // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "3kg",
                5: "5kg"
            },
            image: "https://thumbs.dreamstime.com/b/potatoes-fresh-wooden-basket-33186647.jpg",
            description: "Fresh organic potatoes, farm to table",
            rating: 4.4,
            reviews: 234,
            stock: 150,
            organicCertified: true
        },
        18: { 
            name: "Organic Onions",
            category: "Vegetables",
            originalPrice: 45,
            discount: 22,
            prices: {
                1: 35,   // 500g
                2: 70,   // 1kg
                3: 140,  // 2kg
                4: 210,  // 3kg
                5: 350   // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "3kg",
                5: "5kg"
            },
            image: "https://zamaorganics.com/cdn/shop/files/madras_onion_1000_x_1000_px_1_1.png?v=1752752494",
            description: "Pungent organic onions, natural farming",
            rating: 4.3,
            reviews: 189,
            stock: 120,
            organicCertified: true
        },
        19: { 
            name: "Organic Carrots",
            category: "Vegetables",
            originalPrice: 79,
            discount: 25,
            prices: {
                1: 59,   // 250g
                2: 118,  // 500g
                3: 236,  // 1kg
                4: 472   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/185275579/photo/bundles-of-organic-carrots-with-the-stems-still-attached.jpg?s=612x612&w=0&k=20&c=OIdIDUtDF9jxpCFnZlb7ld5tOj8pDMol1XIcfsHFlEk=",
            description: "Sweet organic carrots, beta-carotene rich",
            rating: 4.6,
            reviews: 167,
            stock: 85,
            organicCertified: true
        },
        20: { 
            name: "Organic Tomatoes",
            category: "Vegetables",
            originalPrice: 69,
            discount: 29,
            prices: {
                1: 49,   // 500g
                2: 98,   // 1kg
                3: 196,  // 2kg
                4: 294   // 3kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "3kg"
            },
            image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg",
            description: "Juicy organic tomatoes, vine ripened",
            rating: 4.5,
            reviews: 278,
            stock: 95,
            organicCertified: true
        },
        21: { 
            name: "Organic Lady Finger",
            category: "Vegetables",
            originalPrice: 49,
            discount: 20,
            prices: {
                1: 39,   // 250g
                2: 78,   // 500g
                3: 156,  // 1kg
                4: 312   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://t4.ftcdn.net/jpg/16/99/86/99/360_F_1699869971_B5XRbdUSJMM2Yrbk4WI6LzaQ2nNQ4ASr.jpg",
            description: "Tender okra, fiber rich",
            rating: 4.2,
            reviews: 89,
            stock: 65,
            organicCertified: true
        },
        22: { 
            name: "Organic Brinjal",
            category: "Vegetables",
            originalPrice: 39,
            discount: 26,
            prices: {
                1: 29,   // 250g
                2: 58,   // 500g
                3: 116,  // 1kg
                4: 232   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://www.jiomart.com/images/product/original/590000166/brinjal-round-green-250-g-product-images-o590000166-p590000166-0-202412031731.jpg?im=Resize=(1000,1000)",
            description: "Purple brinjal, antioxidant properties",
            rating: 4.3,
            reviews: 76,
            stock: 55,
            organicCertified: true
        },
        23: { 
            name: "Organic Coriander",
            category: "Vegetables",
            originalPrice: 29,
            discount: 34,
            prices: {
                1: 19,   // 100g
                2: 38,   // 200g
                3: 95,   // 500g
                4: 190   // 1kg
            },
            weight: {
                1: "100g",
                2: "200g",
                3: "500g",
                4: "1kg"
            },
            image: "https://media.istockphoto.com/id/1133790325/photo/fresh-coriander-cilantro-leaves-on-basket.jpg?s=612x612&w=0&k=20&c=9wiu9r3LdvFeGfv9GApYCGmt_mRpnzHQFJmSXFgjbgo=",
            description: "Fresh coriander leaves, aromatic",
            rating: 4.7,
            reviews: 145,
            stock: 100,
            organicCertified: true
        },
        24: { 
            name: "Organic Garlic",
            category: "Vegetables",
            originalPrice: 35,
            discount: 29,
            prices: {
                1: 25,   // 100g
                2: 62,   // 250g
                3: 124,  // 500g
                4: 248   // 1kg
            },
            weight: {
                1: "100g",
                2: "250g",
                3: "500g",
                4: "1kg"
            },
            image: "https://connect.healthkart.com/wp-content/uploads/2016/12/Banner-2021-05-05T174631.491.jpg",
            description: "Pungent garlic, natural antibiotic",
            rating: 4.6,
            reviews: 132,
            stock: 75,
            organicCertified: true
        },
        25: { 
            name: "Organic Bottle Gourd",
            category: "Vegetables",
            originalPrice: 49,
            discount: 20,
            prices: {
                1: 39,   // 1 pc (500g)
                2: 78,   // 2 pcs (1kg)
                3: 117,  // 3 pcs (1.5kg)
                4: 156   // 4 pcs (2kg)
            },
            weight: {
                1: "1 pc (approx. 500g)",
                2: "2 pcs (approx. 1kg)",
                3: "3 pcs (approx. 1.5kg)",
                4: "4 pcs (approx. 2kg)"
            },
            image: "https://media.istockphoto.com/id/1194258667/photo/bottle-gourd-for-sale-in-market.jpg?s=612x612&w=0&k=20&c=sNSrJ3u5V4Q83pctJnz4qBNw751nxw5tE2d57RNv_Hs=",
            description: "Fresh bottle gourd, cooling vegetable",
            rating: 4.1,
            reviews: 67,
            stock: 45,
            organicCertified: true
        },
        26: { 
            name: "Organic Bitter Gourd",
            category: "Vegetables",
            originalPrice: 59,
            discount: 17,
            prices: {
                1: 49,   // 250g
                2: 98,   // 500g
                3: 196,  // 1kg
                4: 392   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/472402096/photo/top-view-of-green-bitter-gourds-in-the-basket.jpg?s=612x612&w=0&k=20&c=n7Ua0o7X4Qe_FSfl38ufHIPslxofgkyNpa2Z2NXmBfM=",
            description: "Bitter gourd, blood sugar regulation",
            rating: 4.0,
            reviews: 54,
            stock: 40,
            organicCertified: true
        },
        27: { 
            name: "Organic Pumpkin",
            category: "Vegetables",
            originalPrice: 69,
            discount: 14,
            prices: {
                1: 59,   // 500g
                2: 118,  // 1kg
                3: 236,  // 2kg
                4: 354   // 3kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "3kg"
            },
            image: "https://images.unsplash.com/photo-1506917728037-b6af01a7d403?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHVtcGtpbnxlbnwwfHwwfHx8MA%3D%3D",
            description: "Sweet pumpkin, Vitamin A rich",
            rating: 4.3,
            reviews: 78,
            stock: 50,
            organicCertified: true
        },
        28: { 
            name: "Organic Ridge Gourd",
            category: "Vegetables",
            originalPrice: 55,
            discount: 18,
            prices: {
                1: 45,   // 250g
                2: 90,   // 500g
                3: 180,  // 1kg
                4: 360   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/606014430/photo/fresh-angled-loofah-angled-gourd-fruit.jpg?s=612x612&w=0&k=20&c=tdw10kSKaCiV2HXn5m39P-oVFwi-MZxDRfnzLynK0kw=",
            description: "Ridge gourd, cooling properties",
            rating: 4.2,
            reviews: 63,
            stock: 42,
            organicCertified: true
        },
        29: { 
            name: "Organic Green Beans",
            category: "Vegetables",
            originalPrice: 79,
            discount: 13,
            prices: {
                1: 69,   // 250g
                2: 138,  // 500g
                3: 276,  // 1kg
                4: 552   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/1412931086/photo/fresh-green-bean-pods-texture-close-up-top-view.jpg?s=612x612&w=0&k=20&c=59qXWquEIFyaUc4AxvPcBzIIwtG823L8cuej7lDwHZE=",
            description: "French beans, fiber rich",
            rating: 4.4,
            reviews: 81,
            stock: 58,
            organicCertified: true
        },
        30: { 
            name: "Organic Green Peas",
            category: "Vegetables",
            originalPrice: 69,
            discount: 14,
            prices: {
                1: 59,   // 250g
                2: 118,  // 500g
                3: 236,  // 1kg
                4: 472   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/999021878/photo/fresh-organic-green-peas-on-rustic-wooden-background.jpg?s=612x612&w=0&k=20&c=5QwpuJVvzXe4B-_WBXQAO_Vi-ViCRWlDapLMVXqugrg=",
            description: "Sweet green peas, protein source",
            rating: 4.5,
            reviews: 96,
            stock: 65,
            organicCertified: true
        },
        31: { 
            name: "Organic Cluster Beans",
            category: "Vegetables",
            originalPrice: 59,
            discount: 17,
            prices: {
                1: 49,   // 250g
                2: 98,   // 500g
                3: 196,  // 1kg
                4: 392   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://dayli.in/cdn/shop/files/cluster-beans-250-g-product-images-o590000155-p590000155-0-202409171905.webp?v=1755888927",
            description: "Cluster beans, diabetic friendly",
            rating: 4.1,
            reviews: 49,
            stock: 38,
            organicCertified: true
        },
        32: { 
            name: "Organic Broad Beans",
            category: "Vegetables",
            originalPrice: 69,
            discount: 14,
            prices: {
                1: 59,   // 250g
                2: 118,  // 500g
                3: 236,  // 1kg
                4: 472   // 2kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://4.imimg.com/data4/WW/WW/GLADMIN-/media-catalog-product-cache-1-small_image-295x295-9df78eab33525d08d6e5fb8d27136e95-b-r-broad-beans.jpg",
            description: "Broad beans, iron rich",
            rating: 4.2,
            reviews: 57,
            stock: 44,
            organicCertified: true
        },
        33: { 
            name: "Organic Green Mangoes",
            category: "Vegetables",
            originalPrice: 59,
            discount: 17,
            prices: {
                1: 49,   // 500g
                2: 98,   // 1kg
                3: 196,  // 2kg
                4: 294   // 3kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "3kg"
            },
            image: "https://www.shutterstock.com/image-photo/green-mango-leaf-on-basket-260nw-653583370.jpg",
            description: "Raw mangoes, perfect for pickles",
            rating: 4.3,
            reviews: 72,
            stock: 52,
            organicCertified: true,
            seasonal: true
        },
        34: { 
            name: "Organic Curry Leaves",
            category: "Vegetables",
            originalPrice: 69,
            discount: 14,
            prices: {
                1: 59,   // 100g
                2: 147,  // 250g
                3: 294,  // 500g
                4: 588   // 1kg
            },
            weight: {
                1: "100g",
                2: "250g",
                3: "500g",
                4: "1kg"
            },
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlyhVQTGNyA75ATVKcyRz8SMk980lbJ3zOFw&s",
            description: "Aromatic curry leaves, digestive aid",
            rating: 4.7,
            reviews: 118,
            stock: 90,
            organicCertified: true
        },
        35: { 
            name: "Organic Cauliflower",
            category: "Vegetables",
            originalPrice: 49,
            discount: 20,
            prices: {
                1: 39,   // 500g
                2: 78,   // 1kg
                3: 117,  // 1.5kg
                4: 156   // 2kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg"
            },
            image: "https://watermark.lovepik.com/photo/20211130/large/lovepik-organic-cauliflower-picture_501211111.jpg",
            description: "Fresh cauliflower, Vitamin C rich",
            rating: 4.4,
            reviews: 103,
            stock: 70,
            organicCertified: true
        },
        36: { 
            name: "Organic Cabbage",
            category: "Vegetables",
            originalPrice: 45,
            discount: 22,
            prices: {
                1: 35,   // 500g
                2: 70,   // 1kg
                3: 105,  // 1.5kg
                4: 140   // 2kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "1.5kg",
                4: "2kg"
            },
            image: "https://media.istockphoto.com/id/503870662/photo/fresh-ripe-cabbage.jpg?s=612x612&w=0&k=20&c=ny2sApn89JO6K8jpByXU9EUi9nOXnRkiuSOODvntULM=",
            description: "Green cabbage, detoxifying properties",
            rating: 4.3,
            reviews: 89,
            stock: 62,
            organicCertified: true
        },

        // Dairy & Eggs (37-40)
        37: { 
            name: "Organic Cow Milk",
            category: "Dairy",
            originalPrice: 90,
            discount: 17,
            prices: {
                1: 75,   // 500ml
                2: 150,  // 1L
                3: 300,  // 2L
                4: 450,  // 3L
                5: 750   // 5L
            },
            weight: {
                1: "500ml",
                2: "1L",
                3: "2L",
                4: "3L",
                5: "5L"
            },
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Fresh organic cow milk, hormone free",
            rating: 4.8,
            reviews: 342,
            stock: 200,
            organicCertified: true,
            refrigeration: true
        },
        38: { 
            name: "Desi Cow Ghee",
            category: "Dairy",
            originalPrice: 699,
            discount: 14,
            prices: {
                1: 599,  // 200ml
                2: 1497, // 500ml
                3: 2994, // 1L
                4: 5988  // 2L
            },
            weight: {
                1: "200ml",
                2: "500ml",
                3: "1L",
                4: "2L"
            },
            image: "https://t3.ftcdn.net/jpg/07/25/62/64/360_F_725626447_vJOVfhq0warxn3Kl18XYRkYMh1Z0Ouqp.jpg",
            description: "A2 bilona ghee, traditional method",
            rating: 4.9,
            reviews: 287,
            stock: 80,
            organicCertified: true
        },
        39: { 
            name: "Organic Paneer",
            category: "Dairy",
            originalPrice: 150,
            discount: 20,
            prices: {
                1: 120,  // 200g
                2: 300,  // 500g
                3: 600,  // 1kg
                4: 1200  // 2kg
            },
            weight: {
                1: "200g",
                2: "500g",
                3: "1kg",
                4: "2kg"
            },
            image: "https://t3.ftcdn.net/jpg/06/35/16/94/360_F_635169408_OcThRpearTKfkXwiuhpjOeD0MdvqyHzV.jpg",
            description: "Fresh homemade paneer, protein rich",
            rating: 4.7,
            reviews: 198,
            stock: 60,
            organicCertified: true,
            refrigeration: true
        },
        40: { 
            name: "Organic Eggs",
            category: "Dairy",
            originalPrice: 120,
            discount: 18,
            prices: {
                1: 99,   // 6 eggs
                2: 198,  // 12 eggs
                3: 396,  // 24 eggs
                4: 495   // 30 eggs
            },
            weight: {
                1: "6 eggs",
                2: "12 eggs",
                3: "24 eggs",
                4: "30 eggs"
            },
            image: "https://i.pinimg.com/736x/f9/b1/4d/f9b14dcc79ed2d5efc42a83f756023e8.jpg",
            description: "Free range organic eggs, omega-3 rich",
            rating: 4.8,
            reviews: 256,
            stock: 150,
            organicCertified: true,
            refrigeration: true
        },

        // Grains & Pulses (41-44)
        41: { 
            name: "Organic Brown Rice",
            category: "Grains",
            originalPrice: 150,
            discount: 20,
            prices: {
                1: 120,  // 2kg
                2: 600,  // 10kg
                3: 900,  // 15kg
                4: 1200, // 20kg
                5: 1800  // 30kg
            },
            weight: {
                1: "2kg",
                2: "10kg",
                3: "15kg",
                4: "20kg",
                5: "30kg"
            },
            image: "https://media.gettyimages.com/id/155392869/photo/brown-rice.jpg?s=612x612&w=gi&k=20&c=vtmQKmx8AOHhiHvzXYSxF2bb2Qvu_0Z0YKwevI5Harw=",
            description: "Whole grain brown rice, fiber rich",
            rating: 4.6,
            reviews: 167,
            stock: 100,
            organicCertified: true
        },
        42: { 
            name: "Organic Whole Wheat",
            category: "Grains",
            originalPrice: 110,
            discount: 23,
            prices: {
                1: 85,   // 2kg
                2: 425,  // 10kg
                3: 637,  // 15kg
                4: 850,  // 20kg
                5: 1275  // 30kg
            },
            weight: {
                1: "2kg",
                2: "10kg",
                3: "15kg",
                4: "20kg",
                5: "30kg"
            },
            image: "https://nutrisum.in/cdn/shop/articles/The_Digestive_and_Energizing_Power_of_Whole_Wheat__Unveiling_its_Benefits.png?v=1706006243&width=1100",
            description: "Stone ground whole wheat flour",
            rating: 4.5,
            reviews: 143,
            stock: 90,
            organicCertified: true
        },
        43: { 
            name: "Organic Moong Dal",
            category: "Pulses",
            originalPrice: 120,
            discount: 21,
            prices: {
                1: 95,   // 500g
                2: 190,  // 1kg
                3: 380,  // 2kg
                4: 950   // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "5kg"
            },
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNu3alj7KOV1_Reu_mhUk35Q0rEMiJjvHtQ&s",
            description: "Split green gram, easy to digest",
            rating: 4.7,
            reviews: 178,
            stock: 75,
            organicCertified: true
        },
        44: { 
            name: "Organic Toor Dal",
            category: "Pulses",
            originalPrice: 135,
            discount: 19,
            prices: {
                1: 110,  // 500g
                2: 220,  // 1kg
                3: 440,  // 2kg
                4: 1100  // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "2kg",
                4: "5kg"
            },
            image: "https://cdn.shopaccino.com/edible-smart/products/toor-dal-min-scaled-740285_l.jpg?v=621",
            description: "Pigeon pea, protein source",
            rating: 4.6,
            reviews: 154,
            stock: 68,
            organicCertified: true
        },

        // Spices & Masalas (45-48)
        45: { 
            name: "Organic Turmeric Powder",
            category: "Spices",
            originalPrice: 199,
            discount: 25,
            prices: {
                1: 149,  // 500g
                2: 298,  // 1kg
                3: 894,  // 3kg
                4: 1490  // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "3kg",
                4: "5kg"
            },
            image: "https://t3.ftcdn.net/jpg/02/12/84/78/360_F_212847847_o4fXT2BF7CTwqVly0mvGL4UEgGGgpibU.jpg",
            description: "Pure turmeric powder, anti-inflammatory",
            rating: 4.8,
            reviews: 234,
            stock: 120,
            organicCertified: true
        },
        46: { 
            name: "Organic Red Chilli Powder",
            category: "Spices",
            originalPrice: 159,
            discount: 19,
            prices: {
                1: 129,  // 500g
                2: 258,  // 1kg
                3: 774,  // 3kg
                4: 1290  // 5kg
            },
            weight: {
                1: "500g",
                2: "1kg",
                3: "3kg",
                4: "5kg"
            },
            image: "https://t3.ftcdn.net/jpg/06/80/54/68/360_F_680546849_7mdFrXHwq5j3kguMUzdSUgpnRLcfcTQd.jpg",
            description: "Spicy red chilli powder",
            rating: 4.5,
            reviews: 189,
            stock: 95,
            organicCertified: true
        },
        47: { 
            name: "Organic Garam Masala",
            category: "Spices",
            originalPrice: 219,
            discount: 18,
            prices: {
                1: 179,  // 250g
                2: 358,  // 500g
                3: 537,  // 750g
                4: 716   // 1kg
            },
            weight: {
                1: "250g",
                2: "500g",
                3: "750g",
                4: "1kg"
            },
            image: "https://media.istockphoto.com/id/1303873308/photo/garam-masala.jpg?s=612x612&w=0&k=20&c=WYJUE-NcP-hrWChWtdqYPXMBcbhzPVI0bsHlyEJ928E=",
            description: "Aromatic spice blend, homemade recipe",
            rating: 4.7,
            reviews: 167,
            stock: 85,
            organicCertified: true
        },
        48: { 
            name: "Organic Cumin Seeds",
            category: "Spices",
            originalPrice: 129,
            discount: 23,
            prices: {
                1: 99,   // 100g
                2: 247,  // 250g
                3: 494,  // 500g
                4: 741   // 750g
            },
            weight: {
                1: "100g",
                2: "250g",
                3: "500g",
                4: "750g"
            },
            image: "https://www.adidevgroup.com/img/products/ipm-cumin-seed.jpg",
            description: "Jeera seeds, digestive aid",
            rating: 4.6,
            reviews: 142,
            stock: 78,
            organicCertified: true
        }
    };

    // Store the current OTP for verification
    let currentOtp = '';

    // Sample saved addresses for demo
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

    // Coupon codes database
    const couponDatabase = {
        'WELCOME10': { 
            discount: 10, 
            type: 'percentage', 
            minAmount: 500,
            maxDiscount: 200,
            description: 'Welcome discount for new customers'
        },
        'SAVE20': { 
            discount: 20, 
            type: 'percentage', 
            minAmount: 1000,
            maxDiscount: 500,
            description: 'Special savings coupon'
        },
        'FLAT50': { 
            discount: 50, 
            type: 'fixed', 
            minAmount: 300,
            maxDiscount: 50,
            description: 'Flat ₹50 off on your order'
        },
        'FREESHIP': { 
            discount: 0, 
            type: 'shipping', 
            minAmount: 0,
            maxDiscount: 50,
            description: 'Free shipping on your order'
        },
        'ORGANIC25': { 
            discount: 25, 
            type: 'percentage', 
            minAmount: 1500,
            maxDiscount: 1000,
            description: '25% off on organic products'
        }
    };

    // Active coupon (if any)
    let activeCoupon = null;

    // QR Code Timer and Payment System Variables
    let qrTimer;
    let timeLeft = 300; // 5 minutes in seconds
    let isQRGenerated = false;
    let qrExpired = false;
    let upiPaymentInProgress = false;

    // Track delivery details with numbered steps
    const deliveryTracking = {
        getDeliveryDate: function() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short' 
            });
        },
        
        getTrackingNumber: function() {
            return 'TRK' + Date.now().toString().slice(-10);
        },
        
        getDeliveryWindow: function() {
            const windows = [
                '9:00 AM - 12:00 PM',
                '12:00 PM - 3:00 PM',
                '3:00 PM - 6:00 PM',
                '6:00 PM - 9:00 PM'
            ];
            return windows[Math.floor(Math.random() * windows.length)];
        },
        
        getDeliveryAgent: function() {
            const agents = ['Rajesh Kumar', 'Amit Sharma', 'Priya Patel', 'Suresh Nair', 'Meena Singh'];
            return agents[Math.floor(Math.random() * agents.length)];
        },
        
        getDeliveryContact: function() {
            return '+91 9' + Math.floor(Math.random() * 900000000 + 100000000);
        },
        
        generateStatus: function() {
            const statuses = [
                { 
                    number: 1,
                    status: 'Delivery', 
                    description: 'Your order has been dispatched and is on its way', 
                    time: '10:30 AM',
                    subStatus: 'Package picked up from warehouse',
                    icon: 'fa-truck'
                },
                { 
                    number: 2,
                    status: 'Payment', 
                    description: 'Payment has been successfully processed', 
                    time: '10:15 AM',
                    subStatus: 'UPI transaction completed',
                    icon: 'fa-credit-card'
                },
                { 
                    number: 3,
                    status: 'Confirmation', 
                    description: 'Order confirmed and ready for delivery', 
                    time: '10:00 AM',
                    subStatus: 'Order verification complete',
                    icon: 'fa-check-circle'
                }
            ];
            return statuses;
        },
        
        getCurrentStep: function(orderStatus) {
            const statusMap = {
                'confirmed': 3, // Confirmation
                'processing': 2, // Payment
                'packed': 1, // Delivery (preparing)
                'dispatched': 1, // Delivery (on the way)
                'out_for_delivery': 1, // Delivery (almost there)
                'delivered': 1 // Delivery (completed)
            };
            return statusMap[orderStatus] || 3;
        }
    };

    // ===== REVIEWS SECTION DATA =====
    let userReviews = [
        {
            id: 1,
            productId: 'organic-apples',
            productName: 'Organic Apples',
            productImage: 'https://via.placeholder.com/60x60/e8f5e9/2e7d32?text=🍎',
            rating: 5,
            title: 'Excellent quality! Fresh and delicious',
            content: 'These apples were fresh, crispy, and perfectly sweet. The organic quality really shows in the taste. Will definitely order again!',
            recommend: true,
            purchaseDate: '15 Dec 2023',
            reviewDate: '2 weeks ago'
        },
        {
            id: 2,
            productId: 'organic-honey',
            productName: 'Organic Honey',
            productImage: 'https://via.placeholder.com/60x60/fff3e0/f57c00?text=🍯',
            rating: 4.5,
            title: 'Pure and natural taste',
            content: 'Good quality honey with natural sweetness. Could be a bit thicker, but overall satisfied with the purchase.',
            recommend: true,
            purchaseDate: '10 Dec 2023',
            reviewDate: '3 weeks ago'
        },
        {
            id: 3,
            productId: 'fresh-broccoli',
            productName: 'Fresh Broccoli',
            productImage: 'https://via.placeholder.com/60x60/e8f5e9/2e7d32?text=🥦',
            rating: 4,
            title: 'Fresh but small quantity',
            content: 'The broccoli was fresh and green, good quality. However, the 1kg pack seemed a bit less in quantity compared to what I usually get. Taste was good though.',
            recommend: false,
            purchaseDate: '5 Dec 2023',
            reviewDate: '1 month ago'
        }
    ];
    
    let currentEditReviewId = null;

    // Initialize the application
    function init() {
        console.log('Initializing Organic Mart...');
        
        // First, ensure only one page is active
        initializePages();
        
        // Prevent scrolling on login page only
        preventLoginPageScroll();
        
        // Load data and setup
        loadUserData();
        setupEventListeners();
        checkLoginStatus();
        addToastStyles();
        addNotificationStyles();
        
        // Add CSS fixes
        addScrollFixStyles();
        
        console.log('Initialization complete');
    }

    // ====== TAB MANAGEMENT ======
    function initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            // Remove any existing event listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // Re-select after cloning
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        // FIX: Set default tab to username
        switchTab('username');
    }

    function switchTab(tabName) {
        // Update currentTab variable
        currentTab = tabName;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
        
        // Clear previous errors
        clearErrors();
    }

    // ====== PASSWORD VISIBILITY TOGGLE ======
    function initializePasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    // ====== OTP INPUT HANDLING ======
    function initializeOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        
        otpInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const value = this.value;
                const index = parseInt(this.getAttribute('data-index'));
                
                // Only allow numbers
                if (value && !/^\d$/.test(value)) {
                    this.value = '';
                    return;
                }
                
                // Move to next input if current is filled
                if (value.length === 1 && index < 6) {
                    const nextInput = document.getElementById(`otp${index + 1}`);
                    if (nextInput) nextInput.focus();
                }
                
                // Enable verify button if all inputs are filled
                checkOTPCompletion();
            });
            
            input.addEventListener('keydown', function(e) {
                const index = parseInt(this.getAttribute('data-index'));
                
                // Move to previous input on backspace if current is empty
                if (e.key === 'Backspace' && !this.value && index > 1) {
                    const prevInput = document.getElementById(`otp${index - 1}`);
                    if (prevInput) prevInput.focus();
                }
            });
            
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').trim();
                
                if (/^\d{6}$/.test(pastedData)) {
                    const digits = pastedData.split('');
                    otpInputs.forEach((input, idx) => {
                        if (digits[idx]) {
                            input.value = digits[idx];
                        }
                    });
                    checkOTPCompletion();
                }
            });
        });
    }

    function checkOTPCompletion() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
        const verifyBtn = document.querySelector('.verify-otp-btn');
        
        if (verifyBtn) {
            verifyBtn.disabled = !allFilled;
        }
    }

    // ====== EVENT LISTENERS ======
    function attachEventListeners() {
        // Page Navigation
        if (showSignupLink) {
            showSignupLink.addEventListener('click', showSignupPage);
        }
        
        if (showLoginLink) {
            showLoginLink.addEventListener('click', showLoginPage);
        }
        
        // Form Submissions
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
        
        // Forgot Password
        if (forgotPasswordLinks.length > 0) {
            forgotPasswordLinks.forEach(link => {
                link.addEventListener('click', showResetPassword);
            });
        }
        
        // Back to Login
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', showLoginForm);
        }
        
        // Reset Password Steps - Fixed: Use proper event listeners
        const resetFormStep1 = document.getElementById('reset-form-step1');
        const resetFormStep2 = document.getElementById('reset-form-step2');
        const resetFormStep3 = document.getElementById('reset-form-step3');
        
        if (resetFormStep1) {
            resetFormStep1.addEventListener('submit', function(e) {
                e.preventDefault();
                handleResetStep1(e);
            });
        }
        
        if (resetFormStep2) {
            resetFormStep2.addEventListener('submit', function(e) {
                e.preventDefault();
                handleResetStep2(e);
            });
        }
        
        if (resetFormStep3) {
            resetFormStep3.addEventListener('submit', function(e) {
                e.preventDefault();
                handleResetStep3(e);
            });
        }
        
        // Reset Navigation
        const backToStep1Btn = document.getElementById('back-to-step1');
        if (backToStep1Btn) {
            backToStep1Btn.addEventListener('click', function() {
                showResetStep(1);
            });
        }
        
        const backToStep2Btn = document.getElementById('back-to-step2');
        if (backToStep2Btn) {
            backToStep2Btn.addEventListener('click', function() {
                showResetStep(2);
            });
        }
        
        // Resend OTP
        const resendOtpBtn = document.getElementById('resend-otp');
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resendOTP();
            });
        }
        
        // Social Login
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', handleSocialLogin);
        });
        
        // Modal Close
        const closeModalBtn = document.querySelector('.close-reset-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                if (resetSuccessModal) {
                    resetSuccessModal.classList.remove('active');
                }
                showLoginForm();
            });
        }
    }

    // ====== PAGE NAVIGATION ======
    function showSignupPage(e) {
        e.preventDefault();
        if (loginPage) loginPage.classList.remove('active');
        if (signupPage) signupPage.classList.add('active');
        clearForm(signupForm);
        clearErrors();
    }

    function showLoginPage(e) {
        e.preventDefault();
        if (signupPage) signupPage.classList.remove('active');
        if (loginPage) loginPage.classList.add('active');
        clearForm(loginForm);
        clearErrors();
        showLoginForm();
    }

    function showLoginForm() {
        if (resetPasswordSection) resetPasswordSection.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        clearResetForm();
        resetStep = 1;
        stopOTPTimer();
        
        // FIX: Reset to username tab when showing login form
        switchTab('username');
    }

    function showResetPassword(e) {
        e.preventDefault();
        if (loginForm) loginForm.style.display = 'none';
        if (resetPasswordSection) resetPasswordSection.style.display = 'block';
        showResetStep(1);
        clearErrors();
    }

    // ====== RESET PASSWORD FLOW ======
    function showResetStep(step) {
        resetStep = step;
        
        // Hide all steps
        document.getElementById('reset-step-1').style.display = 'none';
        document.getElementById('reset-step-2').style.display = 'none';
        document.getElementById('reset-step-3').style.display = 'none';
        
        // Show current step
        document.getElementById(`reset-step-${step}`).style.display = 'block';
        
        if (step === 2) {
            startOTPTimer();
            focusOTPInput();
        }
    }

    function handleResetStep1(e) {
        const input = document.getElementById('reset-input').value.trim();
        const errorElement = document.getElementById('reset-error');
        
        if (!input) {
            showError(errorElement, 'Please enter email or phone number');
            return;
        }
        
        // Validate email or phone
        const isEmail = validateEmail(input);
        const isPhone = validatePhone(input);
        
        if (!isEmail && !isPhone) {
            showError(errorElement, 'Please enter a valid email or phone number');
            return;
        }
        
        // Store identifier for later use
        resetIdentifier = input;
        
        // Show loading
        const submitBtn = e.target.querySelector('.send-otp-btn');
        showLoading(submitBtn, true);
        
        // Generate 6-digit OTP
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${input}: ${generatedOTP}`); // For testing
        
        // Show OTP in a test message for demo purposes
        const testOTPMessage = document.getElementById('test-otp-message');
        if (testOTPMessage) {
            testOTPMessage.innerHTML = `<strong>Test OTP (for demo): ${generatedOTP}</strong>`;
            testOTPMessage.style.display = 'block';
        }
        
        // Simulate API call
        setTimeout(() => {
            showLoading(submitBtn, false);
            
            // Show success message
            const otpMessage = document.getElementById('otp-message');
            const maskedInput = isEmail ? 
                maskEmail(input) : 
                maskPhone(input);
            otpMessage.textContent = `Enter the 6-digit OTP sent to ${maskedInput}`;
            
            // Move to next step
            showResetStep(2);
        }, 1500);
    }

    function handleResetStep2(e) {
        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
        const errorElement = document.getElementById('otp-error');
        
        if (enteredOTP.length !== 6) {
            showError(errorElement, 'Please enter the complete 6-digit OTP');
            return;
        }
        
        // Show loading
        const submitBtn = e.target.querySelector('.verify-otp-btn');
        showLoading(submitBtn, true);
        
        // Simulate OTP verification
        setTimeout(() => {
            showLoading(submitBtn, false);
            
            console.log('Entered OTP:', enteredOTP);
            console.log('Generated OTP:', generatedOTP);
            
            if (enteredOTP === generatedOTP) {
                showResetStep(3);
                stopOTPTimer();
                // Hide test OTP message
                const testOTPMessage = document.getElementById('test-otp-message');
                if (testOTPMessage) {
                    testOTPMessage.style.display = 'none';
                }
            } else {
                showError(errorElement, 'Invalid OTP. Please try again.');
                clearOTPInputs();
                focusOTPInput();
            }
        }, 1500);
    }

    function handleResetStep3(e) {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;
        const newPasswordError = document.getElementById('new-password-error');
        const confirmPasswordError = document.getElementById('confirm-new-password-error');
        
        let isValid = true;
        
        // Clear previous errors
        hideError(newPasswordError);
        hideError(confirmPasswordError);
        
        // Validate new password
        if (!newPassword) {
            showError(newPasswordError, 'Please enter new password');
            isValid = false;
        } else if (newPassword.length < 6) {
            showError(newPasswordError, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError(confirmPasswordError, 'Please confirm your password');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            showError(confirmPasswordError, 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading
        const submitBtn = e.target.querySelector('.reset-password-btn');
        showLoading(submitBtn, true);
        
        // Simulate password reset
        setTimeout(() => {
            showLoading(submitBtn, false);
            
            // Show success modal
            if (resetSuccessModal) {
                resetSuccessModal.classList.add('active');
            }
            clearResetForm();
            
            // Reset state
            generatedOTP = '';
            resetIdentifier = '';
            resetStep = 1;
        }, 1500);
    }

    // ====== OTP TIMER ======
    function startOTPTimer() {
        otpTimeLeft = 120;
        updateOTPTimer();
        
        if (otpTimer) {
            clearInterval(otpTimer);
        }
        
        otpTimer = setInterval(() => {
            otpTimeLeft--;
            updateOTPTimer();
            
            if (otpTimeLeft <= 0) {
                stopOTPTimer();
            }
        }, 1000);
    }

    function updateOTPTimer() {
        const timerElement = document.getElementById('otp-timer');
        const resendBtn = document.getElementById('resend-otp');
        
        if (!timerElement || !resendBtn) return;
        
        const minutes = Math.floor(otpTimeLeft / 60);
        const seconds = otpTimeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        resendBtn.disabled = otpTimeLeft > 0;
        
        // Update timer color when less than 30 seconds
        if (otpTimeLeft <= 30) {
            timerElement.style.color = '#f44336';
        } else if (otpTimeLeft <= 60) {
            timerElement.style.color = '#ff9800';
        } else {
            timerElement.style.color = '#4CAF50';
        }
    }

    function stopOTPTimer() {
        if (otpTimer) {
            clearInterval(otpTimer);
            otpTimer = null;
        }
    }

    function resendOTP() {
        // Don't resend if timer is still running
        if (otpTimeLeft > 0) {
            return;
        }
        
        // Show loading
        const resendBtn = document.getElementById('resend-otp');
        const originalText = resendBtn.textContent;
        resendBtn.innerHTML = '<div class="loader small"></div>';
        resendBtn.disabled = true;
        
        // Generate new OTP
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Resent OTP: ${generatedOTP}`); // For testing
        
        // Show OTP in a test message for demo purposes
        const testOTPMessage = document.getElementById('test-otp-message');
        if (testOTPMessage) {
            testOTPMessage.innerHTML = `<strong>Test OTP (for demo): ${generatedOTP}</strong>`;
            testOTPMessage.style.display = 'block';
        }
        
        // Simulate API call
        setTimeout(() => {
            resendBtn.textContent = originalText;
            startOTPTimer();
            clearOTPInputs();
            focusOTPInput();
            
            // Show notification
            showToastMessage('New OTP has been sent!');
        }, 1500);
    }

    // ====== LOGIN HANDLER - FIXED ======
    function handleLogin(e) {
        e.preventDefault();
        console.log('Login form submitted, currentTab:', currentTab);
        
        let username, password;
        
        // Get credentials based on current tab
        if (currentTab === 'username') {
            username = document.getElementById('username').value.trim();
            password = document.getElementById('username-password').value;
        } else {
            username = document.getElementById('phone').value.trim();
            password = document.getElementById('phone-password').value;
        }
        
        // Basic validation
        if (!username) {
            const errorId = currentTab === 'username' ? 'username-error' : 'phone-error';
            showError(errorId, `Please enter your ${currentTab}`);
            return;
        }
        
        if (!password) {
            const errorId = currentTab === 'username' ? 'username-password-error' : 'phone-password-error';
            showError(errorId, 'Please enter your password');
            return;
        }
        
        // Show loading
        let submitBtn;
        if (currentTab === 'username') {
            submitBtn = e.target.querySelector('.username-login-btn');
        } else {
            submitBtn = e.target.querySelector('.phone-login-btn');
        }
        
        if (submitBtn) {
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loader small"></div>';
            submitBtn.disabled = true;
            
            // Simulate login API call
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                
                // For demo purposes
                userData.isLoggedIn = true;
                userData.name = username;
                saveUserData();
                showPage('products');
                showToastMessage('Login successful!');
            }, 1500);
        }
    }

    // ====== SIGNUP HANDLER ======
    function handleSignup(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Validate full name
        if (!fullname) {
            showError('name-error', 'Please enter your full name');
            isValid = false;
        } else if (fullname.length < 2) {
            showError('name-error', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            showError('email-error', 'Please enter email address');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate username
        if (!username) {
            showError('signup-username-error', 'Please choose a username');
            isValid = false;
        } else if (username.length < 3) {
            showError('signup-username-error', 'Username must be at least 3 characters');
            isValid = false;
        }
        
        // Validate phone
        if (!phone) {
            showError('signup-phone-error', 'Please enter phone number');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('signup-phone-error', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('password-error', 'Please create a password');
            isValid = false;
        } else if (password.length < 6) {
            showError('password-error', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirm-password-error', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms
        if (!terms) {
            showError('terms-error', 'Please accept the terms and conditions');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading
        const submitBtn = e.target.querySelector('#signup-btn');
        showLoading(submitBtn, true);
        
        // Simulate signup API call
        setTimeout(() => {
            showLoading(submitBtn, false);
            
            // Create user account
            userData.isLoggedIn = true;
            userData.name = fullname;
            userData.email = email;
            userData.phone = phone;
            
            saveUserData();
            showPage('products');
            showToastMessage('Account created successfully!');
            
        }, 2000);
    }

    // ====== SOCIAL LOGIN ======
    function handleSocialLogin(e) {
        const platform = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'Facebook';
        const btn = e.currentTarget;
        
        // Show loading state
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<div class="loader small"></div>';
        btn.disabled = true;
        
        // Simulate social login
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            
            // Create user account
            userData.isLoggedIn = true;
            userData.name = `${platform} User`;
            userData.email = `user@${platform.toLowerCase()}.com`;
            userData.phone = "9876543210";
            
            saveUserData();
            showPage('products');
            showToastMessage(`Logged in with ${platform}!`);
        }, 1500);
    }

    // ====== REMEMBER ME FUNCTIONALITY ======
    function rememberUser(username, type) {
        const userData = {
            username: username,
            type: type,
            timestamp: Date.now()
        };
        localStorage.setItem('organicMartUser', JSON.stringify(userData));
    }

    function clearRememberedUser() {
        localStorage.removeItem('organicMartUser');
    }

    function checkRememberedUser() {
        const saved = localStorage.getItem('organicMartUser');
        if (saved) {
            try {
                const userData = JSON.parse(saved);
                const oneWeek = 7 * 24 * 60 * 60 * 1000;
                
                // Check if saved within last week
                if (Date.now() - userData.timestamp < oneWeek) {
                    switchTab(userData.type);
                    document.getElementById(userData.type === 'username' ? 'username' : 'phone').value = userData.username;
                    const rememberCheckbox = document.getElementById(`remember-${userData.type}`);
                    if (rememberCheckbox) rememberCheckbox.checked = true;
                } else {
                    clearRememberedUser();
                }
            } catch (e) {
                clearRememberedUser();
            }
        }
    }

    // ====== HELPER FUNCTIONS ======
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        // Simple validation - accepts 10 digits, optional + at start
        const cleaned = phone.replace(/\D/g, '');
        const re = /^[6-9]\d{9}$/;
        return re.test(cleaned) && cleaned.length === 10;
    }

    function showError(elementOrId, message) {
        const element = typeof elementOrId === 'string' ? 
            document.getElementById(elementOrId) : elementOrId;
        
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(elementOrId) {
        const element = typeof elementOrId === 'string' ? 
            document.getElementById(elementOrId) : elementOrId;
        
        if (element) {
            element.style.display = 'none';
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
    }

    function clearForm(form) {
        if (form) {
            form.reset();
        }
    }

    function clearResetForm() {
        const resetInput = document.getElementById('reset-input');
        const newPassword = document.getElementById('new-password');
        const confirmNewPassword = document.getElementById('confirm-new-password');
        
        if (resetInput) resetInput.value = '';
        if (newPassword) newPassword.value = '';
        if (confirmNewPassword) confirmNewPassword.value = '';
        
        clearOTPInputs();
        clearErrors();
        
        // Hide test OTP message
        const testOTPMessage = document.getElementById('test-otp-message');
        if (testOTPMessage) {
            testOTPMessage.style.display = 'none';
        }
    }

    function clearOTPInputs() {
        document.querySelectorAll('.otp-input').forEach(input => {
            input.value = '';
        });
        checkOTPCompletion();
    }

    function focusOTPInput() {
        const firstOtpInput = document.getElementById('otp1');
        if (firstOtpInput) {
            setTimeout(() => firstOtpInput.focus(), 100);
        }
    }

    function showLoading(button, show) {
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (show) {
            if (btnText) btnText.style.visibility = 'hidden';
            if (btnLoader) btnLoader.style.display = 'block';
            button.disabled = true;
        } else {
            if (btnText) btnText.style.visibility = 'visible';
            if (btnLoader) btnLoader.style.display = 'none';
            button.disabled = false;
        }
    }

    function maskEmail(email) {
        const [local, domain] = email.split('@');
        if (local.length <= 2) return email;
        return local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1) + '@' + domain;
    }

    function maskPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        if (digits.length <= 4) return phone;
        return '******' + digits.slice(-4);
    }

    // ====== FORM VALIDATION UTILITIES ======
    function setupRealTimeValidation() {
        // Username validation
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', function() {
                if (this.value.trim() && this.value.trim().length < 3) {
                    showError('username-error', 'Username must be at least 3 characters');
                } else {
                    hideError('username-error');
                }
            });
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim() && !validateEmail(this.value.trim())) {
                    showError('email-error', 'Please enter a valid email');
                } else {
                    hideError('email-error');
                }
            });
        }
        
        // Phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (this.value.trim() && !validatePhone(this.value.trim())) {
                    showError('phone-error', 'Please enter a valid phone number');
                } else {
                    hideError('phone-error');
                }
            });
        }
        
        // Password strength check
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 0 && this.value.length < 6) {
                    const errorId = this.id === 'password' ? 'password-error' : 
                                  this.id === 'new-password' ? 'new-password-error' :
                                  `${currentTab}-password-error`;
                    showError(errorId, 'Password must be at least 6 characters');
                } else {
                    hideError(`${currentTab}-password-error`);
                }
            });
        });
    }

    // Prevent scrolling on login page only
    function preventLoginPageScroll() {
        const loginPage = document.getElementById('login-page');
        if (loginPage) {
            loginPage.style.overflow = 'hidden';
            loginPage.style.height = '100vh';
        }
        
        // Signup page can scroll normally
        const signupPage = document.getElementById('signup-page');
        if (signupPage) {
            signupPage.style.overflow = 'auto';
            signupPage.style.height = 'auto';
        }
    }

    // Initialize all pages - ensure only one is active
    function initializePages() {
        console.log('Initializing pages...');
        
        // Remove active class from ALL pages first
        Object.keys(pages).forEach(key => {
            if (pages[key]) {
                pages[key].style.display = 'none';
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
            try {
                userData = JSON.parse(savedData);
                console.log('User data loaded:', userData);
            } catch (e) {
                console.error('Error loading user data:', e);
                userData = {
                    isLoggedIn: false,
                    name: '',
                    email: '',
                    phone: '',
                    addresses: [],
                    orders: [],
                    wishlist: [],
                    cart: []
                };
            }
        }
        
        // If no addresses exist, add sample addresses for demo
        if (userData.addresses && userData.addresses.length === 0) {
            userData.addresses = Object.values(sampleAddresses);
            saveUserData();
        }
        
        // Ensure cart exists
        if (!userData.cart) {
            userData.cart = [];
        }
        
        // Ensure orders exists
        if (!userData.orders) {
            userData.orders = [];
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        try {
            localStorage.setItem('organicMartUserData', JSON.stringify(userData));
            console.log('User data saved');
        } catch (e) {
            console.error('Error saving user data:', e);
        }
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
                pages[key].style.display = 'none';
                pages[key].classList.remove('active');
            }
        });
        
        // Show the requested page
        if (pages[pageName]) {
            pages[pageName].style.display = 'block';
            if (pageName === 'login' || pageName === 'signup') {
                pages[pageName].style.display = 'flex';
            }
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
                initializeProductQuantitySelectors();
                setupProductFilters();
                setupNavigationMenu();
                setupHeroButtons();
                setupCategoryCards();
                setupShopNowButtons();
                setupLearnMoreButtons();
                setupOurStoryButton();
                setupNewsletter();
                setupFooterLinks();
                break;
            case 'profile':
                loadProfileData();
                initializeProfileEvents();
                // Initialize reviews section when profile page loads
                initReviewsSection();
                break;
            case 'cart':
                renderCart();
                setupCartEventListeners();
                break;
            case 'checkout':
                initializeCheckout();
                // FIX: Properly initialize checkout steps
                initializeCheckoutSteps();
                break;
            case 'login':
                initializeLoginPage();
                break;
            case 'signup':
                initializeSignupPage();
                break;
        }
    }

    // ===== SETUP ALL NAVIGATION BUTTONS - FIXED =====
    function setupNavigationMenu() {
        // Main navigation menu items
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const linkText = this.textContent.trim();
                
                switch(linkText) {
                    case 'Home':
                        showPage('products');
                        break;
                    case 'Shop':
                        showPage('products');
                        // Scroll to products section with header offset
                        setTimeout(() => {
                            const productsGrid = document.querySelector('.products-grid');
                            if (productsGrid) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = productsGrid.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'Categories':
                        showPage('products');
                        // Scroll to categories section with header offset
                        setTimeout(() => {
                            const categories = document.querySelector('.categories');
                            if (categories) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = categories.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'About':
                        showPage('products');
                        // Scroll to about section with header offset
                        setTimeout(() => {
                            const about = document.querySelector('.about');
                            if (about) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = about.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'Contact':
                        showPage('products');
                        // Scroll to footer/contact section with header offset
                        setTimeout(() => {
                            const footer = document.querySelector('footer');
                            if (footer) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = footer.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                }
            });
        });
    }

    function setupHeroButtons() {
        // Hero section "Shop Now" button
        const heroShopNow = document.querySelector('.hero-buttons .btn:first-child');
        if (heroShopNow) {
            heroShopNow.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('products');
                // Scroll to products section with header offset
                setTimeout(() => {
                    const productsGrid = document.querySelector('.products-grid');
                    if (productsGrid) {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const elementPosition = productsGrid.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        }

        // Hero section "Learn More" button
        const heroLearnMore = document.querySelector('.hero-buttons .btn:nth-child(2)');
        if (heroLearnMore) {
            heroLearnMore.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('products');
                // Scroll to about section with header offset
                setTimeout(() => {
                    const about = document.querySelector('.about');
                    if (about) {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const elementPosition = about.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        }
    }

    function setupCategoryCards() {
        // Category cards in the categories section
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('products');
                
                // Get category name from overlay
                const categoryName = this.querySelector('h3').textContent.trim();
                
                // Map category names to actual category values
                const categoryMap = {
                    'Fresh Fruits': 'Fruits',
                    'Fresh Vegetables': 'Vegetables',
                    'Dairy & Eggs': 'Dairy',
                    'Grains & Pulses': 'Grains',
                    'Spices & Masalas': 'Spices'
                };
                
                const actualCategory = categoryMap[categoryName] || categoryName;
                
                // Filter products by category
                setTimeout(() => {
                    filterProductsByCategory(actualCategory);
                    
                    // Scroll to products section with header offset
                    const productsGrid = document.querySelector('.products-grid');
                    if (productsGrid) {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const elementPosition = productsGrid.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        });
    }

    function setupShopNowButtons() {
        // All "Shop Now" buttons
        const shopNowButtons = document.querySelectorAll('.btn:not(.hero-buttons .btn)');
        shopNowButtons.forEach(btn => {
            if (btn.textContent.includes('Shop Now') || btn.textContent.includes('Start Shopping')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showPage('products');
                });
            }
        });
    }

    function setupLearnMoreButtons() {
        // All "Learn More" buttons
        const learnMoreButtons = document.querySelectorAll('.btn');
        learnMoreButtons.forEach(btn => {
            if (btn.textContent.includes('Learn More')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showPage('products');
                    // Scroll to about section with header offset
                    setTimeout(() => {
                        const about = document.querySelector('.about');
                        if (about) {
                            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                            const elementPosition = about.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 100);
                });
            }
        });
    }

    function setupOurStoryButton() {
        // "Our Story" button in about section
        const ourStoryBtn = document.querySelector('.about-content .btn');
        if (ourStoryBtn && ourStoryBtn.textContent.includes('Our Story')) {
            ourStoryBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // For demo, show a modal with more story
                alert('OrganicMart was founded in 2015 with a simple mission: to connect health-conscious consumers with the finest organic produce from local farms. We believe in sustainable agriculture that benefits both people and the planet.\n\nToday, we serve over 50,000 customers across India with fresh, certified organic products delivered right to their doorstep.');
            });
        }
    }

    function setupNewsletter() {
        // Newsletter subscription form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email && validateEmail(email)) {
                    showToastMessage(`Thank you for subscribing with ${email}! You'll receive updates on new products and offers.`);
                    emailInput.value = '';
                } else {
                    showToastMessage('Please enter a valid email address.');
                }
            });
        }
    }

    function setupFooterLinks() {
        // Footer quick links
        const footerLinks = document.querySelectorAll('.footer-col ul li a');
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const linkText = this.textContent.trim();
                
                switch(linkText) {
                    case 'Home':
                        showPage('products');
                        break;
                    case 'Shop':
                        showPage('products');
                        setTimeout(() => {
                            const productsGrid = document.querySelector('.products-grid');
                            if (productsGrid) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = productsGrid.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'About Us':
                        showPage('products');
                        setTimeout(() => {
                            const about = document.querySelector('.about');
                            if (about) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = about.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'Blog':
                        showToastMessage('Blog section coming soon!');
                        break;
                    case 'Contact':
                        showPage('products');
                        setTimeout(() => {
                            const footer = document.querySelector('footer');
                            if (footer) {
                                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                                const elementPosition = footer.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }, 100);
                        break;
                    case 'My Account':
                        if (userData.isLoggedIn) {
                            showPage('profile');
                        } else {
                            showPage('login');
                        }
                        break;
                    case 'Order Tracking':
                        if (userData.orders && userData.orders.length > 0) {
                            showOrderTracking();
                        } else {
                            alert('No orders found! Please place an order first.');
                        }
                        break;
                    case 'Delivery Information':
                        alert('Delivery Information:\n\n• Free delivery on orders above ₹499\n• Standard delivery: 2-3 business days\n• Express delivery: Next day (₹99 extra)\n• We deliver Monday-Saturday, 9 AM to 9 PM');
                        break;
                    case 'Returns Policy':
                        alert('Returns Policy:\n\n• 7-day return policy for damaged or incorrect items\n• Fresh produce cannot be returned unless damaged\n• Contact customer service for returns\n• Refunds processed within 5-7 business days');
                        break;
                    case 'FAQs':
                        alert('Frequently Asked Questions:\n\nQ: Are all products organic certified?\nA: Yes, all products are certified organic by recognized authorities.\n\nQ: How do I track my order?\nA: Go to My Account > My Orders to track your delivery.\n\nQ: What are your delivery timings?\nA: We deliver from 9 AM to 9 PM, Monday to Saturday.');
                        break;
                }
            });
        });

        // Social media links in footer
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.querySelector('i').className.includes('facebook') ? 'Facebook' :
                               this.querySelector('i').className.includes('instagram') ? 'Instagram' :
                               this.querySelector('i').className.includes('twitter') ? 'Twitter' : 'YouTube';
                showToastMessage(`Opening ${platform} page in a new window. (Demo)`);
            });
        });
    }

    // Initialize product quantity selectors with event listeners
    function initializeProductQuantitySelectors() {
        const quantitySelects = document.querySelectorAll('.quantity-select');
        console.log(`Found ${quantitySelects.length} quantity selects to initialize`);
        
        quantitySelects.forEach(select => {
            // Ensure the select has a data-product-id attribute
            const productId = parseInt(select.getAttribute('data-product-id'));
            if (!productId) {
                console.error('Missing data-product-id on quantity select');
                return;
            }
            
            // Check if product exists in database
            if (!productDatabase[productId]) {
                console.error(`Product ID ${productId} not found in database`);
                return;
            }
            
            // Initialize price on page load
            updateProductPrice(select);
            
            // Add change event listener
            select.addEventListener('change', function() {
                updateProductPrice(this);
            });
        });
    }

    // Setup product filters
    function setupProductFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        const sortSelect = document.getElementById('sort-products');
        
        if (categoryFilters.length > 0) {
            categoryFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    filterProductsByCategory(category);
                });
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortProducts(this.value);
            });
        }
        
        // Add search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchProducts(this.value);
            });
        }
    }

    // Filter products by category
    function filterProductsByCategory(category) {
        console.log(`Filtering products by category: ${category}`);
        
        const productCards = document.querySelectorAll('.product-card');
        const categoryFilters = document.querySelectorAll('.category-filter');
        
        // Update active filter
        categoryFilters.forEach(filter => {
            filter.classList.remove('active');
            if (filter.getAttribute('data-category') === category) {
                filter.classList.add('active');
            }
        });
        
        // Show/hide products
        productCards.forEach(card => {
            const productId = parseInt(card.getAttribute('data-product-id'));
            const product = productDatabase[productId];
            
            if (category === 'all' || product.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show category message
        const categoryTitle = document.querySelector('.category-title');
        if (categoryTitle) {
            if (category === 'all') {
                categoryTitle.textContent = 'All Products';
            } else {
                categoryTitle.textContent = `${category} Products`;
            }
        }
        
        // Update product count
        const productCount = document.querySelector('.product-count');
        if (productCount) {
            const visibleCount = document.querySelectorAll('.product-card[style="display: block"]').length;
            productCount.textContent = `${visibleCount} products`;
        }
        
        showToastMessage(`Showing ${category === 'all' ? 'all' : category} products`);
    }

    // Sort products
    function sortProducts(sortBy) {
        const productsContainer = document.querySelector('.products-grid');
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        
        switch(sortBy) {
            case 'price-low-high':
                productCards.sort((a, b) => {
                    const priceA = parseInt(a.querySelector('.current-price').textContent.replace('₹', ''));
                    const priceB = parseInt(b.querySelector('.current-price').textContent.replace('₹', ''));
                    return priceA - priceB;
                });
                break;
            case 'price-high-low':
                productCards.sort((a, b) => {
                    const priceA = parseInt(a.querySelector('.current-price').textContent.replace('₹', ''));
                    const priceB = parseInt(b.querySelector('.current-price').textContent.replace('₹', ''));
                    return priceB - priceA;
                });
                break;
            case 'name-a-z':
                productCards.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent.toLowerCase();
                    const nameB = b.querySelector('h3').textContent.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'name-z-a':
                productCards.sort((a, b) => {
                    const nameA = a.querySelector('h3').textContent.toLowerCase();
                    const nameB = b.querySelector('h3').textContent.toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;
            case 'discount':
                productCards.sort((a, b) => {
                    const discountA = parseInt(a.querySelector('.discount').textContent.replace('% off', '')) || 0;
                    const discountB = parseInt(b.querySelector('.discount').textContent.replace('% off', '')) || 0;
                    return discountB - discountA;
                });
                break;
        }
        
        // Re-append sorted cards
        productCards.forEach(card => {
            productsContainer.appendChild(card);
        });
        
        showToastMessage(`Sorted by ${sortBy.replace('-', ' ')}`);
    }

    // Search products
    function searchProducts(query) {
        const productCards = document.querySelectorAll('.product-card');
        const searchTerm = query.toLowerCase().trim();
        
        productCards.forEach(card => {
            const productId = parseInt(card.getAttribute('data-product-id'));
            const product = productDatabase[productId];
            const productName = product.name.toLowerCase();
            const productCategory = product.category.toLowerCase();
            
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Update product price based on selected quantity
    function updateProductPrice(selectElement) {
        const productId = parseInt(selectElement.getAttribute('data-product-id'));
        const selectedValue = parseInt(selectElement.value);
        const productCard = selectElement.closest('.product-card');
        
        console.log(`Updating price for product ${productId}, quantity option ${selectedValue}`);
        
        if (!productDatabase[productId]) {
            console.error(`Product ID ${productId} not found in database`);
            return;
        }
        
        const product = productDatabase[productId];
        
        // Check if selected value exists in prices
        if (!product.prices[selectedValue]) {
            console.error(`Price not found for quantity option ${selectedValue} for product ${productId}`);
            return;
        }
        
        const selectedPrice = product.prices[selectedValue];
        const originalPrice = product.originalPrice;
        const discount = product.discount;
        
        // Calculate original price for selected quantity
        const discountMultiplier = 1 - (discount / 100);
        const selectedOriginalPrice = Math.round(selectedPrice / discountMultiplier);
        
        // Update price display in product card
        const currentPriceElement = productCard.querySelector('.current-price');
        const originalPriceElement = productCard.querySelector('.original-price');
        const discountElement = productCard.querySelector('.discount');
        
        if (currentPriceElement) {
            currentPriceElement.textContent = `₹${selectedPrice}`;
        }
        
        if (originalPriceElement) {
            originalPriceElement.textContent = `₹${selectedOriginalPrice}`;
        }
        
        if (discountElement) {
            discountElement.textContent = `${discount}% off`;
        }
        
        console.log(`Price updated: Current=₹${selectedPrice}, Original=₹${selectedOriginalPrice}, Discount=${discount}%`);
    }

    // Initialize login page specifically
    function initializeLoginPage() {
        console.log('Initializing login page...');
        
        // FIX: Set username tab as default
        switchTab('username');
        
        // Reset login form state
        const otpSection = document.getElementById('otp-section');
        const getOtpBtn = document.getElementById('get-otp-btn');
        const loginBtn = document.getElementById('login-btn');
        
        if (otpSection) otpSection.style.display = 'none';
        if (getOtpBtn) getOtpBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        
        // Clear OTP inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach(input => input.value = '');
        
        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    // Initialize signup page specifically
    function initializeSignupPage() {
        console.log('Initializing signup page...');
        // Reset signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) signupForm.reset();
        
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
        setupModalEvents();
        setupLazyLoading();
        setupCouponEvents();
        setupCheckoutEvents();
        setupUPIPaymentEvents();
        setupFeedbackEvents();
    }

    // ===== LOGIN FUNCTIONALITY - FIXED =====
    function setupLoginEvents() {
        const showSignupLink = document.getElementById('show-signup');
        const loginForm = document.getElementById('login-form');
        const getOtpBtn = document.getElementById('get-otp-btn');
        const loginBtn = document.getElementById('login-btn');
        const otpInputs = document.querySelectorAll('.otp-input');
        const resendOtpLink = document.getElementById('resend-otp');
        const socialLoginBtns = document.querySelectorAll('.social-btn');

        console.log('Login events setup:', {
            showSignupLink: !!showSignupLink,
            loginForm: !!loginForm,
            getOtpBtn: !!getOtpBtn,
            loginBtn: !!loginBtn,
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

        // Get OTP button - FIXED with proper validation
        if (getOtpBtn) {
            getOtpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Get OTP clicked');
                
                // Get current active tab
                const activeTabBtn = document.querySelector('.tab-btn.active');
                const currentTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'username';
                let isValid = false;
                let identifier = '';
                
                if (currentTab === 'phone') {
                    const phoneInput = document.getElementById('phone');
                    identifier = phoneInput.value.trim();
                    if (validatePhone(identifier)) {
                        isValid = true;
                        simulateOtpSend('phone');
                    } else {
                        showError('phone-error', 'Please enter a valid phone number (10 digits)');
                    }
                } else {
                    const emailInput = document.getElementById('email');
                    identifier = emailInput.value.trim();
                    if (validateEmail(identifier)) {
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
                // Only allow numbers
                if (this.value && !/^\d$/.test(this.value)) {
                    this.value = '';
                    return;
                }
                
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                // Check if all OTP fields are filled
                const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
                if (allFilled) {
                    if (loginBtn) {
                        loginBtn.style.display = 'block';
                        loginBtn.disabled = false;
                    }
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

        // FIXED: Login form submission - proper handling for both tabs
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin(e);
            });
        }

        // FIXED: Direct login button click handler
        document.addEventListener('click', function(e) {
            // Handle username login button
            if (e.target.id === 'login-btn' || e.target.closest('#login-btn')) {
                e.preventDefault();
                console.log('Login button clicked');
                
                // Get the form data based on current tab
                let username, password;
                
                if (currentTab === 'username') {
                    username = document.getElementById('username').value.trim();
                    password = document.getElementById('username-password').value;
                } else {
                    username = document.getElementById('phone').value.trim();
                    password = document.getElementById('phone-password').value;
                }
                
                // Validate inputs
                if (!username) {
                    const errorId = currentTab === 'username' ? 'username-error' : 'phone-error';
                    showError(errorId, `Please enter your ${currentTab}`);
                    return;
                }
                
                if (!password) {
                    const errorId = currentTab === 'username' ? 'username-password-error' : 'phone-password-error';
                    showError(errorId, 'Please enter your password');
                    return;
                }
                
                // Show loading
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) {
                    const originalHTML = loginBtn.innerHTML;
                    loginBtn.innerHTML = '<div class="loader small"></div>';
                    loginBtn.disabled = true;
                    
                    // Simulate login
                    setTimeout(() => {
                        loginBtn.innerHTML = originalHTML;
                        loginBtn.disabled = false;
                        
                        // For demo - accept any login
                        userData.isLoggedIn = true;
                        userData.name = username;
                        saveUserData();
                        showPage('products');
                        showToastMessage('Login successful!');
                    }, 1500);
                }
            }
            
            // Handle username/phone specific login buttons
            if (e.target.classList.contains('username-login-btn') || e.target.classList.contains('phone-login-btn')) {
                e.preventDefault();
                console.log('Tab-specific login button clicked');
                
                // Determine which tab we're on
                const isUsernameTab = e.target.classList.contains('username-login-btn');
                const tabType = isUsernameTab ? 'username' : 'phone';
                
                // Update currentTab
                currentTab = tabType;
                
                // Trigger form submission
                const loginForm = document.getElementById('login-form');
                if (loginForm) {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }
        });
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
                handleSignup(e);
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

        // Search functionality
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchInput = this.querySelector('.search-input');
                const searchTerm = searchInput.value.trim();
                
                if (searchTerm) {
                    showPage('products');
                    setTimeout(() => {
                        searchProducts(searchTerm);
                        searchInput.value = searchTerm;
                        showToastMessage(`Search results for: ${searchTerm}`);
                    }, 100);
                }
            });
        }
    }

    // ===== PRODUCT FUNCTIONALITY =====
    function setupProductEvents() {
        // Delegate events for dynamically generated product cards
        document.addEventListener('click', function(e) {
            // Add to cart
            if (e.target.classList.contains('add-to-cart')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.getAttribute('data-product-id'));
                    const quantitySelect = productCard.querySelector('.quantity-select');
                    const selectedQuantity = parseInt(quantitySelect.value);
                    
                    addToCart(productId, selectedQuantity);
                }
            }
            
            // Add to wishlist
            if (e.target.classList.contains('wishlist-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.getAttribute('data-product-id'));
                    addToWishlist(productId);
                }
            }
            
            // Quick view
            if (e.target.classList.contains('quick-view-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.getAttribute('data-product-id'));
                    showQuickView(productId);
                }
            }
        });
    }

    // ===== PROFILE FUNCTIONALITY =====
    function initializeProfileEvents() {
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
        
        // Edit address buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit-address')) {
                e.preventDefault();
                const addressId = parseInt(e.target.getAttribute('data-address-id'));
                editAddress(addressId);
            }
            
            if (e.target.classList.contains('btn-delete-address')) {
                e.preventDefault();
                const addressId = parseInt(e.target.getAttribute('data-address-id'));
                deleteAddress(addressId);
            }
            
            if (e.target.classList.contains('btn-set-default')) {
                e.preventDefault();
                const addressId = parseInt(e.target.getAttribute('data-address-id'));
                setDefaultAddress(addressId);
            }
        });
        
        // Track order buttons in profile
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-track-order') || e.target.classList.contains('track-order-btn')) {
                e.preventDefault();
                const orderId = e.target.getAttribute('data-order-id') || 
                               e.target.closest('.order-card')?.querySelector('h4')?.textContent?.replace('Order #', '');
                
                // Check if user has any orders
                if (userData.orders && userData.orders.length > 0) {
                    if (orderId) {
                        showOrderTracking(orderId);
                    } else {
                        // Show the latest order
                        showOrderTracking(userData.orders[userData.orders.length - 1].id);
                    }
                } else {
                    alert('No orders found! Please place an order first.');
                }
            }
        });
    }

    // ===== CART FUNCTIONALITY - FIXED =====
    function setupCartEventListeners() {
        console.log('Setting up cart event listeners...');
        
        // Delegate events for cart items
        document.addEventListener('click', function(e) {
            // Quantity decrease
            if (e.target.classList.contains('quantity-decrease')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.getAttribute('data-product-id'));
                    console.log('Decreasing quantity for product:', productId);
                    if (!isNaN(productId)) {
                        updateCartQuantity(productId, -1);
                    }
                }
            }
            
            // Quantity increase
            if (e.target.classList.contains('quantity-increase')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.getAttribute('data-product-id'));
                    console.log('Increasing quantity for product:', productId);
                    if (!isNaN(productId)) {
                        updateCartQuantity(productId, 1);
                    }
                }
            }
            
            // Remove item
            if (e.target.classList.contains('remove-item') || 
                e.target.closest('.remove-item')) {
                console.log('Remove item button clicked');
                const removeBtn = e.target.classList.contains('remove-item') ? 
                    e.target : e.target.closest('.remove-item');
                const cartItem = removeBtn.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.getAttribute('data-product-id'));
                    console.log('Removing product from cart:', productId);
                    if (!isNaN(productId)) {
                        removeFromCart(productId);
                    }
                }
            }
            
            // Move to wishlist
            if (e.target.classList.contains('move-to-wishlist')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.getAttribute('data-product-id'));
                    moveToWishlist(productId);
                }
            }
            
            // Save for later
            if (e.target.classList.contains('save-for-later')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.getAttribute('data-product-id'));
                    saveForLater(productId);
                }
            }
        });
        
        // Checkout button - reattach on render
        document.addEventListener('click', function(e) {
            if (e.target.id === 'checkout-btn' || e.target.closest('#checkout-btn')) {
                e.preventDefault();
                if (userData.cart.length > 0) {
                    showPage('checkout');
                }
            }
            
            // Empty cart shop button
            if (e.target.id === 'empty-cart-shop' || e.target.closest('#empty-cart-shop')) {
                e.preventDefault();
                showPage('products');
            }
        });
    }

    // ===== CHECKOUT FUNCTIONALITY =====
    function setupCheckoutEvents() {
        // Next step buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-next')) {
                e.preventDefault();
                const nextStep = e.target.getAttribute('data-next');
                navigateToStep(nextStep);
            }
            
            if (e.target.classList.contains('btn-prev')) {
                e.preventDefault();
                const prevStep = e.target.getAttribute('data-prev');
                navigateToStep(prevStep);
            }
            
            // Place order button
            if (e.target.classList.contains('btn-next') && e.target.getAttribute('data-next') === 'confirmation') {
                e.preventDefault();
                processOrder();
            }
        });
    }

    function initializeCheckout() {
        // Calculate and display order summary
        updateCheckoutSummary();
        
        // Setup address management
        setupAddressManagement();
        
        // Setup delivery options
        setupDeliveryOptions();
        
        // Setup payment methods
        setupPaymentMethods();
        
        // Setup checkout steps navigation
        setupCheckoutSteps();
        
        // Fix checkout steps display
        fixCheckoutStepsDisplay();
    }

    // FIX: Initialize checkout steps properly
    function initializeCheckoutSteps() {
        console.log('Initializing checkout steps...');
        
        // Get current active step from DOM or default to delivery
        let activeStep = 'delivery';
        const visibleStep = document.querySelector('.checkout-step.active');
        if (visibleStep) {
            activeStep = visibleStep.id.replace('-step', '');
        }
        
        // Update step indicators
        updateStepIndicators(activeStep);
        
        // Set up event listeners for step navigation
        setupStepNavigation();
    }

    // FIX: Update step indicators based on current step
    function updateStepIndicators(activeStep) {
        console.log('Updating step indicators for:', activeStep);
        
        const steps = document.querySelectorAll('.step');
        if (!steps || steps.length === 0) return;
        
        // Map step names to indices
        const stepIndexMap = {
            'delivery': 0,
            'payment': 1,
            'confirmation': 2
        };
        
        const activeIndex = stepIndexMap[activeStep] || 0;
        
        steps.forEach((step, index) => {
            // Remove all active classes first
            step.classList.remove('active');
            step.classList.remove('completed');
            
            // Set active for current step
            if (index === activeIndex) {
                step.classList.add('active');
            }
            // Set completed for previous steps
            else if (index < activeIndex) {
                step.classList.add('completed');
            }
            
            // Update step number styling
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                if (index === activeIndex) {
                    stepNumber.style.backgroundColor = '#4CAF50';
                    stepNumber.style.color = 'white';
                    stepNumber.style.transform = 'scale(1.1)';
                } else if (index < activeIndex) {
                    stepNumber.style.backgroundColor = '#4CAF50';
                    stepNumber.style.color = 'white';
                    stepNumber.style.transform = 'scale(1)';
                } else {
                    stepNumber.style.backgroundColor = '#e0e0e0';
                    stepNumber.style.color = '#666';
                    stepNumber.style.transform = 'scale(1)';
                }
            }
            
            // Update step label styling
            const stepLabel = step.querySelector('.step-label');
            if (stepLabel) {
                if (index === activeIndex) {
                    stepLabel.style.color = '#4CAF50';
                    stepLabel.style.fontWeight = 'bold';
                } else if (index < activeIndex) {
                    stepLabel.style.color = '#4CAF50';
                    stepLabel.style.fontWeight = 'normal';
                } else {
                    stepLabel.style.color = '#666';
                    stepLabel.style.fontWeight = 'normal';
                }
            }
        });
        
        // Update progress line (but keep it hidden)
        updateCheckoutProgressLine(activeIndex, steps.length);
    }

    // FIX: Update checkout progress line (but keep it hidden)
    function updateCheckoutProgressLine(activeIndex, totalSteps) {
        const checkoutSteps = document.querySelector('.checkout-steps');
        if (!checkoutSteps) return;
        
        // Remove existing progress line if any
        const existingLine = checkoutSteps.querySelector('.progress-line');
        if (existingLine) existingLine.remove();
        
        // Create progress line container but keep it hidden
        const progressLine = document.createElement('div');
        progressLine.className = 'progress-line';
        progressLine.style.cssText = `
            position: absolute;
            top: 25px;
            left: 50px;
            right: 50px;
            height: 3px;
            background: #e0e0e0;
            z-index: 1;
            display: none; /* HIDE THE PROGRESS LINE */
        `;
        
        // Calculate progress percentage
        const progressPercentage = activeIndex / (totalSteps - 1) * 100;
        
        // Create filled part
        const filledLine = document.createElement('div');
        filledLine.className = 'progress-filled';
        filledLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: ${progressPercentage}%;
            background: #4CAF50;
            transition: width 0.5s ease;
            display: none; /* HIDE THE PROGRESS LINE */
        `;
        
        progressLine.appendChild(filledLine);
        checkoutSteps.style.position = 'relative';
        checkoutSteps.appendChild(progressLine);
    }

    // FIX: Setup step navigation
    function setupStepNavigation() {
        // Remove existing event listeners to prevent duplicates
        const nextButtons = document.querySelectorAll('.btn-next');
        const prevButtons = document.querySelectorAll('.btn-prev');
        
        nextButtons.forEach(button => {
            // Clone and replace to remove existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                const nextStep = this.getAttribute('data-next');
                if (nextStep) {
                    navigateToStep(nextStep);
                }
            });
        });

        prevButtons.forEach(button => {
            // Clone and replace to remove existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                const prevStep = this.getAttribute('data-prev');
                if (prevStep) {
                    navigateToStep(prevStep);
                }
            });
        });
    }

    function fixCheckoutStepsDisplay() {
        const checkoutSteps = document.querySelector('.checkout-steps');
        if (checkoutSteps) {
            // Ensure checkout steps are visible
            checkoutSteps.style.display = 'flex';
            checkoutSteps.style.visibility = 'visible';
            checkoutSteps.style.opacity = '1';
            
            // Ensure steps have proper styling
            const steps = checkoutSteps.querySelectorAll('.step');
            steps.forEach(step => {
                step.style.display = 'flex';
                step.style.alignItems = 'center';
                step.style.gap = '8px';
                step.style.position = 'relative';
                step.style.zIndex = '2';
            });
        }
    }
    
    function setupCheckoutSteps() {
        // Step navigation is now handled by setupStepNavigation
        console.log('Checkout steps setup complete');
        
        // Track order button
        const trackOrderBtn = document.getElementById('track-order');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', function() {
                if (userData.orders && userData.orders.length > 0) {
                    showOrderTracking(userData.orders[userData.orders.length - 1].id);
                } else {
                    alert('No orders found! Please place an order first.');
                }
            });
        }
    }

    // ===== ADDRESS MANAGEMENT =====
    function setupAddressManagement() {
        const addressForm = document.getElementById('address-form');
        
        if (!addressForm) return;
        
        const formInputs = addressForm.querySelectorAll('input, textarea');
        
        // Hide address form by default
        addressForm.style.display = 'none';
        
        // Hide saved addresses section if no addresses
        const savedAddressesSection = document.querySelector('.saved-addresses-section');
        if (savedAddressesSection && (!userData.addresses || userData.addresses.length === 0)) {
            savedAddressesSection.style.display = 'none';
        } else if (savedAddressesSection) {
            // Select the first saved address by default
            const firstAddressRadio = savedAddressesSection.querySelector('input[type="radio"]');
            if (firstAddressRadio) {
                firstAddressRadio.checked = true;
                // Fill form with selected address data
                const addressId = parseInt(firstAddressRadio.value);
                const address = userData.addresses.find(addr => addr.id === addressId);
                if (address) {
                    fillFormWithAddress(address);
                }
            }
        }
        
        // Show/hide address form based on selection
        const savedAddressRadios = document.querySelectorAll('input[name="saved-address"]');
        if (savedAddressRadios.length > 0) {
            savedAddressRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'new') {
                        addressForm.style.display = 'block';
                        clearForm(formInputs);
                        const saveAddressCheckbox = document.getElementById('save-address');
                        if (saveAddressCheckbox) saveAddressCheckbox.checked = true;
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
        }
        
        // Edit address button functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit-address-checkout')) {
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
        
        // Populate saved addresses with edit options
        renderCheckoutAddresses();
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

    function renderCheckoutAddresses() {
        const savedAddressesList = document.getElementById('saved-addresses-list');
        if (!savedAddressesList || !userData.addresses || userData.addresses.length === 0) return;
        
        savedAddressesList.innerHTML = '';
        
        userData.addresses.forEach(address => {
            const addressItem = document.createElement('div');
            addressItem.className = 'address-option';
            addressItem.innerHTML = `
                <input type="radio" name="saved-address" id="address-${address.id}" value="${address.id}" ${address.default ? 'checked' : ''}>
                <label for="address-${address.id}">
                    <div class="address-option-content">
                        <div class="address-option-header">
                            <strong>${address.name}</strong>
                            ${address.default ? '<span class="default-badge">Default</span>' : ''}
                        </div>
                        <div class="address-option-details">
                            <p>${address.fullName || address.name}</p>
                            <p>${address.street}</p>
                            <p>${address.city}, ${address.state} - ${address.pincode}</p>
                            <p>Phone: ${address.phone}</p>
                        </div>
                        <button class="btn-edit-address-checkout" data-address-id="${address.id}">
                            Edit Address
                        </button>
                    </div>
                </label>
            `;
            savedAddressesList.appendChild(addressItem);
        });
        
        // Add event listener for the edit buttons
        document.querySelectorAll('.btn-edit-address-checkout').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const addressId = parseInt(this.getAttribute('data-address-id'));
                
                // Select the new address option
                const newAddressRadio = document.getElementById('address-new');
                if (newAddressRadio) {
                    newAddressRadio.checked = true;
                    newAddressRadio.dispatchEvent(new Event('change'));
                    
                    // Fill form with address data
                    const address = userData.addresses.find(addr => addr.id === addressId);
                    if (address) {
                        fillFormWithAddress(address);
                    }
                }
            });
        });
        
        // Add event listeners for radio buttons
        document.querySelectorAll('input[name="saved-address"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value !== 'new') {
                    const addressForm = document.getElementById('address-form');
                    if (addressForm) {
                        addressForm.style.display = 'none';
                    }
                } else {
                    const addressForm = document.getElementById('address-form');
                    if (addressForm) {
                        addressForm.style.display = 'block';
                    }
                }
            });
        });
    }

    // ===== DELIVERY OPTIONS =====
    function setupDeliveryOptions() {
        const deliveryOptions = document.querySelectorAll('.delivery-option input');
        deliveryOptions.forEach(option => {
            option.addEventListener('change', function() {
                updateDeliveryOption(this.value);
            });
        });
    }

    function updateDeliveryOption(option) {
        // Update delivery options UI
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(opt => opt.classList.remove('active'));
        
        const selectedOption = document.querySelector(`.delivery-option input[value="${option}"]`)?.closest('.delivery-option');
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update delivery cost in summary
        updateCheckoutSummary();
    }

    // ===== PAYMENT METHODS =====
    function setupPaymentMethods() {
        console.log('Setting up payment listeners...');
        
        // Handle main payment method switching (Card, UPI, COD)
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', function() {
                console.log('Payment method changed to:', this.value);
                
                // Update payment option active state
                document.querySelectorAll('.payment-option').forEach(option => {
                    option.classList.remove('active');
                });
                this.closest('.payment-option').classList.add('active');
                
                // Hide all payment forms
                document.querySelectorAll('.payment-form').forEach(form => {
                    form.classList.remove('active');
                });
                
                // Show selected payment form
                const selectedForm = document.getElementById(`${this.value}-form`);
                if (selectedForm) {
                    selectedForm.classList.add('active');
                }
                
                // Initialize UPI payment if selected
                if (this.value === 'upi' && !isQRGenerated) {
                    initializeUPIPayment();
                }
                
                // Reset UPI payment state
                if (this.value === 'upi') {
                    upiPaymentInProgress = false;
                }
            });
        });

        // Handle payment form submissions
        document.addEventListener('click', function(e) {
            // Card payment submit
            if (e.target.id === 'card-pay-btn') {
                e.preventDefault();
                const cardForm = document.getElementById('card-form');
                if (validateCardForm(cardForm)) {
                    processPayment('card');
                }
            }
            
            // UPI payment submit
            if (e.target.id === 'upi-pay-btn') {
                e.preventDefault();
                
                // Check if UPI payment is already in progress
                if (upiPaymentInProgress) {
                    console.log('UPI payment already in progress');
                    return;
                }
                
                // Set flag to prevent multiple submissions
                upiPaymentInProgress = true;
                processPayment('upi');
            }
            
            // COD confirmation
            if (e.target.id === 'cod-confirm-btn') {
                e.preventDefault();
                processPayment('cod');
            }
        });
    }

    // ===== UPI QR CODE PAYMENT SYSTEM =====
    function setupUPIPaymentEvents() {
        // Initialize if UPI is pre-selected
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('upi-payment') && document.getElementById('upi-payment').checked) {
                initializeUPIPayment();
            }
        });

        // Event listener for UPI payment selection
        const upiPaymentRadio = document.getElementById('upi-payment');
        if (upiPaymentRadio) {
            upiPaymentRadio.addEventListener('change', function() {
                if (this.checked && !isQRGenerated) {
                    initializeUPIPayment();
                }
            });
        }
    }

    function initializeUPIPayment() {
        // Update order amounts
        updateOrderAmounts();
        
        // Generate QR code
        generateQRCode();
        
        // Start timer
        startTimer();
        
        // Update generation time
        updateGenerationTime();
        
        isQRGenerated = true;
        qrExpired = false;
        
        // Hide any QR expired overlay
        const qrOverlay = document.getElementById('qr-overlay');
        if (qrOverlay) {
            qrOverlay.style.display = 'none';
        }
        
        // Enable QR code
        const qrCodeElement = document.querySelector('.qr-code');
        if (qrCodeElement) {
            qrCodeElement.style.opacity = '1';
            qrCodeElement.style.pointerEvents = 'auto';
        }
    }

    function updateOrderAmounts() {
        // Get amounts from cart summary
        const totals = calculateCartTotals();
        
        // Update display elements
        const elements = {
            'subtotal': totals.subtotal.toFixed(2),
            'tax': totals.tax.toFixed(2),
            'shipping': totals.delivery.toFixed(2),
            'total-amount': totals.total.toFixed(2),
            'display-amount': totals.total.toFixed(2)
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = id === 'display-amount' ? elements[id] : `₹${elements[id]}`;
            }
        });
        
        return totals.total;
    }

    function generateQRCode() {
        const amount = updateOrderAmounts();
        const merchantUPI = 'organicmart@upi';
        const upiLink = `upi://pay?pa=${merchantUPI}&pn=OrganicMart&am=${amount}&cu=INR&tn=Order Payment`;
        
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) return;
        
        qrContainer.innerHTML = '';
        
        // Generate transaction ID
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
        const txnIdElement = document.getElementById('txn-id');
        if (txnIdElement) {
            txnIdElement.textContent = transactionId;
        }
        
        try {
            // Create QR code
            const qrCode = new QRCode(qrContainer, {
                text: upiLink,
                width: 250,
                height: 250,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('QR Code generation error:', error);
            qrContainer.innerHTML = `
                <div class="qr-error">
                    <img src="./qr.jpeg" alt="QR Code" id ="contact-qr">
                </div>
            `;
        }
    }

    function startTimer() {
        clearInterval(qrTimer);
        timeLeft = 300; // Reset to 5 minutes
        
        qrTimer = setInterval(function() {
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            const timerMinutes = document.getElementById('timer-minutes');
            const timerSeconds = document.getElementById('timer-seconds');
            const progressBar = document.getElementById('progress-bar');
            const timerCountdown = document.querySelector('.timer-countdown');
            
            if (timerMinutes) timerMinutes.textContent = minutes.toString().padStart(2, '0');
            if (timerSeconds) timerSeconds.textContent = seconds.toString().padStart(2, '0');
            
            // Update progress bar
            if (progressBar) {
                const progress = ((300 - timeLeft) / 300) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Change color when time is running low
                if (timeLeft < 60) {
                    progressBar.style.backgroundColor = '#f44336';
                    if (timerCountdown) timerCountdown.style.color = '#f44336';
                } else if (timeLeft < 120) {
                    progressBar.style.backgroundColor = '#ff9800';
                    if (timerCountdown) timerCountdown.style.color = '#ff9800';
                } else {
                    progressBar.style.backgroundColor = '#4CAF50';
                    if (timerCountdown) timerCountdown.style.color = '#333';
                }
            }
            
            // When time runs out
            if (timeLeft <= 0) {
                clearInterval(qrTimer);
                qrExpired = true;
                showQRExpired();
            }
        }, 1000);
    }

    function showQRExpired() {
        const overlay = document.getElementById('qr-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
        
        // Disable QR code
        const qrCodeElement = document.querySelector('.qr-code');
        if (qrCodeElement) {
            qrCodeElement.style.opacity = '0.3';
            qrCodeElement.style.pointerEvents = 'none';
        }
    }

    function generateNewQR() {
        // Reset timer
        timeLeft = 300;
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSeconds = document.getElementById('timer-seconds');
        const progressBar = document.getElementById('progress-bar');
        const timerCountdown = document.querySelector('.timer-countdown');
        
        if (timerMinutes) timerMinutes.textContent = '05';
        if (timerSeconds) timerSeconds.textContent = '00';
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = '#4CAF50';
        }
        if (timerCountdown) timerCountdown.style.color = '#333';
        
        // Hide expired overlay
        const overlay = document.getElementById('qr-overlay');
        if (overlay) overlay.style.display = 'none';
        
        const qrCodeElement = document.querySelector('.qr-code');
        if (qrCodeElement) {
            qrCodeElement.style.opacity = '1';
            qrCodeElement.style.pointerEvents = 'auto';
        }
        
        // Generate new transaction ID
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
        const txnIdElement = document.getElementById('txn-id');
        if (txnIdElement) {
            txnIdElement.textContent = transactionId;
        }
        
        // Update generation time
        updateGenerationTime();
        
        // Generate new QR code
        generateQRCode();
        
        // Restart timer
        startTimer();
        
        qrExpired = false;
    }

    function updateGenerationTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const qrTimeElement = document.getElementById('qr-time');
        if (qrTimeElement) qrTimeElement.textContent = timeString;
    }

    function copyUPI() {
        const upiId = 'organicmart@upi';
        navigator.clipboard.writeText(upiId).then(() => {
            // Show copied notification
            const copyBtn = event.target.closest('.copy-btn-small') || event.target;
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.backgroundColor = '';
            }, 2000);
            
            showToastMessage('UPI ID copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy UPI ID:', err);
            showToastMessage('Failed to copy UPI ID');
        });
    }

    function downloadQR() {
        if (qrExpired) {
            alert('Please generate a new QR code first');
            return;
        }
        
        const canvas = document.querySelector('#qr-code canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `OrganicMart-Payment-QR-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToastMessage('QR code downloaded!');
        } else {
            showToastMessage('QR code not available');
        }
    }

    function shareQR() {
        if (qrExpired) {
            alert('QR code has expired. Please generate a new one.');
            return;
        }
        
        const amountElement = document.getElementById('display-amount');
        const amount = amountElement ? amountElement.textContent : '0';
        
        if (navigator.share) {
            navigator.share({
                title: 'OrganicMart Payment QR Code',
                text: `Scan to pay ₹${amount} to OrganicMart`,
                url: window.location.href
            });
        } else {
            // Fallback: download QR code
            downloadQR();
        }
    }

    function checkPaymentStatus() {
        // In real app, this would check with payment gateway
        showToastMessage('Checking payment status...');
        
        // Simulate payment verification
        const overlay = document.createElement('div');
        overlay.className = 'status-overlay';
        overlay.innerHTML = `
            <div class="status-modal">
                <div class="status-loader">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <h4>Verifying Payment</h4>
                <p>Please wait while we verify your payment...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            document.body.removeChild(overlay);
            showToastMessage('Payment verification complete!');
        }, 2000);
    }

    function validateCardForm(form) {
        const cardNumber = form.querySelector('#card-number').value;
        const cardExpiry = form.querySelector('#card-expiry').value;
        const cardCvv = form.querySelector('#card-cvv').value;
        const cardName = form.querySelector('#card-name').value;
        
        if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
        if (!cardCvv || cardCvv.length !== 3) {
            alert('Please enter a valid 3-digit CVV');
            return false;
        }
        
        if (!cardName) {
            alert('Please enter the name on card');
            return false;
        }
        
        return true;
    }

    function processPayment(paymentType) {
        console.log("Processing payment:", paymentType);
        
        // Show payment modal with loader
        const modal = document.getElementById('payment-modal');
        const loader = modal.querySelector('.payment-loader');
        const success = modal.querySelector('.payment-success');
        const failed = modal.querySelector('.payment-failed');
        
        // Reset modal
        loader.style.display = 'block';
        success.style.display = 'none';
        failed.style.display = 'none';
        modal.style.display = 'flex';
        
        // Update modal content
        const statusTitle = document.getElementById('payment-status-title');
        const statusMessage = document.getElementById('payment-status-message');
        const successMessage = document.getElementById('payment-success-message');
        const paymentMethod = document.getElementById('payment-method');
        const paymentAmount = document.getElementById('payment-amount');
        
        // Get amount
        const totalAmountElement = document.getElementById('checkout-total');
        const totalAmount = totalAmountElement ? totalAmountElement.textContent : '0';
        if (paymentAmount) {
            paymentAmount.textContent = totalAmount;
        }
        
        // Set messages
        const paymentMessages = {
            'card': {
                status: 'Processing Card Payment',
                message: 'Verifying your card details...',
                success: 'Card payment processed successfully!',
                method: 'Credit/Debit Card'
            },
            'upi': {
                status: 'Processing UPI Payment',
                message: 'Please complete the payment using the QR code...',
                success: 'UPI payment completed successfully!',
                method: 'UPI - QR Code'
            },
            'cod': {
                status: 'Confirming COD Order',
                message: 'Processing your COD request...',
                success: 'COD order confirmed successfully!',
                method: 'Cash on Delivery'
            }
        };
        
        const messages = paymentMessages[paymentType] || paymentMessages.upi;
        
        if (statusTitle) statusTitle.textContent = messages.status;
        if (statusMessage) statusMessage.textContent = messages.message;
        if (successMessage) successMessage.textContent = messages.success;
        if (paymentMethod) paymentMethod.textContent = messages.method;
        
        // Generate random transaction ID
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
        const transactionIdElement = document.getElementById('transaction-id');
        if (transactionIdElement) {
            transactionIdElement.textContent = transactionId;
        }
        
        // Simulate payment processing
        setTimeout(() => {
            const isSuccess = Math.random() > 0.15;
            
            if (isSuccess) {
                if (loader) loader.style.display = 'none';
                if (success) success.style.display = 'block';
                
                // Reset UPI payment flag on success
                if (paymentType === 'upi') {
                    upiPaymentInProgress = false;
                }
                
                setTimeout(() => {
                    closePaymentModal();
                    // Complete the order
                    completeOrder();
                    // Navigate to confirmation step
                    navigateToStep('confirmation');
                }, 2000);
            } else {
                if (loader) loader.style.display = 'none';
                if (failed) failed.style.display = 'block';
                
                // Reset UPI payment flag on failure
                if (paymentType === 'upi') {
                    upiPaymentInProgress = false;
                }
                    
                const errorMessages = {
                    'card': 'Payment was declined by your bank.',
                    'upi': 'UPI transaction failed. Please try again.',
                    'cod': 'COD not available for this address.'
                };
                
                const errorMessageElement = document.getElementById('payment-error-message');
                if (errorMessageElement) {
                    errorMessageElement.textContent = errorMessages[paymentType] || 'Payment failed. Please try again.';
                }
                
                // Allow retry
                const retryPaymentBtn = document.getElementById('retry-payment');
                if (retryPaymentBtn) {
                    retryPaymentBtn.onclick = function() {
                        closePaymentModal();
                    };
                }
            }
        }, 3000);
    }

    function closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ===== ORDER TRACKING FUNCTIONALITY =====
    function showOrderTracking(orderId = null) {
        console.log('showOrderTracking called with orderId:', orderId);
        
        // Check if user has any orders
        if (!userData.orders || userData.orders.length === 0) {
            console.log('No orders found');
            alert('No orders found! Please place an order first.');
            return;
        }
        
        // If no order ID provided, get the latest order
        if (!orderId) {
            orderId = userData.orders[userData.orders.length - 1].id;
        }
        
        console.log('Looking for order with ID:', orderId);
        console.log('Available orders:', userData.orders);
        
        // Find the order
        const order = userData.orders.find(o => o.id === orderId);
        if (!order) {
            console.error('Order not found with ID:', orderId);
            alert('Order not found! Please select a valid order.');
            return;
        }
        
        console.log('Order found:', order);
        
        // Generate delivery details based on order
        const deliveryDetails = generateDeliveryDetails(order);
        
        // Create tracking modal with numbered steps (NO PROGRESS LINE)
        const modalHtml = `
            <div class="modal" id="tracking-modal" style="display: flex;">
                <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h2>Order Tracking</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="order-tracking-info">
                            <div class="order-header" style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <h3 style="margin: 0; color: #2e7d32;">Order #${order.id}</h3>
                                        <span class="order-date" style="color: #666; font-size: 14px;">${order.date} ${order.time || ''}</span>
                                    </div>
                                    <div class="order-status ${order.status}" style="padding: 6px 12px; border-radius: 20px; font-weight: bold; background: ${order.status === 'delivered' ? '#e8f5e9' : '#fff3e0'}; color: ${order.status === 'delivered' ? '#2e7d32' : '#f57c00'};">
                                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- NUMBERED TRACKING STEPS WITHOUT PROGRESS LINE -->
                            <div class="tracking-steps-container" style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                                <h4 style="color: #2e7d32; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-map-marker-alt"></i> Order Tracking Status
                                </h4>
                                
                                <div class="numbered-tracking-steps" style="position: relative;">
                                    ${deliveryDetails.statuses.map((step, index) => {
                                        const isCompleted = index <= deliveryDetails.currentStep;
                                        const isCurrent = index === deliveryDetails.currentStep;
                                        return `
                                            <div class="numbered-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}" 
                                                 style="position: relative; display: flex; align-items: center; margin-bottom: 40px;">
                                                <div class="step-number" 
                                                     style="width: 80px; height: 80px; border-radius: 50%; background: ${isCompleted ? '#4CAF50' : '#e0e0e0'}; 
                                                            display: flex; align-items: center; justify-content: center; 
                                                            color: white; font-size: 24px; font-weight: bold; z-index: 2;
                                                            border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                    ${step.number}
                                                </div>
                                                <div class="step-content" style="margin-left: 20px; flex: 1;">
                                                    <h5 style="margin: 0 0 8px 0; color: ${isCompleted ? '#2e7d32' : '#666'}; font-size: 18px;">
                                                        ${step.status}
                                                        ${isCurrent ? `<span class="current-step-badge" style="background: #ff9800; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-left: 10px;">Current Step</span>` : ''}
                                                    </h5>
                                                    <p style="margin: 0 0 5px 0; color: #444; font-size: 15px; font-weight: 500;">${step.description}</p>
                                                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
                                                        <i class="fas ${step.icon}" style="margin-right: 8px;"></i>${step.subStatus}
                                                    </p>
                                                    <small style="color: #999; font-size: 13px;">
                                                        <i class="far fa-clock" style="margin-right: 5px;"></i>${step.time}
                                                    </small>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                            
                            <div class="delivery-details" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                                <h4 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-truck"></i> Delivery Information
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                                    <div class="detail-card">
                                        <div class="detail-label" style="color: #666; font-size: 14px;">Delivery Date</div>
                                        <div class="detail-value" style="font-weight: bold; color: #2e7d32;">${deliveryDetails.deliveryDate}</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-label" style="color: #666; font-size: 14px;">Time Window</div>
                                        <div class="detail-value" style="font-weight: bold;">${deliveryDetails.timeWindow}</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-label" style="color: #666; font-size: 14px;">Delivery Agent</div>
                                        <div class="detail-value" style="font-weight: bold;">${deliveryDetails.agentName}</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-label" style="color: #666; font-size: 14px;">Contact</div>
                                        <div class="detail-value" style="font-weight: bold; color: #1976d2;">${deliveryDetails.agentContact}</div>
                                    </div>
                                    <div class="detail-card">
                                        <div class="detail-label" style="color: #666; font-size: 14px;">Tracking Number</div>
                                        <div class="detail-value" style="font-weight: bold; font-family: monospace;">${deliveryDetails.trackingNumber}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-items-summary" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                                <h4 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-shopping-basket"></i> Order Items (${order.items.length})
                                </h4>
                                <div class="tracking-items" style="max-height: 200px; overflow-y: auto;">
                                    ${order.items.map(item => `
                                        <div class="tracking-item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                                            <div style="flex: 1;">
                                                <p style="margin: 0 0 5px 0; font-weight: 500;">${item.name}</p>
                                                <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
                                                    <span>${item.weight || '500g'} × ${item.quantity}</span>
                                                    <span style="font-weight: bold;">₹${item.price * item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="delivery-address" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <h4 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-home"></i> Delivery Address
                                </h4>
                                <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #4caf50;">
                                    <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${order.address.name}</p>
                                    <p style="margin: 0 0 8px 0; color: #444;">${order.address.address}</p>
                                    <p style="margin: 0 0 8px 0; color: #444;">${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
                                    <p style="margin: 0; color: #666;">
                                        <i class="fas fa-phone" style="margin-right: 8px;"></i> ${order.address.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 10px; padding: 20px; border-top: 1px solid #eee;">
                        <button class="btn btn-secondary modal-close" style="flex: 1;">Close</button>
                        <button class="btn btn-primary contact-support" style="flex: 1; background: #1976d2;">
                            <i class="fas fa-headset"></i> Contact Support
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                #tracking-modal .modal-content {
                    animation: slideIn 0.3s ease;
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .detail-card {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 6px;
                    border-left: 3px solid #4caf50;
                }
                .tracking-items::-webkit-scrollbar {
                    width: 6px;
                }
                .tracking-items::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .tracking-items::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 3px;
                }
                .tracking-items::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                .numbered-step.completed .step-number {
                    background: #4CAF50 !important;
                    animation: pulse 2s infinite;
                }
                .numbered-step.current .step-number {
                    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            </style>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('tracking-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add event listeners for modal
        const modal = document.getElementById('tracking-modal');
        const closeButtons = modal.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
            });
        });
        
        // Contact support button
        const contactBtn = modal.querySelector('.contact-support');
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                alert('Customer Support:\n📞 Phone: 1800-123-4567\n✉️ Email: support@organicmart.com\n🕒 Hours: 8 AM - 10 PM');
            });
        }
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    function generateDeliveryDetails(order) {
        const statuses = deliveryTracking.generateStatus();
        
        // Calculate current step based on order status
        const currentStep = deliveryTracking.getCurrentStep(order.status);
        
        return {
            deliveryDate: deliveryTracking.getDeliveryDate(),
            timeWindow: deliveryTracking.getDeliveryWindow(),
            agentName: deliveryTracking.getDeliveryAgent(),
            agentContact: deliveryTracking.getDeliveryContact(),
            trackingNumber: deliveryTracking.getTrackingNumber(),
            statuses: statuses,
            currentStep: currentStep
        };
    }

    // ===== COUPON FUNCTIONALITY =====
    function setupCouponEvents() {
        // Use event delegation for dynamically created coupon buttons
        document.addEventListener('click', function(e) {
            if (e.target.id === 'apply-coupon' || e.target.closest('#apply-coupon')) {
                applyCoupon();
            }
            
            if (e.target.id === 'remove-coupon' || e.target.closest('#remove-coupon')) {
                removeCoupon();
            }
        });
        
        const couponCodeInput = document.getElementById('coupon-code');
        if (couponCodeInput) {
            couponCodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCoupon();
                }
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

    // ===== OTP FUNCTIONALITY =====
    function simulateOtpSend(method = null) {
        // Generate random 6-digit OTP
        currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Demo OTP sent via ${method || 'selected method'}: ${currentOtp}`);
        
        // Auto-fill OTP for demo purposes
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            if (index < 6) {
                input.value = currentOtp[index];
            }
        });
        
        // Show login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.style.display = 'block';
        
        startOtpTimer();
        showToastMessage(`OTP sent to your ${method || 'selected method'}`);
    }

    function showOtpSection() {
        const otpSection = document.getElementById('otp-section');
        const getOtpBtn = document.getElementById('get-otp-btn');
        
        if (otpSection) otpSection.style.display = 'block';
        if (getOtpBtn) getOtpBtn.style.display = 'none';
    }

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

    // ===== LOGOUT HANDLING =====
    function handleLogout() {
        userData.isLoggedIn = false;
        saveUserData();
        showPage('login');
        showToastMessage('Logged out successfully!');
    }

    // ===== CART FUNCTIONALITY - FIXED =====
    function addToCart(productId, selectedQuantity) {
        if (!productDatabase[productId]) {
            console.error(`Product ID ${productId} not found`);
            return;
        }
        
        const product = productDatabase[productId];
        const existingItemIndex = userData.cart.findIndex(item => item.id === productId && item.quantityOption === selectedQuantity);
        
        if (existingItemIndex > -1) {
            // Update quantity if same product with same quantity option exists
            userData.cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            userData.cart.push({
                id: productId,
                name: product.name,
                category: product.category,
                price: product.prices[selectedQuantity],
                quantity: 1,
                quantityOption: selectedQuantity,
                weight: product.weight[selectedQuantity],
                image: product.image,
                originalPrice: product.originalPrice,
                discount: product.discount
            });
        }
        
        saveUserData();
        updateCartCount();
        showToastMessage(`${product.name} (${product.weight[selectedQuantity]}) added to cart!`);
        
        // If on cart page, refresh the cart
        if (pages.cart && pages.cart.classList.contains('active')) {
            renderCart();
        }
    }

    function updateCartQuantity(productId, change) {
        const itemIndex = userData.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        
        const item = userData.cart[itemIndex];
        
        // Check if quantity would go below 1
        if (item.quantity + change < 1) {
            // Remove the item instead of going to 0
            removeFromCart(productId);
            return;
        }
        
        item.quantity += change;
        saveUserData();
        renderCart();
        updateCartCount();
        showToastMessage(`${item.name} quantity updated to ${item.quantity}`);
    }

    function removeFromCart(productId) {
        console.log('Attempting to remove product from cart:', productId);
        
        const itemIndex = userData.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) {
            console.error('Product not found in cart:', productId);
            return;
        }
        
        const removedItem = userData.cart[itemIndex];
        userData.cart.splice(itemIndex, 1);
        
        console.log('Removed item:', removedItem);
        console.log('Cart after removal:', userData.cart);
        
        saveUserData();
        renderCart();
        updateCartCount();
        showToastMessage(`${removedItem.name} removed from cart`);
    }

    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    function renderCart() {
        console.log('Rendering cart...');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartItemsContainer || !cartSummary) {
            console.error('Cart container elements not found');
            return;
        }
        
        // Clear existing content
        cartItemsContainer.innerHTML = '';
        cartSummary.innerHTML = '';
        
        if (!userData.cart || userData.cart.length === 0) {
            console.log('Cart is empty');
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
        
        console.log(`Rendering ${userData.cart.length} cart items`);

        // Render cart items
        userData.cart.forEach(item => {
            const product = productDatabase[item.id] || {};
            const weight = product.weight ? product.weight[item.quantityOption] || '' : '';
            const itemTotal = item.price * item.quantity;
            
            const cartItemHTML = `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <div>
                                <div class="cart-item-category">${item.category}</div>
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-weight">${weight}</div>
                            </div>
                            <div class="cart-item-price">₹${itemTotal}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn quantity-decrease">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn quantity-increase">+</button>
                            </div>
                            <span class="item-unit-price">₹${item.price} per unit</span>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        
        // Calculate totals
        const totals = calculateCartTotals();
        
        // Update cart summary
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span id="cart-subtotal">₹${totals.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Delivery</span>
                <span id="cart-delivery">${totals.delivery === 0 ? 'Free' : `₹${totals.delivery}`}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span id="cart-tax">₹${totals.tax.toFixed(2)}</span>
            </div>
            ${activeCoupon ? `
                <div class="summary-row coupon-applied">
                    <span>Coupon Discount (${activeCoupon.code})</span>
                    <span>-₹${totals.couponDiscount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="coupon-section" style="margin-top: 16px;">
                <div class="coupon-input" style="display: flex; align-items: center; gap: 10px;">

                    <input 
                        type="text"
                        id="coupon-code"
                        placeholder="Enter coupon code"
                        value="${activeCoupon ? activeCoupon.code : ''}"
                        style="
                            height: 48px;
                            width: 150px;
                            padding: 0 14px;
                            font-size: 15px;
                            border-radius: 8px;
                            border: 1px solid #ccc;
                        "
                    >

                    <button 
                        id="apply-coupon"
                        style="
                            height: 48px;
                            padding: 0 22px;
                            font-size: 15px;
                            font-weight: 600;
                            border-radius: 8px;
                            cursor: pointer;
                        "
                    >
                        ${activeCoupon ? 'Change' : 'Apply'}
                    </button>

                    ${activeCoupon ? `
                    <button 
                        id="remove-coupon"
                        style="
                            height: 48px;
                            padding: 0 18px;
                            font-size: 15px;
                            font-weight: 600;
                            border-radius: 8px;
                            margin-left: 8px;
                            cursor: pointer;
                        "
                    >
                        Remove
                    </button>` : ''}

                </div>

                <div id="coupon-message" class="coupon-message"></div>
            </div>

            <div class="summary-row total">
                <span>Total</span>
                <span id="cart-total">₹${totals.total.toFixed(2)}</span>
            </div>
            <button class="btn btn-checkout" id="checkout-btn">Proceed to Checkout</button>
        `;
        
        // Update items count
        const cartItemsCount = document.getElementById('cart-items-count');
        if (cartItemsCount) {
            const totalItems = userData.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
        
        console.log('Cart rendered successfully');
    }

    function calculateCartTotals() {
        if (!userData.cart || userData.cart.length === 0) {
            return {
                subtotal: 0,
                delivery: 0,
                tax: 0,
                couponDiscount: 0,
                total: 0
            };
        }
        
        const subtotal = userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal > 499 ? 0 : 50;
        const tax = subtotal * 0.05; // 5% tax
        
        let couponDiscount = 0;
        if (activeCoupon) {
            const coupon = couponDatabase[activeCoupon.code];
            if (coupon) {
                if (coupon.type === 'percentage') {
                    couponDiscount = Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount);
                } else if (coupon.type === 'fixed') {
                    couponDiscount = Math.min(coupon.discount, coupon.maxDiscount);
                } else if (coupon.type === 'shipping') {
                    couponDiscount = delivery;
                }
            }
        }
        
        const total = Math.max(0, subtotal + delivery + tax - couponDiscount);
        
        return {
            subtotal,
            delivery,
            tax,
            couponDiscount,
            total
        };
    }

    // ===== COUPON HANDLING =====
    function applyCoupon() {
        const couponCodeInput = document.getElementById('coupon-code');
        if (!couponCodeInput) return;
        
        const couponCode = couponCodeInput.value.trim().toUpperCase();
        const messageEl = document.getElementById('coupon-message');
        
        if (!couponCode) {
            showCouponMessage('Please enter a coupon code', 'error');
            return;
        }
        
        if (couponDatabase[couponCode]) {
            const coupon = couponDatabase[couponCode];
            const subtotal = userData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (subtotal >= coupon.minAmount) {
                activeCoupon = {
                    code: couponCode,
                    discount: coupon.discount,
                    type: coupon.type,
                    minAmount: coupon.minAmount,
                    maxDiscount: coupon.maxDiscount,
                    description: coupon.description
                };
                
                showCouponMessage(`Coupon "${couponCode}" applied successfully! ${coupon.description}`, 'success');
                
                // Update cart totals
                if (pages.cart && pages.cart.classList.contains('active')) {
                    renderCart();
                }
                if (pages.checkout && pages.checkout.classList.contains('active')) {
                    updateCheckoutSummary();
                }
            } else {
                showCouponMessage(`Minimum order amount ₹${coupon.minAmount} required for this coupon`, 'error');
            }
        } else {
            showCouponMessage('Invalid coupon code', 'error');
        }
    }

    function removeCoupon() {
        activeCoupon = null;
        showCouponMessage('Coupon removed', 'info');
        
        // Update cart totals
        if (pages.cart && pages.cart.classList.contains('active')) {
            renderCart();
        }
        if (pages.checkout && pages.checkout.classList.contains('active')) {
            updateCheckoutSummary();
        }
    }

    function showCouponMessage(message, type) {
        const messageEl = document.getElementById('coupon-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `coupon-message ${type}`;
            
            // Clear message after 4 seconds
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'coupon-message';
            }, 4000);
        }
    }

    // ===== WISHLIST FUNCTIONALITY =====
    function addToWishlist(productId) {
        if (!productDatabase[productId]) {
            console.error(`Product ID ${productId} not found`);
            return;
        }
        
        const product = productDatabase[productId];
        const existingItemIndex = userData.wishlist.findIndex(item => item.id === productId);
        
        if (existingItemIndex === -1) {
            // Add to wishlist
            userData.wishlist.push({
                id: productId,
                name: product.name,
                category: product.category,
                price: product.prices[1], // Default to first quantity option
                image: product.image,
                originalPrice: product.originalPrice,
                discount: product.discount,
                addedDate: new Date().toISOString()
            });
            
            saveUserData();
            showToastMessage(`${product.name} added to wishlist!`);
        } else {
            // Already in wishlist
            showToastMessage(`${product.name} is already in your wishlist`);
        }
    }

    function moveToWishlist(productId) {
        const cartItemIndex = userData.cart.findIndex(item => item.id === productId);
        if (cartItemIndex === -1) return;
        
        const cartItem = userData.cart[cartItemIndex];
        const product = productDatabase[productId];
        
        // Add to wishlist
        addToWishlist(productId);
        
        // Remove from cart
        userData.cart.splice(cartItemIndex, 1);
        
        saveUserData();
        renderCart();
        updateCartCount();
        showToastMessage(`${product.name} moved to wishlist`);
    }

    function saveForLater(productId) {
        // This would typically move the item to a "save for later" section
        // For now, we'll just show a message
        const product = productDatabase[productId];
        if (product) {
            showToastMessage(`${product.name} saved for later`);
        }
    }

    // ===== PROFILE FUNCTIONALITY =====
    function loadProfileData() {
        if (!userData.isLoggedIn) return;
        
        // Update profile info
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        
        if (profileName) profileName.textContent = userData.name;
        if (profileEmail) profileEmail.textContent = userData.email;
        
        // Populate profile form
        const fullnameInput = document.getElementById('profile-fullname');
        const phoneInput = document.getElementById('profile-phone');
        const emailInput = document.getElementById('profile-email');
        
        if (fullnameInput) fullnameInput.value = userData.name;
        if (phoneInput) phoneInput.value = userData.phone;
        if (emailInput) emailInput.value = userData.email;
        
        // Load addresses
        renderAddresses();
        
        // Load orders
        renderOrders();
        
        // Load wishlist
        renderWishlist();
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
        showToastMessage('Profile updated successfully!');
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
            modal.style.display = 'flex';
        }
    }

    function hideAddAddressModal() {
        const modal = document.getElementById('add-address-modal');
        if (modal) {
            modal.style.display = 'none';
            const form = document.getElementById('add-address-form');
            if (form) form.reset();
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
        renderAddresses();
        showToastMessage('Address saved successfully!');
    }

    function editAddress(addressId) {
        const address = userData.addresses.find(addr => addr.id === addressId);
        if (!address) return;
        
        // Fill the add address modal with existing data
        document.getElementById('address-name').value = address.name;
        document.getElementById('address-fullname').value = address.fullName || address.name;
        document.getElementById('address-phone').value = address.phone;
        document.getElementById('address-street').value = address.street;
        document.getElementById('address-city').value = address.city;
        document.getElementById('address-pincode').value = address.pincode;
        document.getElementById('address-state').value = address.state;
        document.getElementById('default-address').checked = address.default;
        
        // Show the modal
        showAddAddressModal();
        
        // Remove the old address when saving
        const form = document.getElementById('add-address-form');
        const oldSubmitHandler = form.onsubmit;
        form.onsubmit = function(e) {
            e.preventDefault();
            userData.addresses = userData.addresses.filter(addr => addr.id !== addressId);
            saveAddress();
            form.onsubmit = oldSubmitHandler;
        };
    }

    function deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            userData.addresses = userData.addresses.filter(addr => addr.id !== addressId);
            saveUserData();
            renderAddresses();
            showToastMessage('Address deleted successfully!');
        }
    }

    function setDefaultAddress(addressId) {
        userData.addresses.forEach(addr => {
            addr.default = (addr.id === addressId);
        });
        saveUserData();
        renderAddresses();
        showToastMessage('Default address updated!');
    }

    function renderAddresses() {
        const addressesContainer = document.getElementById('addresses-container');
        if (!addressesContainer) return;
        
        if (!userData.addresses || userData.addresses.length === 0) {
            addressesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>No Saved Addresses</h3>
                    <p>Add your first address to get started</p>
                </div>
            `;
            return;
        }
        
        addressesContainer.innerHTML = userData.addresses.map(address => `
            <div class="address-card ${address.default ? 'default-address' : ''}">
                <div class="address-header">
                    <h4>${address.name} ${address.default ? '<span class="default-badge">Default</span>' : ''}</h4>
                    <div class="address-actions">
                        <button class="btn-edit-address" data-address-id="${address.id}">Edit</button>
                        <button class="btn-delete-address" data-address-id="${address.id}">Delete</button>
                        ${!address.default ? `<button class="btn-set-default" data-address-id="${address.id}">Set as Default</button>` : ''}
                    </div>
                </div>
                <div class="address-details">
                    <p><strong>${address.fullName || address.name}</strong></p>
                    <p>${address.street}</p>
                    <p>${address.city}, ${address.state} - ${address.pincode}</p>
                    <p>Phone: ${address.phone}</p>
                </div>
            </div>
        `).join('');
    }

    function renderOrders() {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;
        
        if (!userData.orders || userData.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No Orders Yet</h3>
                    <p>Start shopping to see your orders here</p>
                    <a href="#" class="btn" id="start-shopping">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        ordersContainer.innerHTML = userData.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h4>Order #${order.id}</h4>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <div class="order-status ${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div>
                                <p>${item.name}</p>
                                <p>${item.weight} × ${item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `<p class="more-items">+${order.items.length - 2} more items</p>` : ''}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ₹${order.total.toFixed(2)}</div>
                    <div class="order-actions">
                        <button class="btn-view-order" data-order-id="${order.id}">View Details</button>
                        <button class="btn-track-order track-order-btn" data-order-id="${order.id}">Track Order</button>
                        ${order.status === 'delivered' ? '<button class="btn-reorder">Reorder</button>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderWishlist() {
        const wishlistContainer = document.getElementById('wishlist-container');
        if (!wishlistContainer) return;
        
        if (!userData.wishlist || userData.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Add items you love to your wishlist</p>
                    <a href="#" class="btn" id="browse-products">Browse Products</a>
                </div>
            `;
            return;
        }
        
        wishlistContainer.innerHTML = userData.wishlist.map(item => {
            const product = productDatabase[item.id];
            return `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-details">
                        <h4>${item.name}</h4>
                        <div class="wishlist-item-price">
                            <span class="current-price">₹${item.price}</span>
                            <span class="original-price">₹${item.originalPrice}</span>
                            <span class="discount">${item.discount}% off</span>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="btn-add-to-cart" data-product-id="${item.id}">Add to Cart</button>
                            <button class="btn-remove-wishlist" data-product-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===== CHECKOUT FUNCTIONS =====
    function updateCheckoutSummary() {
        const totals = calculateCartTotals();
        
        // Update all summary elements
        const summaryElements = [
            { id: 'checkout-subtotal', value: `₹${totals.subtotal}` },
            { id: 'checkout-delivery', value: totals.delivery === 0 ? 'Free' : `₹${totals.delivery}` },
            { id: 'checkout-tax', value: `₹${totals.tax.toFixed(2)}` },
            { id: 'checkout-coupon', value: activeCoupon ? `-₹${totals.couponDiscount.toFixed(2)}` : '₹0' },
            { id: 'checkout-total', value: `₹${totals.total.toFixed(2)}` },
            { id: 'confirm-total', value: `₹${totals.total.toFixed(2)}` }
        ];
        
        summaryElements.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.textContent = item.value;
            }
        });
        
        // Show/hide coupon discount row
        const couponRow = document.getElementById('checkout-coupon-row');
        if (couponRow) {
            couponRow.style.display = activeCoupon ? 'flex' : 'none';
        }
    }

    // FIX: Properly navigate between checkout steps with step indicator updates
    function navigateToStep(step) {
        console.log('Navigating to step:', step);
        
        // Before proceeding to payment step, validate address
        if (step === 'payment') {
            if (!validateCurrentAddress()) {
                showError('address-error', 'Please select or enter a valid address');
                return;
            }
        }
        
        // Hide all checkout steps
        const checkoutSteps = document.querySelectorAll('.checkout-step');
        checkoutSteps.forEach(stepElement => {
            stepElement.classList.remove('active');
        });
        
        // Show the selected step
        const currentStepElement = document.getElementById(`${step}-step`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            
            // Update step indicators
            updateStepIndicators(step);
            
            // Scroll to top of the step
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function validateCurrentAddress() {
        const selectedAddress = document.querySelector('input[name="saved-address"]:checked');
        if (!selectedAddress) {
            showError('address-error', 'Please select a delivery address');
            return false;
        }
        
        if (selectedAddress.value === 'new') {
            // Validate form inputs
            const name = document.getElementById('delivery-name').value;
            const phone = document.getElementById('delivery-phone').value;
            const address = document.getElementById('delivery-address').value;
            const city = document.getElementById('delivery-city').value;
            const pincode = document.getElementById('delivery-pincode').value;
            const state = document.getElementById('delivery-state').value;
            
            if (!name || !phone || !address || !city || !pincode || !state) {
                showError('address-error', 'Please fill all address fields');
                return false;
            }
            
            if (!validatePhone(phone.replace(/\D/g, ''))) {
                showError('address-error', 'Please enter a valid phone number');
                return false;
            }
            
            hideError('address-error');
            return true;
        } else {
            // Address from saved addresses is already valid
            hideError('address-error');
            return true;
        }
    }

    // ===== COMPLETE ORDER FUNCTION =====
    function processOrder() {
        console.log('Processing order...');
        
        // Get selected address data
        const selectedAddress = document.querySelector('input[name="saved-address"]:checked');
        let addressData;
        
        if (!selectedAddress) {
            console.error('No address selected');
            alert('Please select or enter a delivery address');
            return;
        }
        
        if (selectedAddress.value === 'new') {
            // Get data from form
            const name = document.getElementById('delivery-name').value;
            const phone = document.getElementById('delivery-phone').value;
            const address = document.getElementById('delivery-address').value;
            const city = document.getElementById('delivery-city').value;
            const pincode = document.getElementById('delivery-pincode').value;
            const state = document.getElementById('delivery-state').value;
            
            // Validate form data
            if (!name || !phone || !address || !city || !pincode || !state) {
                console.error('Incomplete address form');
                alert('Please fill all address fields');
                return;
            }
            
            addressData = {
                name: name,
                phone: phone,
                address: address,
                city: city,
                pincode: pincode,
                state: state
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
                saveUserData();
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

        // Get delivery option
        const deliveryOption = document.querySelector('input[name="delivery"]:checked');
        if (!deliveryOption) {
            console.error('No delivery option selected');
            alert('Please select a delivery option');
            return;
        }
        
        const deliveryText = {
            'standard': '2-3 business days',
            'express': 'Next day delivery'
        }[deliveryOption.value] || 'Standard Delivery';

        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            console.error('No payment method selected');
            alert('Please select a payment method');
            return;
        }
        
        const paymentText = {
            'card': 'Credit Card',
            'upi': 'UPI',
            'cod': 'Cash on Delivery'
        }[paymentMethod.value] || 'Unknown';

        // Process payment
        processPayment(paymentMethod.value);
    }

    function completeOrder() {
        console.log('Completing order...');
        
        // Get selected address data
        const selectedAddress = document.querySelector('input[name="saved-address"]:checked');
        let addressData;
        
        if (selectedAddress.value === 'new') {
            // Get data from form
            const name = document.getElementById('delivery-name').value;
            const phone = document.getElementById('delivery-phone').value;
            const address = document.getElementById('delivery-address').value;
            const city = document.getElementById('delivery-city').value;
            const pincode = document.getElementById('delivery-pincode').value;
            const state = document.getElementById('delivery-state').value;
            
            addressData = {
                name: name,
                phone: phone,
                address: address,
                city: city,
                pincode: pincode,
                state: state
            };
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

        // Get delivery option
        const deliveryOption = document.querySelector('input[name="delivery"]:checked');
        const deliveryText = {
            'standard': '2-3 business days',
            'express': 'Next day delivery'
        }[deliveryOption.value] || 'Standard Delivery';

        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        const paymentText = {
            'card': 'Credit Card',
            'upi': 'UPI',
            'cod': 'Cash on Delivery'
        }[paymentMethod.value] || 'Unknown';

        // Generate order details
        const orderId = 'OM' + Date.now().toString().slice(-6);
        const orderDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const orderTime = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const totals = calculateCartTotals();
        
        // Create order record
        const orderItems = userData.cart.map(cartItem => ({
            id: cartItem.id,
            name: cartItem.name,
            quantity: cartItem.quantity,
            price: cartItem.price,
            weight: cartItem.weight,
            image: cartItem.image,
            originalPrice: cartItem.originalPrice,
            discount: cartItem.discount,
            category: cartItem.category
        }));
        
        const order = {
            id: orderId,
            date: orderDate,
            time: orderTime,
            items: orderItems,
            total: totals.total,
            subtotal: totals.subtotal,
            delivery: totals.delivery,
            tax: totals.tax,
            couponDiscount: totals.couponDiscount,
            status: 'confirmed',
            address: addressData,
            payment: paymentText,
            deliveryOption: deliveryText,
            couponUsed: activeCoupon ? activeCoupon.code : null
        };
        
        console.log('Order created:', order);
        console.log('Order items:', orderItems);
        
        // Initialize orders array if it doesn't exist
        if (!userData.orders) {
            userData.orders = [];
        }
        
        // Add order to user data
        userData.orders.push(order);
        
        // Clear cart and active coupon
        userData.cart = [];
        activeCoupon = null;
        saveUserData();
        updateCartCount();
        
        // Update confirmation details in the UI
        const orderIdElement = document.querySelector('.order-id');
        if (orderIdElement) {
            orderIdElement.textContent = `Order #${orderId}`;
        }
        
        const confirmAddress = document.getElementById('confirm-address');
        if (confirmAddress && addressData) {
            confirmAddress.textContent = `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`;
        }
        
        const confirmDelivery = document.getElementById('confirm-delivery');
        if (confirmDelivery) {
            confirmDelivery.textContent = deliveryText;
        }
        
        const confirmPayment = document.getElementById('confirm-payment');
        if (confirmPayment) {
            confirmPayment.textContent = paymentText;
        }
        
        const confirmItems = document.getElementById('confirm-items');
        if (confirmItems) {
            confirmItems.textContent = `${order.items.length} items`;
        }
        
        // Show success message
        showToastMessage('Order placed successfully!');
        
        console.log('Order completed successfully');
    }

    // ===== QUICK VIEW FUNCTIONALITY =====
    function showQuickView(productId) {
        const product = productDatabase[productId];
        if (!product) return;
        
        const modal = document.getElementById('quick-view-modal');
        if (!modal) return;
        
        // Populate modal with product details
        const quickViewImage = modal.querySelector('.quick-view-image');
        const quickViewTitle = modal.querySelector('.quick-view-title');
        const quickViewCategory = modal.querySelector('.quick-view-category');
        const quickViewDescription = modal.querySelector('.quick-view-description');
        const quickViewRating = modal.querySelector('.quick-view-rating');
        const quickViewReviews = modal.querySelector('.quick-view-reviews');
        
        if (quickViewImage) quickViewImage.src = product.image;
        if (quickViewImage) quickViewImage.alt = product.name;
        if (quickViewTitle) quickViewTitle.textContent = product.name;
        if (quickViewCategory) quickViewCategory.textContent = product.category;
        if (quickViewDescription) quickViewDescription.textContent = product.description || 'No description available.';
        if (quickViewRating) quickViewRating.textContent = `★ ${product.rating || '4.0'}`;
        if (quickViewReviews) quickViewReviews.textContent = `(${product.reviews || 0} reviews)`;
        
        // Set price
        const currentPrice = modal.querySelector('.quick-view-current-price');
        const originalPrice = modal.querySelector('.quick-view-original-price');
        const discount = modal.querySelector('.quick-view-discount');
        
        if (currentPrice) currentPrice.textContent = `₹${product.prices[1]}`;
        if (originalPrice) originalPrice.textContent = `₹${product.originalPrice}`;
        if (discount) discount.textContent = `${product.discount}% off`;
        
        // Set stock status
        const stockStatus = modal.querySelector('.quick-view-stock');
        if (stockStatus) {
            if (product.stock > 10) {
                stockStatus.textContent = 'In Stock';
                stockStatus.className = 'quick-view-stock in-stock';
            } else if (product.stock > 0) {
                stockStatus.textContent = `Only ${product.stock} left`;
                stockStatus.className = 'quick-view-stock low-stock';
            } else {
                stockStatus.textContent = 'Out of Stock';
                stockStatus.className = 'quick-view-stock out-of-stock';
            }
        }
        
        // Populate quantity options
        const quantitySelect = modal.querySelector('.quick-view-quantity');
        if (quantitySelect) {
            quantitySelect.innerHTML = '';
            for (const [key, weight] of Object.entries(product.weight)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${weight} - ₹${product.prices[key]}`;
                quantitySelect.appendChild(option);
            }
        }
        
        // Update add to cart button
        const addToCartBtn = modal.querySelector('.add-to-cart-quick');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-product-id', productId);
            addToCartBtn.addEventListener('click', function() {
                const selectedQuantity = parseInt(quantitySelect.value);
                addToCart(productId, selectedQuantity);
                hideQuickView();
            });
        }
        
        // Show modal
        modal.style.display = 'flex';
    }

    function hideQuickView() {
        const modal = document.getElementById('quick-view-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ===== MODAL FUNCTIONALITY =====
    function setupModalEvents() {
        // Close modal on X click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-cancel')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    // FIX: Prevent multiple event handlers
                    e.stopPropagation();
                }
            }
            
            // Close quick view modal
            if (e.target.classList.contains('quick-view-close')) {
                hideQuickView();
            }
            
            // Close modal when clicking outside - FIXED to work with one click
            if (e.target.classList.contains('modal')) {
                // Check if it's a modal that should close on outside click
                if (!e.target.classList.contains('no-close-outside')) {
                    e.target.style.display = 'none';
                }
            }
        });
        
        // Close payment modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-payment-modal')) {
                const modal = document.getElementById('payment-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
    }

    // ===== REVIEWS SECTION FUNCTIONALITY =====
    function initReviewsSection() {
        console.log('Initializing reviews section...');
        
        // DOM Elements
        const writeReviewBtn = document.getElementById('write-review-btn');
        const writeFirstReviewBtn = document.getElementById('write-first-review');
        const writeReviewSection = document.querySelector('.write-review-section');
        const reviewsListSection = document.querySelector('.reviews-list-section');
        const closeReviewBtn = document.querySelector('.btn-close-review');
        const cancelReviewBtn = document.querySelector('.cancel-review');
        const reviewForm = document.getElementById('review-form');
        const editReviewForm = document.getElementById('edit-review-form');
        const reviewContent = document.getElementById('review-content');
        const charCount = document.getElementById('char-count');
        const editReviewContent = document.getElementById('edit-review-content');
        const editCharCount = document.getElementById('edit-char-count');
        
        // Event Listeners
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', showWriteReviewForm);
        }
        
        if (writeFirstReviewBtn) {
            writeFirstReviewBtn.addEventListener('click', showWriteReviewForm);
        }
        
        if (closeReviewBtn) {
            closeReviewBtn.addEventListener('click', hideWriteReviewForm);
        }
        
        if (cancelReviewBtn) {
            cancelReviewBtn.addEventListener('click', hideWriteReviewForm);
        }
        
        if (reviewForm) {
            reviewForm.addEventListener('submit', handleReviewSubmit);
        }
        
        if (reviewContent) {
            reviewContent.addEventListener('input', updateCharCount);
        }
        
        if (editReviewContent) {
            editReviewContent.addEventListener('input', updateEditCharCount);
        }
        
        if (editReviewForm) {
            editReviewForm.addEventListener('submit', handleEditReviewSubmit);
        }
        
        // Initialize character counters
        updateCharCount();
        updateEditCharCount();
        
        // Add event listeners to existing review actions
        setupReviewActionListeners();
        
        // Initialize reviews
        renderReviews();
        updateReviewStats();
    }

    function showWriteReviewForm() {
        const writeReviewSection = document.querySelector('.write-review-section');
        const reviewsListSection = document.querySelector('.reviews-list-section');
        
        if (!writeReviewSection || !reviewsListSection) return;
        
        writeReviewSection.style.display = 'block';
        reviewsListSection.style.display = 'none';
        
        // Reset form
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) reviewForm.reset();
        updateCharCount();
        
        // Reset star ratings
        document.querySelectorAll('.rating-stars-input input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Scroll to form
        writeReviewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function hideWriteReviewForm() {
        const writeReviewSection = document.querySelector('.write-review-section');
        const reviewsListSection = document.querySelector('.reviews-list-section');
        
        if (!writeReviewSection || !reviewsListSection) return;
        
        writeReviewSection.style.display = 'none';
        reviewsListSection.style.display = 'block';
    }
    
    function updateCharCount() {
        const reviewContent = document.getElementById('review-content');
        const charCount = document.getElementById('char-count');
        
        if (!reviewContent || !charCount) return;
        
        const count = reviewContent.value.length;
        charCount.textContent = count;
        
        // Update color based on count
        if (count < 50) {
            charCount.style.color = '#f44336';
        } else if (count >= 50 && count <= 500) {
            charCount.style.color = '#4CAF50';
        } else {
            charCount.style.color = '#f44336';
        }
    }
    
    function updateEditCharCount() {
        const editReviewContent = document.getElementById('edit-review-content');
        const editCharCount = document.getElementById('edit-char-count');
        
        if (!editReviewContent || !editCharCount) return;
        
        const count = editReviewContent.value.length;
        editCharCount.textContent = count;
        
        // Update color based on count
        if (count < 50) {
            editCharCount.style.color = '#f44336';
        } else if (count >= 50 && count <= 500) {
            editCharCount.style.color = '#4CAF50';
        } else {
            editCharCount.style.color = '#f44336';
        }
    }
    
    function handleReviewSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const productId = document.getElementById('review-product').value;
        const productSelect = document.getElementById('review-product');
        const productName = productSelect.options[productSelect.selectedIndex].text.split(' - ')[0];
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const title = document.getElementById('review-title').value;
        const content = document.getElementById('review-content').value;
        const recommend = document.getElementById('recommend-product').checked;
        
        // Validation
        if (!productId) {
            alert('Please select a product to review');
            return;
        }
        
        if (!rating) {
            alert('Please provide a rating');
            return;
        }
        
        if (content.length < 50) {
            alert('Please write at least 50 characters for your review');
            return;
        }
        
        if (content.length > 500) {
            alert('Review content cannot exceed 500 characters');
            return;
        }
        
        // Create new review object
        const newReview = {
            id: Date.now(), // Simple ID generation
            productId: productId,
            productName: productName,
            productImage: getProductImage(productId),
            rating: parseInt(rating),
            title: title,
            content: content,
            recommend: recommend,
            purchaseDate: 'Just now',
            reviewDate: 'Just now'
        };
        
        // Add to reviews array
        userReviews.unshift(newReview);
        
        // Update UI
        renderReviews();
        updateReviewStats();
        
        // Show success message
        showNotification('Review submitted successfully!', 'success');
        
        // Hide form
        hideWriteReviewForm();
        
        // Reset form
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) reviewForm.reset();
        updateCharCount();
    }
    
    function getProductImage(productId) {
        const productImages = {
            'organic-apples': 'https://via.placeholder.com/60x60/e8f5e9/2e7d32?text=🍎',
            'organic-honey': 'https://via.placeholder.com/60x60/fff3e0/f57c00?text=🍯',
            'fresh-broccoli': 'https://via.placeholder.com/60x60/e8f5e9/2e7d32?text=🥦',
            'organic-milk': 'https://via.placeholder.com/60x60/e3f2fd/2196f3?text=🥛',
            'olive-oil': 'https://via.placeholder.com/60x60/e8f5e9/2e7d32?text=🫒'
        };
        
        return productImages[productId] || 'https://via.placeholder.com/60x60/cccccc/666666?text=📦';
    }
    
    function renderReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList) return;
        
        // Remove all existing review items except empty state
        document.querySelectorAll('.review-item').forEach(item => item.remove());
        
        // Show/hide empty state
        const noReviewsState = document.getElementById('no-reviews-state');
        if (userReviews.length === 0) {
            if (noReviewsState) noReviewsState.style.display = 'block';
            return;
        } else {
            if (noReviewsState) noReviewsState.style.display = 'none';
        }
        
        // Add reviews
        userReviews.forEach(review => {
            const reviewItem = createReviewElement(review);
            reviewsList.insertBefore(reviewItem, noReviewsState);
        });
        
        // Re-attach event listeners
        setupReviewActionListeners();
    }
    
    function createReviewElement(review) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.dataset.reviewId = review.id;
        
        // Generate star HTML
        const starsHtml = generateStarsHtml(review.rating);
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="review-product">
                    <img src="${review.productImage}" alt="${review.productName}">
                    <div class="product-info">
                        <h4>${review.productName}</h4>
                        <p>Purchased on: ${review.purchaseDate}</p>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="review-date">${review.reviewDate}</span>
                </div>
            </div>
            <div class="review-content">
                <h5>${review.title}</h5>
                <p>${review.content}</p>
                <div class="review-recommend">
                    <i class="fas fa-${review.recommend ? 'check' : 'times'}-circle"></i>
                    <span>${review.recommend ? 'Recommends' : 'Doesn\'t recommend'} this product</span>
                </div>
            </div>
            <div class="review-actions">
                <button class="btn-outline btn-edit-review">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-outline btn-delete-review">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            `;
        
        return reviewItem;
    }
    
    function generateStarsHtml(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (hasHalfStar && i === fullStars + 1) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        
        return starsHtml;
    }
    
    function setupReviewActionListeners() {
        // Edit buttons
        document.querySelectorAll('.btn-edit-review').forEach(button => {
            button.addEventListener('click', handleEditReview);
        });
        
        // Delete buttons
        document.querySelectorAll('.btn-delete-review').forEach(button => {
            button.addEventListener('click', handleDeleteReview);
        });
    }
    
    function handleEditReview(event) {
        const reviewItem = event.target.closest('.review-item');
        const reviewId = parseInt(reviewItem.dataset.reviewId);
        
        // Find the review
        const review = userReviews.find(r => r.id === reviewId);
        if (!review) return;
        
        currentEditReviewId = reviewId;
        
        // Populate edit form
        const starInput = document.querySelector(`#edit-star${review.rating}`);
        if (starInput) starInput.checked = true;
        
        const editTitle = document.getElementById('edit-review-title');
        const editContent = document.getElementById('edit-review-content');
        const editRecommend = document.getElementById('edit-recommend-product');
        
        if (editTitle) editTitle.value = review.title;
        if (editContent) editContent.value = review.content;
        if (editRecommend) editRecommend.checked = review.recommend;
        
        updateEditCharCount();
        
        // Show edit modal
        showModal('edit-review-modal');
    }
    
    function handleEditReviewSubmit(event) {
        event.preventDefault();
        
        if (!currentEditReviewId) return;
        
        // Get form data
        const rating = document.querySelector('input[name="edit-rating"]:checked')?.value;
        const title = document.getElementById('edit-review-title').value;
        const content = document.getElementById('edit-review-content').value;
        const recommend = document.getElementById('edit-recommend-product').checked;
        
        // Validation
        if (!rating) {
            alert('Please provide a rating');
            return;
        }
        
        if (content.length < 50) {
            alert('Please write at least 50 characters for your review');
            return;
        }
        
        if (content.length > 500) {
            alert('Review content cannot exceed 500 characters');
            return;
        }
        
        // Find and update review
        const reviewIndex = userReviews.findIndex(r => r.id === currentEditReviewId);
        if (reviewIndex !== -1) {
            userReviews[reviewIndex] = {
                ...userReviews[reviewIndex],
                rating: parseInt(rating),
                title: title,
                content: content,
                recommend: recommend,
                reviewDate: 'Just now'
            };
            
            // Update UI
            renderReviews();
            updateReviewStats();
            
            // Show success message
            showNotification('Review updated successfully!', 'success');
            
            // Close modal
            closeModal('edit-review-modal');
            currentEditReviewId = null;
        }
    }
    
    function handleDeleteReview(event) {
        const reviewItem = event.target.closest('.review-item');
        const reviewId = parseInt(reviewItem.dataset.reviewId);
        
        // Store review ID in modal
        const deleteReviewModal = document.getElementById('delete-review-modal');
        if (deleteReviewModal) {
            deleteReviewModal.dataset.reviewId = reviewId;
            
            // Show delete confirmation modal
            showModal('delete-review-modal');
            
            // Setup modal button events
            const cancelBtn = deleteReviewModal.querySelector('.cancel-delete');
            const confirmBtn = deleteReviewModal.querySelector('.confirm-delete');
            
            // Remove previous event listeners
            const newCancelBtn = cancelBtn.cloneNode(true);
            const newConfirmBtn = confirmBtn.cloneNode(true);
            
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            // Add new event listeners
            newCancelBtn.addEventListener('click', () => closeModal('delete-review-modal'));
            newConfirmBtn.addEventListener('click', confirmDeleteReview);
        }
    }
    
    function confirmDeleteReview() {
        const deleteReviewModal = document.getElementById('delete-review-modal');
        if (!deleteReviewModal) return;
        
        const reviewId = parseInt(deleteReviewModal.dataset.reviewId);
        
        // Remove review from array
        userReviews = userReviews.filter(review => review.id !== reviewId);
        
        // Update UI
        renderReviews();
        updateReviewStats();
        
        // Show success message
        showNotification('Review deleted successfully!', 'success');
        
        // Close modal
        closeModal('delete-review-modal');
    }
    
    function updateReviewStats() {
        if (userReviews.length === 0) return;
        
        // Calculate average rating
        const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / userReviews.length;
        
        // Update average rating display
        const ratingValue = document.querySelector('.rating-value');
        if (ratingValue) ratingValue.textContent = averageRating.toFixed(1);
        
        // Update star display
        const starIcons = document.querySelectorAll('.rating-stars.large i');
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;
        
        starIcons.forEach((star, index) => {
            star.className = index < fullStars ? 'fas fa-star' :
                            hasHalfStar && index === fullStars ? 'fas fa-star-half-alt' :
                            'far fa-star';
        });
        
        // Update review count
        const ratingCount = document.querySelector('.rating-count');
        if (ratingCount) ratingCount.textContent = `Based on ${userReviews.length} reviews`;
        
        // Update rating distribution
        const starCounts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        
        userReviews.forEach(review => {
            const roundedRating = Math.round(review.rating);
            starCounts[roundedRating]++;
        });
        
        // Update distribution bars and counts
        Object.keys(starCounts).forEach(stars => {
            const count = starCounts[stars];
            const percentage = userReviews.length > 0 ? (count / userReviews.length) * 100 : 0;
            
            const statItem = document.querySelector(`.stat-item:nth-child(${6 - stars})`);
            if (statItem) {
                statItem.querySelector('.stat-fill').style.width = `${percentage}%`;
                statItem.querySelector('.stat-count').textContent = count;
            }
        });
    }
    
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modal.addEventListener('click', function outsideClickHandler(e) {
            if (e.target === modal) {
                closeModal(modalId);
                modal.removeEventListener('click', outsideClickHandler);
            }
        });
        
        // Close modal with escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // ===== FEEDBACK SYSTEM FUNCTIONALITY =====
    function setupFeedbackEvents() {
        // Marquee button click handler
        if (marqueeBtn) {
            marqueeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openFeedbackModal();
            });
        }

        // Close feedback modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeFeedbackModal);
        }

        // Close modal when clicking outside
        if (feedbackModal) {
            feedbackModal.addEventListener('click', function(e) {
                if (e.target === feedbackModal) {
                    closeFeedbackModal();
                }
            });
        }

        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && feedbackModal && feedbackModal.style.display === 'block') {
                closeFeedbackModal();
            }
        });

        // Character counter for feedback message
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = `${length}/500 characters`;
                
                // Add warning style when approaching limit
                if (length > 450) {
                    charCount.style.color = '#ff9800';
                } else if (length > 480) {
                    charCount.style.color = '#f44336';
                } else {
                    charCount.style.color = '#666';
                }
                
                // Limit to 500 characters
                if (length > 500) {
                    this.value = this.value.substring(0, 500);
                    charCount.textContent = '500/500 characters (maximum reached)';
                    charCount.style.color = '#f44336';
                }
            });
        }

        // Rating buttons functionality
        if (ratingButtons.length > 0) {
            ratingButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const rating = this.getAttribute('data-rating');
                    
                    // Remove active class from all buttons
                    ratingButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Set hidden input value
                    if (ratingInput) {
                        ratingInput.value = rating;
                    }
                    
                    // Add visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }

        // Form submission handler
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate required fields
                const message = document.getElementById('message').value.trim();
                if (!message) {
                    alert('Please enter your feedback message.');
                    document.getElementById('message').focus();
                    return;
                }
                
                // Get form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    feedbackType: feedbackType.value,
                    message: message,
                    rating: ratingInput ? ratingInput.value : '',
                    timestamp: new Date().toISOString()
                };
                
                // Disable submit button and show loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Submitting...
                    `;
                }
                
                // Simulate API call with timeout
                setTimeout(() => {
                    // In a real application, you would send this data to your server
                    console.log('Feedback submitted:', formData);
                    
                    // Show success message
                    if (feedbackSuccess) {
                        document.getElementById('feedbackFormContainer').style.display = 'none';
                        feedbackSuccess.style.display = 'block';
                    }
                    
                    // Reset button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                            Submit Feedback
                        `;
                    }
                }, 1500);
            });
        }

        // Close success message
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', function() {
                if (feedbackSuccess) {
                    feedbackSuccess.style.display = 'none';
                }
                document.getElementById('feedbackFormContainer').style.display = 'block';
                closeFeedbackModal();
                resetForm();
            });
        }
    }

    // Open feedback modal
    function openFeedbackModal() {
        if (feedbackModal) {
            feedbackModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Reset form
            resetFeedbackForm();
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = feedbackForm.querySelector('input, textarea, select');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    // Close feedback modal
    function closeFeedbackModal() {
        if (feedbackModal) {
            feedbackModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Reset feedback form function
    function resetFeedbackForm() {
        if (feedbackForm) {
            feedbackForm.reset();
            if (ratingInput) {
                ratingInput.value = '';
            }
            
            // Reset rating buttons
            ratingButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Reset character counter
            if (charCount) {
                charCount.textContent = '0/500 characters';
                charCount.style.color = '#666';
            }
            
            // Show form and hide success message
            document.getElementById('feedbackFormContainer').style.display = 'block';
            if (feedbackSuccess) {
                feedbackSuccess.style.display = 'none';
            }
        }
    }

    // ===== UTILITY FUNCTIONS =====
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    function addToastStyles() {
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                    max-width: 300px;
                    display: flex;
                    align-items: center;
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .toast-content i {
                    font-size: 20px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function addNotificationStyles() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 4px;
                    color: white;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    min-width: 300px;
                    max-width: 400px;
                }
                
                .notification-success {
                    background-color: #4CAF50;
                    border-left: 4px solid #2e7d32;
                }
                
                .notification-error {
                    background-color: #f44336;
                    border-left: 4px solid #d32f2f;
                }
                
                .notification i {
                    font-size: 20px;
                }
                
                .notification span {
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.3s;
                }
                
                .notification-close:hover {
                    background-color: rgba(255,255,255,0.1);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Add CSS fixes for scrolling and checkout steps
    function addScrollFixStyles() {
        if (!document.querySelector('#scroll-fix-styles')) {
            const style = document.createElement('style');
            style.id = 'scroll-fix-styles';
            style.textContent = `
                /* Ensure header offset for smooth scrolling */
                html {
                    scroll-padding-top: 100px;
                }
                
                /* Fix for checkout steps display */
                .checkout-steps {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: relative;
                }
                
                .checkout-steps .step {
                    display: flex !important;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    position: relative;
                    padding: 10px;
                    transition: all 0.3s ease;
                    z-index: 2;
                }
                
                .checkout-steps .step .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-weight: bold;
                    z-index: 2;
                    transition: all 0.3s ease;
                    border: 2px solid white;
                }
                
                .checkout-steps .step.active .step-number {
                    background: #4CAF50;
                    color: white;
                    transform: scale(1.1);
                }
                
                .checkout-steps .step.completed .step-number {
                    background: #4CAF50;
                    color: white;
                }
                
                .checkout-steps .step .step-label {
                    font-weight: 500;
                    color: #666;
                    transition: all 0.3s ease;
                }
                
                .checkout-steps .step.active .step-label {
                    color: #4CAF50;
                    font-weight: bold;
                }
                
                .checkout-steps .step.completed .step-label {
                    color: #4CAF50;
                }
                
                /* Progress line - HIDDEN */
                .progress-line {
                    display: none !important;
                }
                
                .progress-filled {
                    display: none !important;
                }
                
                /* Ensure checkout container is properly visible */
                .checkout-container {
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: block !important;
                }
                
                /* Fix for modal close buttons */
                .modal-close, .modal-cancel {
                    cursor: pointer;
                }
                
                .modal-close:hover, .modal-cancel:hover {
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function showToastMessage(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
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
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // ====== PERFORMANCE OPTIMIZATION ======
    // Debounce function for input events
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

    // Throttle function for scroll/resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ====== KEYBOARD SHORTCUTS ======
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            if (successModal && successModal.classList.contains('active')) {
                successModal.classList.remove('active');
            }
            if (resetSuccessModal && resetSuccessModal.classList.contains('active')) {
                resetSuccessModal.classList.remove('active');
                showLoginForm();
            }
            
            // Close any open modals
            document.querySelectorAll('.modal[style*="display: flex"], .modal[style*="display: block"]').forEach(modal => {
                modal.style.display = 'none';
            });
        }
        
        // Enter key submits forms
        if (e.key === 'Enter' && !e.target.matches('textarea, input[type="text"]')) {
            const activeForm = document.querySelector('form:not([style*="display: none"])');
            if (activeForm && activeForm.checkValidity()) {
                const submitBtn = activeForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.click();
            }
        }
    });

    // ====== ERROR BOUNDARY ======
    window.addEventListener('error', function(e) {
        console.error('Application error:', e.error);
        // You could show a user-friendly error message here
        if (e.error.message.includes('is not defined')) {
            console.log('Please check your JavaScript syntax and variable names');
        }
    });

    // Initialize real-time validation
    setupRealTimeValidation();

    // ===== INITIALIZE THE APPLICATION =====
    init();
});

// Add global modal close functionality - FIXED to work with single click
document.addEventListener('DOMContentLoaded', function() {
    // Use event delegation for modal close buttons
    document.addEventListener('click', function(e) {
        // Close modals when clicking X
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            const closeBtn = e.target.classList.contains('modal-close') ? e.target : e.target.closest('.modal-close');
            const modal = closeBtn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                e.stopPropagation();
            }
        }
        
        // Close modals when clicking cancel buttons
        if (e.target.classList.contains('modal-cancel') || e.target.closest('.modal-cancel')) {
            const cancelBtn = e.target.classList.contains('modal-cancel') ? e.target : e.target.closest('.modal-cancel');
            const modal = cancelBtn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                e.stopPropagation();
            }
        }
        
        // Close modals when clicking outside (only if not clicking on modal content)
        if (e.target.classList.contains('modal')) {
            // Check if we're clicking directly on the modal backdrop (not on modal content)
            if (e.target === e.currentTarget) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'flex' || modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
});

// ====== EXPORT FUNCTIONS FOR TESTING ======
// In a real app, you might want to export these for unit tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        switchTab,
        showResetStep,
        handleLogin,
        handleSignup
    };
}
