import os
import re
from pathlib import Path
from openai import OpenAI
import time
from typing import List, Optional

class AudiobookCreator:
    def __init__(self, api_key: str, voice: str = "alloy", model: str = "tts-1-hd"):
        """
        Initialize the Audiobook Creator
        
        Args:
            api_key: Your OpenAI API key
            voice: Voice to use (alloy, echo, fable, onyx, nova, shimmer)
            model: TTS model (tts-1 for standard, tts-1-hd for higher quality)
        """
        self.client = OpenAI(api_key=api_key)
        self.voice = voice
        self.model = model
        self.max_chars = 4096  # OpenAI's character limit per request
    
    def split_text_into_chunks(self, text: str) -> List[str]:
        """
        Split text into chunks that respect sentence boundaries and stay under the character limit
        """
        # Clean up the text
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Split by paragraphs first
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            # If paragraph is too long, split by sentences
            if len(paragraph) > self.max_chars:
                sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                
                for sentence in sentences:
                    if len(current_chunk + sentence) < self.max_chars:
                        current_chunk += sentence + " "
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = sentence + " "
            else:
                # Check if we can add this paragraph to current chunk
                if len(current_chunk + paragraph) < self.max_chars:
                    current_chunk += paragraph + "\n\n"
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = paragraph + "\n\n"
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def text_to_speech(self, text: str, output_path: str) -> bool:
        """
        Convert text to speech and save as MP3
        """
        try:
            response = self.client.audio.speech.create(
                model=self.model,
                voice=self.voice,
                input=text
            )
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            return True
        except Exception as e:
            print(f"Error generating audio: {e}")
            return False
    
    def create_audiobook_from_file(self, 
                                  input_file: str, 
                                  output_dir: str = "audiobook_output",
                                  book_title: str = "My Audiobook") -> bool:
        """
        Create an audiobook from a text file
        """
        # Read the input file
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            print(f"Error reading file: {e}")
            return False
        
        return self.create_audiobook_from_text(text, output_dir, book_title)
    
    def create_audiobook_from_text(self, 
                                  text: str, 
                                  output_dir: str = "audiobook_output",
                                  book_title: str = "My Audiobook") -> bool:
        """
        Create an audiobook from text string
        """
        # Create output directory
        Path(output_dir).mkdir(exist_ok=True)
        
        # Split text into manageable chunks
        print("Splitting text into chunks...")
        chunks = self.split_text_into_chunks(text)
        print(f"Created {len(chunks)} audio chunks")
        
        # Generate audio for each chunk
        audio_files = []
        for i, chunk in enumerate(chunks, 1):
            print(f"Generating audio for chunk {i}/{len(chunks)}...")
            
            output_path = os.path.join(output_dir, f"chapter_{i:03d}.mp3")
            
            if self.text_to_speech(chunk, output_path):
                audio_files.append(output_path)
                print(f"✓ Generated: {output_path}")
            else:
                print(f"✗ Failed to generate: {output_path}")
                return False
            
            # Add a small delay to respect rate limits
            time.sleep(0.5)
        
        print(f"\n🎉 Audiobook creation complete!")
        print(f"📁 Output directory: {output_dir}")
        print(f"🎵 Generated {len(audio_files)} audio files")
        
        # Create a playlist file
        self.create_playlist(audio_files, output_dir, book_title)
        
        return True
    
    def create_playlist(self, audio_files: List[str], output_dir: str, book_title: str):
        """
        Create an M3U playlist file for the audiobook
        """
        playlist_path = os.path.join(output_dir, f"{book_title}.m3u")
        
        with open(playlist_path, 'w', encoding='utf-8') as f:
            f.write("#EXTM3U\n")
            f.write(f"#PLAYLIST:{book_title}\n\n")
            
            for i, audio_file in enumerate(audio_files, 1):
                filename = os.path.basename(audio_file)
                f.write(f"#EXTINF:-1,Chapter {i}\n")
                f.write(f"{filename}\n")
        
        print(f"📝 Playlist created: {playlist_path}")

 
def main():
    """
    Example usage of the AudiobookCreator
    """
    # Set your OpenAI API key
    api_key = " "
    if not api_key:
        print("Please set your OPENAI_API_KEY environment variable")
        return
    
    # Initialize the audiobook creator
    creator = AudiobookCreator(
        api_key=api_key,
        voice="nova",  # Choose from: alloy, echo, fable, onyx, nova, shimmer
        model="tts-1-hd"  # Use tts-1-hd for better quality
    )
    
    # Example 1: Create audiobook from a text file
    # creator.create_audiobook_from_file("my_book.txt", "my_audiobook", "My Amazing Book")
    
    # Example 2: Create audiobook from text string
    sample_text = """
    Chapter 1: The Beginning
    
    Once upon a time, in a land far away, there lived a curious programmer who wanted to create audiobooks using artificial intelligence. This programmer discovered that with the power of OpenAI's text-to-speech technology, they could transform any written work into a professional-sounding audiobook.
    
    The journey began with understanding the tools available. OpenAI provided several high-quality voices, each with its own character and tone. The programmer learned that breaking text into manageable chunks was essential for creating seamless audio experiences.
    
    Chapter 2: The Implementation
    
    As the programmer dove deeper into the project, they realized the importance of handling text preprocessing carefully. Long paragraphs needed to be split at natural breaking points, respecting sentence boundaries to ensure the audio flowed naturally.
    
    The programmer also discovered that different voices suited different types of content. Some voices were better for narrative fiction, while others excelled at technical documentation or educational material.
    """
    
    creator.create_audiobook_from_text(
        text=sample_text,
        output_dir="sample_audiobook",
        book_title="AI Audiobook Adventure"
    )

def estimate_cost(text: str, model: str = "tts-1-hd") -> float:
    """
    Estimate the cost of generating an audiobook
    
    OpenAI TTS pricing (as of 2024):
    - tts-1: $0.015 per 1K characters
    - tts-1-hd: $0.030 per 1K characters
    """
    char_count = len(text)
    
    if model == "tts-1":
        cost = (char_count / 1000) * 0.015
    else:  # tts-1-hd
        cost = (char_count / 1000) * 0.030
    
    return cost

def prepare_text_file(input_file: str, output_file: str):
    """
    Clean and prepare a text file for audiobook conversion
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Basic text cleaning
    text = re.sub(r'\n{3,}', '\n\n', text)  # Remove excessive line breaks
    text = re.sub(r'[ \t]+', ' ', text)     # Normalize whitespace
    text = text.strip()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"Cleaned text saved to: {output_file}")
    print(f"Character count: {len(text):,}")
    print(f"Estimated cost (TTS-1-HD): ${estimate_cost(text):.2f}")

if __name__ == "__main__":
    main()