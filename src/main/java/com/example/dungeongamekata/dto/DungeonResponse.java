package com.example.dungeongamekata.dto;

import java.util.List;

public record DungeonResponse(int minimumHP, List<int[]> path) {}