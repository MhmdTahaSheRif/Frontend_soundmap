import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-contentus',
  imports: [CommonModule,
    ReactiveFormsModule,
    HttpClientModule,],
  templateUrl: './contentus.component.html',
  styleUrl: './contentus.component.css'
})

export class ContentusComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.contactForm = this.createForm(); // Safe to call here
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
      consent: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.success = false;
    this.error = '';

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.submitted = false;
      this.contactForm.reset();
    }, 1500);
  }
}
