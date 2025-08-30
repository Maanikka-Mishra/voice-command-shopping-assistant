import { VoiceCommand } from '../types'

// Natural language processing patterns for voice commands
const patterns = {
  add: [
    /(?:add|buy|get|need|want|i need|i want|i'd like|can you add|please add)\s+(.+)/i,
    /(.+)\s+(?:to my list|to the list|to shopping list)/i,
    /add\s+(.+?)(?:\s+to|$)/i
  ],
  remove: [
    /(?:remove|delete|take off|get rid of|don't need|no longer need)\s+(.+)/i,
    /(.+)\s+(?:from my list|from the list|from shopping list)/i
  ],
  update: [
    /(?:change|update|modify|edit)\s+(.+)/i,
    /(.+)\s+(?:to|with|as)\s+(.+)/i
  ],
  search: [
    /(?:find|search for|look for|where can i find)\s+(.+)/i,
    /(.+)\s+(?:under|below|less than)\s+\$?(\d+)/i,
    /(.+)\s+(?:brand|make)\s+(.+)/i
  ],
  quantity: [
    /(\d+)\s+(?:piece|pieces|item|items|pack|packs|bottle|bottles|can|cans|kg|kilos|grams?|liters?|ml)/i,
    /(\d+)\s+(.+)/i
  ],
  unit: [
    /(\d+)\s+(piece|pieces|pack|packs|bottle|bottles|can|cans|kg|kilos|grams?|liters?|ml)/i,
    /(.+)\s+(piece|pack|bottle|can|kg|kilos|grams?|liters?|ml)/i
  ],
  category: [
    /(dairy|milk|cheese|yogurt|produce|vegetables?|fruits?|meat|chicken|beef|pork|pantry|grains?|beverages?|drinks?|snacks?|household|cleaning|personal care)/i
  ],
  price: [
    /(?:under|below|less than|maximum|max)\s+\$?(\d+)/i,
    /(\d+)\s+dollars?/i,
    /\$(\d+)/i
  ],
  brand: [
    /(?:brand|make|company)\s+(.+)/i,
    /(.+)\s+(?:brand|make)/i
  ]
}

// Enhanced common shopping items and their categories with more comprehensive coverage
const itemCategories: { [key: string]: string } = {
  // Dairy
  'milk': 'dairy',
  'cheese': 'dairy',
  'yogurt': 'dairy',
  'butter': 'dairy',
  'cream': 'dairy',
  'eggs': 'dairy',
  'organic milk': 'dairy',
  'organic eggs': 'dairy',
  'greek yogurt': 'dairy',
  'cottage cheese': 'dairy',
  
  // Produce
  'apple': 'produce',
  'apples': 'produce',
  'banana': 'produce',
  'bananas': 'produce',
  'orange': 'produce',
  'oranges': 'produce',
  'tomato': 'produce',
  'tomatoes': 'produce',
  'lettuce': 'produce',
  'carrot': 'produce',
  'carrots': 'produce',
  'onion': 'produce',
  'onions': 'produce',
  'potato': 'produce',
  'potatoes': 'produce',
  'organic': 'produce',
  'organic apples': 'produce',
  'organic bananas': 'produce',
  'local honey': 'produce',
  'farm fresh': 'produce',
  
  // Meat
  'chicken': 'meat',
  'beef': 'meat',
  'pork': 'meat',
  'fish': 'meat',
  'turkey': 'meat',
  'organic chicken': 'meat',
  'grass-fed beef': 'meat',
  'free-range': 'meat',
  
  // Pantry
  'bread': 'pantry',
  'rice': 'pantry',
  'pasta': 'pantry',
  'flour': 'pantry',
  'sugar': 'pantry',
  'oil': 'pantry',
  'olive oil': 'pantry',
  'organic bread': 'pantry',
  'artisan bread': 'pantry',
  'honey': 'pantry',
  'organic honey': 'pantry',
  'maple syrup': 'pantry',
  
  // Beverages
  'water': 'beverages',
  'juice': 'beverages',
  'soda': 'beverages',
  'coffee': 'beverages',
  'tea': 'beverages',
  'organic tea': 'beverages',
  'cold-pressed': 'beverages',
  
  // Snacks
  'chips': 'snacks',
  'cookies': 'snacks',
  'crackers': 'snacks',
  'nuts': 'snacks',
  'organic snacks': 'snacks',
  
  // Household
  'soap': 'household',
  'detergent': 'household',
  'paper': 'household',
  'toothpaste': 'household',
  'shampoo': 'household',
  'organic soap': 'household',
  'natural': 'household'
}

// Common units for different item types
const itemUnits: { [key: string]: string } = {
  'milk': 'liter',
  'water': 'liter',
  'juice': 'liter',
  'oil': 'liter',
  'bread': 'piece',
  'apple': 'piece',
  'banana': 'piece',
  'orange': 'piece',
  'tomato': 'piece',
  'egg': 'piece',
  'chicken': 'kg',
  'beef': 'kg',
  'rice': 'kg',
  'flour': 'kg',
  'sugar': 'kg',
  'chips': 'pack',
  'cookies': 'pack',
  'crackers': 'pack',
  'soap': 'piece',
  'toothpaste': 'piece',
  'shampoo': 'bottle'
}

export async function processVoiceCommand(text: string): Promise<VoiceCommand> {
  const lowerText = text.toLowerCase().trim()
  
  // Determine command type
  let commandType: VoiceCommand['type'] = 'add'
  let item: string | undefined
  let quantity: number | undefined
  let unit: string | undefined
  let category: string | undefined
  let price: number | undefined
  let brand: string | undefined
  let notes: string | undefined

  // Check for remove commands
  if (patterns.remove.some(pattern => pattern.test(lowerText))) {
    commandType = 'remove'
    for (const pattern of patterns.remove) {
      const match = lowerText.match(pattern)
      if (match) {
        item = match[1]?.trim()
        break
      }
    }
  }
  // Check for search commands
  else if (patterns.search.some(pattern => pattern.test(lowerText))) {
    commandType = 'search'
    for (const pattern of patterns.search) {
      const match = lowerText.match(pattern)
      if (match) {
        item = match[1]?.trim()
        if (match[2]) {
          price = parseInt(match[2])
        }
        break
      }
    }
  }
  // Default to add command
  else {
    commandType = 'add'
    
    // Extract item name
    for (const pattern of patterns.add) {
      const match = lowerText.match(pattern)
      if (match) {
        item = match[1]?.trim()
        break
      }
    }
    
    // If no add pattern matched, try to extract the main item
    if (!item) {
      // Remove common words and extract the main item
      const words = lowerText.split(' ')
      const filteredWords = words.filter(word => 
        !['add', 'buy', 'get', 'need', 'want', 'to', 'my', 'list', 'the', 'shopping', 'please', 'can', 'you'].includes(word)
      )
      item = filteredWords.join(' ')
    }
    
    // Extract quantity
    for (const pattern of patterns.quantity) {
      const match = lowerText.match(pattern)
      if (match) {
        quantity = parseInt(match[1])
        break
      }
    }
    
    // Extract unit
    for (const pattern of patterns.unit) {
      const match = lowerText.match(pattern)
      if (match) {
        unit = match[2] || match[1]
        break
      }
    }
    
    // Extract price
    for (const pattern of patterns.price) {
      const match = lowerText.match(pattern)
      if (match) {
        price = parseInt(match[1])
        break
      }
    }
    
    // Extract brand
    for (const pattern of patterns.brand) {
      const match = lowerText.match(pattern)
      if (match) {
        brand = match[1]?.trim()
        break
      }
    }
  }

  // Auto-categorize items if category not specified
  if (commandType === 'add' && item && !category) {
    const itemWords = item.toLowerCase().split(' ')
    for (const word of itemWords) {
      if (itemCategories[word]) {
        category = itemCategories[word]
        break
      }
    }
    if (!category) {
      category = 'general'
    }
  }

  // Auto-assign units if not specified
  if (commandType === 'add' && item && !unit) {
    const itemWords = item.toLowerCase().split(' ')
    for (const word of itemWords) {
      if (itemUnits[word]) {
        unit = itemUnits[word]
        break
      }
    }
    if (!unit) {
      unit = 'piece'
    }
  }

  // Set default quantity if not specified
  if (commandType === 'add' && !quantity) {
    quantity = 1
  }

  // Clean up item name
  if (item) {
    // Remove quantity and unit from item name if they were extracted
    if (quantity && quantity > 1) {
      item = item.replace(new RegExp(`^${quantity}\\s*`, 'i'), '')
    }
    if (unit && unit !== 'piece') {
      item = item.replace(new RegExp(`\\s*${unit}s?$`, 'i'), '')
    }
    item = item.trim()
  }

  return {
    type: commandType,
    item,
    quantity,
    unit,
    category,
    price,
    brand,
    notes
  }
}

// Helper function to extract numbers from text
export function extractNumbers(text: string): number[] {
  const numbers = text.match(/\d+/g)
  return numbers ? numbers.map(n => parseInt(n)) : []
}

// Helper function to extract currency amounts from text
export function extractCurrency(text: string): number[] {
  const amounts = text.match(/\$(\d+)/g)
  return amounts ? amounts.map(a => parseInt(a.replace('$', ''))) : []
}

// Helper function to clean up item names
export function cleanItemName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(add|buy|get|need|want|to|my|list|the|shopping|please|can|you)\b/g, '')
    .trim()
}
