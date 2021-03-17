import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user/user.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  error:string;
  success:string;

  constructor(private userService :UserService ,private router :Router) { }

  ngOnInit(): void {
  }
  navigateToLoginPage(){
    this.router.navigate(['login'])
  }

  readValueFromForm(form :HTMLFormElement){
    let name =(<HTMLInputElement>form.elements.namedItem('name')).value
    let email =(<HTMLInputElement>form.elements.namedItem('email')).value
    let password =(<HTMLInputElement>form.elements.namedItem('password')).value
    let phone =(<HTMLInputElement>form.elements.namedItem('phone')).value
    

    let user :User ={
      name,
      email,
      password,
      phone
    };
    return user;
  }
  signup(event : Event){
    event.preventDefault();
    let form =<HTMLFormElement>event.target;
    let user=this.readValueFromForm(form);
    this.createUser(user,form)
    

    
  }

  createUser(user:User ,form:HTMLFormElement){
    this.userService.signup(user).subscribe(
      {
        next:(result :{message:string})=>{
          console.log(result);
          this.success=result.message;
          this.error=undefined;
          form.reset();
          this.navigateToLoginPage();
        },
        error :(response : HttpErrorResponse)=>{
          console.log(response);
          this.error=response.error.error.message;
          this.success=undefined;
          
          
        }
      }
    )
  }
}
