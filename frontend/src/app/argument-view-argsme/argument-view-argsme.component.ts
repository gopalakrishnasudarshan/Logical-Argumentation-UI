import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/**
 * TopArgItem
 * ------------------------------------------------------------
 * Represents a single top argument entry in either the “pro”
 * or “con” list for a given topic.
 * Each item can include a ranking score and a parent reference
 * for hierarchical grouping if needed.
 */
export interface TopArgItem {
  /** Unique identifier for the argument item. */
  id: number;

  /** Argument text or claim statement. */
  text: string;

  /** Optional relevance or confidence score (if ranked). */
  score?: number;

  /** Optional parent argument ID (for nested argument trees). */
  parentId?: number | null;
}

/**
 * TopArgsForTopic
 * ------------------------------------------------------------
 * Container structure holding the top-N pro and con arguments
 * for a single topic.
 */
export interface TopArgsForTopic {
  /** List of top arguments supporting the topic (Pro). */
  pro: TopArgItem[];

  /** List of top arguments opposing the topic (Con). */
  con: TopArgItem[];
}

/**
 * TopArgsMap
 * ------------------------------------------------------------
 * Maps topic names (keys) to their corresponding top-N argument sets.
 * This mirrors the JSON structure in `assets/mock-data/top-arguments.json`.
 */
export type TopArgsMap = Record<string, TopArgsForTopic>;

/**
 * ArgumentViewArgsmeComponent
 * ------------------------------------------------------------
 * Two-Lane (args.me-style) Argument Viewer
 * ------------------------------------------------------------
 * Displays top-N pro and con arguments for a selected topic
 * using mock JSON data stored locally under `assets/mock-data/`.
 *
 * Responsibilities:
 * - Reads topic and optional `n` parameter (limit) from route or query.
 * - Fetches top arguments for that topic.
 * - Displays loading/error states as needed.
 */
@Component({
  selector: 'app-argument-view-argsme',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './argument-view-argsme.component.html',
  styleUrls: ['./argument-view-argsme.component.css'],
})
export class ArgumentViewArgsmeComponent implements OnInit {
  /** Current topic name derived from route or navigation state. */
  topic = '';

  /** Holds the top pro/con arguments once loaded. */
  topArgs?: TopArgsForTopic;

  /** UI flag: true while data is being loaded. */
  loading = false;

  /** Error message string (shown on load failure). */
  error = '';

  /** Default number of top arguments per side if not overridden via URL. */
  private defaultN = 3;

  constructor(
    /** ActivatedRoute to read params, query params, or navigation state. */
    private route: ActivatedRoute,

    /** HttpClient to fetch local mock JSON data. */
    private http: HttpClient
  ) {}

  /**
   * Lifecycle hook — initializes component state.
   * Determines the topic and fetches top arguments for display.
   */
  ngOnInit(): void {
    // Topic can originate from navigation state, path param, or query param.
    const fromState = (history.state && history.state.topic) as
      | string
      | undefined;
    const paramTopic = this.route.snapshot.paramMap.get('topic') ?? undefined;
    const queryTopic =
      this.route.snapshot.queryParamMap.get('topic') ?? undefined;

    // Determine active topic (fallback: "Television")
    this.topic = fromState || paramTopic || queryTopic || 'Television';

    // Determine the desired top-N count (default = 3)
    const nParam = this.route.snapshot.queryParamMap.get('n');
    const topN = nParam ? Math.max(1, Number(nParam)) : this.defaultN;

    // Fetch the arguments for the selected topic
    this.fetchTopArgs(this.topic, topN);
  }

  /**
   * Fetches the top-N pro and con arguments for a given topic
   * from the mock JSON file (`assets/mock-data/top-arguments.json`).
   *
   * @param topic - Name of the debate topic.
   * @param n - Number of top arguments to display per side.
   */
  private fetchTopArgs(topic: string, n: number): void {
    this.loading = true;
    this.error = '';

    this.http.get<TopArgsMap>('assets/mock-data/top-arguments.json').subscribe({
      next: (map) => {
        const t = map?.[topic];
        // Slice to top N arguments per stance; handle undefined gracefully
        this.topArgs = {
          pro: t?.pro?.slice(0, n) ?? [],
          con: t?.con?.slice(0, n) ?? [],
        };
        this.loading = false;
      },
      error: () => {
        // Fallback: show empty lists and notify user
        this.error = 'Failed to load top arguments.';
        this.topArgs = { pro: [], con: [] };
        this.loading = false;
      },
    });
  }
}
