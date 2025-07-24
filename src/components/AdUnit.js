import React, { useEffect, useRef, useState } from 'react';
import PrebidManager from './PrebidManager';

const AdUnit = ({ adUnitCode, sizes, title }) => {
  const adRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adHtml, setAdHtml] = useState(null);
  const [bidInfo, setBidInfo] = useState(null);
  const [fallbackHtml, setFallbackHtml] = useState(null);

  useEffect(() => {
    if (adUnitCode === 'top-banner') {
      fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adUnitCode, sizes })
      })
        .then(res => res.json())
        .then(data => {
          setAdHtml(data.adHtml);
          setIsLoading(false);
        });
      return;
    }

    if (!adRef.current) return;
    PrebidManager.requestBids(adUnitCode, (winningBid) => {
      if (winningBid) {
        setBidInfo({
          bidder: winningBid.bidderCode,
          cpm: winningBid.cpm,
          currency: winningBid.currency || 'USD'
        });
        setFallbackHtml(null);
      } else {
        // Render fallback ad as JSX
        setFallbackHtml(
          <div style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            color: 'white',
            padding: 20,
            textAlign: 'center',
            borderRadius: 8,
            fontFamily: 'Arial, sans-serif',
            width: 280,
            height: 230,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>🎯 Demo Advertisement</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
              This is a sample ad served through Prebid.js header bidding integration
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: 8,
              borderRadius: 4,
              fontSize: 12
            }}>
              Ad Unit: {adUnitCode}
            </div>
            <div style={{
              marginTop: 10,
              fontSize: 10,
              opacity: 0.7
            }}>
              Fallback Mode Active
            </div>
          </div>
        );
      }
      setIsLoading(false);
    });
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setFallbackHtml(
          <div style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            color: 'white',
            padding: 20,
            textAlign: 'center',
            borderRadius: 8,
            fontFamily: 'Arial, sans-serif',
            width: 280,
            height: 230,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>🎯 Demo Advertisement</h3>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
              This is a sample ad served through Prebid.js header bidding integration
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: 8,
              borderRadius: 4,
              fontSize: 12
            }}>
              Ad Unit: {adUnitCode}
            </div>
            <div style={{
              marginTop: 10,
              fontSize: 10,
              opacity: 0.7
            }}>
              Fallback Mode Active
            </div>
          </div>
        );
        setIsLoading(false);
      }
    }, 3000);
    return () => clearTimeout(fallbackTimer);
  }, [adUnitCode, sizes]);

  // For top-banner, set innerHTML via ref after loading
  useEffect(() => {
    if (adUnitCode === 'top-banner' && !isLoading && adRef.current && adHtml) {
      adRef.current.innerHTML = adHtml;
    }
  }, [adUnitCode, isLoading, adHtml]);

  if (adUnitCode === 'top-banner') {
    return (
      <div className="ad-unit-container">
        {isLoading ? <div>Loading ad…</div> : <div ref={adRef} />}
      </div>
    );
  }

  // Only use adRef for non-top-banner units
  return (
    <div className="ad-unit-container" ref={adRef}>
      {isLoading ? <div>Loading ad…</div> : fallbackHtml}
    </div>
  );
};

export default AdUnit;