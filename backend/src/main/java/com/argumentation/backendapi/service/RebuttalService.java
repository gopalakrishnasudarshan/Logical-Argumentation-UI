package com.argumentation.backendapi.service;

import com.argumentation.backendapi.model.RebuttalCreateRequest;
import com.argumentation.backendapi.model.RebuttalCreateResponse;

import java.util.List;

/**
 * RebuttalService
 * ----------------
 * Defines the contract (interface) for all operations related to rebuttals.
 *
 * This service layer abstracts the business logic from controllers,
 * allowing flexible implementations (e.g., database-backed or mock).
 *
 * Implemented by: RebuttalServiceImpl
 */
public interface RebuttalService {

    /**
     * Creates a new rebuttal for a given target claim.
     *
     * @param request A DTO containing the target claim ID, rebuttal text, and optional source.
     * @return A RebuttalCreateResponse DTO containing details of the newly created rebuttal.
     */
    RebuttalCreateResponse createRebuttal(RebuttalCreateRequest request);

    /**
     * Retrieves all rebuttals (counter-statements) associated with a target claim.
     *
     * @param targetClaimId The ID of the claim being rebutted.
     * @return A list of RebuttalCreateResponse objects representing rebuttals to that claim.
     */
    List<RebuttalCreateResponse> getRebuttalsForTarget(Integer targetClaimId);
}
