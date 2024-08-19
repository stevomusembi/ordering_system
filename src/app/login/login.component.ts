import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  userEmail = 'admin@admin.com';
  userPassword= 'admin@123'
  error = false;

  ngOnInit(): void {
  }


  constructor(private fb: FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted', this.loginForm.value);
      if(this.loginForm.value.email === this.userEmail && this.loginForm.value.password === this.userPassword){
        this.router.navigate(['dashboard']);
      } else {
        this.error = true;
      }
    }
  }

  togglePasswordVisibility() {
    console.log(this.hidePassword);
    this.hidePassword = !this.hidePassword;
  }
}


