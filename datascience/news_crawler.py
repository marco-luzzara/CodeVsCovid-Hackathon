# -*- coding: utf-8 -*-
"""
Created on Sat Mar 28 10:25:59 2020

@author: alessio.caponi
"""

import time 
import requests
import json 
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from sklearn.preprocessing import  MinMaxScaler
import numpy as np
import schedule


nltk.download('vader_lexicon')
nltk.download('twitter_samples')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('stopwords')
stop_words = stopwords.words('english')

class News():
    def __init__(self):
       
        self.lang = ["ae" ,"ar" ,"at" ,"au" ,"be", "bg", "br", "ca", "ch", "cn", "co", "cu", "cz", "de", "eg", 
                     "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "lt", "se" ,"sg",
                     "lv", "ma", "mx", "my", "ng", "nl", "no", "nz", "ph" ,"pl" ,"pt", "ro","rs", "ru" ,"sa", 
                     "si", "sk", "th", "tr", "tw", "ua", "us" ,"ve" ,"za"] 
        
        self.mapping = {
        	"ae" : ["Emirati Arabi" , "ar"],
        	"ar" : ["Argentina" , "es"],
        	"at" : ["Austria" , "de"],
        	"au" : ["Australia" , "en"],
        	"be" : ["Belgium" , "fr"],
        	"bg" : ["Bulgaria" , "bg"],
        	"br" : ["Brazil" , "pt"],
        	"ca" : ["Canada" , "en"],
        	"ch" : ["Repubblica Ceca" , "cs"],
        	"cn" : ["China" , "zh" ],
        	"co" : ["Colombia", "es"],
        	"cu" : ["Cuba" , "es"],
        	"de" : ["Germania" , "de"],
        	"eg" : ["Egitto" , "ar"],
        	"fr" : ["Francia" , "fr"],
        	"gb" : ["Inghilterra" , "en"],
        	"gr" : ["Grecia" , "el"],
        	"hk" : ["Hong Kong" , "zh"],
        	"hu" : ["Ungheria" , "hu"],
        	"id" : ["Indonesia" , "id"],
        	"ie" : ["Irlanda" , "en"],
        	"il" : ["Israele" , "he"],
        	"in" : ["India" , "hi"],
        	"it" : ["Italia", "it"],
        	"jp" : ["Giappone" , "ja"],
        	"kr" : ["Korea del Sud" , "ko"],
        	"lt" : ["Lituania" , "lt"],
        	"se" : ["Svezia" , "sv"],
        	"sg" : ["Singapore" , "zh"],
        	"ma" : ["Marocco" , "ar"],
        	"mx" : ["Messico", "es"],
        	"my" : ["Malesia" , "ms"],
        	"ng" : ["Nigeria" , "en"],
        	"no" : ["Norvegia" , "nb"],
        	"nz" : ["Nuova Zelanda", "en"],
        	"pl" : ["Polonia" , "pl"],
        	"pt" : ["Portogallo" , "pt"],
        	"ro" : ["Romania" , "ro"],
        	"ru" : ["Russia" , "ru"],
        	"sa" : ["Arabia Saudita" , "ar"],
        	"si" : ["Slovenia" , "sl"],
        	"sk" : ["Slovacchia", "sk"],
        	"th" : ["Thailandia" , "th"],
        	"tr" : ["Turchia" , "ar"],
        	"tw" : ["Taiwan" , "zh"],
        	"us" : ["USA", "en"],
        	"ve" : ["Venezuela" , "es"],
        	"za" : ["South Africa", "en"]
        }


        self.key = '456c14b545d94522a582967ba4a3269b'
        self.category = ["health", "science", "business"]

        self.params_dict = { "country=": None,
                            "category" : None,
                            "q" : None
                }
        
        self.base_request = 'https://newsapi.org/v2/top-headlines?'
        
        self.authenticator = IAMAuthenticator("1u6QD9RBFn-LEAlOpLJdjiIqOjmWFWO6zI6KzxvTiAk2")
        self.language_translator = LanguageTranslatorV3(
                version='2018-05-01', authenticator=self.authenticator)
        
        self.language_translator.set_service_url("https://api.au-syd.language-translator.watson.cloud.ibm.com/instances/9f940bd7-6976-4b20-8a51-7473d495978d") 
        self.module_path = os.path.dirname(os.path.realpath(__file__))
        output_path = self.module_path.split("\\")[:-1]
        self.output_path = "\\".join(output_path)+ "\\data"
        


        
    def write_query(self, country,**kwargs):
        params = self.params_dict.copy()
        category = kwargs.get('category', None)
        exact_match = kwargs.get('q', None)
        
        params["country"] = country
        
        if category:
            params["category"] = category
        if exact_match:
            params["q"] = exact_match            
        
        query = "".join({k+"="+v+"&" for k,v in params.items() if v != None  })
        query += "pageSize=100&"
        return self.base_request + query + "apiKey=" + self.key
     
    
    def data_enrichment_v2(self,json_doc,original_lang):
        ret = []
        q_str = self.mapping[original_lang][1]+'-en'
        if self.mapping[original_lang][1] == "en":
            
            for info_dict in json_doc["articles"]:
                
                info_dict["translated_title"] = info_dict["title"]
                ret.append(info_dict)
                
        else:
            for info_dict in json_doc["articles"]:
                try :
                    translation = self.language_translator.translate(text=info_dict["title"], model_id=q_str).get_result()
        
                    info_dict["translated_title"] = translation["translations"][0]["translation"]
                    time.sleep(0.3)
                    ret.append(info_dict)       
                except Exception as e :
                    print("API throttle error")
                    print(e)
                    pass
        return ret

    
    def save_data(self, json_to_save, name_file):
        
        with open(self.output_path+"\\" + name_file, 'w') as json_file:
            json.dump(json_to_save, json_file)
        

sia = SentimentIntensityAnalyzer()


def read_data(path):
    with open(path) as json_file:
        data = json.load(json_file)
    
    key = path.split("\\")[-1]    
    name_file = key +"_complete.json"
    if data:    
        return data,name_file , key
    else:
        name_file = path.split("\\")[-1]+"_FAIL.json"
        return "nope" , name_file, key
    
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
    path = NC.output_path
    with open(path+"\\" + name_file, 'w') as json_file:
        json.dump(json_to_save, json_file)
        
        
def main(files, mapping):
    names = []
    state = []
    for file in files:
        data,name,key  = read_data(path = file)
        state.append(mapping[key])
        names.append(name)
        try:
            dict_to_save = add_sentiment(json_obj = data)
            save_data(dict_to_save, name_file = name)
        except:
            print(name)
    mapping_final = {k:v for k,v in zip(state,names)}
    
    with open(os.path.join(NC.output_path,"mapping_state_file_FINAL.json"), "w") as f:
        json.dump(mapping_final, f)
    
    return


if __name__ == "__main__":
    NC = News()
    
    def do_all():
            
        name_files = []
        for lan in list(NC.mapping.keys()):
            res_cat = []
            for cat in NC.category:
                try:
                    req = NC.write_query(country = lan, category = cat)
                    res = requests.get(req).json()
                    res_cat.append(NC.data_enrichment_v2(res,original_lang=lan))
                
                except Exception as e :
                    print(e)
                    raise(e)
            
            res_enriched = [elem for sublist in res_cat for elem in sublist]
            NC.save_data(json_to_save  = res_enriched ,name_file = "news_" + lan)
            time.sleep(5)
            name_files.append("news_" + lan)
            
                
        state_name = [value[0] for value in NC.mapping.values() ]
        mapping_state_file={k:v for k,v in zip(state_name,name_files )}
        
        path = NC.output_path
        files =  [path+"\\" + name for name in  name_files]        
        reversed_mapping_state_file = {v:k for k,v in mapping_state_file.items()}
        
        main(files=files, mapping=reversed_mapping_state_file)
        
        return 
    
    schedule.every(375).minutes.do(do_all)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

