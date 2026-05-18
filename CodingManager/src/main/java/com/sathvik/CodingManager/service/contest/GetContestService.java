package com.sathvik.CodingManager.service.contest;

import com.sathvik.CodingManager.model.Contest;
import com.sathvik.CodingManager.repository.ContestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GetContestService {

    @Autowired
    private ContestRepository contestRepository;

    public ResponseEntity<?> getContestData() {
        List<Contest> contests = contestRepository.findAll();

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "contests", contests
                )
        );
    }
}
