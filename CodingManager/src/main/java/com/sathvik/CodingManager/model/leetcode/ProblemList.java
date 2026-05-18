package com.sathvik.CodingManager.model.leetcode;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemList {

    private String title;

    private boolean solved;

    private String leetcodeUrl;
}
