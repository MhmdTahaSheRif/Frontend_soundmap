import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.router.navigate(['/not-found']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (role === 'Admin') {
        return true;
      } else {
        this.router.navigate(['/not-found']);
        return false;
      }
    } catch (err) {
      this.router.navigate(['/not-found']);
      return false;
    }
  }
}
