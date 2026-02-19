# BaseFacade — Abstract Base Class

## What

An abstract class that provides **common signal patterns** reused by all module facades.

## Where

```
src/app/core/facades/base-facade.ts
```

## Why

Every facade needs the same core signals: `data`, `loading`, `saving`, `error`. Duplicating these across 6 facades would violate DRY. `BaseFacade<T>` provides them once with generic typing.

## How

### Signals Provided

| Signal       | Type               | Purpose                                      |
|--------------|--------------------|----------------------------------------------|
| `data`       | `Signal<T[]>`      | Primary data list for the module             |
| `loading`    | `Signal<boolean>`  | True while data is being fetched             |
| `saving`     | `Signal<boolean>`  | True while a mutation (create/update) runs   |
| `error`      | `Signal<string>`   | Error message from last failed operation     |
| `hasData`    | `Computed<boolean>` | Derived: `data().length > 0`                |

### Code

```typescript
import { signal, computed } from '@angular/core';

export abstract class BaseFacade<T> {
  readonly data = signal<T[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly hasData = computed(() => this.data().length > 0);
}
```

### Usage in Module Facades

```typescript
@Injectable({ providedIn: 'root' })
export class IpdFacade extends BaseFacade<Admission> {
  // Inherits: data, loading, saving, error, hasData
  // Add module-specific signals:
  readonly beds = signal<Bed[]>([]);
  readonly wards = signal<{ name: string; beds: Bed[] }[]>([]);
  ...
}
```

### Important Notes

- All module facades **extend** `BaseFacade` with the appropriate type
- `data` is the generic list signal — modules may rename/alias it via computed signals for clarity
- `saving` is separate from `loading` — this allows the UI to show a progress spinner on a submit button without blocking the entire page
