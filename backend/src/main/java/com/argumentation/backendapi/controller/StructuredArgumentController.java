package com.argumentation.backendapi.controller;

import com.argumentation.backendapi.model.*;
import com.argumentation.backendapi.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * StructuredArgumentController
 * -----------------------------
 * This controller provides REST endpoints for fetching structured argument data.
 * It connects Topics → Arguments → Claims → Premises, allowing the frontend
 * to reconstruct argument trees (claims, justifications, and their relationships).
 */
@RestController
@RequestMapping("/api/structured-arguments")
@CrossOrigin(origins = "*") // Allow requests from any frontend origin (can restrict later if needed)
public class StructuredArgumentController {

    // Injected repository dependencies for database access
    private final TopicRepository topicRepository;
    private final ArgumentRepository argumentRepository;
    private final PremiseRepository premiseRepository;

    // Constructor-based dependency injection (recommended for immutability and testing)
    public StructuredArgumentController(
            TopicRepository topicRepository,
            ArgumentRepository argumentRepository,
            PremiseRepository premiseRepository) {
        this.topicRepository = topicRepository;
        this.argumentRepository = argumentRepository;
        this.premiseRepository = premiseRepository;
    }

    /**
     * Endpoint: GET /api/structured-arguments/by-topic-name
     * -----------------------------------------------------
     * Fetches the root claim (main statement) associated with a given topic name.
     *
     * Example request:
     *   GET /api/structured-arguments/by-topic-name?name=Television
     *
     * @param name The topic name (e.g., "Television").
     * @return A map containing claim ID, text, and source name.
     */
    @GetMapping("/by-topic-name")
    public Map<String, Object> getRootClaimByTopicName(@RequestParam String name) {
        // Find topic by name, throw error if not found
        TopicEntity topic = topicRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + name));

        // Extract related argument and its main claim (statement)
        ArgumentEntity argument = topic.getArgument();
        StatementEntity claim = argument.getClaim();

        // Build a response map to send simplified data to the frontend
        Map<String, Object> response = new HashMap<>();
        response.put("id", claim.getId());
        response.put("text", claim.getText());
        response.put("source", claim.getSource() != null ? claim.getSource().getName() : null);

        return response;
    }

    /**
     * Endpoint: GET /api/structured-arguments/justifications
     * -------------------------------------------------------
     * Fetches all justifications (premises) supporting a given argument.
     *
     * Example request:
     *   GET /api/structured-arguments/justifications?argumentId=5
     *
     * @param argumentId The ID of the argument whose justifications are needed.
     * @return A list of premise objects containing id, text, and source.
     */
    @GetMapping("/justifications")
    public List<Map<String, Object>> getJustificationsByArgumentId(@RequestParam Integer argumentId) {
        // Validate that the argument exists
        ArgumentEntity argument = argumentRepository.findById(argumentId)
                .orElseThrow(() -> new RuntimeException("Argument not found with ID: " + argumentId));

        // Fetch premises linked to the argument
        List<PremiseEntity> premises = premiseRepository.findByArgument_Id(argumentId);

        // Build and return a simplified JSON-friendly response
        List<Map<String, Object>> response = new ArrayList<>();
        for (PremiseEntity premise : premises) {
            StatementEntity stmt = premise.getPremise();
            Map<String, Object> data = new HashMap<>();
            data.put("id", stmt.getId());
            data.put("text", stmt.getText());
            data.put("source", stmt.getSource() != null ? stmt.getSource().getName() : null);
            response.add(data);
        }
        return response;
    }

    /**
     * Endpoint: GET /api/structured-arguments/argument-by-claim
     * ----------------------------------------------------------
     * Retrieves the Argument ID associated with a given Claim (Statement) ID.
     * Used to trace back from a claim to its parent argument.
     *
     * Example request:
     *   GET /api/structured-arguments/argument-by-claim?claimId=12
     *
     * @param claimId The ID of the claim.
     * @return The corresponding argument ID, or 404 if not found.
     */
    @GetMapping("/argument-by-claim")
    public ResponseEntity<Integer> getArgumentIdByClaimId(@RequestParam Integer claimId) {
        List<ArgumentEntity> arguments = argumentRepository.findByClaim_Id(claimId);

        if (!arguments.isEmpty()) {
            return ResponseEntity.ok(arguments.get(0).getId()); // Return first match
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint: GET /api/structured-arguments/argument-id-by-claim
     * -------------------------------------------------------------
     * Similar to the previous endpoint, but uses an Optional-based query
     * for more explicit handling of missing data.
     *
     * @param claimId The claim (statement) ID.
     * @return The corresponding argument ID if found; 404 otherwise.
     */
    @GetMapping("/argument-id-by-claim")
    public ResponseEntity<Integer> getArgumentIdByClaim(@RequestParam Integer claimId) {
        Optional<ArgumentEntity> optionalArgument = argumentRepository.findFirstByClaim_Id(claimId);

        return optionalArgument
                .map(argument -> ResponseEntity.ok(argument.getId()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
