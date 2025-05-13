import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm: FormGroup;
  showPassword = false;
  private apiUrl = 'https://localhost:7094/login';  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth:AuthService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

login() {
  if (this.loginForm.valid) {
    const credentials = this.loginForm.value;
    console.log('Credentials:', credentials); 
    
    this.auth.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/home']).then(() => {
          window.location.reload(); 
        }).catch((err) => {
          console.error('Navigation error:', err);
        });
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  } else {
    console.warn('Form is invalid', this.loginForm.errors);
  }
}

  
  
  
  
}  