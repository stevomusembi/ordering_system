import { Component, OnInit } from '@angular/core';
import { faEye, faHand, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderFormComponent } from '../order-form/order-form.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  accountBalance!: number;
  faHandWave = faHand;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  loading: boolean = true;
  narration: any = '';
  orders: any = [];


  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; }, 3000);
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.accountBalance = JSON.parse(localStorage.getItem('accountBalance') || '100000');
  }

  logout(): void {
    this.router.navigate(['login']);
  };

  submitOrder(): void {
    console.log('order submitted');
  }

  openOrderModal(): void {
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the submitted order
        this.loading = true;
        this.setOrderStatus(result);
        this.calculateBalance(result);
        localStorage.setItem('orders', JSON.stringify(this.orders));
      }
    });
  }

  setOrderStatus(order: any): void {
    // Implement logic to check if the order already exists
    if (!this.orders.length) {
      order.status = 'PENDING';
      this.orders.push(order);
      setTimeout(() => {this.loading = false;},2500);
      return;
    }

    this.orders.forEach((item: any) => {
      if (item.orderNumber === order.orderNumber) {
        const confirmed = window.confirm("This is a DUPLICATE order do you wish to proceed ? ");
        if (confirmed) {
          order.status = 'DUPLICATE';
          this.loading = true;
          setTimeout(() => { this.orders.push(order); this.loading = false; }, 2500);
        }
      } else {
        order.status = 'PENDING';
        setTimeout(() => { this.orders.push(order); this.loading = false; }, 2500);

      }
    })

  }

  calculateBalance(order: any): void {
    this.accountBalance = Number(this.accountBalance) - Number(order.totalPrice);
    localStorage.setItem('accountBalance', JSON.stringify(this.accountBalance));
  }

  deleteOrder(order: any): void {
    const confirmed = window.confirm("You are about to delete " + order.productName + " " + order.quantity + " of Ksh" + order.totalPrice);

    if (confirmed) {
      this.loading = true;
      this.orders = this.orders.filter((o: any) => o !== order);
      localStorage.setItem('orders', JSON.stringify(this.orders));
      setTimeout(()=>{ this.loading = false; }, 2500);
    } else {
      console.log('Deletion canceled');
    }
  }

}
