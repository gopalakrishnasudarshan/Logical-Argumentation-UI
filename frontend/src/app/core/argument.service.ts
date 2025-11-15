import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { StructuredArgument } from '../models/structured-argument.model';

/**
 * Data Transfer Object (DTO) for representing a rebuttal entry.
 * Includes optional ID, associated target claim ID, rebuttal text,
 * the actor (Proponent or Opponent), and optional timestamp.
 */
export interface RebuttalDTO {
  id?: number;
  targetClaimId: number;
  text: string;
  actor: 'Proponent' | 'Opponent';
  createdAt?: string;
}

/** Array type alias for lists of RebuttalDTO objects. */
export type RebuttalListDTO = RebuttalDTO[];

/**
 * Injectable Angular service responsible for handling all API calls
 * related to arguments, topics, justifications, and rebuttals.
 * Acts as a communication bridge between the frontend and backend.
 */
@Injectable({
  providedIn: 'root',
})
export class ArgumentService {
  /** Base API URL for argument-related endpoints. */
  private apiUrl = 'http://localhost:8081/api/arguments';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all available discussion topics from the backend.
   * @returns Observable stream of Topic[].
   */
  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>('http://localhost:8081/api/topics');
  }

  /**
   * Retrieves all arguments linked to a specific parent ID.
   * Used to fetch child arguments in a hierarchical structure.
   * @param parentId Parent argument ID.
   * @returns Observable stream of argument objects.
   */
  getArgumentsByParentId(parentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?parent_id=${parentId}`);
  }

  /**
   * Retrieves all arguments for a given topic name.
   * @param topic The name of the topic.
   * @returns Observable stream of argument objects.
   */
  getArgumentsByTopic(topic: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?topic=${topic}`);
  }

  /**
   * Fetches replies (arguments) based on a combination of parent ID,
   * move type (e.g., challenge, rebuttal), and stance (pro/con).
   * @param parentId ID of the argument being replied to.
   * @param moveType The type of move performed.
   * @param stance The stance of the replying actor.
   * @returns Observable stream of reply objects.
   */
  getReplies(
    parentId: number,
    moveType: string,
    stance: string
  ): Observable<any[]> {
    const url = `http://localhost:8081/api/arguments?parent_id=${parentId}&move_type=${moveType}&stance=${stance}`;
    return this.http.get<any[]>(url);
  }

  /**
   * Adds a new argument entry to the backend database.
   * @param arg The argument object containing necessary fields.
   * @returns Observable containing the server response.
   */
  addArgument(arg: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, arg);
  }

  /**
   * Retrieves a structured argument object (with claims, premises, etc.)
   * based on its unique ID.
   * @param id Argument ID.
   * @returns Observable stream of a StructuredArgument.
   */
  getStructuredArgument(id: number): Observable<StructuredArgument> {
    return this.http.get<StructuredArgument>(
      `http://localhost:8081/api/structured-arguments/${id}`
    );
  }

  /**
   * Fetches the root claim associated with a given topic name.
   * Used to initialize the argumentation tree on topic selection.
   * @param topicName Name of the topic.
   * @returns Observable stream containing the root claim data.
   */
  getRootClaimByTopicName(topicName: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8081/api/structured-arguments/by-topic-name?name=${encodeURIComponent(
        topicName
      )}`
    );
  }

  /**
   * Retrieves a list of justifications (premises or supporting arguments)
   * for a specific argument ID.
   * @param argumentId ID of the argument.
   * @returns Observable stream of justifications.
   */
  getJustifications(argumentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8081/api/structured-arguments/justifications?argumentId=${argumentId}`
    );
  }

  /**
   * Fetches the unique argument ID corresponding to a given claim ID.
   * Useful for mapping between claims and their argument containers.
   * @param claimId ID of the claim.
   * @returns Observable emitting a numeric argument ID.
   */
  getArgumentIdByClaimId(claimId: number): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8081/api/structured-arguments/argument-by-claim?claimId=${claimId}`
    );
  }

  /**
   * Retrieves a hierarchical tree of justifications for a specific topic.
   * Used to render structured argumentation visualizations.
   * @param topic Topic name.
   * @returns Observable emitting the full justification tree.
   */
  getTreeJustifications(topic: string): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8081/api/structured-arguments/tree?topic=${topic}`
    );
  }

  /**
   * Fetches all child arguments of a specified parent.
   * Mirrors the backend’s hierarchical mapping for argument trees.
   * @param parentId Parent argument ID.
   * @returns Observable stream of child argument entries.
   */
  getChildrenByParentId(parentId: number) {
    // Matches backend mapping for fetching direct descendants
    return this.http.get<any[]>(`${this.apiUrl}/by-parent/${parentId}`);
  }

  /** Base path for general API endpoints other than 'arguments'. */
  private base = 'http://localhost:8081/api';

  /**
   * Creates and stores a new rebuttal entry in the backend.
   * @param dto RebuttalDTO object containing all necessary data.
   * @returns Observable emitting the saved RebuttalDTO.
   */
  createRebuttal(dto: RebuttalDTO): Observable<RebuttalDTO> {
    return this.http.post<RebuttalDTO>(`${this.base}/rebuttals`, dto);
  }

  /**
   * Retrieves all rebuttals associated with a specific target claim.
   * @param targetClaimId ID of the claim being rebutted.
   * @returns Observable emitting an array of RebuttalDTOs.
   */
  getRebuttalsForTarget(targetClaimId: number): Observable<RebuttalDTO[]> {
    return this.http.get<RebuttalDTO[]>(`${this.base}/rebuttals`, {
      params: { targetClaimId: targetClaimId.toString() },
    });
  }
}
