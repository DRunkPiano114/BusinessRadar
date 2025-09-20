# 🤖 AI Features Guide - BusinessRadar

## Overview
BusinessRadar now includes powerful AI features powered by Google's Gemini AI to help you discover and analyze business opportunities within your specified radius.

## 🚀 Getting Started

### 1. Start the AI Backend
```bash
# Make the script executable (if not already done)
chmod +x start-ai-backend.sh

# Start the AI backend
./start-ai-backend.sh
```

### 2. Configure API Keys
1. Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Edit `ai-backend/.env` file
3. Add your API key: `GEMINI_API_KEY=your_api_key_here`

### 3. Open the Frontend
Open `version1.html` in your browser to access the AI-powered features.

## 🧠 AI Features

### 1. AI-Powered Event Discovery
- **Button**: 🤖 AI Discovery (purple button next to search)
- **Function**: Automatically discovers events and business opportunities within your radius
- **How it works**:
  - Generates intelligent search queries based on your location and business type
  - Searches multiple sources for relevant events
  - Analyzes events for business potential
  - Merges results with existing events

### 2. Business Type Selection
- **Dropdown**: Select your business type for personalized recommendations
- **Options**:
  - Restaurant & Food
  - Retail & Shopping
  - Professional Services
  - Entertainment
  - Health & Wellness
  - Education & Training

### 3. AI Business Analysis
- **Button**: 🧠 AI Analysis (green button)
- **Function**: Analyzes current events for business opportunities
- **Features**:
  - Opportunity rating (1-10)
  - Revenue potential assessment
  - Target audience analysis
  - Preparation recommendations

## 📊 AI-Generated Content

### Event Cards with AI Insights
- **🤖 AI Generated badge**: Shows AI-discovered events
- **⭐ Opportunity Rating**: 1-10 scale business opportunity score
- **💰 Revenue Potential**: Low/Medium/High assessment
- **Enhanced Business Tips**: AI-generated specific recommendations

### Smart Recommendations
- Events are automatically sorted by relevance to your business type
- AI considers factors like:
  - Event type and audience
  - Location proximity
  - Seasonal relevance
  - Business compatibility

## 🔧 Technical Details

### Backend API Endpoints
- `POST /api/discover-events` - AI event discovery
- `POST /api/analyze-opportunity` - Business opportunity analysis
- `GET /api/health` - Health check

### Request Format
```json
{
  "location": {"lat": -35.2809, "lng": 149.1300},
  "radius_km": 5,
  "business_type": "restaurant",
  "date_range": 30
}
```

### Response Format
```json
{
  "success": true,
  "events": [
    {
      "title": "Event Name",
      "location": "Event Location",
      "date": "2025-09-25",
      "opportunity_rating": 8,
      "business_tip": "AI-generated tip",
      "revenue_potential": "high",
      "aiGenerated": true
    }
  ],
  "total_found": 5
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **AI Backend Not Starting**
   - Check if Python 3 is installed
   - Verify virtual environment is created
   - Check if all dependencies are installed

2. **API Key Issues**
   - Ensure GEMINI_API_KEY is set in `.env` file
   - Verify API key is valid and has proper permissions
   - Check Google AI Studio for quota limits

3. **No AI Events Found**
   - Check if backend is running on port 5000
   - Verify network connection
   - Check browser console for errors

4. **CORS Issues**
   - Ensure backend is running
   - Check if Flask-CORS is properly configured
   - Verify frontend is accessing correct backend URL

### Debug Mode
Enable debug mode by setting `FLASK_DEBUG=True` in the `.env` file.

## 📈 Performance Tips

1. **Optimize Search Radius**: Start with 5km, adjust based on results
2. **Use Business Type**: Select specific business type for better recommendations
3. **Regular Updates**: Run AI discovery regularly for fresh opportunities
4. **Batch Analysis**: Use AI analysis on multiple events at once

## 🔒 Security Notes

- Keep your API keys secure and never commit them to version control
- Use environment variables for sensitive configuration
- Consider rate limiting for production use
- Monitor API usage to avoid unexpected charges

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the backend is running: `curl http://localhost:5000/api/health`
3. Check the backend logs for detailed error information
4. Ensure all dependencies are properly installed

## 🎯 Best Practices

1. **Start Small**: Begin with a 5km radius and expand as needed
2. **Be Specific**: Use detailed business type descriptions
3. **Regular Analysis**: Run AI analysis weekly for fresh insights
4. **Combine Sources**: Use both AI discovery and manual search
5. **Track Results**: Monitor which opportunities lead to actual business

---

**Happy Business Hunting! 🎯🤖**
