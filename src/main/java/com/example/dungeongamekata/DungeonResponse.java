package com.example.dungeongamekata;

import java.util.List;

public record DungeonResponse(int minimumHP, List<int[]> path) {}