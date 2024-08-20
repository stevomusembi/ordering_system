import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  topUpForm!: FormGroup;
  paymentOptions: string[] = ['Mpesa', 'Airtel Money', 'Card'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderListComponent>
  ) {}

  ngOnInit() {
    this.topUpForm = this.fb.group({
      paymentOption: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      confirmationMessage: ['', Validators.required],
      narration: ['', [Validators.maxLength(45)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.topUpForm.valid) {
      const formValue = this.topUpForm.value;
      const submission = {
        paymentOption: formValue.paymentOption,
        amount: formValue.amount,
        confirmationMessage: formValue.confirmationMessage,
        narration: formValue.narration,
        timestamp: new Date()
      };
      this.dialogRef.close(submission);
    }
  }
}
