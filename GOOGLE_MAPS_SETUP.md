# Google Maps API 配置说明

## 概述
您的Business Radar应用已成功迁移到Google Maps API，保留了所有原有功能。

## 主要变更

### 1. 地图库替换
- **之前**: Leaflet + OpenStreetMap
- **现在**: Google Maps JavaScript API

### 2. 保留的功能
✅ 事件搜索和过滤  
✅ 距离滑块控制  
✅ 自定义标记样式（按事件类型着色）  
✅ 用户位置标记  
✅ 事件详情弹窗  
✅ 添加到日历功能  
✅ 分享功能  
✅ 响应式设计  
✅ 所有交互功能  

### 3. 新增功能
- Google Maps的卫星视图和街景支持
- 更精确的地图渲染
- 更好的移动端体验

## 配置步骤

### 1. 获取Google Maps API密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下API：
   - Maps JavaScript API
   - Places API (可选，用于搜索功能)
   - Geocoding API (可选，用于地址解析)

4. 创建API密钥：
   - 转到"凭据"页面
   - 点击"创建凭据" > "API密钥"
   - 复制生成的API密钥

### 2. 配置API密钥

在 `version1.html` 文件中，找到第456行：

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
```

将 `YOUR_API_KEY` 替换为您的实际API密钥：

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&callback=initMap"></script>
```

### 3. 安全配置（推荐）

为了安全起见，建议限制API密钥的使用：

1. 在Google Cloud Console中编辑您的API密钥
2. 在"应用程序限制"中选择"HTTP引荐来源网址"
3. 添加您的域名（例如：`https://yourdomain.com/*`）
4. 在"API限制"中选择"限制密钥"并选择所需的API

## 功能说明

### 自定义标记
- 使用Google Maps的SVG路径创建自定义标记
- 不同事件类型使用不同颜色：
  - 节日 (Festival): 红色 (#e11d48)
  - 市场 (Market): 绿色 (#059669)
  - 展览 (Exhibition): 紫色 (#7c3aed)
  - 会议 (Conference): 蓝色 (#2563eb)
  - 体育 (Sports): 深红色 (#dc2626)
  - 文化 (Cultural): 橙色 (#ea580c)

### 地图样式
- 隐藏了POI标签以减少视觉干扰
- 保持了原有的现代设计风格

### 性能优化
- 使用Google Maps的高性能渲染
- 优化的标记管理
- 响应式地图容器

## 故障排除

### 常见问题

1. **地图不显示**
   - 检查API密钥是否正确
   - 确认已启用Maps JavaScript API
   - 检查浏览器控制台是否有错误信息

2. **API配额超限**
   - 检查Google Cloud Console中的配额使用情况
   - 考虑升级到付费计划

3. **标记不显示**
   - 检查事件数据中的坐标是否正确
   - 确认地图已完全加载

### 调试模式

在浏览器中打开开发者工具，查看控制台输出以获取详细错误信息。

## 成本说明

Google Maps API的定价基于使用量：
- 地图加载：每1000次加载约$7
- 标记显示：免费
- 搜索请求：每1000次请求约$5

对于开发和小规模使用，通常有免费额度。

## 下一步

1. 替换API密钥
2. 测试所有功能
3. 根据需要调整地图样式
4. 考虑添加更多Google Maps功能（如街景、路线规划等）

如有问题，请检查浏览器控制台的错误信息或联系技术支持。
