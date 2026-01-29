# Free Map Viewer - Alternative to Google Maps

A 100% free, open-source map application that displays interactive maps on your website. No API keys required!

## 🎯 Features

✅ **Completely Free** - No Google Maps API key or subscription needed
✅ **Interactive Maps** - Click to add markers, search locations
✅ **Multiple Map Styles** - Light, Dark, and Satellite views
✅ **Location Search** - Search any location worldwide using OpenStreetMap data
✅ **User Geolocation** - Automatically detect and display your location
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
✅ **No Dependencies** - Built with Leaflet.js (lightweight & fast)
✅ **Open Source** - All technologies used are free and open-source

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open in browser:**
The app will automatically open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

## 📚 What's Included

- **React Component** (`index.react`) - Main map application
- **CSS Styling** (`MapApp.css`) - Beautiful, responsive UI
- **HTML Template** (`index.html`) - Landing page
- **Entry Point** (`index.js`) - React app initialization
- **Package Configuration** (`package.json`) - Dependencies and scripts

## 🗺️ Key Technologies

| Technology | Purpose | Why Free |
|-----------|---------|----------|
| **Leaflet.js** | Lightweight mapping library | Open-source (BSD 2-Clause) |
| **OpenStreetMap** | Map tiles and base data | Community-driven, open data |
| **Nominatim** | Location search & geocoding | Free OSM-based service |
| **React** | User interface framework | Open-source (MIT) |

## 🎮 How to Use

1. **Search a Location** - Type a location name and press Enter
2. **Click on Map** - Click anywhere to add a marker
3. **View Details** - Click markers to see coordinates
4. **Change Map Style** - Switch between Light, Dark, or Satellite views
5. **Clear Markers** - Remove all markers with one click

## 📍 Markers Management

- **Add**: Click on map or search a location
- **View**: Click marker to see details (lat/lng)
- **Remove**: Click "Remove" button in marker popup
- **Clear All**: Use "Clear Markers" button

## 🎨 Customization Examples

### Change Default Map Center
Edit `index.react` line 36:
```javascript
map.current.setView([51.505, -0.09], 13); // Paris, France
```

### Add Custom Marker Icon
```javascript
const customIcon = L.icon({
  iconUrl: 'your-icon.png',
  iconSize: [32, 32],
});

L.marker([lat, lng], { icon: customIcon }).addTo(map.current);
```

### Add Drawing Tools
Install `leaflet-draw`:
```bash
npm install leaflet-draw
```

## ⚙️ Configuration

### Limit Search Results
Edit `index.react` line 124 to change search limit:
```javascript
fetch(`...&limit=5`) // Get 5 results instead of 1
```

### Adjust Initial Zoom Level
Edit `index.react` line 44:
```javascript
map.current.setView([latitude, longitude], 15); // Change 15 to desired zoom (0-19)
```

## 🌍 API Services Used

All free and open-source:

- **OpenStreetMap Tiles** - Map data
- **Nominatim Search** - Location geocoding
- **CartoDB Basemaps** - Alternative map styles
- **Esri Imagery** - Satellite tiles

No authentication required!

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy

- ✅ No tracking or analytics
- ✅ No user data collection
- ✅ Works offline (after initial load)
- ✅ All data stays in your browser

## 📈 Performance

- Lightweight (~200KB gzipped)
- Fast map rendering
- Smooth zoom and pan
- Mobile-optimized

## 🛠️ Troubleshooting

### Map not loading?
- Check internet connection
- Ensure no content blocking extensions
- Clear browser cache

### Geolocation not working?
- Enable location permissions in browser
- HTTPS required for some browsers
- Check browser privacy settings

### Search not working?
- Nominatim API has rate limits
- Try specific location names
- Check for typos

## 📝 License

This project uses open-source libraries:
- Leaflet: BSD 2-Clause
- React: MIT
- OpenStreetMap: ODbL

## 🤝 Contributing

Feel free to:
- Fork the project
- Add new features
- Submit improvements
- Report bugs

## 📞 Support

For issues or questions:
1. Check OpenStreetMap documentation
2. Review Leaflet.js documentation
3. Check browser console for errors

## 🎉 What You Can Build

This free map solution is perfect for:
- ✅ Business locator websites
- ✅ Real estate property maps
- ✅ Travel & tourism apps
- ✅ Delivery tracking services
- ✅ Event location maps
- ✅ Store locators
- ✅ Route planning
- ✅ Data visualization

## 💰 Cost Comparison

| Service | Google Maps | Our Solution |
|---------|-----------|--------------|
| **Cost** | $7-$14+ per 1K requests | FREE |
| **Setup** | API key required | No setup |
| **Data Attribution** | Optional* | Required (ODbL) |
| **Commercial Use** | Requires license | Free |

## 🚀 Deployment

Deploy for free on:
- **Vercel** - Optimized for React
- **Netlify** - Simple git integration
- **GitHub Pages** - Static hosting
- **Firebase** - Google's platform
- **Railway** - Easy deployment

## 📚 Learn More

- [Leaflet Documentation](https://leafletjs.com)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org)
- [Nominatim Documentation](https://nominatim.org)
- [React Documentation](https://react.dev)

---

**Made with ❤️ using free, open-source technologies**
