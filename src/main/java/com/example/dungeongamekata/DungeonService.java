package com.example.dungeongamekata;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

@Service
public class DungeonService {
    public DungeonResponse calculateMinimumHP(int[][] dungeon) {
        int m = dungeon.length;
        int n = dungeon[0].length;

        int[][] dp = new int[m+1][n+1];

        for (int i = 0; i <= m; i++)
            Arrays.fill(dp[i], Integer.MAX_VALUE);

        dp[m][n-1] = 1;
        dp[m-1][n] = 1;

        for (int i = m-1; i >= 0; i--) {
            for (int j = n-1; j >= 0; j--) {
                int minHp = Math.min(dp[i+1][j], dp[i][j+1])  - dungeon[i][j];
                dp[i][j] = (minHp <= 0) ? 1 : minHp;
            }
        }

        List<int[]> path = new ArrayList<>();
        int i = 0, j = 0;
        while (i < m && j < n) {
            path.add(new int[]{i, j});
            if (i == m - 1 && j == n - 1) break;

            if (i + 1 < m && j + 1 < n) {
                if (dp[i + 1][j] < dp[i][j + 1]) {
                    i++;
                } else {
                    j++;
                }
            } else if (i + 1 < m) {
                i++;
            } else {
                j++;
            }
        }

        return new DungeonResponse(dp[0][0], path);
    }
}
