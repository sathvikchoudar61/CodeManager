package com.sathvik.CodingManager.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthcheckDTO {
    private String id;
    private String username;
    private String name;
    private Integer age;
    private String email;
    private String gender;
    private Date createdAt;
    private String role;
    private Boolean isVerified;

}
