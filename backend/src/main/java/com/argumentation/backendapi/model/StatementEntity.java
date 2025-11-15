package com.argumentation.backendapi.model;

import jakarta.persistence.*;

/**
 * StatementEntity
 * ----------------
 * Represents a single statement or claim in the argumentation system.
 * A statement can act as:
 *   - A root claim of an argument,
 *   - A justification (premise) supporting another claim,
 *   - Or a counter-statement opposing another statement.
 *
 * Table: statements
 */
@Entity
@Table(name = "statements")
public class StatementEntity {

    /**
     * Primary key: unique identifier for the statement.
     * Auto-incremented in the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * The actual text or content of the statement.
     * Cannot be null, limited to 1024 characters.
     */
    @Column(nullable = false, length = 1024)
    private String text;

    /**
     * Self-referential many-to-one relationship.
     * Represents the *counter-statement* (i.e., a rebuttal or opposing view).
     *
     * Example:
     *   Statement A → has counterStatement B (meaning B refutes A).
     */
    @ManyToOne
    @JoinColumn(name = "counter_statement") // foreign key to statements.id
    private StatementEntity counterStatement;

    /**
     * Optional reference to the source of this statement.
     * Example: a book, article, or website from which the claim originates.
     */
    @ManyToOne
    @JoinColumn(name = "source", referencedColumnName = "name") // foreign key to sources.name
    private SourceEntity source;

    // ────────────────────────────────
    // Getters and Setters
    // ────────────────────────────────

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public StatementEntity getCounterStatement() {
        return counterStatement;
    }

    public void setCounterStatement(StatementEntity counterStatement) {
        this.counterStatement = counterStatement;
    }

    public SourceEntity getSource() {
        return source;
    }

    public void setSource(SourceEntity source) {
        this.source = source;
    }
}
