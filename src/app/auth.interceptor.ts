import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken'); // ✅ Retrieve token from localStorage

    if (token) {
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` } // ✅ Attach token to request
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
