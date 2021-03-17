import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { UserService } from 'src/app/services/user/user.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  numberOfItem : number =0;
  isLoggedIn = false ;
  isAdminUrl = false ;
  isAdmin$
  constructor(private cartService: CartService ,
     private userService : UserService ,
    private router:Router ) {

      router.events.subscribe({
        next : (event)=>{
          if(event instanceof NavigationStart)
          {
          let url = (<NavigationStart>event).url
           this.isAdminUrl = url.includes('/admin')
          }
        }
      })
     }

  ngOnInit(): void {

    this.cartService.cartObservable.subscribe({
      next : (cart)=>{
        console.log(cart);
        this.numberOfItem = Object.keys(cart).length
      }
    })

    //chek user is admin or not
    

    this.userService.loginObservable.subscribe({
      next :()=>{
       let token = this.userService.getToken();
       if(token!= ''){
         this.chekAdmin()
         this.isLoggedIn=true;
       }else{
         this.isLoggedIn=false;
       }
       console.log(this.isLoggedIn)

      }
    })
  }

  chekAdmin(){
   this.isAdmin$= this.userService.isAdmin()
     
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['login'])
  }

}
