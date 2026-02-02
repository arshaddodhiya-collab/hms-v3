# Angular Frontend — Best Practices (Recommendations for arshaddodhiya-collab/hms-v3)

This document collects pragmatic best-practices, patterns and concrete actions tailored for an Angular project (TypeScript + HTML + SCSS). Use it as a checklist and a guide when improving code quality, reliability, performance, and developer experience.

---
## Table of contents
- Goals
- Project structure & modules
- TypeScript & Angular compiler settings
- Components, templates & change detection
- Services, dependency injection & state
- RxJS & async patterns
- Forms & validation
- HTTP, interceptors & error handling
- Routing & lazy loading
- Styling (SCSS) & UI conventions
- Testing (unit & e2e)
- Tooling, linting & CI
- Performance & bundle size
- Security & privacy
- Accessibility & i18n
- Deployment & environment management
- Suggested short-term tasks / checklist

---

## Goals
- Fast, maintainable, testable code.
- Predictable data flows and minimal memory leaks.
- Small production bundles and fast startup.
- Consistent styling and accessible UI.
- Reliable CI pipeline that enforces quality gates.

---

## Project structure & modules
- Use a feature-based structure for medium/large apps:
  - src/app/
    - core/          (singleton services, guards, interceptors)
    - shared/        (presentational components, pipes, directives)
    - features/      (feature folders each with routing)
    - assets/, environments/
- Keep CoreModule for singletons (import once in AppModule).
- Keep SharedModule with only declarables (components, pipes, directives) and no providers; import SharedModule in feature modules.
- Use barrel files (`index.ts`) sparingly — prefer explicit imports for readability and easier refactors.
- Keep public API surface for libraries or modules concise.

---

## TypeScript & Angular compiler settings
- Enable strict TypeScript and Angular template checks:
  - tsconfig.json: `"strict": true`
  - angularCompilerOptions in tsconfig.app.json:
    - `"strictTemplates": true`
    - `"fullTemplateTypeCheck": true`
- Turn on `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`.
- Enable `emitDecoratorMetadata` only if needed; prefer latest Angular CLI defaults.
- Keep Type definitions for API responses and domain models.

---

## Components, templates & change detection
- Prefer smart/container vs presentational components separation:
  - Container components handle data and pass to dumb components via inputs.
- Use OnPush change detection for presentational components to reduce checks:
  - `changeDetection: ChangeDetectionStrategy.OnPush`.
- Use the `async` pipe in templates to subscribe to Observables. Avoid manual subscribe in templates.
- Avoid expensive expressions in templates; compute in component or use pure pipes.
- Use `trackBy` on `*ngFor` to avoid unnecessary re-rendering:
  - Provide a stable id-based trackBy function.
- Keep component methods small and side-effect free. Avoid calling functions repeatedly from templates.

---

## Services, dependency injection & state
- Use constructor injection; make service dependencies `private readonly`.
- Keep service responsibilities single-purpose: data access, mapping, caching.
- Use a Core/Api service layer to centralize HTTP calls and mapping to domain models.
- For global state, pick a strategy:
  - NgRx (recommended for complex apps with many interactions)
  - ComponentStore (lightweight and great for feature-level state)
  - Akita / NGXS (if preferred by team)
- Use selectors and memoization for derived state rather than recomputing in components.

---

## RxJS & async patterns
- Prefer Observables over Promises for streams.
- Use `async` pipe to handle subscriptions in templates.
- Avoid manual subscribe/unsubscribe; if subscribing in code, use patterns:
  - `takeUntil(this.destroy$)` with `this.destroy$.next()` in ngOnDestroy
  - or use `firstValueFrom` / `lastValueFrom` when you need a single-shot Promise
- Use operator best-practices:
  - `switchMap` for dependent requests (cancel previous)
  - `mergeMap` for concurrent operations
  - `concatMap` when order matters
  - `exhaustMap` for ignoring new emissions while one is running (e.g., login)
- Use `shareReplay({ refCount: true, bufferSize: 1 })` for caching network calls, but be cautious with memory leaks.
- Prefer explicit typing for Observables: `Observable<User[]>` not just `any`.

---

## Forms & validation
- Prefer Reactive Forms for complex forms; Template forms are ok for simple UIs.
- Keep validation logic in validators (custom validators as separate functions).
- Surface validation messages consistently via a reusable component or directive.
- Do not rely only on client-side validation—always validate on server.

---

## HTTP, interceptors & error handling
- Centralize HTTP concerns in services and leverage interceptors for cross-cutting:
  - AuthInterceptor (add tokens), ErrorInterceptor (global error mapping), Retry/Caching interceptors.
- Keep API calls typed and map raw DTOs to app domain models in service layer.
- Handle errors gracefully; return user-friendly errors and log details for debugging.
- Implement exponential backoff/retry for idempotent calls if needed (RxJS retryWhen).
- Use HTTP caching (ETag, cache-control) or client-side caches only when safe.

---

## Routing & lazy loading
- Use lazy-loaded feature modules for large routes to reduce initial bundle size:
  - { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) }
- Use route guards (CanActivate/CanLoad) to protect routes; prefer CanLoad for preventing module download if unauthorized.
- Use preloading strategies for background loading (PreloadAllModules or custom).
- Keep route config declarative and simple.

---

## Styling (SCSS) & UI conventions
- Use component-scoped styles (Angular default emulated view encapsulation) and global theme variables in `styles.scss`.
- Maintain a design token file (colors, spacing, typography) as SCSS variables or CSS custom properties.
- Prefer BEM-like naming for global CSS, avoid deep nesting (> 3).
- Avoid duplicate styles—extract reusable mixins and utility classes.
- Keep CSS selectors specific but not brittle.
- Use image optimization and CDN for large assets.

---

## Testing (unit & e2e)
- Unit tests:
  - Use Jest or Karma + Jasmine. Jest offers faster iteration.
  - Test components with TestBed or shallow testing (Spectator).
  - Mock HTTP with HttpTestingController.
  - Aim for meaningful coverage of logic: services, pipes, guards, and edge cases.
- Integration tests:
  - Use TestBed and real modules for integration of services and components.
- E2E tests:
  - Prefer Cypress over Protractor (deprecation). Automate critical flows (login, core CRUD).
- Run tests locally and in CI. Fail builds on test breakages.

---

## Tooling, linting & CI
- Linting/formatting:
  - ESLint with Angular plugin (no TSLint).
  - Prettier for formatting, integrate with ESLint (`eslint-config-prettier`).
  - Enforce via CI.
- Pre-commit hooks:
  - Husky + lint-staged to run `eslint --fix` and `prettier --write` on staged files.
- Dependency management:
  - Dependabot or Renovate for dependency updates.
  - Regularly audit `npm audit` and patch critical vulnerabilities.
- CI pipeline:
  - Steps: install → lint → build (AOT) → unit tests → e2e (separate job) → analyze bundles.
  - Use caching (npm/yarn) to speed builds.

---

## Performance & bundle size
- Build with AOT and production flags: `ng build --configuration production` (AOT, optimization, file hashing).
- Use lazy-loading for feature modules.
- Use component-level OnPush change detection.
- Use `cdk-virtual-scroll-viewport` for long lists.
- Avoid polyfills that aren't needed; target modern browsers when possible.
- Analyze bundles with `source-map-explorer` or `webpack-bundle-analyzer`.
- Use image optimization (responsive images, webp), preloading critical fonts, and compress responses (gzip/ Brotli) on server/CDN.

---

## Security & privacy
- Never store sensitive tokens in localStorage unless you accept XSS risk—prefer HttpOnly cookies for auth tokens.
- Sanitize user-provided HTML (avoid bypassSecurityTrust unless necessary and audited).
- Use Content Security Policy (CSP) headers from the backend.
- Keep dependencies updated; run SCA tools (Snyk).
- Avoid exposing debug information in production builds.
- Escape and validate on both client and server.

---

## Accessibility & i18n
- Follow WCAG basics: semantic HTML, keyboard navigation, focus management, color contrast.
- Use ARIA only when semantic HTML is insufficient.
- Use Angular i18n or `ngx-translate` for multi-language apps; externalize strings from templates.
- Test with screen readers and keyboard-only navigation.

---

## Deployment & environment management
- Use `environments/*.ts` for compile-time environment values and externalize secrets at runtime when possible.
- Use Docker multi-stage builds for reproducible artifacts.
- Serve static assets via CDN, set cache headers, and use cache-busting via filename hashing.
- Consider server-side rendering (Angular Universal) for SEO and first-render performance if needed.
- Add health checks and monitoring hooks.

---

## Suggested short-term tasks / checklist (actionable)
- [ ] Enable TypeScript strict mode and strict templates.
- [ ] Add ESLint + Prettier + Husky + lint-staged to enforce style on commit.
- [ ] Convert legacy template bindings to `async` pipe and remove manual subscriptions.
- [ ] Set OnPush on presentational components and add `trackBy` for ngFor lists.
- [ ] Introduce a CoreModule and SharedModule if not already present; move singleton services to Core.
- [ ] Add typed API service layer (DTO -> domain model mappers).
- [ ] Add global HTTP interceptors for auth and error handling.
- [ ] Add lazy loading for all major feature modules and set a preload strategy.
- [ ] Integrate CI pipeline that runs lint → build → test and fails on problems.
- [ ] Add bundle-size check step in CI and run bundle analysis locally.
- [ ] Start migrating unit tests to Jest (optional) for performance and DX.
- [ ] Add Cypress e2e tests for critical user journeys.

---

## Example patterns / snippets
Use `async` pipe (preferred):
```html
<!-- template -->
<ul>
  <li *ngFor="let user of users$ | async; trackBy: trackById">
    {{ user.name }}
  </li>
</ul>
```

`trackBy` example:
```ts
trackById(_: number, item: { id: string }) {
  return item.id;
}
```

Safe subscription pattern:
```ts
export class MyComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  data$ = this.service.getData().pipe(takeUntil(this.destroy$));

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

HTTP interceptor skeleton:
```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.token;
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(authReq);
  }
}
```

---

## Final notes
- Prioritize the practices that give you the highest ROI first: strict typing, `async`/unsubscribe patterns, OnPush, lazy-loading, and CI checks.
- Balance new tools (NgRx, Jest) against team familiarity and project complexity.
- If you want, I can:
  - Generate a concrete PR to enable strict template checks and ESLint.
  - Produce a starter `AuthInterceptor` + `ErrorInterceptor`.
  - Create a Jest + Cypress migration plan and CI job examples.

References (official docs):
- Angular style guide: https://angular.io/guide/styleguide
- Angular CLI production builds: https://angular.io/cli/build
- RxJS best practices: https://rxjs.dev/guide/overview
