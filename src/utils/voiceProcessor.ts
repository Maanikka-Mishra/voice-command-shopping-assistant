import { ShoppingItem } from '../types'

// Product variety database for common items
const PRODUCT_VARIETIES: { [key: string]: string[] } = {
  apples: [
    'Red Delicious Apples',
    'Granny Smith Apples', 
    'Gala Apples',
    'Fuji Apples',
    'Honeycrisp Apples',
    'Pink Lady Apples',
    'Golden Delicious Apples',
    'McIntosh Apples',
    'Braeburn Apples',
    'Cortland Apples'
  ],
  milk: [
    'Whole Milk',
    '2% Reduced Fat Milk',
    '1% Low Fat Milk',
    'Skim Milk',
    'Almond Milk',
    'Soy Milk',
    'Oat Milk',
    'Coconut Milk',
    'Organic Whole Milk',
    'Lactose-Free Milk'
  ],
  bread: [
    'Whole Wheat Bread',
    'White Bread',
    'Sourdough Bread',
    'Multigrain Bread',
    'Rye Bread',
    'Pumpernickel Bread',
    'Brioche Bread',
    'Ciabatta Bread',
    'Gluten-Free Bread',
    'Artisan Bread'
  ],
  eggs: [
    'Large Eggs',
    'Extra Large Eggs',
    'Jumbo Eggs',
    'Organic Eggs',
    'Free-Range Eggs',
    'Cage-Free Eggs',
    'Pasture-Raised Eggs',
    'Brown Eggs',
    'White Eggs',
    'Omega-3 Enriched Eggs'
  ],
  cheese: [
    'Cheddar Cheese',
    'Mozzarella Cheese',
    'Swiss Cheese',
    'Provolone Cheese',
    'Gouda Cheese',
    'Brie Cheese',
    'Blue Cheese',
    'Feta Cheese',
    'Parmesan Cheese',
    'Colby Jack Cheese'
  ],
  yogurt: [
    'Greek Yogurt',
    'Regular Yogurt',
    'Vanilla Yogurt',
    'Strawberry Yogurt',
    'Blueberry Yogurt',
    'Plain Yogurt',
    'Low-Fat Yogurt',
    'Non-Fat Yogurt',
    'Organic Yogurt',
    'Plant-Based Yogurt'
  ],
  bananas: [
    'Regular Bananas',
    'Organic Bananas',
    'Plantains',
    'Red Bananas',
    'Lady Finger Bananas',
    'Cavendish Bananas',
    'Baby Bananas',
    'Green Bananas',
    'Ripe Bananas',
    'Frozen Bananas'
  ],
  tomatoes: [
    'Roma Tomatoes',
    'Cherry Tomatoes',
    'Beefsteak Tomatoes',
    'Grape Tomatoes',
    'Heirloom Tomatoes',
    'Campari Tomatoes',
    'Vine-Ripened Tomatoes',
    'Organic Tomatoes',
    'Green Tomatoes',
    'Yellow Tomatoes'
  ],
  chicken: [
    'Chicken Breast',
    'Chicken Thighs',
    'Chicken Wings',
    'Whole Chicken',
    'Ground Chicken',
    'Chicken Tenders',
    'Organic Chicken',
    'Free-Range Chicken',
    'Boneless Chicken',
    'Skinless Chicken'
  ],
  rice: [
    'White Rice',
    'Brown Rice',
    'Basmati Rice',
    'Jasmine Rice',
    'Arborio Rice',
    'Wild Rice',
    'Sushi Rice',
    'Long Grain Rice',
    'Short Grain Rice',
    'Organic Rice'
  ]
}

export interface ProcessedVoiceResult {
  type: 'add' | 'remove' | 'suggest' | 'confirm' | 'error'
  message: string
  item?: ShoppingItem
  suggestions?: string[]
  selectedItem?: string
  quantity?: number
  unit?: string
  category?: string
}

// Call Gemini API for variety suggestions
async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || 'AIzaSyD55mHbcwKxjyfia_i1Vvh1v2E2ChGayAw'
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    
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

    const data = await response.json()
    return data.candidates[0]?.content.parts[0]?.text || ''
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return ''
  }
}

// Get variety suggestions from Gemini API
async function getVarietySuggestions(itemName: string): Promise<string[]> {
  try {
    const prompt = `Generate 8-10 popular varieties, brands, or types of "${itemName}" for shopping. 
    Include different brands, flavors, sizes, or types that people commonly buy.
    Return only the names, one per line, without numbers or bullet points.
    Examples:
    - For "toothpaste": Colgate, Crest, Sensodyne, Oral-B, etc.
    - For "shoes": Nike, Adidas, Converse, Vans, etc.
    - For "meat": Beef, Pork, Lamb, Chicken, etc.
    - For "lentils": Red Lentils, Green Lentils, Black Lentils, etc.`
    
    const response = await callGeminiAPI(prompt)
    if (response) {
      const suggestions = response.split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 10)
      
      return suggestions.length > 0 ? suggestions : getFallbackSuggestions(itemName)
    }
  } catch (error) {
    console.error('Error getting variety suggestions:', error)
  }
  
  return getFallbackSuggestions(itemName)
}

// Fallback suggestions if API fails
function getFallbackSuggestions(itemName: string): string[] {
  const lowerName = itemName.toLowerCase()
  
  // Generic fallback suggestions based on item type
  if (lowerName.includes('shirt') || lowerName.includes('clothes') || lowerName.includes('clothing')) {
    return ['Nike Shirt', 'Adidas Shirt', 'Puma Shirt', 'Under Armour Shirt', 'Levi\'s Shirt', 'Tommy Hilfiger Shirt', 'Calvin Klein Shirt', 'Ralph Lauren Shirt']
  }
  
  if (lowerName.includes('shoes') || lowerName.includes('footwear')) {
    return ['Nike Shoes', 'Adidas Shoes', 'Converse Shoes', 'Vans Shoes', 'Puma Shoes', 'Reebok Shoes', 'New Balance Shoes', 'Skechers Shoes']
  }
  
  if (lowerName.includes('toothpaste') || lowerName.includes('dental')) {
    return ['Colgate Toothpaste', 'Crest Toothpaste', 'Sensodyne Toothpaste', 'Oral-B Toothpaste', 'Aquafresh Toothpaste', 'Arm & Hammer Toothpaste', 'Tom\'s Toothpaste', 'Close-Up Toothpaste']
  }
  
  if (lowerName.includes('meat') || lowerName.includes('beef') || lowerName.includes('pork')) {
    return ['Beef', 'Pork', 'Lamb', 'Chicken', 'Turkey', 'Duck', 'Goat', 'Bison']
  }
  
  if (lowerName.includes('lentil') || lowerName.includes('dal')) {
    return ['Red Lentils', 'Green Lentils', 'Black Lentils', 'Yellow Lentils', 'Brown Lentils', 'Split Peas', 'Chickpeas', 'Kidney Beans']
  }
  
  // Generic suggestions
  return [
    `${itemName} - Brand A`,
    `${itemName} - Brand B`, 
    `${itemName} - Premium`,
    `${itemName} - Organic`,
    `${itemName} - Regular`,
    `${itemName} - Large Size`,
    `${itemName} - Small Size`,
    `${itemName} - Standard`
  ]
}

export const processVoiceCommand = async (
  transcript: string,
  language: string = 'en-US'
): Promise<ProcessedVoiceResult> => {
  try {
    const lowerText = transcript.toLowerCase().trim()

    // Check for variety suggestions - first check predefined items
    for (const [product, varieties] of Object.entries(PRODUCT_VARIETIES)) {
      if (lowerText.includes(product) && !lowerText.includes('add') && !lowerText.includes('remove')) {
        return {
          type: 'suggest',
          message: `I found several varieties of ${product}. Which one would you like?`,
          suggestions: varieties,
          category: getCategoryForProduct(product)
        }
      }
    }

    // Check for any other item that might need variety suggestions
    const itemMatch = lowerText.match(/(?:^|\s)([a-zA-Z]+(?:\s+[a-zA-Z]+)*?)(?:\s|$)/)
    if (itemMatch && !lowerText.includes('add') && !lowerText.includes('remove')) {
      const itemName = itemMatch[1].trim()
      
      // Skip very short words or common words
      if (itemName.length > 2 && !['the', 'and', 'or', 'but', 'for', 'with', 'from'].includes(itemName.toLowerCase())) {
        // Get variety suggestions from Gemini API
        const suggestions = await getVarietySuggestions(itemName)
        
        if (suggestions.length > 0) {
          return {
            type: 'suggest',
            message: `I found several options for ${itemName}. Which one would you like?`,
            suggestions: suggestions,
            category: getCategoryForProduct(itemName)
          }
        }
      }
    }

    // Process quantity and unit
    const quantityMatch = lowerText.match(/(\d+)\s*(\w+)?\s*(.+)/i)
    if (quantityMatch) {
      const quantity = parseInt(quantityMatch[1])
      const unit = quantityMatch[2] || getDefaultUnit(quantityMatch[3])
      const itemName = quantityMatch[3].trim()
      
      return {
        type: 'add',
        message: `Added ${quantity} ${unit} of ${itemName} to your shopping list.`,
        item: {
          id: Date.now().toString(),
          name: itemName,
          quantity,
          unit,
          category: getCategoryForProduct(itemName),
          isCompleted: false,
          addedAt: new Date()
        }
      }
    }

    // Process simple item names
    const addMatch = lowerText.match(/(?:add|get|buy|need)\s+(.+)/i)
    if (addMatch) {
      const itemName = addMatch[1].trim()
      const category = getCategoryForProduct(itemName)
      
      return {
        type: 'add',
        message: `Added ${itemName} to your shopping list.`,
        item: {
          id: Date.now().toString(),
          name: itemName,
          quantity: 1,
          unit: getDefaultUnit(itemName),
          category,
          isCompleted: false,
          addedAt: new Date()
        }
      }
    }

    // Process removal
    const removeMatch = lowerText.match(/(?:remove|delete|take off)\s+(.+)/i)
    if (removeMatch) {
      const itemName = removeMatch[1].trim()
      return {
        type: 'remove',
        message: `Removed ${itemName} from your shopping list.`,
        selectedItem: itemName
      }
    }

    // Process confirmation of variety selection
    const confirmMatch = lowerText.match(/(?:yes|okay|sure|that's fine|good|perfect|number\s+(\d+)|the\s+(\w+))/i)
    if (confirmMatch) {
      return {
        type: 'confirm',
        message: 'Great choice! I\'ll add that to your list.',
        selectedItem: confirmMatch[1] || confirmMatch[2]
      }
    }

    // Default error response
    return {
      type: 'error',
      message: `I didn't understand that. Try saying something like "add milk" or "I need 5 apples".`
    }

  } catch (error) {
    console.error('Error processing voice command:', error)
    return {
      type: 'error',
      message: 'Sorry, I had trouble processing your request. Please try again.'
    }
  }
}

const getCategoryForProduct = (product: string): string => {
  const lowerProduct = product.toLowerCase()
  
  // Enhanced category detection
  if (lowerProduct.includes('apple') || lowerProduct.includes('banana') || lowerProduct.includes('mango') || 
      lowerProduct.includes('tomato') || lowerProduct.includes('vegetable') || lowerProduct.includes('fruit')) {
    return 'produce'
  }
  
  if (lowerProduct.includes('milk') || lowerProduct.includes('cheese') || lowerProduct.includes('yogurt') || 
      lowerProduct.includes('egg') || lowerProduct.includes('dairy')) {
    return 'dairy'
  }
  
  if (lowerProduct.includes('bread') || lowerProduct.includes('cake') || lowerProduct.includes('pastry') || 
      lowerProduct.includes('bun') || lowerProduct.includes('croissant')) {
    return 'bakery'
  }
  
  if (lowerProduct.includes('chicken') || lowerProduct.includes('beef') || lowerProduct.includes('pork') || 
      lowerProduct.includes('lamb') || lowerProduct.includes('meat') || lowerProduct.includes('fish')) {
    return 'meat'
  }
  
  if (lowerProduct.includes('rice') || lowerProduct.includes('lentil') || lowerProduct.includes('dal') || 
      lowerProduct.includes('pasta') || lowerProduct.includes('flour') || lowerProduct.includes('grain')) {
    return 'pantry'
  }
  
  if (lowerProduct.includes('shirt') || lowerProduct.includes('pants') || lowerProduct.includes('dress') || 
      lowerProduct.includes('shoes') || lowerProduct.includes('clothes') || lowerProduct.includes('clothing')) {
    return 'clothing'
  }
  
  if (lowerProduct.includes('toothpaste') || lowerProduct.includes('soap') || lowerProduct.includes('shampoo') || 
      lowerProduct.includes('deodorant') || lowerProduct.includes('cosmetic') || lowerProduct.includes('beauty')) {
    return 'personal care'
  }
  
  if (lowerProduct.includes('phone') || lowerProduct.includes('laptop') || lowerProduct.includes('computer') || 
      lowerProduct.includes('electronic') || lowerProduct.includes('gadget')) {
    return 'electronics'
  }
  
  return 'general'
}

const getDefaultUnit = (item: string): string => {
  const lowerItem = item.toLowerCase()
  
  // Enhanced unit detection
  if (lowerItem.includes('apple') || lowerItem.includes('banana') || lowerItem.includes('mango') || 
      lowerItem.includes('tomato') || lowerItem.includes('fruit')) {
    return 'piece'
  }
  
  if (lowerItem.includes('milk')) return 'gallon'
  if (lowerItem.includes('bread')) return 'loaf'
  if (lowerItem.includes('egg')) return 'dozen'
  if (lowerItem.includes('cheese')) return 'package'
  if (lowerItem.includes('yogurt')) return 'container'
  if (lowerItem.includes('chicken') || lowerItem.includes('beef') || lowerItem.includes('meat')) return 'pound'
  if (lowerItem.includes('rice') || lowerItem.includes('lentil') || lowerItem.includes('dal')) return 'bag'
  
  if (lowerItem.includes('shirt') || lowerItem.includes('pants') || lowerItem.includes('dress') || 
      lowerItem.includes('clothes') || lowerItem.includes('clothing')) {
    return 'piece'
  }
  
  if (lowerItem.includes('toothpaste') || lowerItem.includes('soap') || lowerItem.includes('shampoo')) {
    return 'tube'
  }
  
  if (lowerItem.includes('shoes') || lowerItem.includes('footwear')) {
    return 'pair'
  }
  
  return 'piece'
}

export const createShoppingItem = (
  name: string,
  quantity: number = 1,
  unit: string = 'piece',
  category: string = 'general'
): ShoppingItem => {
  return {
    id: Date.now().toString(),
    name,
    quantity,
    unit,
    category,
    isCompleted: false,
    addedAt: new Date()
  }
}
