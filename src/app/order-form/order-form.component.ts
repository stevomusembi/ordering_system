import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
interface Product {
  id: number;
  name: string;
  quantities: { size: string, price: number,quantity:any }[];
}
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      narration: ['', [Validators.required, Validators.maxLength(45)]]
    });

    this.orderForm.get('product')!.valueChanges.subscribe((selectedProduct: Product) => {
      const quantityControl = this.orderForm.get('quantity');
      if (selectedProduct) {
        quantityControl!.enable();
      } else {
        quantityControl!.disable();
      }
      quantityControl!.setValue('');
    });

  }

 
  products: Product[] = [
    {
    id: 1,
    name: 'Scratch Cards',
    quantities: [
    { size: '100', price: 1000, quantity: 10 },
    { size: '250', price: 250, quantity: 20 },
    { size: '500', price: 500, quantity: 40 },
    { size: '1000', price: 1000, quantity: 70 }
    ]
    },
    {
    id: 2,
    name: 'Phones',
    quantities: [
    { size: '3 boxes', price: 30000, quantity: 3 },
    { size: '5 boxes', price: 40000, quantity: 5 },
    { size: '7 boxes', price: 50000, quantity: 5 }
    ]
    },
    {
    id: 3,
    name: 'Powerbanks',
    quantities: [
    { size: '10 pieces', price: 10000, quantity: 10 },
    { size: '5 pieces', price: 5000, quantity: 5 }
    ]
    },
    {
    id: 4,
    name: 'Earphones',
    quantities: [
    { size: '3 pieces', price: 1000, quantity: 3 },
    { size: '5 pieces', price: 1500, quantity: 5 },
    { size: '10 pieces', price: 3000, quantity: 10 }
    ]
    }
    ];
  narration: string = '';

  constructor(public dialogRef: MatDialogRef<OrderFormComponent>, private fb: FormBuilder) { }

  get selectedProduct() {
    return this.orderForm.get('product')!.value;
  }

  get totalPrice() {
    const product = this.selectedProduct;

    const quantityOption = this.orderForm.get('quantity')!.value;
    if (product && quantityOption) {
      const selectedQuantity = product.quantities.find((q: any) => q.size === quantityOption);
      return selectedQuantity ? selectedQuantity.price : 0;
    }
    return 0;
  }


  onCancel(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    if (this.orderForm.valid) {

      const formValue = this.orderForm.value;
      const orderNumber = this.generateOrderNumber(
        formValue.product.id,
        formValue.quantity,
        formValue.product.name
      );
      const submission = {
        orderNumber: orderNumber,
        date: new Date(),
        productId: formValue.product.id,
        productName: formValue.product.name,
        quantity: formValue.quantity,
        narration: formValue.narration,
        totalPrice: this.totalPrice
      };
      this.dialogRef.close(submission);
    }

  }


  private generateOrderNumber(productId: number, quantity: string, productName: string): string {
    // Remove any non-numeric characters from the quantity
    const numericQuantity = quantity.replace(/\D/g, '');
    const productShortName = productName.substring(0, 3).toUpperCase();

    // Combine product name productId and quantity
    const combined = `${productShortName}${productId}${numericQuantity}`;
    return combined;

  }
}