package com.wukiki.givu.views

import android.widget.Toast
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class BiometricAuth (
    private val activity: FragmentActivity,
    private val onSuccess: () -> Unit,
    private val onFailure: (() -> Unit)? = null,
) {
    private val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("지문 인증")
        .setSubtitle("결제를 위해 지문 인증이 필요합니다.")
        .setNegativeButtonText("취소")
        .build()

    private val biometricPrompt = BiometricPrompt(
        activity,
        ContextCompat.getMainExecutor(activity),
        object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                onSuccess()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                Toast.makeText(activity, "인증 실패: $errString", Toast.LENGTH_SHORT).show()
                onFailure?.invoke()
            }

            override fun onAuthenticationFailed() {
                Toast.makeText(activity, "지문이 일치하지 않습니다.", Toast.LENGTH_SHORT).show()
            }
        }
    )

    fun authenticate() {
        biometricPrompt.authenticate(promptInfo)
    }
}