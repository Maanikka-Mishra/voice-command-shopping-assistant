// Configuration file for Voice Command Shopping Assistant
// Copy this file to config.js and update with your actual values

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },

  // Voice Recognition Configuration
  voice: {
    language: process.env.SPEECH_RECOGNITION_LANG || 'en-US',
    enableInterimResults: false,
    continuous: false,
    maxAlternatives: 1
  },

  // Gemini API Configuration (Required for multilingual support)
  gemini: {
    apiKey: process.env.VITE_GEMINI_API_KEY || 'AIzaSyD55mHbcwKxjyfia_i1Vvh1v2E2ChGayAw',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    maxTokens: 1000,
    temperature: 0.7
  },

  // AI Service Configuration
  ai: {
    enableSuggestions: true,
    enableMultilingual: process.env.ENABLE_MULTILINGUAL === 'true',
    suggestionCount: 8,
    confidenceThreshold: 0.6
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/shopping-assistant',
    type: 'mongodb' // or 'postgresql', 'mysql'
  },

  // External API Keys
  external: {
    openai: process.env.OPENAI_API_KEY || '',
    google: process.env.GOOGLE_API_KEY || '',
    aws: process.env.AWS_ACCESS_KEY_ID || ''
  },

  // Feature Flags
  features: {
    voiceCommands: true,
    smartSuggestions: true,
    multilingual: true,
    offlineMode: false,
    analytics: false
  },

  // Shopping Categories
  categories: [
    'dairy', 'produce', 'meat', 'pantry', 'beverages', 
    'snacks', 'household', 'personal care', 'frozen', 'bakery'
  ],

  // Voice Command Patterns
  voicePatterns: {
    add: ['add', 'buy', 'get', 'need', 'want', 'i need', 'i want'],
    remove: ['remove', 'delete', 'take off', 'get rid of'],
    search: ['find', 'search for', 'look for'],
    update: ['change', 'update', 'modify', 'edit']
  },

  // Supported Languages for Multilingual Support
  supportedLanguages: [
    'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
    'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN', 'hi-IN'
  ],

  // UI Configuration
  ui: {
    theme: 'light', // or 'dark', 'auto'
    animations: true,
    soundEffects: true,
    hapticFeedback: true
  },

  // Security Configuration
  security: {
    enableHTTPS: process.env.NODE_ENV === 'production',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
}
