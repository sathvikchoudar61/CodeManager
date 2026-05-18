package com.sathvik.CodingManager.repository;

import com.sathvik.CodingManager.model.Contest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContestRepository extends MongoRepository<Contest, Long> {
}