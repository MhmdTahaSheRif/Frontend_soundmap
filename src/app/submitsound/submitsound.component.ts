import { Component, Inject, OnInit, PLATFORM_ID,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-submitsound',
  standalone: true,
  imports: [NgSelectModule, CommonModule,ReactiveFormsModule],
  templateUrl: './submitsound.component.html',
  styleUrls: ['./submitsound.component.css']
})
export class SoundFormComponent implements OnInit ,AfterViewInit {
  isBrowser: boolean;
  soundForm: FormGroup;
  soundEffectsList: readonly any[] | null | undefined;
  map!: L.Map;
  marker!: L.Marker;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.soundForm = this.fb.group({
      recordingPlace: ['', Validators.required],
      soundSequenceName: ['', Validators.required],
      recordingDate: ['', Validators.required],
      description: ['', Validators.required],
      relatedWebPage: ['', Validators.required],
      technicalNote: ['', Validators.required],
      author: ['', Validators.required],
      file: [null, Validators.required], 
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isConfirm: [false],
      soundEffectIds: [[], Validators.required] 
    });
  }


  ngAfterViewInit(): void {
    if (this.isBrowser) {
      import('leaflet').then(L => this.initializeMap(L));
    }
    }

    ngOnInit(): void {
      const token = localStorage.getItem('authToken');
      this.showLoginMessage = !token; 
      this.loadSoundEffects();
    }
  loadSoundEffects() {
    this.http.get<any[]>('https://localhost:7094/api/SoundEffects')
      .subscribe(
        data => this.soundEffectsList = data,
        error => console.error('Error fetching sound effects:', error)
      );
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  showLoginMessage = false;

  warnMessage() {
    const auth = localStorage.getItem('authToken');
    
    if (!auth) {
      this.showLoginMessage = true;
    } else {
      this.showLoginMessage = false;
    }
  }
  

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.soundForm.patchValue({ file });
    }
  }
  onSearchLocation(query: string): void {
    if (!query || query.length < 3) return;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.latitude = lat;
          this.longitude = lon;
          this.soundForm.patchValue({ latitude: lat, longitude: lon });
          
          if (this.map && this.marker) {
            this.map.setView([lat, lon], 14);
            this.marker.setLatLng([lat, lon]);
          }
        }
      });
  }

  initializeMap(L: any): void {
    const defaultLat = this.latitude;
    const defaultLng = this.longitude;
    const zoomLevel = 10;
    
    this.map = L.map('map').setView([defaultLat, defaultLng], zoomLevel);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    
    const customIcon = L.icon({
      iconUrl: 'https://www.cartophonies.fr/lib/leaflet-1.7.1/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
    });
    
    this.marker = L.marker([defaultLat, defaultLng], {
      draggable: true,
      icon: customIcon
    }).addTo(this.map);
    
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.latitude = position.lat;
      this.longitude = position.lng;
      this.soundForm.patchValue({ latitude: this.latitude, longitude: this.longitude });
    });
    
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.latitude = lat;
      this.longitude = lng;
      this.marker.setLatLng([lat, lng]);
      this.soundForm.patchValue({ latitude: lat, longitude: lng });
    });
    
    this.soundForm.patchValue({ latitude: defaultLat, longitude: defaultLng });
  }

  captchaCode: string = '';
  latitude: number = 30.0444; 
  longitude: number = 31.2357;
  
  
  debugRequest(): void {
  const formData = new FormData();
  
  console.log('Request payload:');
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  
  console.log('Copy this curl command and run it to test:');
  let curlCommand = "curl -X 'POST' \\\n";
  curlCommand += "'https://localhost:7094/api/Sound/add' \\\n";
  curlCommand += "-H 'accept: */*' \\\n";
  curlCommand += "-H 'Content-Type: multipart/form-data' \\\n";
  
  formData.forEach((value, key) => {
    if (key === 'File') {
      curlCommand += `-F '${key}=@filename;type=audio/mpeg' \\\n`;
    } else {
      curlCommand += `-F '${key}=${value}' \\\n`;
    }
  });
  
  console.log(curlCommand);
}


onSubmit(): void {
  const authToken = localStorage.getItem('authToken'); 
  if (!authToken) {
    alert('You must be logged in to submit the form.');
    return;
  }

  if (this.soundForm.invalid) {
    alert('Please fill in all required fields correctly.');
    return;
  }

  const formValues = this.soundForm.value;
  const file = this.soundForm.get('file')?.value;
  const userId = localStorage.getItem('userId') || '';
  const soundId = uuidv4();

  const formData = new FormData();
  formData.append('Id', soundId);
  formData.append('UserId', userId);
  formData.append('Author', formValues.author || '');
  formData.append('Latitude', formValues.latitude || '0');
  formData.append('Longitude', formValues.longitude || '0');
  formData.append('RecordingPlace', formValues.recordingPlace || '');
  formData.append('IsConfirm', formValues.isConfirm?.toString() || 'false');
  formData.append('RelatedWebPage', formValues.relatedWebPage || '');
  formData.append('SoundSequenceName', formValues.soundSequenceName || '');
  formData.append('Email', formValues.email || '');
  formData.append('Description', formValues.description || '');
  formData.append('TechnicalNote', formValues.technicalNote || '');
  formData.append('RecordingDate', formValues.recordingDate ? new Date(formValues.recordingDate).toISOString() : '');
  formData.append('UploadedAt', new Date().toISOString());
  formData.append('ModifiedDate', new Date().toISOString());
  formData.append('ModifiedUser', userId);
  formData.append('DeleteDate', new Date().toISOString());
  formData.append('IsDelete', 'false');
  formData.append('DeletedUser', userId);

  if (formValues.soundEffectIds?.length) {
    formValues.soundEffectIds.forEach((id: string) => {
      formData.append('SoundEffectIds', id);
    });
  }

  if (file) {
    formData.append('File', file, file.name);
    formData.append('RecordFilePath', `/uploads/${file.name}`);
  } else {
    alert('Please select a file to upload.');
    return;
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  this.http.post('https://localhost:7094/api/Sound/add', formData, { headers }).subscribe({
    next: () => {
      alert('✅ Sound uploaded successfully!');
      this.soundForm.reset(); // Optionally reset the form
    },
    error: (err) => {
      console.error('Error submitting form:', err);
      alert('❌ Failed to upload sound. Please try again later.');
    }
  });
}



}

