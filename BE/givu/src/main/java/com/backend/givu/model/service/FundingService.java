package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.ProductReview;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.model.requestDTO.FundingUpdateDTO;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import com.backend.givu.util.mapper.CategoryMapper;
import com.backend.givu.util.mapper.ScopeMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
@Slf4j
public class FundingService {

    private final FundingRepository fundingRepository;
    private final UserRepository userRepository;
    private final S3UploadService s3UploadService;

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
    public FundingsDTO saveFunding (Long userId, FundingCreateDTO fundingDTO, List<String > imageUrls){
        // 존재하는 유저인지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));

        Funding saveFunding = fundingRepository.save(Funding.from(user, fundingDTO, imageUrls));
        return  Funding.toDTO(saveFunding);

    }

    /**
     * 펀딩 수정
     */
    public FundingsDTO updateFunding (Long userId, Integer fundingId, FundingUpdateDTO fundingDTO, List<String> imageUrls)
            throws AccessDeniedException {

        // 존재하는 펀딩인지 확인
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다,"));
        // 본인 펀딩인지 확인
        log.info("수정 요청보낸 유저ID: " + userId);
        if(!funding.getUser().getId().equals(userId)){
            log.info("펀딩 주인 ID: "+ funding.getUser().getId());
            throw new AccessDeniedException("펀딩 수정 권한이 없습니다.");
        }
        // DTO 내용 entity에 넣기
        funding.setTitle(fundingDTO.getTitle());
        funding.setProductId(fundingDTO.getProductId());
        funding.setBody(fundingDTO.getBody());
        funding.setDescription(fundingDTO.getDescription());
        funding.setCategory(CategoryMapper.fromClient(fundingDTO.getCategory())); // 한글 -> 영어
        funding.setScope(ScopeMapper.fromClient(fundingDTO.getScope()));          // 한글 -> 영어

        // 기존 이미지 중 삭제요청된 거만 삭제
        if(fundingDTO.getToDelete() != null){
            // S3에 사진 삭제
            s3UploadService.deleteFile(fundingDTO.getToDelete());
            // DB에서 사진 URL 삭제
            List<String> imageList = new ArrayList<>(funding.getImage());
            imageList.removeAll(fundingDTO.getToDelete());
            funding.setImage(imageList);
        }

        // 추가된 이미지 업로드
        if (imageUrls != null){
            for(String url: imageUrls){
                if(url != null && !url.isEmpty()){
                    funding.addImage(url);
                }
            }
        }

        return Funding.toDTO(fundingRepository.save(funding));
    }

    /**
     * 펀딩 삭제
     */
    public void deleteFunding (Long userId, int fundingId) throws AccessDeniedException{
        // 존재하는 펀딩인지 확인
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다,"));

        // 본인 펀딩인지 확인
        if(!funding.getUser().getId().equals(userId)){
            log.warn("펀딩 삭제 권한 없음: 요청자={}, 작성자={}", userId, funding.getUser().getId());
            throw new AccessDeniedException("펀딩 삭제 권한이 없습니다.");
        }

        // S3에서 이미지 URL 삭제
        if(funding.getImage() != null && !funding.getImage().isEmpty()){
            s3UploadService.deleteFile(funding.getImage());
        }

        fundingRepository.deleteById(fundingId);
    }





}
