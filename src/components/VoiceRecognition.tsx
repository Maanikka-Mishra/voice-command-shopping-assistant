import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface VoiceRecognitionProps {
  isListening: boolean
  setIsListening: (listening: boolean) => void
  onTranscript: (transcript: string) => void
  isProcessing: boolean
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  isListening,
  setIsListening,
  onTranscript,
  isProcessing
}) => {
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
        toast.success('Listening... Speak now!')
      }
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        onTranscript(transcript)
      }
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow microphone access.')
        } else {
          toast.error('Speech recognition error. Please try again.')
        }
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      toast.error('Speech recognition is not supported in this browser.')
    }
  }, [])

  const toggleListening = () => {
    if (!isSupported) return
    
    if (isListening) {
      recognition?.stop()
    } else {
      try {
        recognition?.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        toast.error('Failed to start voice recognition. Please try again.')
      }
    }
  }

  const handleManualInput = (e: React.FormEvent) => {
    e.preventDefault()
    if (transcript.trim()) {
      onTranscript(transcript.trim())
      setTranscript('')
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-6">
        <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Voice Recognition Not Supported</h3>
        <p className="text-gray-500 text-sm">
          Your browser doesn't support speech recognition. You can still type your items manually.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <Mic className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Voice Commands
        </h2>
        <p className="text-gray-600 text-lg">
          Click the microphone and speak naturally. Try saying "Add milk" or "I need 5 apples"
        </p>
      </div>

      {/* Voice Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold text-lg
            transition-all duration-300 ease-in-out shadow-2xl
            ${isListening 
              ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-xl shadow-red-300' 
              : 'bg-gradient-to-br from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-xl shadow-primary-300'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isListening ? (
            <Volume2 className="w-8 h-8 animate-pulse" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
          
          {/* Animated rings when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-200"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-100"
                animate={{ scale: [1, 1.9, 1], opacity: [1, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              />
            </>
          )}
        </motion.button>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isListening ? 'text-red-600' : 'text-gray-500'
        }`}>
          {isListening ? 'Listening... Speak now!' : 'Click microphone to start'}
        </p>
      </div>

      {/* Manual Input Fallback */}
      <div className="border-t pt-4">
        <form onSubmit={handleManualInput} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Or type manually:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g., Add milk, 5 apples, etc."
              className="input-field flex-1"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!transcript.trim() || isProcessing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Example Commands */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Example Commands</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Add milk to my list",
            "I need 5 apples", 
            "Buy organic bread",
            "Remove milk from list",
            "Find toothpaste under $5",
            "Add local honey"
          ].map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-3 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300"
            >
              <p className="text-sm font-medium text-gray-700 text-center">"{command}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceRecognition
