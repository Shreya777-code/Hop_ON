// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // NAVIGATION
  // ===================================
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const text = this.textContent.trim();
      
      // Route to different pages based on nav item
      switch(text) {
        case 'Home':
          window.location.href = 'index.html';
          break;
        case 'Nearby Bus Stops':
          window.location.href = 'nearby-stops.html';
          break;
        case 'Bus Routes':
          window.location.href = 'bus-routes.html';
          break;
        case 'Tourist Places Near Me':
          window.location.href = 'tourist-places.html';
          break;
        case 'Help':
          window.location.href = 'help.html';
          break;
      }
    });
    
    // Add hover effect
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ===================================
  // PRIMARY ACTION BUTTON - Bus Stops Near Me
  // ===================================
  const primaryAction = document.querySelector('.primary-action');
  
  if (primaryAction) {
    primaryAction.addEventListener('click', function() {
      // Check if geolocation is available
      if ("geolocation" in navigator) {
        // Show loading state
        const originalText = this.querySelector('h2').textContent;
        this.querySelector('h2').textContent = 'Getting Location...';
        this.style.opacity = '0.7';
        
        navigator.geolocation.getCurrentPosition(
          // Success
          function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Redirect to nearby stops page with coordinates
            window.location.href = `nearby-stops.html?lat=${lat}&lon=${lon}`;
          },
          // Error
          function(error) {
            alert('Unable to get your location. Please enable location services and try again.');
            primaryAction.querySelector('h2').textContent = originalText;
            primaryAction.style.opacity = '1';
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  }

  // ===================================
  // ROUTE SEARCH FORM
  // ===================================
  const startInput = document.getElementById('start');
  const endInput = document.getElementById('end');
  const searchBtn = document.querySelector('.search-btn');

  // Get user's current location for start input
  if (startInput) {
    startInput.addEventListener('focus', function() {
      if (this.value === 'My Location' || this.value === '') {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              startInput.value = `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
              startInput.dataset.lat = position.coords.latitude;
              startInput.dataset.lon = position.coords.longitude;
            },
            function(error) {
              console.log('Could not get location');
            }
          );
        }
      }
    });
  }

  // Autocomplete suggestions (mock data - in production, connect to real API)
  const popularDestinations = [
    'Central Park',
    'City Market',
    'Museum District',
    'Old Town',
    'South Gate',
    'Grand Library',
    'Lake View Park',
    'East Garden',
    'University Campus',
    'Shopping Mall',
    'Train Station',
    'Airport',
    'Hospital',
    'City Hall'
  ];

  function setupAutocomplete(input) {
    if (!input) return;
    
    const wrapper = input.parentElement;
    let suggestionsList = wrapper.querySelector('.suggestions-list');
    
    if (!suggestionsList) {
      suggestionsList = document.createElement('div');
      suggestionsList.className = 'suggestions-list';
      wrapper.style.position = 'relative';
      wrapper.appendChild(suggestionsList);
    }

    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      suggestionsList.innerHTML = '';
      
      if (value.length < 2) {
        suggestionsList.style.display = 'none';
        return;
      }

      const matches = popularDestinations.filter(dest => 
        dest.toLowerCase().includes(value)
      );

      if (matches.length > 0) {
        suggestionsList.style.display = 'block';
        matches.slice(0, 5).forEach(match => {
          const item = document.createElement('div');
          item.className = 'suggestion-item';
          item.textContent = match;
          item.addEventListener('click', function() {
            input.value = match;
            suggestionsList.style.display = 'none';
          });
          suggestionsList.appendChild(item);
        });
      } else {
        suggestionsList.style.display = 'none';
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (!wrapper.contains(e.target)) {
        suggestionsList.style.display = 'none';
      }
    });
  }

  setupAutocomplete(endInput);

  // Search button functionality
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const start = startInput.value.trim();
      const end = endInput.value.trim();

      if (!start || start === 'My Location') {
        alert('Please enter or select your starting location');
        startInput.focus();
        return;
      }

      if (!end || end === 'Enter destination') {
        alert('Please enter your destination');
        endInput.focus();
        return;
      }

      // Show loading state
      searchBtn.textContent = 'Searching...';
      searchBtn.disabled = true;
      searchBtn.style.opacity = '0.7';

      // Simulate search delay (in production, this would be an API call)
      setTimeout(function() {
        // Redirect to results page with query parameters
        const params = new URLSearchParams({
          from: start,
          to: end,
          lat: startInput.dataset.lat || '',
          lon: startInput.dataset.lon || ''
        });
        
        window.location.href = `search-results.html?${params.toString()}`;
      }, 800);
    });

    // Enable search on Enter key
    [startInput, endInput].forEach(input => {
      if (input) {
        input.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            searchBtn.click();
          }
        });
      }
    });
  }

  // ===================================
  // MAP INTERACTION
  // ===================================
  const mapContainer = document.querySelector('.map-container');
  const mapImage = document.querySelector('.map-image');

  if (mapContainer && mapImage) {
    // Add click handler to map
    mapContainer.addEventListener('click', function() {
      // Open full-screen map view
      window.location.href = 'map-view.html';
    });

    // Add hover effect
    mapContainer.style.cursor = 'pointer';
    mapContainer.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
      this.style.transition = 'transform 0.3s ease';
    });

    mapContainer.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }
  

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===================================
  // FORM VALIDATION STYLING
  // ===================================
  const inputs = document.querySelectorAll('input[type="text"]');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() === '' || 
          this.value === 'My Location' || 
          this.value === 'Enter destination') {
        this.style.borderColor = '#ff6b6b';
      } else {
        this.style.borderColor = '#5aa9a1';
      }
    });

    input.addEventListener('focus', function() {
      this.style.borderColor = '#5aa9a1';
    });
  });

  // ===================================
  // SWAP START AND END LOCATIONS
  // ===================================
  // Add a swap button (you can add this HTML element if needed)
  function addSwapButton() {
    if (!startInput || !endInput) return;
    
    const routeFields = document.querySelector('.route-fields');
    const swapBtn = document.createElement('button');
    swapBtn.type = 'button';
    swapBtn.className = 'swap-btn';
    swapBtn.innerHTML = '⇅';
    swapBtn.title = 'Swap locations';
    
    // Insert between the two input groups
    const endInputGroup = endInput.closest('.input-group');
    routeFields.insertBefore(swapBtn, endInputGroup);
    
    swapBtn.addEventListener('click', function() {
      const temp = startInput.value;
      const tempLat = startInput.dataset.lat;
      const tempLon = startInput.dataset.lon;
      
      startInput.value = endInput.value;
      startInput.dataset.lat = endInput.dataset.lat || '';
      startInput.dataset.lon = endInput.dataset.lon || '';
      
      endInput.value = temp;
      endInput.dataset.lat = tempLat || '';
      endInput.dataset.lon = tempLon || '';
      
      // Animation
      this.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
      }, 300);
    });
  }

  // Uncomment to add swap functionality
  // addSwapButton();

  // ===================================
  // LOCATION BANNER INTERACTION
  // ===================================
  const locationBanner = document.querySelector('.location-banner');
  
  if (locationBanner) {
    locationBanner.addEventListener('click', function() {
      if ("geolocation" in navigator) {
        const locationText = this.querySelector('.location-text span');
        const originalText = locationText.innerHTML;
        
        locationText.innerHTML = '<strong>📍 Getting your location...</strong>';
        this.style.opacity = '0.7';
        
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            locationText.innerHTML = '<strong>✓ Location updated!</strong>';
            
            setTimeout(() => {
              window.location.href = `nearby-stops.html?lat=${lat}&lon=${lon}&updated=true`;
            }, 800);
          },
          function(error) {
            alert('Unable to get your location. Please enable location services.');
            locationText.innerHTML = originalText;
            locationBanner.style.opacity = '1';
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  }

  // ===================================
  // VIEW SCHEDULE BUTTONS
  // ===================================
  const viewScheduleBtns = document.querySelectorAll('.view-schedule-btn');
  
  viewScheduleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const routeNum = this.dataset.route;
      
      // Show loading state
      this.textContent = 'Loading...';
      this.disabled = true;
      this.style.opacity = '0.7';
      
      setTimeout(() => {
        window.location.href = `schedule.html?route=${routeNum}`;
      }, 500);
    });
  });

  // ===================================
  // ANALYTICS / TRACKING (Optional)
  // ===================================
  function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
    // In production, send to analytics service
    // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
  }

  // Track button clicks
  if (searchBtn) {
    searchBtn.addEventListener('click', () => trackEvent('Search', 'click', 'Show Buses'));
  }
  
  if (primaryAction) {
    primaryAction.addEventListener('click', () => trackEvent('Location', 'click', 'Bus Stops Near Me'));
  }

});
