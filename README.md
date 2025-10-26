# Telos Chat - AI Conversational Interface

A modern, minimalist chat interface built with React and Tailwind CSS, inspired by Le Chat by Mistral AI.

## Features

- 🎨 **Modern UI Design** - Clean, minimal aesthetic with smooth interactions
- 🔍 **Research Mode** - Enable web search capabilities
- 🧠 **Think Mode** - Extended reasoning and analysis
- 🎤 **Voice Input** - Microphone button for voice interactions
- 📊 **Advanced File Upload** - Drag-drop CSV/JSON files with intelligent data analysis
  - Visual drag-drop zone with hover effects
  - File preview with data type detection (int, float, string, date)
  - Data quality indicators (missing values, outliers)
  - Table preview showing first 5 rows with column headers
  - Support for multiple files with queue management
- 💬 **Real-time Chat** - Seamless messaging experience
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Light Theme** - Easy on the eyes

## Tech Stack

- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript ES6+** - Modern JavaScript

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/telos-chat.git
cd telos-chat
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The app will open at http://localhost:3000

### Build for Production
```bash
npm run build
```

## Project Structure

```
telos-chat/
├── src/
│   ├── components/
│   │   ├── TelosChat.jsx
│   │   └── FileUploadZone.jsx
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Usage

### Starting a New Chat
Click the "New Chat" button in the sidebar to start a fresh conversation.

### Using Tools
- **Research Mode** - Enable to search for current information
- **Think Mode** - Enable for extended reasoning
- **File Upload** - Click the upload button to access the drag-drop zone
  - Drag CSV or JSON files directly into the zone
  - Preview data structure and quality before analysis
  - Automatic data type detection and quality assessment
  - Support for multiple files with expandable previews

### Sending Messages
- Type your message
- Click the Send Arrow or press Enter
- Use the Mic button for voice input

## Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## License

MIT License

## Support

For support, open an issue on GitHub.

---

**Telos Chat** - Built with ❤️ using React & Tailwind CSS