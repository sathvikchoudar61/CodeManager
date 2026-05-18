package com.sathvik.CodingManager.repository;

import com.sathvik.CodingManager.model.CodingStats;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CodingStatsRepository extends MongoRepository<CodingStats,String> {

    CodingStats findByUserId(String userId);
}