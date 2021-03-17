import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { Order } from 'src/app/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderUrl= 'http://localhost:3000/api/orders'
  constructor(private http : HttpClient,private userService :UserService) { }

  placeOrder(orderInfo : OrderInfo){
    let headers = new HttpHeaders({
      'authorization': this.userService.getToken()
    })
    return this.http.post(this.orderUrl, orderInfo , {headers})
  }

  changeStatus(data :{status : string},orderId :string){
    let headers = new HttpHeaders({
      'authorization': this.userService.getToken()
    })
    return this.http.patch(this.orderUrl+'/'+orderId, data , {headers})
  }

  getUserOrder(all ?: boolean){
    let url =this.orderUrl;
    if(all){
      url =url + '?all=true'
    }
    let headers = new HttpHeaders({
      'authorization': this.userService.getToken()
    })
    return this.http.get(url,  {headers}).pipe(
      map((result : {count : number,orders : Order[]})=>{
        return result.orders
      }
    )
    )
  }

  getAdminOrder(){
    return this.getUserOrder(true)
  }
}


  


export interface ProductInfo {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderInfo {
  firstName: string;
  lastName: string;
  address: string;
  products: ProductInfo[];
}

