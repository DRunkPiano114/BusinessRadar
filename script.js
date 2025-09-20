class EventMapApp {
    constructor() {
        this.currentFilter = 'all';
        this.searchRadius = 5;
        this.selectedEvent = null;
        this.userLocation = { lat: -35.2809, lng: 149.1300 }; // Canberra default location
        this.map = null;
        this.markers = [];
        this.userMarker = null;
        this.infoWindow = null;
        this.searchMarker = null;
        this.autocomplete = null;
        
        // Mock event data (real coordinates around Canberra)
        this.events = [
            {
                id: 1,
                title: 'Canberra Floriade',
                type: 'festival',
                date: '2025-09-25',
                time: '09:00',
                location: 'Commonwealth Park',
                lat: -35.2756,
                lng: 149.1310,
                attendees: 15000,
                description: 'Spring flower exhibition, expected to attract many tourists and families',
                businessTip: 'Suitable for: Food stalls, flower sales, photography services, children\'s entertainment',
                source: 'visitcanberra.com.au',
                sourceUrl: 'https://visitcanberra.com.au/events/floriade'
            },
            {
                id: 2,
                title: 'Weekend Farmers Market',
                type: 'market',
                date: '2025-09-21',
                time: '08:00',
                location: 'Old Bus Depot Markets',
                lat: -35.2823,
                lng: 149.1276,
                attendees: 3000,
                description: 'Weekly organic produce market, local community gathering place',
                businessTip: 'Suitable for: Organic food, handicrafts, coffee stalls, baked goods',
                source: 'oldbusdepomarkets.com.au',
                sourceUrl: 'https://oldbusdepomarkets.com.au'
            },
            {
                id: 3,
                title: 'Tech Innovation Expo',
                type: 'exhibition',
                date: '2025-09-28',
                time: '10:00',
                location: 'National Convention Centre',
                lat: -35.2945,
                lng: 149.1362,
                attendees: 8000,
                description: 'Latest technology product showcase and demonstrations, business professionals gathering',
                businessTip: 'Suitable for: IT services, electronics, business consulting, training services',
                source: 'eventbrite.com.au',
                sourceUrl: 'https://eventbrite.com.au/e/tech-innovation-expo'
            },
            {
                id: 4,
                title: 'Canberra Marathon',
                type: 'sports',
                date: '2025-09-22',
                time: '07:00',
                location: 'Parliament Hill Area',
                lat: -35.2688,
                lng: 149.1337,
                attendees: 12000,
                description: 'Annual marathon event, route passes through major attractions',
                businessTip: 'Suitable for: Sports equipment, energy food, massage services, sports drinks',
                source: 'canberramarathon.org.au',
                sourceUrl: 'https://canberramarathon.org.au'
            },
            {
                id: 5,
                title: 'Mid-Autumn Cultural Festival',
                type: 'cultural',
                date: '2025-09-29',
                time: '18:00',
                location: 'Chinese Garden',
                lat: -35.2891,
                lng: 149.1189,
                attendees: 5000,
                description: 'Traditional Mid-Autumn Festival celebration, multicultural experience',
                businessTip: 'Suitable for: Mooncake sales, tea ceremony performances, cultural goods, Asian cuisine',
                source: 'facebook.com/events',
                sourceUrl: 'https://facebook.com/events/mid-autumn-festival-canberra'
            },
            {
                id: 6,
                title: 'Entrepreneurs Meetup',
                type: 'conference',
                date: '2025-09-26',
                time: '19:00',
                location: 'New Parliament Triangle',
                lat: -35.2775,
                lng: 149.1285,
                attendees: 200,
                description: 'Local entrepreneur networking event, high-quality business network',
                businessTip: 'Suitable for: Business services, consulting, investment services, co-working spaces',
                source: 'meetup.com',
                sourceUrl: 'https://meetup.com/canberra-entrepreneurs'
            },
            {
                id: 7,
                title: 'Lakeside Music Festival',
                type: 'festival',
                date: '2025-09-30',
                time: '16:00',
                location: 'Lake Burley Griffin',
                lat: -35.2904,
                lng: 149.1299,
                attendees: 8000,
                description: 'Outdoor music festival, gathering of young people and music lovers',
                businessTip: 'Suitable for: Audio equipment, beverage stalls, music merchandise, outdoor gear',
                source: 'musicact.org.au',
                sourceUrl: 'https://musicact.org.au/events/lakeside-music-festival'
            },
            {
                id: 8,
                title: 'Art Auction',
                type: 'exhibition',
                date: '2025-10-01',
                time: '14:00',
                location: 'National Gallery of Australia',
                lat: -35.2967,
                lng: 149.1321,
                attendees: 500,
                description: 'High-end art auction, collectors and art enthusiasts participation',
                businessTip: 'Suitable for: Art appraisal, insurance services, fine dining, collection consulting',
                source: 'nga.gov.au',
                sourceUrl: 'https://nga.gov.au/exhibitions/art-auction'
            }
        ];

        this.init();
    }

    init() {
        this.initMap();
        this.getUserLocation();
        this.renderEvents();
        this.bindEvents();
        this.updateStatus('Found ' + this.events.length + ' nearby events');
    }

    initMap() {
        // Initialize Google Map, centered on Canberra
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -35.2809, lng: 149.1300 },
            zoom: 13,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Create info window
        this.infoWindow = new google.maps.InfoWindow();

        // Initialize autocomplete
        this.initAutocomplete();

        // Add user location marker
        this.addUserLocationMarker();
        
        // Render event markers
        this.renderMapMarkers();
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Update map center if map is initialized
                    if (this.map) {
                        this.map.setCenter({ lat: this.userLocation.lat, lng: this.userLocation.lng });
                        this.addUserLocationMarker();
                        this.renderMapMarkers();
                    }
                },
                (error) => {
                    console.log('Unable to get location, using default location (Canberra)');
                    if (this.map) {
                        this.addUserLocationMarker();
                        this.renderMapMarkers();
                    }
                }
            );
        } else {
            if (this.map) {
                this.addUserLocationMarker();
                this.renderMapMarkers();
            }
        }
    }

    initAutocomplete() {
        const searchInput = document.getElementById('searchInput');
        
        // Create autocomplete
        this.autocomplete = new google.maps.places.Autocomplete(searchInput, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'au' } // Restrict to Australia
        });

        // Listen for place selection
        this.autocomplete.addListener('place_changed', () => {
            this.handlePlaceSelection();
        });
    }

    handlePlaceSelection() {
        const place = this.autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
            console.log('No details available for input: ' + place.name);
            return;
        }

        // Clear previous search marker
        if (this.searchMarker) {
            this.searchMarker.setMap(null);
        }

        // Create search marker
        const searchIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#f59e0b',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3
        };

        this.searchMarker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            icon: searchIcon,
            title: place.name || 'Searched Location'
        });

        // Center map on searched location
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);

        // Update user location to searched location for distance calculations
        this.userLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        // Re-render events with new center
        this.renderEvents();
        this.renderMapMarkers();

        // Update status
        this.updateStatus(`Searched: ${place.name || place.formatted_address}`);

        // Close any open info windows
        this.infoWindow.close();
    }

    addUserLocationMarker() {
        if (this.userMarker) {
            this.userMarker.setMap(null);
        }
        
        // Create user location marker
        const userIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3
        };
        
        this.userMarker = new google.maps.Marker({
            position: { lat: this.userLocation.lat, lng: this.userLocation.lng },
            map: this.map,
            icon: userIcon,
            title: 'Your Location'
        });
    }

    renderEvents() {
        const eventsList = document.getElementById('eventsList');
        const filteredEvents = this.getFilteredEvents();
        
        eventsList.innerHTML = filteredEvents.map(event => `
            <div class="event-card" data-id="${event.id}" onclick="app.selectEvent(${event.id})">
                <div class="event-title">${event.title}</div>
                <div class="event-details">
                    <div class="event-detail">
                        <svg class="icon" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                        </svg>
                        ${event.date} ${event.time}
                    </div>
                    <div class="event-detail">
                        <svg class="icon" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                        </svg>
                        ${event.location}
                    </div>
                    <div class="event-detail">
                        <svg class="icon" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                        Expected ${event.attendees.toLocaleString()} attendees
                    </div>
                    <div class="event-detail">
                        📏 ${this.calculateDistance(event).toFixed(1)} km from you
                    </div>
                </div>
                <div class="event-type">${this.getTypeLabel(event.type)}</div>
                <div class="business-tip">
                    💡 Business Tip: ${event.businessTip}
                </div>
                <div class="event-source">
                    <span>📰 Source:</span>
                    <a href="${event.sourceUrl}" target="_blank" class="source-link" rel="noopener noreferrer">
                        ${event.source}
                        <svg class="source-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                        </svg>
                    </a>
                </div>
            </div>
        `).join('');
    }

    renderMapMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
        
        const filteredEvents = this.getFilteredEvents();
        
        filteredEvents.forEach(event => {
            // Create custom marker icon
            const markerIcon = {
                path: 'M0,0 C-2,-20 -10,-22 -10,-30 A10,10 0 1,1 10,-30 C10,-22 2,-20 0,0 z',
                fillColor: this.getMarkerColor(event.type),
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3,
                scale: 1.5,
                anchor: new google.maps.Point(0, -30)
            };
            
            // Create marker
            const marker = new google.maps.Marker({
                position: { lat: event.lat, lng: event.lng },
                map: this.map,
                icon: markerIcon,
                title: event.title
            });
            
            // Create info window content
            const infoContent = `
                <div class="info-window">
                    <div class="popup-title">${event.title}</div>
                    <div class="popup-details">
                        📅 ${event.date} ${event.time}<br>
                        📍 ${event.location}<br>
                        👥 ${event.attendees.toLocaleString()} attendees<br>
                        📏 ${this.calculateDistance(event).toFixed(1)} km from you<br>
                        📝 ${event.description}<br>
                        📰 Source: <a href="${event.sourceUrl}" target="_blank" style="color: #3b82f6;">${event.source}</a>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn primary" onclick="app.addToCalendar(${event.id})">Add to Calendar</button>
                        <button class="popup-btn secondary" onclick="app.shareEvent(${event.id})">Share</button>
                    </div>
                </div>
            `;
            
            // Marker click event
            marker.addListener('click', () => {
                this.selectEvent(event.id);
                this.infoWindow.setContent(infoContent);
                this.infoWindow.open(this.map, marker);
            });
            
            // Store marker reference
            marker.eventId = event.id;
            this.markers.push(marker);
        });
    }

    getMarkerColor(type) {
        const colors = {
            festival: '#e11d48',
            market: '#059669',
            exhibition: '#7c3aed',
            conference: '#2563eb',
            sports: '#dc2626',
            cultural: '#ea580c',
            default: '#667eea'
        };
        return colors[type] || colors.default;
    }

    selectEvent(eventId) {
        // Update list selection state
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.remove('selected');
            if (parseInt(card.dataset.id) === eventId) {
                card.classList.add('selected');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Update map marker selection state
        this.markers.forEach(marker => {
            if (marker.eventId === eventId) {
                // Move map center to selected event
                const event = this.events.find(e => e.id === eventId);
                if (event) {
                    this.map.setCenter({ lat: event.lat, lng: event.lng });
                    this.map.setZoom(15);
                    
                    // Open info window
                    const infoContent = `
                        <div class="info-window">
                            <div class="popup-title">${event.title}</div>
                            <div class="popup-details">
                                📅 ${event.date} ${event.time}<br>
                                📍 ${event.location}<br>
                                👥 ${event.attendees.toLocaleString()} attendees<br>
                                📏 ${this.calculateDistance(event).toFixed(1)} km from you<br>
                                📝 ${event.description}<br>
                                📰 Source: <a href="${event.sourceUrl}" target="_blank" style="color: #3b82f6;">${event.source}</a>
                            </div>
                            <div class="popup-actions">
                                <button class="popup-btn primary" onclick="app.addToCalendar(${event.id})">Add to Calendar</button>
                                <button class="popup-btn secondary" onclick="app.shareEvent(${event.id})">Share</button>
                            </div>
                        </div>
                    `;
                    this.infoWindow.setContent(infoContent);
                    this.infoWindow.open(this.map, marker);
                }
            }
        });
        
        this.selectedEvent = eventId;
    }

    getFilteredEvents() {
        let filtered = this.events;
        
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(event => event.type === this.currentFilter);
        }
        
        // Filter by distance
        filtered = filtered.filter(event => {
            return this.calculateDistance(event) <= this.searchRadius;
        });
        
        // Sort by distance
        filtered.sort((a, b) => this.calculateDistance(a) - this.calculateDistance(b));
        
        return filtered;
    }

    calculateDistance(event) {
        // Calculate distance using Haversine formula
        const R = 6371; // Earth radius (km)
        const dLat = this.deg2rad(event.lat - this.userLocation.lat);
        const dLng = this.deg2rad(event.lng - this.userLocation.lng);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(this.userLocation.lat)) * Math.cos(this.deg2rad(event.lat)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    updateVisibleEvents() {
        // Update visible events when map moves
        this.renderEvents();
    }

    bindEvents() {
        // Filter tag clicks
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.currentFilter = tag.dataset.type;
                this.renderEvents();
                this.renderMapMarkers();
                this.updateStatus(`Filter: ${this.getTypeLabel(this.currentFilter)}`);
            });
        });
    }

    getTypeLabel(type) {
        const labels = {
            all: 'All Events',
            festival: 'Festival',
            market: 'Market',
            exhibition: 'Exhibition',
            conference: 'Conference',
            sports: 'Sports',
            cultural: 'Cultural'
        };
        return labels[type] || type;
    }

    updateStatus(message) {
        document.getElementById('statusBar').innerHTML = message;
    }

    clearSearch() {
        // Clear search marker
        if (this.searchMarker) {
            this.searchMarker.setMap(null);
            this.searchMarker = null;
        }
        
        // Clear search input
        document.getElementById('searchInput').value = '';
        
        // Reset to original user location
        this.userLocation = { lat: -35.2809, lng: 149.1300 };
        this.map.setCenter({ lat: this.userLocation.lat, lng: this.userLocation.lng });
        this.map.setZoom(13);
        
        // Re-render everything
        this.addUserLocationMarker();
        this.renderEvents();
        this.renderMapMarkers();
        this.updateStatus('Search cleared');
    }

    addToCalendar(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            // Create calendar event URL (Google Calendar format)
            const startDate = event.date.replace(/-/g, '') + 'T' + event.time.replace(':', '') + '00';
            const endDate = event.date.replace(/-/g, '') + 'T' + (parseInt(event.time.split(':')[0]) + 2).toString().padStart(2, '0') + event.time.split(':')[1] + '00';
            
            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description + ' - ' + event.businessTip)}&location=${encodeURIComponent(event.location)}`;
            
            window.open(calendarUrl, '_blank');
        }
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const shareText = `🎯 Business Opportunity Found! ${event.title}\n📅 ${event.date} ${event.time}\n📍 ${event.location}\n👥 Expected ${event.attendees} attendees\n💡 ${event.businessTip}\n📰 Details: ${event.sourceUrl}`;
            
            if (navigator.share) {
                navigator.share({
                    title: event.title,
                    text: shareText,
                    url: event.sourceUrl
                });
            } else {
                // Copy to clipboard
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Event information copied to clipboard!');
                });
            }
        }
    }
}

// Global functions
function updateDistance(value) {
    document.getElementById('distanceValue').textContent = value;
    app.searchRadius = parseInt(value);
    app.renderEvents();
    app.renderMapMarkers();
    app.updateStatus(`Search radius: ${value}km - Found ${app.getFilteredEvents().length} events`);
}

function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query.trim() === '') {
        app.renderEvents();
        app.renderMapMarkers();
        return;
    }
    
    app.updateStatus('Searching: ' + query);
    
    // Check if the query looks like an address (contains common address keywords)
    const addressKeywords = ['street', 'avenue', 'road', 'drive', 'place', 'court', 'lane', 'way', 'st', 'ave', 'rd', 'dr', 'pl', 'ct', 'ln', 'wy'];
    const isAddressQuery = addressKeywords.some(keyword => query.includes(keyword)) || 
                         query.includes('canberra') || 
                         query.includes('act') ||
                         query.includes('australia');
    
    if (isAddressQuery) {
        // For address queries, trigger the autocomplete selection
        // This will be handled by the autocomplete listener
        app.updateStatus('Searching for address...');
    } else {
        // For event queries, filter events
        setTimeout(() => {
            const filteredEvents = app.events.filter(event => 
                event.title.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                app.getTypeLabel(event.type).toLowerCase().includes(query)
            );
            
            // Temporarily store original events, show search results
            const originalEvents = app.events;
            app.events = filteredEvents;
            app.renderEvents();
            app.renderMapMarkers();
            app.updateStatus(`Search results: Found ${filteredEvents.length} matching events`);
            
            // Restore original event list after 5 seconds
            setTimeout(() => {
                app.events = originalEvents;
                app.renderEvents();
                app.renderMapMarkers();
                app.updateStatus(`Found ${app.getFilteredEvents().length} nearby events`);
            }, 5000);
        }, 800);
    }
}

// Initialize application
let app;
function initMap() {
    app = new EventMapApp();
    // Map will be initialized in the constructor
}

document.addEventListener('DOMContentLoaded', () => {
    // App will be initialized when Google Maps loads
});


