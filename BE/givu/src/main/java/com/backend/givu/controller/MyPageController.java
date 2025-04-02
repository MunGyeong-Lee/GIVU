package com.backend.givu.controller;


import com.amazonaws.Response;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.UserAccountDTO;
import com.backend.givu.model.service.MyPageService;
import com.backend.givu.model.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "MyPage", description = "MyPage 관련 API")
@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final UserService userService;

    @Operation(summary = "유저 연동계좌 생성", description = "해당 유저의 연동계좌를 생성합니다.")
    @PostMapping("/createAccount")
    public ResponseEntity<ApiResponse<Void>> createDepositAccount(@AuthenticationPrincipal CustomUserDetail userDetail){
        Long userId = userDetail.getId();
        User user = userService.getUserById(userId);
        if(user.getAccountNumber() != null){
            return ResponseEntity.ok(ApiResponse.fail("ERROR", "이미 연동 계좌가 존재합니다."));
        }
        return ResponseEntity.ok(myPageService.createDepositAccount(user));
    }

    @Operation(summary = "유저 연동계좌 조회", description = "해당 유저의 연동계좌를 조회합니다.")
    @GetMapping("/checkAccount")
    public ResponseEntity<ApiResponse<UserAccountDTO>> checkAccount(@AuthenticationPrincipal CustomUserDetail userDetail){
        String accountNo = userDetail.getAccountNo();
        if(accountNo.isEmpty()){
           return ResponseEntity.ok(ApiResponse.fail("ERROR", "계좌가 존재하지 않습니다."));
        }
        return ResponseEntity.ok(myPageService.checkAccount(accountNo));
    }

}
