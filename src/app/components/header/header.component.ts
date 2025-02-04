
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule,MatToolbarModule,MatButtonModule,MatIconModule,TranslateModule, MatMenuModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  menuOpen = false; // For mobile menu
  megaMenuOpen = false; // For mega menu
  filterText = ''; // For filtering items

  categories = [
    {
      name: 'Web Development',
      items: ['Frontend', 'Backend', 'Full Stack'],
    },
    {
      name: 'Mobile Development',
      items: ['iOS', 'Android', 'Flutter'],
    },
    {
      name: 'Cloud Services',
      items: ['AWS', 'Azure', 'Google Cloud'],
    },
    {
      name: 'Web Development',
      items: ['Frontend', 'Backend', 'Full Stack'],
    },
    {
      name: 'Mobile Development',
      items: ['iOS', 'Android', 'Flutter'],
    },
    {
      name: 'Cloud Services',
      items: ['AWS', 'Azure', 'Google Cloud'],
    }, {
      name: 'Web Development',
      items: ['Frontend', 'Backend', 'Full Stack'],
    },
    {
      name: 'Mobile Development',
      items: ['iOS', 'Android', 'Flutter'],
    },
    {
      name: 'Cloud Services',
      items: ['AWS', 'Azure', 'Google Cloud'],
    },
  ];
  selectedLanguage = 'en'; // Default language
  languages = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
  ]; // Available languages
  constructor(private translate: TranslateService) {
    // Set default and available languages
   // this.translate.addLangs(['en', 'ta']);
   this.translate.addLangs(this.languages.map((lang) => lang.code));
    this.translate.setDefaultLang('en');
    this.translate.use(this.selectedLanguage);
  }

  filteredCategories = [...this.categories];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMegaMenu() {
    this.megaMenuOpen = !this.megaMenuOpen;
  }

  closeMegaMenu() {
    this.megaMenuOpen = false;
  }

  filterItems() {
    const query = this.filterText.toLowerCase();
    this.filteredCategories = this.categories.map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.toLowerCase().includes(query)
      ),
    }));
  }
  switchLanguage(langCode: string): void {
 
    this.selectedLanguage = langCode;
    this.translate.use(langCode);
  }
  
}



