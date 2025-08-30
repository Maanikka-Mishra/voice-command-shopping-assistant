# Voice Shopping Assistant API Documentation

## Overview

The Voice Shopping Assistant provides a RESTful API for managing shopping lists with voice commands and AI-powered suggestions.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API doesn't require authentication. For production use, implement JWT or OAuth2 authentication.

## Endpoints

### Health Check

#### GET `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Voice Shopping Assistant API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Voice Processing

#### POST `/api/process-voice`

Process voice commands and return structured data.

**Request Body:**
```json
{
  "text": "Add 5 organic apples to my list",
  "language": "en-US"
}
```

**Response:**
```json
{
  "processed": true,
  "command": {
    "type": "add",
    "item": "organic apples",
    "quantity": 5,
    "unit": "piece",
    "category": "produce"
  },
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Smart Suggestions

#### GET `/api/suggestions`

Get AI-powered shopping suggestions.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of suggestions (default: 8)

**Response:**
```json
{
  "suggestions": [
    {
      "name": "organic honey",
      "category": "pantry",
      "reason": "seasonal",
      "confidence": 0.85
    },
    {
      "name": "local farm eggs",
      "category": "dairy",
      "reason": "trending",
      "confidence": 0.78
    }
  ]
}
```

### Shopping List Management

#### GET `/api/shopping-list`

Get the current shopping list.

**Response:**
```json
{
  "items": [
    {
      "id": "1",
      "name": "organic apples",
      "quantity": 5,
      "unit": "piece",
      "category": "produce",
      "price": 2.99,
      "brand": "Local Farm",
      "notes": "Prefer red apples",
      "addedAt": "2024-01-15T10:30:00.000Z",
      "isCompleted": false
    }
  ]
}
```

#### POST `/api/shopping-list`

Add a new item to the shopping list.

**Request Body:**
```json
{
  "name": "organic milk",
  "quantity": 2,
  "unit": "gallon",
  "category": "dairy",
  "price": 4.99,
  "brand": "Organic Valley",
  "notes": "2% fat"
}
```

#### PUT `/api/shopping-list/:id`

Update an existing shopping list item.

**Request Body:**
```json
{
  "quantity": 3,
  "isCompleted": true
}
```

#### DELETE `/api/shopping-list/:id`

Remove an item from the shopping list.

### Language Support

#### GET `/api/languages`

Get supported languages.

**Response:**
```json
{
  "languages": [
    {
      "code": "en-US",
      "name": "English",
      "flag": "🇺🇸",
      "voice": "en-US"
    },
    {
      "code": "es-ES",
      "name": "Español",
      "flag": "🇪🇸",
      "voice": "es-ES"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Text is required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "Shopping item with id '123' not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to process voice command"
}
```

## Rate Limiting

- **Requests per minute**: 100
- **Requests per hour**: 1000

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

## WebSocket Events (Future Enhancement)

For real-time voice processing:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  
  switch (data.type) {
    case 'voice_start':
      console.log('Voice recognition started')
      break
    case 'voice_result':
      console.log('Voice result:', data.transcript)
      break
    case 'voice_error':
      console.error('Voice error:', data.error)
      break
  }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class VoiceShoppingAPI {
  private baseURL: string

  constructor(baseURL: string = 'http://localhost:3001') {
    this.baseURL = baseURL
  }

  async processVoice(text: string, language: string = 'en-US') {
    const response = await fetch(`${this.baseURL}/api/process-voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language })
    })
    return response.json()
  }

  async getSuggestions(category?: string, limit?: number) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (limit) params.append('limit', limit.toString())
    
    const response = await fetch(`${this.baseURL}/api/suggestions?${params}`)
    return response.json()
  }
}
```

### Python

```python
import requests

class VoiceShoppingAPI:
    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
    
    def process_voice(self, text, language="en-US"):
        response = requests.post(
            f"{self.base_url}/api/process-voice",
            json={"text": text, "language": language}
        )
        return response.json()
    
    def get_suggestions(self, category=None, limit=None):
        params = {}
        if category:
            params["category"] = category
        if limit:
            params["limit"] = limit
        
        response = requests.get(f"{self.base_url}/api/suggestions", params=params)
        return response.json()
```

## Testing

Use the provided test endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Process voice command
curl -X POST http://localhost:3001/api/process-voice \
  -H "Content-Type: application/json" \
  -d '{"text": "Add milk to my list"}'

# Get suggestions
curl http://localhost:3001/api/suggestions?limit=5
```

## Versioning

API versioning is handled through URL prefixes:
- Current version: `/api/v1/`
- Future versions: `/api/v2/`

## Support

For API support and questions:
- Email: api-support@yourcompany.com
- Documentation: https://docs.yourcompany.com/api
- Status page: https://status.yourcompany.com
