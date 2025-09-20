"""
AI-Powered Business Radar Backend
Intelligent event discovery and business opportunity analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime, timedelta
import google.generativeai as genai
from typing import List, Dict, Any
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use the correct model name for Gemini 1.5
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    logger.warning("GEMINI_API_KEY not found. AI features will be limited.")

class AIEventDiscovery:
    """AI-powered event discovery and business analysis"""
    
    def __init__(self):
        self.search_apis = {
            'google': self._search_google_events,
            'eventbrite': self._search_eventbrite,
            'facebook': self._search_facebook_events
        }
    
    def discover_events(self, location: Dict[str, float], radius_km: int, 
                       business_type: str = None, date_range: int = 30, search_real_events: bool = False) -> List[Dict[str, Any]]:
        """
        Discover events using AI-powered search and analysis
        
        Args:
            location: {'lat': float, 'lng': float}
            radius_km: Search radius in kilometers
            business_type: Type of business (restaurant, retail, etc.)
            date_range: Days to search ahead
        
        Returns:
            List of discovered events with AI analysis
        """
        try:
            if search_real_events:
                # Search for real events using web search and AI analysis
                return self._search_real_events(location, radius_km, business_type, date_range)
            else:
                # Use existing mock data with AI enhancement
                return self._get_enhanced_mock_events(location, radius_km, business_type)
            
        except Exception as e:
            logger.error(f"Error in event discovery: {str(e)}")
            return []
    
    def _search_real_events(self, location: Dict[str, float], radius_km: int, 
                           business_type: str, date_range: int) -> List[Dict[str, Any]]:
        """Search for real events using web search and AI analysis"""
        try:
            # Get location name for better search queries
            location_name = self._get_location_name(location)
            
            # Generate location-specific search queries
            search_queries = [
                f"{location_name} events this week",
                f"{location_name} festivals markets exhibitions",
                f"{location_name} business networking events",
                f"{location_name} community events activities",
                f"events near {location_name} within {radius_km}km"
            ]
            
            # Add business-specific queries
            if business_type:
                business_queries = [
                    f"{location_name} {business_type} events opportunities",
                    f"{business_type} networking {location_name}",
                    f"{business_type} market events {location_name}"
                ]
                search_queries.extend(business_queries)
            
            all_events = []
            for query in search_queries:
                try:
                    events = self._search_events(query, location, radius_km)
                    all_events.extend(events)
                except Exception as e:
                    logger.error(f"Error searching for query '{query}': {str(e)}")
                    continue
            
            # Remove duplicates and analyze opportunities
            unique_events = self._deduplicate_events(all_events)
            analyzed_events = self._analyze_events_with_ai(unique_events, business_type)
            
            # Filter by radius and sort by relevance
            filtered_events = self._filter_by_radius(analyzed_events, location, radius_km)
            sorted_events = self._sort_by_relevance(filtered_events, business_type)
            
            return sorted_events[:20]  # Return top 20 most relevant events
            
        except Exception as e:
            logger.error(f"Error in _search_real_events: {str(e)}")
            return self._get_fallback_events(location, radius_km, business_type)
    
    def _get_location_name(self, location: Dict[str, float]) -> str:
        """Get location name from coordinates using reverse geocoding"""
        try:
            lat, lng = location.get('lat', 0), location.get('lng', 0)
            
            # Simple location name based on coordinates
            if lat and lng:
                # Simple location name based on coordinates
                if -35.5 <= lat <= -35.0 and 149.0 <= lng <= 149.2:
                    return "Canberra, Australia"
                elif -37.9 <= lat <= -37.7 and 144.9 <= lng <= 145.0:
                    return "Melbourne, Australia"
                elif -33.9 <= lat <= -33.8 and 151.1 <= lng <= 151.3:
                    return "Sydney, Australia"
                else:
                    return f"Location {lat:.2f},{lng:.2f}"
            
            return "Current Location"
            
        except Exception as e:
            logger.error(f"Error getting location name: {str(e)}")
            return "Current Location"
    
    def _get_enhanced_mock_events(self, location: Dict[str, float], radius_km: int, business_type: str) -> List[Dict[str, Any]]:
        """Get enhanced mock events with AI analysis"""
        # Use existing mock data but enhance with AI
        mock_events = self._get_fallback_events(location, radius_km, business_type)
        return self._analyze_events_with_ai(mock_events, business_type)
    
    def _get_fallback_events(self, location: Dict[str, float], radius_km: int, business_type: str) -> List[Dict[str, Any]]:
        """Get fallback mock events when real search fails"""
        # Return some mock events as fallback with real sources
        location_name = self._get_location_name(location)
        
        mock_events = [
            {
                'id': 1,
                'title': f'Local Community Event near {location_name}',
                'type': 'community',
                'date': '2025-09-25',
                'time': '10:00',
                'location': f'Near {location_name}',
                'lat': location.get('lat', -35.2809),
                'lng': location.get('lng', 149.1300),
                'attendees': 500,
                'description': 'Community gathering with local vendors and activities',
                'business_tip': f'Great opportunity for {business_type or "local"} businesses to connect with community',
                'source': 'Eventbrite',
                'sourceUrl': 'https://eventbrite.com.au',
                'ai_generated': True
            },
            {
                'id': 2,
                'title': f'Weekly Market at {location_name}',
                'type': 'market',
                'date': '2025-09-26',
                'time': '08:00',
                'location': f'Central {location_name}',
                'lat': location.get('lat', -35.2809) + 0.001,
                'lng': location.get('lng', 149.1300) + 0.001,
                'attendees': 1200,
                'description': 'Weekly farmers market with local produce and crafts',
                'business_tip': f'Perfect for {business_type or "food"} businesses to showcase products',
                'source': 'Facebook Events',
                'sourceUrl': 'https://facebook.com/events',
                'ai_generated': True
            },
            {
                'id': 3,
                'title': f'Business Networking Event - {location_name}',
                'type': 'conference',
                'date': '2025-09-27',
                'time': '18:00',
                'location': f'Business District, {location_name}',
                'lat': location.get('lat', -35.2809) - 0.001,
                'lng': location.get('lng', 149.1300) - 0.001,
                'attendees': 200,
                'description': 'Professional networking event for local businesses',
                'business_tip': f'Excellent opportunity for {business_type or "professional"} services to connect',
                'source': 'Meetup',
                'sourceUrl': 'https://meetup.com',
                'ai_generated': True
            }
        ]
        return mock_events
    
    
    def _generate_search_queries(self, location: str, radius_km: int, 
                                business_type: str, date_range: int) -> List[str]:
        """Generate intelligent search queries using AI"""
        if not GEMINI_API_KEY:
            return self._get_fallback_queries(business_type)
        
        try:
            prompt = f"""
            Generate 5 specific search queries to find business opportunities and events within {radius_km}km of {location}.
            
            Business type: {business_type or 'general'}
            Date range: Next {date_range} days
            Location: {location}
            
            Focus on:
            1. Local events, festivals, markets
            2. Business networking events
            3. Community gatherings
            4. Seasonal opportunities
            5. Industry-specific events
            
            Return only the search queries, one per line, without numbering.
            """
            
            response = model.generate_content(prompt)
            queries = [q.strip() for q in response.text.split('\n') if q.strip()]
            return queries[:5]
            
        except Exception as e:
            logger.error(f"Error generating search queries: {str(e)}")
            return self._get_fallback_queries(business_type)
    
    def _get_fallback_queries(self, business_type: str) -> List[str]:
        """Fallback queries when AI is not available"""
        base_queries = [
            f"events near me {business_type or ''}",
            f"local festivals markets {business_type or ''}",
            f"business networking events",
            f"community events gatherings",
            f"upcoming events this month"
        ]
        return base_queries
    
    def _search_google_events(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using Google Search API"""
        # This would integrate with Google Custom Search API
        # For now, return sample events with real sources
        location_name = self._get_location_name(location)
        
        sample_events = [
            {
                'id': f'google_{hash(query) % 1000}',
                'title': f'Community Event in {location_name}',
                'type': 'community',
                'date': '2025-09-25',
                'time': '10:00',
                'location': f'{location_name} Community Center',
                'lat': location.get('lat', -35.2809) + 0.002,
                'lng': location.get('lng', 149.1300) + 0.002,
                'attendees': 800,
                'description': f'Local community event in {location_name}',
                'source': 'Google Events',
                'sourceUrl': 'https://events.google.com',
                'ai_generated': False
            }
        ]
        return sample_events
    
    def _search_eventbrite(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using Eventbrite API"""
        # This would integrate with Eventbrite API
        # For now, return sample events with real sources
        location_name = self._get_location_name(location)
        
        sample_events = [
            {
                'id': f'eventbrite_{hash(query) % 1000}',
                'title': f'Business Workshop in {location_name}',
                'type': 'conference',
                'date': '2025-09-26',
                'time': '14:00',
                'location': f'{location_name} Business Hub',
                'lat': location.get('lat', -35.2809) - 0.002,
                'lng': location.get('lng', 149.1300) - 0.002,
                'attendees': 150,
                'description': f'Professional development workshop in {location_name}',
                'source': 'Eventbrite',
                'sourceUrl': 'https://eventbrite.com.au',
                'ai_generated': False
            }
        ]
        return sample_events
    
    def _search_facebook_events(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using Facebook Events API"""
        # This would integrate with Facebook Events API
        # For now, return sample events with real sources
        location_name = self._get_location_name(location)
        
        sample_events = [
            {
                'id': f'facebook_{hash(query) % 1000}',
                'title': f'Social Gathering in {location_name}',
                'type': 'cultural',
                'date': '2025-09-27',
                'time': '19:00',
                'location': f'{location_name} Cultural Center',
                'lat': location.get('lat', -35.2809) + 0.003,
                'lng': location.get('lng', 149.1300) - 0.003,
                'attendees': 300,
                'description': f'Social and cultural event in {location_name}',
                'source': 'Facebook Events',
                'sourceUrl': 'https://facebook.com/events',
                'ai_generated': False
            }
        ]
        return sample_events
    
    def _search_events(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using all available sources"""
        events = []
        for source, search_func in self.search_apis.items():
            try:
                source_events = search_func(query, location, radius_km)
                events.extend(source_events)
            except Exception as e:
                logger.error(f"Error searching {source}: {str(e)}")
        return events
    
    def _deduplicate_events(self, events: List[Dict]) -> List[Dict]:
        """Remove duplicate events based on title and location"""
        seen = set()
        unique_events = []
        for event in events:
            key = (event.get('title', '').lower(), event.get('location', '').lower())
            if key not in seen:
                seen.add(key)
                unique_events.append(event)
        return unique_events
    
    def _analyze_events_with_ai(self, events: List[Dict], business_type: str) -> List[Dict]:
        """Analyze events using AI to generate business insights"""
        if not GEMINI_API_KEY or not events:
            return events
        
        try:
            for event in events:
                # Generate business insights for each event
                insights = self._generate_business_insights(event, business_type)
                event.update(insights)
        except Exception as e:
            logger.error(f"Error analyzing events with AI: {str(e)}")
        
        return events
    
    def _generate_business_insights(self, event: Dict, business_type: str) -> Dict[str, Any]:
        """Generate AI-powered business insights for an event"""
        if not GEMINI_API_KEY:
            return self._get_fallback_insights(event, business_type)
        
        try:
            prompt = f"""
            Analyze this event for business opportunities:
            
            Event: {event.get('title', 'Unknown Event')}
            Description: {event.get('description', 'No description')}
            Location: {event.get('location', 'Unknown location')}
            Expected attendees: {event.get('attendees', 'Unknown')}
            Date: {event.get('date', 'Unknown date')}
            
            Business type: {business_type or 'general business'}
            
            Provide:
            1. Business opportunity rating (1-10)
            2. Specific business tips for this event
            3. Target audience analysis
            4. Revenue potential (low/medium/high)
            5. Preparation recommendations
            
            Return as JSON format.
            """
            
            response = model.generate_content(prompt)
            # Parse AI response and extract insights
            insights = self._parse_ai_insights(response.text)
            return insights
            
        except Exception as e:
            logger.error(f"Error generating business insights: {str(e)}")
            return self._get_fallback_insights(event, business_type)
    
    def _parse_ai_insights(self, ai_response: str) -> Dict[str, Any]:
        """Parse AI response to extract business insights"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        # Fallback parsing
        return {
            'opportunity_rating': 7,
            'business_tip': 'Consider promoting your business at this event',
            'target_audience': 'General public',
            'revenue_potential': 'medium',
            'preparation_tips': 'Prepare promotional materials and samples'
        }
    
    def _get_fallback_insights(self, event: Dict, business_type: str) -> Dict[str, Any]:
        """Fallback insights when AI is not available"""
        return {
            'opportunity_rating': 6,
            'business_tip': f'Great opportunity for {business_type or "your business"} to reach new customers',
            'target_audience': 'Local community',
            'revenue_potential': 'medium',
            'preparation_tips': 'Prepare your best products and promotional materials'
        }
    
    def _filter_by_radius(self, events: List[Dict], location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Filter events by radius from user location"""
        filtered_events = []
        for event in events:
            if 'lat' in event and 'lng' in event:
                distance = self._calculate_distance(location, event)
                if distance <= radius_km:
                    event['distance_km'] = round(distance, 1)
                    filtered_events.append(event)
        return filtered_events
    
    def _calculate_distance(self, loc1: Dict[str, float], loc2: Dict[str, float]) -> float:
        """Calculate distance between two coordinates using Haversine formula"""
        import math
        
        R = 6371  # Earth's radius in kilometers
        lat1, lng1 = math.radians(loc1['lat']), math.radians(loc1['lng'])
        lat2, lng2 = math.radians(loc2['lat']), math.radians(loc2['lng'])
        
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
    
    def _sort_by_relevance(self, events: List[Dict], business_type: str) -> List[Dict]:
        """Sort events by relevance to business type"""
        def relevance_score(event):
            score = event.get('opportunity_rating', 5)
            # Boost score for business type matches
            if business_type and business_type.lower() in event.get('business_tip', '').lower():
                score += 2
            return score
        
        return sorted(events, key=relevance_score, reverse=True)
    
    def generate_content(self, content_type, data):
        """Generate AI content based on type and data"""
        if not GEMINI_API_KEY:
            return self._get_fallback_content(content_type, data)
        
        try:
            events = data.get('events', [])
            business_type = data.get('businessType', 'All Businesses')
            radius = data.get('radius', 5)
            
            prompt = self._build_content_prompt(content_type, events, business_type, radius)
            
            response = model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error generating content: {str(e)}")
            return self._get_fallback_content(content_type, data)
    
    def _build_content_prompt(self, content_type, events, business_type, radius):
        """Build prompt for different content types"""
        events_summary = f"Found {len(events)} events within {radius}km radius for {business_type} business."
        
        if events:
            top_events = events[:3]
            events_details = "\n".join([
                f"- {event.get('title', 'Unknown')}: {event.get('location', 'Unknown location')} "
                f"(Rating: {event.get('opportunity_rating', 'N/A')}/10)"
                for event in top_events
            ])
        else:
            events_details = "No events found in the specified radius."
        
        prompts = {
            'summary': f"""
            Generate a concise business opportunity summary for a {business_type} business.
            
            Context: {events_summary}
            Events: {events_details}
            
            Provide a 2-3 sentence summary highlighting the best opportunities and key insights.
            """,
            
            'business_plan': f"""
            Create a brief business action plan for a {business_type} business based on local events.
            
            Context: {events_summary}
            Events: {events_details}
            
            Provide 3-4 actionable steps the business should take to capitalize on these opportunities.
            Focus on practical, immediate actions.
            """,
            
            'marketing_tips': f"""
            Generate marketing recommendations for a {business_type} business targeting local events.
            
            Context: {events_summary}
            Events: {events_details}
            
            Provide 3-4 specific marketing strategies tailored to these events and business type.
            Include both online and offline tactics.
            """
        }
        
        return prompts.get(content_type, prompts['summary'])
    
    def _get_fallback_content(self, content_type, data):
        """Fallback content when AI is not available"""
        events = data.get('events', [])
        business_type = data.get('businessType', 'All Businesses')
        radius = data.get('radius', 5)
        
        fallbacks = {
            'summary': f"Found {len(events)} events within {radius}km for {business_type}. Focus on events with highest ratings for best opportunities.",
            'business_plan': f"1. Research top-rated events 2. Prepare marketing materials 3. Contact event organizers 4. Set up presence at events",
            'marketing_tips': f"1. Use social media promotion 2. Create event-specific offers 3. Network with organizers 4. Collect customer contacts"
        }
        
        return fallbacks.get(content_type, "AI content generation is temporarily unavailable.")
    
    def generate_event_ai(self, event, business_type, radius):
        """Generate AI insights for a specific event"""
        if not GEMINI_API_KEY:
            return self._get_fallback_event_ai(event, business_type)
        
        try:
            prompt = self._build_event_ai_prompt(event, business_type, radius)
            response = model.generate_content(prompt)
            
            # Parse AI response to extract structured data
            ai_text = response.text.strip()
            return self._parse_event_ai_response(ai_text, event, business_type)
            
        except Exception as e:
            logger.error(f"Error generating event AI: {str(e)}")
            return self._get_fallback_event_ai(event, business_type)
    
    def _build_event_ai_prompt(self, event, business_type, radius):
        """Build prompt for event-specific AI analysis"""
        event_info = f"""
        Event: {event.get('title', 'Unknown Event')}
        Location: {event.get('location', 'Unknown Location')}
        Date: {event.get('date', 'Unknown Date')}
        Attendees: {event.get('attendees', 0)}
        Type: {event.get('type', 'Unknown Type')}
        Distance: {event.get('distance_km', 0)}km from your location
        """
        
        return f"""
        Analyze this event for a {business_type} business and provide specific business recommendations.
        
        Event Details:
        {event_info}
        
        Please provide:
        1. A specific business tip (2-3 sentences) tailored to this event and business type
        2. An opportunity rating (1-10) based on potential for {business_type}
        3. Revenue potential estimate based on attendee count and event type
        
        Format your response as:
        BUSINESS_TIP: [your business tip here]
        RATING: [number 1-10]
        REVENUE: [estimated revenue potential]
        """
    
    def _parse_event_ai_response(self, ai_text, event, business_type):
        """Parse AI response into structured data"""
        try:
            lines = ai_text.split('\n')
            business_tip = "Good opportunity for business networking and promotion."
            rating = 7
            revenue = self._calculate_revenue_estimate(event)
            
            for line in lines:
                if line.startswith('BUSINESS_TIP:'):
                    business_tip = line.replace('BUSINESS_TIP:', '').strip()
                elif line.startswith('RATING:'):
                    try:
                        rating = int(line.replace('RATING:', '').strip())
                        rating = max(1, min(10, rating))  # Clamp between 1-10
                    except:
                        pass
                elif line.startswith('REVENUE:'):
                    revenue = line.replace('REVENUE:', '').strip()
            
            return {
                'business_tip': business_tip,
                'opportunity_rating': rating,
                'revenue_potential': revenue,
                'insights': [
                    f"Event type: {event.get('type', 'Unknown')}",
                    f"Expected attendees: {event.get('attendees', 0):,}",
                    f"Distance: {event.get('distance_km', 0):.1f}km"
                ]
            }
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return self._get_fallback_event_ai(event, business_type)
    
    def _get_fallback_event_ai(self, event, business_type):
        """Fallback AI content when AI is not available"""
        tips = {
            'restaurant': f"Perfect for food vendors! Set up a food stall at {event.get('title', 'this event')} and offer event-specific menu items.",
            'retail': f"Great opportunity for pop-up retail! Display your products at {event.get('title', 'this event')} and offer event discounts.",
            'services': f"Network with attendees and organizers at {event.get('title', 'this event')}. Bring business cards and promotional materials.",
            'default': f"Good opportunity for {business_type} businesses at {event.get('title', 'this event')}. Consider setting up a booth or networking."
        }
        
        return {
            'business_tip': tips.get(business_type, tips['default']),
            'opportunity_rating': 7,
            'revenue_potential': self._calculate_revenue_estimate(event),
            'insights': [
                f"Event type: {event.get('type', 'Unknown')}",
                f"Expected attendees: {event.get('attendees', 0):,}",
                f"Distance: {event.get('distance_km', 0):.1f}km"
            ]
        }
    
    def _calculate_revenue_estimate(self, event):
        """Calculate revenue potential estimate"""
        attendees = event.get('attendees', 0)
        base_revenue = attendees * 0.1  # 10% conversion rate
        distance_factor = 1.2 if event.get('distance_km', 0) < 2 else 0.8
        category_factor = 1.5 if event.get('type') == 'market' else 1.0
        
        potential = int(base_revenue * distance_factor * category_factor)
        
        if potential > 1000:
            return f"${potential}+"
        elif potential > 500:
            return f"${potential}"
        else:
            return f"${max(50, potential)}"

# Initialize AI service
ai_service = AIEventDiscovery()

@app.route('/api/discover-events', methods=['POST'])
def discover_events():
    """API endpoint for AI-powered event discovery"""
    try:
        data = request.get_json()
        
        location = data.get('location', {})
        radius_km = data.get('radius_km', 5)
        business_type = data.get('business_type', '')
        date_range = data.get('date_range', 30)
        search_real_events = data.get('search_real_events', False)
        
        if not location.get('lat') or not location.get('lng'):
            return jsonify({'error': 'Location coordinates required'}), 400
        
        events = ai_service.discover_events(location, radius_km, business_type, date_range, search_real_events)
        
        return jsonify({
            'success': True,
            'events': events,
            'total_found': len(events),
            'search_params': {
                'location': location,
                'radius_km': radius_km,
                'business_type': business_type,
                'date_range': date_range
            }
        })
        
    except Exception as e:
        logger.error(f"Error in discover_events API: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/analyze-opportunity', methods=['POST'])
def analyze_opportunity():
    """API endpoint for analyzing specific business opportunities"""
    try:
        data = request.get_json()
        event = data.get('event', {})
        business_type = data.get('business_type', '')
        
        if not event:
            return jsonify({'error': 'Event data required'}), 400
        
        insights = ai_service._generate_business_insights(event, business_type)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_opportunity API: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/generate-event-ai', methods=['POST'])
def generate_event_ai():
    """API endpoint for generating AI insights for specific events"""
    try:
        data = request.get_json()
        event = data.get('event', {})
        business_type = data.get('businessType', 'business')
        radius = data.get('radius', 5)
        
        if not GEMINI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'AI not available - GEMINI_API_KEY not configured'
            }), 500
        
        ai_content = ai_service.generate_event_ai(event, business_type, radius)
        
        return jsonify({
            'success': True,
            'ai_content': ai_content
        })
        
    except Exception as e:
        logger.error(f"Error in generate_event_ai API: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    """API endpoint for generating AI content"""
    try:
        data = request.get_json()
        content_type = data.get('type', '')
        content_data = data.get('data', {})
        
        if not GEMINI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'AI not available - GEMINI_API_KEY not configured'
            }), 500
        
        content = ai_service.generate_content(content_type, content_data)
        
        return jsonify({
            'success': True,
            'content': content,
            'type': content_type
        })
        
    except Exception as e:
        logger.error(f"Error in generate_content API: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ai_enabled': bool(GEMINI_API_KEY),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
