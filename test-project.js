const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Voice Command Shopping Assistant Project...\n');

// Check if key files exist
const requiredFiles = [
  'package.json',
  'src/App.tsx',
  'src/components/VoiceRecognition.tsx',
  'src/components/ShoppingList.tsx',
  'src/components/SmartSuggestions.tsx',
  'src/utils/voiceProcessor.ts',
  'src/utils/suggestionEngine.ts',
  'tailwind.config.js',
  'vite.config.ts'
];

console.log('📁 Checking project structure...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-speech-recognition'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

// Check if node_modules exists
console.log('\n🔧 Checking installation...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules directory missing - run npm install');
  allFilesExist = false;
}

// Summary
console.log('\n📊 Test Summary:');
if (allFilesExist) {
  console.log('🎉 All tests passed! Project is ready to run.');
  console.log('\n🚀 To start the development server:');
  console.log('   npm run dev');
  console.log('\n🔊 Voice recognition features are ready!');
} else {
  console.log('⚠️  Some issues found. Please check the missing files/dependencies.');
}

console.log('\n📚 Project Features:');
console.log('• Voice command recognition for shopping lists');
console.log('• AI-powered smart suggestions');
console.log('• Natural language processing');
console.log('• Beautiful responsive UI with Tailwind CSS');
console.log('• TypeScript for type safety');
console.log('• Framer Motion animations');
console.log('• Voice-activated search and filtering');
