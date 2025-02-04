import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { ToolsComponent } from './components/tools/tools.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

export const routes:  Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'tools', component: ToolsComponent },
    { path: 'portfolio', component: PortfolioComponent },
  ];

