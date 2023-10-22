import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RegisterFormComponent } from './register-form/register-form.component';
import { Store } from '@ngrx/store';
import { LoginFormComponent } from './login-form/login-form.component';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';

@Component({
  selector: 'e-commerce-client-web-app-auth-feature-register',
  standalone: true,
  imports: [
    RegisterFormComponent,
    LoginFormComponent,
    ButtonModule,
    TabMenuModule,
    NgIf,
  ],
  templateUrl: './feature-register.component.html',
  styleUrls: ['./feature-register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRegisterComponent implements OnInit {
  private store = inject(Store);
  private router = inject(ActivatedRoute);

  ngOnInit() {
    console.log();
    this.store.dispatch(authActions.init());
  }
}
