import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { trigger, style, transition, animate } from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    animations: [
        trigger('fadeIn', [
          transition(':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 })),
          ]),
        ]),
      ],
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent {
  skills = [
    {
      name: 'Java',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#ED8B00"/>
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Java</text>
        <path fill="white" d="M20 8c0 0 2.5 2.5 2.5 5-2.5-2.5-2.5-5-2.5-5zm5 5c0 0-2.5 2.5-2.5 5 2.5-2.5 2.5-5 2.5-5z"/>
      </svg>`)}`
    },
    {
      name: 'Scala',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#DC322F"/>
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Scala</text>
        <path fill="white" d="M15 8h10v2H15zm0 4h10v2H15zm0 4h10v2H15z"/>
      </svg>`)}`
    },
    {
      name: 'HTML5',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#E34F26"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">HTML5</text>
        <path fill="white" d="M15 8l1 12 6 2 6-2 1-12H15zm3 10l-.5-8h9l-.5 8-4 1-4-1z"/>
      </svg>`)}`
    },
    {
      name: 'CSS3',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#1572B6"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">CSS3</text>
        <path fill="white" d="M15 8l1 12 6 2 6-2 1-12H15zm3 10l-.5-8h9l-.5 8-4 1-4-1z"/>
      </svg>`)}`
    },
    {
      name: 'LESS',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#2B4C80"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">LESS</text>
        <path fill="white" d="M20 15a5 5 0 1 0 10 0 5 5 0 0 0-10 0zm5-2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
      </svg>`)}`
    },
    {
      name: 'JavaScript',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#323330"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="#F7DF1E" font-weight="bold">JS</text>
        <path fill="#F7DF1E" d="M20 8h10v14h-10zm2 12c0 1.1.9 2 2 2s2-.9 2-2v-4h2v4c0 2.2-1.8 4-4 4s-4-1.8-4-4z"/>
      </svg>`)}`
    },
    {
      name: 'TypeScript',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#007ACC"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">TS</text>
        <path fill="white" d="M15 8h20v14H15zm15 7h-6v-2h6zm0 4h-6v-2h6z"/>
      </svg>`)}`
    },
    {
      name: 'Angular',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#DD0031"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Angular</text>
        <path fill="white" d="M20 8l-4 1.5.6 8.5L20 20l3.4-2 .6-8.5L20 8zm0 2l2 5h-1l-1-2-1 2h-1l2-5z"/>
      </svg>`)}`
    },
    {
      name: 'Apache Spark',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#FFFFFF"/>
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="12" fill="#E35A16" font-weight="bold">Apache Spark</text>
        <path fill="#E35A16" d="M15 15l4-4v3h4v2h-4v3zm8-4v3h4v2h-4v3l-4-4z"/>
      </svg>`)}`
    },
    {
      name: 'Databricks',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#FF3621"/>
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Databricks</text>
        <path fill="white" d="M20 8l6 7-6 7V8zm-3 3v8l3-4-3-4z"/>
      </svg>`)}`
    },
    {
      name: 'Node.js',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#339933"/>
        <text x="45" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Node.js</text>
        <path fill="white" d="M20 15a5 5 0 1 0 10 0 5 5 0 0 0-10 0zm5 3l3-3-3-3v6z"/>
      </svg>`)}`
    },
    {
      name: 'Express.js',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 120 30">
        <rect width="120" height="30" rx="4" fill="#000000"/>
        <text x="40" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Express</text>
        <path fill="white" d="M15 12h10v1H15zm0 3h10v1H15zm0 3h10v1H15z"/>
      </svg>`)}`
    },
    {
      name: 'React',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#20232A"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="#61DAFB">React</text>
      </svg>`)}`
    },
    {
      name: 'Redux',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#764ABC"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Redux</text>
      </svg>`)}`
    },
    {
      name: 'Vue.js',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#4FC08D"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Vue.js</text>
      </svg>`)}`
    },
    {
      name: 'Next.js',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#000000"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Next.js</text>
      </svg>`)}`
    },
    {
      name: 'MongoDB',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#47A248"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">MongoDB</text>
      </svg>`)}`
    },
    {
      name: 'PostgreSQL',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="32">
        <rect width="110" height="32" rx="6" fill="#336791"/>
        <text x="12" y="21" font-family="Arial" font-size="14" fill="white">PostgreSQL</text>
      </svg>`)}`
    },
    {
      name: 'Docker',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#2496ED"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Docker</text>
      </svg>`)}`
    },
    {
      name: 'Kubernetes',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="32">
        <rect width="110" height="32" rx="6" fill="#326CE5"/>
        <text x="12" y="21" font-family="Arial" font-size="14" fill="white">Kubernetes</text>
      </svg>`)}`
    },
    {
      name: 'AWS',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#232F3E"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="#FF9900">AWS</text>
      </svg>`)}`
    },
    {
      name: 'Cassandra',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="32">
        <rect width="110" height="32" rx="6" fill="#1287B1"/>
        <text x="12" y="21" font-family="Arial" font-size="14" fill="white">Cassandra</text>
      </svg>`)}`
    },
    {
      name: 'Git',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#E44C30"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Git</text>
      </svg>`)}`
    },
    {
      name: 'Spring Boot',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="32">
        <rect width="110" height="32" rx="6" fill="#6DB33F"/>
        <text x="12" y="21" font-family="Arial" font-size="14" fill="white">Spring Boot</text>
      </svg>`)}`
    },
    {
      name: 'GraphQL',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#E10098"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">GraphQL</text>
      </svg>`)}`
    },
    {
      name: 'Swift',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#FA7343"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Swift</text>
      </svg>`)}`
    },
    {
      name: '.NET',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#512BD4"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">.NET</text>
      </svg>`)}`
    },
    {
      name: 'Redis',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#DD0031"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="white">Redis</text>
      </svg>`)}`
    },
    {
      name: 'Swagger',
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="32">
        <rect width="100" height="32" rx="6" fill="#85EA2D"/>
        <text x="12" y="21" font-family="Arial" font-size="15" fill="#000">Swagger</text>
      </svg>`)}`
    }
  ];

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
