import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    // Credenciais de teste padrão (apenas para desenvolvimento)
    this.loginForm = this.fb.group({
      email: ['teste@exemplo.com', [Validators.required, Validators.email]],
      senha: ['senha123', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    // TODO: substituir pela chamada real à API de autenticação
    setTimeout(() => {
      this.isLoading = false;
      const email: string = this.loginForm.value.email;
      const nome = email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      this.auth.login({ nome, email });
    }, 1000);
  }

  get email() { return this.loginForm.get('email'); }
  get senha() { return this.loginForm.get('senha'); }
}
