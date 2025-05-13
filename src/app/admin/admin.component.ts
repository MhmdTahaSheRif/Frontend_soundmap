import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Users
  unapprovedUsers: any[] = [];
  loading = false;
  error: string | null = null;

  // Categories
  categories: any[] = [];
  newCategoryName = '';
  editCategory: any = null;

  // Topics
  topics: any[] = [];
  newTopic: any = {
    topicTitle: '',
    topicSubTitle: '',
    topicContent: '',
    topicAddedDate: '',
    topicImagePath: '',
    categoryId: 0
  };
  editTopic: any = null;
  ccc: any = null;
  selectedSection: string = ''; 
approvedUsers: any;
  confirmedSounds: any[] | undefined;
  unconfirmedSounds: any[] | undefined;
  playingAudio: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
        this.getUnconfirmedSounds();
    this.getConfirmedSounds();
    this.getUnapprovedUsers();
    this.getCategories();
    this.getTopics();
      this.loadCategories();
      this.getAllActiveUsers();
  }
  loadCategories() {
  this.http.get<any[]>('https://localhost:7094/api/Categories/GetAllCategories')
    .subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Loaded categories:', data); // ✅ Check this in the browser console
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
}
  editTopicData(t: any) {
    this.editTopic = { ...t };
  }
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }
  

  // === Users ===
  getUnapprovedUsers(): void {
    this.loading = true;
    this.http.get<any[]>('https://localhost:7094/api/admin/unapproved-users', this.getAuthHeaders())
      .subscribe({
        next: data => {
          this.unapprovedUsers = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to load users.';
          this.loading = false;
        }
      });
  }
  

getAllActiveUsers(): void {
  const authToken = localStorage.getItem('authToken'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  this.http.get<any[]>(`https://localhost:7094/api/admin/GetAllActiveUsers`, { headers })
    .subscribe(users => {
      // Attach default selectedRole if needed
      this.approvedUsers = users.map(user => ({ ...user, selectedRole: '' }));
    });
}

selectedUserId: string = '';
selectedRole: string = '';

assignRoleToSelectedUser(): void {
  if (!this.selectedUserId || !this.selectedRole) {
    alert('Please select both a user and a role.');
    return;
  }

  const authToken = localStorage.getItem('authToken');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  const body = {
    userId: this.selectedUserId,
    roleName: this.selectedRole
  };

  this.http.post(`https://localhost:7094/assign-role`, body, { headers })
    .subscribe({
      next: (response: any) => {
        alert(response.message || 'Role assigned successfully.');
        this.selectedUserId = '';
        this.selectedRole = '';
      },
      error: (error) => {
        console.error('Error assigning role:', error);
        alert('Failed to assign role.');
      }
    });
}

 approveUser(): void {
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  this.http.post(`https://localhost:7094/api/admin/approve-user/${userId}`, {}, { headers })
    .subscribe(() => this.getUnapprovedUsers());
}



unapproveUser(): void {
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  this.http.post(`https://localhost:7094/api/admin/unapprove-user/${userId}`, {}, { headers })
    .subscribe(() => this.getUnapprovedUsers());
}



  addCategory(): void {
    const body = { id: 0, categoryName: this.newCategoryName };
    this.http.post('https://localhost:7094/api/Categories', body, this.getAuthHeaders())
      .subscribe(() => {
        this.newCategoryName = '';
        this.getCategories();
      });
  }
  
  updateCategory(): void {
    this.http.put(`https://localhost:7094/api/Categories/${this.editCategory.id}`, this.editCategory, this.getAuthHeaders())
      .subscribe(() => {
        this.editCategory = null;
        this.getCategories();
      });
  }
  
  deleteCategory(id: number): void {
    this.http.delete(`https://localhost:7094/api/Categories/${id}`, this.getAuthHeaders())
      .subscribe(() => this.getCategories());
  }
  
  // === Topics ===

  getTopics(): void {
    this.http.get<any[]>('https://localhost:7094/api/Topics/GetAllTopics', this.getAuthHeaders())
      .subscribe(data => this.topics = data);
  }
  

  addTopic(): void {
  const formData = new FormData();
  formData.append('Id', '0'); 
  formData.append('TopicTitle', this.newTopic.topicTitle);
  formData.append('TopicSubTitle', this.newTopic.topicSubTitle);
  formData.append('TopicContent', this.newTopic.topicContent);
  formData.append('TopicAddedDate', this.newTopic.topicAddedDate);
  formData.append('TopicImagePath', this.newTopic.topicImagePath);
  formData.append('CategoryId', this.newTopic.categoryId.toString());

  if (this.selectedImageFile) {
    formData.append('TopicImage', this.selectedImageFile, this.selectedImageFile.name);
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
  });

  this.http.post('https://localhost:7094/api/Topics/addTopic', formData, { headers })
    .subscribe({
      next: () => {
        alert('Topic added successfully');
        this.getTopics(); 
        this.newTopic = {
          topicTitle: '',
          topicSubTitle: '',
          topicContent: '',
          topicAddedDate: '',
          topicImagePath: '',
          categoryId: 0
        };
        this.selectedImageFile = null;
      },
      error: (err) => {
        console.error('Failed to add topic', err);
        alert('Failed to add topic');
      }
    });
}
  getCategories() {
    this.http.get<any[]>('https://localhost:7094/api/Categories/GetAllCategories')
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
        }
      });
  }
selectedImageFile: File | null = null;
onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
  }
}

  updateTopic(): void {
    this.http.put(`https://localhost:7094/api/Topics/${this.editTopic.id}`, this.editTopic, this.getAuthHeaders())
      .subscribe(() => {
        this.editTopic = null;
        this.getTopics();
      });
  }
  
  getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  // Fetch both confirmed and unconfirmed sounds
  loadSounds(): void {
    this.http.get<any[]>('https://localhost:7094/api/Sound/confirmed', this.getHeaders())
      .subscribe(data => this.confirmedSounds = data);

    this.http.get<any[]>('https://localhost:7094/api/Sound/unconfirmed', this.getHeaders())
      .subscribe(data => this.unconfirmedSounds = data);
  }



  // Delete a sound from the server
  deleteSound(id: string): void {
    this.http.delete(`https://localhost:7094/api/Sound/${id}`, this.getHeaders())
      .subscribe(() => this.loadSounds());
  }

  // Play the sound
  playSound(path: string): void {
    if (this.playingAudio) {
      this.playingAudio.pause();
    }
    this.playingAudio = new Audio(path);
    this.playingAudio.play();
  }

  // Delete a topic (for topic management)
  deleteTopic(id: number): void {
    this.http.delete(`https://localhost:7094/api/Topics/${id}`, this.getHeaders())
      .subscribe(() => this.loadSounds());
  }

  private apiUrl = 'https://localhost:7094/api/Sound'; // Your API endpoint

getUnconfirmedSounds(): void {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    this.http.get<any[]>(`${this.apiUrl}/unconfirmed`, { headers })
      .subscribe(
        (data) => {
          this.unconfirmedSounds = data.filter(sound => !sound.isDeleted); // Filter out deleted sounds
        },
        (error) => {
          console.error('Error fetching unconfirmed sounds:', error);
        }
      );
  }

  // Get confirmed sounds, excluding deleted ones
  getConfirmedSounds(): void {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    this.http.get<any[]>(`${this.apiUrl}/confirmed`, { headers })
      .subscribe(
        (data) => {
          this.confirmedSounds = data.filter(sound => !sound.isDeleted); // Filter out deleted sounds
        },
        (error) => {
          console.error('Error fetching confirmed sounds:', error);
        }
      );
  }

  // Confirm sound action
  confirmSound(id: string): void {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    this.http.post(`${this.apiUrl}/confirm/${id}`, {}, { headers })
      .subscribe(
        (response) => {
          console.log('Sound confirmed:', response);
          this.getUnconfirmedSounds(); // Refresh the list
          this.getConfirmedSounds();   // Refresh the list
        },
        (error) => {
          console.error('Error confirming sound:', error);
        }
      );
  }

  // Unconfirm sound action
  unconfirmSound(id: string): void {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    this.http.post(`${this.apiUrl}/unconfirm/${id}`, {}, { headers })
      .subscribe(
        (response) => {
          console.log('Sound unconfirmed:', response);
          this.getUnconfirmedSounds(); // Refresh the list
          this.getConfirmedSounds();   // Refresh the list
        },
        (error) => {
          console.error('Error unconfirming sound:', error);
        }
      );
  }
}
