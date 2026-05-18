package com.sathvik.CodingManager.controller;

import com.sathvik.CodingManager.dto.auth.SignUpDTO;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.service.auth.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private LoginService login;
    @Autowired
    private SignUpService signUp;
    @Autowired
    private VerifyEmailService verifyEmail;
    @Autowired
    private ForgotPasswordService forgotPassword;
    @Autowired
    private ResetPasswordService resetPassword;
    @Autowired
    private AuthCheckService authCheck;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User body) {
        return login.loginUser(body.getEmail(), body.getPassword());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDTO body) {
        return signUp.signUpUser(body);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody User body) {
        return verifyEmail.verifyEmail(body.getVerificationToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Logged out successfully"
                )
        );
    }

    @PostMapping("forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User body) {
        return forgotPassword.forgot_Password(body.getEmail());
    }

    @PostMapping("reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody User body, @RequestParam String token) {
        return resetPassword.reset_Password(body.getPassword(), token);
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(
            Authentication auth
    ){
        return authCheck.checkAuth(auth.getName());
    }

}
