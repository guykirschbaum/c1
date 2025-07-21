class AdServerManager {
  static instance = null;
  static isInitialized = false;
  static adUnits = new Map();
  static adServerUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_AD_SERVER_URL) || 'http://localhost:3000/api/ads';

  static init(callback) {
    if (this.isInitialized) {
      callback();
      return;
    }

    // Initialize ad server
    this.setupAdServer();
    this.isInitialized = true;
    if (callback) callback();
  }

  static setupAdServer() {
    // Define ad units for the standalone ad server
    const adUnitConfigs = [
      {
        code: 'standalone-ad-1',
        sizes: [[300, 250], [320, 50]],
        title: 'Banner Ad',
        type: 'banner'
      },
      {
        code: 'standalone-ad-2', 
        sizes: [[728, 90], [320, 50]],
        title: 'Leaderboard Ad',
        type: 'banner'
      }
    ];

    // Register ad units
    adUnitConfigs.forEach(config => {
      this.adUnits.set(config.code, config);
    });

    console.log('Standalone Ad Server initialized with', adUnitConfigs.length, 'ad units');
  }

  static requestAd(adUnitCode, callback) {
    const adUnit = this.adUnits.get(adUnitCode);
    
    if (!adUnit) {
      console.error('Ad unit not found:', adUnitCode);
      if (callback) callback(null);
      return;
    }

    // Simulate ad server request
    this.makeAdRequest(adUnitCode, adUnit, callback);
  }

  static makeAdRequest(adUnitCode, adUnit, callback) {
    // Make actual request to server
    fetch('/api/ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adUnitCode: adUnitCode,
        sizes: adUnit.sizes,
        targeting: {
          page: window.location.pathname,
          timestamp: Date.now()
        }
      }),
    })
    .then(response => response.json())
    .then(adResponse => {
      if (callback) {
        callback(adResponse);
      }
    })
    .catch(error => {
      console.error('Ad server request failed:', error);
      // Fallback to mock ad
      const fallbackResponse = this.generateMockAd(adUnitCode, adUnit);
      if (callback) {
        callback(fallbackResponse);
      }
    });
  }

  static generateMockAd(adUnitCode, adUnit) {
    const adTypes = [
      {
        type: 'banner',
        template: (code, sizes) => `
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            width: ${sizes[0][0] - 40}px;
            height: ${sizes[0][1] - 40}px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          ">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">🎯 Premium Advertisement</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
              Served by Standalone Ad Server
            </p>
            <div style="
              background: rgba(255,255,255,0.2);
              padding: 8px;
              border-radius: 4px;
              font-size: 12px;
            ">
              Ad Unit: ${code}
            </div>
          </div>
        `
      },
      {
        type: 'video',
        template: (code, sizes) => `
          <div style="
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            width: ${sizes[0][0] - 40}px;
            height: ${sizes[0][1] - 40}px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 auto;
          ">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">🎬 Video Advertisement</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
              Video ad placeholder
            </p>
            <div style="
              background: rgba(255,255,255,0.2);
              padding: 8px;
              border-radius: 4px;
              font-size: 12px;
            ">
              Ad Unit: ${code}
            </div>
          </div>
        `
      }
    ];

    const adType = adTypes.find(type => type.type === adUnit.type) || adTypes[0];
    const adHtml = adType.template(adUnitCode, adUnit.sizes);

    return {
      success: true,
      adUnitCode: adUnitCode,
      adHtml: adHtml,
      adType: adUnit.type,
      sizes: adUnit.sizes,
      timestamp: Date.now(),
      cpm: (Math.random() * 5 + 1).toFixed(2), // Random CPM between $1-$6
      currency: 'USD'
    };
  }

  static renderAd(adUnitCode, element) {
    if (!element) {
      console.error('Element not provided for ad rendering');
      return;
    }

    this.requestAd(adUnitCode, (adResponse) => {
      if (adResponse && adResponse.success) {
        element.innerHTML = adResponse.adHtml;
        console.log('Rendered standalone ad for', adUnitCode, 'with CPM:', adResponse.cpm);
      } else {
        this.renderFallbackAd(element, adUnitCode);
      }
    });
  }

  static renderFallbackAd(element, adUnitCode) {
    const fallbackAd = `
      <div style="
        background: #f8f9fa;
        border: 2px dashed #dee2e6;
        color: #6c757d;
        padding: 20px;
        text-align: center;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
      ">
        <h3 style="margin: 0 0 10px 0; font-size: 16px;">📢 Ad Space Available</h3>
        <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">
          No ad available at this time
        </p>
        <div style="
          background: rgba(108, 117, 125, 0.1);
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
        ">
          Ad Unit: ${adUnitCode}
        </div>
      </div>
    `;
    
    element.innerHTML = fallbackAd;
    console.log('Rendered fallback ad for', adUnitCode);
  }

  static getAdUnitInfo(adUnitCode) {
    return this.adUnits.get(adUnitCode);
  }

  static getAllAdUnits() {
    return Array.from(this.adUnits.values());
  }
}

export default AdServerManager; 