package com.argumentation.backendapi.repository;

import com.argumentation.backendapi.model.StatementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * StatementRepository
 * --------------------
 * Repository interface for accessing StatementEntity data.
 *
 * Extends JpaRepository to provide default CRUD operations
 * for managing statements (claims, premises, and rebuttals).
 */
public interface StatementRepository extends JpaRepository<StatementEntity, Integer> {

    /**
     * Finds all statements that directly reference the given statement
     * as their counter-statement (i.e., rebuttals to it).
     *
     * Example:
     *   If statement B has counterStatement = A,
     *   then findByCounterStatement_Id(A) returns B.
     *
     * @param counterStatementId The ID of the statement being rebutted.
     * @return A list of StatementEntity objects that oppose the given statement.
     */
    List<StatementEntity> findByCounterStatement_Id(Integer counterStatementId);
}
