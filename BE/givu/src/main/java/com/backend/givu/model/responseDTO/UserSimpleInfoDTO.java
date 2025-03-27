package com.backend.givu.model.responseDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSimpleInfoDTO {
    private Long userId;
    private String nickName;
    private String image;
}
