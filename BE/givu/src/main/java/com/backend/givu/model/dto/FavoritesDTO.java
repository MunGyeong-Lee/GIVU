package com.backend.givu.model.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FavoritesDTO {
    private long userId;
    private int fundingId;
}
