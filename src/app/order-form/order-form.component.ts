import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
interface Product {
  id: number;
  name: string;
  quantities: { size: string, price: number }[];
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
      name: 'Bricks',
      quantities: [
        { size: '50 kg', price: 2000 },
        { size: '100 kg', price: 1200 },
        { size: '300 kg', price: 5000 }
      ]
    },
    {
      id: 2,
      name: 'Construction Nails',
      quantities: [
        { size: '3 boxes', price: 1500 },
        { size: '6 boxes', price: 4000 },
        { size: '12 boxes', price: 15000 }
      ]
    },
    {
      id: 3,
      name: 'Paint',
      quantities: [
        { size: '50 litres', price: 1800 },
        { size: '200 litres', price: 2500 },
        { size: '500 litres', price: 5800 }
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