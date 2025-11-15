package com.argumentation.backendapi.repository;

import com.argumentation.backendapi.model.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * TopicRepository
 * ----------------
 * Repository interface for accessing TopicEntity data.
 *
 * Extends JpaRepository to provide full CRUD operations
 * (save, findAll, findById, delete, etc.) for topics.
 *
 * The 'topics' table stores high-level discussion topics,
 * each linked to a root argument.
 */
public interface TopicRepository extends JpaRepository<TopicEntity, Integer> {

    /**
     * Finds a topic by its name (e.g., "Artificial Intelligence", "Television").
     * Used by the StructuredArgumentController to locate the topic
     * before fetching its root claim and argument.
     *
     * @param name The name of the topic to search for.
     * @return An Optional containing the TopicEntity if found, or empty otherwise.
     */
    Optional<TopicEntity> findByName(String name);
}
