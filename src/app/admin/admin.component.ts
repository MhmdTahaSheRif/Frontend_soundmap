import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService, User } from '../team.service';
import { SoundService } from '../sound.service';
import { NgSelectModule } from '@ng-select/ng-select';

interface Team {
  teamId: number;
  teamName: string;
  users: any[];
}


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
alert(arg0: string) {
throw new Error('Method not implemented.');
}
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

  constructor(private http: HttpClient,private teamService:TeamService,private fb: FormBuilder,private soundService: SoundService) {  this.teamForm = this.fb.group({
      teamName: ['']
    });}
 teams: Team[] = [];


    ngOnInit(): void {
      this.loadSoundEffects();

      this.loadSounds1();
    
    this.getTeams();
    this.getAllUsers();
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
          this.getUnconfirmedSounds(); 
          this.getConfirmedSounds();  
        },
        (error) => {
          console.error('Error unconfirming sound:', error);
        }
      );
  }



  teamForm!: FormGroup;
  isEdit = false;
  selectedTeamId: number | null = null;
  availableUsers: User[] = [];

  allUsers: any[] = [];

  

getTeams() {
  this.http.get<any[]>('https://localhost:7094/api/Team', this.getAuthHeaders())
    .subscribe(res => this.teams = res);
}

getAllUsers() {
  this.http.get<any[]>('https://localhost:7094/api/admin/GetAllActiveUsers', this.getAuthHeaders())
    .subscribe(res => this.allUsers = res);
}

addTeam() {
  const body = {
    teamId: 0,
    teamName: this.teamForm.value.teamName,
    users: []
  };
  this.http.post('https://localhost:7094/api/Team', body, this.getAuthHeaders())
    .subscribe(() => {
      this.getTeams();
      this.teamForm.reset();
    }); window.location.reload(); 
}

deleteTeam(teamID: number) {
  if (!teamID) {
    console.error('teamID is undefined');
    return;
  }

  this.http.delete(`https://localhost:7094/api/Team/${teamID}`, this.getAuthHeaders())
    .subscribe({
      next: () => {
        console.log('Team deleted successfully');
        this.getTeams(); 
      },
      error: err => {
        console.error('Error deleting team:', err);
      }
    });  window.location.reload(); 
}

addUserToTeam(teamId: number, userId: string) {
  this.http.post(`https://localhost:7094/api/Team/${teamId}/AddUserToTeam/${userId}`, {}, this.getAuthHeaders())
    .subscribe(() => this.getTeams());
      window.location.reload(); 
}

  sounds: any[] = [];
  userId: string | null = null;
  selectedFile: File | null = null;
 map!: L.Map;
  marker!: L.Marker;
  isModalOpen = false;


loadSounds1(): void {
  this.soundService.getAllSounds1().subscribe({
    next: data => {
      console.log('API Data:', data);
      this.sounds = data.filter(s => !s.isDelete);  // Only filter deleted items
      console.log('Filtered Sounds:', this.sounds);
    },
    error: err => console.error('Error loading sounds:', err)
  });
}




  soundEffectsList: readonly any[] | null | undefined;


  onFileSelected1(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  selectedSound: any = {
    latitude: null,
    longitude: null,
    // other fields
  };



 
  ngAfterViewInit(): void {
      import('leaflet').then(L => this.initMap(L));
     }

  initMap(L: any) {
    // Default to some lat and lng, or use existing sound data
    const defaultLat = this.selectedSound.latitude || 51.505;
    const defaultLng = this.selectedSound.longitude || -0.09;

    // Initialize Leaflet map
    this.map = L.map('map').setView([defaultLat, defaultLng], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add marker at the current location
    this.marker = L.marker([defaultLat, defaultLng]).addTo(this.map);

    // Add event listener for click to set latitude and longitude
    this.map.on('click', (event: any) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      
      // Update the latitude and longitude in the form
      this.selectedSound.latitude = lat;
      this.selectedSound.longitude = lng;

      // Move marker to clicked location
      this.marker.setLatLng([lat, lng]);
    });
  }

loadSoundEffects() {
  this.http.get<any[]>('https://localhost:7094/api/SoundEffects').subscribe(
    data => this.soundEffectsList = data,
    error => console.error('Error fetching sound effects:', error)
  );
}

  openEditModal(sound: any): void {
    this.selectedSound = { ...sound };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSound = null;
    this.selectedFile = null;
  }
 latitude = 30.033333;
  longitude = 31.233334;

  

 deleteSound1(id: string): void {
  const confirmDelete = confirm('Are you sure you want to delete this sound?');
  if (!confirmDelete) return;

  this.soundService.deleteSound(id).subscribe({
    next: () => {
      this.sounds = this.sounds.filter(s => s.id !== id);
    },
    error: err => console.error('Error deleting sound:', err)
  });
}
saveEdit(): void {
  if (!this.selectedSound) return;

  const confirmSave = confirm('Are you sure you want to save changes to this sound?');
  if (!confirmSave) return;
  
  // Continue saving...
  const currentUserId = localStorage.getItem('userId'); 

  this.selectedSound.isDelete = false;
  this.selectedSound.isConfirm = true;
  this.selectedSound.deletedUser = null;
  this.selectedSound.userId = currentUserId;
  this.selectedSound.modifiedUser = currentUserId;

  const formData = new FormData();

  const editableKeys = [
    "soundSequenceName","id", "description", "recordingPlace", "recordingDate",
    "relatedWebPage", "technicalNote", "author", "latitude", "longitude",
    "email", "isConfirm", "modifiedDate", "modifiedUser", "deleteDate", 
    "isDelete", "deletedUser", "userId"
  ];

  editableKeys.forEach(key => {
    if (this.selectedSound[key] !== undefined && this.selectedSound[key] !== null) {
      formData.append(key, this.selectedSound[key]);
    }
  });

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  if (this.selectedSound.soundEffects && this.selectedSound.soundEffects.length > 0) {
    this.selectedSound.soundEffects.forEach((effectId: string) => {
      formData.append('soundEffects', effectId);
    });
  }

  this.soundService.updateSound(formData, this.selectedSound.id).subscribe({
    next: () => {
      this.closeModal();
      this.loadSounds1();
    },
    error: err => console.error('Error updating sound:', err)
  });
}

}
