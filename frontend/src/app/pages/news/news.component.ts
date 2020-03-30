import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ApiService } from 'src/app/services/api/api.service';

const COUNTERS = [{
  title: "Death",
  value: 10099
},
{
  title : "Infected",
  value: 222556
},
{
  title : "Recovered",
  value : 3126
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
        const formattedDate = new Date(Date.parse(article.publishedAt));
        article.publishedAt = formattedDate.toString()
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
        const formattedDate = new Date(Date.parse(article.publishedAt));
        article.publishedAt = formattedDate.toString()
      })
      this.articles = news;
    })

  }

}
