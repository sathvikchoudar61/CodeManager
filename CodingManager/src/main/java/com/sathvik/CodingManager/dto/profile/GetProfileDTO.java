package com.sathvik.CodingManager.dto.profile;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetProfileDTO {
    private String username;
    private String name;
    private String email;
    private String gender;
    private Integer age;
    private Integer targetProblems;

    private String leetcodeUsername;
    private String codeforcesUsername;
    private String codechefUsername;
    private String geeksforgeeksUsername;
    private String interviewbitUsername;
    private String spojUsername;

}
