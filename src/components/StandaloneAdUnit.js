import React, { useEffect, useRef, useState } from 'react';
import AdServerManager from './AdServerManager';

const StandaloneAdUnit = ({ adUnitCode, sizes, title }) => {
  const adRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adInfo, setAdInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Request ad for this ad unit
    AdServerManager.requestAd(adUnitCode, (adResponse) => {
      if (adResponse && adResponse.success) {
        setAdInfo({
          adType: adResponse.adType,
          cpm: adResponse.cpm,
          currency: adResponse.currency,
          timestamp: adResponse.timestamp
        });
        setError(null);
      } else {
        setError('No ad available');
        setAdInfo(null);
      }

      // Render the ad
      setTimeout(() => {
        AdServerManager.renderAd(adUnitCode, adRef.current);
        setIsLoading(false);
      }, 1000); // Small delay to simulate real ad serving
    });
  }, [adUnitCode]);

  return (
    <div className="standalone-ad-unit-container">
      {title && <h4 className="ad-unit-title">{title}</h4>}
      
      <div className="ad-unit-content">
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div>
              <div style={{ marginBottom: '10px' }}>Loading advertisement...</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                Requesting ad from standalone ad server
              </div>
            </div>
          </div>
        )}
        
        <div 
          ref={adRef} 
          id={adUnitCode}
          style={{ 
            minHeight: isLoading ? '0' : 'auto',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {error && !isLoading && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '8px',
            margin: '10px 0 0 0',
            fontSize: '11px',
            borderRadius: '4px',
            textAlign: 'left'
          }}>
            <strong>Ad Error:</strong> {error}
          </div>
        )}
        
        {adInfo && !isLoading && !error && (
          <div style={{
            background: '#d1ecf1',
            border: '1px solid #bee5eb',
            color: '#0c5460',
            padding: '8px',
            margin: '10px 0 0 0',
            fontSize: '11px',
            borderRadius: '4px',
            textAlign: 'left'
          }}>
            <strong>Ad Served:</strong> {adInfo.adType} | 
            <strong> CPM:</strong> ${adInfo.cpm} {adInfo.currency} | 
            <strong> Ad Unit:</strong> {adUnitCode}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandaloneAdUnit; 