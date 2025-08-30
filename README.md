# Voice Command Shopping Assistant

A modern, voice-powered shopping list manager with AI-powered smart suggestions and natural language processing capabilities.

## 🎯 Features

### 🎤 Voice Input
- **Voice Command Recognition**: Add items using natural speech (e.g., "Add milk", "I need 5 apples")
- **Natural Language Processing**: Understands varied user phrases for flexibility
- **Multilingual Support**: Ready for multiple language implementations
- **Real-time Feedback**: Visual and audio feedback during voice recognition

### 🧠 Smart Suggestions
- **AI Recommendations**: Based on shopping history and preferences
- **Seasonal Suggestions**: Items currently in season
- **Frequently Bought Together**: Smart pairing recommendations
- **Substitute Suggestions**: Alternative products when items are unavailable
- **Trending Items**: Popular and trending products

### 📝 Shopping List Management
- **Add/Remove Items**: Voice commands for list management
- **Auto-categorization**: Items automatically sorted into categories
- **Quantity Management**: Specify quantities using voice ("5 apples", "2 liters of milk")
- **Edit & Update**: Modify items with inline editing
- **Category Filtering**: Organize items by food categories

### 🔍 Voice-Activated Search
- **Item Search**: Find specific items by voice
- **Price Filtering**: Voice-based price range specification
- **Brand Preferences**: Specify brand preferences through voice

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Modern browser with speech recognition support
- Microphone access
- **Gemini API Key** (for multilingual support and AI features)

### 🔑 Gemini API Key Status

✅ **API Key Configured**: Your Gemini API key is already configured in the project
🔒 **Secure**: API key is stored in `config.js` and ready for use
🌍 **Multilingual Ready**: All 10 languages are now supported

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-command-shopping-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **API Key Ready** ✅
   Your Gemini API key is already configured in the project

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production
```bash
npm run build
npm run preview
```

## 🎨 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Voice Recognition**: Web Speech API
- **AI & Multilingual**: Google Gemini API
- **Build Tool**: Vite
- **State Management**: React Hooks
- **UI Components**: Custom components with Lucide React icons

## 📱 Usage Examples

### Voice Commands
- **Add Items**: "Add milk to my list", "I need 5 apples", "Buy organic bread"
- **Remove Items**: "Remove milk from my list", "Delete bread"
- **Quantities**: "Add 2 bottles of water", "Get 1 kg of chicken"
- **Categories**: "Add dairy products", "Buy produce items"
- **Search**: "Find toothpaste under $5", "Look for organic apples"

### 🌍 Multilingual Support
The app now supports **10 languages** including:
- **English**: "Add milk to my list"
- **Spanish**: "Añadir leche a mi lista"
- **French**: "Ajouter du lait à ma liste"
- **German**: "Milch zu meiner Liste hinzufügen"
- **Italian, Portuguese, Japanese, Korean, Chinese, Hindi**

**Language Detection**: Automatically detects your spoken language
**Real-time Translation**: Translates commands to English for processing
**Localized UI**: Interface text in your preferred language

### Manual Input
- Type items directly in the input field
- Use quick action buttons for common items
- Edit existing items inline

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── VoiceRecognition.tsx    # Voice input handling
│   ├── ShoppingList.tsx        # Shopping list display
│   ├── SmartSuggestions.tsx    # AI suggestions
│   └── Header.tsx              # App header
├── utils/              # Utility functions
│   ├── voiceProcessor.ts       # Voice command processing
│   └── suggestionEngine.ts     # AI suggestion logic
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Voice Recognition Settings
The app automatically detects browser support for speech recognition. For best results:
- Use Chrome, Edge, or Safari
- Allow microphone access when prompted
- Speak clearly in a quiet environment

### Customization
- Modify `tailwind.config.js` for styling changes
- Update `src/utils/suggestionEngine.ts` for custom suggestions
- Adjust voice patterns in `src/utils/voiceProcessor.ts`

## 🌟 Key Features in Detail

### Natural Language Processing
The app understands various ways to express shopping intentions:
- "Add milk" → Adds 1 milk to dairy category
- "I need 5 apples" → Adds 5 apples to produce category
- "Buy organic bread under $3" → Adds bread with price constraint

### Smart Categorization
Items are automatically categorized based on:
- Item name analysis
- Common shopping patterns
- User preferences over time

### AI-Powered Suggestions
The suggestion engine provides:
- **Seasonal recommendations** based on current date
- **Trending items** from popular shopping data
- **Frequently bought together** based on shopping patterns
- **Substitute suggestions** for dietary preferences

## 🚧 Browser Compatibility

| Browser | Speech Recognition | Status |
|---------|-------------------|---------|
| Chrome | ✅ Full Support | Recommended |
| Edge | ✅ Full Support | Recommended |
| Safari | ✅ Full Support | Good |
| Firefox | ❌ No Support | Use manual input |

## 🔮 Future Enhancements

- [ ] Multi-language voice support
- [ ] Integration with grocery store APIs
- [ ] Price comparison features
- [ ] Meal planning integration
- [ ] Shopping list sharing
- [ ] Mobile app development
- [ ] Offline support with PWA
- [ ] Advanced AI suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- Tailwind CSS for the beautiful design system
- Framer Motion for smooth animations
- Lucide React for the icon library

## 📞 Support

If you encounter any issues or have questions:
- Check the browser compatibility section
- Ensure microphone permissions are granted
- Try refreshing the page if voice recognition fails
- Use manual input as a fallback

---

**Happy Shopping with Voice Commands! 🛒🎤**
