// Free Map Viewer - Pure JavaScript Implementation with Advanced Routing

let map;
let markers = [];
let currentStyle = 'osm';
let routeControl = null;
let routeMarkers = [];
let currentRoute = null;
let routeLine = null;
let searchCache = [];
let searchDebounceTimer = null;

// Initialize map
function initMap() {
  console.log('Initializing map...');

  // Ensure map container exists
  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  map = L.map('mapContainer').setView([20, 0], 2);
  console.log('Leaflet map created');

  addTileLayer('osm');
  console.log('Tile layer added');

  // Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User location:', latitude, longitude);
        map.setView([latitude, longitude], 13);

        L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#4285F4',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup('Your Location')
          .addTo(map);
      },
      (error) => console.log('Geolocation denied:', error)
    );
  }

  // Handle map clicks
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    console.log('Map clicked at:', lat, lng);
    addMarker(lat, lng, 'Clicked Location');
  });

  // Remove default Leaflet Control Geocoder to avoid UI clutter
  // L.Control.geocoder().addTo(map);
  console.log('Map fully initialized');
}

// Add tile layer based on style
function addTileLayer(style) {
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });

  let tileUrl, attribution, subdomains;

  switch (style) {
    case 'dark':
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '© OpenStreetMap contributors, © CartoDB';
      break;
    case 'satellite': // Esri Satellite
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '© Esri';
      break;
    case 'google-streets':
      tileUrl = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      attribution = 'Map data © Google';
      subdomains = ['mt0', 'mt1', 'mt2', 'mt3'];
      break;
    case 'google-hybrid':
      tileUrl = 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
      attribution = 'Map data © Google';
      subdomains = ['mt0', 'mt1', 'mt2', 'mt3'];
      break;
    default: // Default to Google Streets for better details
      tileUrl = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      attribution = 'Map data © Google';
      subdomains = ['mt0', 'mt1', 'mt2', 'mt3'];
  }

  L.tileLayer(tileUrl, {
    attribution,
    maxZoom: 20, // Google maps support higher zoom
    subdomains: subdomains || 'abc'
  }).addTo(map);
}

// Add marker to map
function addMarker(lat, lng, title = 'Location') {
  console.log('addMarker called with:', { lat, lng, title });

  if (!map) {
    console.error('Map not initialized when adding marker!');
    return;
  }

  if (isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates:', { lat, lng });
    return;
  }

  try {
    const marker = L.marker([lat, lng], {
      title: title
    })
      .bindPopup(
        `<div class="popup-content">
          <strong>${title}</strong><br/>
          Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}<br/>
          <button onclick="removeMarker(${markers.length})">Remove</button>
        </div>`
      )
      .addTo(map);

    markers.push({ lat, lng, title, marker });
    console.log('Marker added successfully. Total markers:', markers.length);

    // Open popup automatically to show the marker
    marker.openPopup();
    console.log(`✓ Marker visible: ${title} at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  } catch (error) {
    console.error('Error adding marker:', error);
  }
}

// Remove marker by index
function removeMarker(index) {
  if (markers[index]) {
    map.removeLayer(markers[index].marker);
    markers.splice(index, 1);
  }
}

// Search location with fallback (Nominatim -> Photon)
async function searchLocation() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a location to search');
    return;
  }

  // UI Loading State
  const originalText = searchInput.placeholder;
  searchInput.disabled = true;
  searchInput.value = '';
  searchInput.placeholder = 'Searching...';

  try {
    // Attempt 1: Nominatim
    console.log('Trying Nominatim search...');
    let results = await searchNominatim(query);

    // Attempt 2: Photon (Fallback) if Nominatim returns empty or fails
    if (!results || results.length === 0) {
      console.log('Nominatim returned no results, trying Photon...');
      results = await searchPhoton(query);
    }

    if (results && results.length > 0) {
      const result = results[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const name = result.name;

      console.log(`Location found: ${name} (${lat}, ${lon})`);

      // Update Map
      clearMarkers();
      map.setView([lat, lon], 13);
      addMarker(lat, lon, name);

      searchInput.value = ''; // Keep input clear or set to name
    } else {
      alert(`No results found for "${query}"`);
      searchInput.value = query; // Restore input
    }
  } catch (error) {
    console.error('Search failed:', error);
    alert('Search failed. Please check your internet connection.');
    searchInput.value = query;
  } finally {
    searchInput.disabled = false;
    searchInput.placeholder = originalText;
  }
}

// Helper: Search Nominatim
async function searchNominatim(query) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=3&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en-US,en;q=0.9' }
      }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error('Nominatim error');

    const data = await response.json();
    return data.map(item => ({
      lat: item.lat,
      lon: item.lon,
      name: item.display_name
    }));
  } catch (e) {
    console.warn('Nominatim search error:', e);
    return null;
  }
}

// Helper: Search Photon (Komoot)
async function searchPhoton(query) {
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=3`
    );
    const data = await response.json();

    return data.features.map(feature => ({
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      name: feature.properties.name + ', ' + (feature.properties.city || feature.properties.country || '')
    }));
  } catch (e) {
    console.warn('Photon search error:', e);
    return [];
  }
}

// Real-time autocomplete suggestions
async function handleSearchInput(query) {
  if (query.length < 1) {
    hideSuggestions();
    return;
  }

  // Clear previous timer
  clearTimeout(searchDebounceTimer);

  // Show loading state
  const suggestionsDiv = document.getElementById('searchSuggestions');
  if (!suggestionsDiv) {
    console.error('❌ Suggestions div not found!');
    return;
  }

  suggestionsDiv.innerHTML = '<div class="suggestion-loading">🔍 Searching...</div>';
  suggestionsDiv.classList.remove('hidden');

  // Debounce the search (wait 300ms before searching)
  searchDebounceTimer = setTimeout(async () => {
    try {
      console.log('🔍 Autocomplete search for:', query);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const results = await response.json();
      console.log('✓ Autocomplete results:', results.length, 'items');

      if (!results || results.length === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion-no-results">No results found</div>';
        return;
      }

      // Simple matching
      const filtered = results.filter(r =>
        r.display_name.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion-no-results">No results found</div>';
        return;
      }

      // Build suggestions HTML
      let suggestionsHTML = '';
      filtered.slice(0, 8).forEach((result, index) => {
        const icon = getLocationIcon(result.type);
        const highlighted = result.display_name.replace(
          new RegExp(`(${query})`, 'gi'),
          '<strong>$1</strong>'
        );
        suggestionsHTML += `
          <div class="suggestion-item" data-index="${index}" data-lat="${result.lat}" data-lon="${result.lon}" data-name="${result.display_name}">
            <span class="suggestion-icon">${icon}</span>
            <div class="suggestion-text">
              <div class="suggestion-name">${highlighted}</div>
              <div class="suggestion-type">${result.type || 'location'}</div>
            </div>
          </div>
        `;
      });

      suggestionsDiv.innerHTML = suggestionsHTML;
      console.log('✓ Displayed', filtered.length, 'suggestions');

      // Add click handlers to suggestions
      document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const lat = parseFloat(item.getAttribute('data-lat'));
          const lon = parseFloat(item.getAttribute('data-lon'));
          const name = item.getAttribute('data-name');

          console.log('📍 Suggestion clicked:', name);

          // Clear previous markers
          clearMarkers();

          // Set view and add marker
          map.setView([lat, lon], 13);
          addMarker(lat, lon, name);
          document.getElementById('searchInput').value = name;
          hideSuggestions();
        });
      });
    } catch (error) {
      console.error('❌ Autocomplete error:', error.message);
      suggestionsDiv.innerHTML = '<div class="suggestion-no-results">Error loading suggestions</div>';
    }
  }, 300);
}

// Get appropriate emoji icon for location type
function getLocationIcon(type) {
  const iconMap = {
    'city': '🏙️',
    'town': '🏘️',
    'village': '🏞️',
    'road': '🛣️',
    'street': '🛣️',
    'building': '🏢',
    'landmark': '🗿',
    'restaurant': '🍽️',
    'hotel': '🏨',
    'museum': '🏛️',
    'park': '🌳',
    'administrative': '🏛️',
    'country': '🌍',
    'state': '📍',
    'suburb': '🏠',
    'postcode': '📮'
  };

  return iconMap[type] || '📍';
}

// Hide suggestions
function hideSuggestions() {
  const suggestionsDiv = document.getElementById('searchSuggestions');
  if (suggestionsDiv) {
    suggestionsDiv.classList.add('hidden');
  }
}

// Geocode location name to coordinates (Robust version)
async function geocodeLocation(locationName) {
  console.log(`Geocoding: ${locationName}`);
  try {
    // Try Nominatim first
    let results = await searchNominatim(locationName);

    // Fallback to Photon
    if (!results || results.length === 0) {
      console.log('Nominatim failed, trying Photon...');
      results = await searchPhoton(locationName);
    }

    if (results && results.length > 0) {
      return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Calculate and display route with bright red line
async function getRoute() {
  const startInput = document.getElementById('startInput').value.trim();
  const endInput = document.getElementById('endInput').value.trim();

  if (!startInput || !endInput) {
    alert('Please enter both start and end locations');
    return;
  }

  const routeBtn = document.getElementById('routeBtn');
  const originalText = routeBtn.textContent;
  routeBtn.disabled = true;
  routeBtn.textContent = 'Calculating...';

  try {
    // Geocode both locations
    const startCoords = await geocodeLocation(startInput);
    if (!startCoords) throw new Error(`Could not find location: ${startInput}`);

    const endCoords = await geocodeLocation(endInput);
    if (!endCoords) throw new Error(`Could not find location: ${endInput}`);

    // Clear previous route
    clearRoute();

    // Get route from OSRM (Using reliable server)
    // Fallback server: https://routing.openstreetmap.de/routed-car/route/v1/driving/
    const response = await fetch(
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson&steps=true`
    );

    if (!response.ok) throw new Error('Routing service invalid response');

    const data = await response.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      currentRoute = route;

      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

      // Draw SOLID BRIGHT RED navigation line
      routeLine = L.polyline(coordinates, {
        color: '#FF0000',   // Bright Red
        weight: 6,          // Thicker line
        opacity: 1.0,       // Fully opaque (solid)
        lineJoin: 'round',
        lineCap: 'round',
        className: 'route-line-glow' // Add glow effect class
      }).addTo(map);

      // Add start marker (GREEN)
      const startMarker = L.circleMarker(startCoords, {
        radius: 10,
        fillColor: '#00cc00',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      })
        .bindPopup(`<strong>🚩 Start:</strong> ${startInput}`)
        .addTo(map);

      // Add end marker (RED)
      const endMarker = L.circleMarker(endCoords, {
        radius: 10,
        fillColor: '#ff0000',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      })
        .bindPopup(`<strong>🎯 Destination:</strong> ${endInput}`)
        .addTo(map);

      routeMarkers = [startMarker, endMarker];

      displayRouteInfo(route, startInput, endInput);

      // Fit map to route
      map.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50] });

    } else {
      throw new Error('No route found between these locations.');
    }
  } catch (error) {
    console.error('Route error:', error);
    alert('Error: ' + error.message);
  } finally {
    routeBtn.textContent = originalText;
  }
}

// Display detailed route information (Full Screen Mode)
function displayRouteInfo(route, startName, endName) {
  const routeInfo = document.getElementById('routeInfo');

  // formatted stats
  const distance = (route.distance / 1000).toFixed(1); // Convert to km
  const duration = Math.round(route.duration / 60); // Convert to minutes

  // Hide main UI for full screen experience
  document.querySelector('.map-controls').classList.add('hidden');
  document.querySelector('.map-header').classList.add('hidden');

  // Simple floating card content
  routeInfo.innerHTML = `
    <div class="route-float-card">
      <div class="route-float-header">
        <div class="route-float-title">
          <span class="route-icon">🚗</span> ${duration} min <span class="route-dist">(${distance} km)</span>
        </div>
        <button onclick="clearRoute()" class="btn-close-route">✕ Exit</button>
      </div>
    </div>
  `;

  routeInfo.classList.remove('hidden');
}

// Clear route and restore UI
function clearRoute() {
  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }

  routeMarkers.forEach(m => map.removeLayer(m));
  routeMarkers = [];
  currentRoute = null;

  // Hide route info
  document.getElementById('routeInfo').classList.add('hidden');

  // Restore main UI
  document.querySelector('.map-controls').classList.remove('hidden');
  document.querySelector('.map-header').classList.remove('hidden');

  // Clear inputs
  document.getElementById('startInput').value = '';
  document.getElementById('endInput').value = '';

  // Reset map view to user location or default
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 13);
    });
  }
}

// Clear all markers
function clearMarkers() {
  markers.forEach((m) => map.removeLayer(m.marker));
  markers = [];
}

// Change map style
function changeMapStyle(style) {
  currentStyle = style;
  addTileLayer(style);

  document.querySelectorAll('.style-section .btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-style="${style}"]`).classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initMap();

  const searchInput = document.getElementById('searchInput');

  // Real-time search as user types (ML fuzzy matching)
  searchInput.addEventListener('input', (e) => {
    handleSearchInput(e.target.value);
  });

  document.getElementById('searchBtn').addEventListener('click', searchLocation);

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchLocation();
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      hideSuggestions();
    }
  });

  document.getElementById('routeBtn').addEventListener('click', getRoute);
  document.getElementById('clearRouteBtn').addEventListener('click', clearRoute);

  document.getElementById('startInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRoute();
  });

  document.getElementById('endInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRoute();
  });
});
