import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError, shareReplay } from 'rxjs';
import { Course } from '../models/course.model';

interface CoursesResponse {
  courses: Course[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesUrl = 'assets/data/courses.json';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private loaded = false;

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    if (!this.loaded) {
      this.http.get<CoursesResponse>(this.coursesUrl)
        .pipe(
          map(response => response.courses),
          catchError(this.handleError)
        )
        .subscribe(courses => {
          this.coursesSubject.next(courses);
          this.loaded = true;
        });
    }
  }

  getCourses(): Observable<Course[]> {
    if (!this.loaded) {
      this.loadInitialData();
    }
    return this.coursesSubject.asObservable();
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.getCourses().pipe(
      map(courses => courses.filter(course => 
        course.category.toLowerCase().includes(category.toLowerCase()) ||
        course.subcategory.toLowerCase().includes(category.toLowerCase())
      )),
      catchError(this.handleError)
    );
  }

  getCoursesBySubcategory(subcategory: string): Observable<Course[]> {
    return this.getCourses().pipe(
      map(courses => courses.filter(course => 
        course.subcategory.toLowerCase().includes(subcategory.toLowerCase())
      )),
      catchError(this.handleError)
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.getCourses().pipe(
      map(courses => {
        const course = courses.find(course => course.id === id);
        if (!course) {
          throw new Error(`Course with ID ${id} not found`);
        }
        return course;
      }),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.getCourses().pipe(
      map(courses => [...new Set(courses.map(course => course.category))].sort()),
      catchError(this.handleError)
    );
  }

  getAllSubcategories(): Observable<string[]> {
    return this.getCourses().pipe(
      map(courses => [...new Set(courses.map(course => course.subcategory))].sort()),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}