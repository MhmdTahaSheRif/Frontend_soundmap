import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SoundFormComponent } from './submitsound/submitsound.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentusComponent } from './contentus/contentus.component';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminGuard } from './guards/admin.guard';
import { MysoundsComponent } from './mysounds/mysounds.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'login', component: SigninComponent },
    { path: 'register', component: SignupComponent },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'topics/:id', component: BlogDetailsComponent },
    { path: 'content', component: ContentusComponent },
    { path: 'myprofile', component: ProfileComponent },
    { path: 'mysounds', component: MysoundsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog-details/:id', component: BlogDetailsComponent },
    { path: 'admin', component: AdminComponent,  },
    { path: 'addsound', component: SoundFormComponent },
    { path: '**', component: NotFoundComponent }

];
