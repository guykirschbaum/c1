const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Topics API endpoint for attestation
app.get('/.well-known/topics', (req, res) => {
  console.log('Topics API attestation check requested');
  
  // Return proper Topics API attestation response
  res.json({
    version: "1.0",
    topics: [
      {
        id: 1,
        taxonomy_version: "chrome.1:1:10",
        model_version: "1",
        name: "Arts & Entertainment"
      },
      {
        id: 2,
        taxonomy_version: "chrome.1:1:10", 
        model_version: "1",
        name: "Autos & Vehicles"
      },
      {
        id: 3,
        taxonomy_version: "chrome.1:1:10",
        model_version: "1", 
        name: "Beauty & Fitness"
      }
    ]
  });
});

// Topics API endpoint for getting current topics
app.get('/topics', (req, res) => {
  console.log('Topics API request received');
  
  // Return current topics for the user
  res.json({
    version: "1.0",
    topics: [
      {
        id: 1,
        taxonomy_version: "chrome.1:1:10",
        model_version: "1",
        name: "Arts & Entertainment"
      }
    ]
  });
});

// Dynamic Ad Generation API - POST request with context string
app.post('/api/load-ad', (req, res) => {
  console.log('[/api/load-ad] endpoint called with body:', req.body);
  
  try {
    const { context, adType = 'banner', width = 728, height = 90 } = req.body;
    
    if (!context) {
      return res.status(400).json({
        success: false,
        error: 'context parameter is required'
      });
    }

              // Generate native ad based on context
          const nativeAd = generateNativeAd(context, adType, width, height);

          console.log('Loaded native ad for context:', context);
          
          res.json({
            success: true,
            timestamp: new Date().toISOString(),
            context: context,
            adType: adType,
            dimensions: { width, height },
            nativeAd: nativeAd
          });

  } catch (error) {
    console.error('Dynamic ad loading error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dynamic ad',
      details: error.message
    });
  }
});

      // Helper function to generate native ads based on context
      function generateNativeAd(context, adType, width, height) {
        const contextLower = context.toLowerCase();
        
        // Define native ad content based on context
        const nativeContent = generateNativeContent(context);
        
        // Generate icon path based on context
        const iconPath = generateIconPath(context);
        
        // Generate media assets
        const mediaAssets = generateMediaAssets(context, width, height);
        
        return {
          // Core native ad fields
          title: nativeContent.title,
          description: nativeContent.description,
          callToAction: nativeContent.cta,
          sponsoredBy: nativeContent.sponsoredBy,
          
          // Visual assets
          icon: {
            url: iconPath,
            width: 64,
            height: 64,
            alt: nativeContent.iconAlt
          },
          
          // Media assets
          media: mediaAssets,
          
          // Brand information
          brand: {
            name: nativeContent.brandName,
            logo: {
              url: nativeContent.brandLogo,
              width: 120,
              height: 40
            }
          },
          
          // Rating and reviews
          rating: nativeContent.rating,
          reviewCount: nativeContent.reviewCount,
          
          // Pricing information
          price: nativeContent.price,
          originalPrice: nativeContent.originalPrice,
          currency: nativeContent.currency,
          
          // Additional metadata
          category: nativeContent.category,
          tags: nativeContent.tags,
          
          // Dimensions and styling
          dimensions: { width, height },
          colorScheme: nativeContent.colorScheme,
          
          // Tracking and analytics
          tracking: {
            impressionUrl: `https://api.example.com/track/impression/${nativeContent.adId}`,
            clickUrl: `https://api.example.com/track/click/${nativeContent.adId}`,
            adId: nativeContent.adId
          },
          
          // Timestamp and context
          metadata: {
            generatedAt: new Date().toISOString(),
            context: context,
            adType: adType,
            version: "1.0"
          }
        };
      }

      // Helper function to generate native ad content based on context
      function generateNativeContent(context) {
        const contextLower = context.toLowerCase();
        
        // Native ad content templates based on context
        const templates = {
          technology: {
            title: "🚀 TechInnovate Pro",
            description: "Revolutionary AI-powered solutions for modern businesses. Boost productivity by 300% with our cutting-edge platform.",
            cta: "Start Free Trial",
            sponsoredBy: "TechInnovate Inc.",
            brandName: "TechInnovate",
            brandLogo: "https://via.placeholder.com/120x40/2196F3/FFFFFF?text=TechInnovate",
            iconAlt: "Tech Innovation Icon",
            rating: 4.8,
            reviewCount: 1247,
            price: "$29.99",
            originalPrice: "$49.99",
            currency: "USD",
            category: "Technology",
            tags: ["AI", "Productivity", "Innovation"],
            colorScheme: { primary: '#2196F3', secondary: '#1976D2', accent: '#64B5F6' },
            adId: "tech_001"
          },
          finance: {
            title: "💰 WealthBuilder Plus",
            description: "Smart investment strategies that grow your wealth. Expert financial planning with 15% average returns.",
            cta: "Get Started",
            sponsoredBy: "WealthBuilder Financial",
            brandName: "WealthBuilder",
            brandLogo: "https://via.placeholder.com/120x40/4CAF50/FFFFFF?text=WealthBuilder",
            iconAlt: "Finance Investment Icon",
            rating: 4.6,
            reviewCount: 892,
            price: "$99.99",
            originalPrice: "$199.99",
            currency: "USD",
            category: "Finance",
            tags: ["Investment", "Wealth", "Financial Planning"],
            colorScheme: { primary: '#4CAF50', secondary: '#388E3C', accent: '#81C784' },
            adId: "finance_001"
          },
          health: {
            title: "🏥 HealthVital Wellness",
            description: "Comprehensive health monitoring and wellness programs. Track your fitness goals with advanced analytics.",
            cta: "Join Now",
            sponsoredBy: "HealthVital Systems",
            brandName: "HealthVital",
            brandLogo: "https://via.placeholder.com/120x40/F44336/FFFFFF?text=HealthVital",
            iconAlt: "Health Wellness Icon",
            rating: 4.9,
            reviewCount: 2156,
            price: "$19.99",
            originalPrice: "$39.99",
            currency: "USD",
            category: "Health & Wellness",
            tags: ["Fitness", "Wellness", "Health Monitoring"],
            colorScheme: { primary: '#F44336', secondary: '#D32F2F', accent: '#E57373' },
            adId: "health_001"
          },
          entertainment: {
            title: "🎬 StreamMax Entertainment",
            description: "Unlimited access to thousands of movies, TV shows, and exclusive content. Watch anywhere, anytime.",
            cta: "Start Watching",
            sponsoredBy: "StreamMax Entertainment",
            brandName: "StreamMax",
            brandLogo: "https://via.placeholder.com/120x40/9C27B0/FFFFFF?text=StreamMax",
            iconAlt: "Entertainment Icon",
            rating: 4.7,
            reviewCount: 3421,
            price: "$12.99",
            originalPrice: "$15.99",
            currency: "USD",
            category: "Entertainment",
            tags: ["Streaming", "Movies", "TV Shows"],
            colorScheme: { primary: '#9C27B0', secondary: '#7B1FA2', accent: '#BA68C8' },
            adId: "entertainment_001"
          },
          sports: {
            title: "⚽ SportZone Pro",
            description: "Live sports coverage, exclusive content, and real-time statistics. Never miss a game again.",
            cta: "Watch Live",
            sponsoredBy: "SportZone Network",
            brandName: "SportZone",
            brandLogo: "https://via.placeholder.com/120x40/FF9800/FFFFFF?text=SportZone",
            iconAlt: "Sports Icon",
            rating: 4.5,
            reviewCount: 1567,
            price: "$24.99",
            originalPrice: "$34.99",
            currency: "USD",
            category: "Sports",
            tags: ["Live Sports", "Statistics", "Exclusive Content"],
            colorScheme: { primary: '#FF9800', secondary: '#F57C00', accent: '#FFB74D' },
            adId: "sports_001"
          },
          fashion: {
            title: "👗 StyleTrend Fashion",
            description: "Latest fashion trends and exclusive designer collections. Shop the hottest styles with premium quality.",
            cta: "Shop Now",
            sponsoredBy: "StyleTrend Fashion",
            brandName: "StyleTrend",
            brandLogo: "https://via.placeholder.com/120x40/E91E63/FFFFFF?text=StyleTrend",
            iconAlt: "Fashion Icon",
            rating: 4.4,
            reviewCount: 2341,
            price: "$79.99",
            originalPrice: "$129.99",
            currency: "USD",
            category: "Fashion",
            tags: ["Designer", "Trends", "Premium Quality"],
            colorScheme: { primary: '#E91E63', secondary: '#C2185B', accent: '#F06292' },
            adId: "fashion_001"
          },
          food: {
            title: "🍕 FoodDelight Express",
            description: "Delicious meals delivered to your door in 30 minutes or less. Fresh ingredients and amazing taste.",
            cta: "Order Now",
            sponsoredBy: "FoodDelight Express",
            brandName: "FoodDelight",
            brandLogo: "https://via.placeholder.com/120x40/FF5722/FFFFFF?text=FoodDelight",
            iconAlt: "Food Delivery Icon",
            rating: 4.6,
            reviewCount: 1892,
            price: "$15.99",
            originalPrice: "$25.99",
            currency: "USD",
            category: "Food & Dining",
            tags: ["Delivery", "Fresh Food", "Quick Service"],
            colorScheme: { primary: '#FF5722', secondary: '#E64A19', accent: '#FF8A65' },
            adId: "food_001"
          },
          travel: {
            title: "✈️ TravelEscape Adventures",
            description: "Exclusive travel deals and luxury accommodations worldwide. Create unforgettable memories with our expert planning.",
            cta: "Book Now",
            sponsoredBy: "TravelEscape Adventures",
            brandName: "TravelEscape",
            brandLogo: "https://via.placeholder.com/120x40/00BCD4/FFFFFF?text=TravelEscape",
            iconAlt: "Travel Icon",
            rating: 4.8,
            reviewCount: 3124,
            price: "$299.99",
            originalPrice: "$499.99",
            currency: "USD",
            category: "Travel",
            tags: ["Luxury", "Adventures", "Exclusive Deals"],
            colorScheme: { primary: '#00BCD4', secondary: '#0097A7', accent: '#4DD0E1' },
            adId: "travel_001"
          },
          education: {
            title: "📚 LearnSmart Academy",
            description: "Comprehensive online courses from top universities. Master new skills with expert instructors and flexible learning.",
            cta: "Start Learning",
            sponsoredBy: "LearnSmart Academy",
            brandName: "LearnSmart",
            brandLogo: "https://via.placeholder.com/120x40/673AB7/FFFFFF?text=LearnSmart",
            iconAlt: "Education Icon",
            rating: 4.7,
            reviewCount: 2789,
            price: "$49.99",
            originalPrice: "$99.99",
            currency: "USD",
            category: "Education",
            tags: ["Online Learning", "Expert Instructors", "Flexible Schedule"],
            colorScheme: { primary: '#673AB7', secondary: '#512DA8', accent: '#9575CD' },
            adId: "education_001"
          },
          business: {
            title: "💼 BusinessPro Solutions",
            description: "Professional business tools and consulting services. Scale your business with our proven strategies and expert guidance.",
            cta: "Get Started",
            sponsoredBy: "BusinessPro Solutions",
            brandName: "BusinessPro",
            brandLogo: "https://via.placeholder.com/120x40/607D8B/FFFFFF?text=BusinessPro",
            iconAlt: "Business Solutions Icon",
            rating: 4.5,
            reviewCount: 945,
            price: "$199.99",
            originalPrice: "$299.99",
            currency: "USD",
            category: "Business",
            tags: ["Consulting", "Professional Tools", "Business Growth"],
            colorScheme: { primary: '#607D8B', secondary: '#455A64', accent: '#90A4AE' },
            adId: "business_001"
          }
        };
      
        // Find matching template or use default
        let template = templates.business;
        for (const [category, content] of Object.entries(templates)) {
          if (contextLower.includes(category)) {
            template = content;
            break;
          }
        }
      
        // Customize based on specific keywords
        if (contextLower.includes('sale') || contextLower.includes('discount')) {
          template.cta = "Save Now";
          template.price = template.originalPrice;
          template.originalPrice = template.price;
        }
        if (contextLower.includes('free') || contextLower.includes('trial')) {
          template.cta = "Try Free";
          template.price = "Free";
          template.originalPrice = template.price;
        }
        if (contextLower.includes('limited') || contextLower.includes('offer')) {
          template.cta = "Limited Time";
        }
      
        return template;
      }
      
      // Helper function to generate icon paths based on context
      function generateIconPath(context) {
        const contextLower = context.toLowerCase();
        
        const iconPaths = {
          technology: "https://via.placeholder.com/64x64/2196F3/FFFFFF?text=🚀",
          finance: "https://via.placeholder.com/64x64/4CAF50/FFFFFF?text=💰",
          health: "https://via.placeholder.com/64x64/F44336/FFFFFF?text=🏥",
          entertainment: "https://via.placeholder.com/64x64/9C27B0/FFFFFF?text=🎬",
          sports: "https://via.placeholder.com/64x64/FF9800/FFFFFF?text=⚽",
          fashion: "https://via.placeholder.com/64x64/E91E63/FFFFFF?text=👗",
          food: "https://via.placeholder.com/64x64/FF5722/FFFFFF?text=🍕",
          travel: "https://via.placeholder.com/64x64/00BCD4/FFFFFF?text=✈️",
          education: "https://via.placeholder.com/64x64/673AB7/FFFFFF?text=📚",
          business: "https://via.placeholder.com/64x64/607D8B/FFFFFF?text=💼"
        };
        
        for (const [category, iconPath] of Object.entries(iconPaths)) {
          if (contextLower.includes(category)) {
            return iconPath;
          }
        }
        
        return "https://via.placeholder.com/64x64/607D8B/FFFFFF?text=💼"; // default
      }
      
      // Helper function to generate media assets based on context
      function generateMediaAssets(context, width, height) {
        const contextLower = context.toLowerCase();
        
        const mediaAssets = {
          technology: {
            image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Tech+Innovation",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          finance: {
            image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Smart+Investing",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          health: {
            image: "https://via.placeholder.com/300x200/F44336/FFFFFF?text=Health+Wellness",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          entertainment: {
            image: "https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Entertainment+Hub",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "video"
          },
          sports: {
            image: "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Sports+Action",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "video"
          },
          fashion: {
            image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Style+Fashion",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          food: {
            image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Delicious+Food",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          travel: {
            image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Travel+Adventures",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          education: {
            image: "https://via.placeholder.com/300x200/673AB7/FFFFFF?text=Learn+Growth",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          },
          business: {
            image: "https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Business+Solutions",
            video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            type: "image"
          }
        };
        
        for (const [category, assets] of Object.entries(mediaAssets)) {
          if (contextLower.includes(category)) {
            return {
              type: assets.type,
              url: assets.type === 'video' ? assets.video : assets.image,
              width: Math.min(width, 300),
              height: Math.min(height, 200),
              alt: `${category} media content`
            };
          }
        }
        
        return {
          type: "image",
          url: "https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Business+Solutions",
          width: Math.min(width, 300),
          height: Math.min(height, 200),
          alt: "Business media content"
        };
      }

// Init API endpoint - GET request with user context parameter
app.get('/api/init', (req, res) => {
  console.log('[/api/init] endpoint called with query params:', req.query);
  
  try {
    const { userContext, userId, sessionId, deviceType, location } = req.query;
    
    if (!userContext) {
      return res.status(400).json({
        success: false,
        error: 'userContext parameter is required'
      });
    }

    const config = {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      userInfo: {
        userId: userId || 'anonymous',
        sessionId: sessionId || Date.now().toString(),
        deviceType: deviceType || 'desktop',
        location: location || 'unknown'
      },
      userContext: userContext,
      features: {
        ads: true,
        analytics: true,
        personalization: true,
        notifications: false,
        topicsApi: true
      },
      api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
        timeout: 30000,
        retries: 3
      },
      adServer: {
        enabled: true,
        endpoint: '/api/ads',
        timeout: 5000,
        fallback: true
      },
      openai: {
        enabled: !!process.env.OPENAI_API_KEY,
        endpoint: '/api/openai',
        maxTokens: 150,
        temperature: 0.7
      },
      topicsApi: {
        enabled: true,
        endpoint: '/topics',
        attestationEndpoint: '/.well-known/topics',
        version: '1.0'
      },
      customizations: {
        theme: userContext === 'premium' ? 'dark' : 'light',
        layout: userContext === 'mobile' ? 'mobile' : 'desktop'
      }
    };

    console.log('Returning configuration for user context:', userContext);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      userContext: userContext,
      configuration: config
    });

  } catch (error) {
    console.error('Init API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate configuration',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Init API endpoint is ready!');
  console.log('Topics API endpoints are ready!');
  console.log('Dynamic Ad Loading API is ready!');
});
