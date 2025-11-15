package com.argumentation.backendapi.model;

import jakarta.persistence.*;

/**
 * PremiseEntity
 * --------------
 * Represents the link between an Argument and its supporting Premise (Statement).
 * This table models a many-to-many relationship:
 *   - One Argument can have multiple Premises.
 *   - One Statement can serve as a Premise for multiple Arguments.
 *
 * Table: premises
 * Primary key: (argument, premise)
 */
@Entity
@Table(name = "premises")
@IdClass(PremiseId.class)  // Composite key combining argument and premise columns
public class PremiseEntity {

    /**
     * The Argument that this premise supports.
     * Part of the composite primary key.
     * Many premises can belong to the same argument.
     */
    @Id
    @ManyToOne
    @JoinColumn(name = "argument")  // Foreign key to arguments.id
    private ArgumentEntity argument;

    /**
     * The Premise (statement) providing justification for the argument.
     * Part of the composite primary key.
     * Many arguments can reference the same statement as a premise.
     */
    @Id
    @ManyToOne
    @JoinColumn(name = "premise")   // Foreign key to statements.id
    private StatementEntity premise;

    // ────────────────────────────────
    // Getters and Setters
    // ────────────────────────────────

    public ArgumentEntity getArgument() {
        return argument;
    }

    public void setArgument(ArgumentEntity argument) {
        this.argument = argument;
    }

    public StatementEntity getPremise() {
        return premise;
    }

    public void setPremise(StatementEntity premise) {
        this.premise = premise;
    }
}
