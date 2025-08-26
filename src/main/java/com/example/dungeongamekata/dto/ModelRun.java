package com.example.dungeongamekata.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Table("model_runs")
public class ModelRun {
    @Id
    private Long id;
    private String input;
    private String output;
    private LocalDateTime createdAt;

    public static ModelRun of(String input, String output) {
        LocalDateTime now = LocalDateTime.now();
        return new ModelRun(null, input, output, now);
    }
}
