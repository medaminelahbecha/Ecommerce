import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/products';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { error } from '@angular/compiler/src/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order/order.service';
import { Summary } from 'src/app/models/summary';
import { SummaryService } from 'src/app/services/summary/summary.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = []
  categorySubscription: Subscription
  categories: Category[] = []
  selectedProduct: Product
  modelRef: BsModalRef;
  message: string
  searchText;

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private modalService: BsModalService,
    private router: Router
    

  ) { }

  ngOnInit(): void {
    this.collectAllProducts();
    this.collectAllCategories();

  }

  collectAllProducts() {
    this.productService.getAllProducts({})
      .subscribe({
        next: (products) => {
          this.products = products
        }
      })
  }
  collectAllCategories() {
    this.categorySubscription = this.categoryService.getAllCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories
          console.log(categories)
        }

      })
  }
  openModal(formTemplate, product: Product) {
    this.selectedProduct = product
    this.modelRef = this.modalService.show(formTemplate)
  }

  updateProduct(productForm: HTMLFormElement) {
    let name = (<HTMLInputElement>productForm.elements.namedItem('name')).value
    let price = (<HTMLInputElement>productForm.elements.namedItem('price')).value
    let category = (<HTMLSelectElement>productForm.elements.namedItem('category')).value


    let values = {
      name, price, category
    }

    this.productService.updateProduct(values, this.selectedProduct._id)
      .subscribe({
        next: (value) => {
          this.selectedProduct.name = name
          this.selectedProduct.price = +price

          this.categories.find((el, index, arr) => {
            if (el._id == category) {
              this.selectedProduct.category = el;
            }
          })

          this.modelRef.hide();
        },
        error: (error) => {

        }

      })

  }



  deleteProduct(_id: string) {
    console.log(_id);

    this.productService.deleteProduct(_id)
      .subscribe({
        next: (value) => {
          console.log(_id);
          this.router.navigate(['admin/products'])

        },
        error: (error) => {
          console.log(error);

        }
      })
  }

  
}
