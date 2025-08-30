import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, Loader2, Sparkles } from 'lucide-react'

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

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
  const [error, setError] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        onTranscript(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
      setError('Speech recognition not supported in this browser')
    }
  }, [onTranscript, setIsListening])

  const toggleListening = () => {
    if (!isSupported) return

    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setError('')
      setTranscript('')
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
        <MicOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Voice Recognition Not Supported</h3>
        <p className="text-gray-400 text-sm">
          Please use Chrome, Edge, or Safari for voice recognition features.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Voice Commands</span>
        </h3>
        <p className="text-gray-400 text-sm">
          Click the microphone and speak naturally
        </p>
      </div>

      {/* Microphone Button */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/25'
              : isProcessing
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25'
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
          }`}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Volume2 className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Mic className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated rings when listening */}
          {isListening && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-2 border-red-400 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute inset-0 border-2 border-pink-400 rounded-full"
              />
            </>
          )}
        </motion.button>
      </div>

      {/* Status Display */}
      <div className="text-center mb-4">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center space-x-2 text-purple-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Processing your command...</span>
            </motion.div>
          ) : isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center space-x-2 text-red-400"
            >
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening... Speak now!</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-400 text-sm"
            >
              Click microphone to start
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/50 rounded-xl p-4 mb-4"
        >
          <div className="text-xs text-gray-400 mb-2">You said:</div>
          <div className="text-white font-medium">{transcript}</div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-4"
        >
          <div className="text-red-400 text-sm font-medium mb-1">Error</div>
          <div className="text-red-300 text-sm">{error}</div>
        </motion.div>
      )}

      {/* Voice Command Examples */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-3">Try saying:</div>
        <div className="space-y-2">
          {[
            "Add milk to my list",
            "I need 5 organic apples",
            "Remove bread from list",
            "Find organic honey"
          ].map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-gray-300 text-sm bg-gray-600/30 rounded-lg px-3 py-2"
            >
              "{example}"
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceRecognition
