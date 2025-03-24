package com.backend.givu.model.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class FavoritesDTO {
    private long userId;
    private int fundingId;
}
