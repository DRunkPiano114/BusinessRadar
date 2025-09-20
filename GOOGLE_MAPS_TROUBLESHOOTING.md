# Google Maps API 故障排除指南

## 🚨 当前问题
- 错误: "地图无法加载"
- 原因: API密钥配置问题

## 🔧 解决步骤

### 1. 检查API启用状态
访问 [Google Cloud Console](https://console.cloud.google.com/) 并确保以下API已启用：
- ✅ Maps JavaScript API
- ✅ Places API  
- ✅ Geocoding API (推荐)

### 2. 检查API密钥限制
在 **API和服务** > **凭据** 中：
- 点击您的API密钥
- 检查应用限制设置
- 添加 `http://localhost:3000/*` 到HTTP引荐来源网址
- 或暂时设置为"无"进行测试

### 3. 检查计费账户
确保项目已启用计费账户且有足够配额

### 4. 测试API密钥
使用以下命令测试API密钥：
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Canberra&key=YOUR_API_KEY"
```

### 5. 创建新API密钥（如需要）
1. 在Google Cloud Console中创建新API密钥
2. 启用所需API
3. 设置适当的限制
4. 更新HTML文件中的API密钥

## 🧪 测试页面
- 调试工具: http://localhost:3000/debug-maps.html
- 简化测试: http://localhost:3000/simple-map-test.html

## 📞 如果问题持续
1. 检查浏览器控制台错误信息
2. 确认网络连接正常
3. 尝试使用不同的浏览器
4. 检查防火墙设置
