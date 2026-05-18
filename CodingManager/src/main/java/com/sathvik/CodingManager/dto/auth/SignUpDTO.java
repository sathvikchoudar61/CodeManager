package com.sathvik.CodingManager.dto.auth;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpDTO {
    private String username;
    private String password;
    private String name;
    private Integer age;
    private String email;
    private String gender;
    private String leetcodeUsername;
    private String codeforcesUsername;
    private String codechefUsername;
    private String geeksforgeeksUsername;
    private String interviewbitUsername;
    private String spojUsername;
}
