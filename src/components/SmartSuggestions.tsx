import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Plus, 
  TrendingUp, 
  Clock, 
  Star,
  Sparkles,
  Lightbulb,
  Zap
} from 'lucide-react'
import { ShoppingItem } from '../types'

interface SmartSuggestionsProps {
  suggestions: string[]
  onAddSuggestion: (itemName: string) => void
  shoppingList: ShoppingItem[]
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  onAddSuggestion,
  shoppingList
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'seasonal', name: 'Seasonal', icon: Clock, color: 'from-green-500 to-emerald-500' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { id: 'favorites', name: 'Favorites', icon: Star, color: 'from-yellow-500 to-orange-500' }
  ]

  const getSuggestionReason = (suggestion: string) => {
    const reasons = [
      { type: 'seasonal', items: ['organic honey', 'local farm eggs', 'fresh berries'], icon: Clock },
      { type: 'trending', items: ['artisan bread', 'cold-pressed olive oil', 'natural maple syrup'], icon: TrendingUp },
      { type: 'favorites', items: ['organic milk', 'whole grain bread', 'fresh bananas'], icon: Star }
    ]
    
    for (const reason of reasons) {
      if (reason.items.some(item => suggestion.toLowerCase().includes(item.toLowerCase()))) {
        return reason
      }
    }
    return { type: 'smart', items: [], icon: Brain }
  }

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(suggestion => {
        const reason = getSuggestionReason(suggestion)
        return reason.type === selectedCategory
      })

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Smart Suggestions</h3>
            <p className="text-gray-400 text-sm">AI-powered recommendations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">AI Active</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600'
            }`}
          >
            <category.icon className="w-3 h-3" />
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredSuggestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Lightbulb className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-gray-400 mb-1">No suggestions available</h4>
              <p className="text-gray-500 text-xs">
                Add some items to your list to get personalized suggestions
              </p>
            </motion.div>
          ) : (
            filteredSuggestions.map((suggestion, index) => {
              const reason = getSuggestionReason(suggestion)
              const isInList = shoppingList.some(item => 
                item.name.toLowerCase().includes(suggestion.toLowerCase())
              )
              
              return (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gray-700/30 border border-gray-600 rounded-xl p-4 transition-all duration-200 ${
                    isInList ? 'opacity-50' : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center">
                        <reason.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${
                          isInList ? 'text-gray-500 line-through' : 'text-white'
                        }`}>
                          {suggestion}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${
                            reason.type === 'seasonal' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : reason.type === 'trending'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : reason.type === 'favorites'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}>
                            <Zap className="w-3 h-3" />
                            <span className="capitalize">{reason.type}</span>
                          </span>
                          
                          {reason.type === 'seasonal' && (
                            <span className="text-green-400 text-xs">🌱 In Season</span>
                          )}
                          {reason.type === 'trending' && (
                            <span className="text-blue-400 text-xs">📈 Popular</span>
                          )}
                          {reason.type === 'favorites' && (
                            <span className="text-yellow-400 text-xs">⭐ Recommended</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isInList ? (
                        <span className="text-xs text-gray-500 bg-gray-600/50 px-2 py-1 rounded-lg">
                          Added
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddSuggestion(suggestion)}
                          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* AI Status */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>AI analyzing your preferences</span>
          </div>
          <span className="text-gray-500">Powered by Gemini</span>
        </div>
      </div>
    </div>
  )
}

export default SmartSuggestions
