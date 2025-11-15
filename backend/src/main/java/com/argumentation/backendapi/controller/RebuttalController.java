package com.argumentation.backendapi.controller;

import com.argumentation.backendapi.model.RebuttalCreateRequest;
import com.argumentation.backendapi.model.RebuttalCreateResponse;
import com.argumentation.backendapi.service.RebuttalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RebuttalController
 * -------------------
 * This REST controller handles all HTTP requests related to "rebuttals".
 * It exposes endpoints to:
 *   1. Create a new rebuttal for a given claim.
 *   2. Retrieve all rebuttals targeting a specific claim.
 */
@RestController                     // Marks this class as a REST controller returning JSON responses.
@CrossOrigin                        // Allows cross-origin requests (useful for Angular frontend).
@RequestMapping("/api/rebuttals")   // Base URL path for all rebuttal-related endpoints.
public class RebuttalController {

    private final RebuttalService rebuttalService; // Service layer dependency for business logic.

    // Constructor injection for the RebuttalService dependency.
    public RebuttalController(RebuttalService rebuttalService) {
        this.rebuttalService = rebuttalService;
    }

    /**
     * Endpoint: POST /api/rebuttals
     * -----------------------------
     * Creates a new rebuttal for a specific target claim.
     *
     * @param req The request body containing rebuttal details (text, targetClaimId, etc.)
     * @return A ResponseEntity containing the created rebuttal details.
     */
    @PostMapping
    public ResponseEntity<RebuttalCreateResponse> create(@RequestBody RebuttalCreateRequest req) {
        return ResponseEntity.ok(rebuttalService.createRebuttal(req));
    }

    /**
     * Endpoint: GET /api/rebuttals?targetClaimId={id}
     * -----------------------------------------------
     * Retrieves all rebuttals associated with a given target claim.
     *
     * @param targetClaimId The ID of the claim being targeted by rebuttals.
     * @return A ResponseEntity containing a list of RebuttalCreateResponse objects.
     */
    @GetMapping
    public ResponseEntity<List<RebuttalCreateResponse>> listByTarget(@RequestParam("targetClaimId") Integer targetClaimId) {
        return ResponseEntity.ok(rebuttalService.getRebuttalsForTarget(targetClaimId));
    }
}
