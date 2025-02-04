import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  images = [
    'assets/images/alinoj_logo2.png',
    'assets/images/marthandam_church.png',
    'assets/images/slider3.jpg'
  ];
  currentIndex = 0;

  constructor() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }
}
