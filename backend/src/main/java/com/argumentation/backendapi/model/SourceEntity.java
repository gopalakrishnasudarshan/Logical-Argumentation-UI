package com.argumentation.backendapi.model;

import jakarta.persistence.*;

/**
 * SourceEntity
 * -------------
 * Represents a source or reference from which a claim, argument,
 * or rebuttal originates. This may include the author's name,
 * a short description, and a URL for verification.
 *
 * Table: sources
 */
@Entity
@Table(name = "sources")
public class SourceEntity {

    /**
     * Primary key: the unique name of the source.
     * Example: "BBC News", "Wikipedia", "Stanford AI Paper"
     *
     * Note: using 'name' as the primary key instead of an auto-generated ID
     * simplifies upsert operations (reusing existing sources by name).
     */
    @Id
    private String name;

    /**
     * Optional textual description or context about the source.
     * Example: "A news report published in 2023."
     */
    private String text;

    /**
     * Optional URL pointing to the online version of the source.
     */
    private String url;

    // ────────────────────────────────
    // Getters and Setters
    // ────────────────────────────────

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
