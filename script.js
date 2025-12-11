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
    let otpTimer;

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

    // Track UPI payment state
    let upiPaymentInProgress = false;

    // Track delivery details
    const deliveryTracking = {
        // Mock delivery data for products
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
                { status: 'Order Placed', description: 'Your order has been confirmed', time: '10:30 AM' },
                { status: 'Processing', description: 'Preparing your items for dispatch', time: '11:15 AM' },
                { status: 'Packed', description: 'All items are packed and ready', time: '2:45 PM' },
                { status: 'Dispatched', description: 'Order is on its way to you', time: '4:20 PM' },
                { status: 'Out for Delivery', description: 'Delivery agent is on the way', time: '5:30 PM' },
                { status: 'Delivered', description: 'Order has been delivered', time: '7:15 PM' }
            ];
            return statuses;
        }
    };

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
        
        console.log('Initialization complete');
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
                break;
            case 'profile':
                loadProfileData();
                initializeProfileEvents();
                break;
            case 'cart':
                renderCart();
                setupCartEventListeners();
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
                    const discountA = parseInt(a.querySelector('.discount').textContent.replace('% off', ''));
                    const discountB = parseInt(b.querySelector('.discount').textContent.replace('% off', ''));
                    return discountB - discountA;
                });
                break;
        }
        
        // Re-append sorted cards
        productCards.forEach(card => {
            productsContainer.appendChild(card);
        });
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
        // Since the discount is already applied, we need to calculate what the original price would be
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
        
        // Set phone tab as default
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const phoneTabBtn = document.querySelector('.tab-btn[data-tab="phone"]');
        const phoneTab = document.getElementById('phone-tab');
        if (phoneTabBtn) phoneTabBtn.classList.add('active');
        if (phoneTab) phoneTab.classList.add('active');
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
                    const loginBtn = document.getElementById('login-btn');
                    if (loginBtn) loginBtn.style.display = 'block';
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
                if (orderId) {
                    showOrderTracking(orderId);
                } else if (userData.orders.length > 0) {
                    showOrderTracking(userData.orders[userData.orders.length - 1].id);
                }
            }
        });
    }

    // ===== CART FUNCTIONALITY =====
    function setupCartEventListeners() {
        // Delegate events for cart items - using event delegation
        document.addEventListener('click', function(e) {
            console.log('Cart event triggered on:', e.target.className);
            
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
            
            // Remove item - FIXED: Check if the clicked element has the class
            if (e.target.classList.contains('remove-item')) {
                console.log('Remove item button clicked');
                const cartItem = e.target.closest('.cart-item');
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
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (userData.cart.length > 0) {
                    showPage('checkout');
                }
            });
        }
    }

    // ===== CHECKOUT FUNCTIONALITY =====
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
    }

    function setupCheckoutSteps() {
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
                if (userData.orders.length > 0) {
                    showOrderTracking(userData.orders[userData.orders.length - 1].id);
                } else {
                    alert('No orders found!');
                }
            });
        }
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
        
        const selectedOption = document.querySelector(`.delivery-option input[value="${option}"]`).closest('.delivery-option');
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update delivery cost in summary
        updateCheckoutSummary();
    }

    // ===== PAYMENT METHODS - FIXED UPI SELECTION =====
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
                
                // Reset UPI payment state
                if (this.value === 'upi') {
                    upiPaymentInProgress = false;
                }
            });
        });

        // Handle UPI app selection - FIXED VERSION with real images
        document.addEventListener('click', function(e) {
            // Check if click is on UPI app container or its children
            const upiApp = e.target.closest('.upi-app');
            if (upiApp) {
                console.log('UPI app clicked:', upiApp.dataset.app);
                
                // Remove selected class from all UPI apps
                document.querySelectorAll('.upi-app').forEach(app => {
                    app.classList.remove('selected');
                });
                
                // Add selected class to clicked app
                upiApp.classList.add('selected');
                
                // Set the radio button as checked
                const radio = upiApp.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    console.log('UPI radio checked:', radio.value);
                    
                    // Also make sure UPI is selected as payment method
                    const upiRadio = document.querySelector('input[name="payment"][value="upi"]');
                    if (upiRadio) {
                        upiRadio.checked = true;
                        upiRadio.dispatchEvent(new Event('change'));
                    }
                }
            }
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
            
            // UPI payment submit - FIXED: Prevent multiple submissions
            if (e.target.id === 'upi-pay-btn') {
                e.preventDefault();
                
                // Check if UPI payment is already in progress
                if (upiPaymentInProgress) {
                    console.log('UPI payment already in progress');
                    return;
                }
                
                const selectedUPI = document.querySelector('input[name="upi-app"]:checked');
                if (!selectedUPI) {
                    alert('Please select a UPI app');
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
            
            // "Place Order" button in payment step
            if (e.target.classList.contains('btn-next') && e.target.getAttribute('data-next') === 'confirmation') {
                const activePayment = document.querySelector('input[name="payment"]:checked');
                if (!activePayment) {
                    e.preventDefault();
                    alert('Please select a payment method');
                    return;
                }
                
                if (activePayment.value === 'upi') {
                    const selectedUPI = document.querySelector('input[name="upi-app"]:checked');
                    if (!selectedUPI) {
                        e.preventDefault();
                        alert('Please select a UPI app');
                        return;
                    }
                    
                    // Check if UPI payment is already in progress
                    if (upiPaymentInProgress) {
                        e.preventDefault();
                        alert('Payment is already being processed');
                        return;
                    }
                }
                
                if (activePayment.value === 'card') {
                    if (!validateCardForm(document.getElementById('card-form'))) {
                        e.preventDefault();
                        return;
                    }
                }
                
                // If all validations pass, process payment before proceeding
                e.preventDefault();
                
                // Set flag for UPI payments
                if (activePayment.value === 'upi') {
                    upiPaymentInProgress = true;
                }
                
                processPayment(activePayment.value);
            }
        });
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

    function getSelectedUPIApp() {
        const selectedRadio = document.querySelector('input[name="upi-app"]:checked');
        if (!selectedRadio) {
            return 'Any UPI App';
        }
        
        const app = selectedRadio.value;
        const appNames = {
            'gpay': 'Google Pay',
            'phonepe': 'PhonePe',
            'paytm': 'Paytm',
            'bhim': 'BHIM',
            'amazonpay': 'Amazon Pay',
            'any': 'Any UPI App'
        };
        
        return appNames[app] || 'UPI App';
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
        const selectedUPIApp = document.getElementById('selected-upi-app');
        
        // Get amount
        const totalAmount = document.getElementById('checkout-total').textContent;
        paymentAmount.textContent = totalAmount;
        
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
                message: 'Please complete the payment in your UPI app...',
                success: 'UPI payment completed successfully!',
                method: 'UPI - ' + getSelectedUPIApp()
            },
            'cod': {
                status: 'Confirming COD Order',
                message: 'Processing your COD request...',
                success: 'COD order confirmed successfully!',
                method: 'Cash on Delivery'
            }
        };
        
        const messages = paymentMessages[paymentType] || paymentMessages.upi;
        
        statusTitle.textContent = messages.status;
        statusMessage.textContent = messages.message;
        successMessage.textContent = messages.success;
        paymentMethod.textContent = messages.method;
        
        // For UPI, get selected app
        if (paymentType === 'upi') {
            selectedUPIApp.textContent = getSelectedUPIApp();
        }
        
        // Generate random transaction ID
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
        document.getElementById('transaction-id').textContent = transactionId;
        
        // Simulate payment processing
        setTimeout(() => {
            const isSuccess = Math.random() > 0.15;
            
            if (isSuccess) {
                loader.style.display = 'none';
                success.style.display = 'block';
                
                // Reset UPI payment flag on success
                if (paymentType === 'upi') {
                    upiPaymentInProgress = false;
                }
                
                setTimeout(() => {
                    closePaymentModal();
                    // Navigate to confirmation step
                    const nextBtn = document.querySelector('.btn-next[data-next="confirmation"]');
                    if (nextBtn) nextBtn.click();
                }, 2000);
            } else {
                loader.style.display = 'none';
                failed.style.display = 'block';
                
                const errorMessages = {
                    'card': 'Payment was declined by your bank.',
                    'upi': 'UPI transaction failed. Please try again.',
                    'cod': 'COD not available for this address.'
                };
                
                document.getElementById('payment-error-message').textContent = 
                    errorMessages[paymentType] || 'Payment failed. Please try again.';
                
                // Reset UPI payment flag on failure
                if (paymentType === 'upi') {
                    upiPaymentInProgress = false;
                }
                    
                // Allow retry
                document.getElementById('retry-payment').onclick = function() {
                    closePaymentModal();
                };
            }
        }, 3000); // Increased to 3 seconds for more realistic simulation
    }

    function closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        modal.style.display = 'none';
    }

    // ===== ORDER TRACKING FUNCTIONALITY =====
    function showOrderTracking(orderId = null) {
        // If no order ID provided, get the latest order
        if (!orderId && userData.orders.length > 0) {
            orderId = userData.orders[userData.orders.length - 1].id;
        }
        
        // Find the order
        const order = userData.orders.find(o => o.id === orderId);
        if (!order) {
            alert('Order not found! Please place an order first.');
            return;
        }
        
        // Generate delivery details based on order
        const deliveryDetails = generateDeliveryDetails(order);
        
        // Create tracking modal
        const modalHtml = `
            <div class="modal" id="tracking-modal" style="display: flex;">
                <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
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
                            
                            <div class="delivery-details" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                                <h4 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-truck"></i> Delivery Details
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
                            
                            <div class="delivery-status" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                                <h4 style="color: #2e7d32; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                                    <i class="fas fa-map-marker-alt"></i> Delivery Status
                                </h4>
                                <div class="status-timeline" style="position: relative; padding-left: 30px;">
                                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #e0e0e0;"></div>
                                    ${deliveryDetails.statuses.map((status, index) => `
                                        <div class="status-step ${index <= deliveryDetails.currentStep ? 'completed' : ''}" style="position: relative; margin-bottom: 25px; padding-left: 20px;">
                                            <div class="step-icon" style="position: absolute; left: -34px; top: 0; width: 30px; height: 30px; border-radius: 50%; background: ${index <= deliveryDetails.currentStep ? '#4caf50' : '#e0e0e0'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
                                                <i class="fas ${getStatusIcon(status.status)}"></i>
                                            </div>
                                            <div class="step-content">
                                                <h5 style="margin: 0 0 5px 0; color: ${index <= deliveryDetails.currentStep ? '#2e7d32' : '#666'};">
                                                    ${status.status}
                                                    ${index === deliveryDetails.currentStep ? 
                                                        `<span class="current-status" style="background: #ff9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">Current</span>` : ''}
                                                </h5>
                                                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${status.description}</p>
                                                <small style="color: #999; font-size: 12px;">${status.time}</small>
                                            </div>
                                        </div>
                                    `).join('')}
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
        let currentStep = 0;
        if (order.status === 'confirmed') currentStep = 0;
        else if (order.status === 'processing') currentStep = 1;
        else if (order.status === 'packed') currentStep = 2;
        else if (order.status === 'dispatched') currentStep = 3;
        else if (order.status === 'out_for_delivery') currentStep = 4;
        else if (order.status === 'delivered') currentStep = 5;
        
        // For demo, randomly set step between 0-5
        if (userData.orders.length > 0) {
            currentStep = Math.min(5, Math.floor(Math.random() * 6));
        }
        
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

    function getStatusIcon(status) {
        const icons = {
            'Order Placed': 'fa-shopping-bag',
            'Processing': 'fa-cogs',
            'Packed': 'fa-box',
            'Dispatched': 'fa-shipping-fast',
            'Out for Delivery': 'fa-truck',
            'Delivered': 'fa-check-circle'
        };
        return icons[status] || 'fa-circle';
    }

    // ===== COUPON FUNCTIONALITY =====
    function setupCouponEvents() {
        const applyCouponBtn = document.getElementById('apply-coupon');
        const couponCodeInput = document.getElementById('coupon-code');
        const removeCouponBtn = document.getElementById('remove-coupon');
        
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function() {
                applyCoupon();
            });
        }
        
        if (couponCodeInput) {
            couponCodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCoupon();
                }
            });
        }
        
        if (removeCouponBtn) {
            removeCouponBtn.addEventListener('click', function() {
                removeCoupon();
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
                showToastMessage('Login successful!');
                
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
            showToastMessage('Account created successfully!');
            
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
        showToastMessage(`Logged in with ${provider}!`);
    }

    // ===== LOGOUT HANDLING =====
    function handleLogout() {
        userData.isLoggedIn = false;
        saveUserData();
        showPage('login');
        showToastMessage('Logged out successfully!');
    }

    // ===== CART FUNCTIONALITY =====
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
        if (pages.cart.classList.contains('active')) {
            renderCart();
        }
    }

    function updateCartQuantity(productId, change) {
        const itemIndex = userData.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        
        const item = userData.cart[itemIndex];
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveUserData();
            renderCart();
            updateCartCount();
        }
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
                <div class="coupon-section" style="display: none;">
                    <div class="coupon-input">
                        <input type="text" id="coupon-code" placeholder="Enter coupon code">
                        <button id="apply-coupon">Apply</button>
                    </div>
                    <div id="coupon-message" class="coupon-message"></div>
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
        cartItemsContainer.innerHTML = userData.cart.map(item => {
            const product = productDatabase[item.id] || {};
            const weight = product.weight ? product.weight[item.quantityOption] || '' : '';
            
            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <div>
                                <div class="cart-item-category">${item.category}</div>
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-weight">${weight}</div>
                            </div>
                            <div class="cart-item-price">₹${item.price * item.quantity}</div>
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
        }).join('');
        
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
            <div class="coupon-section">
                <div class="coupon-input">
                    <input type="text" id="coupon-code" placeholder="Enter coupon code" value="${activeCoupon ? activeCoupon.code : ''}">
                    <button id="apply-coupon">${activeCoupon ? 'Change' : 'Apply'}</button>
                    ${activeCoupon ? '<button id="remove-coupon" style="margin-left: 10px;">Remove</button>' : ''}
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
        
        // Re-attach event listeners
        const newCheckoutBtn = document.getElementById('checkout-btn');
        if (newCheckoutBtn) {
            newCheckoutBtn.addEventListener('click', function() {
                if (userData.cart.length > 0) {
                    showPage('checkout');
                }
            });
        }
        
        // Re-attach coupon events
        setupCouponEvents();
    }

    function calculateCartTotals() {
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
        
        const total = subtotal + delivery + tax - couponDiscount;
        
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
        const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
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
                if (pages.cart.classList.contains('active')) {
                    renderCart();
                }
                if (pages.checkout.classList.contains('active')) {
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
        if (pages.cart.classList.contains('active')) {
            renderCart();
        }
        if (pages.checkout.classList.contains('active')) {
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
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-email').textContent = userData.email;
        
        // Populate profile form
        document.getElementById('profile-fullname').value = userData.name;
        document.getElementById('profile-phone').value = userData.phone;
        document.getElementById('profile-email').value = userData.email;
        
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
        
        if (userData.addresses.length === 0) {
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
        
        if (userData.orders.length === 0) {
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
        
        if (userData.wishlist.length === 0) {
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
        const orderDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const orderTime = new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
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
        
        const totals = calculateCartTotals();
        
        // Create order record
        const order = {
            id: orderId,
            date: orderDate,
            time: orderTime,
            items: [...userData.cart],
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
        
        userData.orders.push(order);
        
        // Clear cart and active coupon
        userData.cart = [];
        activeCoupon = null;
        saveUserData();
        updateCartCount();
        
        // Update confirmation details
        document.querySelector('.order-id').textContent = `Order #${orderId}`;
        
        if (addressData) {
            document.getElementById('confirm-address').textContent = 
                `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`;
        }
        document.getElementById('confirm-delivery').textContent = deliveryText;
        document.getElementById('confirm-payment').textContent = paymentText;
        document.getElementById('confirm-items').textContent = `${order.items.length} items`;
        
        // Show success message
        showToastMessage('Order placed successfully!');
    }

    // ===== QUICK VIEW FUNCTIONALITY =====
    function showQuickView(productId) {
        const product = productDatabase[productId];
        if (!product) return;
        
        const modal = document.getElementById('quick-view-modal');
        if (!modal) return;
        
        // Populate modal with product details
        modal.querySelector('.quick-view-image').src = product.image;
        modal.querySelector('.quick-view-image').alt = product.name;
        modal.querySelector('.quick-view-title').textContent = product.name;
        modal.querySelector('.quick-view-category').textContent = product.category;
        modal.querySelector('.quick-view-description').textContent = product.description || 'No description available.';
        modal.querySelector('.quick-view-rating').textContent = `★ ${product.rating || '4.0'}`;
        modal.querySelector('.quick-view-reviews').textContent = `(${product.reviews || 0} reviews)`;
        
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
                e.target.closest('.modal').style.display = 'none';
            }
            
            // Close quick view modal
            if (e.target.classList.contains('quick-view-close')) {
                hideQuickView();
            }
            
            // Close modal when clicking outside
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Close payment modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-payment-modal')) {
                document.getElementById('payment-modal').style.display = 'none';
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
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

    // ===== INITIALIZE THE APPLICATION =====
    init();
});
