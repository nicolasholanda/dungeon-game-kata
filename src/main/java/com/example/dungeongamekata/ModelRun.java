package com.example.dungeongamekata;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("model_runs")
public class ModelRun {
    @Id
    private Long id;
    private String input;
    private String output;
    private LocalDateTime createdAt;

    public ModelRun(Long id, String input, String output, LocalDateTime createdAt) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.createdAt = createdAt;
    }

    public static ModelRun of(String input, String output) {
        return new ModelRun(null, input, output, null);
    }

    public Long getId() { return id; }
    public String getInput() { return input; }
    public String getOutput() { return output; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
