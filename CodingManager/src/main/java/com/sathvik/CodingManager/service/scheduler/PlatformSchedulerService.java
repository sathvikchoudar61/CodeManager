package com.sathvik.CodingManager.service.scheduler;

import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import com.sathvik.CodingManager.service.platform.PlatformUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatformSchedulerService {

    @Autowired
    private CodingStatsRepository codingStatsRepository;

    @Autowired
    private PlatformUpdateService platformUpdateService;

    @Scheduled(fixedRate = 12 * 60 * 60 * 1000)
    public void refreshAllLeetcodeStats(){

        List<CodingStats> allUsers =
                codingStatsRepository.findAll();

        for(CodingStats codingStats : allUsers){

            platformUpdateService.asyncUpdatePlatform(codingStats);
        }
    }
}