import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  city: string;
  acceptPrivacyPolicy: boolean;
  teamId: number;
  team: string;
}


interface Team {
  teamID: number;
  teamName: string;
  users: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'https://localhost:7094/api/Team'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  addTeam(team: Team): Observable<any> {
    return this.http.post(`${this.apiUrl}`, team, {
      headers: this.getAuthHeaders()
    });
  }

  updateTeam(id: number, team: Team): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateTeam/${id}`, team, {
      headers: this.getAuthHeaders()
    });
  }

deleteTeam(teamID: number): Observable<any> {
  console.log('Calling DELETE on teamID:', teamID);
  return this.http.delete(`${this.apiUrl}/${teamID}`, {
    headers: this.getAuthHeaders()
  });
}


}
