/**
 * SelectionItem
 * ------------------------------------------------------------
 * Represents a single selectable justification or argument option
 * within dropdowns or multi-select interfaces.
 */
export interface SelectionItem {
  /** Unique identifier for the selection option. */
  id: number;

  /** Textual content of the option (e.g., claim or premise text). */
  text: string;

  /** Optional reference to the source or citation supporting the option. */
  source?: string | null;
}

/**
 * SelectedOption
 * ------------------------------------------------------------
 * Represents an option that has been selected by the user.
 * May include both predefined and custom-created entries.
 */
export interface SelectedOption {
  /** Identifier for the selected item (can be numeric or string-based for custom entries). */
  id: number | string;

  /** Textual representation of the selected option. */
  text: string;

  /** Optional source information associated with the option. */
  source?: string;

  /**
   * Indicates whether this option was manually entered by the user
   * (not fetched from the predefined dataset).
   */
  isCustom?: boolean;
}

/**
 * rootClaim
 * ------------------------------------------------------------
 * Defines the structure of the main (root) claim within an argument tree.
 * This serves as the entry point for a given debate topic.
 */
export interface rootClaim {
  /** Unique identifier for the root claim. */
  id: number;

  /** The core text or statement of the root claim. */
  text: string;

  /** Source reference supporting the claim (e.g., citation, document). */
  source: string;

  /** Additional detailed content or elaboration of the claim. */
  content: string;
}

/**
 * argumentTree
 * ------------------------------------------------------------
 * Represents the hierarchical argumentation tree starting from
 * a claim and branching into justifications and counterarguments.
 */
export interface argumentTree {
  /** Unique identifier for the current argument node. */
  id: number;

  /** The text content of the argument node. */
  text: string;

  /**
   * Child nodes connected to this argument.
   * Each child node is represented as a ReasonTree.
   */
  children: ReasonTree[];
}

/**
 * ReasonTree
 * ------------------------------------------------------------
 * Recursive interface representing the reasoning hierarchy
 * beneath a claim or argument node. Each ReasonTree may
 * contain additional nested sub-reasons or supporting arguments.
 */
export interface ReasonTree {
  /** Unique identifier for the reasoning node. */
  id: number;

  /** The textual statement or justification. */
  text: string;

  /** List of child reasoning nodes (recursive structure). */
  children: ReasonTree[];
}
