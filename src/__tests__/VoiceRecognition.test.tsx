import { render, screen, fireEvent } from '@testing-library/react'
import VoiceRecognition from '../components/VoiceRecognition'

// Mock the voice recognition functionality
const mockSetIsListening = jest.fn()
const mockOnTranscript = jest.fn()

describe('VoiceRecognition Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders microphone button', () => {
    render(
      <VoiceRecognition
        isListening={false}
        setIsListening={mockSetIsListening}
        onTranscript={mockOnTranscript}
        isProcessing={false}
      />
    )
    
    const micButton = screen.getByRole('button', { name: /microphone/i })
    expect(micButton).toBeInTheDocument()
  })

  test('shows listening state when active', () => {
    render(
      <VoiceRecognition
        isListening={true}
        setIsListening={mockSetIsListening}
        onTranscript={mockOnTranscript}
        isProcessing={false}
      />
    )
    
    const listeningText = screen.getByText(/Listening/i)
    expect(listeningText).toBeInTheDocument()
  })

  test('shows processing state when processing', () => {
    render(
      <VoiceRecognition
        isListening={false}
        setIsListening={mockSetIsListening}
        onTranscript={mockOnTranscript}
        isProcessing={true}
      />
    )
    
    const processingText = screen.getByText(/Processing/i)
    expect(processingText).toBeInTheDocument()
  })

  test('calls setIsListening when microphone is clicked', () => {
    render(
      <VoiceRecognition
        isListening={false}
        setIsListening={mockSetIsListening}
        onTranscript={mockOnTranscript}
        isProcessing={false}
      />
    )
    
    const micButton = screen.getByRole('button', { name: /microphone/i })
    fireEvent.click(micButton)
    
    expect(mockSetIsListening).toHaveBeenCalledWith(true)
  })
})
