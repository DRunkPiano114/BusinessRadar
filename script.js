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
        this.radiusCircle = null;
        this.businessType = '';
        this.aiBackendUrl = 'http://localhost:5001/api';
        
        // Events will be loaded dynamically via AI search
        this.events = [];

        // Initialize everything except map (map will be initialized by initMap callback)
        this.getUserLocation();
        this.bindEvents();
        this.updateStatus('Found ' + this.events.length + ' nearby events');
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
        
        // Draw radius circle
        this.drawRadiusCircle();
        
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
                        this.drawRadiusCircle();
                    }
                    
                    // Search for events after getting location
                    this.searchEvents();
                },
                (error) => {
                    console.log('Unable to get location, using default location (Canberra)');
                    // Use Canberra as default location
                    this.userLocation = { lat: -35.2809, lng: 149.1300 };
                    
                    if (this.map) {
                        this.map.setCenter({ lat: this.userLocation.lat, lng: this.userLocation.lng });
                        this.addUserLocationMarker();
                        this.drawRadiusCircle();
                    }
                    
                    // Search for events with default location
                    this.searchEvents();
                }
            );
        } else {
            // Use Canberra as default location
            this.userLocation = { lat: -35.2809, lng: 149.1300 };
            
            if (this.map) {
                this.map.setCenter({ lat: this.userLocation.lat, lng: this.userLocation.lng });
                this.addUserLocationMarker();
                this.drawRadiusCircle();
            }
            
            // Search for events with default location
            this.searchEvents();
        }
    }

    async searchEvents() {
        if (!this.userLocation) {
            console.log('No user location available for event search');
            return;
        }

        try {
            this.updateStatus('🤖 AI正在搜索附近事件...');
            
            const response = await fetch(`${this.aiBackendUrl}/discover-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: this.userLocation,
                    radius_km: this.searchRadius,
                    business_type: this.businessType || 'general',
                    search_real_events: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.events) {
                this.events = data.events;
                this.updateStatus(`✅ AI找到 ${this.events.length} 个附近事件`);
                
                // Render events and markers
                this.renderEvents();
                this.renderMapMarkers();
            } else {
                throw new Error(data.error || 'Failed to discover events');
            }
        } catch (error) {
            console.error('Error searching for events:', error);
            this.updateStatus('❌ 事件搜索失败，请稍后重试');
            
            // Show empty state
            this.events = [];
            this.renderEvents();
            this.renderMapMarkers();
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

        // Search for events at new location
        this.drawRadiusCircle();
        this.searchEvents();

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

    async renderEvents() {
        const eventsList = document.getElementById('eventsList');
        const filteredEvents = this.getFilteredEvents();
        
        // Handle empty events list
        if (filteredEvents.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    <div class="no-events-icon">🔍</div>
                    <div class="no-events-title">暂无事件</div>
                    <div class="no-events-message">AI正在搜索附近事件，请稍候...</div>
                </div>
            `;
            return;
        }
        
        // Show loading state
        eventsList.innerHTML = '<div class="loading-events">🤖 AI正在生成商业建议...</div>';
        
        // Generate AI content for each event
        const eventsWithAI = await this.generateAIForEvents(filteredEvents);
        
        eventsList.innerHTML = eventsWithAI.map(event => `
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
                <div class="business-tip ai-generated-tip">
                    <div class="ai-loading-small" id="loading-${event.id}">🤖 AI生成中...</div>
                    <div class="ai-tip-content" id="tip-${event.id}" style="display: none;">
                        💡 AI Business Tip: <span class="ai-tip-text">${event.ai_business_tip || '正在生成...'}</span>
                    </div>
                </div>
                ${event.aiGenerated ? '<div class="ai-badge">🤖 AI Generated</div>' : ''}
                ${event.opportunity_rating ? `<div class="opportunity-rating">⭐ Opportunity Rating: ${event.opportunity_rating}/10</div>` : ''}
                ${event.revenue_potential ? `<div class="revenue-potential">💰 Revenue Potential: ${event.revenue_potential}</div>` : ''}
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
        
        // Generate AI tips for each event asynchronously
        this.generateAITipsForEvents(eventsWithAI);
    }

    async generateAIForEvents(events) {
        // Generate AI content for each event in parallel
        const eventsWithAI = await Promise.all(events.map(async (event) => {
            try {
                const aiContent = await this.generateEventAI(event);
                return {
                    ...event,
                    ai_business_tip: aiContent.business_tip,
                    opportunity_rating: aiContent.opportunity_rating,
                    revenue_potential: aiContent.revenue_potential,
                    aiGenerated: true
                };
            } catch (error) {
                console.error(`Error generating AI for event ${event.id}:`, error);
                return {
                    ...event,
                    ai_business_tip: this.getFallbackBusinessTip(event),
                    opportunity_rating: Math.floor(Math.random() * 3) + 6,
                    revenue_potential: this.calculateRevenuePotential(event),
                    aiGenerated: false
                };
            }
        }));

        return eventsWithAI;
    }

    async generateAITipsForEvents(events) {
        // Generate AI tips for each event and update the UI
        events.forEach(async (event) => {
            try {
                const aiContent = await this.generateEventAI(event);
                
                // Update the specific event's tip
                const loadingElement = document.getElementById(`loading-${event.id}`);
                const tipElement = document.getElementById(`tip-${event.id}`);
                const tipTextElement = tipElement?.querySelector('.ai-tip-text');
                
                if (loadingElement && tipElement && tipTextElement) {
                    loadingElement.style.display = 'none';
                    tipTextElement.textContent = aiContent.business_tip;
                    tipElement.style.display = 'block';
                }
            } catch (error) {
                console.error(`Error generating AI tip for event ${event.id}:`, error);
                
                // Show fallback tip
                const loadingElement = document.getElementById(`loading-${event.id}`);
                const tipElement = document.getElementById(`tip-${event.id}`);
                const tipTextElement = tipElement?.querySelector('.ai-tip-text');
                
                if (loadingElement && tipElement && tipTextElement) {
                    loadingElement.style.display = 'none';
                    tipTextElement.textContent = this.getFallbackBusinessTip(event);
                    tipElement.style.display = 'block';
                }
            }
        });
    }

    async generateEventAI(event) {
        try {
            const response = await fetch(`${this.aiBackendUrl}/generate-event-ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: event,
                    businessType: this.businessType,
                    radius: this.searchRadius
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.ai_content || this.getFallbackAI(event);
            
        } catch (error) {
            console.error('AI generation error:', error);
            return this.getFallbackAI(event);
        }
    }

    getFallbackAI(event) {
        const businessType = this.businessType || 'business';
        const tips = {
            'restaurant': `Perfect for food vendors! Set up a food stall and offer event-specific menu items. Consider partnering with local suppliers for fresh ingredients.`,
            'retail': `Great opportunity for pop-up retail! Display your products and offer event discounts. Bring mobile payment options and promotional materials.`,
            'services': `Network with attendees and organizers. Bring business cards, promotional materials, and consider offering on-site consultations.`,
            'default': `Good opportunity for ${businessType} businesses. Consider setting up a booth or networking with attendees and organizers.`
        };

        return {
            business_tip: tips[businessType] || tips.default,
            opportunity_rating: Math.floor(Math.random() * 3) + 6, // 6-8 range
            revenue_potential: this.calculateRevenuePotential(event)
        };
    }

    getFallbackBusinessTip(event) {
        const businessType = this.businessType || 'business';
        const tips = {
            'restaurant': `Perfect for food vendors! Set up a food stall and offer event-specific menu items.`,
            'retail': `Great opportunity for pop-up retail! Display your products and offer event discounts.`,
            'services': `Network with attendees and organizers. Bring business cards and promotional materials.`,
            'default': `Good opportunity for ${businessType} businesses. Consider setting up a booth or networking.`
        };

        return tips[businessType] || tips.default;
    }

    calculateRevenuePotential(event) {
        const baseRevenue = event.attendees * 0.1; // 10% conversion rate
        const distanceFactor = this.calculateDistance(event) < 2 ? 1.2 : 0.8; // Closer events have higher potential
        const categoryFactor = event.type === 'market' ? 1.5 : 1.0; // Markets are better for business
        
        const potential = Math.round(baseRevenue * distanceFactor * categoryFactor);
        
        if (potential > 1000) return `$${potential}+`;
        if (potential > 500) return `$${potential}`;
        if (potential > 100) return `$${potential}`;
        return `$${Math.max(50, potential)}`;
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
        this.drawRadiusCircle();
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

    drawRadiusCircle() {
        // Remove existing radius circle
        if (this.radiusCircle) {
            this.radiusCircle.setMap(null);
        }

        // Create radius circle
        this.radiusCircle = new google.maps.Circle({
            strokeColor: '#667eea',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#667eea',
            fillOpacity: 0.1,
            map: this.map,
            center: this.userLocation,
            radius: this.searchRadius * 1000 // Convert km to meters
        });
    }


    updateEventsWithAI(aiEvents) {
        // Update existing events with AI insights instead of adding new events
        aiEvents.forEach(aiEvent => {
            // Find matching event by title and location
            const existingEvent = this.events.find(e => 
                e.title.toLowerCase() === aiEvent.title.toLowerCase() &&
                e.location.toLowerCase() === aiEvent.location.toLowerCase()
            );
            
            if (existingEvent) {
                // Update existing event with AI insights
                existingEvent.ai_business_tip = aiEvent.business_tip || aiEvent.ai_business_tip;
                existingEvent.opportunity_rating = aiEvent.opportunity_rating;
                existingEvent.revenue_potential = aiEvent.revenue_potential;
                existingEvent.ai_insights = aiEvent.insights || aiEvent.ai_insights;
                existingEvent.aiGenerated = true;
                existingEvent.ai_enhanced = true;
            }
        });
    }

    mergeAIEvents(aiEvents) {
        // Add AI events to existing events with unique IDs
        const maxId = Math.max(...this.events.map(e => e.id), 0);
        
        aiEvents.forEach((event, index) => {
            const newEvent = {
                ...event,
                id: maxId + index + 1,
                aiGenerated: true,
                source: event.source || 'AI Discovery',
                sourceUrl: event.sourceUrl || '#'
            };
            
            // Check if event already exists (avoid duplicates)
            const exists = this.events.some(e => 
                e.title.toLowerCase() === event.title.toLowerCase() &&
                e.location.toLowerCase() === event.location.toLowerCase()
            );
            
            if (!exists) {
                this.events.push(newEvent);
            }
        });
    }

    async analyzeCurrentOpportunities() {
        try {
            this.updateStatus('🧠 AI正在分析商业机会...');
            
            const filteredEvents = this.getFilteredEvents();
            if (filteredEvents.length === 0) {
                this.updateStatus('⚠️ 没有找到活动进行分析');
                return;
            }

            // Analyze each event
            for (const event of filteredEvents.slice(0, 5)) { // Analyze top 5 events
                try {
                    const response = await fetch(`${this.aiBackendUrl}/analyze-opportunity`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            event: event,
                            business_type: this.businessType
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.insights) {
                            // Update event with AI insights
                            Object.assign(event, data.insights);
                        }
                    }
                } catch (error) {
                    console.error(`Error analyzing event ${event.id}:`, error);
                }
            }

            // Re-render with updated insights
            this.renderEvents();
            this.updateStatus(`🧠 AI分析完成 - 已分析 ${Math.min(filteredEvents.length, 5)} 个活动`);
            
        } catch (error) {
            console.error('AI analysis error:', error);
            this.updateStatus('⚠️ AI分析失败');
        }
    }

    updateBusinessType() {
        this.businessType = document.getElementById('businessType').value;
        this.updateStatus(`Business type updated: ${this.businessType || 'All Businesses'}`);
        
        // Search for events with new business type
        this.searchEvents();
    }
}

// Global functions
function updateDistance(value) {
    const distanceValue = document.getElementById('distanceValue');
    const radiusCircle = document.getElementById('radiusCircle');
    
    // Update display with animation
    distanceValue.textContent = value;
    app.searchRadius = parseInt(value);
    
    // Update radius circle visual feedback
    if (radiusCircle) {
        const percentage = ((value - 1) / 49) * 100;
        radiusCircle.style.left = `${percentage}%`;
        radiusCircle.style.transform = `scale(${1 + (value / 50) * 0.5})`;
    }
    
    // Search for events with new radius
    app.searchEvents();
    
    // Add visual feedback to map
    if (app.map) {
        // Draw radius circle on map
        app.drawRadiusCircle();
    }
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

// AI Functions

function analyzeCurrentOpportunities() {
    if (app) {
        app.analyzeCurrentOpportunities();
    }
}

function updateBusinessType() {
    if (app) {
        app.updateBusinessType();
    }
}


// Initialize application
let app;

// Error handling for Google Maps API
function handleMapError() {
    console.error('Google Maps API failed to load');
    const statusBar = document.getElementById('statusBar');
    if (statusBar) {
        statusBar.innerHTML = `
            <div style="color: #dc2626; padding: 10px; text-align: center;">
                ⚠️ 地图加载失败 - 请检查API密钥配置
                <br>
                <small>Error: Google Maps API failed to load</small>
            </div>
        `;
    }
    
    // Show error message in map container
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8fafc; color: #64748b;">
                <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                <h3 style="margin-bottom: 8px; color: #1e293b;">地图无法加载</h3>
                <p style="text-align: center; margin-bottom: 16px;">
                    请检查Google Maps API密钥配置<br>
                    确保已启用Maps JavaScript API和Places API
                </p>
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-top: 16px; max-width: 400px;">
                    <strong>解决步骤：</strong>
                    <ol style="text-align: left; margin: 8px 0; padding-left: 20px;">
                        <li>访问 <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
                        <li>选择您的项目</li>
                        <li>启用 "Maps JavaScript API" 和 "Places API"</li>
                        <li>检查API密钥的域名限制设置</li>
                    </ol>
                </div>
            </div>
        `;
    }
}

function initMap() {
    try {
        console.log('Initializing Google Maps...');
        
        // Initialize app if not already initialized
        if (!app) {
            app = new EventMapApp();
        }
        
        // Now initialize the map
        if (app && typeof google !== 'undefined' && google.maps) {
            app.initMap();
            console.log('Google Maps initialized successfully');
        } else {
            console.error('Google Maps API not available');
            handleMapError();
        }
    } catch (error) {
        console.error('Error initializing map:', error);
        handleMapError();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // App will be initialized when Google Maps loads
});

