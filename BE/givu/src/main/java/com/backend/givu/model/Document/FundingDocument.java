package com.backend.givu.model.Document;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Document(indexName = "fundings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FundingDocument {
    @Id
    private Integer fundingId;
    private Long userId;
    private String userNickname;
    private String userImage;
    private Integer productId;
    private String productName;
    private Integer productPrice;
    private String productImage;
    @Field(type = FieldType.Text, analyzer = "custom_ngram_analyzer", searchAnalyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "custom_ngram_analyzer", searchAnalyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String category;

    private String categoryName;
    private Integer participantsNumber;
    private Integer fundedAmount;
    @Field(type = FieldType.Keyword)
    private String scope;
    @Field(type = FieldType.Keyword)
    private String status;
    @Field(type = FieldType.Keyword)
    private List<String> image;
    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private String createdAt;
    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private String updatedAt;
}
