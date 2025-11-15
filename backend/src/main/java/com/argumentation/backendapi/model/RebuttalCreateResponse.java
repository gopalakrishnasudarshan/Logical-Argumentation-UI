package com.argumentation.backendapi.model;

/**
 * RebuttalCreateResponse
 * -----------------------
 * A response DTO (Data Transfer Object) that carries the details of
 * a newly created rebuttal back to the frontend.
 *
 * It is returned by:
 *   - RebuttalController#create(@RequestBody RebuttalCreateRequest req)
 *
 * This class is immutable — all fields are declared final and set via constructor.
 */
public class RebuttalCreateResponse {

    /**
     * The ID of the newly created argument representing this rebuttal.
     * Refers to arguments.id in the database.
     */
    private final Integer argumentId;

    /**
     * The ID of the new statement (text) created for this rebuttal.
     * Refers to statements.id in the database.
     */
    private final Integer statementId;

    /**
     * The content (text) of the rebuttal.
     */
    private final String text;

    /**
     * The name of the source associated with this rebuttal.
     */
    private final String source;

    // Constructor initializes all final fields
    public RebuttalCreateResponse(Integer argumentId, Integer statementId, String text, String source) {
        this.argumentId = argumentId;
        this.statementId = statementId;
        this.text = text;
        this.source = source;
    }

    // ────────────────────────────────
    // Getters (no setters → immutable)
    // ────────────────────────────────

    public Integer getArgumentId() {
        return argumentId;
    }

    public Integer getStatementId() {
        return statementId;
    }

    public String getText() {
        return text;
    }

    public String getSource() {
        return source;
    }
}
