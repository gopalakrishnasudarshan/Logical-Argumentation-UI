/**
 * Source
 * ------------------------------------------------------------
 * Represents the reference or citation attached to a statement.
 * Each source provides contextual information about where a
 * claim or justification originates (e.g., article, research paper).
 */
export interface Source {
  /** The name or title of the referenced source. */
  name: string;

  /** A brief description or excerpt from the source material. */
  text: string;

  /** URL link to the full source document or webpage. */
  url: string;
}

/**
 * Statement
 * ------------------------------------------------------------
 * Defines a single declarative statement used in argumentation.
 * A statement may be a claim or premise and can include a
 * counter-statement to represent opposing viewpoints.
 */
export interface Statement {
  /** Unique identifier for the statement. */
  id: number;

  /** The textual content expressing the claim or premise. */
  text: string;

  /**
   * Optional counter-statement representing the opposing side
   * of the argument. Used to model contrastive or rebuttal pairs.
   */
  counterStatement?: Statement;

  /** Source information supporting the statement’s validity. */
  source: Source;
}

/**
 * StructuredArgument
 * ------------------------------------------------------------
 * Represents a complete logical argument structure consisting
 * of a main claim and its supporting premises.
 * Used as the core data model for rendering argument trees.
 */
export interface StructuredArgument {
  /** Unique identifier for the structured argument instance. */
  id: number;

  /** The central claim or conclusion of the argument. */
  claim: Statement;

  /** A list of premises that provide support for the main claim. */
  premises: Statement[];
}
