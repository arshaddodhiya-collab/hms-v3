import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MockAuthService } from '../../features/auth/services/mock-auth.service';


@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('appHasPermission') permission: string = '';
  private subscription: Subscription = new Subscription();
  private isViewCreated = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: MockAuthService,
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(() => {
        this.updateView();
      }),
    );
  }

  private updateView() {
    const hasPermission = this.authService.hasPermission(this.permission);

    if (hasPermission && !this.isViewCreated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    } else if (!hasPermission && this.isViewCreated) {
      this.viewContainer.clear();
      this.isViewCreated = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
