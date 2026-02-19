import { signal, computed } from '@angular/core';

/**
 * Abstract base class for all module facades.
 * Provides common Signal-based state patterns for loading, error, and data management.
 */
export abstract class BaseFacade<T> {
  // --- Core State Signals ---
  readonly data = signal<T[]>([]);
  readonly selectedItem = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // --- Computed Signals ---
  readonly hasData = computed(() => this.data().length > 0);
  readonly isEmpty = computed(
    () => !this.loading() && this.data().length === 0,
  );
  readonly count = computed(() => this.data().length);

  /** Subclasses must implement data loading logic */
  abstract load(): void;

  /** Select a single item for detail/edit views */
  select(item: T | null): void {
    this.selectedItem.set(item);
  }

  /** Clear current error */
  clearError(): void {
    this.error.set(null);
  }
}
