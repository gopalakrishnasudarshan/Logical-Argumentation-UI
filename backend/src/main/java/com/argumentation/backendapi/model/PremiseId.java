package com.argumentation.backendapi.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * PremiseId
 * ----------
 * Composite primary key class for the PremiseEntity.
 * It uniquely identifies each record in the 'premises' table
 * using a combination of:
 *   1. argument (foreign key → arguments.id)
 *   2. premise  (foreign key → statements.id)
 *
 * This class must:
 *   - Implement Serializable
 *   - Override equals() and hashCode()
 */
public class PremiseId implements Serializable {

    // Must match the field names in PremiseEntity
    private Integer argument;
    private Integer premise;

    /**
     * equals() and hashCode() are mandatory for composite keys.
     * They ensure proper comparison and identity tracking by JPA/Hibernate.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PremiseId)) return false;
        PremiseId that = (PremiseId) o;
        return Objects.equals(argument, that.argument) &&
                Objects.equals(premise, that.premise);
    }

    @Override
    public int hashCode() {
        return Objects.hash(argument, premise);
    }
}
