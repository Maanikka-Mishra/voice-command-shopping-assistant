import { ShoppingItem } from '../types'

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyD55mHbcwKxjyfia_i1Vvh1v2E2ChGayAw'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

// Supported languages
export const SUPPORTED_LANGUAGES = {
  'en-US': { name: 'English', flag: '🇺🇸', voice: 'en-US' },
  'es-ES': { name: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  'fr-FR': { name: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  'de-DE': { name: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  'it-IT': { name: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
  'pt-BR': { name: 'Português', flag: '🇧🇷', voice: 'pt-BR' },
  'ja-JP': { name: '日本語', flag: '🇯🇵', voice: 'ja-JP' },
  'ko-KR': { name: '한국어', flag: '🇰🇷', voice: 'ko-KR' },
  'zh-CN': { name: '中文', flag: '🇨🇳', voice: 'zh-CN' },
  'hi-IN': { name: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN' }
}

// Language-specific voice command patterns
export const LANGUAGE_PATTERNS = {
  'en-US': {
    add: ['add', 'buy', 'get', 'need', 'want', 'i need', 'i want'],
    remove: ['remove', 'delete', 'take off', 'get rid of'],
    search: ['find', 'search for', 'look for']
  },
  'es-ES': {
    add: ['añadir', 'comprar', 'necesito', 'quiero', 'agregar'],
    remove: ['quitar', 'eliminar', 'borrar', 'no necesito'],
    search: ['buscar', 'encontrar', 'busca']
  },
  'fr-FR': {
    add: ['ajouter', 'acheter', 'j\'ai besoin', 'je veux', 'donne-moi'],
    remove: ['enlever', 'supprimer', 'retirer', 'je n\'ai plus besoin'],
    search: ['chercher', 'trouver', 'rechercher']
  },
  'de-DE': {
    add: ['hinzufügen', 'kaufen', 'ich brauche', 'ich möchte', 'gib mir'],
    remove: ['entfernen', 'löschen', 'wegnehmen', 'ich brauche nicht mehr'],
    search: ['suchen', 'finden', 'nachschauen']
  }
}

// Call Gemini API
async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()
    return data.candidates[0]?.content.parts[0]?.text || ''
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return ''
  }
}

// Detect language from voice input
export async function detectLanguage(text: string): Promise<string> {
  const prompt = `Detect the language of this text and return only the language code (e.g., en-US, es-ES, fr-FR, de-DE, it-IT, pt-BR, ja-JP, ko-KR, zh-CN, hi-IN). If unsure, return 'en-US'. Text: "${text}"`
  
  const detectedLang = await callGeminiAPI(prompt)
  const cleanLang = detectedLang.trim().replace(/['"]/g, '')
  
  // Validate the detected language
  if (SUPPORTED_LANGUAGES[cleanLang as keyof typeof SUPPORTED_LANGUAGES]) {
    return cleanLang
  }
  
  return 'en-US' // Default fallback
}

// Translate voice commands to English for processing
export async function translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
  if (sourceLanguage === 'en-US') return text
  
  const prompt = `Translate this text from ${sourceLanguage} to English. Return only the English translation: "${text}"`
  const translation = await callGeminiAPI(prompt)
  
  return translation.trim().replace(/['"]/g, '') || text
}

// Translate English responses back to user's language
export async function translateToUserLanguage(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en-US') return text
  
  const prompt = `Translate this text from English to ${targetLanguage}. Return only the translation: "${text}"`
  const translation = await callGeminiAPI(prompt)
  
  return translation.trim().replace(/['"]/g, '') || text
}

// Generate multilingual suggestions
export async function generateMultilingualSuggestions(
  shoppingList: ShoppingItem[], 
  language: string
): Promise<string[]> {
  const baseSuggestions = [
    'organic honey',
    'local farm eggs',
    'artisan bread',
    'cold-pressed olive oil',
    'natural maple syrup'
  ]
  
  if (language === 'en-US') return baseSuggestions
  
  // Translate suggestions to user's language
  const translatedSuggestions = await Promise.all(
    baseSuggestions.map(suggestion => 
      translateToUserLanguage(suggestion, language)
    )
  )
  
  return translatedSuggestions
}

// Get localized voice command examples
export function getLocalizedExamples(language: string): string[] {
  const examples = {
    'en-US': [
      'Add milk to my list',
      'I need 5 apples',
      'Buy organic bread',
      'Remove milk from list'
    ],
    'es-ES': [
      'Añadir leche a mi lista',
      'Necesito 5 manzanas',
      'Comprar pan orgánico',
      'Quitar leche de la lista'
    ],
    'fr-FR': [
      'Ajouter du lait à ma liste',
      'J\'ai besoin de 5 pommes',
      'Acheter du pain bio',
      'Enlever le lait de la liste'
    ],
    'de-DE': [
      'Milch zu meiner Liste hinzufügen',
      'Ich brauche 5 Äpfel',
      'Bio-Brot kaufen',
      'Milch von der Liste entfernen'
    ]
  }
  
  return examples[language as keyof typeof examples] || examples['en-US']
}

// Get localized UI text
export function getLocalizedText(language: string, key: string): string {
  const translations = {
    'en-US': {
      'voiceCommands': 'Voice Commands',
      'smartSuggestions': 'Smart Suggestions',
      'shoppingList': 'Shopping List',
      'listening': 'Listening... Speak now!',
      'clickToStart': 'Click microphone to start',
      'addItem': 'Add Item',
      'removeItem': 'Remove Item',
      'editItem': 'Edit Item',
      'save': 'Save',
      'cancel': 'Cancel'
    },
    'es-ES': {
      'voiceCommands': 'Comandos de Voz',
      'smartSuggestions': 'Sugerencias Inteligentes',
      'shoppingList': 'Lista de Compras',
      'listening': 'Escuchando... ¡Habla ahora!',
      'clickToStart': 'Haz clic en el micrófono para empezar',
      'addItem': 'Añadir Artículo',
      'removeItem': 'Quitar Artículo',
      'editItem': 'Editar Artículo',
      'save': 'Guardar',
      'cancel': 'Cancelar'
    },
    'fr-FR': {
      'voiceCommands': 'Commandes Vocales',
      'smartSuggestions': 'Suggestions Intelligentes',
      'shoppingList': 'Liste de Courses',
      'listening': 'Écoute... Parle maintenant !',
      'clickToStart': 'Cliquez sur le microphone pour commencer',
      'addItem': 'Ajouter un Article',
      'removeItem': 'Supprimer un Article',
      'editItem': 'Modifier un Article',
      'save': 'Sauvegarder',
      'cancel': 'Annuler'
    },
    'de-DE': {
      'voiceCommands': 'Sprachbefehle',
      'smartSuggestions': 'Intelligente Vorschläge',
      'shoppingList': 'Einkaufsliste',
      'listening': 'Höre zu... Sprich jetzt!',
      'clickToStart': 'Klicke auf das Mikrofon zum Starten',
      'addItem': 'Artikel Hinzufügen',
      'removeItem': 'Artikel Entfernen',
      'editItem': 'Artikel Bearbeiten',
      'save': 'Speichern',
      'cancel': 'Abbrechen'
    }
  }
  
  const langTranslations = translations[language as keyof typeof translations] || translations['en-US']
  return langTranslations[key as keyof typeof langTranslations] || key
}
