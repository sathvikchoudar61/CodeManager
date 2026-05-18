package com.sathvik.CodingManager.controller;

import com.sathvik.CodingManager.service.contest.GetContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contest")
public class ContestController {

    @Autowired
    private GetContestService getContestService;

    @GetMapping()
    public ResponseEntity<?> getContest() {
        return getContestService.getContestData();
    }
}
