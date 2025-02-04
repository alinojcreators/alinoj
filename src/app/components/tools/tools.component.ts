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
    { name: 'Java', imageUrl: 'https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white' },
    { name: 'Scala', imageUrl: 'https://img.shields.io/badge/Scala-DC322F?style=for-the-badge&logo=scala&logoColor=white' },
    { name: 'HTML5', imageUrl: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white' },
    { name: 'CSS3', imageUrl: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white' },
    { name: 'LESS', imageUrl: 'https://img.shields.io/badge/less-2B4C80?style=for-the-badge&logo=less&logoColor=white' },
    { name: 'JavaScript', imageUrl: 'https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E' },
    { name: 'TypeScript', imageUrl: 'https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white' },
    { name: 'Angular', imageUrl: 'https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white' },
    { name: 'Apache Spark', imageUrl: 'https://img.shields.io/badge/Apache_Spark-FFFFFF?style=for-the-badge&logo=apachespark&logoColor=#E35A16' },
    { name: 'Databricks', imageUrl: 'https://img.shields.io/badge/Databricks-FF3621?style=for-the-badge&logo=Databricks&logoColor=white' },
    { name: 'Node.js', imageUrl: 'https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white' },
    { name: 'Express.js', imageUrl: 'https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white' },
    { name: 'React', imageUrl: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB' },
    { name: 'Cassandra', imageUrl: 'https://img.shields.io/badge/Cassandra-1287B1?style=for-the-badge&logo=apache%20cassandra&logoColor=white' },
    { name: 'PostgreSQL', imageUrl: 'https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white' },
    { name: 'MongoDB', imageUrl: 'https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white' },
    { name: 'Git', imageUrl: 'https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white' },
    { name: 'Spring Boot', imageUrl: 'https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot' },
    { name: 'GraphQL', imageUrl: 'https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white' },
    { name: 'Swift', imageUrl: 'https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white' },
    { name: '.NET', imageUrl: 'https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white' },
    { name: 'Redis', imageUrl: 'https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white' },
    { name: 'Swagger', imageUrl: 'https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white' }
 
  ];

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}


