package com.argumentation.backendapi.model;

import java.util.ArrayList;
import java.util.List;

/**
 * TreeNodeDTO
 * ------------
 * (⚠️ Currently not used)
 *
 * A Data Transfer Object designed to represent a node in a hierarchical tree.
 * Each node contains:
 *   - An ID (e.g., statement or argument ID)
 *   - Text content (e.g., the claim or justification)
 *   - A list of child nodes (forming the argument tree)
 *
 * Could be useful for future features such as:
 *   - Returning the entire argument tree in one API response
 *   - Visualizing nested debates or justifications recursively
 */
public class TreeNodeDTO {

    /** Unique identifier (e.g., statement or argument ID) */
    private int id;

    /** Text or content for this node (e.g., claim, justification, or rebuttal) */
    private String text;

    /** Recursive list of child nodes (each representing a supporting argument) */
    private List<TreeNodeDTO> children = new ArrayList<>();

    // Default constructor (needed for frameworks like Jackson)
    public TreeNodeDTO() {}

    // Convenience constructor
    public TreeNodeDTO(int id, String text) {
        this.id = id;
        this.text = text;
    }

    // ────────────────────────────────
    // Getters and Setters
    // ────────────────────────────────

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<TreeNodeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNodeDTO> children) {
        this.children = children;
    }

    /** Adds a single child node to the current node */
    public void addChild(TreeNodeDTO child) {
        this.children.add(child);
    }
}
