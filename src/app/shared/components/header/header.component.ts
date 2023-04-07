import { Component } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color="primary">
    <span>My Store</span>
    {{quantity$ | async | json }} - Quantity
</mat-toolbar>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
  quantity$ = this.shoppingCartSvc.quantityAction$;
  total$ = this.shoppingCartSvc.totalActions$;
  cart$ = this.shoppingCartSvc.cartActions$;
  constructor(private shoppingCartSvc: ShoppingCartService){

  }
}
