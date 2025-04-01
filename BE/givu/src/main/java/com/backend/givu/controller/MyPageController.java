package com.backend.givu.controller;


import com.amazonaws.Response;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.CodeMessageDTO;
import com.backend.givu.model.service.MyPageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "MyPage", description = "MyPage 관련 API")
@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final UserRepository userRepository;

    @Operation(summary = "유저 연동계좌 생성", description = "해당 유저의 연동계좌를 생성합니다.")
    @PostMapping("/createAccount")
    public ResponseEntity<CodeMessageDTO> createDepositAccount(@AuthenticationPrincipal CustomUserDetail userDetail){
        Long userId = userDetail.getId();
        User user = userRepository.findById(userId).orElseThrow();
        if(user.getAccountNumber() != null){
            return ResponseEntity.ok(new CodeMessageDTO("0001","이미 연동 계좌가 존재합니다."));
        }
        return ResponseEntity.ok(myPageService.createDepositAccount(user));
    }
}
