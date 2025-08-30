export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  price?: number
  brand?: string
  notes?: string
  addedAt: Date
  isCompleted: boolean
}

export interface VoiceCommand {
  type: 'add' | 'remove' | 'update' | 'search' | 'suggestion'
  item?: string
  quantity?: number
  unit?: string
  category?: string
  price?: number
  brand?: string
  notes?: string
}

export interface ProductSuggestion {
  name: string
  category: string
  reason: 'history' | 'seasonal' | 'substitute' | 'trending'
  confidence: number
}

export interface ShoppingCategory {
  name: string
  icon: string
  color: string
  items: ShoppingItem[]
}

export interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  confidence: number
  error?: string
}
