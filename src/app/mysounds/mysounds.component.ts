import { Component, OnInit } from '@angular/core';
import { SoundService } from '../sound.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-mysounds',
  standalone: true,
  imports: [CommonModule, FormsModule,NgSelectModule],
  templateUrl: './mysounds.component.html',
  styleUrls: ['./mysounds.component.css']
})
export class MysoundsComponent implements OnInit {
  sounds: any[] = [];
  userId: string | null = null;
  selectedFile: File | null = null;
 map!: L.Map;
  marker!: L.Marker;
  isModalOpen = false;

  constructor(private soundService: SoundService,private http:HttpClient) {}

  ngOnInit(): void {
      this.loadSoundEffects();

    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.loadSounds();
    }
  }

 loadSounds(): void {
  this.soundService.getAllSounds().subscribe({
    next: data => {
      this.sounds = data.filter(s => s.userId === this.userId && !s.isDelete);
    },
    error: err => console.error('Error loading sounds:', err)
  });
}



  soundEffectsList: readonly any[] | null | undefined;


  onFileSelected(event: any): void {
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
    // Prevent editing others' sounds
    if (sound.userId !== this.userId) {
      alert("لا يمكنك تعديل هذا الصوت.");
      return;
    }

    this.selectedSound = { ...sound };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSound = null;
    this.selectedFile = null;
  }

 deleteSound(id: string): void {
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
      this.loadSounds();
    },
    error: err => console.error('Error updating sound:', err)
  });
}

}
