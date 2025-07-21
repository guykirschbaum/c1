import React, { useEffect, useRef, useState } from 'react';
import PrebidManager from './PrebidManager';

const AdUnit = ({ adUnitCode, sizes, title }) => {
  const adRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidInfo, setBidInfo] = useState(null);

  useEffect(() => {
    if (!adRef.current) return;

    console.log('AdUnit useEffect called for', adUnitCode);

    // Request bids for this ad unit
    PrebidManager.requestBids(adUnitCode, (winningBid) => {
      console.log('Bid response received for', adUnitCode, ':', winningBid);
      
      if (winningBid) {
        setBidInfo({
          bidder: winningBid.bidderCode,
          cpm: winningBid.cpm,
          currency: winningBid.currency || 'USD'
        });
      }

      // Render the ad with a shorter delay for fallback mode
      const delay = winningBid ? 1000 : 500; // Shorter delay if no real bid
      setTimeout(() => {
        console.log('Rendering ad for', adUnitCode);
        PrebidManager.renderAd(adUnitCode, adRef.current);
        setIsLoading(false);
      }, delay);
    });

    // Fallback: if no response after 3 seconds, force render
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Forcing ad render for', adUnitCode, 'due to timeout');
        PrebidManager.renderAd(adUnitCode, adRef.current);
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [adUnitCode, isLoading]);

  return (
    <div className="ad-unit-container">
      {title && <h4 className="ad-unit-title">{title}</h4>}
      
      <div className="ad-unit-content">
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
            color: '#666',
            background: '#f8f9fa'
          }}>
            <div>
              <div style={{ marginBottom: '10px' }}>Loading advertisement...</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                Running header bidding auction
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
        
        {bidInfo && !isLoading && (
          <div style={{
            background: '#e8f5e8',
            padding: '8px',
            margin: '10px 0 0 0',
            fontSize: '11px',
            color: '#2d5a2d',
            borderRadius: '4px',
            textAlign: 'left'
          }}>
            <strong>Winning Bid:</strong> {bidInfo.bidder} | 
            <strong> CPM:</strong> ${bidInfo.cpm} {bidInfo.currency} | 
            <strong> Ad Unit:</strong> {adUnitCode}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdUnit;