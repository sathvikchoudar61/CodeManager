package com.sathvik.CodingManager.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.util.Date;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class User {
    @Id
    private String id;

    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String name;
    private Integer age;
    private String email;
    private String gender;
    private Date createdAt;
    private String role="USER";
    private Boolean isVerified=false;
    private String verificationToken;
    private Date verificationTokenExpiresAt;
    private String resetPasswordToken;
    private Date resetPasswordExpiresAt;
    private String pendingEmail;
    private String emailUpdateToken;
    private Date emailUpdateTokenExpiresAt;
}
