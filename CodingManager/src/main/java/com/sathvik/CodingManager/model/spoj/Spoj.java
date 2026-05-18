package com.sathvik.CodingManager.model.spoj;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Spoj {
    private String username;
    private int worldRank=0;
    private int problemsSolved=0;
    private int solutionSubmitted=0;
}
