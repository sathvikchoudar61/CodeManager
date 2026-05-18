package com.sathvik.CodingManager.service.fetchers;

import com.sathvik.CodingManager.model.interviewbit.InterviewBit;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewBitFetcherService {

    public InterviewBit updatedStats(String username) {

        InterviewBit interviewBit =
                new InterviewBit();

        WebDriverManager.chromedriver().setup();

        ChromeOptions options =
                new ChromeOptions();

        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        WebDriver driver =
                new ChromeDriver(options);

        try {

            String url =
                    "https://www.interviewbit.com/profile/" +
                            username +
                            "/";

            driver.get(url);

            Thread.sleep(8000);

            interviewBit.setUsername(username);

            String text =
                    driver.findElement(
                            By.tagName("body")
                    ).getText();

            interviewBit.setGlobalRank(
                    extract(text, "Global Rank")
            );

            interviewBit.setProblemsSolved(
                    extract(text, "PROBLEMS")
            );

            interviewBit.setTotalScore(
                    extract(text, "TOTAL SCORE")
            );

            interviewBit.setCoins(
                    extract(text, "COINS")
            );

            interviewBit.setStreak(
                    extract(text, "STREAK")
            );

            interviewBit.setEasyProblemsSolved(
                    extract(text, "Easy")
            );

            interviewBit.setMediumProblemsSolved(
                    extract(text, "Medium")
            );

            interviewBit.setHardProblemsSolved(
                    extract(text, "Hard")
            );

            List<String> skills =
                    new ArrayList<>();

            addSkill(text, "Arrays", skills);
            addSkill(text, "Strings", skills);
            addSkill(text, "Math", skills);
            addSkill(text, "Two Pointers", skills);
            addSkill(text, "Dynamic Programming", skills);
            addSkill(text, "Graphs", skills);

            interviewBit.setTopSkills(skills);

        }

        catch (Exception e) {

            e.printStackTrace();
        }

        finally {

            driver.quit();
        }

        return interviewBit;
    }

    private int extract(
            String text,
            String key
    ) {

        try {

            int index =
                    text.indexOf(key);

            if (index == -1) {
                return 0;
            }

            String sub =
                    text.substring(
                            index,
                            Math.min(index + 100, text.length())
                    );

            String[] tokens =
                    sub.split("\\s+");

            for (String token : tokens) {

                token =
                        token.replaceAll("[^0-9]", "");

                if (!token.isEmpty()) {

                    return Integer.parseInt(token);
                }
            }

        }

        catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }

    private void addSkill(
            String text,
            String skill,
            List<String> skills
    ) {

        if (
                text.toLowerCase()
                        .contains(
                                skill.toLowerCase()
                        )
        ) {

            skills.add(skill);
        }
    }
}