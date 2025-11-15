package com.argumentation.backendapi.repository;

import com.argumentation.backendapi.model.SourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * SourceRepository
 * -----------------
 * Repository interface for accessing SourceEntity data.
 *
 * Extends Spring Data JPA’s JpaRepository, providing built-in CRUD operations
 * for managing sources (e.g., finding, inserting, or updating by source name).
 *
 * Primary key type: String (the 'name' field in SourceEntity)
 */
public interface SourceRepository extends JpaRepository<SourceEntity, String> {
    // No custom methods needed currently.
    // JpaRepository already provides:
    //  - findAll(), findById(), save(), deleteById(), etc.
}
