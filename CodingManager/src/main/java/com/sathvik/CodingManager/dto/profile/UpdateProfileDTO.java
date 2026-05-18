package com.sathvik.CodingManager.dto.profile;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileDTO {
    private String name;
    private String gender;
    private Integer age;

    private String leetcodeUsername;
    private String codeforcesUsername;
    private String codechefUsername;
    private String geeksforgeeksUsername;
    private String interviewbitUsername;
    private String spojUsername;
}
