package com.backend.givu.controller;


import com.amazonaws.Response;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.AmountDTO;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.ChargeResultDTO;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.UserAccountDTO;
import com.backend.givu.model.service.FundingService;
import com.backend.givu.model.service.MyPageService;
import com.backend.givu.model.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "MyPage", description = "MyPage 관련 API")
@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final UserService userService;
    private final FundingService fundingService;

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
        if(accountNo.isBlank()){
           return ResponseEntity.ok(ApiResponse.fail("ERROR", "계좌가 존재하지 않습니다."));
        }
        return ResponseEntity.ok(myPageService.checkAccount(accountNo));
    }


    @Operation(summary = "유저 연동계좌 출금 (GIVUPay 충전)" , description = "해당 유저의 연동계좌에서 출금 후 GIVUPay로 충전합니다.")
    @PostMapping("/account/withdrawal")
    public ResponseEntity<ApiResponse<ChargeResultDTO>> withdrawalFromAccount(@AuthenticationPrincipal CustomUserDetail userDetail,
                                                                   @RequestBody AmountDTO amountDTO){
        String accountNo = userDetail.getAccountNo();
        long userId = userDetail.getId();
        User user = userService.getUserById(userId);
        if(accountNo.isBlank()){
            return ResponseEntity.ok(ApiResponse.fail("ERROR", "계좌가 존재하지 않습니다."));
        }
        return ResponseEntity.ok(myPageService.withdrawalFromAccount(accountNo, user, amountDTO.getAmount()));
    }

    @Operation(summary = "유저 연동계좌 입금 (GIVUPay 출금)" , description = "해당 유저의 GIVUPay에서 출금 후 연동계좌로 충전합니다.")
    @PostMapping("/account/deposit")
    public ResponseEntity<ApiResponse<ChargeResultDTO>> depositToAccount(@AuthenticationPrincipal CustomUserDetail userDetail,
                                                                              @RequestBody AmountDTO amountDTO){
        String accountNo = userDetail.getAccountNo();
        long userId = userDetail.getId();
        User user = userService.getUserById(userId);
        if(accountNo.isBlank()){
            return ResponseEntity.ok(ApiResponse.fail("ERROR", "계좌가 존재하지 않습니다."));
        }
        return ResponseEntity.ok(myPageService.depositToAccount(accountNo, user, amountDTO.getAmount()));
    }

    @Operation(summary = "내가 만든 펀딩 조회", description = "내가 만든 펀딩 리스트를 조회합니다.")
    @GetMapping("/myfundings")
    public ResponseEntity<ApiResponse<List<FundingsDTO>>> selectMyFundings(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        long userId = customUserDetail.getId();
        return ResponseEntity.ok(fundingService.findAllMyFunding(userId));
    }

    @Operation(summary = "내가 참여한 펀딩 조회", description = "내가 참여한 펀딩 리스트를 조회합니다.")
    @GetMapping("/myParticipantfundings/")
    public ResponseEntity<ApiResponse<List<FundingsDTO>>> selectMyParticipantFundings(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        long userId = customUserDetail.getId();
        return ResponseEntity.ok(fundingService.findAllMyParticipantFunding(userId));
    }
}
