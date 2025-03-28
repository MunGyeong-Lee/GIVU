package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.util.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

import static com.backend.givu.util.mapper.CategoryMapper.fromClient;

@Service
@RequiredArgsConstructor
public class FundingService {

    private final FundingRepository fundingRepository;
    private final UserRepository userRepository;


    /**
     * 펀딩 생성
     */
//    public void createFunding (Long userId, FundingCreateDTO fundingCreateDTO){
//        User user = userRepository.findById(userId)
//                .orElseThrow(()-> new NoSuchElementException("우저ID" + userId + "에 해당하는 유저가 없습니다."));
//        Funding funding = Funding.builder()
//                .user(user)
//                .productId(fundingCreateDTO.getProductId())
//                .body(fundingCreateDTO.getBody())
//                .description(fundingCreateDTO.getDescription())
//                .category(CategoryMapper.fromClient(fundingCreateDTO.getCategory()))
//                .participantsNumber(0)
//                .fundedAmount(0)
//                .status()
//                .scope()
//                .image()
//                .image2()
//                .image3()


//    }



}
