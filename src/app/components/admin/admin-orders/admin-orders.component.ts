import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders$: Observable<Order[]>;
  selectedOrder : Order 
  modelRef: BsModalRef
  searchText;
  constructor(private orderService: OrderService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.collectOrders()
  }

  collectOrders() {
    this.orders$ = this.orderService.getAdminOrder()
  }

  changeStatus(status: string, order: Order) {
    this.orderService.changeStatus({ status: status }, order._id)
      .subscribe({
        next: (result) => {
          order.status = status

        }
      })
  }

  showDetails(order: Order, table) {
    this.selectedOrder = order
   this.modelRef= this.modalService.show(table,{class : 'modal-lg'})
  }

  close(){
    this.modelRef.hide()
  }
}
