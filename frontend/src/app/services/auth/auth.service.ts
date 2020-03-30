import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

export interface Token {
  id : number,
  isNurse : boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(public router: Router) { }

  public getToken() : Token{
    const tokenString = localStorage.getItem('token');
    console.log(JSON.parse(tokenString))
    return JSON.parse(tokenString);
  }
  public isAuthenticated(): boolean {
    // get the token
    const token : Token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    const isAuth : boolean = token ? true : false;
    return isAuth;
  }

  public isNurse() : boolean {
    const token : Token = this.getToken();
    const isNurse = token ? token.isNurse : false;
    return isNurse;
  }

  canActivate(): boolean {
    const token : Token = this.getToken();

    if(token == null){
      this.router.navigateByUrl(`/news`);
      return false;
    }
    else if(this.router.url.includes('scanner') || this.router.url.includes('patient'))
      return token.isNurse;
    else
      return true;
  }
}
