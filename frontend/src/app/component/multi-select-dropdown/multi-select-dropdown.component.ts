import { SelectedOption, SelectionItem } from './../../models/mockup.interface';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * MultiSelectDropdownComponent
 * ------------------------------------------------------------
 * A reusable multi-select dropdown with:
 *  - Search filter
 *  - Animated open/close behavior
 *  - Chip list of selected options
 *  - Optional "Other" custom input flow
 *
 * Inputs:
 *  - label: UI label shown above the control
 *  - placeholder: input placeholder for the search field
 *  - options: list of selectable items (id, text, optional source)
 *
 * Output:
 *  - selectionChange: emits the current list of SelectedOption objects whenever
 *    the selection changes (add/remove/custom)
 *
 * Notes:
 *  - Uses Angular animations for dropdown, chip, and slide transitions.
 *  - Maintains an internal `selectedOptions` array, while emitting changes to parent.
 */
@Component({
  selector: 'app-multi-select-dropdown',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.css',
  animations: [
    // Chip add animation
    trigger('chipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    // Dropdown open/close animation
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)', maxHeight: '0px' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)', maxHeight: '300px' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(-10px)',
            maxHeight: '0px',
          })
        ),
      ]),
    ]),
    // Slide open/close (e.g., for custom input panel)
    trigger('slideAnimation', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MultiSelectDropdownComponent {
  /** Label shown above the dropdown control */
  @Input() label: string = 'Select Options';

  /** Placeholder text for the search/filter input */
  @Input() placeholder: string = 'Choose options...';

  /** Available options to choose from */
  @Input() options: SelectionItem[] = [];

  /** Emits whenever the selected options change */
  @Output() selectionChange = new EventEmitter<SelectedOption[]>();

  /** Current list of selected options (chips) */
  selectedOptions: SelectedOption[] = [];

  /** Whether the dropdown panel is open */
  isOpen = false;

  /** Current search text used to filter options */
  searchTerm = '';

  /** Options filtered by the current search term */
  filteredOptions: SelectionItem[] = [];

  /** Controls visibility of the custom "Other" input */
  showOtherInput = false;

  /** Current value of the custom "Other" input */
  customValue = '';

  /**
   * Initialize filtered options to the full list on component load.
   */
  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  /**
   * Toggle the dropdown open/closed.
   * When closing, clears the search term and resets the filtered list.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.searchTerm = '';
      this.filterOptions();
    }
  }

  /**
   * Filters available options by `searchTerm` (case-insensitive).
   */
  filterOptions() {
    this.filteredOptions = this.options.filter((option) =>
      option.text.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Adds or removes an option from the selection.
   * - If the option is already selected, it is removed.
   * - Otherwise, it is added to `selectedOptions`.
   * Emits the updated selection afterwards.
   */
  toggleOption(option: SelectionItem) {
    const existingIndex = this.selectedOptions.findIndex(
      (item) => item.id === option.id
    );

    if (existingIndex > -1) {
      this.selectedOptions.splice(existingIndex, 1);
    } else {
      this.selectedOptions.push({
        id: option.id,
        text: option.text,
        source: option.source ?? '',
      });
    }

    this.selectionChange.emit([...this.selectedOptions]);
  }

  /**
   * Toggles the "Other" custom input flow.
   * - When turning off, clears the custom value and removes any existing
   *   custom option from the selection. Emits the updated selection.
   */
  toggleOtherOption() {
    this.showOtherInput = !this.showOtherInput;
    if (!this.showOtherInput) {
      this.customValue = '';
      // Remove any existing custom options
      this.selectedOptions = this.selectedOptions.filter(
        (item) => !item.isCustom
      );
      this.selectionChange.emit([...this.selectedOptions]);
    }
  }

  /**
   * Adds a single custom option (from `customValue`) to the selection.
   * - Replaces any previously added custom option.
   * - Clears the input and emits the updated selection.
   */
  addCustomOption() {
    if (this.customValue?.trim()) {
      const customOption: SelectedOption = {
        id: `custom_${Date.now()}`,
        text: this.customValue.trim(),
        isCustom: true,
      };

      // Remove existing custom option if any
      this.selectedOptions = this.selectedOptions.filter(
        (item) => !item.isCustom
      );
      this.selectedOptions.push(customOption);

      this.customValue = '';
      this.selectionChange.emit([...this.selectedOptions]);
    }
  }

  /**
   * Removes a selected chip by id.
   * - If the removed chip is custom, also hides the custom input panel.
   * - Emits the updated selection list.
   */
  removeSelection(item: SelectedOption) {
    const index = this.selectedOptions.findIndex(
      (option) => option.id === item.id
    );
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      if (item.isCustom) {
        this.showOtherInput = false;
      }
      this.selectionChange.emit([...this.selectedOptions]);
    }
  }

  /**
   * Returns whether the given option is currently selected.
   */
  isSelected(option: SelectionItem): boolean {
    return this.selectedOptions.some((item) => item.id === option.id);
  }

  /**
   * TrackBy function for option lists to improve rendering performance.
   */
  trackByFn(index: number, item: SelectionItem): string | number {
    return item.id;
  }

  /**
   * TrackBy function for selected option chips to improve rendering performance.
   */
  trackBySelectedOption(index: number, item: SelectedOption): string | number {
    return item.id;
  }
}
