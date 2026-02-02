# Dashboard User Guide

This guide explains how the Dashboard adapts to different staff roles. The system uses a **"Permission-First"** design, meaning you only see what you are allowed to see.

---

## 1. How It Works

Instead of building 5 different dashboards (one for each role), we built **One Smart Dashboard**.

- **Stats Cards**: The system checks your permissions list. If you have `MOD_BILLING`, you see Revenue. If not, that card is hidden.
- **Activity Log**: The table filters events. A Doctor sees clinical updates; a Receptionist sees payment updates.
- **Sidebar**: Menu items appear/disappear based on your access level.

---

## 2. Role-by-Role Breakdown

### 👮 Administrator (`admin`)

_The "Super User". Sees everything to manage the facility._

- **Stats Visible**:
  - 👥 Total Patients
  - 📅 Today's Appointments
  - 💰 Revenue (Today)
  - 🚑 Critical Care
- **Activity Feed**: All system events (Clinical, Billing, Admin actions).
- **Sidebar Access**: Full Menu.

### 👨‍⚕️ Doctor (`doctor`)

_Focused on patient care and medical records._

- **Stats Visible**:
  - 👥 Total Patients
  - 📅 Today's Appointments
  - 🚑 Critical Care (Triage)
- **Stats HIDDEN**: 💰 Revenue (Financials are private).
- **Activity Feed**:
  - New Consultations
  - Patient Registrations
  - Lab Results (for their patients)
- **Sidebar Access**: Dashboard, Patients, Appointments, Triage, Consultation.

### 👩‍⚕️ Nurse (`nurse`)

_Focused on vitals, wards, and patient status._

- **Stats Visible**:
  - 👥 Total Patients
  - 📅 Today's Appointments
  - 🚑 Critical Care
- **Stats HIDDEN**: 💰 Revenue, 🧪 Pending Labs.
- **Activity Feed**:
  - Emergency Vitals alerts
  - Patient Admissions/Registrations
- **Sidebar Access**: Dashboard, Patients, Appointments, Triage.

### 🧪 Lab Technician (`lab`)

_Focused strictly on test requests and results._

- **Stats Visible**:
  - 👥 Total Patients
  - 🧪 Pending Labs
- **Stats HIDDEN**: 📅 Appointments, 💰 Revenue, 🚑 Critical Care.
- **Activity Feed**:
  - New Lab Requests
  - Pending Results
- **Sidebar Access**: Dashboard, Lab, Patients (Basic View).

### 💁 Front Desk (`reception`)

_Focused on bookings, registration, and payments._

- **Stats Visible**:
  - 👥 Total Patients
  - 📅 Today's Appointments
  - 💰 Revenue
- **Stats HIDDEN**: 🧪 Pending Labs, 🚑 Critical Care (Clinical data).
- **Activity Feed**:
  - New Invoices Generated
  - New Appointments Booked
  - Patient Registrations
- **Sidebar Access**: Dashboard, Patients, Appointments, Billing.

---

## 3. Technical Implementation Summary

- **Permissions Source**: `src/app/core/config/mock-users.config.ts`
- **Logic**:
  - `StatsCardsComponent` filters an array of cards using `authService.hasPermission()`.
  - `TodayActivityComponent` filters rows of data using the same method.
- **Sidebar**: `SidebarComponent` filters `MENU_CONFIG` using the same method.
