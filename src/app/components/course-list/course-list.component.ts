import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { EnrollmentDialogComponent } from '../course-detail/enrollment-dialog.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ]
})
export class CourseListComponent implements OnInit {
  courses$!: Observable<Course[]>;
  filteredCourses$: Observable<Course[]>;
  category: string = '';
  subcategory: string = '';
  selectedLevel: string = 'all';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.filteredCourses$ = this.coursesSubject.asObservable();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['subcategory']) {
        this.subcategory = params['subcategory'];
        this.category = params['category'];
      } else if (params['category']) {
        this.category = params['category'];
        this.subcategory = '';
      }
      this.loadCourses();
    });
  }

  handleEnrollment(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.maxWidth = '95vw';
    dialogConfig.maxHeight = '90vh';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      courseId: course.id,
      courseName: course.title
    };
  
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveEnrollment(result).subscribe({
          next: (response) => {
            this.snackBar.open(
              `Successfully enrolled in ${course.title}!`, 
              'Close',
              { duration: 5000, panelClass: ['success-snackbar'] }
            );
          },
          error: (error) => {
            console.error('Error saving enrollment:', error);
            let errorMessage = 'Failed to save enrollment. Please try again.';
            
            if (error.error && error.error.message) {
              if (error.error.message.includes('validation failed')) {
                errorMessage = 'Please fill in all required fields correctly.';
              } else {
                errorMessage = error.error.message;
              }
            }
            
            this.snackBar.open(
              errorMessage,
              'Close',
              { 
                duration: 5000, 
                panelClass: ['error-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
            );
          }
        });
      }
    });
  }

  private saveEnrollment(enrollmentData: any) {
    return this.http.post(`${this.apiUrl}/enrollments`, enrollmentData);
  }

  formatTitle(text: string): string {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  filterByLevel() {
    this.courses$.subscribe(courses => {
      const filtered = this.selectedLevel === 'all'
        ? courses
        : courses.filter(course => course.level === this.selectedLevel);
      this.coursesSubject.next(filtered);
    });
  }

  private loadCourses() {
    if (this.subcategory) {
      this.courses$ = this.courseService.getCoursesBySubcategory(this.subcategory);
    } else if (this.category) {
      this.courses$ = this.courseService.getCoursesByCategory(this.category);
    } else {
      this.courses$ = this.courseService.getCourses();
    }
    
    // Reset filters and update filtered courses
    this.selectedLevel = 'all';
    this.courses$.subscribe(courses => this.coursesSubject.next(courses));
  }
}