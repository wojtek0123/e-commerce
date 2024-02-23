import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { NgIf } from '@angular/common';

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
  styleUrls: ['./feature-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRegisterComponent {}
