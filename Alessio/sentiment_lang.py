# -*- coding: utf-8 -*-
"""
Created on Sun Mar 29 12:46:33 2020

@author: alessio.caponi
"""
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
import json
from sklearn.preprocessing import  MinMaxScaler
import numpy as np
import os
nltk.download('vader_lexicon')
nltk.download('twitter_samples')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('stopwords')
sia = SentimentIntensityAnalyzer()
stop_words = stopwords.words('english')

path = r"C:\Users\alessio.caponi\Desktop\COvid-Project\CodeVsCovid-Hackathon-master\CodeVsCovid-Hackathon\data"


files =  [path+"\\" + name for name in  os.listdir(path)]

name_file = files[0].split("\\")[-1]
    

def read_data(path):
    with open(path) as json_file:
        data = json.load(json_file)
        
    name_file = path.split("\\")[-1]+"_complete.json"
    if data:    
        return data,name_file
    else:
        name_file = path.split("\\")[-1]+"_FAIL.json"
        return "nope" , name_file
    
def add_sentiment(json_obj):
    scaler = MinMaxScaler()
    score_list = []
    ret_dict = []
    final_dict = []
    for dict_ in json_obj:
        score = sia.polarity_scores(dict_["translated_title"])['compound']
        score_list.append(score)
        dict_["sentiment_basic"] = score
        ret_dict.append(dict_)
        
    scaled_val = scaler.fit_transform(np.array(score_list).reshape(-1,1))
    for dict_,el in zip(ret_dict , scaled_val):
        dict_["sentiment_scaled"] = float(el)
        final_dict.append(dict_)
        
    return final_dict


def save_data( json_to_save, name_file):
    path = r"C:\Users\alessio.caponi\Desktop\COvid-Project\CodeVsCovid-Hackathon-master\CodeVsCovid-Hackathon\data"

    with open(path+"\\" + name_file, 'w') as json_file:
        json.dump(json_to_save, json_file)



for file in files:
    data,name  = read_data(path = file)
    print(data)
    try:
        dict_to_save = add_sentiment(json_obj = data)
        save_data(dict_to_save, name_file = name)
    except:
        print(name)

       
        # =============================================================================
# 
# file_path = r"C:\Users\alessio.caponi\Desktop\COvid-Project\CodeVsCovid-Hackathon-master\CodeVsCovid-Hackathon\data\personal.json"
# 
# with open(file_path) as json_file:
#     data = json.load(json_file)
# 
# file_path_da_buttare = r"C:\Users\alessio.caponi\Desktop\COvid-Project\CodeVsCovid-Hackathon-master\CodeVsCovid-Hackathon\Alessio\news_de"
# 
# 
# with open(file_path_da_buttare) as json_file:
#     data_brutto = json.load(json_file)
# 
# =============================================================================
# =============================================================================
# cp = os.path.abspath(__file__)
# os.chdir(os.path.dirname(os.path.realpath('__file__')))
# =============================================================================
