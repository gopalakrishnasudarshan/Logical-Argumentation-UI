import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * ArgumentNodeComponent
 * ------------------------------------------------------------
 * Represents a single argument node in the argumentation tree.
 * Each node can display its own content, child arguments, and rebuttals.
 *
 * Responsibilities:
 *  - Display a given argument and its hierarchical structure
 *  - Distinguish between standard child arguments and rebuttals
 *  - Emit click events to notify the parent component when a node is selected
 *
 * Inputs:
 *  - argument: the current argument object displayed by this node
 *  - allArguments: list of all argument objects (used to compute hierarchy)
 *  - currentlyChallengedId: identifies which argument is currently being challenged
 *  - selectedStatementId: identifies which statement is currently selected
 *
 * Outputs:
 *  - nodeClicked: emitted when this argument node is clicked
 */
@Component({
  selector: 'app-argument-node', // Component selector used in templates
  templateUrl: './argument-node.component.html', // Linked HTML template
  styleUrls: ['./argument-node.component.css'], // Linked CSS file for styling
  imports: [CommonModule], // Common Angular directives used
})
export class ArgumentNodeComponent {
  /** The argument object represented by this component */
  @Input() argument: any = {};

  /** Complete list of arguments, used to derive child and rebuttal relationships */
  @Input() allArguments: any[] = [];

  /** ID of the argument currently being challenged (if any) */
  @Input() currentlyChallengedId: number | null = null;

  /** Event emitted when the node is clicked */
  @Output() nodeClicked = new EventEmitter<any>();

  /** ID of the statement currently selected in the debate */
  @Input() selectedStatementId: number | null = null;

  /**
   * Returns all direct child arguments of this node that are not rebuttals.
   * Filters the complete list of arguments based on matching parentId.
   */
  getChildren(): any[] {
    return this.allArguments.filter(
      (arg) => arg.parentId === this.argument.id && !arg.isRebuttal
    );
  }

  /**
   * Returns all rebuttal arguments associated with this node.
   * Rebuttals are distinguished by the isRebuttal flag.
   */
  getRebuttals(): any[] {
    return this.allArguments.filter(
      (arg) => arg.parentId === this.argument.id && arg.isRebuttal
    );
  }

  /**
   * Emits the nodeClicked event when this argument node is selected.
   * Used by parent components to track which node was interacted with.
   */
  handleClick(): void {
    this.nodeClicked.emit(this.argument);
  }

  /**
   * Helper function: returns all children (non-rebuttals) of a specific parent argument.
   * Can be used for recursive rendering or nested structures.
   */
  getChildrenOf(parent: any): any[] {
    return this.allArguments.filter(
      (arg) => arg.parentId === parent.id && !arg.isRebuttal
    );
  }

  /**
   * Helper function: returns all rebuttals of a specific parent argument.
   * Supports recursive or targeted access to rebuttal relationships.
   */
  getRebuttalsOf(parent: any): any[] {
    return this.allArguments.filter(
      (arg) => arg.parentId === parent.id && arg.isRebuttal
    );
  }
}
