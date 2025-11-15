package com.argumentation.backendapi.repository;

import com.argumentation.backendapi.model.ArgumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * ArgumentRepository
 * -------------------
 * Repository interface for accessing ArgumentEntity data.
 *
 * Extends Spring Data JPA’s JpaRepository, which automatically provides:
 *   - CRUD operations (save, findAll, findById, delete, etc.)
 *   - Paging and sorting capabilities
 *
 * This repository also defines a few custom finder methods
 * to retrieve arguments based on their associated claim.
 */
public interface ArgumentRepository extends JpaRepository<ArgumentEntity, Integer> {

    /**
     * Finds all ArgumentEntity records that reference a given claim ID.
     *
     * @param claimId The ID of the claim (statement) linked to an argument.
     * @return A list of ArgumentEntity objects associated with that claim.
     */
    List<ArgumentEntity> findByClaim_Id(Integer claimId);

    /**
     * Finds the first ArgumentEntity that references a given claim ID.
     * Useful when you only need one matching argument (e.g., for root claim lookup).
     *
     * @param claimId The ID of the claim (statement).
     * @return An Optional containing the ArgumentEntity if found, or empty if not.
     */
    Optional<ArgumentEntity> findFirstByClaim_Id(Integer claimId);
}
