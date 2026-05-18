package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class ForgotPasswordService {

    @Value("${client.url}")
    private String ClientURL;

    @Autowired
    UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    public ResponseEntity<?> forgot_Password(String email){
        User user=userRepository.findByEmail(email);
        if(user==null){
            return ResponseEntity.ok(
                    Map.of(
                            "success",true,
                            "message","If account exists, reset email sent"
                    )
            );
        }
        user.setResetPasswordToken(
                UUID.randomUUID().toString()
        );
        user.setResetPasswordExpiresAt(new Date(System.currentTimeMillis() +  60 * 60 * 1000));
        userRepository.save(user);
        String resetURL = ClientURL+"/reset-password/"+user.getResetPasswordToken();
        emailService.sendEmail(user.getEmail(),"Reset Password",resetURL);
        return ResponseEntity.ok(
                Map.of(
                        "success",true,
                        "message","email has been sent"
                )
        );
    }
}
