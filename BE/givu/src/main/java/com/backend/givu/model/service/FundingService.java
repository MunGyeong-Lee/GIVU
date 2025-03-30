package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.ProductReview;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
public class FundingService {

    private final FundingRepository fundingRepository;
    private final UserRepository userRepository;

    /**
     * 펀딩 Id로 조회
     */
    public Funding findFundingEntity(int fundingId){
        return fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
    }

    /**
     * 펀딩 이미지 저장
     */
    public void saveFundingEntity(Funding fundig){
        fundingRepository.save(fundig);
    }

    /**
     * 펀딩 리스트 조회
     */
    public List<FundingsDTO> findAllFunding(){
        List<Funding> fundingList = fundingRepository.findAll();

        List<FundingsDTO> dtoList  = new ArrayList<>();
        for(Funding funding: fundingList){
            dtoList.add(new FundingsDTO(funding));
        }
        return dtoList;
    }



    /**
     * 펀딩 생성
     */
    public FundingsDTO saveFunding (Long userId, FundingCreateDTO fundingDTO, String imageUrl){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        Funding saveFunding = fundingRepository.save(Funding.from(user, fundingDTO, imageUrl));
        return  Funding.toDTO(saveFunding);

    }



}
