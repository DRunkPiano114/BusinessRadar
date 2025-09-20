# Google Maps API 配置指南

## 🔑 API密钥问题解决方案

### 1. 检查API密钥状态
访问 [Google Cloud Console](https://console.cloud.google.com/) 并检查：

- ✅ API密钥是否有效
- ✅ 是否启用了必要的API服务
- ✅ 域名限制设置是否正确

### 2. 必需的API服务
确保启用了以下API服务：

- **Maps JavaScript API** - 用于显示地图
- **Places API** - 用于地点搜索和自动完成
- **Geocoding API** - 用于地址转换（可选）

### 3. 启用API服务步骤

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择您的项目
3. 导航到 "APIs & Services" > "Library"
4. 搜索并启用以下API：
   - Maps JavaScript API
   - Places API
   - Geocoding API (可选)

### 4. 配置API密钥限制

#### 应用限制：
- **HTTP referrers (web sites)** - 推荐用于开发
- 添加以下域名：
  - `localhost:*` (用于本地开发)
  - `127.0.0.1:*` (用于本地开发)
  - `your-domain.com/*` (用于生产环境)

#### API限制：
- Maps JavaScript API
- Places API
- Geocoding API

### 5. 常见错误及解决方案

#### 错误：`This API project is not authorized to use this API`
**解决方案：** 启用相应的API服务

#### 错误：`RefererNotAllowedMapError`
**解决方案：** 检查HTTP referrers设置，确保包含当前域名

#### 错误：`ApiNotActivatedMapError`
**解决方案：** 在Google Cloud Console中启用Maps JavaScript API

#### 错误：`RequestDeniedMapError`
**解决方案：** 检查API密钥是否正确，是否有正确的权限

### 6. 测试API密钥

您可以使用以下URL测试API密钥是否工作：

```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places
```

如果返回JavaScript代码而不是错误，说明API密钥配置正确。

### 7. 费用控制

- 设置使用配额限制
- 监控API使用情况
- 设置预算警报

### 8. 开发环境配置

对于本地开发，建议使用：
- HTTP referrers: `localhost:*`
- 不设置IP地址限制
- 启用所有必要的API服务

### 9. 生产环境配置

对于生产环境，建议：
- 设置严格的域名限制
- 只启用必要的API服务
- 设置使用配额限制
- 定期轮换API密钥

## 🚀 快速修复

如果遇到问题，请按以下顺序检查：

1. ✅ API密钥是否正确复制
2. ✅ 是否启用了Maps JavaScript API
3. ✅ 是否启用了Places API
4. ✅ 域名限制设置是否正确
5. ✅ 浏览器控制台是否有错误信息

## 📞 获取帮助

如果问题仍然存在，请：
1. 检查浏览器控制台的错误信息
2. 访问 [Google Maps Platform 文档](https://developers.google.com/maps/documentation)
3. 查看 [Google Cloud Console 支持](https://cloud.google.com/support)