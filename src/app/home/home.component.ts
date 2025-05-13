import { Component, Inject, PLATFORM_ID, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RandomIconPipe } from "../random-icon.pipe";
import { NgSelectModule } from '@ng-select/ng-select';
declare var bootstrap: any; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterModule,/* RandomIconPipe*/NgSelectModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
[x: string]: any;
  private map: any;
  private markersLayer: any;
  sounds: any[] = [];
  selectedSound: any = null;
  panels: { [key: string]: boolean } = {
    search: true,
    sounds: false,
    participate: false,
    plus: false,
    settings: false
  };
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet'); 
      this.initMap(L);
      this.loadGovernorateBoundaries(L);
      this.fetchSoundData();
      this.updateFilteredMarkers();
      this.updateSoundMarkers(L)
    }
  }
ngOnInit() {
// window.location.reload();
this.loadSoundEffects();
  this.fetchSoundData();
  this.updateFilteredMarkers();
  this.sounds = this.sounds.map(sound => ({
    ...sound,
    iconClass: this.getIconForSound(sound.id)
  }));
}

private icons = ['historical', 'environmental', 'musical', 'cultural', 'modern'];
randomIcon = 'historical'; 

  
  getIconForSound(soundId: number | string): string {
    const seed = typeof soundId === 'string' 
      ? soundId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : soundId;
    
    return this.icons[seed % this.icons.length];
  }
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken'); 
  }

  private initMap(L: any): void {
    // Define tile layers
    this.satelliteLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    this.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  
    // Initialize the map once
    this.map = L.map('map', {
      center: [26.8, 30.8],
      zoom: 6,
      zoomControl: false,
      layers: [this.satelliteLayer] // default layer
    });
  
    // Store current layer
    this.currentBaseLayer = this.satelliteLayer;
  
    // Add marker layer
    this.markersLayer = L.layerGroup().addTo(this.map);
  
    fetch('assets/egypt-boundaries.geojson') 
      .then(response => response.json())
      .then(geojson => {
        L.geoJSON(geojson, {
          style: {
            color: 'blue',
            weight: 2,
            fillOpacity: 0.1
          }
        }).addTo(this.map);
      });
  }
  
  modalTitle = '';
  modalContent = '';
  modalImage = '';
  satelliteLayer: any;
  streetLayer: any;
  currentBaseLayer: any;
  toggleLayer(): void {
    if (this.map.hasLayer(this.satelliteLayer)) {
      this.map.removeLayer(this.satelliteLayer);
      this.map.addLayer(this.streetLayer);
      this.currentBaseLayer = this.streetLayer;
    } else {
      this.map.removeLayer(this.streetLayer);
      this.map.addLayer(this.satelliteLayer);
      this.currentBaseLayer = this.satelliteLayer;
    }
  }
  
  openPopup(type: string) {
    if (type === 'aerial') {
      this.modalTitle = 'Aerial View Info';
      this.modalContent = 'This mode shows satellite imagery from a top-down perspective.';
      this.modalImage = 'assets/logo.jpg';
    } else if (type === 'hybrid') {
      this.modalTitle = 'Hybrid View Info';
      this.modalContent = 'Hybrid mode combines map labels with satellite view.';
      this.modalImage = 'assets/logo.jpg';
    } else if (type === 'plan') {
      this.modalTitle = 'Plan View Info';
      this.modalContent = 'Plan view is a simplified, flat map style.';
      this.modalImage = 'assets/logo.jpg';
    }

    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
  }
  private loadGovernorateBoundaries(L: any): void {
    this.http.get('assets/geoBoundaries-EGY-ADM1.geojson').subscribe(
      (geojson: any) => {
        console.log('GeoJSON Loaded:', geojson);
  
        if (!geojson || !geojson.features) {
          console.error('Invalid GeoJSON format:', geojson);
          return;
        }
  
        L.geoJSON(geojson, {
          style: {
            color: 'white',      
            weight: 2,            
            fillColor: '#0f183e',   
            fillOpacity: 1     
          },
          onEachFeature: (feature: any, layer: any) => {
            layer.on('click', () => {
              const governorateName = feature.properties.NAME_1;
              console.log("Governorate clicked:", governorateName);
  
              const selectedSound = {
                soundSequenceName: governorateName,
                author: "N/A",
                description: `You clicked on ${governorateName}`,
                recordingDate: "N/A"
              };
  
              if (
                selectedSound.author === "N/A" &&
                selectedSound.description === `You clicked on ${governorateName}` &&
                selectedSound.recordingDate === "N/A"
              ) {
                console.log("No panel to display, as data is 'N/A'.");
                return;
              }
  
              this.selectedSound = selectedSound;
              this.activePanel = "details";
  
              setTimeout(() => {
                const panel = document.querySelector('.details-panel');
                if (panel) {
                  panel.classList.add('open');
                }
              }, 0);
            });
          }
        }).addTo(this.map);
      },
      (error) => console.error('Error loading GeoJSON:', error)
    );
  }
  
  
 
   updateSoundMarkers(L: any): void {
    this.markersLayer.clearLayers();

    const markerIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    this.sounds.forEach(sound => {
      const lat = parseFloat(sound.latitude);
      const lng = parseFloat(sound.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log(`Adding Marker at: (${lat}, ${lng})`);

        L.marker([lat, lng], { icon: markerIcon })
          .addTo(this.markersLayer)
          .bindPopup(`<b>${sound.soundSequenceName}</b>`)
          .on('click', () => this.displaySoundDetails(sound));
      } else {
        console.warn('Invalid latitude or longitude for sound:', sound);
      }
    });
  }

  displaySoundDetails(sound: any): void {
    // const authToken = this.getAuthToken()?.trim();
    // console.log("Auth Token:", authToken);
  
    // if (!authToken) {
    //   console.error('No auth token found!');
    //   return;
    // }
  
    this.selectedSound = {
      ...sound,
      audioUrl: `https://localhost:7094/api/Sound/play/${sound.id}`
    };
    console.log("Sound selected:", this.selectedSound);
  
    this.detailsPanelOpen = true;
  
    setTimeout(() => {
      const audioPlayer: HTMLAudioElement | null = document.querySelector('#audioPlayer');
  
      if (audioPlayer) {
        const onCanPlay = () => {
          audioPlayer.play().catch(error => {
            console.error("Autoplay error:", error);
          });
          audioPlayer.removeEventListener('canplay', onCanPlay);
        };
  
        audioPlayer.addEventListener('canplay', onCanPlay);
        audioPlayer.load();
      } else {
        console.error("Audio player not found.");
      }
    }, 100);
  }
  
  


  detailsPanelOpen: boolean = false;

  filteredSounds: any[] = [];

  private fetchSoundData(): void {
    this.http.get('https://localhost:7094/api/Sound/getAllSound').subscribe(
      (data: any) => {
        this.sounds = data;
        this.filteredSounds = [...data];  
        console.log('Sounds loaded:', this.sounds);
      },
      (error) => {
        console.error('Error fetching sound data:', error);
        alert('Failed to load sound data. Please try again later.');
      }
    );
  }
  
  

  refreshSoundsPanel(): void {
    console.log('Refreshing sounds panel with', this.filteredSounds.length, 'sounds');
  }

  activePanel: string | null = 'search'; 
  closeBtnStyle = { top: '0px', left: '0px' };  

  
 togglePanel(panel: string, event?: MouseEvent) {
  if (event) {
    event.stopPropagation(); 
  }
  
  const mapContainer = document.querySelector('.map-container');
  
  if (this.activePanel === panel) {
    this.activePanel = null;
    this.panels[panel] = false;
    this.renderer.removeClass(mapContainer, 'panel-open');
  } else {
    if (panel !== 'details') {
      const detailsWasOpen = this.activePanel === 'details';
      
      this.activePanel = panel;
      
      Object.keys(this.panels).forEach(key => {
        if (key !== panel) this.panels[key] = false;
      });
      
      this.panels[panel] = true;
      
      if (detailsWasOpen) {
        setTimeout(() => {
          const detailsPanel = document.querySelector('.details-panel');
          if (detailsPanel) {
            detailsPanel.classList.add('open');
          }
        }, 0);
      }
    } else {
      this.activePanel = panel;
    }
    
    this.renderer.addClass(mapContainer, 'panel-open');
  }
}


  getPanelKeys(): string[] {
    return Object.keys(this.panels);
  }
  getPanelTitle(key: string): string {
    const titles: { [key: string]: string } = {
      search: 'Search',
      sounds: 'Sounds',
      participate: 'Participate',
      plus: 'plus',
      settings: 'Settings'
    };
    return titles[key] || 'Panel';
  }
  
  audioUrl: string | null = null;

  onPanelClick(event: MouseEvent) {
    event.stopPropagation(); 
  }
  closePanel_() {
    this.selectedSound = null;
    this.audioUrl = null;
  }

closeAllPanels(): void {
  // Stop the audio if it's playing
  const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }

  // Reset the selected sound and panel states
  this.selectedSound = null;
  this.audioUrl = null;

  Object.keys(this.panels).forEach(key => this.panels[key] = false);

  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    this.renderer.removeClass(mapContainer, 'panel-open');
  }
}

closePanel(): void {
  if (this.activePanel === 'details') {
    this.selectedSound = null;
    this.audioUrl = null;
    
    const detailsPanel = document.querySelector('.details-panel');
    if (detailsPanel) {
      detailsPanel.classList.remove('close');
    }
    
    const anyPanelOpen = Object.values(this.panels).some(isOpen => isOpen);
    if (!anyPanelOpen) {
      this.activePanel = null;
    }
  } else {
    if (this.activePanel) {
      this.panels[this.activePanel] = false;
    }
    this.activePanel = null;
  }

  const sidebar = document.querySelector('.map-sidebar') as HTMLElement;
  if (sidebar) {
    sidebar.style.right = "0"; 
  }
}

closeAudio() {
  const audioElement = document.querySelector('.audioUrl') as HTMLAudioElement;
  if (audioElement) {
    audioElement.pause();  
    audioElement.currentTime = 0; 
  }
  this.audioUrl = null; 
}


searchQuery: string = '';
showFilteredSounds(): void {
  this.activePanel = 'sounds';
  Object.keys(this.panels).forEach(key => this.panels[key] = false);
  this.panels['sounds'] = true;
  
}


soundEffectsList: any[] = [];
selectedSoundEffectIds: string[] = []; 
minYear: number = 2000;
maxYear: number = 2025;
selectedYear: number = 2025;

loadSoundEffects() {
  this.http.get<any[]>('https://localhost:7094/api/SoundEffects')
    .subscribe(
      data => this.soundEffectsList = data,
      error => console.error('Error fetching sound effects:', error)
    );
}

filterSounds(searchTerm: string): void {
  console.log('Search term:', searchTerm);
  console.log('Original sounds array length:', this.sounds.length);

  const lowerSearchTerm = searchTerm?.toLowerCase().trim() || '';

  this.filteredSounds = this.sounds.filter(sound => {
    const nameMatch = sound.soundSequenceName?.toLowerCase().includes(lowerSearchTerm);
    const authorMatch = sound.author?.toLowerCase().includes(lowerSearchTerm);
    const descMatch = sound.description?.toLowerCase().includes(lowerSearchTerm);
    const matchesSearch = !lowerSearchTerm || nameMatch || authorMatch || descMatch;

    const soundEffectId = sound.soundEffect?.id;
    const matchesEffect = this.selectedSoundEffectIds.length === 0 || 
                          this.selectedSoundEffectIds.includes(soundEffectId);

    const recordingYear = new Date(sound.recordingDate).getFullYear();
    const matchesYear = recordingYear >= this.minYear && recordingYear <= this.selectedYear;

    console.log('Selected sound effect IDs:', this.selectedSoundEffectIds);

    return matchesSearch && matchesEffect && matchesYear;
  });

  console.log('Filtered sounds array length:', this.filteredSounds.length);
  console.log('Filtered sounds:', this.filteredSounds);

  this.updateFilteredMarkers();

  if (this.activePanel === 'sounds') {
    this.refreshSoundsPanel();
  }
}



getRandomColor(): string {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'];
  return colors[Math.floor(Math.random() * colors.length)];
}



private async updateFilteredMarkers(): Promise<void> {
  if (isPlatformBrowser(this.platformId)) {
    const L = await import('leaflet');
    this.markersLayer.clearLayers();
    
    const markerIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    
    this.filteredSounds.forEach(sound => {
      const lat = parseFloat(sound.latitude);
      const lng = parseFloat(sound.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng], { icon: markerIcon })
          .addTo(this.markersLayer)
          .bindPopup(`<b>${sound.soundSequenceName}</b>`)
          .on('click', () => this.displaySoundDetails(sound));
      }
    });
  }
}


}
