import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, firstValueFrom, from } from 'rxjs';
import { Rebuttal, CreateRebuttalRequest } from '../models/rebuttal';

/**
 * MockArgumentService
 * ------------------------------------------------------------
 * Mock implementation for the Classic View UI to run without a live backend.
 * Fetches static JSON from `assets/mock-data` and simulates CRUD behavior
 * (read from JSON, write to localStorage).
 *
 * All method signatures mirror the real ArgumentService to enable easy swapping.
 */
@Injectable({ providedIn: 'root' })
export class MockArgumentService {
  /** Base directory for locally stored mock JSON files. */
  private base = 'assets/mock-data';

  /** In-memory cache for rebuttals to avoid repeated I/O. */
  private rebuttalsCache: Rebuttal[] | null = null;

  /** LocalStorage key used to persist rebuttals between page reloads. */
  private REBUTTALS_LS_KEY = 'mock_rebuttals';

  constructor(private http: HttpClient) {}

  // ───────────────────────────────────────────────────────────
  // Topics / Root / Justifications (read-only from JSON)
  // ───────────────────────────────────────────────────────────

  /**
   * Retrieves a list of discussion topics.
   * Mirrors `/api/topics`.
   */
  getTopics(): Observable<{ topic: string }[]> {
    return this.http.get<{ topic: string }[]>(`${this.base}/topics.json`);
  }

  /**
   * Retrieves the root claim for a given topic.
   * Mirrors `/api/structured-arguments/by-topic-name?name=...`
   */
  getRootClaimByTopicName(
    topicName: string
  ): Observable<{ id: number; text: string; source: string | null } | null> {
    return this.http
      .get<Record<string, { id: number; text: string; source: string | null }>>(
        `${this.base}/structured-by-topic-name.json`
      )
      .pipe(map((dict) => dict[topicName] ?? null));
  }

  /**
   * Retrieves justifications for a given argument (by argumentId).
   * Mirrors `/api/structured-arguments/justifications?argumentId=...`
   */
  getJustifications(
    argumentId: number
  ): Observable<Array<{ id: number; text: string; source: string | null }>> {
    return this.http
      .get<
        Record<
          string,
          Array<{ id: number; text: string; source: string | null }>
        >
      >(`${this.base}/justifications-by-argument-id.json`)
      .pipe(map((dict) => dict[String(argumentId)] ?? []));
  }

  /**
   * Looks up the argumentId corresponding to a claimId.
   * Mirrors `/api/structured-arguments/argument-by-claim?claimId=...`
   */
  getArgumentIdByClaimId(claimId: number): Observable<number | null> {
    return this.http
      .get<Record<string, number>>(`${this.base}/argument-id-by-claim-id.json`)
      .pipe(map((dict) => dict[String(claimId)] ?? null));
  }

  // ───────────────────────────────────────────────────────────
  // Rebuttals (read/write: JSON + localStorage)
  // ───────────────────────────────────────────────────────────

  /**
   * Loads all rebuttals from localStorage (if present) or from the static JSON.
   * Caches the result in memory to minimize I/O.
   */
  private async loadRebuttals(): Promise<Rebuttal[]> {
    // Return in-memory cache if available.
    if (this.rebuttalsCache) return this.rebuttalsCache;

    // Attempt to restore from localStorage.
    const fromLS = localStorage.getItem(this.REBUTTALS_LS_KEY);
    if (fromLS) {
      this.rebuttalsCache = JSON.parse(fromLS) as Rebuttal[];
      return this.rebuttalsCache;
    }

    // Fallback: fetch the initial dataset from the static JSON file.
    const data = await firstValueFrom(
      this.http.get<Rebuttal[]>(`${this.base}/rebuttals.json`)
    );

    this.rebuttalsCache = data ?? [];
    return this.rebuttalsCache;
  }

  /**
   * Persists the current rebuttals cache to localStorage.
   * Simulates a database write in the mock environment.
   */
  private persistRebuttals(): void {
    if (this.rebuttalsCache) {
      localStorage.setItem(
        this.REBUTTALS_LS_KEY,
        JSON.stringify(this.rebuttalsCache)
      );
    }
  }

  /**
   * Retrieves rebuttals for a specific target claim/argument.
   * Mirrors `GET /api/rebuttals/{targetId}`.
   *
   * @param targetClaimId ID of the claim/argument whose rebuttals are requested.
   * @returns Chronologically sorted rebuttals (oldest → newest).
   */
  getRebuttalsForTarget(targetClaimId: number): Observable<Rebuttal[]> {
    return from(this.loadRebuttals()).pipe(
      map((all) =>
        all
          .filter((r) => r.targetClaimId === targetClaimId)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      )
    );
  }

  createRebuttal(req: CreateRebuttalRequest): Observable<Rebuttal> {
    return from(
      (async () => {
        const all = await this.loadRebuttals();

        const nextId = (all.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;

        const created: Rebuttal = {
          id: nextId,
          targetClaimId: req.targetClaimId,
          text: req.text.trim(),
          author: req.author,
          createdAt: new Date().toISOString(),
        };

        all.push(created);
        this.rebuttalsCache = all;
        this.persistRebuttals();

        return created;
      })()
    );
  }

  // ───────────────────────────────────────────────────────────
  // Stubs (safe no-ops for compatibility)
  // ───────────────────────────────────────────────────────────

  getTreeJustifications(_topic: string): Observable<any> {
    return of({});
  }

  getStructuredArgument(_id: number): Observable<any> {
    return of({ id: _id, claim: null, premises: [] });
  }

  getArgumentsByParentId(_parentId: number): Observable<any[]> {
    return of([]);
  }

  getArgumentsByTopic(_topic: string): Observable<any[]> {
    return of([]);
  }

  getReplies(_p: number, _m: string, _s: string): Observable<any[]> {
    return of([]);
  }

  addArgument(arg: any): Observable<any> {
    return of({ ...arg, id: Date.now() });
  }

  getChildrenByParentId(_parentId: number): Observable<any[]> {
    return of([]);
  }
}
