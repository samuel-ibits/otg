# API Integration - Quick Reference

## 📦 Files Created

### Core Files
- **[app/lib/api.ts](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/app/lib/api.ts)** - API utilities (GET, POST, PUT, PATCH, DELETE)
- **[app/lib/types.ts](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/app/lib/types.ts)** - TypeScript type definitions
- **[app/lib/services/routerService.ts](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/app/lib/services/routerService.ts)** - Example service

### Documentation
- **[ENV_SETUP.md](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/ENV_SETUP.md)** - Environment variables guide
- **[API_INTEGRATION_GUIDE.md](file:///C:/Users/User/.gemini/antigravity/brain/8d750560-8474-4487-8c2f-bdfd5812286f/API_INTEGRATION_GUIDE.md)** - Complete integration guide

---

## 🚀 Quick Start

### 1. Basic API Call
```typescript
import { api } from '@/app/lib/api';

const response = await api.get('/routers');
const newItem = await api.post('/routers', { name: 'Router 1' });
```

### 2. Using Services
```typescript
import { routerService } from '@/app/lib/services/routerService';

const { data } = await routerService.getAll();
const router = await routerService.create({ name: 'New Router' });
```

### 3. In Components
```typescript
'use client';
import { useState, useEffect } from 'react';
import { routerService } from '@/app/lib/services/routerService';

export function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    routerService.getAll()
      .then(res => setData(res.data.data));
  }, []);
  
  return <div>{/* render data */}</div>;
}
```

---

## 📋 Next Steps

1. **Set up environment variables** - See [ENV_SETUP.md](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/ENV_SETUP.md)
2. **Create additional services** - Follow the pattern in [routerService.ts](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/app/lib/services/routerService.ts)
3. **Add types** - Define your entities in [types.ts](file:///c:/Users/User/Documents/github/OTG/otg-dashboard/app/lib/types.ts)
4. **Integrate with components** - Use services in your React components

---

## 🛠️ Available Utilities

### API Methods
- `api.get(endpoint, options)`
- `api.post(endpoint, data, options)`
- `api.put(endpoint, data, options)`
- `api.patch(endpoint, data, options)`
- `api.delete(endpoint, options)`

### Helpers
- `buildQueryString(params)` - Build URL query strings
- `uploadFile(endpoint, file, data)` - Handle file uploads
- `getAuthHeader(token?)` - Get authorization headers

### Error Handling
- `APIError` class for structured errors
- Automatic timeout handling (30s default)
- Type-safe error responses

---

## 📚 Full Documentation

See [API_INTEGRATION_GUIDE.md](file:///C:/Users/User/.gemini/antigravity/brain/8d750560-8474-4487-8c2f-bdfd5812286f/API_INTEGRATION_GUIDE.md) for:
- Complete architecture overview
- Usage patterns and examples
- Creating new services
- Authentication setup
- Best practices
- CRUD examples
