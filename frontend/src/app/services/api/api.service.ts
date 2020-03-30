import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of, Observable, ArgumentOutOfRangeError } from 'rxjs';
import { Dossier } from 'src/app/models/dossier';
import { Parent } from 'src/app/models/parent';
import { Article } from 'src/app/models/article';
import { Message } from '../../models/message';

const apiEndpoint = "http://localhost:3333"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

const httpOptionsPlainText = {
  headers: new HttpHeaders({
    'Content-Type':  'text/plain'
  })
};

const RELATIVES : Parent[] = [
  {
    id: 123,
    patientLabel : "Mario Rossi"
  },
  {
    id : 456,
    patientLabel : "Luca Verdi"
  }
]

const ARTICLES : Article[] = [
  {
    title : "Test articolo",
    publishedAt : "",
    urlToImage : "https://www.geekoo.it/wp-content/uploads/2015/05/IMG_0179.png",
    url : "https://www.newsrimini.it/2020/03/le-immagini-di-un-mese-di-emergenza/",
    sentiment : 0.0,
    author : "pinooo"
  }
]

export interface EncapsMessage {
  messages : Message[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  public registerUser(mail : string, password : string, role : boolean) : Observable<number>{
    return this.http.post<number>(`${apiEndpoint}/users`, {'mail' : mail, 'pwd' : password, 'role' : role}, httpOptions)
    
  }

  public login(mail : string, password : string) : Observable<any>{
    return this.http.post<any>(`${apiEndpoint}/users/login`, {'mail' : mail, 'pwd' : password}, httpOptions)
  }

  public addDossierToUser(dossierId, dossierPassword, patientLabel) {
    console.log(dossierId, dossierPassword, patientLabel);
    return this.http.post<HttpResponse<any>>(`${apiEndpoint}/users/dossiers`, {
      id : dossierId, pwd : dossierPassword, patientLabel : patientLabel
    }, { observe : 'response', headers : httpOptions.headers})
  }

  public getDossier(id : number){
    return this.http.get<EncapsMessage>(`${apiEndpoint}/dossiers/${id}`, httpOptions)
  }

  public activateDossier(id : number) {
    return this.http.put<HttpResponse<any>>(`${apiEndpoint}/dossiers/${id}`,{},
     { observe : 'response', headers : httpOptions.headers})
  }

  public getRelatives(){
    return this.http.get<Parent[]>(`${apiEndpoint}/dossiers`)
    //return of<Parent[]>([{id:123, label: "Luigi"}])
  }

  public sendMessage(id, message) {
    return this.http.post<HttpResponse<any>>(`${apiEndpoint}/dossiers/${id}/messages`, message,
     { observe : 'response', headers : httpOptionsPlainText.headers})
  }

  public getNews(sentimentValue) {
    const normalizedSentimentValue = sentimentValue / 10.0;

    let lowerBound = normalizedSentimentValue >= 0.1 ? normalizedSentimentValue - 0.1 : 0.0;
    lowerBound = +lowerBound.toFixed(2);
    
    let upperBound = normalizedSentimentValue <= 0.9 ? normalizedSentimentValue + 0.1 : 1.0;
    upperBound = +upperBound.toFixed(2);

    const countryId = "us"

    //return of(ARTICLES)
    return this.http.get<Article[]>(`${apiEndpoint}/news?countryId=${countryId}&positivityStart=${lowerBound}&positivityEnd=${upperBound}`)
  }





}
