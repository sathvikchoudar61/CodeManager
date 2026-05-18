package com.sathvik.CodingManager.model.leetcode;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeetCode {
    private String username;
    private int rank=0;
    private int contestRating=0;
    private int noOfContestAttended=0;
    private float topPercent=0;
    private int problemsSolved=0;
    private int easySolved=0;
    private int mediumSolved=0;
    private int hardSolved=0;
    private List<ProblemList> problemList=new ArrayList<>();
}
