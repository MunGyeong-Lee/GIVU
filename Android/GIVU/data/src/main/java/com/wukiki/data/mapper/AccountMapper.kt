package com.wukiki.data.mapper

import com.wukiki.data.entity.AccountEntity
import com.wukiki.domain.model.Account

object AccountMapper {

    operator fun invoke(accountEntity: AccountEntity): Account {
        return Account(
            accountNo = accountEntity.data?.accountNo ?: "",
            balance = accountEntity.data?.balance ?: 0
        )
    }
}