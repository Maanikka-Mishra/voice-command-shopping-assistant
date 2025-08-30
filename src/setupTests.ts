import '@testing-library/jest-dom'

// Mock Web Speech API
Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: {
    start: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
})

Object.defineProperty(window, 'SpeechRecognition', {
  value: {
    start: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
})

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
