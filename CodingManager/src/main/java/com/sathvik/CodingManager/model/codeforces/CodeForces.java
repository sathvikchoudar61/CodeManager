package com.sathvik.CodingManager.model.codeforces;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeForces{
    private String username;
    private int rating=0;
    private int maxRating;
    private String rank;
    private String maxRank;
    private int problemsSolved=0;
    private int noOfContestAttended=0;
    private List<Integer> ratingHistory =
            new ArrayList<>();
}