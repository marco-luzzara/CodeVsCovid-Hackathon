# -*- coding: utf-8 -*-
"""
Created on Sat Mar 28 10:25:59 2020

@author: alessio.caponi
"""

import time 
import requests
import json 
from googletrans import Translator
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator


class News():
    def __init__(self):
        self.key = '456c14b545d94522a582967ba4a3269b'
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


        
        self.category = ["business", " entertainment","general","health", "science", "sports", "technology"]
        self.translator = Translator()

        self.params_dict = { "country=": None,
                            "category" : None,
                            "q" : None
                }
        
        self.base_request = 'https://newsapi.org/v2/top-headlines?'
        
        self.authenticator = IAMAuthenticator('D2ztJnangh_-XKoWSW37K-Mp8V3tOiGcRclPgTRNJxKN')
        self.language_translator = LanguageTranslatorV3(
                version='2018-05-01', authenticator=self.authenticator)
        
        self.language_translator.set_service_url('https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/c7cc8f32-28cb-429d-8e35-39fa0faab1fb')    

        
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
     
    def data_enrichment(self,json_doc):
        ret = []
        for info_dict in json_doc["articles"]:
            try :
                    
                info_dict["translated_title"] = self.translator.translate(info_dict["title"], dest ="en").text
                time.sleep(20)
                ret.append(info_dict)       
            except Exception as e :
                print("API throttle error")
                print(e)
                pass
        return ret
    
    def data_enrichment_v2(self,json_doc,original_lang):
            
        ret = []
        q_str = self.mapping[original_lang][1]+'-en'
        print(self.mapping[original_lang][1])
        if original_lang == "en":
            for info_dict in json_doc["articles"]:
                info_dict["translated_title"] = info_dict["title"]
                ret.append(info_dict)        
        else:
                
            for info_dict in json_doc["articles"]:
                try :
                    translation = self.language_translator.translate(text=info_dict["title"], model_id=q_str).get_result()
        
                    info_dict["translated_title"] = translation["translations"][0]["translation"]
                    time.sleep(2)
                    ret.append(info_dict)       
                except Exception as e :
                    print("API throttle error")
                    print(e)
                    pass
        return ret


    
    
    def save_data(self, json_to_save, name_file):
        
        with open(name_file, 'w') as json_file:
            json.dump(json_to_save, json_file)
        


if __name__ == "__main__":
    NC = News()
    errors = []
    for lan in NC.lang:
        try:
            req = NC.write_query(country = lan)
            res = requests.get(req).json()
            res_enriched = NC.data_enrichment_v2(res,original_lang=lan)
            NC.save_data(json_to_save  = res_enriched ,name_file = "news_" + lan)
            time.sleep(5)
        except Exception as e :

            raise(e)
