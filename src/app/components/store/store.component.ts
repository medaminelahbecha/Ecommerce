import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/models/products';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  p: number = 1;
  products : Product[] = []
  searchText
  constructor(private productService : ProductService ,private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next :(paramMap : ParamMap)=>{
        let categoryId=paramMap.get('category');
        let min=paramMap.get('min');
        let max=paramMap.get('max');
        console.log(categoryId);
        this.collectProducts({category : categoryId,min,max})

      }
    })
  }

  collectProducts(params){
    this.productService.getAllProducts(params)
    .subscribe({
      next:(products)=>{
        this.products=products
      
      },
      error :(error)=>{
        console.log(error)
      }
  })
  }

}
