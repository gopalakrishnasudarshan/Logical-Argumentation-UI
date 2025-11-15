package com.argumentation.backendapi.repository;

import com.argumentation.backendapi.model.PremiseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * PremiseRepository
 * ------------------
 * Repository interface for accessing PremiseEntity data.
 *
 * Extends Spring Data JPA’s JpaRepository to provide standard CRUD operations.
 * The 'premises' table represents the many-to-many relationship between
 * arguments and their supporting statements (premises).
 */
public interface PremiseRepository extends JpaRepository<PremiseEntity, Integer> {

    /**
     * Finds all premise records linked to a specific argument.
     *
     * @param argumentId The ID of the argument whose premises are to be fetched.
     * @return A list of PremiseEntity objects associated with the given argument.
     */
    List<PremiseEntity> findByArgument_Id(Integer argumentId);
}
