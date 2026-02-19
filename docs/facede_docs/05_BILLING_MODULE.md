# Billing Module — Facade Documentation

## What

The Billing facade manages invoice listing, creation, payment processing, and billing summary state through Angular Signals.

## Where

| File | Role |
|------|------|
| `src/app/features/billing/facades/billing.facade.ts` | **Facade** |
| `src/app/features/billing/components/billing-summary/` | Consumer — invoice list table |
| `src/app/features/billing/components/invoice-generate/` | Consumer — create invoice form |
| `src/app/features/billing/components/payment-receipt/` | Consumer — view invoice + process payment |

## Why

**Before**: `BillingSummaryComponent` directly subscribed to `BillingService.getInvoices()` and held the `invoices` array. `InvoiceGenerateComponent` (197 lines) injected `BillingService`, `PatientService`, `ChargeCatalogService`, and `MessageService`. `PaymentReceiptComponent` duplicated the subscribe-and-toast pattern.

**After**: Facade owns all invoice state.Two service injections removed from `InvoiceGenerateComponent`. Mutations route through facade with automatic toast handling.

## How

### Signals

| Signal | Type | Description |
|--------|------|-------------|
| `invoices` | `Signal<InvoiceResponse[]>` | All invoices |
| `selectedInvoice` | `Signal<InvoiceResponse \| null>` | Currently viewed invoice |
| `billingSummary` | `Signal<any>` | Summary stats (if loaded) |

### Computed

| Computed | Logic |
|----------|-------|
| `totalRevenue` | Sum of all invoice `totalAmount` values |
| `outstandingAmount` | Sum of all invoice `dueAmount` values |

### Actions (6 methods)

| Method | Description |
|--------|-------------|
| `loadInvoices()` | Fetches all invoices for summary table |
| `loadInvoiceById(id)` | Fetches single invoice for receipt view |
| `createInvoice(request, onSuccess)` | Creates invoice + toast + calls callback |
| `processPayment(request, onSuccess)` | Records payment + toast + calls callback |
| `loadSummary()` | Fetches billing summary/stats |

### Component Changes

#### BillingSummaryComponent

```diff
- [data]="invoices"
+ [data]="facade.invoices()"
+ [loading]="facade.loading()"
```

#### InvoiceGenerateComponent — mutation via facade

```diff
- this.billingService.createInvoice(request).subscribe(...)
+ this.facade.createInvoice(request, () => {
+   this.router.navigate(['/billing']);
+ });
```

#### PaymentReceiptComponent — payment via facade

```diff
- this.billingService.processPayment(request).subscribe(...)
+ this.facade.processPayment(request, () => {
+   this.loadInvoice(this.invoice!.id);
+ });
```
