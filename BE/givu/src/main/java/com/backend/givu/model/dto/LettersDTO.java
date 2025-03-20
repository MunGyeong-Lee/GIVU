package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.LettersPrivate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LettersDTO {
    private int letterId;
    private int fundingId;
    private long userId;
    private String comment;
    private String image;
    private LettersPrivate access;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
