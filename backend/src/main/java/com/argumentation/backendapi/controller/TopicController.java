package com.argumentation.backendapi.controller;

import com.argumentation.backendapi.model.TopicEntity;
import com.argumentation.backendapi.repository.TopicRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * TopicController
 * ----------------
 * This controller exposes endpoints related to discussion topics.
 * It provides a simple API to retrieve all available topics stored in the database.
 */
@RestController
@RequestMapping("/api")              // Base path for all topic-related endpoints
@CrossOrigin(origins = "*")          // Allow requests from any frontend origin (can restrict later)
public class TopicController {

    private final TopicRepository topicRepository; // Dependency to access the topics table

    // Constructor injection of TopicRepository
    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    /**
     * Endpoint: GET /api/topics
     * -------------------------
     * Retrieves all topics available in the database.
     *
     * The Angular frontend expects the data in the following JSON structure:
     * [
     *   { "topic": "Television" },
     *   { "topic": "Social Media" },
     *   ...
     * ]
     *
     * @return A list of topic maps, each containing the "topic" key used by the frontend.
     */
    @GetMapping("/topics")
    public List<Map<String, String>> getAllTopics() {
        // Fetch all topics from the repository
        List<TopicEntity> topics = topicRepository.findAll();

        // Build the response in the format expected by Angular
        List<Map<String, String>> result = new ArrayList<>();
        for (TopicEntity topic : topics) {
            Map<String, String> topicMap = new HashMap<>();
            topicMap.put("topic", topic.getName()); // Key "topic" matches frontend expectations
            result.add(topicMap);
        }

        return result;
    }
}
