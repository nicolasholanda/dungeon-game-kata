package com.example.dungeongamekata.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "model_runs")
public class ModelRun {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String input;

    @Column(nullable = false)
    private String output;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public static ModelRun of(String input, String output) {
        LocalDateTime now = LocalDateTime.now();
        return new ModelRun(null, input, output, now);
    }
}
