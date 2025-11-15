package com.argumentation.backendapi.model;

/**
 * RebuttalCreateRequest
 * ----------------------
 * A simple DTO (Data Transfer Object) that represents the payload
 * sent by the frontend when creating a new rebuttal.
 *
 * It is used in:
 *   - RebuttalController#create(@RequestBody RebuttalCreateRequest req)
 *
 * This class does not map directly to a database table — it only
 * carries request data from the frontend to the service layer.
 */
public class RebuttalCreateRequest {

    /**
     * ID of the target claim being rebutted.
     * Refers to statements.id in the database.
     */
    private Integer targetClaimId;

    /**
     * The actual text/content of the rebuttal entered by the user.
     */
    private String text;

    /**
     * The name of the source for this rebuttal.
     * Corresponds to sources.name in the database.
     * If the source does not exist, it can be inserted ("upserted") dynamically.
     */
    private String source;

    // ────────────────────────────────
    // Getters and Setters
    // ────────────────────────────────

    public Integer getTargetClaimId() {
        return targetClaimId;
    }

    public void setTargetClaimId(Integer targetClaimId) {
        this.targetClaimId = targetClaimId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
