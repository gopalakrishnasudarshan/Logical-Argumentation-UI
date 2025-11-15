import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArgumentService } from '../../core/argument.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArgumentNodeComponent } from '../../component/argument-node/argument-node.component';
import { MoveTrackerBoxComponent } from '../../component/move-tracker-box/move-tracker-box.component';
import {
  Move,
  MoveHistoryComponent,
} from '../../component/move-history/move-history.component';
import { ArgumentInfoBoxComponent } from '../../component/argument-info-box/argument-info-box.component';

import { MultiSelectDropdownComponent } from '../../component/multi-select-dropdown/multi-select-dropdown.component';
import { SelectedOption, SelectionItem } from '../../models/mockup.interface';
import {
  getAllowedMovesForTurn,
  MoveType,
} from '../../utils/allowed-moves.rules';
import { RebuttalDTO } from '../../core/argument.service';

import { ArgumentNode } from '../../models/argument-node';

/**
 * ArgumentViewComponent
 * ------------------------------------------------------------
 * Container component for the Classic debate view.
 * - Loads the topic and root claim from route params/backend
 * - Orchestrates turn logic, timers, move limits, and history
 * - Manages challenge/justify/rebuttal flows and UI state
 * - Coordinates with child components (node tree, tracker, history, info box)
 */
@Component({
  standalone: true,
  selector: 'app-argument-view',
  templateUrl: './argument-view.component.html',
  styleUrls: ['./argument-view.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ArgumentNodeComponent,
    MoveHistoryComponent,
    ArgumentInfoBoxComponent,
    MoveTrackerBoxComponent,

    MultiSelectDropdownComponent,
  ],
})
export class ArgumentViewComponent implements OnInit {
  /** Per-side turn counters to enforce max turn rules. */
  turnCounts: { proponent: number; opponent: number } = {
    proponent: 0,
    opponent: 0,
  };

  /** Move limits per actor (challenge/rebuttal caps). */
  moveLimits = {
    proponent: { challenge: 15, rebuttal: 5 },
    opponent: { challenge: 15, rebuttal: 5 },
  };

  /** (Optional) Justification tree payload shown during 'justify' flow. */
  justificationTree: any = null;

  /** Turn countdown (seconds). */
  remainingTime: number = 90;
  /** Interval reference for the active turn timer. */
  private timerRef: any;

  /** UI hint for which text was challenged. */
  challengedText: string = '';
  /** Flag: user is currently selecting a justification to rebut. */
  isRebuttingJustification: boolean = false;
  /** Current target node selected to rebut. */
  rebutTarget: any = null;
  /** Currently highlighted statement ID in UI. */
  selectedStatementId: number | null = null;

  /** Flag: user is currently selecting a justification to challenge. */
  isChallengingJustification: boolean = false;
  /** Hard stop when the debate is accepted. */
  debateEnded: boolean = false;
  /** Max turns per side. */
  maxTurns = 5;
  /** Controls visibility of justification selection UI. */
  showJustificationOptions: boolean = false;
  /** Topic slug/name resolved from route. */
  topic: string = '';
  /** Root argument (claim) object loaded for the topic. */
  rootArgument: any = null;
  /** Whose turn it is. */
  currentTurn: 'proponent' | 'opponent' = 'proponent';
  /** Replies loaded for generic 'getReplies' fallback path. */
  replies: any[] = [];
  /** Currently chosen move ('challenge' | 'rebuttal' | etc.). */
  selectedMove: string = '';
  /** Linearized path of claims/justifications shown in the main view. */
  argumentPath: any[] = [];
  /** Rebuttal textarea content. */
  rebuttalText: string = '';
  /** Cached reference to the root claim for convenience. */
  mainClaim: any = null;

  /** Chronological record of all moves. */
  moveHistoryList: Move[] = [];
  /** Cache of rebuttals keyed by target claim ID. */
  rebuttalsByTarget: Map<number, RebuttalDTO[]> = new Map();
  /** Submission state for rebuttal POST. */
  isSubmittingRebuttal = false;

  /** Set of already-challenged argument IDs (prevent duplicate challenge). */
  challengedArgumentIds: Set<number> = new Set();

  /** Scratch object for creating ad-hoc arguments via form. */
  newArgument = {
    topic: '',
    text: '',
    moveType: '',
    stance: '',
    parentId: 0,
  };

  /** The claim currently being challenged (ID). */
  currentlyChallengedId: number | null = null;
  /** Transient, user-facing notifications. */
  statusMessage: string = '';

  /** Options used in the multi-select component when justifying. */
  justificationOptions: { id: number; text: string; source?: string | null }[] =
    [];
  // selectedJustifications: ... (legacy kept for reference)

  /** Turn helper message above FAB / instruction area. */
  turnInstruction: string = '';
  /** Whether the floating action button menu is open. */
  fabMenuOpen = false;

  /** Selected justification options (multi-select). */
  selectedJustifications: SelectedOption[] = [];
  /** (Alias) Selected reasons currently staged for submit. */
  selectedReasons: SelectedOption[] = [];

  /** Reason choices fetched for a challenged statement. */
  reasonOptions: SelectionItem[] = [];

  /** Currently visible rebuttals for the active rebut target. */
  activeRebuttals: any[] = [];

  /** Toggles the floating action button menu. */
  toggleFabMenu() {
    this.fabMenuOpen = !this.fabMenuOpen;
  }

  /**
   * Starts a move selection flow for the FAB:
   * validates remaining allowance, sets UI hints and state.
   */
  startMoveSelection(action: 'challenge' | 'rebuttal') {
    if (this.moveLimits[this.currentTurn][action] <= 0) {
      this.statusMessage = `❌ You have no ${action}s remaining.`;
      setTimeout(() => (this.statusMessage = ''), 3000);
      return;
    }
    this.selectedMove = action;
    this.fabMenuOpen = false;
    this.turnInstruction = `Click on a statement to ${action}.`;
  }

  constructor(
    private route: ActivatedRoute,
    private argumentService: ArgumentService
  ) {}

  /**
   * Lifecycle: initialize topic → load root claim → set initial turn + timer.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const topicParam = params.get('topic');
      if (topicParam) {
        this.topic = topicParam;
        console.log('Current topic:', this.topic);

        this.argumentService.getRootClaimByTopicName(this.topic).subscribe({
          next: (claim) => {
            this.rootArgument = claim;
            this.mainClaim = claim;
            this.argumentPath = [claim];
            console.log(
              '🟢 [ngOnInit] argumentPath initialized:',
              this.argumentPath.map((a) => a.text)
            );

            console.log('Root argument loaded:', claim);

            // Log initial claim by the Proponent
            this.logMove('Proponent', 'Claim', claim.text || claim.content);

            // Opponent starts response, boot turn timer
            this.currentTurn = 'opponent';
            this.startTurnTimer();
          },
          error: (err) => console.error('Error fetching root claim', err),
        });
      }
    });
  }

  /** True only once: Opponent’s first response to the root claim. */
  get isInitialOpponentTurn(): boolean {
    return this.currentTurn === 'opponent' && this.argumentPath.length === 1;
  }

  /**
   * Detects whether a justification is still pending in the move flow:
   * compares last two moves across actors and types.
   */
  get hasPendingJustificationResponse(): boolean {
    const recentMoves = this.moveHistoryList.slice(-2);
    if (recentMoves.length < 2) return false;

    const [challengeMove, justifyMove] = recentMoves;

    const actorNow =
      this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent';

    return (
      challengeMove.actor !== justifyMove.actor &&
      challengeMove.type === 'Challenge' &&
      justifyMove.type === 'Justify' &&
      this.moveHistoryList[this.moveHistoryList.length - 1].actor !== actorNow
    );
  }

  /**
   * Computes allowed moves based on rule engine + current context.
   * Delegates to `getAllowedMovesForTurn` with the minimal state.
   */
  get allowedMoves(): MoveType[] {
    return getAllowedMovesForTurn(
      this.rootArgument,
      this.currentTurn,
      this.moveHistoryList,
      this.challengedArgumentIds,
      this.isInitialOpponentTurn,
      this.hasPendingJustificationResponse
    );
  }

  /** (Re)starts the per-turn countdown timer. */
  startTurnTimer(): void {
    clearInterval(this.timerRef);
    this.remainingTime = 90;
    this.timerRef = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.timerRef);
        this.onTimerExpired();
      }
    }, 1000);
  }

  /** Handles a time-out by skipping the current turn. */
  onTimerExpired(): void {
    this.statusMessage = `${this.currentTurn} ran out of time. Turn skipped.`;
    setTimeout(() => (this.statusMessage = ''), 3000);
    this.passTurn();
  }

  /**
   * Central handler for user-chosen move actions.
   * Enforces debate end, turn limits, and dispatches to move-specific flows.
   */
  handleMove(moveType: string): void {
    if (this.debateEnded) {
      this.statusMessage = 'The debate has already ended.';
      return;
    }

    if (this.turnCounts[this.currentTurn] >= this.maxTurns) {
      this.statusMessage = `${
        this.currentTurn.charAt(0).toUpperCase() + this.currentTurn.slice(1)
      } has used all their turns.`;
      setTimeout(() => {
        this.statusMessage = '';
      }, 3000);
      return;
    }

    console.log(`${this.currentTurn} chose to ${moveType}`);
    this.selectedMove = moveType;

    // Accept ends the debate immediately
    if (moveType === 'accept') {
      this.statusMessage = `✅ ${this.currentTurn} has accepted the argument. The debate ends.`;
      this.debateEnded = true;

      this.logMove(
        this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
        'Accept',
        'Accepted the argument.'
      );
      return;
    }

    // Rebuttal mode: pick a justification, then enter text
    if (moveType === 'rebuttal') {
      if (this.argumentPath.length <= 1) {
        this.statusMessage = 'There are no justifications to rebut yet.';
        return;
      }

      this.isRebuttingJustification = true;
      this.rebutTarget = null;
      this.rebuttalText = '';
      this.activeRebuttals = []; // reset visible rebuttals list
      this.selectedMove = 'rebuttal';
      this.turnInstruction = 'Click on a statement to rebut.';
      this.statusMessage = 'Select a justification to rebut:';

      this.logMove(
        this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
        'Rebuttal',
        'Wants to rebut a justification.'
      );
      return;
    }

    // Challenge mode: for root (first) vs subsequent justifications
    if (moveType === 'challenge') {
      if (this.argumentPath.length === 1) {
        // Challenge root claim
        this.currentlyChallengedId = this.rootArgument.id;
        console.log(
          '🟡 [handleMove] challenging root claim:',
          this.rootArgument.text
        );
        console.log(
          '🟡 argumentPath before challenge:',
          this.argumentPath.map((a) => a.text)
        );

        this.challengedArgumentIds.add(this.rootArgument.id);
        this.moveLimits[this.currentTurn].challenge--;
        this.turnCounts[this.currentTurn]++;
        this.currentTurn =
          this.currentTurn === 'proponent' ? 'opponent' : 'proponent';

        // Fetch topic-wide justification tree (no rebuttals here)
        this.argumentService.getTreeJustifications(this.topic).subscribe({
          next: (treeData) => {
            console.log('📦 Tree received:', treeData);
            this.justificationTree = treeData;
            this.showJustificationOptions = true;
            this.statusMessage = `Justify your argument: "${this.challengedText}"`;
          },
          error: () => {
            this.statusMessage = 'Error fetching justification tree.';
          },
        });
      } else {
        // Challenge a specific justification
        this.statusMessage = 'Select a justification to challenge:';
        this.isChallengingJustification = true;

        this.logMove(
          this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
          'Challenge',
          'Wants to challenge a justification.'
        );
      }
      return;
    } else {
      // Fallback path: generic replies endpoint (kept from earlier design)
      this.argumentService
        .getReplies(this.rootArgument.id, moveType, this.currentTurn)
        .subscribe({
          next: (data) => {
            console.log('Replies loaded:', data);
            this.replies = data;

            this.logMove(
              this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
              (moveType.charAt(0).toUpperCase() +
                moveType.slice(1)) as Move['type'],
              `Selected move: ${moveType}`
            );
          },
          error: (err) => {
            console.error('Failed to load replies', err);
          },
        });
    }
  }

  /**
   * Applies a selected reply to the path and flips the turn.
   */
  selectReply(reply: any): void {
    console.log('Selected reply:', reply);

    this.argumentPath.push(reply);
    // this.rootArgument = reply;

    this.replies = [];
    this.selectedMove = '';

    this.turnCounts[this.currentTurn]++;
    this.currentTurn =
      this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
  }

  /**
   * Posts a new ad-hoc argument via form fields, then appends to replies.
   */
  submitNewArgument(): void {
    this.newArgument.topic = this.topic;
    this.newArgument.stance =
      this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent';
    this.newArgument.parentId = this.rootArgument.id;

    this.argumentService.addArgument(this.newArgument).subscribe({
      next: (created) => {
        console.log('New argument added:', created);
        this.replies.push(created);

        this.newArgument = {
          topic: '',
          text: '',
          moveType: '',
          stance: '',
          parentId: 0,
        };
      },
      error: (err) => console.error('Failed to add argument', err),
    });
  }

  /**
   * Skips the current turn, resets transient state, logs the move,
   * flips the turn, and restarts the timer.
   */
  passTurn(): void {
    const current = this.currentTurn;
    this.replies = [];
    this.selectedMove = '';

    this.turnCounts[this.currentTurn]++;
    this.currentTurn =
      this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
    this.startTurnTimer();

    this.statusMessage = `${
      current.charAt(0).toUpperCase() + current.slice(1)
    } passed the turn.`;

    this.logMove(
      current === 'proponent' ? 'Proponent' : 'Opponent',
      'Skip',
      'Skipped the turn.'
    );
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }

  /**
   * Selection helper for checkbox-style justification pickers.
   * Toggles presence in `selectedJustifications`.
   */
  selectJustification(reason: any): void {
    const index = this.selectedJustifications.indexOf(reason);
    if (index === -1) {
      this.selectedJustifications.push(reason);
    } else {
      this.selectedJustifications.splice(index, 1);
    }
  }

  /**
   * Applies selected justifications to the path, logs the move,
   * flips the turn, and manages UI/turn state.
   */
  submitJustifications(): void {
    if (this.selectedJustifications.length === 0) {
      this.statusMessage = 'Please select at least one reason or click Skip.';
      setTimeout(() => (this.statusMessage = ''), 3000);
      return;
    }

    const parentId = this.currentlyChallengedId || this.rootArgument.id;

    console.log(
      '📋 argumentPath before pushing justifications:',
      this.argumentPath.map((a) => a.text)
    );

    this.selectedJustifications.forEach((justification) => {
      const entry = {
        id: justification.id ?? Date.now(),
        text: justification.text,
        source: { name: justification.source || null },
        parentId: parentId,
        moveType: 'Claim',
        stance: this.currentTurn,
      };
      this.argumentPath.push(entry);
    });

    const justificationTexts = this.selectedJustifications
      .map((j) => `"${j.text}"`)
      .join(', ');
    this.logMove(
      this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
      'Justify',
      `Justified with: ${justificationTexts}`
    );

    this.showJustificationOptions = false;
    console.log(
      '🟠 [submitJustifications] added justifications:',
      this.selectedJustifications.map((j) => j.text)
    );
    console.log(
      '🟠 argumentPath after justification:',
      this.argumentPath.map((a) => a.text)
    );

    this.selectedJustifications = [];
    this.turnCounts[this.currentTurn]++;
    this.currentlyChallengedId = null;
    this.statusMessage = '';
    this.currentTurn =
      this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
    this.startTurnTimer();
  }

  /**
   * Skips justification selection; flips turn and cleans up state.
   */
  skipJustification(): void {
    this.statusMessage = 'Turn skipped. No justification provided.';
    this.showJustificationOptions = false;
    this.selectedJustifications = [];
    this.turnCounts[this.currentTurn]++;
    this.currentlyChallengedId = null;
    this.currentTurn =
      this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
    setTimeout(() => (this.statusMessage = ''), 3000);
  }

  /**
   * Loads a demo structured argument and populates the view.
   */
  loadStructuredArgument(): void {
    this.argumentService.getStructuredArgument(1).subscribe({
      next: (data) => {
        console.log('Structured argument loaded:', data);
        this.rootArgument = data.claim;
        this.argumentPath = [data.claim, ...data.premises];
      },
      error: (err) => {
        console.error('Error loading structured argument', err);
      },
    });
  }

  /**
   * Entry point when a justification is selected (UI click) to challenge.
   * Resolves argumentId → fetches its justifications → changes turn.
   */
  selectJustificationToChallenge(justification: any): void {
    const claimId = justification.id;
    this.challengedText = justification.text;
    this.logMove(
      this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
      'Challenge',
      `Challenged: "${justification.text}"`
    );

    console.log('🔍 Selected claim to challenge:', claimId, justification.text);

    this.turnInstruction = '';
    this.challengedArgumentIds.add(justification.id);
    this.moveLimits[this.currentTurn].challenge--;

    this.currentlyChallengedId = claimId;
    console.log(
      '🔴 [selectJustificationToChallenge] argument selected:',
      justification.text
    );
    console.log(
      '🔴 argumentPath before fetching new justifications:',
      this.argumentPath.map((a) => a.text)
    );

    // Resolve argument container for the selected claim, then fetch reasons
    this.argumentService.getArgumentIdByClaimId(claimId).subscribe({
      next: (argumentId) => {
        console.log('✅ Resolved argumentId from claimId:', argumentId);

        this.argumentService.getJustifications(argumentId).subscribe({
          next: (justifications) => {
            console.log('✅ Justifications fetched:', justifications);

            this.reasonOptions = justifications?.length
              ? justifications.map((j) => ({
                  id: j.id,
                  text: j.text,
                  source: j.source ?? '',
                }))
              : []; // allows dropdown to show even when empty

            this.showJustificationOptions = true;
            this.statusMessage = `Justify your argument: "${this.challengedText}"`;

            this.isChallengingJustification = false;
            this.replies = [];
            this.selectedMove = '';

            this.turnCounts[this.currentTurn]++;
            this.currentTurn =
              this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
            this.startTurnTimer();
          },
          error: (err) => {
            console.error('❌ Failed to load justifications', err);
            this.statusMessage = 'Error fetching justification options.';
          },
        });
      },
      error: (err) => {
        console.error('❌ Failed to resolve argument ID from claim ID', err);
        this.statusMessage =
          'Unable to find argument for the selected justification.';
      },
    });
  }

  /**
   * Entry point when a justification is selected (UI click) to rebut.
   * Sets the rebut target and loads existing rebuttals for context.
   */
  selectJustificationToRebut(justification: any): void {
    setTimeout(() => {
      console.log('🧲 FINAL rebutTarget:', this.rebutTarget);
    }, 1000);

    console.log('🧲 REBUT TARGET SELECTED:', justification);
    this.rebutTarget = justification;
    this.isRebuttingJustification = false;
    this.statusMessage = '';

    // Preload existing rebuttals to show under the input area
    this.loadRebuttalsFor(justification.id);
  }

  /**
   * Submits a rebuttal for the currently selected target justification:
   * - POSTs to backend
   * - Updates local path and visible rebuttals
   * - Applies move limits and flips the turn
   */
  submitRebuttal(): void {
    if (!this.rebuttalText.trim() || !this.rebutTarget) {
      this.statusMessage = 'Please enter a valid rebuttal.';
      return;
    }

    // build payload for backend
    const payload: RebuttalDTO = {
      targetClaimId: this.rebutTarget.id,
      text: this.rebuttalText.trim(),
      actor: this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
    };

    this.isSubmittingRebuttal = true;

    // 🛰️ send to backend
    this.argumentService.createRebuttal(payload).subscribe({
      next: (saved) => {
        console.log('✅ Rebuttal saved to backend:', saved);

        // --- local visualization entry ---
        const rebuttalEntry = {
          id: (saved as any).id ?? (saved as any).statementId ?? Date.now(),
          text: (saved as any).text,
          parentId: this.rebutTarget.id,
          moveType: 'Rebuttal',
          stance: this.currentTurn,
          isRebuttal: true,
        };

        this.argumentPath.push(rebuttalEntry);
        console.log('📦 Rebuttal added locally:', rebuttalEntry);

        // Cache rebuttals by target (tolerate variants of API response)
        const key = (saved as any).targetClaimId ?? payload.targetClaimId;
        const list = this.rebuttalsByTarget.get(key) ?? [];
        this.rebuttalsByTarget.set(key, [...list, saved as any]);

        // Show immediately in the existing rebuttals list
        this.activeRebuttals = [
          ...this.activeRebuttals,
          {
            id: (saved as any).statementId ?? (saved as any).id ?? Date.now(),
            text: (saved as any).text,
            source: (saved as any).source ?? 'User',
          },
        ];

        // Apply limits, log move, switch turn
        this.moveLimits[this.currentTurn].rebuttal--;
        this.logMove(
          this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
          'Rebuttal',
          (saved as any).text
        );

        // Reset UI state
        this.rebutTarget = null;
        this.rebuttalText = '';
        this.statusMessage = '';
        this.turnInstruction = '';
        this.selectedMove = '';
        this.isRebuttingJustification = false;

        this.turnCounts[this.currentTurn]++;
        this.currentTurn =
          this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
        this.startTurnTimer();
      },
      error: (err) => {
        console.error('❌ Rebuttal submit failed', err);
        this.statusMessage = 'Failed to submit rebuttal.';
      },
      complete: () => (this.isSubmittingRebuttal = false),
    });
  }

  /**
   * Node click dispatcher:
   * - If challenging: validates rules and proceeds to challenge flow
   * - If rebutting: sets rebut target
   * - Otherwise: no-op (clicks while idle)
   */
  handleNodeClick(argument: any): void {
    if (this.selectedMove === 'challenge') {
      if (this.challengedArgumentIds.has(argument.id)) {
        this.statusMessage = 'This argument has already been challenged.';
        return;
      }
      if (argument.stance === this.currentTurn) {
        this.statusMessage = '❌ You cannot challenge your own justification.';
        return;
      }
      this.selectJustificationToChallenge(argument);
    } else if (this.selectedMove === 'rebuttal') {
      if (this.rebutTarget) {
        console.warn(
          '⚠️ Ignoring click because rebutTarget is already set:',
          this.rebutTarget
        );
        return;
      }
      this.selectJustificationToRebut(argument);
    } else {
      console.log('Clicked without active move.');
    }
  }

  /**
   * Handler for multi-select dropdown value changes.
   * Mirrors selection into `selectedJustifications`.
   */
  onSelectionChange(selections: SelectedOption[]) {
    this.selectedReasons = selections;
    console.log('Selected reasons:', selections);

    this.selectedJustifications = selections;
  }

  /**
   * Generic statement click handler used by template:
   * routes the click to challenge/rebut flows depending on selectedMove.
   */
  onStatementClicked(statement: any): void {
    this.selectedStatementId = statement.id;

    if (this.selectedMove === 'challenge') {
      this.selectJustificationToChallenge(statement);
    } else if (this.selectedMove === 'rebuttal') {
      this.selectJustificationToRebut(statement);
    }

    this.selectedMove = '';
  }

  /**
   * Appends a move to the history with the current timestamp.
   */
  logMove(
    actor: 'Proponent' | 'Opponent',
    type: Move['type'],
    content: string
  ) {
    this.moveHistoryList.push({
      actor,
      type,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Convenience getter: returns all rebuttals attached to the root claim.
   */
  getRebuttalsToRootClaim(): any[] {
    return this.argumentPath.filter(
      (arg) => arg.parentId === this.argumentPath[0]?.id && arg.isRebuttal
    );
  }

  /**
   * Tree node selection handler (from tree UI):
   * creates a justification entry, logs the move, flips the turn.
   */
  handleTreeNodeSelect(selectedNode: any): void {
    const justificationEntry = {
      id: selectedNode.id,
      text: selectedNode.text,
      source: { name: null },
      parentId: this.currentlyChallengedId || this.rootArgument.id,
      moveType: 'Claim',
      stance: this.currentTurn,
    };

    this.argumentPath.push(justificationEntry);

    this.logMove(
      this.currentTurn === 'proponent' ? 'Proponent' : 'Opponent',
      'Justify',
      `Justified with: "${selectedNode.text}"`
    );

    this.justificationTree = null;
    this.showJustificationOptions = false;
    this.turnCounts[this.currentTurn]++;
    this.currentlyChallengedId = null;
    this.statusMessage = '';
    this.currentTurn =
      this.currentTurn === 'proponent' ? 'opponent' : 'proponent';
    this.startTurnTimer();
  }

  /** Lifecycle: cleanup interval on destroy. */
  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }

  /**
   * Helper: loads existing rebuttals for a given claim and normalizes
   * them for display under the rebuttal textarea.
   */
  private loadRebuttalsFor(targetClaimId: number): void {
    this.argumentService.getRebuttalsForTarget(targetClaimId).subscribe({
      next: (items) => {
        console.log('📥 Rebuttals loaded for target:', targetClaimId, items);
        // Keep a map cache if needed elsewhere
        this.rebuttalsByTarget.set(targetClaimId, items as any);

        // Normalize to a simple list we can render under the textarea
        this.activeRebuttals = (items as any[]).map((r) => ({
          id: (r as any).statementId ?? (r as any).id,
          text: (r as any).text,
          source: (r as any).source ?? null,
        }));
      },
      error: (err) => console.error('❌ Failed to fetch rebuttals:', err),
    });
  }
}
