import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  ShoppingBag, 
  Plus,
  Sparkles,
  Calendar,
  Star,
  Brain
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
  const [activeTab, setActiveTab] = useState<'suggestions' | 'trending' | 'seasonal'>('suggestions')

  // Mock data for demonstrations
  const trendingItems = [
    { name: 'Organic Avocados', reason: 'Trending healthy food', confidence: 0.9 },
    { name: 'Plant-based Milk', reason: 'Popular dairy alternative', confidence: 0.8 },
    { name: 'Quinoa', reason: 'High-protein grain trending', confidence: 0.7 },
    { name: 'Chia Seeds', reason: 'Superfood gaining popularity', confidence: 0.6 }
  ]

  const seasonalItems = [
    { name: 'Pumpkin Spice Products', reason: 'Fall seasonal items', confidence: 0.9 },
    { name: 'Fresh Berries', reason: 'Summer fruits in season', confidence: 0.8 },
    { name: 'Root Vegetables', reason: 'Winter vegetables available', confidence: 0.7 },
    { name: 'Citrus Fruits', reason: 'Winter citrus in season', confidence: 0.6 }
  ]

  const frequentlyBought = [
    { name: 'Milk', frequency: 5, lastBought: '2 days ago' },
    { name: 'Bread', frequency: 4, lastBought: '1 day ago' },
    { name: 'Eggs', frequency: 3, lastBought: '3 days ago' },
    { name: 'Bananas', frequency: 3, lastBought: '2 days ago' }
  ]

  const getSuggestionIcon = (reason: string) => {
    switch (reason) {
      case 'Trending healthy food':
      case 'Popular dairy alternative':
      case 'High-protein grain trending':
      case 'Superfood gaining popularity':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'Fall seasonal items':
      case 'Summer fruits in season':
      case 'Winter vegetables available':
      case 'Winter citrus in season':
        return <Calendar className="w-4 h-4 text-green-500" />
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-gray-500'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Smart Suggestions
        </h2>
        <p className="text-gray-600 mt-2">AI-powered recommendations just for you</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl shadow-sm">
        {[
          { id: 'suggestions', label: 'AI Suggestions', icon: Lightbulb, color: 'from-blue-500 to-indigo-600' },
          { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
          { id: 'seasonal', label: 'Seasonal', icon: Calendar, color: 'from-green-500 to-emerald-600' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'suggestions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* AI Suggestions */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800">AI Recommendations</h3>
                  <p className="text-sm text-blue-600">Based on your shopping patterns and preferences</p>
                </div>
              </div>
              
                              {suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestions.slice(0, 6).map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => onAddSuggestion(suggestion)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                            {suggestion}
                          </span>
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Plus className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-sm text-blue-600 italic">
                      Start adding items to get personalized suggestions
                    </p>
                  </div>
                )}
            </div>

            {/* Frequently Bought */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Frequently Bought</h3>
                  <p className="text-sm text-gray-600">Items you buy regularly</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {frequentlyBought.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => onAddSuggestion(item.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {item.frequency}x
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{item.lastBought}</p>
                      </div>
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'trending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-medium text-purple-800 mb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Items</span>
              </h3>
              <p className="text-sm text-purple-700 mb-3">
                Popular items that are trending right now
              </p>
              
              <div className="space-y-3">
                {trendingItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-purple-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                        {getConfidenceText(item.confidence)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSuggestionIcon(item.reason)}
                        <span className="text-sm text-gray-600">{item.reason}</span>
                      </div>
                      <button
                        onClick={() => onAddSuggestion(item.name)}
                        className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'seasonal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-medium text-green-800 mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Seasonal Recommendations</span>
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Items that are currently in season and at their best
              </p>
              
              <div className="space-y-3">
                {seasonalItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-green-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                        {getConfidenceText(item.confidence)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSuggestionIcon(item.reason)}
                        <span className="text-sm text-gray-600">{item.reason}</span>
                      </div>
                      <button
                        onClick={() => onAddSuggestion(item.name)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddSuggestion('Milk')}
            className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
          >
            + Milk
          </button>
          <button
            onClick={() => onAddSuggestion('Bread')}
            className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
          >
            + Bread
          </button>
          <button
            onClick={() => onAddSuggestion('Eggs')}
            className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
          >
            + Eggs
          </button>
          <button
            onClick={() => onAddSuggestion('Bananas')}
            className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
          >
            + Bananas
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmartSuggestions
