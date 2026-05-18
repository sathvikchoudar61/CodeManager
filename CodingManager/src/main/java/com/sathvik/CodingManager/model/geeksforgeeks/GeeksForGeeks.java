package com.sathvik.CodingManager.model.geeksforgeeks;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeeksForGeeks {
    private String username;
    private int problemsSolved=0;
    private int schoolProblemsSolved=0;
    private int basicProblemsSolved=0;
    private int easyProblemsSolved=0;
    private int mediumProblemsSolved=0;
    private int hardProblemsSolved=0;
    private int score=0;
    private int POTDStreak=0;
}
