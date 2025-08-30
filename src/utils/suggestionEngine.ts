import { ShoppingItem } from '../types'

// Mock data for seasonal items
const seasonalItems = {
  spring: ['asparagus', 'peas', 'strawberries', 'rhubarb', 'artichokes'],
  summer: ['tomatoes', 'corn', 'watermelon', 'peaches', 'zucchini', 'bell peppers'],
  fall: ['pumpkin', 'squash', 'apples', 'pears', 'mushrooms', 'sweet potatoes'],
  winter: ['citrus fruits', 'root vegetables', 'winter squash', 'cabbage', 'kale']
}

// Enhanced trending items with more variety
const trendingItems = [
  'organic avocados',
  'plant-based milk',
  'quinoa',
  'chia seeds',
  'kombucha',
  'kale chips',
  'coconut water',
  'almond butter',
  'spirulina',
  'matcha powder',
  'organic honey',
  'local farm eggs',
  'artisan bread',
  'cold-pressed juices',
  'superfood smoothies'
]

// Enhanced frequently bought together with more comprehensive suggestions
const frequentlyBoughtTogether: { [key: string]: string[] } = {
  'milk': ['bread', 'cereal', 'eggs', 'honey', 'cookies', 'chocolate'],
  'bread': ['milk', 'butter', 'jam', 'honey', 'olive oil', 'garlic'],
  'eggs': ['milk', 'bacon', 'cheese', 'bread', 'vegetables', 'herbs'],
  'bananas': ['yogurt', 'cereal', 'peanut butter', 'honey', 'nuts', 'chocolate'],
  'chicken': ['rice', 'vegetables', 'sauce', 'herbs', 'olive oil', 'garlic'],
  'pasta': ['tomato sauce', 'cheese', 'vegetables', 'olive oil', 'garlic', 'herbs'],
  'coffee': ['cream', 'sugar', 'filters', 'cookies', 'pastries', 'milk'],
  'toothpaste': ['toothbrush', 'floss', 'mouthwash', 'soap', 'shampoo', 'deodorant'],
  'apples': [
    'organic honey', 'local honey', 'cinnamon', 'nuts', 'yogurt', 'cheese', 
    'organic bread', 'artisan bread', 'organic milk', 'farm fresh eggs',
    'organic options', 'local varieties', 'cold-pressed olive oil', 'maple syrup'
  ],
  'apple': [
    'organic honey', 'local honey', 'cinnamon', 'nuts', 'yogurt', 'cheese', 
    'organic bread', 'artisan bread', 'organic milk', 'farm fresh eggs',
    'organic options', 'local varieties', 'cold-pressed olive oil', 'maple syrup'
  ],
  'organic': [
    'local honey', 'farm fresh eggs', 'artisan bread', 'cold-pressed olive oil', 
    'natural maple syrup', 'organic milk', 'organic eggs', 'organic honey',
    'biodynamic wine', 'grass-fed beef', 'local farm produce'
  ],
  'honey': [
    'organic tea', 'organic bread', 'organic yogurt', 'organic nuts', 
    'organic fruits', 'organic options', 'local varieties', 'farm fresh eggs',
    'artisan bread', 'cold-pressed oils'
  ],
  'local': [
    'organic honey', 'farm fresh eggs', 'artisan bread', 'organic milk',
    'organic produce', 'local varieties', 'farm fresh'
  ],
  'farm': [
    'fresh eggs', 'organic milk', 'local honey', 'organic produce',
    'artisan bread', 'local varieties', 'farm fresh'
  ]
}

// Mock data for substitutes
const substitutes: { [key: string]: string[] } = {
  'milk': ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
  'butter': ['olive oil', 'coconut oil', 'avocado', 'greek yogurt'],
  'eggs': ['flax seeds', 'chia seeds', 'banana', 'applesauce'],
  'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
  'flour': ['almond flour', 'coconut flour', 'oat flour', 'quinoa flour'],
  'meat': ['tofu', 'tempeh', 'seitan', 'legumes', 'mushrooms']
}

export async function generateSuggestions(shoppingList: ShoppingItem[]): Promise<string[]> {
  const suggestions: string[] = []
  
  // Get current season
  const currentSeason = getCurrentSeason()
  
  // Add seasonal suggestions
  const seasonalSuggestions = seasonalItems[currentSeason as keyof typeof seasonalItems] || []
  suggestions.push(...seasonalSuggestions.slice(0, 3))
  
  // Add trending items
  suggestions.push(...trendingItems.slice(0, 3))
  
  // Add frequently bought together items
  const frequentSuggestions = getFrequentSuggestions(shoppingList)
  suggestions.push(...frequentSuggestions.slice(0, 3))
  
  // Add substitute suggestions based on current list
  const substituteSuggestions = getSubstituteSuggestions(shoppingList)
  suggestions.push(...substituteSuggestions.slice(0, 3))
  
  // Add organic and premium suggestions
  const organicSuggestions = getOrganicSuggestions(shoppingList)
  suggestions.push(...organicSuggestions.slice(0, 2))
  
  // Remove duplicates and limit to 8 suggestions for more variety
  const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8)
  
  return uniqueSuggestions
}

function getCurrentSeason(): string {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

function getFrequentSuggestions(shoppingList: ShoppingItem[]): string[] {
  const suggestions: string[] = []
  
  // Check if user has items that are frequently bought together
  for (const item of shoppingList) {
    const relatedItems = frequentlyBoughtTogether[item.name.toLowerCase()]
    if (relatedItems) {
      // Only suggest items that aren't already in the list
      const newSuggestions = relatedItems.filter(relatedItem => 
        !shoppingList.some(listItem => 
          listItem.name.toLowerCase().includes(relatedItem.toLowerCase())
        )
      )
      suggestions.push(...newSuggestions)
    }
  }
  
  return suggestions
}

function getSubstituteSuggestions(shoppingList: ShoppingItem[]): string[] {
  const suggestions: string[] = []
  
  // Check if user has items that have good substitutes
  for (const item of shoppingList) {
    const itemSubstitutes = substitutes[item.name.toLowerCase()]
    if (itemSubstitutes) {
      // Only suggest substitutes that aren't already in the list
      const newSuggestions = itemSubstitutes.filter(substitute => 
        !shoppingList.some(listItem => 
          listItem.name.toLowerCase().includes(substitute.toLowerCase())
        )
      )
      suggestions.push(...newSuggestions)
    }
  }
  
  return suggestions
}

export function getPersonalizedSuggestions(
  shoppingList: ShoppingItem[],
  userPreferences: any = {}
): string[] {
  const suggestions: string[] = []
  
  // Analyze shopping patterns
  const categories = shoppingList.map(item => item.category)
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as { [key: string]: number })
  
  // Suggest items from frequently bought categories
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category)
  
  // Add suggestions based on top categories
  for (const category of topCategories) {
    const categorySuggestions = getCategorySuggestions(category)
    suggestions.push(...categorySuggestions.slice(0, 2))
  }
  
  return suggestions.slice(0, 5)
}

// Enhanced function to get organic and premium suggestions
function getOrganicSuggestions(shoppingList: ShoppingItem[]): string[] {
  const organicSuggestions: string[] = []
  
  // Check if user has organic items and suggest more
  const hasOrganic = shoppingList.some(item => 
    item.name.toLowerCase().includes('organic') || 
    item.brand?.toLowerCase().includes('organic')
  )
  
  // Check if user has items that could have organic alternatives
  const hasApples = shoppingList.some(item => 
    item.name.toLowerCase().includes('apple')
  )
  
  const hasMilk = shoppingList.some(item => 
    item.name.toLowerCase().includes('milk')
  )
  
  const hasBread = shoppingList.some(item => 
    item.name.toLowerCase().includes('bread')
  )
  
  if (hasOrganic) {
    organicSuggestions.push(
      'organic honey',
      'farm fresh eggs',
      'artisan bread',
      'cold-pressed olive oil',
      'natural maple syrup',
      'local farm produce',
      'biodynamic wine',
      'grass-fed beef',
      'organic tea',
      'organic nuts',
      'organic yogurt'
    )
  } else {
    // Suggest organic alternatives for common items
    organicSuggestions.push(
      'organic milk',
      'organic eggs',
      'organic bread',
      'organic honey',
      'local farm produce'
    )
  }
  
  // Add specific organic suggestions based on current items
  if (hasApples) {
    organicSuggestions.push(
      'organic honey',
      'local honey',
      'organic cinnamon',
      'organic nuts',
      'organic yogurt'
    )
  }
  
  if (hasMilk) {
    organicSuggestions.push(
      'organic bread',
      'organic eggs',
      'organic honey',
      'organic yogurt'
    )
  }
  
  if (hasBread) {
    organicSuggestions.push(
      'organic honey',
      'organic milk',
      'organic eggs',
      'local honey',
      'organic butter'
    )
  }
  
  return organicSuggestions
}

function getCategorySuggestions(category: string): string[] {
  const categoryItems: { [key: string]: string[] } = {
    dairy: ['greek yogurt', 'cottage cheese', 'sour cream', 'heavy cream'],
    produce: ['spinach', 'broccoli', 'cauliflower', 'cucumber', 'radishes'],
    meat: ['salmon', 'tuna', 'lamb', 'duck', 'turkey breast'],
    pantry: ['beans', 'lentils', 'nuts', 'seeds', 'dried fruits'],
    beverages: ['green tea', 'herbal tea', 'sparkling water', 'smoothies'],
    snacks: ['popcorn', 'trail mix', 'protein bars', 'dried seaweed'],
    household: ['dish soap', 'laundry detergent', 'paper towels', 'trash bags']
  }
  
  return categoryItems[category] || []
}

export function getPriceBasedSuggestions(
  shoppingList: ShoppingItem[],
  budget: number
): string[] {
  const suggestions: string[] = []
  const currentTotal = shoppingList.reduce((sum, item) => sum + (item.price || 0), 0)
  const remainingBudget = budget - currentTotal
  
  if (remainingBudget > 0) {
    // Suggest budget-friendly items
    const budgetItems = [
      'rice', 'beans', 'pasta', 'potatoes', 'onions', 'carrots',
      'bananas', 'apples', 'eggs', 'bread', 'milk', 'canned tuna'
    ]
    
    suggestions.push(...budgetItems.slice(0, 3))
  }
  
  return suggestions
}

export function getHealthBasedSuggestions(
  shoppingList: ShoppingItem[],
  healthGoals: string[] = []
): string[] {
  const suggestions: string[] = []
  
  if (healthGoals.includes('weight loss')) {
    suggestions.push('leafy greens', 'lean protein', 'whole grains', 'berries')
  }
  
  if (healthGoals.includes('muscle gain')) {
    suggestions.push('chicken breast', 'salmon', 'quinoa', 'sweet potatoes', 'nuts')
  }
  
  if (healthGoals.includes('heart health')) {
    suggestions.push('oats', 'avocados', 'olive oil', 'fatty fish', 'dark chocolate')
  }
  
  if (healthGoals.includes('gut health')) {
    suggestions.push('yogurt', 'kefir', 'sauerkraut', 'kimchi', 'fiber-rich foods')
  }
  
  return suggestions.slice(0, 3)
}

export function getMealBasedSuggestions(
  shoppingList: ShoppingItem[],
  plannedMeals: string[] = []
): string[] {
  const suggestions: string[] = []
  
  // Common ingredients for popular meals
  const mealIngredients: { [key: string]: string[] } = {
    'pasta dinner': ['pasta', 'tomato sauce', 'cheese', 'garlic', 'olive oil'],
    'stir fry': ['vegetables', 'soy sauce', 'ginger', 'garlic', 'oil'],
    'salad': ['lettuce', 'tomatoes', 'cucumber', 'olive oil', 'vinegar'],
    'soup': ['vegetables', 'broth', 'herbs', 'onions', 'carrots'],
    'breakfast': ['eggs', 'bread', 'milk', 'butter', 'fruits']
  }
  
  for (const meal of plannedMeals) {
    const ingredients = mealIngredients[meal.toLowerCase()]
    if (ingredients) {
      // Only suggest ingredients that aren't already in the list
      const newIngredients = ingredients.filter(ingredient => 
        !shoppingList.some(listItem => 
          listItem.name.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
      suggestions.push(...newIngredients)
    }
  }
  
  return suggestions.slice(0, 5)
}
