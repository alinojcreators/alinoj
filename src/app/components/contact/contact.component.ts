import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  onSubmit() {
    alert('Form submitted successfully!');
    // Add logic to handle form data, e.g., send it to a server
  }

}
