/**
 * Topic
 * ------------------------------------------------------------
 * Represents a discussion topic or subject heading
 * under which structured arguments are organized.
 *
 * Each topic corresponds to a debate theme (e.g., "Television",
 * "Nuclear Energy", "Education") and serves as the entry point
 * for fetching its associated root claim and argument tree.
 */
export interface Topic {
  /** The name or title of the discussion topic. */
  topic: string;
}
