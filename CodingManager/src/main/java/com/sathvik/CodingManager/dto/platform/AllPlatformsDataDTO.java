package com.sathvik.CodingManager.dto.platform;

import com.sathvik.CodingManager.model.codechef.CodeChef;
import com.sathvik.CodingManager.model.codeforces.CodeForces;
import com.sathvik.CodingManager.model.geeksforgeeks.GeeksForGeeks;
import com.sathvik.CodingManager.model.interviewbit.InterviewBit;
import com.sathvik.CodingManager.model.leetcode.LeetCode;
import com.sathvik.CodingManager.model.spoj.Spoj;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllPlatformsDataDTO {
    private int problemsSolved=0;
    private LeetCode leetcode;
    private CodeChef codechef;
    private CodeForces codeforces;
    private GeeksForGeeks geeksforgeeks;
    private InterviewBit interviewbit;
    private Spoj spoj;
}
