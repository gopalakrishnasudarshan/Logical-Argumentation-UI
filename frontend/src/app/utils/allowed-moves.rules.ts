// allowed-moves.rules.ts

import { ArgumentNode } from '../models/argument-node';
import { Move } from '../component/move-history/move-history.component';

/**
 * MoveType
 * ------------------------------------------------------------
 * Enumerates all permissible types of argumentative actions
 * available to either participant (Proponent or Opponent).
 */
export type MoveType = 'challenge' | 'rebut' | 'accept' | 'skip';

/**
 * getAllowedMovesForTurn()
 * ------------------------------------------------------------
 * Determines which move types are allowed for the current player,
 * based on the debate’s contextual state and logical rules.
 *
 * This function acts as the rule engine for turn management,
 * guiding the UI and backend consistency.
 *
 * @param currentArgument - The current argument node in focus.
 * @param currentTurn - Identifies whose turn it is ('proponent' | 'opponent').
 * @param moveHistoryList - List of previous moves in chronological order.
 * @param challengedArgumentIds - Set of IDs that have already been challenged.
 * @param isInitialTurn - Flag indicating if this is the opponent’s very first move.
 * @param hasPendingJustificationResponse - Flag showing whether a justification response is due.
 * @returns Array of allowed move types (`MoveType[]`) for the current turn.
 */
export function getAllowedMovesForTurn(
  currentArgument: ArgumentNode,
  currentTurn: 'proponent' | 'opponent',
  moveHistoryList: Move[],
  challengedArgumentIds: Set<number>,
  isInitialTurn: boolean,
  hasPendingJustificationResponse: boolean
): MoveType[] {
  const allowedMoves: MoveType[] = [];

  /**
   * 🧩 Rule 1: Opponent’s first turn
   * ------------------------------------------------------------
   * On the first opponent turn (right after the proponent’s claim),
   * only two options are valid:
   *  - `challenge`: to question the claim
   *  - `accept`: to end the debate by agreement
   */
  if (isInitialTurn && currentTurn === 'opponent') {
    allowedMoves.push('challenge', 'accept');
    return allowedMoves;
  }

  /**
   * 🧩 Rule 2: Pending justification response
   * ------------------------------------------------------------
   * After receiving a justification, the responding side may:
   *  - `challenge`: question the justification
   *  - `rebut`: directly counter it
   *  - `accept`: concede the point
   */
  if (hasPendingJustificationResponse) {
    allowedMoves.push('challenge', 'rebut', 'accept');
    return allowedMoves;
  }

  /**
   * 🧩 Rule 3: Proponent responding to opponent’s rebuttal
   * ------------------------------------------------------------
   * After the opponent issues a rebuttal, the proponent may either:
   *  - `accept` the rebuttal, or
   *  - `challenge` it further.
   */
  const lastMove = moveHistoryList[moveHistoryList.length - 1];
  if (
    currentTurn === 'proponent' &&
    lastMove?.type === 'Rebuttal' &&
    lastMove.actor === 'Opponent'
  ) {
    allowedMoves.push('accept', 'challenge');
    return allowedMoves;
  }

  /**
   * 🧩 Rule 4: Repeated challenges or rebuttals
   * ------------------------------------------------------------
   * These are pre-handled in the component logic:
   * - Duplicate challenges are blocked via `challengedArgumentIds` in `handleNodeClick()`.
   * - Multiple rebuttals per target are prevented using the `rebutTarget` flag.
   *
   * Therefore, no additional filtering logic is needed here.
   */

  /**
   * 🧩 Default case
   * ------------------------------------------------------------
   * If no special condition applies, allow all move types.
   */
  allowedMoves.push('challenge', 'rebut', 'accept', 'skip');
  return allowedMoves;
}
