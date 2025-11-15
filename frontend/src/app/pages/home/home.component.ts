import { Component, OnInit } from '@angular/core';
import { ArgumentService } from '../../core/argument.service';
import { Topic } from '../../models/topic.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * HomeComponent
 * ------------------------------------------------------------
 * Acts as the landing page of the LOGARG application.
 * - Fetches and displays the list of available debate topics.
 * - Allows users to choose between two visualization modes:
 *   1️⃣ Classic single-column argument view
 *   2️⃣ Two-Lane (args.me-style) comparative layout
 */
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterLink],
})
export class HomeComponent implements OnInit {
  /** List of debate topics fetched from the backend service. */
  topics: Topic[] = [];

  constructor(
    /** Handles API communication to retrieve topic data. */
    private argumentService: ArgumentService,

    /** Angular Router for in-app navigation to topic pages. */
    private router: Router
  ) {}

  /**
   * Lifecycle hook — initializes component state.
   * Fetches available topics from the backend via ArgumentService.
   */
  ngOnInit(): void {
    this.argumentService.getTopics().subscribe({
      next: (data) => {
        console.log('TOPICS LOADED:', data);
        this.topics = data;
      },
      error: (err) => console.error('Error loading topics', err),
    });
  }

  /**
   * Navigates to the argument view for the selected topic.
   * @param topicName - The name of the selected debate topic.
   */
  goToTopic(topicName: string): void {
    this.router.navigate(['/topic', topicName]);
  }
}
