import { ShoppingItem } from '../types'

export const demoShoppingList: ShoppingItem[] = [
  {
    id: '1',
    name: 'Organic Milk',
    quantity: 2,
    unit: 'liter',
    category: 'dairy',
    price: 3.99,
    brand: 'Organic Valley',
    notes: '2% fat content',
    addedAt: new Date(Date.now() - 86400000), // 1 day ago
    isCompleted: false
  },
  {
    id: '2',
    name: 'Whole Grain Bread',
    quantity: 1,
    unit: 'piece',
    category: 'pantry',
    price: 2.49,
    brand: 'Dave\'s Killer Bread',
    notes: '21 whole grains',
    addedAt: new Date(Date.now() - 172800000), // 2 days ago
    isCompleted: false
  },
  {
    id: '3',
    name: 'Fresh Bananas',
    quantity: 6,
    unit: 'piece',
    category: 'produce',
    price: 1.99,
    brand: 'Chiquita',
    notes: 'Organic if available',
    addedAt: new Date(Date.now() - 259200000), // 3 days ago
    isCompleted: true
  },
  {
    id: '4',
    name: 'Free Range Eggs',
    quantity: 12,
    unit: 'piece',
    category: 'dairy',
    price: 4.99,
    brand: 'Vital Farms',
    notes: 'Large size',
    addedAt: new Date(Date.now() - 345600000), // 4 days ago
    isCompleted: false
  },
  {
    id: '5',
    name: 'Organic Spinach',
    quantity: 1,
    unit: 'pack',
    category: 'produce',
    price: 3.49,
    brand: 'Earthbound Farm',
    notes: 'Baby spinach leaves',
    addedAt: new Date(Date.now() - 432000000), // 5 days ago
    isCompleted: false
  }
]

export const demoCategories = [
  { name: 'dairy', label: 'Dairy', color: 'bg-blue-500', count: 2 },
  { name: 'produce', label: 'Produce', color: 'bg-green-500', count: 2 },
  { name: 'pantry', label: 'Pantry', color: 'bg-yellow-500', count: 1 },
  { name: 'meat', label: 'Meat', color: 'bg-red-500', count: 0 },
  { name: 'beverages', label: 'Beverages', color: 'bg-purple-500', count: 0 },
  { name: 'snacks', label: 'Snacks', color: 'bg-orange-500', count: 0 },
  { name: 'household', label: 'Household', color: 'bg-indigo-500', count: 0 }
]

export const demoVoiceCommands = [
  'Add milk to my list',
  'I need 5 apples',
  'Buy organic bread',
  'Get 2 liters of water',
  'Add chicken breast 1 kg',
  'Remove milk from list',
  'Find toothpaste under $5',
  'Add dairy products',
  'Buy produce items',
  'I want to get some snacks'
]

export const demoStats = {
  totalItems: 5,
  completedItems: 1,
  totalValue: 16.95,
  categories: 3,
  averagePrice: 3.39
}

export const demoTrends = [
  { item: 'Organic Milk', trend: 'up', change: '+15%' },
  { item: 'Plant-based Milk', trend: 'up', change: '+25%' },
  { item: 'Local Honey', trend: 'up', change: '+10%' },
  { item: 'Fresh Berries', trend: 'down', change: '-5%' }
]

export const demoSeasonalItems = {
  current: ['pumpkin', 'squash', 'apples', 'pears', 'mushrooms'],
  upcoming: ['citrus fruits', 'root vegetables', 'winter squash'],
  ending: ['fresh berries', 'summer fruits', 'zucchini']
}
