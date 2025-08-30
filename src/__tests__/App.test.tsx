import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  test('renders welcome message', () => {
    render(<App />)
    const welcomeElement = screen.getByText(/Welcome to Your Smart Shopping Experience/i)
    expect(welcomeElement).toBeInTheDocument()
  })

  test('renders voice shopping assistant', () => {
    render(<App />)
    const assistantElement = screen.getByText(/Use voice commands to add items/i)
    expect(assistantElement).toBeInTheDocument()
  })

  test('renders language selector', () => {
    render(<App />)
    // The language selector should be present in the header
    expect(document.querySelector('[data-testid="language-selector"]')).toBeInTheDocument()
  })
})
