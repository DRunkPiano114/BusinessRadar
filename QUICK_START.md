# 🚀 BusinessRadar 快速启动指南

## 一键启动 (推荐)

### 1. 启动AI后端
```bash
./start-ai-backend.sh
```

### 2. 启动前端服务器
```bash
python3 -m http.server 3000
```

### 3. 打开应用
访问: http://localhost:3000/version1.html

---

## 手动启动

### 步骤1: 配置API密钥
```bash
# 编辑AI后端配置
nano ai-backend/.env

# 添加您的API密钥
GEMINI_API_KEY=your_gemini_api_key_here
```

### 步骤2: 启动AI后端
```bash
cd ai-backend
source venv/bin/activate
python app.py
```

### 步骤3: 启动前端
```bash
python3 -m http.server 3000
```

### 步骤4: 访问应用
- 主应用: http://localhost:3000/version1.html
- 调试工具: http://localhost:3000/debug.html

---

## 获取API密钥

### Google Maps API
1. 访问: https://console.cloud.google.com/
2. 启用: Maps JavaScript API, Places API
3. 创建API密钥
4. 设置限制: HTTP referrers, 添加 localhost:*

### Google Gemini API
1. 访问: https://makersuite.google.com/app/apikey
2. 创建API密钥
3. 添加到 ai-backend/.env 文件

---

## 故障排除

### 地图无法加载
- 检查Google Maps API密钥
- 确保已启用Maps JavaScript API
- 检查API密钥限制设置

### AI功能无法使用
- 检查AI后端是否运行在端口5001
- 验证Gemini API密钥是否正确
- 查看浏览器控制台错误信息

### 端口被占用
- AI后端默认端口: 5001
- 前端默认端口: 3000
- 可在.env文件中修改端口

---

## 功能说明

- 🗺️ **地图显示**: Google Maps集成
- 📏 **半径搜索**: 1-50公里可调
- 🤖 **AI发现**: 智能商业机会发现
- 🧠 **AI分析**: 商业潜力分析
- 🏢 **业务筛选**: 按业务类型筛选

---

**需要帮助？** 查看完整的 [README.md](README.md) 文件
