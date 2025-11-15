/**
 * ArgumentNode
 * ------------------------------------------------------------
 * Represents a single node within the argumentation tree structure.
 * Each node corresponds to a claim, challenge, rebuttal, or acceptance
 * and stores metadata necessary for rendering and logical flow.
 */
export interface ArgumentNode {
  /** Unique identifier for the argument node. */
  id: number;

  /** The textual content of the claim, rebuttal, or challenge. */
  text: string;

  /**
   * Optional reference to the parent node's ID.
   * Root claims typically do not have a parentId.
   */
  parentId?: number;

  /**
   * Logical stance of the node's actor:
   * - `'proponent'` → supports the argument
   * - `'opponent'` → counters the argument
   */
  stance: 'proponent' | 'opponent';

  /**
   * The move type performed at this node, representing
   * the kind of argumentative action taken.
   * Possible values: `'claim'`, `'rebut'`, `'challenge'`, `'accept'`.
   */
  moveType?: 'claim' | 'rebut' | 'challenge' | 'accept';

  /**
   * Flag indicating whether this node is a rebuttal.
   * Helps differentiate rebuttals from standard argument branches.
   */
  isRebuttal?: boolean;
}
