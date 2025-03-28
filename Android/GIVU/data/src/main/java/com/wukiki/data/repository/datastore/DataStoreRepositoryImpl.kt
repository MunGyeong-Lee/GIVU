package com.wukiki.data.repository.datastore

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import com.wukiki.domain.model.User
import com.wukiki.domain.repository.DataStoreRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject

class DataStoreRepositoryImpl @Inject constructor(
    private val dataStore: DataStore<Preferences>
) : DataStoreRepository {

    override suspend fun setUserId(id: String) {
        dataStore.edit { preferences ->
            preferences[USER_ID] = id
        }
    }

    override fun getUserId(): Flow<String?> =
        dataStore.data.catch {
            if (it is IOException) {
                it.printStackTrace()
                emit(emptyPreferences())
            } else {
                throw it
            }
        }.map { preferences ->
            preferences[USER_ID]
        }

    override suspend fun setJwt(jwt: String) {
        dataStore.edit { preferences ->
            preferences[JWT_TOKEN] = jwt
        }
    }

    override fun getJwt(): Flow<String?> =
        dataStore.data.catch {
            if (it is IOException) {
                it.printStackTrace()
                emit(emptyPreferences())
            } else {
                throw it
            }
        }.map { preferences ->
            preferences[JWT_TOKEN]
        }

    override suspend fun setUserInfo(userInfo: User) {
        dataStore.edit { preferences ->
            preferences[USER_ID] = userInfo.id
            preferences[KAKAO_ID] = userInfo.kakaoid
            preferences[NICKNAME] = userInfo.nickname
            preferences[USER_EMAIL] = userInfo.email
            preferences[BIRTH] = userInfo.birth
            preferences[PROFILE_IMAGE] = userInfo.profileImage
            preferences[ADDRESS] = userInfo.address
            preferences[GENDER] = userInfo.gender
            preferences[AGE_RANGE] = userInfo.ageRange
            preferences[BALANCE] = userInfo.balance
            preferences[CREATED_AT] = userInfo.createdAt
            preferences[UPDATED_AT] = userInfo.updatedAt
        }
    }


    override fun getUserInfo(): Flow<User?> =
        dataStore.data.catch {
            if (it is IOException) {
                it.printStackTrace()
                emit(emptyPreferences())
            } else {
                throw it
            }
        }.map { preferences ->
            val userId = preferences[USER_ID]
            val kakaoId = preferences[KAKAO_ID]
            val userName = preferences[NICKNAME]
            val userEmail = preferences[USER_EMAIL]
            val birth = preferences[BIRTH]
            val profileImage = preferences[PROFILE_IMAGE]
            val address = preferences[ADDRESS]
            val gender = preferences[GENDER]
            val ageRange = preferences[AGE_RANGE]
            val balance = preferences[BALANCE]
            val createdAt = preferences[CREATED_AT]
            val updatedAt = preferences[UPDATED_AT]

            if (userId != null && userEmail != null && userName != null) {
                User(
                    id = userId,
                    kakaoid = kakaoId ?: "",
                    nickname = userName,
                    email = userEmail,
                    birth = birth ?: "",
                    profileImage = profileImage ?: "",
                    address = address ?: "",
                    gender = gender ?: "",
                    ageRange = ageRange ?: "",
                    balance = balance ?: "",
                    createdAt = createdAt ?: "",
                    updatedAt = updatedAt ?: ""
                )
            } else {
                null
            }
        }


    override suspend fun logout() {
        dataStore.edit { preferences ->
            preferences.remove(JWT_TOKEN)
            preferences.remove(USER_ID)
            preferences.remove(KAKAO_ID)
            preferences.remove(NICKNAME)
            preferences.remove(USER_EMAIL)
            preferences.remove(BIRTH)
            preferences.remove(PROFILE_IMAGE)
            preferences.remove(ADDRESS)
            preferences.remove(GENDER)
            preferences.remove(AGE_RANGE)
            preferences.remove(BALANCE)
            preferences.remove(CREATED_AT)
            preferences.remove(UPDATED_AT)
        }
    }

    companion object {

        private val JWT_TOKEN = stringPreferencesKey("jwt_token")
        private val USER_ID = stringPreferencesKey("user_id")
        private val KAKAO_ID = stringPreferencesKey("kakao_id")
        private val NICKNAME = stringPreferencesKey("nickname")
        private val USER_EMAIL = stringPreferencesKey("user_email")
        private val BIRTH = stringPreferencesKey("birth")
        private val PROFILE_IMAGE = stringPreferencesKey("profile_image")
        private val ADDRESS = stringPreferencesKey("address")
        private val GENDER = stringPreferencesKey("gender")
        private val AGE_RANGE = stringPreferencesKey("age_range")
        private val BALANCE = stringPreferencesKey("balance")
        private val CREATED_AT = stringPreferencesKey("created_at")
        private val UPDATED_AT = stringPreferencesKey("updated_at")
    }
}