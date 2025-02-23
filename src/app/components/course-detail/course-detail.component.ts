import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { EnrollmentDialogComponent } from './enrollment-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadCourse();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourse(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        filter(params => !!params['id'])
      )
      .subscribe(params => {
        const courseId = params['id'];
        this.loading = true;
        this.error = null;
        
        this.courseService.getCourseById(courseId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (course) => {
              this.course = course;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading course:', error);
              this.error = 'Failed to load course details. Please try again later.';
              this.loading = false;
            }
          });
      });
  }

  handleEnrollClick(): void {
    if (!this.course) return;

    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      width: '600px',
      data: { course: this.course }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          const enrollmentData = {
            courseId: this.course?.id,
            ...result
          };

          this.saveEnrollment(enrollmentData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.snackBar.open(
                  'Successfully enrolled in the course!',
                  'Close',
                  { duration: 3000 }
                );
                this.router.navigate(['/courses']);
              },
              error: (error) => {
                console.error('Enrollment error:', error);
                this.snackBar.open(
                  'Failed to enroll in the course. Please try again.',
                  'Close',
                  { duration: 3000 }
                );
              }
            });
        }
      });
  }

  private saveEnrollment(enrollmentData: any) {
    return this.http.post(`${this.apiUrl}/enrollments`, enrollmentData);
  }
}