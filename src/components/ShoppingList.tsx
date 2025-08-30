import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  Edit3, 
  Check, 
  Plus, 
  ShoppingBag, 
  Package,
  DollarSign,
  Tag
} from 'lucide-react'
import { ShoppingItem } from '../types'

interface ShoppingListProps {
  items: ShoppingItem[]
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void
  onAddItem: (itemName: string) => void
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onRemoveItem,
  onUpdateItem,
  onAddItem
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ShoppingItem>>({})
  const [newItemInput, setNewItemInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { name: 'all', label: 'All Items', icon: ShoppingBag, color: 'bg-gray-500' },
    { name: 'dairy', label: 'Dairy', icon: Package, color: 'bg-blue-500' },
    { name: 'produce', label: 'Produce', icon: Package, color: 'bg-green-500' },
    { name: 'meat', label: 'Meat', icon: Package, color: 'bg-red-500' },
    { name: 'pantry', label: 'Pantry', icon: Package, color: 'bg-yellow-500' },
    { name: 'beverages', label: 'Beverages', icon: Package, color: 'bg-purple-500' },
    { name: 'snacks', label: 'Snacks', icon: Package, color: 'bg-orange-500' },
    { name: 'household', label: 'Household', icon: Package, color: 'bg-indigo-500' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  const handleEdit = (item: ShoppingItem) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      price: item.price,
      brand: item.brand,
      notes: item.notes
    })
  }

  const handleSaveEdit = () => {
    if (editingId && editForm.name) {
      onUpdateItem(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemInput.trim()) {
      onAddItem(newItemInput.trim())
      setNewItemInput('')
    }
  }

  const toggleComplete = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      onUpdateItem(id, { isCompleted: !item.isCompleted })
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    if (category) {
      const IconComponent = category.icon
      return <IconComponent className="w-4 h-4" />
    }
    return <Package className="w-4 h-4" />
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || 'bg-gray-500'
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Shopping List
        </h2>
        <div className="text-lg text-gray-600">
          {items.length} item{items.length !== 1 ? 's' : ''} in your list
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.name)}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm
              ${selectedCategory === category.name
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:text-gray-800 hover:shadow-md border border-gray-200 hover:border-primary-300'
              }
            `}
          >
            <category.icon className="w-5 h-5" />
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Add New Item */}
      <form onSubmit={handleAddItem} className="flex space-x-2">
        <input
          type="text"
          value={newItemInput}
          onChange={(e) => setNewItemInput(e.target.value)}
          placeholder="Add a new item..."
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={!newItemInput.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Shopping Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Your shopping list is empty</h3>
              <p className="text-lg text-gray-500 mb-6">Use voice commands or type to add items</p>
              <div className="flex justify-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                  🎤 Say "Add milk"
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                  ✍️ Type manually
                </div>
              </div>
            </motion.div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  bg-white border rounded-lg p-4 transition-all duration-200
                  ${item.isCompleted 
                    ? 'border-green-200 bg-green-50 opacity-75' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                {editingId === item.id ? (
                  // Edit Form
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field"
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        value={editForm.quantity || 1}
                        onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                        className="input-field"
                        min="1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editForm.unit || 'piece'}
                        onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                        className="input-field"
                      >
                        <option value="piece">piece</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">liter</option>
                        <option value="ml">ml</option>
                        <option value="pack">pack</option>
                        <option value="bottle">bottle</option>
                        <option value="can">can</option>
                      </select>
                      <select
                        value={editForm.category || 'general'}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="input-field"
                      >
                        {categories.slice(1).map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="btn-primary flex-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Item
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                          ${item.isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                          }
                        `}
                      >
                        {item.isCompleted && <Check className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm px-2 py-1 rounded-full text-white ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          <h3 className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{item.quantity} {item.unit}</span>
                          {item.price && (
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>{item.price}</span>
                            </span>
                          )}
                          {item.brand && (
                            <span className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>{item.brand}</span>
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1 italic">"{item.notes}"</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ShoppingList
