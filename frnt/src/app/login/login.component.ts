import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSignUp = false;
  errorMessage = '';
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email]],
      confirmPassword: ['']
    });
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
    this.loginForm.reset();
    this.errorMessage = '';
    
    if (this.isSignUp) {
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('email')?.clearValidators();
      this.loginForm.get('email')?.setValidators([Validators.email]);
      this.loginForm.get('confirmPassword')?.clearValidators();
    }
    
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      if (this.isSignUp) {
        // Sign up logic
        const { username, email, password } = this.loginForm.value;
        
        this.authService.signup(username, email, password).subscribe({
          next: () => {
            this.isLoading = false;
            // Success message and toggle to login
            alert('Registration successful! Please login.');
            this.isSignUp = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'Registration failed';
          }
        });
      } else {
        // Login logic
        const { username, password } = this.loginForm.value;
        
        this.authService.login(username, password).subscribe({
          next: () => {
            this.isLoading = false;
            // Redirect to dashboard after successful login
            window.location.href = `/app/search?username=${encodeURIComponent(username)}`;
            //this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'Login failed';
          } 
        });
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper methods for form validation
  get usernameInvalid(): boolean {
    const control = this.loginForm.get('username');
    return control ? control.invalid && control.touched : false;
  }

  get passwordInvalid(): boolean {
    const control = this.loginForm.get('password');
    return control ? control.invalid && control.touched : false;
  }

  get emailInvalid(): boolean {
    const control = this.loginForm.get('email');
    return control ? control.invalid && control.touched : false;
  }

  get confirmPasswordInvalid(): boolean {
    const control = this.loginForm.get('confirmPassword');
    const password = this.loginForm.get('password')?.value;
    const confirmPassword = control?.value;
    return (control?.touched && (control?.invalid || password !== confirmPassword)) || false;
  }
}