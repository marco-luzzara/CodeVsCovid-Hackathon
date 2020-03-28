import pandas as pd
import matplotlib.pyplot as plt
import re, string

import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk import FreqDist

nltk.download('vader_lexicon')
nltk.download('twitter_samples')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('stopwords')

stop_words = stopwords.words('english')

from sklearn.model_selection import train_test_split

# =============================================================================
# Funzioni pre processing
# =============================================================================

def lemmatize_sentence(tokens):
    lemmatizer = WordNetLemmatizer()
    lemmatized_sentence = []
    for word, tag in pos_tag(tokens):
        if tag.startswith('NN'):
            pos = 'n'
        elif tag.startswith('VB'):
            pos = 'v'
        else:
            pos = 'a'
        lemmatized_sentence.append(lemmatizer.lemmatize(word, pos))
    return lemmatized_sentence

def remove_noise(tweet_tokens, stop_words = ()):
    cleaned_tokens = []

    for token, tag in pos_tag(tweet_tokens):
        token = re.sub('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|'\
                       '(?:%[0-9a-fA-F][0-9a-fA-F]))+','', token)
        token = re.sub("(@[A-Za-z0-9_]+)","", token)

        if tag.startswith("NN"):
            pos = 'n'
        elif tag.startswith('VB'):
            pos = 'v'
        else:
            pos = 'a'

        lemmatizer = WordNetLemmatizer()
        token = lemmatizer.lemmatize(token, pos)

        if len(token) > 0 and token not in string.punctuation and token.lower() not in stop_words:
            cleaned_tokens.append(token.lower())
    return cleaned_tokens

def get_all_words(cleaned_tokens_list):
    for tokens in cleaned_tokens_list:
        for token in tokens:
            yield token

# =============================================================================
# Main
# =============================================================================

data = pd.read_csv('C:/Users/ACERVEL/Desktop/news.csv')
i = data.head(5)

sia = SentimentIntensityAnalyzer()
#print("Sentiment Score: ", sia.polarity_scores(i.iloc[4]["TITLE"])['compound'])

#print(i.iloc[4]["TITLE"])
token = word_tokenize(i.iloc[4]["TITLE"])
#print(token)

#tag = pos_tag(token)
#print(tag)

#print("Titolo tokenizzato", token)
#print("Titolo lemmatizzato",lemmatize_sentence(token))

#print("Titolo senza rumore", remove_noise(token, stop_words))


