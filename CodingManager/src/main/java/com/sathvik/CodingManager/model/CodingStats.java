package com.sathvik.CodingManager.model;
import com.sathvik.CodingManager.model.codechef.CodeChef;
import com.sathvik.CodingManager.model.codeforces.CodeForces;
import com.sathvik.CodingManager.model.geeksforgeeks.GeeksForGeeks;
import com.sathvik.CodingManager.model.interviewbit.InterviewBit;
import com.sathvik.CodingManager.model.leetcode.LeetCode;
import com.sathvik.CodingManager.model.spoj.Spoj;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "coding_stats")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodingStats {
    @Id
    private String id;

    private String userId;

    private int problemsSolved=0;
    private int targetProblems=0;
    private LeetCode leetcode;
    private CodeChef codechef;
    private CodeForces codeforces;
    private GeeksForGeeks geeksforgeeks;
    private InterviewBit interviewbit;
    private Spoj spoj;
}
