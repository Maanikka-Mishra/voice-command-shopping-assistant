import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ShoppingCart, Sparkles } from 'lucide-react'

interface VarietySelectorProps {
  isVisible: boolean
  suggestions: string[]
  message: string
  onSelect: (item: string) => void
  onCancel: () => void
  category?: string
}

const VarietySelector: React.FC<VarietySelectorProps> = ({
  isVisible,
  suggestions,
  message,
  onSelect,
  onCancel,
  category = 'general'
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    setTimeout(() => {
      onSelect(suggestions[index])
      setSelectedIndex(null)
    }, 500)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      produce: 'from-green-500 to-emerald-500',
      dairy: 'from-blue-500 to-cyan-500',
      bakery: 'from-yellow-500 to-orange-500',
      meat: 'from-red-500 to-pink-500',
      pantry: 'from-purple-500 to-indigo-500',
      clothing: 'from-indigo-500 to-purple-500',
      'personal care': 'from-pink-500 to-rose-500',
      electronics: 'from-cyan-500 to-blue-500',
      general: 'from-gray-500 to-gray-600'
    }
    return colors[category] || colors.general
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      produce: '🥬',
      dairy: '🥛',
      bakery: '🍞',
      meat: '🍗',
      pantry: '🥫',
      clothing: '👕',
      'personal care': '🧴',
      electronics: '📱',
      general: '🛒'
    }
    return icons[category] || icons.general
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(category)} rounded-xl flex items-center justify-center text-white text-lg`}>
                {getCategoryIcon(category)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Choose Your Variety</h3>
                <p className="text-gray-400 text-sm">{message}</p>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelect(index)}
                  disabled={selectedIndex !== null}
                  className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                    selectedIndex === index
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-500 shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                  } ${selectedIndex !== null && selectedIndex !== index ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{suggestion}</span>
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-purple-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => onSelect('Custom Item')}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Custom</span>
              </button>
            </div>

            {/* Voice Instructions */}
            <div className="mt-4 p-3 bg-gray-700/30 rounded-xl">
              <p className="text-gray-400 text-xs text-center">
                💡 You can also say "number 1" or "the first one" to make your selection
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VarietySelector
