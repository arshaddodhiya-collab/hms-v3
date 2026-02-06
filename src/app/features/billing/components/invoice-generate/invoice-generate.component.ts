import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  BillingService,
  Invoice,
} from '../../services/billing.service';

@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  styleUrls: ['./invoice-generate.component.scss'],
})
export class InvoiceGenerateComponent implements OnInit {
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private billingService: BillingService,
    private router: Router,
    private location: Location,
  ) {
    this.invoiceForm = this.fb.group({
      patientName: ['', Validators.required],
      patientId: ['', Validators.required],
      items: this.fb.array([]),
      status: ['PENDING'],
    });
  }

  ngOnInit(): void {
    this.addItem(); // Start with one item
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(): number {
    return this.items.controls.reduce(
      (acc, curr) => acc + (curr.get('amount')?.value || 0),
      0,
    );
  }

  saveInvoice(): void {
    if (this.invoiceForm.valid) {
      const formVal = this.invoiceForm.value;
      const newInvoice: Invoice = {
        id: 'INV-' + Math.floor(Math.random() * 10000),
        patientId: formVal.patientId,
        patientName: formVal.patientName,
        date: new Date(),
        items: formVal.items,
        totalAmount: this.calculateTotal(),
        status: formVal.status,
      };

      this.billingService.createInvoice(newInvoice);
      this.router.navigate(['/billing']);
    } else {
      this.invoiceForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.location.back();
  }
}
