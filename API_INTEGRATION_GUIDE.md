# API Integration Guide

This guide explains how to use the JSON dataset and API integration for the WhatsApp Chatbox component.

## Overview

The chatbox supports two data sources:
1. **Local JSON Data** - Static data from `src/data/chatData.json` (default)
2. **Remote API** - Dynamic data from a backend API endpoint

## Files Structure

```
src/
├── data/
│   └── chatData.json              # Local JSON dataset
├── services/
│   └── chatApiService.ts          # API service functions
├── hooks/
│   └── useChatData.ts             # React hooks for data fetching
└── nodes/
    ├── WhatsAppChatNode.tsx       # WhatsApp chatbox component
    └── FollowUpNode.tsx           # Follow-up node component

api-server.js                       # Example Express.js backend
.env.example                        # Environment configuration template
```

## Quick Start

### 1. Using Local JSON Data (Default)

The chatbox loads from local JSON by default. No additional setup needed:

```bash
npm run dev
```

### 2. Using Remote API

#### Step 1: Set up the backend server

```bash
# Install dependencies
npm install express cors

# Run the example API server
node api-server.js
# Server runs on http://localhost:3000
```

#### Step 2: Configure environment

Create `.env` file in project root:

```env
VITE_USE_LOCAL_DATA=false
VITE_API_URL=http://localhost:3000
```

#### Step 3: Run your app

```bash
npm run dev
```

## API Endpoints

### GET `/api/chat-data`
Returns all chat configuration and options.

**Response:**
```json
{
  "options": [
    {
      "id": "product-info",
      "number": "1️⃣",
      "label": "Product Info",
      "title": "Product Info",
      "content": "Product description..."
    }
  ],
  "followUpActions": [...],
  "companyInfo": {...}
}
```

### GET `/api/chat-options`
Returns only the chat options array.

### GET `/api/chat-options/:id`
Returns a specific option by ID.

**Example:** `GET /api/chat-options/product-info`

### GET `/api/company-info`
Returns company information.

### GET `/api/follow-up-actions`
Returns follow-up action buttons.

### POST `/api/contact`
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in learning more",
  "optionId": "product-info"
}
```

### POST `/api/schedule-call`
Handles call scheduling requests.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "preferredTime": "2024-12-20T14:00:00Z"
}
```

## Using the Hooks in Components

### Fetch All Data

```tsx
import { useChatData } from '@/hooks/useChatData';

function MyComponent() {
  const { data, loading, error } = useChatData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.companyInfo.name}</h1>
      {data?.options.map(opt => (
        <button key={opt.id}>{opt.label}</button>
      ))}
    </div>
  );
}
```

### Fetch Chat Options Only

```tsx
import { useChatOptions } from '@/hooks/useChatData';

function OptionsList() {
  const { options, loading, error } = useChatOptions();

  return (
    <ul>
      {options.map(opt => (
        <li key={opt.id}>{opt.label}</li>
      ))}
    </ul>
  );
}
```

### Fetch Single Option

```tsx
import { useChatOption } from '@/hooks/useChatData';

function OptionDetail({ optionId }: { optionId: string }) {
  const { option, loading, error } = useChatOption(optionId);

  if (!option) return null;

  return <div>{option.content}</div>;
}
```

### Fetch Company Info

```tsx
import { useCompanyInfo } from '@/hooks/useChatData';

function Header() {
  const { companyInfo, loading } = useCompanyInfo();

  return (
    <div>
      <span>{companyInfo?.avatar}</span>
      <h1>{companyInfo?.name}</h1>
    </div>
  );
}
```

### Fetch Follow-up Actions

```tsx
import { useFollowUpActions } from '@/hooks/useChatData';

function Actions() {
  const { actions } = useFollowUpActions();

  return (
    <div>
      {actions.map(action => (
        <button key={action.id} className={action.type}>
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

## Data Structure

### ChatOption
```typescript
interface ChatOption {
  id: string;           // Unique identifier
  number: string;       // Emoji number (1️⃣, 2️⃣, etc)
  label: string;        // Button label
  title: string;        // Detail panel title
  content: string;      // Detail panel content
}
```

### FollowUpAction
```typescript
interface FollowUpAction {
  id: string;           // Unique identifier
  label: string;        // Button label
  type: 'primary' | 'secondary';  // Button styling
}
```

### CompanyInfo
```typescript
interface CompanyInfo {
  name: string;         // Company name
  status: string;       // Status message
  avatar: string;       // Emoji avatar
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USE_LOCAL_DATA` | `true` | Use local JSON instead of API |
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |

## Caching

The API service implements automatic caching:
- Data is fetched once and cached in memory
- Subsequent requests return cached data immediately
- Clear cache by reloading the page

## Error Handling

If the API request fails, the service automatically falls back to hardcoded data. You can handle errors in components:

```tsx
const { data, error } = useChatData();

if (error) {
  console.error('Failed to load chat data:', error);
  // Show error message to user
}
```

## Extending the API

To add new endpoints:

1. Add data to `src/data/chatData.json`
2. Create a new service function in `src/services/chatApiService.ts`
3. Create a new hook in `src/hooks/useChatData.ts`
4. Add endpoint to `api-server.js` if using remote API

## Production Deployment

### Frontend
1. Build the app: `npm run build`
2. Deploy static files to CDN or hosting service
3. Set `VITE_API_URL` to production API endpoint

### Backend
1. Deploy `api-server.js` to a Node.js hosting service (Heroku, AWS, DigitalOcean, etc.)
2. Replace mock data with real database queries
3. Add authentication and rate limiting
4. Enable CORS only for your domain

Example production `.env`:
```env
VITE_USE_LOCAL_DATA=false
VITE_API_URL=https://api.yourcompany.com
```

## Troubleshooting

**Q: Data not loading**
- Check if `VITE_USE_LOCAL_DATA` is correct
- Open browser DevTools → Network tab
- Verify API endpoint is accessible
- Check console for error messages

**Q: CORS errors**
- API server must have CORS enabled (already in example server)
- Frontend and backend must be accessible

**Q: Stale data**
- Reload the page to clear cache
- API service caches data automatically

**Q: API server won't start**
- Check port 3000 is not in use
- Install dependencies: `npm install express cors`
- Check Node.js version (v14+)
