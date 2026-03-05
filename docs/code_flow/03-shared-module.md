# 03 — Shared Module

> **Path**: `src/app/shared/`
> **Import**: `SharedModule` — imported by `AppModule` and all feature modules

The Shared module contains reusable components, directives, and re-exports common Angular and PrimeNG modules so feature modules don't need to import them individually.

---

## Module Structure (`shared.module.ts`)

The SharedModule:
1. **Declares** custom components and directives
2. **Imports** PrimeNG modules and Angular common modules
3. **Exports** everything for use in feature modules

---

## Custom Components

### `SidebarComponent` (`components/sidebar/`)

**Selector**: `<app-sidebar>`

The main application navigation sidebar. It dynamically builds a menu tree based on the current user's permissions.

**Key behaviors:**
1. On init, subscribes to `AuthService.currentUser$` to reload menu when user changes
2. Calls `filterMenu()` to recursively remove menu items the user lacks permission for
3. Tracks `expandedMenus` state for collapsible parent groups
4. Auto-expands parent group if a child route is active
5. Provides logout functionality

**Permission filtering flow:**
```
MENU_CONFIG (full menu tree)
    │
    └── filterMenu() recursively:
        ├── Filter: authService.hasPermission(item.permission)
        ├── Map: If item has children, recursively filter them
        └── Filter: Remove parent groups with no visible children
    │
    └── Rendered menu (only permission-allowed items)
```

---

### `PageHeaderComponent` (`components/page-header.component.ts`)

**Selector**: `<app-page-header>`

Standardized page title component used at the top of feature views.

---

### `TableComponent` (`components/table.component.ts`)

**Selector**: `<app-table>`

Wrapper around PrimeNG's `p-table` with standardized styling and behavior.

---

### `StatusBadgeComponent` (`components/status-badge.component.ts`)

**Selector**: `<app-status-badge>`

Color-coded status tag component. Maps status strings (SCHEDULED, COMPLETED, etc.) to colored PrimeNG badges.

---

### `ConfirmDialogComponent` (`components/confirm-dialog.component.ts`)

**Selector**: `<app-confirm-dialog>`

Reusable confirmation dialog for delete/cancel actions.

---

### `ValidationMessageComponent` (`components/validation-message/`)

**Selector**: `<app-validation-message>`

Displays form validation error messages beneath form controls.

---

### `VoiceHudComponent` (`components/voice-hud/`)

**Selector**: `<app-voice-hud>`

Floating voice control widget visible on all pages (rendered in `app.component.html`). Provides a heads-up display for voice navigation commands.

---

### `DropdownComponent` (`components/dropdown.component.ts`)

**Selector**: `<app-dropdown>`

Standardized wrapper around PrimeNG's dropdown.

---

### `CardComponent` (`components/card.component.ts`)

**Selector**: `<app-card>`

Reusable card wrapper component.

---

### `InputTextComponent` (`components/input-text.component.ts`)

**Selector**: `<app-input-text>`

Standardized text input wrapper.

---

## Directives

### `HasPermissionDirective` (`directives/has-permission.directive.ts`)

**Selector**: `*appHasPermission`

A **structural directive** that conditionally renders DOM elements based on user permissions.

**Usage:**
```html
<button *appHasPermission="'CMP_PATIENT_ADD'">Register Patient</button>
```

**How it works:**
1. On init, subscribes to `AuthService.currentUser$`
2. When user changes, calls `updateView()`
3. `updateView()` checks `authService.hasPermission(this.permission)`
   - If has permission AND view not yet created → Create embedded view
   - If lacks permission AND view exists → Clear the view container
4. On destroy, unsubscribes to prevent memory leaks

**Flow:**
```
User logs in → currentUser$ emits → HasPermissionDirective.updateView()
    │
    ├── authService.hasPermission('CMP_PATIENT_ADD') → true
    │   └── viewContainer.createEmbeddedView(templateRef)
    │       → Button appears in DOM
    │
    └── authService.hasPermission('CMP_PATIENT_ADD') → false
        └── viewContainer.clear()
            → Button removed from DOM
```

---

### `VoiceInputDirective` (`directives/voice-input.directive.ts`)

**Selector**: `[appVoiceInput]`

Enables voice-to-text input on form fields using the Web Speech API.

---

## Re-exported PrimeNG Modules

The SharedModule imports and re-exports 23 PrimeNG modules so feature modules get them automatically:

| Module | Component | Usage |
|--------|-----------|-------|
| `ButtonModule` | `p-button` | Action buttons |
| `InputTextModule` | `pInputText` | Text inputs |
| `CardModule` | `p-card` | Card containers |
| `ToastModule` | `p-toast` | Toast notifications |
| `TableModule` | `p-table` | Data tables |
| `DialogModule` | `p-dialog` | Modal dialogs |
| `MenuModule` | `p-menu` | Dropdown menus |
| `SidebarModule` | `p-sidebar` | Slide-out panels |
| `AvatarModule` | `p-avatar` | User avatars |
| `BadgeModule` | `p-badge` | Notification badges |
| `TagModule` | `p-tag` | Status tags |
| `ToolbarModule` | `p-toolbar` | Action toolbars |
| `RippleModule` | `pRipple` | Ripple effect |
| `TooltipModule` | `pTooltip` | Tooltip hovers |
| `DropdownModule` | `p-dropdown` | Select dropdowns |
| `CalendarModule` | `p-calendar` | Date pickers |
| `TabViewModule` | `p-tabView` | Tab containers |
| `InputTextareaModule` | `pInputTextarea` | Multiline inputs |
| `CheckboxModule` | `p-checkbox` | Checkboxes |
| `InputNumberModule` | `p-inputNumber` | Number inputs |
| `DividerModule` | `p-divider` | Section dividers |
| `ProgressSpinnerModule` | `p-progressSpinner` | Loading spinners |
| `ProgressBarModule` | `p-progressBar` | Progress indicators |
| `AutoCompleteModule` | `p-autoComplete` | Auto-complete inputs |
| `PanelModule` | `p-panel` | Collapsible panels |
| `AccordionModule` | `p-accordion` | Accordion panels |
| `ListboxModule` | `p-listbox` | List selection |

Also re-exports Angular common modules: `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `RouterModule`.
