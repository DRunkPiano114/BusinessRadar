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
                       business_type: str = None, date_range: int = 30) -> List[Dict[str, Any]]:
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
            # Generate intelligent search queries
            search_queries = self._generate_search_queries(location, radius_km, business_type, date_range)
            
            # Search for events using multiple sources
            all_events = []
            for query in search_queries:
                events = self._search_events(query, location, radius_km)
                all_events.extend(events)
            
            # Remove duplicates and analyze with AI
            unique_events = self._deduplicate_events(all_events)
            analyzed_events = self._analyze_events_with_ai(unique_events, business_type)
            
            # Filter by radius and sort by relevance
            filtered_events = self._filter_by_radius(analyzed_events, location, radius_km)
            sorted_events = self._sort_by_relevance(filtered_events, business_type)
            
            return sorted_events[:20]  # Return top 20 most relevant events
            
        except Exception as e:
            logger.error(f"Error in event discovery: {str(e)}")
            return []
    
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
        # For now, return mock data
        return []
    
    def _search_eventbrite(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using Eventbrite API"""
        # This would integrate with Eventbrite API
        # For now, return mock data
        return []
    
    def _search_facebook_events(self, query: str, location: Dict[str, float], radius_km: int) -> List[Dict]:
        """Search for events using Facebook Events API"""
        # This would integrate with Facebook Events API
        # For now, return mock data
        return []
    
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
        
        if not location.get('lat') or not location.get('lng'):
            return jsonify({'error': 'Location coordinates required'}), 400
        
        events = ai_service.discover_events(location, radius_km, business_type, date_range)
        
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
