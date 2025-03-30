package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


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

//    /**
//     * 펀딩 리스트 조회
//     */
//
//    public List<FundingsDTO> findAllFunding(){
//        List<Funding> fundingList = fundingRepository.findAll();
//
//        List<FundingsDTO> dtoList  = new ArrayList<>();
//        for(Funding funding: fundingList){
//            dtoList.add(new FundingsDTO(funding));
//        }
//        return dtoList;
//    }



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
