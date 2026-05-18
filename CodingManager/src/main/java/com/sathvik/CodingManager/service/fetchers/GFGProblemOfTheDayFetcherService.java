package com.sathvik.CodingManager.service.fetchers;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class GFGProblemOfTheDayFetcherService {

    @Async
    public CompletableFuture<Map<String, String>> fetchProblem() {

        Map<String, String> result = new HashMap<>();

        WebDriver driver = null;

        try {

            WebDriverManager.chromedriver().setup();

            ChromeOptions options = new ChromeOptions();

            options.addArguments("--headless=new");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");

            driver = new ChromeDriver(options);

            driver.get(
                    "https://practice.geeksforgeeks.org/problem-of-the-day"
            );

            WebDriverWait wait =
                    new WebDriverWait(driver, Duration.ofSeconds(15));

            WebElement titleElement =
                    wait.until(
                            ExpectedConditions.visibilityOfElementLocated(
                                    By.cssSelector("h1")
                            )
                    );

            String title =
                    titleElement.getText().trim();

            result.put("title", title);

            result.put(
                    "url",
                    driver.getCurrentUrl()
            );

        } catch (Exception e) {

            e.printStackTrace();

            result.put("title", "Unavailable");

            result.put(
                    "url",
                    "https://practice.geeksforgeeks.org/problem-of-the-day"
            );

        } finally {

            if (driver != null) {
                driver.quit();
            }
        }

        return CompletableFuture.completedFuture(result);
    }
}