import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from 'src/app/models/user';
import {map} from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loginObservable : BehaviorSubject<Object>;
  private getAllUserUrl="http://localhost:3000/api/users";
  private userSingupUrl="http://localhost:3000/api/users/signup";
  private userLoginUrl="http://localhost:3000/api/users/login";
  private isAdminUrl="http://localhost:3000/api/users/is-admin";
  constructor(private http:HttpClient) {
    this._loginObservable= new  BehaviorSubject({}) ; 
  }
  public get loginObservable(){
    return this._loginObservable
  }

private saveTokenToLOcalStorage(token : string){
  localStorage.setItem('token', "bearer "+token)
}

logout(){
  localStorage.removeItem('token')
  this._loginObservable.next({})
}

isAdmin(){
  let headers = new HttpHeaders({
    'authorization':this.getToken()
  })
  return this.http.get(this.isAdminUrl,{headers}).pipe(
    map(resuult=>{
      return <boolean>resuult
    })
  )
}
getToken(){
  return localStorage.getItem('token') ?localStorage.getItem('token'): "";
}

isLoggedIn(){
  if(this.getToken() !=''){
    return true ;
  }
  return false ;
}

  signup(user : User){
    return this.http.post(this.userSingupUrl,user)
    .pipe(
      map(result=>{
       return <{message : string}>result
      })
    )
  }
  getAll(){
    let headers = new HttpHeaders({
      'authorization':this.getToken()
    })
    return this.http.get(this.getAllUserUrl,{headers})
    .pipe(
      map((result :{users : User[]})=>{
       return result.users
      })
    )
  }
  login(caredentials : {email :string , password : string}){
    return this.http.post(this.userLoginUrl,caredentials)
    .pipe(
      map((result : loginResponce)=>{
        this.saveTokenToLOcalStorage(result.token)
        this._loginObservable.next({});
        return result
      })
    )
  }
}

interface loginResponce{
  token : string,
  message : string
}
