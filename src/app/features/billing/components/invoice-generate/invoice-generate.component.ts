import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { InvoiceRequest } from '../../models/billing.models';
import { PatientService } from '../../../patients/services/patient.service';
import {
  ChargeCatalogService,
  ChargeCatalogResponse,
} from '../../services/charge-catalog.service';
import { MessageService } from 'primeng/api';
import { BillingFacade } from '../../facades/billing.facade';

@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  providers: [MessageService],
})
export class InvoiceGenerateComponent implements OnInit {
  invoiceForm: FormGroup;
  filteredPatients: any[] = [];
  chargeItems: ChargeCatalogResponse[] = [];
  isLoadingPatients = false;

  constructor(
    private fb: FormBuilder,
    public facade: BillingFacade,
    private patientService: PatientService,
    private chargeCatalogService: ChargeCatalogService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
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

    // Automatically update patient fields when a patient is selected
    this.invoiceForm
      .get('selectedPatient')
      ?.valueChanges.subscribe((patient) => {
        if (patient && typeof patient === 'object') {
          this.invoiceForm.patchValue(
            {
              patientName:
                patient.name || `${patient.firstName} ${patient.lastName}`,
              patientId: patient.id,
            },
            { emitEvent: false },
          );
          this.cdr.detectChanges();
        } else {
          this.invoiceForm.patchValue(
            {
              patientName: '',
              patientId: '',
            },
            { emitEvent: false },
          );
          this.cdr.detectChanges();
        }
      });
  }

  loadChargeCatalog() {
    this.chargeCatalogService.getAllCharges().subscribe({
      next: (data) => {
        this.chargeItems = data;
      },
      error: (err: any) => {
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
        this.filteredPatients = data.content.map((p: any) => ({
          ...p,
          name: p.name || `${p.firstName} ${p.lastName}`,
        }));
        this.isLoadingPatients = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingPatients = false;
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
    // Handled by valueChanges subscription in ngOnInit
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
    this.cdr.markForCheck(); // Update total display
  }

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
      status: 'ISSUED',
      items: formVal.items.map((item: any) => ({
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    };

    this.facade.createInvoice(request, () => {
      setTimeout(() => this.router.navigate(['/billing']), 1000);
    });
  }

  cancel(): void {
    this.location.back();
  }
}
