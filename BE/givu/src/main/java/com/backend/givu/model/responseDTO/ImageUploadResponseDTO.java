package com.backend.givu.model.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class ImageUploadResponseDTO {
    private String imageUrl;
    private String message;

    public ImageUploadResponseDTO(String imageUrl){
        this.imageUrl = imageUrl;
    }
}
