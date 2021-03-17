import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Product } from 'src/app/models/products';
import { ProductService } from 'src/app/services/product/product.service';
import { OrderInfo,OrderService,ProductInfo } from 'src/app/services/order/order.service';

import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
interface CartItem {
  product: Product
  quantity: number
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart;
  cartItems: CartItem[]=[];
  total =0;
  cartSubscription : Subscription ;
  modalRef : BsModalRef
  

  constructor(private cartService: CartService, 
    private orderService : OrderService,
    private modalService : BsModalService ,
    private router : Router,
    private productService: ProductService) { }
  ngOnInit(): void {
    this.subscribeCart();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe()
    
  }

  subscribeCart() {
    let total = 0;
   this.cartSubscription= this.cartService.cartObservable.subscribe({
      next: (cart) => {
       
        let observable = []
        total=0;
        if(Object.keys(cart).length==0){
          this.cartItems=[]
        }
        for (let id in cart) {
          console.log(id);
          observable.push(
            this.productService.getProductById(id)
              .pipe(
                map(product => {
                  total += (product.price * cart[id])
                  let item: CartItem = {
                    product: product,
                    quantity: cart[id]
                  }
                  return item

                })
              )
          )

        }

        forkJoin(observable).subscribe({
          next: (cartItems: CartItem[]) => {
            this.total =total;
            this.cartItems = cartItems
          }
        })

      }
    })
  }

  //open modal 
  openModal(form){
   this.modalRef= this.modalService.show(form ,{
     animated : true ,
     class : 'modal-lg'
   })
  }
  //checkOut 

  checkOut(evnt :Event ,form : HTMLFormElement){
    evnt.preventDefault();
   let firstName = (<HTMLInputElement>form.elements.namedItem('firstName')).value;
   let lastName = (<HTMLInputElement>form.elements.namedItem('lastName')).value;
   let address = (<HTMLInputElement>form.elements.namedItem('address')).value;
   
   let orderInfo : OrderInfo ;
   let productInfo : ProductInfo[] =[] ;
   this.cartItems.forEach(e=>{
     productInfo.push({
       price : e.product.price,
       productId : e.product._id ,
       quantity : e.quantity 

     })
   })

   orderInfo ={
     address,
     firstName,
     lastName,
     products : productInfo
   }
   console.log(orderInfo)
   
   console.log({
      firstName ,
      lastName,
      address
    });

    this.orderService.placeOrder(orderInfo)
    .subscribe({
      next : (result)=>{
        this.modalRef.hide()
        this.cartService.clearCart()
        this.router.navigate(['orders'])
      },
      error :(err)=>{
        console.log({'err' : "can not place order..."})
      }
    })
    return false;
  }


}
