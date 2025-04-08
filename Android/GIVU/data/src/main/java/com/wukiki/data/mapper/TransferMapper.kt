package com.wukiki.data.mapper

import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.domain.model.Transfer

object TransferMapper {

    operator fun invoke(fundingTransferEntity: FundingTransferEntity): Transfer {
        return Transfer(
            paymentId = fundingTransferEntity.data.paymentId,
            userId = fundingTransferEntity.data.userId,
            fundingId = fundingTransferEntity.data.fundingId,
            productId = fundingTransferEntity.data.productId,
            amount = fundingTransferEntity.data.amount,
            transactionType = fundingTransferEntity.data.transactionType,
            status = fundingTransferEntity.data.status,
            date = fundingTransferEntity.data.date
        )
    }
}