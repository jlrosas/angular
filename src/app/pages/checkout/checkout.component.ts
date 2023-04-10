import { Component, OnInit } from '@angular/core';
import { delay, switchMap, tap } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Store } from 'src/app/shared/interfaces/stores.interface';
import { NgForm } from '@angular/forms';
import { Details, Order } from 'src/app/shared/interfaces/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';

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

  constructor(
    private dataSvc: DataService, 
    private shoppingCartSvc: ShoppingCartService,
    private router: Router,
    private productSvc: ProductsService
    ){

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
      isDelivery: this.isDelivery
    }
    this.dataSvc.saveOrder(data)
    .pipe(
      tap( res => console.log("order ->", res)),
      switchMap(({id:orderId}) => {
        const details = this.prepareDetails();
        return this.dataSvc.saveDetailsOrder({details,orderId});
      }),
      tap( res => {
        console.log('Finish ->', res)
      }),
      tap( () => 
        this.router.navigate(['/checkout/thank-you-page'])
      ),
      delay(2000),
      tap( () => 
        this.shoppingCartSvc.resetCart()
      ),
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
        const updateStock = (stock - quantity);
        this.productSvc.updateStock(productId , updateStock)
        .pipe(
          tap(() =>  details.push({productId,productName,quantity}))
        )
        .subscribe();
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
