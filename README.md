# VocalizePro - AI-Powered Audiobook Converter

Transform your text into professional-quality audiobooks using OpenAI's advanced text-to-speech technology.

## 🎧 What is VocalizePro?

VocalizePro is a complete audiobook creation toolkit that combines a powerful Python backend with a modern React.js frontend. It enables authors, educators, content creators, and anyone with text content to generate high-quality audiobooks with natural-sounding AI voices.

## ✨ Features

### Frontend (React.js UI)
- **Modern, responsive interface** with glassmorphism design
- **Drag & drop file upload** for .txt files
- **Real-time text editing** with live character count
- **Voice selection** from 6 different AI voices
- **Quality settings** (Standard vs HD)
- **Cost estimation** before conversion
- **Progress tracking** during conversion
- **Audio playback** controls for preview
- **Batch download** of generated audio files

### Backend (Python)
- **Intelligent text chunking** that respects sentence boundaries
- **Multiple voice options**: alloy, echo, fable, onyx, nova, shimmer
- **Quality control** with tts-1 and tts-1-hd models
- **Automatic playlist generation** (M3U format)
- **Rate limiting** to respect API guidelines
- **Error handling** and retry logic
- **Cost estimation** tools

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for React frontend)
- Python 3.8+ (for backend)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vocalizepro.git
   cd vocalizepro
   ```

2. **Set up the Python backend**
   ```bash
   cd backend
   pip install openai pathlib
   ```

3. **Set up the React frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Configure your API key**
   - Get your OpenAI API key from https://platform.openai.com/api-keys
   - Enter it in the UI settings panel or set it as an environment variable

### Basic Usage

1. **Upload or paste your text** into the interface
2. **Select your preferred voice** and quality settings
3. **Review the cost estimate** and processing time
4. **Click "Convert to Audio"** to start generation
5. **Download individual chapters** or the complete audiobook

## 🎵 Voice Options

| Voice | Character | Best For |
|-------|-----------|----------|
| **Alloy** | Neutral, balanced | General content, tutorials |
| **Echo** | Male, clear | Non-fiction, educational |
| **Fable** | British Male, sophisticated | Classic literature, formal content |
| **Onyx** | Deep Male, authoritative | Business, technical content |
| **Nova** | Female, warm | Fiction, storytelling |
| **Shimmer** | Soft Female, gentle | Children's books, meditation |

## 💰 Pricing

OpenAI TTS pricing (as of 2025):
- **Standard (tts-1)**: $0.015 per 1,000 characters
- **HD (tts-1-hd)**: $0.030 per 1,000 characters

*Example: A 50,000-character book costs approximately $1.50 with HD quality*

## 📁 Project Structure

```
vocalizepro/
├── backend/
│   ├── audiobook_creator.py      # Main Python class
│   ├── requirements.txt          # Python dependencies
│   └── examples/                 # Usage examples
├── frontend/
│   ├── src/
│   │   ├── VocalizePro.jsx      # Main React component
│   │   └── index.js             # Entry point
│   ├── public/
│   └── package.json             # Node dependencies
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## 🛠️ Technical Details

### Text Processing
- **Smart chunking**: Automatically splits text at natural breakpoints
- **Character limits**: Respects OpenAI's 4,096 character limit per request
- **Paragraph preservation**: Maintains document structure
- **Sentence boundary detection**: Ensures natural audio flow

### Audio Generation
- **Batch processing**: Handles large texts efficiently
- **Error recovery**: Retries failed chunks automatically
- **Rate limiting**: Prevents API quota issues
- **Quality control**: Multiple quality options available

### Output Formats
- **MP3 files**: Individual chapters as separate files
- **M3U playlists**: For easy playback in media players
- **Organized structure**: Clear file naming and organization

## 🔧 Advanced Usage

### Python Backend Only
```python
from audiobook_creator import AudiobookCreator

# Initialize
creator = AudiobookCreator(
    api_key="your-api-key",
    voice="nova",
    model="tts-1-hd"
)

# Convert from file
creator.create_audiobook_from_file(
    input_file="my_book.txt",
    output_dir="my_audiobook",
    book_title="My Amazing Book"
)

# Convert from text
creator.create_audiobook_from_text(
    text="Your text here...",
    output_dir="output_folder",
    book_title="Custom Title"
)
```

### Cost Estimation
```python
from audiobook_creator import estimate_cost

with open("my_book.txt", "r") as f:
    text = f.read()

cost = estimate_cost(text, model="tts-1-hd")
print(f"Estimated cost: ${cost:.2f}")
```

## 🎯 Use Cases

- **Authors**: Convert manuscripts to audiobooks for wider distribution
- **Educators**: Create audio versions of learning materials
- **Bloggers**: Transform written content into podcast-style audio
- **Businesses**: Generate voice-overs for training materials
- **Accessibility**: Make written content available to visually impaired users
- **Language Learning**: Create pronunciation guides and listening exercises

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Batch processing** for multiple files
- [ ] **SSML support** for advanced speech control
- [ ] **Voice cloning** integration
- [ ] **Chapter detection** from text structure
- [ ] **Audio effects** and post-processing
- [ ] **Cloud storage** integration
- [ ] **Mobile app** versions
- [ ] **API endpoint** for third-party integration

## ⚠️ Important Notes

- **API Key Security**: Never commit API keys to version control
- **Rate Limits**: OpenAI has rate limits; the tool includes delays to respect them
- **File Size**: Large texts are automatically chunked for processing
- **Quality vs Cost**: HD model costs 2x more but provides better audio quality

## 🆘 Troubleshooting

### Common Issues

**"API key not working"**
- Verify your API key is correct and has sufficient credits
- Ensure you have access to the TTS API (some keys may have restrictions)

**"Audio generation fails"**
- Check your internet connection
- Verify the text doesn't contain unsupported characters
- Try with a smaller text sample first

**"Poor audio quality"**
- Switch to the `tts-1-hd` model for better quality
- Ensure your text is well-formatted with proper punctuation
- Try different voices to find the best match for your content

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the TTS API
- **React community** for the amazing ecosystem
- **Contributors** who help improve VocalizePro

## 📞 Support

- **Issues**: GitHub Issues page
- **Discussions**: GitHub Discussions
 


**Made with ❤️ for the creator community**

*VocalizePro - Because every story deserves to be heard*