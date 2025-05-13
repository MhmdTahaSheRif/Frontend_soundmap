import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
profileData: any = null;
constructor(private http:HttpClient){}
ngOnInit(): void {
  this.getProfile()
}
getProfile() {
  const token = localStorage.getItem('authToken');

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
      this.profileData = data; // 👈 Save profile data
    },
    error: (err) => {
      console.error('Error fetching profile:', err);
    }
  });
}


}
