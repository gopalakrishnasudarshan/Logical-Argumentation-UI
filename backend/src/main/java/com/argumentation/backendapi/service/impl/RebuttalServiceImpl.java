package com.argumentation.backendapi.service.impl;

import com.argumentation.backendapi.model.*;
import com.argumentation.backendapi.repository.ArgumentRepository;
import com.argumentation.backendapi.repository.SourceRepository;
import com.argumentation.backendapi.repository.StatementRepository;
import com.argumentation.backendapi.service.RebuttalService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * RebuttalServiceImpl
 * --------------------
 * Implements creation and retrieval of rebuttals.
 * Flow for create:
 *   1) Validate input & ensure target statement exists
 *   2) Upsert Source (defaults to "User" if not provided)
 *   3) Create new Statement with counter_statement = target
 *   4) Create new Argument pointing to the new statement
 *   5) Return a compact DTO for the frontend
 */
@Service
public class RebuttalServiceImpl implements RebuttalService {

    private final StatementRepository statementRepository;
    private final SourceRepository sourceRepository;
    private final ArgumentRepository argumentRepository;

    // Constructor injection for repositories (testable, immutable)
    public RebuttalServiceImpl(StatementRepository statementRepository,
                               SourceRepository sourceRepository,
                               ArgumentRepository argumentRepository) {
        this.statementRepository = statementRepository;
        this.sourceRepository = sourceRepository;
        this.argumentRepository = argumentRepository;
    }

    /**
     * Creates a rebuttal to the given target claim.
     * Wrapped in a transaction to ensure all-or-nothing persistence
     * (source upsert, statement insert, argument insert).
     */
    @Override
    @Transactional
    public RebuttalCreateResponse createRebuttal(RebuttalCreateRequest request) {
        // Basic validation: must have target and non-blank text
        if (request.getTargetClaimId() == null || request.getText() == null || request.getText().isBlank()) {
            throw new IllegalArgumentException("targetClaimId and text are required");
        }

        // 1) Ensure target statement exists
        StatementEntity target = statementRepository.findById(request.getTargetClaimId())
                .orElseThrow(() -> new IllegalArgumentException("Target statement not found: " + request.getTargetClaimId()));

        // 2) Upsert/ensure Source (default to "User" if none provided)
        String sourceName = (request.getSource() == null || request.getSource().isBlank()) ? "User" : request.getSource();
        SourceEntity source = sourceRepository.findById(sourceName)
                .orElseGet(() -> {
                    SourceEntity s = new SourceEntity();
                    s.setName(sourceName);
                    s.setText(null);
                    s.setUrl(null);
                    return sourceRepository.save(s);
                });

        // 3) Create new rebuttal Statement, pointing counter_statement → target
        StatementEntity rebuttalStmt = new StatementEntity();
        rebuttalStmt.setText(request.getText().trim());
        rebuttalStmt.setCounterStatement(target);
        rebuttalStmt.setSource(source);
        rebuttalStmt = statementRepository.save(rebuttalStmt);

        // 4) Create new Argument whose claim = the new rebuttal statement
        ArgumentEntity rebuttalArg = new ArgumentEntity();
        rebuttalArg.setClaim(rebuttalStmt);
        rebuttalArg.setSource(source);
        rebuttalArg = argumentRepository.save(rebuttalArg);

        // 5) Return lightweight response DTO for the frontend
        return new RebuttalCreateResponse(
                rebuttalArg.getId(),
                rebuttalStmt.getId(),
                rebuttalStmt.getText(),
                source.getName()
        );
    }

    /**
     * Retrieves all rebuttals that directly oppose the given target claim.
     * We look for statements whose counter_statement == targetClaimId,
     * and (optionally) resolve their Argument IDs if present.
     */
    @Override
    public List<RebuttalCreateResponse> getRebuttalsForTarget(Integer targetClaimId) {
        // Find all statements that cite the target as their counter_statement
        List<StatementEntity> rebuttalStatements = statementRepository.findByCounterStatement_Id(targetClaimId);

        // Map each statement to a response; argumentId resolved if an Argument exists
        return rebuttalStatements.stream().map(stmt -> {
            Integer argumentId = argumentRepository.findByClaim_Id(stmt.getId())
                    .stream()
                    .findFirst()
                    .map(ArgumentEntity::getId)
                    .orElse(null);

            return new RebuttalCreateResponse(
                    argumentId,
                    stmt.getId(),
                    stmt.getText(),
                    (stmt.getSource() != null ? stmt.getSource().getName() : null)
            );
        }).toList();
    }

}
