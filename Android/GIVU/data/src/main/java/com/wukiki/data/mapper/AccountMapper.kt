package com.wukiki.data.mapper

import com.wukiki.data.entity.BalanceEntity
import com.wukiki.domain.model.Account

object AccountMapper {

    operator fun invoke(balanceEntity: BalanceEntity): Account {
        return Account(
            givupayBalance = balanceEntity.data.givupayBalance,
            accountBalance = balanceEntity.data.accountBalance
        )
    }
}