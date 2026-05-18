package com.sathvik.CodingManager.controller;

import com.sathvik.CodingManager.service.platform.PlatformGetService;
import com.sathvik.CodingManager.service.platform.PlatformUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/platforms")
public class PlatformController {

    @Autowired
    private PlatformGetService platformGetService;

    @Autowired
    private PlatformUpdateService platformUpdateService;


    @GetMapping
    public ResponseEntity<?> getAllPlatformData(Authentication auth) {
        return platformGetService.getAllPlatformData(auth.getName());
    }

    @GetMapping("/{platform}")
    public ResponseEntity<?> getPlatformData(
            Authentication auth,
            @PathVariable String platform) {
        return platformGetService.getPlatformData(auth.getName(), platform);
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAllPlatform(Authentication auth){
        return platformUpdateService.updateAllStats(auth.getName());
    }

    @PostMapping("/refresh/{platform}")
    public ResponseEntity<?> refreshPlatform(Authentication auth,@PathVariable String platform){
        return platformUpdateService.updateStats(auth.getName(),platform);
    }

}

