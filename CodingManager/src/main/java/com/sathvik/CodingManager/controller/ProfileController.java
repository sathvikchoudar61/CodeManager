package com.sathvik.CodingManager.controller;

import com.sathvik.CodingManager.dto.profile.*;

import com.sathvik.CodingManager.service.profile.*;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RequestMapping("/profile")
@RestController
public class ProfileController {

    @Autowired
    private GetProfileService getProfileService;

    @Autowired
    private UpdateProfileService updateProfileService;

    @Autowired
    private UpdateEmailService updateEmailService;

    @Autowired
    private VerifyEmailUpdateService verifyEmailUpdateService;

    @Autowired
    private UpdateUsernameService updateUsernameService;

    @Autowired
    private UpdateTargetService updateTargetService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth){
        return getProfileService.getProfileData(auth.getName());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            Authentication auth,
            @RequestBody UpdateProfileDTO profileData){
        return updateProfileService.updateProfileData(auth.getName(), profileData);
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(
            Authentication auth,
            @RequestBody UpdateEmailDTO data){
        return updateEmailService.updateEmailData(auth.getName(), data);
    }

    @PostMapping("/verify-email-update")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyEmailDTO data){
        return verifyEmailUpdateService.verifyEmail(data.getCode());
    }

    @PutMapping("/update-username")
    public ResponseEntity<?> updateUsername(
            Authentication auth,
            @RequestBody UpdateUsernameDTO data){
        return updateUsernameService.updateUsernameData(auth.getName(), data);
    }

    @PutMapping("/update-target")
    public ResponseEntity<?> updateTarget(
            Authentication auth,
            @RequestBody UpdateTargetDTO data){
        return updateTargetService.updateTargetData(auth.getName(), data);
    }

}