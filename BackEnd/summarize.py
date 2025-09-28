

import sys
import io
import re
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.cluster.util import cosine_distance
from sklearn.feature_extraction.text import TfidfVectorizer
import networkx as nx

# Set stdout to use UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Download necessary NLTK data if not already present
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('tokenizers/punkt_tab/english/')
except LookupError:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt_tab', quiet=True)

class ExtractiveSummarizer:
    def __init__(self, method='textrank', num_sentences=7, language='english', format='bullets'):
        """
        Initialize the extractive summarizer.
        
        Args:
            method (str): 'textrank' or 'tfidf' summarization method
            num_sentences (int): Number of sentences to include in summary
            language (str): Language for stopwords
            format (str): 'text' for plain text, 'bullets' for bullet points
        """
        self.method = method
        self.num_sentences = num_sentences
        self.language = language
        self.format = format
        self.stop_words = set(stopwords.words(language))
    
    def clean_text(self, text):
        """Clean and normalize text"""
        # Replace newlines with spaces
        text = re.sub(r'\n+', ' ', text)
        
        # Replace multiple spaces with a single space
        text = re.sub(r'\s+', ' ', text)
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove timestamps (common in meeting transcripts) like [00:15:22]
        text = re.sub(r'\[\d{2}:\d{2}:\d{2}\]|\[\d{2}:\d{2}\]', '', text)
        
        # Remove speaker identifiers (common in transcripts) like "John:" or "[Speaker 1]:"
        text = re.sub(r'\[?[A-Za-z\s]+\]?:', '', text)
        
        return text.strip()
    
    def preprocess_text(self, text):
        """Preprocess text for summarization"""
        # Clean text
        cleaned_text = self.clean_text(text)
        
        # Tokenize into sentences
        sentences = sent_tokenize(cleaned_text)
        
        # Filter very short sentences (likely fragments)
        sentences = [s for s in sentences if len(s.split()) > 3]
        
        # Clean sentences and maintain original forms
        clean_sentences = []
        original_sentences = []
        
        for sentence in sentences:
            original_sentences.append(sentence)
            
            # Tokenize words
            words = word_tokenize(sentence.lower())
            
            # Remove stopwords and non-alphabetic tokens
            words = [word for word in words if word.isalpha() and word not in self.stop_words]
            
            clean_sentences.append(words)
            
        return original_sentences, clean_sentences
    
    def build_similarity_matrix(self, sentences):
        """Build similarity matrix for sentences"""
        # Create an empty similarity matrix
        similarity_matrix = np.zeros((len(sentences), len(sentences)))
        
        for i in range(len(sentences)):
            for j in range(len(sentences)):
                if i != j:
                    similarity_matrix[i][j] = self._sentence_similarity(sentences[i], sentences[j])
                    
        return similarity_matrix
    
    def _sentence_similarity(self, sent1, sent2):
        """Calculate similarity between two sentences"""
        # If either sentence is empty, return 0
        if not sent1 or not sent2:
            return 0.0
            
        # Convert to sets for faster operations
        all_words = list(set(sent1 + sent2))
        
        vector1 = [0] * len(all_words)
        vector2 = [0] * len(all_words)
        
        # Build the vectors
        for word in sent1:
            vector1[all_words.index(word)] += 1
            
        for word in sent2:
            vector2[all_words.index(word)] += 1
            
        # Calculate cosine similarity
        return 1 - cosine_distance(vector1, vector2)
    
    def tfidf_summarize(self, text):
        """Summarize text using TF-IDF method"""
        # Extract sentences
        original_sentences, _ = self.preprocess_text(text)
        
        if len(original_sentences) <= self.num_sentences:
            summary_sentences = original_sentences
        else:
            # Create TF-IDF vectorizer
            vectorizer = TfidfVectorizer(stop_words=self.stop_words)
            tfidf_matrix = vectorizer.fit_transform(original_sentences)
            
            # Calculate sentence scores based on the sum of TF-IDF values
            sentence_scores = []
            for i in range(len(original_sentences)):
                score = np.sum(tfidf_matrix[i].toarray())
                sentence_scores.append((i, score))
            
            # Sort sentences by score in descending order and select top sentences
            sentence_scores.sort(key=lambda x: x[1], reverse=True)
            top_sentence_indices = [item[0] for item in sentence_scores[:self.num_sentences]]
            
            # Sort indices to preserve original order
            top_sentence_indices.sort()
            
            # Construct summary
            summary_sentences = [original_sentences[i] for i in top_sentence_indices]
        
        # Format the output according to the specified number of sentences
        return self._format_output(summary_sentences)
    
    def textrank_summarize(self, text):
        """Summarize text using TextRank algorithm"""
        # Extract sentences
        original_sentences, clean_sentences = self.preprocess_text(text)
        
        if len(original_sentences) <= self.num_sentences:
            summary_sentences = original_sentences
        else:
            # Build similarity matrix
            similarity_matrix = self.build_similarity_matrix(clean_sentences)
            
            # Create graph and apply PageRank
            nx_graph = nx.from_numpy_array(similarity_matrix)
            scores = nx.pagerank(nx_graph)
            
            # Sort sentences by score and select top sentences
            ranked_sentences = sorted(((scores[i], i) for i in range(len(original_sentences))), reverse=True)
            top_sentence_indices = [ranked_sentences[i][1] for i in range(min(self.num_sentences, len(ranked_sentences)))]
            
            # Sort indices to preserve original order
            top_sentence_indices.sort()
            
            # Construct summary
            summary_sentences = [original_sentences[i] for i in top_sentence_indices]
        
        # Format the output according to the specified number of sentences
        return self._format_output(summary_sentences)
    
    def _format_output(self, sentences):
        """Format the output according to the specified format"""
        # Add a title to the summary
        summary_header = " Here are your Meeting Notes:\n\n\n\n"
        
        if self.format == 'bullets':
            # Create bullet points with a header using a different bullet style
            return summary_header + "\n\n".join([f"➲ {sentence.strip()}" for sentence in sentences])
        else:
            # Default to plain text with a header
            return summary_header + " ".join(sentences)
    
    def summarize(self, text):
        """Summarize text using the selected method"""
        if self.method == 'tfidf':
            return self.tfidf_summarize(text)
        else:  # default to textrank
            return self.textrank_summarize(text)

def main():
    """Main function to handle script execution"""
    if len(sys.argv) < 2:
        print("Error: Please provide text to summarize.")
        sys.exit(1)
    
    # Get input text from command line argument
    text = sys.argv[1]
    
    # Optional parameters (can be added to your Node.js call if needed)
    method = 'textrank'  # Default method
    num_sentences = 7    # Default number of sentences
    output_format = 'bullets'  # Default format
    
    if len(sys.argv) > 2:
        method = sys.argv[2]
    if len(sys.argv) > 3:
        try:
            num_sentences = int(sys.argv[3])
        except ValueError:
            print("Warning: Invalid number of sentences. Using default (7).")
            num_sentences = 7
    if len(sys.argv) > 4:
        output_format = sys.argv[4]
    
    # Create summarizer and generate summary
    try:
        summarizer = ExtractiveSummarizer(
            method=method, 
            num_sentences=num_sentences, 
            format=output_format
        )
        summary = summarizer.summarize(text)
        print(summary)
    except LookupError as e:
        print(f"Resource error: {e}")
        print("Downloading additional NLTK resources...")
        nltk.download('punkt_tab', quiet=True)
        # Try again after downloading
        summarizer = ExtractiveSummarizer(
            method=method, 
            num_sentences=num_sentences, 
            format=output_format
        )
        summary = summarizer.summarize(text)
        print(summary)

if __name__ == "__main__":
    main()



