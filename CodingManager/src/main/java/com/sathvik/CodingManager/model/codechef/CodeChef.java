package com.sathvik.CodingManager.model.codechef;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeChef {
    private String username;
    private int rating;
    private int highestRating;
    private int globalRank;
    private int noOfContestAttended;
    private int stars;
    private int problemsSolved;
    private String countryName;
    private List<Integer> ratingHistory = new ArrayList<>();
}