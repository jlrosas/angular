import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../interfaces/product.interface'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
 @Input() product!: Product;
 @Output() addToCartClick = new EventEmitter<Product>();
  constructor(){  }

  onClick(): void{
   console.log('click ',this.product); 
   this.addToCartClick.emit(this.product);
  }

}
