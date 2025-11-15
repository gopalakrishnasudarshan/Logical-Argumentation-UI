import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

/**
 * MoveTrackerBoxComponent
 * ------------------------------------------------------------
 * Displays the list of currently allowed moves and a countdown
 * timer that limits how long a participant can respond during
 * their debate turn.
 *
 * Responsibilities:
 *  - Render allowed move types with their remaining counts.
 *  - Maintain and update a countdown timer.
 *  - Emit an event when the timer expires.
 *
 * Lifecycle:
 *  - OnInit: starts the countdown timer.
 *  - OnDestroy: clears the timer interval to avoid memory leaks.
 */
@Component({
  selector: 'app-move-tracker-box', // Component selector for template use
  standalone: true, // Declared as a standalone Angular component
  imports: [CommonModule], // Allows structural directives like *ngFor, *ngIf
  templateUrl: './move-tracker-box.component.html', // Linked HTML template
  styleUrls: ['./move-tracker-box.component.css'], // Linked CSS file for styling
})
export class MoveTrackerBoxComponent implements OnInit, OnDestroy {
  /**
   * Input array listing all allowed moves.
   * Each move includes:
   *  - type: the move's name (e.g., challenge, rebut)
   *  - count: how many times the move can still be used
   */
  @Input() allowedMoves: { type: string; count: number }[] = [];

  /**
   * Input property representing the remaining time (in seconds)
   * for the current turn. Defaults to 120 seconds.
   */
  @Input() remainingTime: number = 120;

  /**
   * Output event emitted when the countdown reaches zero.
   * Can be used by parent components to trigger next-turn logic.
   */
  @Output() timerExpired = new EventEmitter<void>();

  /** Internal interval reference used for clearing the timer. */
  private intervalId: any;

  /**
   * Lifecycle hook: initializes the countdown timer when the component is created.
   */
  ngOnInit(): void {
    this.startCountdown();
  }

  /**
   * Starts a 1-second interval countdown.
   * - Decrements remainingTime each second.
   * - Emits `timerExpired` when time reaches zero.
   */
  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.intervalId);
        this.timerExpired.emit();
      }
    }, 1000);
  }

  /**
   * Lifecycle hook: clears the countdown timer when the component is destroyed.
   * Prevents orphaned intervals and potential memory leaks.
   */
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
