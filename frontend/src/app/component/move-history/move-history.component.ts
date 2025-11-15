import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface: Move
 * ------------------------------------------------------------
 * Represents a single move in the debate or argumentation process.
 * Each move captures:
 *  - type: the kind of action performed (e.g., Claim, Challenge, Justify, etc.)
 *  - actor: identifies who performed the move (Proponent or Opponent)
 *  - content: textual content of the move
 *  - timestamp: optional time when the move occurred
 */
export interface Move {
  type: 'Claim' | 'Challenge' | 'Justify' | 'Rebuttal' | 'Accept' | 'Skip';
  actor: 'Proponent' | 'Opponent';
  content: string;
  timestamp?: string;
}

/**
 * MoveHistoryComponent
 * ------------------------------------------------------------
 * Displays the chronological history of moves made by both actors
 * (Proponent and Opponent) during a debate session.
 *
 * Responsibilities:
 *  - Accepts an array of Move objects as input
 *  - Passes the data to its HTML template for list rendering
 *  - Uses Angular’s CommonModule for structural directives (e.g., *ngFor)
 */
@Component({
  selector: 'app-move-history', // Component selector for templates
  standalone: true, // Standalone Angular component
  imports: [CommonModule], // Required for common directives
  templateUrl: './move-history.component.html', // Linked HTML template
  styleUrl: './move-history.component.css', // Linked CSS stylesheet
})
export class MoveHistoryComponent {
  /**
   * Input array containing all moves made so far in the debate.
   * Each move is represented as a Move interface object.
   */
  @Input() moves: Move[] = [];
}
