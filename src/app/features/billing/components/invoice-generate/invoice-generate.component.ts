import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BillingService } from '../../services/billing.service';
import { InvoiceRequest } from '../../models/billing.models';
import { PatientService } from '../../../patients/services/patient.service';
import {
  ChargeCatalogService,
  ChargeCatalogResponse,
} from '../../services/charge-catalog.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  //   styleUrls: ['./invoice-generate.component.scss'],
  providers: [MessageService],
})
export class InvoiceGenerateComponent implements OnInit {
  invoiceForm: FormGroup;
  filteredPatients: any[] = [];
  chargeItems: ChargeCatalogResponse[] = [];
  isLoadingPatients = false;

  constructor(
    private fb: FormBuilder,
    private billingService: BillingService,
    private patientService: PatientService,
    private chargeCatalogService: ChargeCatalogService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
  ) {
    this.invoiceForm = this.fb.group({
      selectedPatient: [null, Validators.required],
      patientName: ['', Validators.required],
      patientId: ['', Validators.required],
      items: this.fb.array([]),
      status: ['DRAFT'],
    });
  }

  ngOnInit(): void {
    this.loadChargeCatalog();
    this.addItem();
  }

  loadChargeCatalog() {
    this.chargeCatalogService.getAllCharges().subscribe({
      next: (data) => {
        this.chargeItems = data;
      },
      error: (err) => {
        console.error('Failed to load charge catalog', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load items',
        });
      },
    });
  }

  searchPatients(event: any) {
    const query = event.query;
    this.isLoadingPatients = true;
    this.patientService.getPatients(query).subscribe({
      next: (data) => {
        this.filteredPatients = data.content;
        this.isLoadingPatients = false;
      },
      error: (err) => {
        this.isLoadingPatients = false;
        console.error('Patient search failed', err);
        // 401 will be handled by interceptor, but we can show a message
        if (err.status !== 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Search Failed',
            detail: 'Could not search patients',
          });
        }
      },
    });
  }

  onPatientSelect(event: any) {
    const patient = event.value; // PrimeNG 15+ usually emits {originalEvent, value} for some events, but autocomplete might emit just value or event.
    // Based on previous interaction, event itself might be the patient object if coming directly from flow,
    // but let's be safe and check if it has properties or if it's nested.
    // Actually standard p-autoComplete (onSelect) emits the selected item.

    if (patient) {
      this.invoiceForm.patchValue({
        patientName: patient.name || patient.firstName + ' ' + patient.lastName,
        patientId: patient.id,
      });
    }
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      selectedItem: [null],
      description: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    // Recalculate invoice total handled by template pipe or getter
  }

  onItemSelect(event: any, index: number) {
    const selectedItem = event.value;
    if (selectedItem) {
      const itemGroup = this.items.at(index);
      itemGroup.patchValue({
        description: selectedItem.name,
        unitPrice: selectedItem.standardPrice,
      });
      this.calculateRowTotal(index);
    }
  }

  calculateRowTotal(index: number) {
    const itemGroup = this.items.at(index);
    const price = itemGroup.get('unitPrice')?.value || 0;
    const qty = itemGroup.get('quantity')?.value || 0;
    itemGroup.patchValue({ total: price * qty }, { emitEvent: false });
  }

  // Helper for template to get total
  get invoiceTotal(): number {
    return this.items.controls.reduce((acc, curr) => {
      const price = curr.get('unitPrice')?.value || 0;
      const qty = curr.get('quantity')?.value || 0;
      return acc + price * qty;
    }, 0);
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const formVal = this.invoiceForm.value;
    const request: InvoiceRequest = {
      patientId: formVal.patientId,
      status: 'ISSUED', // Or DRAFT based on UI switch, default to ISSUED for now or let user choose?
      // User prompt imply generating invoice, usually means issuing.
      items: formVal.items.map((item: any) => ({
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    };

    this.billingService.createInvoice(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Invoice created',
        });
        setTimeout(() => this.router.navigate(['/billing']), 1000);
      },
      error: (err) => {
        console.error('Backend invoice creation failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create invoice',
        });
      },
    });
  }

  cancel(): void {
    this.location.back();
  }
}
