# 🎯 BusinessRadar - AI-Powered Business Opportunity Discovery

<div align="center">

**A Smart Business Opportunity Discovery Platform for MSMEs**

**[🇬🇧 English](#english-version) | [🇨🇳 中文](#中文版本)**  

[![Demo](https://img.shields.io/badge/Demo-PowerPoint-blue)](https://docs.google.com/presentation/d/1TkGB4P0EvWyFs2KsBtTQNaFSEUQ3saorDcyjx8ihf9U/edit?usp=sharing)

</div>

---

## 🇬🇧 English Version

### Overview
BusinessRadar is an AI-powered web application that helps micro-small-medium enterprises (MSMEs) discover local business opportunities within a specified radius. The platform uses Google Maps integration and AI analysis to identify events, festivals, markets, and other business opportunities that could benefit your business.

### ✨ Features
- 🗺️ **Interactive Google Maps** - Visualize opportunities on a map
- 🤖 **AI-Powered Discovery** - Intelligent event discovery using Google Gemini AI
- 📏 **Customizable Search Radius** - Search from 1km to 50km radius
- 🧠 **Smart Business Analysis** - AI-generated business insights and recommendations
- 🏢 **Business Type Filtering** - Personalized recommendations based on business type
- 📊 **Real-time Analytics** - Opportunity ratings and revenue potential analysis

### 🚀 Quick Start

#### Prerequisites
- Python 3.11+
- Node.js (optional, for development)
- Google Maps API Key
- Google Gemini API Key

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd BusinessRadar
```

#### 2. Set Up AI Backend

**Install Dependencies:**
```bash
cd ai-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Configure API Keys:**
```bash
# Copy the example configuration
cp config.env.example .env

# Edit .env file and add your API keys
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
EVENTBRITE_API_KEY=your_eventbrite_api_key
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
```

#### 3. Start the AI Backend
```bash
# Method 1: Using the startup script
./start-ai-backend.sh

# Method 2: Manual start
cd ai-backend
source venv/bin/activate
python app.py
```

The AI backend will be available at: `http://localhost:5001`

#### 4. Start the Frontend Server
```bash
# Using Python's built-in server
python3 -m http.server 3000

# Or using Node.js (if you have it installed)
npx serve -s . -l 3000
```

The frontend will be available at: `http://localhost:3000`

#### 5. Access the Application
Open your browser and navigate to:
- **Main Application**: `http://localhost:3000/version1.html`
- **Debug Tool**: `http://localhost:3000/debug.html`

### 🔧 API Keys Setup

#### Google Maps API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key
5. Configure restrictions:
   - Application restrictions: HTTP referrers
   - Website restrictions: Add `localhost:*`, `127.0.0.1:*`, `file://*`

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

### 📁 Project Structure
```
BusinessRadar/
├── ai-backend/                 # AI backend service
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── venv/                  # Virtual environment
├── version1.html              # Main application
├── script.js                  # Frontend JavaScript
├── styles.css                 # Styling
├── start-ai-backend.sh        # Startup script
├── debug.html                 # Debug tool
└── README.md                  # This file
```

### 🎯 Usage

#### Basic Usage
1. **Open the Application**: Navigate to `http://localhost:3000/version1.html`
2. **Set Search Radius**: Use the slider to set your search radius (1-50km)
3. **Select Business Type**: Choose your business type from the dropdown
4. **Discover Opportunities**: Click the 🤖 AI Discovery button
5. **Analyze Events**: Click the 🧠 AI Analysis button for insights

#### AI Features
- **AI Discovery**: Automatically finds business opportunities within your radius
- **Business Analysis**: Analyzes events for business potential (1-10 rating)
- **Revenue Prediction**: Estimates revenue potential (Low/Medium/High)
- **Smart Recommendations**: Provides personalized business tips

### 🛠️ Development

#### Running in Development Mode
```bash
# Terminal 1: Start AI Backend
cd ai-backend
source venv/bin/activate
python app.py

# Terminal 2: Start Frontend
python3 -m http.server 3000
```

#### API Endpoints
- `GET /api/health` - Health check
- `POST /api/discover-events` - AI event discovery
- `POST /api/analyze-opportunity` - Business opportunity analysis

#### Testing
```bash
# Test AI Backend
curl http://localhost:5001/api/health

# Test AI Discovery
curl -X POST http://localhost:5001/api/discover-events \
  -H "Content-Type: application/json" \
  -d '{"location":{"lat":-35.2809,"lng":149.1300},"radius_km":5,"business_type":"restaurant","date_range":30}'
```

### 🐛 Troubleshooting

#### Common Issues

**1. Google Maps API Error**
- Check if API key is valid
- Ensure Maps JavaScript API is enabled
- Verify API key restrictions

**2. AI Backend Not Starting**
- Check if Python 3.11+ is installed
- Verify virtual environment is activated
- Check if all dependencies are installed

**3. CORS Errors**
- Ensure frontend is served from HTTP server (not file://)
- Check if AI backend is running on port 5001

**4. API Key Issues**
- Verify API keys are correctly set in .env file
- Check if API keys have proper permissions
- Ensure API quotas are not exceeded

#### Debug Mode
```bash
# Enable debug mode
export FLASK_DEBUG=True
python app.py
```

### 📊 Performance Tips
- Start with 5km radius for faster results
- Use specific business types for better recommendations
- Run AI analysis on smaller event sets for better performance
- Monitor API usage to avoid quota limits

### 🔒 Security Notes
- Keep API keys secure and never commit them to version control
- Use environment variables for sensitive configuration
- Consider rate limiting for production use
- Monitor API usage to avoid unexpected charges

### 📈 Future Enhancements
- Real-time event updates
- Integration with more event platforms
- Advanced analytics dashboard
- Mobile app version
- Multi-language support

---

## 🇨🇳 中文版本

### 概述
BusinessRadar是一个AI驱动的商业机会发现平台，专为中小微企业设计。该平台集成了Google Maps和AI分析功能，帮助企业在指定半径内发现本地商业机会，如活动、节日、市场等。

### ✨ 功能特点
- 🗺️ **交互式Google地图** - 在地图上可视化商业机会
- 🤖 **AI驱动发现** - 使用Google Gemini AI智能发现事件
- 📏 **可调节搜索半径** - 支持1-50公里半径搜索
- 🧠 **智能商业分析** - AI生成的商业洞察和建议
- 🏢 **业务类型筛选** - 基于业务类型的个性化推荐
- 📊 **实时分析** - 机会评级和收入潜力分析

### 🚀 快速开始

#### 环境要求
- Python 3.11+
- Node.js (可选，用于开发)
- Google Maps API密钥
- Google Gemini API密钥

#### 1. 克隆仓库
```bash
git clone <your-repository-url>
cd BusinessRadar
```

#### 2. 设置AI后端

**安装依赖:**
```bash
cd ai-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**配置API密钥:**
```bash
# 复制示例配置文件
cp config.env.example .env

# 编辑.env文件并添加您的API密钥
nano .env  # 或使用您喜欢的编辑器
```

**必需的环境变量:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
EVENTBRITE_API_KEY=your_eventbrite_api_key
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001
```

#### 3. 启动AI后端
```bash
# 方法1: 使用启动脚本
./start-ai-backend.sh

# 方法2: 手动启动
cd ai-backend
source venv/bin/activate
python app.py
```

AI后端将在 `http://localhost:5001` 运行

#### 4. 启动前端服务器
```bash
# 使用Python内置服务器
python3 -m http.server 3000

# 或使用Node.js (如果已安装)
npx serve -s . -l 3000
```

前端将在 `http://localhost:3000` 运行

#### 5. 访问应用
在浏览器中打开:
- **主应用**: `http://localhost:3000/version1.html`
- **调试工具**: `http://localhost:3000/debug.html`

### 🔧 API密钥设置

#### Google Maps API密钥
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下API:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. 创建API密钥
5. 配置限制:
   - 应用限制: HTTP referrers
   - 网站限制: 添加 `localhost:*`, `127.0.0.1:*`, `file://*`

#### Google Gemini API密钥
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的API密钥
3. 将密钥添加到.env文件中

### 🎯 使用方法

#### 基本使用
1. **打开应用**: 访问 `http://localhost:3000/version1.html`
2. **设置搜索半径**: 使用滑块设置搜索半径(1-50公里)
3. **选择业务类型**: 从下拉菜单选择您的业务类型
4. **发现机会**: 点击 🤖 AI Discovery 按钮
5. **分析事件**: 点击 🧠 AI Analysis 按钮获取洞察

#### AI功能
- **AI发现**: 自动在指定半径内发现商业机会
- **商业分析**: 分析事件的商业潜力(1-10分评级)
- **收入预测**: 估算收入潜力(低/中/高)
- **智能推荐**: 提供个性化商业建议

### 🛠️ 开发

#### 开发模式运行
```bash
# 终端1: 启动AI后端
cd ai-backend
source venv/bin/activate
python app.py

# 终端2: 启动前端
python3 -m http.server 3000
```

### 🐛 故障排除

#### 常见问题

**1. Google Maps API错误**
- 检查API密钥是否有效
- 确保已启用Maps JavaScript API
- 验证API密钥限制设置

**2. AI后端无法启动**
- 检查是否安装了Python 3.11+
- 验证虚拟环境是否激活
- 检查是否安装了所有依赖

**3. CORS错误**
- 确保前端从HTTP服务器运行(不是file://)
- 检查AI后端是否在端口5001运行

**4. API密钥问题**
- 验证API密钥在.env文件中正确设置
- 检查API密钥是否有适当权限
- 确保API配额未超出限制

### 📊 性能优化建议
- 从5公里半径开始以获得更快结果
- 使用特定业务类型获得更好推荐
- 在较小事件集上运行AI分析以获得更好性能
- 监控API使用情况以避免配额限制

### 🔒 安全注意事项
- 保护API密钥安全，不要提交到版本控制
- 使用环境变量存储敏感配置
- 考虑在生产环境中使用速率限制
- 监控API使用情况以避免意外费用

---

<div align="center">

**⭐ Star this project if it helps your business grow! ⭐**  
**⭐ 如果此项目对您的业务有帮助，请点Star！⭐**

</div>