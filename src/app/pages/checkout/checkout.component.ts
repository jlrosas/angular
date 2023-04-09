import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Store } from 'src/app/shared/interfaces/stores.interface';
import { NgForm } from '@angular/forms';
import { Details, Order } from 'src/app/shared/interfaces/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{
  model = {
    name:'',
    store: '',
    shippingAddress:'',
    city:''
  };

  isDelivery: boolean = true;
  cart: Product[] = [];
  stores: Store[] = [];

  constructor(private dataSvc: DataService, private shoppingCartSvc: ShoppingCartService){

  }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value:boolean): void{
    this.isDelivery = value;
  }

  onSubmit({value: formData}: NgForm): void{
    console.log("on submit ",formData);
    const data: Order = {
      ... formData, //de esta forma se setea todos los atributos del formulario
      date: this.getCurrentDay(),
      pickup: this.isDelivery
    }
    this.dataSvc.saveOrder(data)
    .pipe(
      tap( res => console.log("order ->", res)),
      switchMap( (order) => {
        const orderId = order.id;
        const details = this.prepareDetails();
        return this.dataSvc.saveDetailsOrder({details,orderId});
      }),
      tap( res => console.log('Finish ->', res)),
    )
    .subscribe();
  }

  getStores(): void{

    this.dataSvc.getStores()
      .pipe(
        tap((resStores: Store[]) => this.stores = resStores))
      .subscribe();
  }

  private getCurrentDay():string{
    return new Date().toLocaleDateString();
  }

  private prepareDetails() : Details[]{
    const details  :  Details[] = [];
    this.cart.forEach(
      (product:Product) => {
        const {id:productId, name:productName,qty:quantity, stock} = product;
        details.push({productId,productName,quantity});
      }
    )
    return details;
  }

  private getDataCart() : void{
    this.shoppingCartSvc.cartActions$
    .pipe(
      tap((products: Product[]) => this.cart = products)
    )
    .subscribe()
  }

}
