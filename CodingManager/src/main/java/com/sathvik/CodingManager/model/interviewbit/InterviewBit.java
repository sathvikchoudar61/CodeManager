package com.sathvik.CodingManager.model.interviewbit;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewBit {
    private String username;
    private int globalRank=0;
    private int problemsSolved=0;
    private int totalScore=0;
    private int coins=0;
    private int streak=0;
    private int easyProblemsSolved;
    private int mediumProblemsSolved;
    private int hardProblemsSolved;
    private List<String> topSkills = new ArrayList<>();
}
