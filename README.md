# Prebid React App

A Node.js project demonstrating Prebid.js integration with a React.js web application for header bidding and ad serving.

## 🚀 Features

- **Prebid.js Integration**: Complete header bidding setup with test bidders
- **Standalone Ad Server**: Custom ad server implementation with Express.js backend
- **React Components**: Modular ad unit components for easy integration
- **Real-time Bidding**: Demonstrates auction mechanics and bid responses
- **Responsive Design**: Modern, mobile-friendly UI
- **Express Server**: Node.js backend for serving the application
- **Webpack Build System**: Optimized bundling and development server

## 📁 Project Structure

```
prebid-react-app/
├── package.json                 # Project dependencies and scripts
├── server.js                   # Express server
├── webpack.config.js           # Webpack configuration
├── babel.config.js             # Babel configuration
├── public/
│   └── index.html             # HTML template with Prebid.js
├── src/
│   ├── index.js               # React app entry point
│   ├── App.js                 # Main application component
│   ├── App.css                # Application styles
│   └── components/
│       ├── PrebidManager.js   # Prebid configuration and utilities
│       ├── AdUnit.js          # Individual ad unit component
│       ├── AdServerManager.js # Standalone ad server manager
│       └── StandaloneAdUnit.js # Standalone ad unit component
└── README.md                  # This file
```

## 🛠 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

   Or for development with hot reload:
   ```bash
   npm run dev
   ```

## 🌐 Usage

### Development Mode
```bash
npm run dev
```
- Runs webpack dev server on `http://localhost:3001`
- Includes hot module replacement for fast development
- Opens browser automatically

### Production Mode
```bash
npm run build
npm start
```
- Builds optimized production bundle
- Starts Express server on `http://localhost:3000`
- Serves static files from `dist/` directory

## 🎯 Ad Server Integration

### Prebid.js Integration
The Prebid integration is configured in `src/components/PrebidManager.js` with:

- **Test Bidders**: AppNexus and Rubicon Project
- **Ad Units**: Two sample ad placements with different sizes
- **Debug Mode**: Enabled for testing and development
- **Timeout**: 3-second bidder timeout

### Prebid Ad Units
Two ad units are configured:

1. **Banner Ad** (`div-gpt-ad-1234567890-0`)
   - Sizes: 300x250, 320x50
   - Bidders: AppNexus, Rubicon

2. **Leaderboard Ad** (`div-gpt-ad-1234567890-1`)
   - Sizes: 728x90, 320x50
   - Bidders: AppNexus, Rubicon

### Standalone Ad Server
The standalone ad server is implemented in `src/components/AdServerManager.js` with:

- **Custom Ad Server**: Express.js backend serving ads
- **Ad Units**: Two standalone ad placements
- **Real-time Ad Serving**: Server-side ad generation
- **Fallback Support**: Mock ads when server is unavailable

### Standalone Ad Units
Two standalone ad units are configured:

1. **Banner Ad** (`standalone-ad-1`)
   - Sizes: 300x250, 320x50
   - Type: Banner

2. **Leaderboard Ad** (`standalone-ad-2`)
   - Sizes: 728x90, 320x50
   - Type: Banner

### Components

#### PrebidManager
- Initializes Prebid.js configuration
- Sets up ad units with bidder parameters
- Handles bid requests and responses
- Renders winning ads or fallback content

#### AdUnit
- React component for individual ad placements
- Manages loading states and bid information
- Displays winning bid details
- Handles ad rendering

#### AdServerManager
- Manages standalone ad server integration
- Handles ad requests to Express.js backend
- Provides fallback ad generation
- Manages ad unit configuration

#### StandaloneAdUnit
- React component for standalone ad placements
- Manages loading states and ad information
- Displays ad server details
- Handles standalone ad rendering

## 🔧 Customization

### Adding New Bidders
Edit `src/components/PrebidManager.js` and add bidder configuration:

```javascript
{
  bidder: 'your-bidder',
  params: {
    // bidder-specific parameters
  }
}
```

### Adding New Ad Units
1. Add configuration to the `adUnits` array in `PrebidManager.js`
2. Use the `AdUnit` component in your React application:

```jsx
<AdUnit 
  adUnitCode="your-ad-unit-code"
  sizes={[[width, height]]}
  title="Your Ad Title"
/>
```

### Adding New Standalone Ad Units
1. Add configuration to the `adUnitConfigs` array in `AdServerManager.js`
2. Use the `StandaloneAdUnit` component in your React application:

```jsx
<StandaloneAdUnit 
  adUnitCode="your-standalone-ad-code"
  sizes={[[width, height]]}
  title="Your Ad Title"
/>
```

### Styling
Modify `src/App.css` to customize the appearance of ad units and the overall application.

## 🐛 Debugging

### Browser Console
- Prebid debug mode is enabled by default
- Check browser console for bid responses and errors
- Look for Prebid.js logs starting with `[Prebid.js]`

### Common Issues
1. **No bids returned**: Check bidder configuration and test parameters
2. **Ads not rendering**: Verify ad unit codes match between configuration and components
3. **Console errors**: Ensure Prebid.js is loaded before initialization

## 📊 Testing

The application includes test bidders and demo ad creatives for testing purposes:

- **AppNexus**: Uses test placement ID `13144370`
- **Rubicon**: Uses test account parameters
- **Fallback Ads**: Demo creatives when no bids are available

## 🌟 Production Considerations

For production deployment:

1. **Replace test parameters** with real bidder configurations
2. **Enable Google Publisher Tag (GPT)** for ad serving
3. **Configure proper ad server integration**
4. **Set up privacy compliance** (GDPR, CCPA)
5. **Optimize bid timeouts** based on your requirements
6. **Add monitoring and analytics**

## 📚 Resources

- [Prebid.js Documentation](https://docs.prebid.org/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Webpack Documentation](https://webpack.js.org/concepts/)

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This is a demonstration project using test bidder configurations. For production use, replace with real bidder parameters and implement proper ad server integration.