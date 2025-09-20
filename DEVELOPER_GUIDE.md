# 👨‍💻 BusinessRadar 开发者指南

## 技术架构

### 前端技术栈
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 交互逻辑
- **Google Maps API** - 地图功能
- **Fetch API** - HTTP请求

### 后端技术栈
- **Python 3.11+** - 主要语言
- **Flask** - Web框架
- **Google Gemini AI** - AI功能
- **Flask-CORS** - 跨域支持

## 项目结构详解

```
BusinessRadar/
├── ai-backend/                 # AI后端服务
│   ├── app.py                 # Flask主应用
│   ├── requirements.txt       # Python依赖
│   ├── .env                   # 环境变量
│   ├── config.env.example     # 配置示例
│   └── venv/                  # 虚拟环境
├── version1.html              # 主应用页面
├── script.js                  # 前端JavaScript
├── styles.css                 # 样式文件
├── pro.html                   # Pro版本页面
├── debug.html                 # 调试工具
├── simple-test.html           # 简单测试
├── start-ai-backend.sh        # 启动脚本
├── README.md                  # 项目说明
├── QUICK_START.md             # 快速启动
└── DEVELOPER_GUIDE.md         # 开发者指南
```

## 核心功能实现

### 1. 地图功能 (script.js)

#### 地图初始化
```javascript
initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -35.2809, lng: 149.1300 },
        zoom: 13
    });
}
```

#### 半径圆圈绘制
```javascript
drawRadiusCircle() {
    this.radiusCircle = new google.maps.Circle({
        strokeColor: '#667eea',
        fillColor: '#667eea',
        fillOpacity: 0.1,
        map: this.map,
        center: this.userLocation,
        radius: this.searchRadius * 1000
    });
}
```

### 2. AI功能集成

#### AI事件发现
```javascript
async aiDiscoverEvents() {
    const response = await fetch(`${this.aiBackendUrl}/discover-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: this.userLocation,
            radius_km: this.searchRadius,
            business_type: this.businessType,
            date_range: 30
        })
    });
}
```

#### AI商业分析
```javascript
async analyzeCurrentOpportunities() {
    const response = await fetch(`${this.aiBackendUrl}/analyze-opportunity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: event,
            business_type: this.businessType
        })
    });
}
```

### 3. 后端API实现 (ai-backend/app.py)

#### 事件发现API
```python
@app.route('/api/discover-events', methods=['POST'])
def discover_events():
    data = request.get_json()
    events = ai_service.discover_events(
        location=data.get('location'),
        radius_km=data.get('radius_km', 5),
        business_type=data.get('business_type', ''),
        date_range=data.get('date_range', 30)
    )
    return jsonify({'success': True, 'events': events})
```

#### AI分析API
```python
@app.route('/api/analyze-opportunity', methods=['POST'])
def analyze_opportunity():
    data = request.get_json()
    insights = ai_service._generate_business_insights(
        event=data.get('event'),
        business_type=data.get('business_type')
    )
    return jsonify({'success': True, 'insights': insights})
```

## 开发环境设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd BusinessRadar
```

### 2. 设置Python环境
```bash
cd ai-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 配置环境变量
```bash
cp config.env.example .env
# 编辑.env文件，添加API密钥
```

### 4. 启动开发服务器
```bash
# 终端1: AI后端
cd ai-backend
source venv/bin/activate
python app.py

# 终端2: 前端服务器
python3 -m http.server 3000
```

## API文档

### 端点列表

#### 健康检查
```
GET /api/health
```
**响应:**
```json
{
  "status": "healthy",
  "ai_enabled": true,
  "timestamp": "2025-09-21T00:00:00.000000"
}
```

#### 事件发现
```
POST /api/discover-events
```
**请求体:**
```json
{
  "location": {"lat": -35.2809, "lng": 149.1300},
  "radius_km": 5,
  "business_type": "restaurant",
  "date_range": 30
}
```
**响应:**
```json
{
  "success": true,
  "events": [...],
  "total_found": 10
}
```

#### 机会分析
```
POST /api/analyze-opportunity
```
**请求体:**
```json
{
  "event": {...},
  "business_type": "restaurant"
}
```
**响应:**
```json
{
  "success": true,
  "insights": {
    "opportunity_rating": 8,
    "business_tip": "...",
    "revenue_potential": "high"
  }
}
```

## 调试和测试

### 1. 调试工具
访问 `http://localhost:3000/debug.html` 进行功能测试

### 2. 日志查看
```bash
# AI后端日志
cd ai-backend
source venv/bin/activate
python app.py

# 查看详细日志
export FLASK_DEBUG=True
python app.py
```

### 3. API测试
```bash
# 测试健康检查
curl http://localhost:5001/api/health

# 测试事件发现
curl -X POST http://localhost:5001/api/discover-events \
  -H "Content-Type: application/json" \
  -d '{"location":{"lat":-35.2809,"lng":149.1300},"radius_km":5}'
```

## 部署指南

### 开发环境
- 使用Python内置服务器
- 本地数据库
- 开发API密钥

### 生产环境
- 使用Gunicorn或uWSGI
- PostgreSQL数据库
- 生产API密钥
- 反向代理(Nginx)

### Docker部署
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY ai-backend/ .
RUN pip install -r requirements.txt
EXPOSE 5001
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5001"]
```

## 性能优化

### 前端优化
- 使用CDN加载Google Maps
- 压缩CSS和JavaScript
- 图片优化
- 懒加载

### 后端优化
- 数据库连接池
- 缓存机制
- API限流
- 异步处理

## 安全考虑

### API密钥安全
- 使用环境变量
- 不在代码中硬编码
- 定期轮换密钥
- 监控使用情况

### 数据保护
- 输入验证
- SQL注入防护
- XSS防护
- CORS配置

## 贡献指南

### 代码规范
- 使用PEP 8 Python代码规范
- JavaScript使用ES6+语法
- 添加适当的注释
- 编写测试用例

### 提交流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 故障排除

### 常见问题
1. **端口冲突**: 修改.env文件中的端口配置
2. **API密钥错误**: 检查密钥格式和权限
3. **依赖问题**: 重新安装requirements.txt
4. **CORS错误**: 检查Flask-CORS配置

### 调试技巧
- 使用浏览器开发者工具
- 查看服务器日志
- 使用调试工具页面
- 检查网络请求

## 更新日志

### v1.0.0
- 初始版本发布
- 基础地图功能
- AI事件发现
- 商业分析功能

---

**需要更多帮助？** 查看 [README.md](README.md) 或 [QUICK_START.md](QUICK_START.md)
