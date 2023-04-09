import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Store } from 'src/app/shared/interfaces/stores.interface';

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

  isDelivery: boolean = false;
  stores: Store[] = [];

  constructor(private dataSvc: DataService){

  }

  ngOnInit(): void {
    this.getStores();
  }

  onPickupOrDelivery(value:boolean): void{
    this.isDelivery = value;
  }

  onSubmit(): void{
    console.log("on submit");
  }

  getStores(): void{

    this.dataSvc.getStores()
      .pipe(
        tap((resStores: Store[]) => this.stores = resStores))
      .subscribe();
  }

}
