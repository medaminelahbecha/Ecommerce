import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private UserService: UserService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot) {


    return this.UserService.isAdmin().pipe(
      map(result => {
        if(!result)
        {
          this.router.navigate([''],{
            queryParams : {
              returnUrl : state.url
            }
          })
      }
        return result
      }
      )
    )
  }
}
