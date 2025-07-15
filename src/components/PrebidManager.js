class PrebidManager {
  static instance = null;
  static isInitialized = false;

  static init(callback) {
    if (this.isInitialized) {
      callback();
      return;
    }

    // Wait for Prebid to be available
    const checkPrebid = () => {
      if (window.pbjs && window.pbjs.que) {
        this.setupPrebid(callback);
      } else {
        setTimeout(checkPrebid, 100);
      }
    };

    checkPrebid();
  }

  static setupPrebid(callback) {
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
      window.pbjs.addAdUnits(adUnits);

      // Set up Google Publisher Tag (GPT) integration
      this.setupGPT();

      this.isInitialized = true;
      if (callback) callback();
    });
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

  static requestBids(adUnitCode, callback) {
    if (!window.pbjs) {
      console.error('Prebid not available');
      if (callback) callback([]);
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
      </div>
    `;
    
    element.innerHTML = demoAd;
    console.log('Rendered fallback ad for', adUnitCode);
  }
}

export default PrebidManager;