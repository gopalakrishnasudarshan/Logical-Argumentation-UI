import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * 📦 ArgumentInfoBoxComponent
 * ------------------------------------------------------------
 * This component is responsible for displaying detailed information
 * about a selected argument, including:
 *  - The source of the argument (e.g., reference or citation)
 *  - A critical question related to the argument
 *  - A feedback input field for the user to submit their comments
 *
 * It is a standalone Angular component using CommonModule and FormsModule.
 */
@Component({
  selector: 'app-argument-info-box', // Component selector used in HTML
  standalone: true, // Declared as a standalone component
  imports: [CommonModule, FormsModule], // Modules imported for form handling and common directives
  templateUrl: './argument-info-box.component.html', // Linked HTML template
  styleUrls: ['./argument-info-box.component.css'], // Linked CSS for styling
})
export class ArgumentInfoBoxComponent {
  /**
   * The source or reference of the argument.
   * Example: "From Debatepedia" or "Source: Stanford Encyclopedia of Philosophy"
   */
  @Input() source: string = '';

  /**
   * The critical question associated with the argument.
   * Example: "Does this claim apply universally?"
   */
  @Input() criticalQuestion: string = '';

  /**
   * Stores user feedback entered in the form input field.
   * Initially empty; bound to a text input via ngModel in the template.
   */
  feedback: string = '';

  /**
   * Handles the submission of user feedback.
   * - Checks if the feedback field is not empty.
   * - Logs the submitted feedback to the console.
   * - Displays a confirmation alert to the user.
   * - Resets the feedback field after submission.
   */
  submitFeedback() {
    if (this.feedback.trim()) {
      console.log('Feedback submitted:', this.feedback);
      alert('Thanks for your feedback!');
      this.feedback = '';
    }
  }
}
