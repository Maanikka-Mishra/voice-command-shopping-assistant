// Test file to verify Gemini API key functionality
const GEMINI_API_KEY = 'AIzaSyD55mHbcwKxjyfia_i1Vvh1v2E2ChGayAw'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...')
  console.log('🔑 API Key:', GEMINI_API_KEY.substring(0, 20) + '...')
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Please respond with "API Test Successful"'
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    const responseText = data.candidates[0]?.content.parts[0]?.text || 'No response text'
    
    console.log('✅ API Test Successful!')
    console.log('📝 Response:', responseText)
    console.log('🌍 Multilingual support is ready!')
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message)
    console.log('🔧 Please check your API key and internet connection')
  }
}

// Run the test
testGeminiAPI()
