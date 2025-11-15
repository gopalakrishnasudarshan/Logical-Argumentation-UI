/**
 * Move
 * ------------------------------------------------------------
 * Represents a single action performed by a participant
 * (Proponent or Opponent) during the structured debate.
 *
 * Each move captures the actor, the type of argumentative action,
 * the textual content of the move, and an optional timestamp.
 */
export interface Move {
  /**
   * The participant performing the move.
   * - `'Proponent'` → defends or supports the current claim.
   * - `'Opponent'` → challenges or rebuts the current claim.
   */
  actor: 'Proponent' | 'Opponent';

  /**
   * Type of the argumentative move executed.
   * Possible values:
   * - `'Claim'` → introduces a new statement or position.
   * - `'Challenge'` → questions or disputes a previous claim.
   * - `'Justify'` → provides supporting reasoning or evidence.
   * - `'Accept'` → agrees with or concedes a point.
   * - `'Skip'` → passes the turn without making a move.
   * - `'Rebuttal'` → directly counters a specific claim or justification.
   */
  type: 'Claim' | 'Challenge' | 'Justify' | 'Accept' | 'Skip' | 'Rebuttal';

  /** The textual content or message associated with the move. */
  content: string;

  /**
   * Optional timestamp recording when the move occurred.
   * Can be represented as a Date object or ISO string.
   */
  timestamp?: Date | string;
}
