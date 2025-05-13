import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private apiUrl = 'https://localhost:7094/api/Sound';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllSounds(): Observable<any[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateSound(formData: FormData, id: string) {
    return this.http.put(`${this.apiUrl}/update?id=${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteSound(id: string) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
