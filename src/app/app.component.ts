import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars, faMagnifyingGlass, faPlus, faGear } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from "./navbar/navbar.component";
import { HttpClient, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'soundmap';
  constructor(private library: FaIconLibrary) {
    library.addIcons(faBars, faMagnifyingGlass, faPlus, faGear); 
  }

}
