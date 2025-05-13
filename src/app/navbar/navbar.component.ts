import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule,HttpClientModule],  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isDropdownVisible: boolean = false;
  languages: string[] = ['English', 'Arabic', 'French', 'Spanish', 'German'];
  selectedLanguage: string | null = null;
  isLoggedIn: boolean = false;
  isAdmin = false;

  constructor(private router: Router,private http: HttpClient) {}

  ngOnInit(): void {
      this.getProfile();

    this.checkLoginStatus();
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!userId; 
    if (token) {
      this.isLoggedIn = true;
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (
        payload.role === 'Admin' ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
      ) {
        this.isAdmin = true;

      }
    }
  }
  getProfile() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found');
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.get('https://localhost:7094/profile', { headers }).subscribe({
    next: (data) => {
      console.log('Profile:', data);
    },
    error: (err) => {
      console.error('Error fetching profile:', err);
    }
  });
}
  showAdminPanel(): void {
    this.router.navigate(['/admin']);
  }
  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }
  logout(): void {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (confirmSignOut) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      this.isLoggedIn = false;
      this.router.navigate(['/register']); 
      window.location.reload();
    }
  }

  
  toggleLanguageDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }



  selectLanguage(language: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedLanguage = language;
    this.isDropdownVisible = false;
  }
}
