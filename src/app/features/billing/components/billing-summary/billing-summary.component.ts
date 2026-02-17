import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { InvoiceResponse, InvoiceStatus } from '../../models/billing.models';
import { Router } from '@angular/router';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-billing-summary',
  templateUrl: './billing-summary.component.html',
  styleUrls: ['./billing-summary.component.scss'],
})
export class BillingSummaryComponent implements OnInit, AfterViewInit {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('amountTemplate') amountTemplate!: TemplateRef<any>;

  invoices: InvoiceResponse[] = [];
  permissions = PERMISSIONS;
  InvoiceStatus = InvoiceStatus;

  cols: any[] = [
    { field: 'invoiceNumber', header: 'Invoice #' },
    { field: 'issueDate', header: 'Date' },
    { field: 'patientName', header: 'Patient' },
    { field: 'totalAmount', header: 'Amount' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private billingService: BillingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.billingService.getAllInvoices().subscribe((data) => {
      this.invoices = data;
    });
  }

  ngAfterViewInit() {
    const statusCol = this.cols.find((c) => c.field === 'status');
    if (statusCol) statusCol.template = this.statusTemplate;

    const dateCol = this.cols.find((c) => c.field === 'issueDate');
    if (dateCol) dateCol.template = this.dateTemplate;

    const amountCol = this.cols.find((c) => c.field === 'totalAmount');
    if (amountCol) amountCol.template = this.amountTemplate;
  }

  createInvoice(): void {
    this.router.navigate(['/billing/invoice/new']);
  }

  viewReceipt(id: string): void {
    this.router.navigate(['/billing/receipt', id]);
  }
}
