import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import VoiceRecognition from './VoiceRecognition'
import ShoppingList from './ShoppingList'
import SmartSuggestions from './SmartSuggestions'
import { ShoppingItem, VoiceCommand } from '../types'
import { processVoiceCommand } from '../utils/voiceProcessor'
import { generateSuggestions } from '../utils/suggestionEngine'
import { 
  detectLanguage, 
  translateToEnglish, 
  translateToUserLanguage,
  getLocalizedText,
  SUPPORTED_LANGUAGES
} from '../utils/geminiService'

interface VoiceShoppingAssistantProps {
  shoppingList: ShoppingItem[]
  onAddItem: (item: ShoppingItem) => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  selectedLanguage: string
}

const VoiceShoppingAssistant: React.FC<VoiceShoppingAssistantProps> = ({
  shoppingList,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  isListening,
  setIsListening,
  selectedLanguage
}) => {
  const [transcript, setTranscript] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (transcript && !isProcessing) {
      handleVoiceInput(transcript)
    }
  }, [transcript])

  const handleVoiceInput = async (text: string) => {
    setIsProcessing(true)
    setTranscript('')
    
    try {
      // Detect language if not English
      let detectedLanguage = selectedLanguage
      if (selectedLanguage === 'en-US') {
        detectedLanguage = await detectLanguage(text)
      }
      
      // Translate to English for processing if needed
      let processedText = text
      if (detectedLanguage !== 'en-US') {
        processedText = await translateToEnglish(text, detectedLanguage)
        toast.success(`Detected ${SUPPORTED_LANGUAGES[detectedLanguage as keyof typeof SUPPORTED_LANGUAGES]?.name || detectedLanguage}`)
      }
      
      const command = await processVoiceCommand(processedText)
      
      if (command.type === 'add' && command.item) {
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          name: command.item,
          quantity: command.quantity || 1,
          unit: command.unit || 'piece',
          category: command.category || 'general',
          price: command.price,
          brand: command.brand,
          notes: command.notes,
          addedAt: new Date(),
          isCompleted: false
        }
        
        onAddItem(newItem)
        toast.success(`Added ${command.quantity || 1} ${command.item} to your list`)
      } else if (command.type === 'remove' && command.item) {
        const itemToRemove = shoppingList.find(item => 
          item.name.toLowerCase().includes(command.item!.toLowerCase())
        )
        
        if (itemToRemove) {
          onRemoveItem(itemToRemove.id)
          toast.success(`Removed ${itemToRemove.name} from your list`)
        } else {
          toast.error(`Couldn't find ${command.item} in your list`)
        }
      } else if (command.type === 'search') {
        // Handle search functionality
        toast.success(`Searching for ${command.item}`)
      }
      
      // Generate new suggestions based on the updated list
      const newSuggestions = await generateSuggestions(shoppingList)
      setSuggestions(newSuggestions)
      
    } catch (error) {
      toast.error('Sorry, I didn\'t understand that command. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualAdd = (itemName: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: 1,
      unit: 'piece',
      category: 'general',
      addedAt: new Date(),
      isCompleted: false
    }
    
    onAddItem(newItem)
    toast.success(`Added ${itemName} to your list`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Voice Recognition Section */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <VoiceRecognition
            isListening={isListening}
            setIsListening={setIsListening}
            onTranscript={setTranscript}
            isProcessing={isProcessing}
          />
        </motion.div>
        
        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mt-6"
        >
          <SmartSuggestions
            suggestions={suggestions}
            onAddSuggestion={handleManualAdd}
            shoppingList={shoppingList}
          />
        </motion.div>
      </div>

      {/* Shopping List Section */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <ShoppingList
            items={shoppingList}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            onAddItem={handleManualAdd}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default VoiceShoppingAssistant
