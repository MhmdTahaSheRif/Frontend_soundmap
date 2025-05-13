import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  captchaCode: string = '';
  
  teams: { id: number; name: string }[] = [
    { id: 1, name: 'Team1' },
    { id: 2, name: 'Team2' },
    { id: 3, name: 'Team3' },
    { id: 4, name: 'Team4' },
    { id: 5, name: 'Team5' },
    { id: 6, name: 'Team6' },
    { id: 7, name: 'Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      teamId: ['', [Validators.required]],
      role: ['UniversityStudent', Validators.required],
      address: [''],
      organization: [''],
      zipCode: [''],
      city: [''],
      antiSpamCode: ['', [Validators.required]], 
      AcceptedPrivacyPolicy: [false, Validators.requiredTrue]
    }, { validators: this.matchFields });
    
    
    this.generateCaptchaCode();
  }

  validateCaptcha(): boolean {
    const userInput = this.registerForm.get('antiSpamCode')?.value;
    return userInput === this.captchaCode;
  }
  
  generateCaptchaCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789';
    let result = '';
    const letterLength = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < letterLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    result += Math.floor(Math.random() * 90 + 10);
    this.captchaCode = result;
  
    if (this.registerForm) {
      this.registerForm.get('antiSpamCode')?.setValue('');
    }
  }
  
  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  matchFields(form: FormGroup) {
    const email = form.get('email');
    const confirmEmail = form.get('confirmEmail');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
  
    if (email && confirmEmail && email.value !== confirmEmail.value) {
      confirmEmail.setErrors({ ...(confirmEmail.errors || {}), emailMismatch: true });
    } else if (confirmEmail?.hasError('emailMismatch')) {
      const errors = { ...confirmEmail.errors };
      delete errors['emailMismatch'];
      confirmEmail.setErrors(Object.keys(errors).length ? errors : null);
    }
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ ...(confirmPassword.errors || {}), passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }
  }
  
  
  register() {
    console.log('Registering...');
    
    if (this.registerForm.invalid) {
      console.log('Form validation failed:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (!this.validateCaptcha()) {
      this.registerForm.get('antiSpamCode')?.setErrors({ captchaInvalid: true });
      this.generateCaptchaCode();
      return;
    }
    
    const formData = { ...this.registerForm.value, teamId: Number(this.registerForm.value.teamId) };
    console.log('Submitting JSON:', JSON.stringify(formData, null, 2));
    
    // Use the auth service instead of direct HTTP call
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.registrationError = error.message;
        this.generateCaptchaCode();
      }
    });
  }
  
  registrationError: string | null = null;
}