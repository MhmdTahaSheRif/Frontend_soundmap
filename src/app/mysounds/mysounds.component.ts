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

  isModalOpen = false;
  selectedSound: any = null;

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
