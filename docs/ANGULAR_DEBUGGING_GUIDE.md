# 🐞 Ultimate Angular Debugging Guide

This guide covers everything you need to know to debug Angular applications effectively, from basic logging to advanced performance profiling.

---

## 1. 🛠️ Essential Tools

### Chrome DevTools (F12)
Your primary workspace.
- **Console**: View logs and run JavaScript.
- **Sources**: Set breakpoints in TypeScript code.
- **Network**: Monitor API calls.
- **Elements**: Inspect the DOM and CSS.

### Angular DevTools (Extension)
*Must-have Chrome Extension.*
- **Components Tab**: View the Angular Component Tree (logical structure, not just DOM).
- **Properties**: See the real-time state (`@Input`, properties) of any selected component.
- **Profiler**: Record and analyze change detection cycles to find performance bottlenecks.

---

## 2. 📝 Console Debugging (The Basics)

### Smart Logging
Don't just print the variable. Print the *name* and the variable to avoid confusion.

```typescript
// ❌ Bad
console.log(this.user); 

// ✅ Good (Object expansion)
console.log('[Dashboard] User:', this.user); 

// ✅ Best (Table format for arrays)
console.table(this.patients);
```

### Keeping it Clean
- **`console.warn('Warning message')`**: Prints in yellow. Good for deprecated methods.
- **`console.error('Error!')`**: Prints in red with a stack trace.
- **`console.group('Loading Data')`** / **`console.groupEnd()`**: Groups logs together comfortably.

---

## 3. 🛑 Visual Debugging (Breakpoints)

**Stop relying on console.log!** Use breakpoints to freeze the code and inspect everything.

### How to use Source Maps
1. Open DevTools (**F12**) -> **Sources** tab.
2. Press **Ctrl+P** (cmd+P on Mac).
3. Type the file name (e.g., `consultation-detail.component.ts`).
4. **Click the line number** (e.g., line 45) to set a blue marker.
5. Trigger the action in the UI.

**Result**: The browser will PAUSE execution.
- Hover over any variable to see its *current* value.
- Use the **Step Over** (F10) button to go line-by-line.
- Use the **Console** tab *while paused* to type variables and test expressions.

### The `debugger` Keyword
You can also hard-code a breakpoint.
```typescript
saveDiagnosis() {
  const data = this.form.value;
  debugger; // <--- Code will ALWAYS pause here if DevTools is open
  this.service.save(data);
}
```

---

## 4. 📄 Template Debugging (HTML)

Sometimes variables don't show up in the UI. Here's how to check what the template "sees".

### The JSON Pipe
Dump the entire object into the view as text.
```html
<!-- Debugging: See the full object -->
<pre>{{ currentEncounter | json }}</pre>

<div *ngIf="currentEncounter">
  ... content ...
</div>
```

### Debugging Click Events
Log directly from the HTML to verify the button works.
```html
<button (click)="console.log('Button Clicked!', $event)">Save</button>
```

---

## 5. 🌊 RxJS Debugging (Observables)

Debugging async streams is tricky. Use the `tap` operator to "spy" on the stream without changing it.

```typescript
import { tap } from 'rxjs/operators';

this.patientService.getPatients().pipe(
  // 🔍 Spy here
  tap(data => console.log('1. API Data Received:', data)),
  
  map(patients => patients.filter(p => p.active)),
  
  // 🔍 Spy again after modification
  tap(filtered => console.log('2. Filtered Data:', filtered))
).subscribe();
```

---

## 6. 🌐 Network Debugging (APIs)

If data isn't loading, check the communication line.

1. Open DevTools -> **Network** Tab.
2. Filter by **Fetch/XHR**.
3. Trigger the request.
4. Click the request name (e.g., `patients`).
    - **Payload/Header**: Did you send the right data? (Check Token, Body).
    - **Preview/Response**: Did the server send the right data?
    - **Status**: 
        - `200`: OK.
        - `401`: Unauthorized (Fix your Token).
        - `404`: Wrong URL.
        - `500`: Server crashed.

---

## 7. 🕵️ Advanced: Finding "Who Called Me?"

If a function is running and you don't know *why*:

```typescript
ngOnChanges() {
  console.trace('Who triggered changes?');
}
```
This prints a full **Stack Trace** in the console, showing exactly which function called this one, all the way back to the button click or init.

---

## 8. 🚨 Common Angular Errors

### `ExpressionChangedAfterItHasBeenCheckedError`
- **Cause**: You changed a value (like `isLoading`) *after* Angular finished rendering the view but *before* it finished checking.
- **Fix**: Move the code to `ngAfterViewInit` or wrap in `setTimeout`.

### `Can't bind to 'x' since it isn't a known property of 'y'`
- **Cause**: You forgot to import the Module (e.g., `FormsModule` for `ngModel`).
- **Fix**: Check your `app.module.ts` or feature module imports.

### `NullInjectorError: No provider for X`
- **Cause**: You injected a Service but didn't provide it.
- **Fix**: Add `@Injectable({ providedIn: 'root' })` to the service, or add it to the `providers: []` array in the module.
