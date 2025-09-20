# 地址搜索功能指南

## 新功能概述

您的Business Radar应用现在支持智能地址搜索功能！用户可以在搜索框中输入地址，系统会自动在地图上显示该位置的标记。

## 功能特性

### 1. 智能搜索识别
- **地址搜索**：当用户输入包含地址关键词的查询时，系统会使用Google Places API进行地址搜索
- **事件搜索**：当用户输入事件相关关键词时，系统会搜索本地事件

### 2. 地址关键词识别
系统会自动识别以下关键词作为地址搜索：
- 街道类型：street, avenue, road, drive, place, court, lane, way
- 缩写：st, ave, rd, dr, pl, ct, ln, wy
- 地区名称：canberra, act, australia

### 3. 搜索标记
- **用户位置**：蓝色圆形标记 (📍)
- **搜索位置**：橙色圆形标记 (🔍)
- **事件标记**：彩色自定义标记，按事件类型着色

## 使用方法

### 地址搜索
1. 在搜索框中输入地址，例如：
   - "123 Main Street, Canberra"
   - "Parliament House, Canberra"
   - "Lake Burley Griffin"
   - "Canberra Airport"

2. 系统会显示地址建议下拉菜单
3. 选择正确的地址
4. 地图会自动：
   - 显示橙色搜索标记
   - 居中显示搜索位置
   - 重新计算所有事件的距离
   - 更新事件列表

### 事件搜索
1. 在搜索框中输入事件相关关键词，例如：
   - "festival"
   - "market"
   - "conference"
   - "sports"

2. 系统会过滤显示相关事件
3. 搜索结果会在5秒后自动恢复

### 清除搜索
- 点击搜索框右侧的红色"×"按钮
- 系统会：
  - 清除搜索标记
  - 重置到原始用户位置
  - 恢复所有事件显示

## 技术实现

### Google Places API集成
- 使用Google Places Autocomplete服务
- 限制搜索范围为澳大利亚
- 支持establishment和geocode类型搜索

### 搜索逻辑
```javascript
// 地址关键词检测
const addressKeywords = ['street', 'avenue', 'road', 'drive', 'place', 'court', 'lane', 'way', 'st', 'ave', 'rd', 'dr', 'pl', 'ct', 'ln', 'wy'];
const isAddressQuery = addressKeywords.some(keyword => query.includes(keyword)) || 
                     query.includes('canberra') || 
                     query.includes('act') ||
                     query.includes('australia');
```

### 标记管理
- 自动清除之前的搜索标记
- 动态更新用户位置用于距离计算
- 保持标记样式一致性

## 用户体验改进

### 视觉反馈
- 搜索状态提示
- 清晰的标记区分
- 平滑的地图过渡动画

### 交互优化
- 自动完成建议
- 一键清除搜索
- 智能搜索类型识别

## 配置要求

### API权限
确保您的Google Maps API密钥已启用：
- Maps JavaScript API
- Places API
- Geocoding API (可选)

### 限制设置
- 搜索范围限制为澳大利亚
- 支持establishment和geocode类型

## 故障排除

### 常见问题

1. **地址搜索不工作**
   - 检查Places API是否已启用
   - 确认API密钥有正确权限
   - 检查浏览器控制台错误

2. **搜索建议不显示**
   - 确认网络连接正常
   - 检查API配额是否超限
   - 验证地址格式是否正确

3. **标记不显示**
   - 检查地址是否有效
   - 确认地图已完全加载
   - 查看控制台错误信息

### 调试提示
- 打开浏览器开发者工具查看控制台输出
- 检查网络请求是否成功
- 验证API响应数据格式

## 未来增强

可以考虑添加的功能：
- 搜索历史记录
- 收藏位置功能
- 路线规划集成
- 多语言地址支持
- 搜索建议缓存

## 性能优化

- 搜索防抖处理
- 标记复用机制
- 异步API调用
- 内存泄漏防护

现在您的Business Radar应用具备了完整的地址搜索功能，为用户提供更强大的位置发现体验！
