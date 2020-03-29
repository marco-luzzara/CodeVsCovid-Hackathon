import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';

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

const ARTICLES : Article[] = [
  {
    title : "Test articolo",
    author : "Pino gino",
    description : "orem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmen",
    imgUrl : "https://www.geekoo.it/wp-content/uploads/2015/05/IMG_0179.png",
    url : "https://www.newsrimini.it/2020/03/le-immagini-di-un-mese-di-emergenza/"
  }
]

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public counters;
  public articles : Article[];

  constructor() { }

  ngOnInit() {
    this.counters = COUNTERS;
    this.articles = ARTICLES;
  }

  public goToLink(url: string){
    window.open(url, "_blank");
  }

}
