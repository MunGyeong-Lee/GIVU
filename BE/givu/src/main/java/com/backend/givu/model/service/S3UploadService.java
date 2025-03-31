package com.backend.givu.model.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3 파일 업로드
     */
    public String uploadFile(MultipartFile multipartFile, String dirName) throws IOException {
        String fileName = dirName + "/" + UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);

        return amazonS3.getUrl(bucket, fileName).toString(); // 이미지 접근 URL 반환


    }

    /**
     * 파일 삭제
     */
    public void deleteFile(List<String> fileUrls){
        try{
            String bucketUrl = amazonS3.getUrl(bucket, "").toString();
            for(String fileUrl: fileUrls){
                String key= fileUrl.replace(bucketUrl,"");
                amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
                log.info("S3에서 파일 삭제 성공: {}", fileUrl);
            }
        } catch (AmazonServiceException e){
            log.info("S3 파일 삭제 실패: {}", e.getErrorMessage());
        }
    }

}
