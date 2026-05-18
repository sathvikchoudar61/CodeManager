package com.sathvik.CodingManager.repository;

import com.sathvik.CodingManager.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    User findByUsername(String username);

    User findByVerificationTokenAndVerificationTokenExpiresAtAfter(
            String token,
            Date date
    );

    User findByResetPasswordTokenAndResetPasswordExpiresAtAfter(
            String token,
            Date date
    );

    User findByEmailUpdateTokenAndEmailUpdateTokenExpiresAtAfter(
            String code,
            Date date
    );
}