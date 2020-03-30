import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ApiService } from 'src/app/services/api/api.service';

const COUNTERS = [{
  title: "Confirmed",
  value: 139523
},
{
  title : "Death",
  value: 2433
},
{
  title : "Recovered",
  value : 4865
}]



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public counters;
  public articles : Article[];
  public sentimentValue : number;

  constructor(private apiService : ApiService) {
    this.sentimentValue = localStorage.getItem("sentiment") ? +localStorage.getItem("sentiment") : 0;
    this.apiService.getNews(this.sentimentValue).subscribe(news => {
      news.forEach(article => {
        const formattedDate = new Date(Date.parse(article.publishedAt)).toUTCString();
        article.publishedAt = formattedDate;
      })
      this.articles = news;
    })
  }


  ngOnInit() {
    this.counters = COUNTERS;
  }

  public goToLink(url: string){
    window.open(url, "_blank");
  }

  public sentimentChanged(event) {
    console.log(event)
    localStorage.setItem("sentiment", event.value);
    this.apiService.getNews(this.sentimentValue).subscribe(news => {
      news.forEach(article => {
        const formattedDate = new Date(Date.parse(article.publishedAt)).toUTCString();
        article.publishedAt = formattedDate;
      })
      this.articles = news;
    })

  }

}
