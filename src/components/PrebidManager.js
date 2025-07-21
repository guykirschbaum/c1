class PrebidManager {
  static instance = null;
  static isInitialized = false;

  static init(callback) {
    if (this.isInitialized) {
      console.log('PrebidManager already initialized');
      callback();
      return;
    }

    console.log('PrebidManager.init() called');
    
    // Wait for Prebid to be available with timeout
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkPrebid = () => {
      attempts++;
      console.log(`Prebid check attempt ${attempts}/${maxAttempts}, pbjs available:`, typeof window.pbjs !== 'undefined');
      
      if (window.pbjs && window.pbjs.que) {
        console.log('Prebid.js found, setting up...');
        this.setupPrebid(callback);
      } else if (attempts >= maxAttempts) {
        console.warn('Prebid.js failed to load, using fallback mode');
        this.setupFallbackMode(callback);
      } else {
        setTimeout(checkPrebid, 100);
      }
    };

    checkPrebid();
  }

  static setupPrebid(callback) {
    console.log('Setting up Prebid.js...');
    
    try {
      window.pbjs.que.push(() => {
        // Configure Prebid
        window.pbjs.setConfig({
          debug: true, // Enable debug mode for testing
          bidderTimeout: 3000,
          enableSendAllBids: true,
          userSync: {
            syncEnabled: true,
            pixelEnabled: true,
            syncsPerBidder: 5,
            syncDelay: 3000
          }
        });

        // Define ad units with test bidders
        const adUnits = [
          {
            code: 'top-banner',
            mediaTypes: {
              banner: {
                sizes: [[728, 90], [970, 90], [970, 250], [320, 50], [468, 60]]
              }
            },
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: 13144370 // Test placement ID
                }
              },
              {
                bidder: 'rubicon',
                params: {
                  accountId: 14062,
                  siteId: 70608,
                  zoneId: 335918
                }
              }
            ]
          },
          {
            code: 'bottom-banner',
            mediaTypes: {
              banner: {
                sizes: [[728, 90], [970, 90], [970, 250], [320, 50], [468, 60]]
              }
            },
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: 13144370 // Test placement ID
                }
              },
              {
                bidder: 'rubicon',
                params: {
                  accountId: 14062,
                  siteId: 70608,
                  zoneId: 335918
                }
              }
            ]
          },
          {
            code: 'div-gpt-ad-1234567890-0',
            mediaTypes: {
              banner: {
                sizes: [[300, 250], [320, 50]]
              }
            },
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: 13144370 // Test placement ID
                }
              },
              {
                bidder: 'rubicon',
                params: {
                  accountId: 14062,
                  siteId: 70608,
                  zoneId: 335918
                }
              }
            ]
          },
          {
            code: 'div-gpt-ad-1234567890-1',
            mediaTypes: {
              banner: {
                sizes: [[728, 90], [320, 50]]
              }
            },
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: 13144370 // Test placement ID
                }
              },
              {
                bidder: 'rubicon',
                params: {
                  accountId: 14062,
                  siteId: 70608,
                  zoneId: 335918
                }
              }
            ]
          }
        ];

        // Add ad units to Prebid
        console.log('Adding ad units to Prebid...');
        window.pbjs.addAdUnits(adUnits);

        // Set up Google Publisher Tag (GPT) integration
        this.setupGPT();

        console.log('Prebid.js setup completed successfully');
        this.isInitialized = true;
        if (callback) {
          console.log('Calling PrebidManager init callback');
          callback();
        }
      });
    } catch (error) {
      console.error('Error setting up Prebid.js:', error);
      console.log('Falling back to fallback mode due to setup error');
      this.setupFallbackMode(callback);
    }
  }

  static setupGPT() {
    // Mock GPT setup for demo purposes
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    
    // For a real implementation, you would load GPT:
    // const gptScript = document.createElement('script');
    // gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    // document.head.appendChild(gptScript);
  }

  static setupFallbackMode(callback) {
    console.log('Setting up Prebid fallback mode...');
    // Create a mock Prebid.js object for fallback mode
    window.pbjs = {
      que: [],
      setConfig: () => {},
      addAdUnits: () => {},
      requestBids: () => {},
      getHighestCpmBids: () => [],
      renderAd: () => {}
    };
    
    console.log('Prebid fallback mode initialized');
    this.isInitialized = true;
    if (callback) {
      console.log('Calling PrebidManager init callback');
      callback();
    }
  }

  static requestBids(adUnitCode, callback) {
    if (!window.pbjs) {
      console.error('Prebid not available');
      if (callback) callback(null);
      return;
    }

    // Check if we're in fallback mode (no real Prebid functionality)
    if (!window.pbjs.que || window.pbjs.que.length === 0) {
      console.log('Using fallback mode for', adUnitCode);
      // Simulate a delay and then call callback with null (no real bid)
      setTimeout(() => {
        if (callback) callback(null);
      }, 1000);
      return;
    }

    window.pbjs.que.push(() => {
      window.pbjs.requestBids({
        adUnitCodes: [adUnitCode],
        bidsBackHandler: (bidResponses) => {
          console.log('Bid responses for', adUnitCode, ':', bidResponses);
          
          // Get winning bid
          const winningBid = window.pbjs.getHighestCpmBids(adUnitCode)[0];
          
          if (callback) {
            callback(winningBid);
          }
        }
      });
    });
  }

  static renderAd(adUnitCode, element) {
    if (!window.pbjs) {
      console.error('Prebid not available');
      this.renderFallbackAd(element, adUnitCode);
      return;
    }

    // Check if we're in fallback mode
    if (!window.pbjs.que || window.pbjs.que.length === 0) {
      console.log('Rendering fallback ad for', adUnitCode, 'in fallback mode');
      this.renderFallbackAd(element, adUnitCode);
      return;
    }

    window.pbjs.que.push(() => {
      // Try to render the winning bid
      const winningBid = window.pbjs.getHighestCpmBids(adUnitCode)[0];
      
      if (winningBid && winningBid.ad) {
        // Render the ad creative
        element.innerHTML = winningBid.ad;
        console.log('Rendered ad for', adUnitCode, 'with CPM:', winningBid.cpm);
      } else {
        // No winning bid - show fallback
        this.renderFallbackAd(element, adUnitCode);
      }
    });
  }

  static renderFallbackAd(element, adUnitCode) {
    console.log('Rendering fallback ad for', adUnitCode);
    // Create a demo ad for testing
    const demoAd = `
      <div style="
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        width: 280px;
        height: 230px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      ">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">🎯 Demo Advertisement</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
          This is a sample ad served through Prebid.js header bidding integration
        </p>
        <div style="
          background: rgba(255,255,255,0.2);
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
        ">
          Ad Unit: ${adUnitCode}
        </div>
        <div style="
          margin-top: 10px;
          font-size: 10px;
          opacity: 0.7;
        ">
          Fallback Mode Active
        </div>
      </div>
    `;
    
    element.innerHTML = demoAd;
    console.log('Fallback ad rendered for', adUnitCode);
  }

  // Test method to force render a fallback ad
  static testFallbackAd(element, adUnitCode) {
    console.log('Testing fallback ad render for', adUnitCode);
    this.renderFallbackAd(element, adUnitCode);
  }
}

export default PrebidManager;