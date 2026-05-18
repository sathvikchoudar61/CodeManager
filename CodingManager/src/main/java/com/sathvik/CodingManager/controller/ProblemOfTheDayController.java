package com.sathvik.CodingManager.controller;


import com.sathvik.CodingManager.service.problemoftheday.ProblemOfTheDayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("problem-of-the-day")
public class ProblemOfTheDayController {
    @Autowired
    private ProblemOfTheDayService problemOfTheDayService;

    @GetMapping
    public ResponseEntity<?> getProblems() {
        return problemOfTheDayService.getProblems();
    }

}
