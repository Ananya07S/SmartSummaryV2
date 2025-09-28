
import os
import sys
import json
from pymongo import MongoClient
import azure.cognitiveservices.speech as speechsdk
from pydub import AudioSegment
from multiprocessing import Pool, cpu_count
import tempfile
from time import sleep

# Load Azure credentials from environment variables
AZURE_SPEECH_KEY = "Your-Key-Here"
AZURE_SERVICE_REGION = "Your-Region"

# Chunk size in milliseconds (2 minutes)
CHUNK_SIZE = 120000

def connect_to_mongodb():
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['SmartSummary']
        collection = db['transcriptions']
        return collection
    except Exception as e:
        print(json.dumps({
            "error": f"MongoDB connection failed: {str(e)}"
        }), file=sys.stderr)
        return None

def split_audio(audio_path):
    """Split audio file into chunks."""
    try:
        audio = AudioSegment.from_file(audio_path)
        chunks = []
        
        # Create temporary directory for chunks
        temp_dir = tempfile.mkdtemp()
        
        # Split audio into 2-minute chunks
        for i in range(0, len(audio), CHUNK_SIZE):
            chunk = audio[i:i + CHUNK_SIZE]
            chunk_path = os.path.join(temp_dir, f'chunk_{i}.wav')
            chunk.export(chunk_path, format='wav')
            chunks.append(chunk_path)
            
        return chunks, temp_dir
    except Exception as e:
        print(json.dumps({
            "error": f"Audio splitting error: {str(e)}"
        }), file=sys.stderr)
        return None, None

def transcribe_chunk(chunk_path):
    """Transcribe a single audio chunk."""
    try:
        speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SERVICE_REGION)
        audio_config = speechsdk.AudioConfig(filename=chunk_path)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

        all_results = []
        done = False

        def handle_result(evt):
            if evt.result.text:
                all_results.append(evt.result.text)

        def stop_cb(evt):
            nonlocal done
            done = True

        speech_recognizer.recognized.connect(handle_result)
        speech_recognizer.session_stopped.connect(stop_cb)
        speech_recognizer.canceled.connect(stop_cb)

        speech_recognizer.start_continuous_recognition()
        
        while not done:
            sleep(0.1)  # Reduced sleep time for faster processing
            
        speech_recognizer.stop_continuous_recognition()
        
        return ' '.join(all_results)

    except Exception as e:
        print(json.dumps({
            "error": f"Chunk transcription error: {str(e)}"
        }), file=sys.stderr)
        return ""

def cleanup_chunks(chunk_paths, temp_dir):
    """Clean up temporary files."""
    for path in chunk_paths:
        try:
            os.remove(path)
        except:
            pass
    try:
        os.rmdir(temp_dir)
    except:
        pass

def transcribe_with_azure(audio_path):
    """Transcribes an audio file using parallel processing."""
    try:
        # Split audio into chunks
        chunk_paths, temp_dir = split_audio(audio_path)
        if not chunk_paths:
            return None

        # Process chunks in parallel
        with Pool(processes=min(cpu_count(), len(chunk_paths))) as pool:
            results = pool.map(transcribe_chunk, chunk_paths)

        # Clean up temporary files
        cleanup_chunks(chunk_paths, temp_dir)

        # Combine all results
        return ' '.join(filter(None, results))

    except Exception as e:
        print(json.dumps({
            "error": f"Transcription error: {str(e)}"
        }), file=sys.stderr)
        return None

def transcribe_and_save(audio_path, save_to_db=False):
    """Transcribes an audio file and optionally saves to MongoDB."""
    if not os.path.exists(audio_path):
        print(json.dumps({
            "error": f"Audio file not found: {audio_path}"
        }), file=sys.stderr)
        return None

    transcription = transcribe_with_azure(audio_path)

    if transcription:
        # Create response data
        response_data = {
            'filename': os.path.basename(audio_path),
            'transcription': transcription
        }

        # Optionally save to MongoDB
        if save_to_db:
            collection = connect_to_mongodb()
            if collection:
                try:
                    collection.insert_one(response_data)
                except Exception as e:
                    print(json.dumps({
                        "error": f"MongoDB save failed: {str(e)}"
                    }), file=sys.stderr)

        # Print the transcription to stdout for Node.js to capture
        print(transcription)
        return transcription

    return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Please provide an audio file path as argument"
        }), file=sys.stderr)
        sys.exit(1)

    audio_path = sys.argv[1]
    transcribe_and_save(audio_path, save_to_db=False)
