package com.sathvik.CodingManager.dto.compiler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RunResponseDTO {

    private String output;
    private String error;
    private boolean success;
    private long executionTime;
}