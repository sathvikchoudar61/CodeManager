package com.sathvik.CodingManager.repository;

import com.sathvik.CodingManager.model.problemoftheday.ProblemOfTheDay;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemOfTheDayRepository extends MongoRepository<ProblemOfTheDay, String> {
}