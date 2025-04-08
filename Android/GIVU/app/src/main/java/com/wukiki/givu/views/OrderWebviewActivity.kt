package com.wukiki.givu.views

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.lifecycle.lifecycleScope
import com.wukiki.domain.repository.DataStoreRepository
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseActivity
import com.wukiki.givu.databinding.ActivityOrderWebviewBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import javax.inject.Inject

@AndroidEntryPoint
class OrderWebviewActivity : BaseActivity<ActivityOrderWebviewBinding>(ActivityOrderWebviewBinding::inflate) {

    @Inject
    lateinit var getAuthUseCase: GetAuthUseCase

    companion object {
        fun newIntent(context: Context, productId: String): Intent {
            return Intent(context, OrderWebviewActivity::class.java).apply {
                putExtra("productId", productId)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = binding.webviewOrder
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
//        webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW


        val productId = intent.getStringExtra("productId") ?: return
        val url = "https://j12d107.p.ssafy.io/shopping/product/$productId"
//        val url = "$baseUrl"

        webView.webViewClient = object : WebViewClient() {

            // 페이지 로딩이 끝났을 때 호출
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)

                lifecycleScope.launch {
                    val jwtToken = withContext(Dispatchers.IO) {
                        getAuthUseCase.getJwt().firstOrNull()
                    }

                    jwtToken?.let {
                        val jsCode = "window.localStorage.setItem('auth_token', '$it');"
                        view?.evaluateJavascript(jsCode, null)
                        Log.d("OrderWebView", "토큰 주입 완료: $it")
                    }
                }
            }

            // 새 URL을 로딩, 특정 URL이 나오면 앱에서 처리
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val reqUrl = request?.url.toString()
                if (reqUrl.contains("/payment/success")) {
                    setResult(RESULT_OK)
                    finish()
                    return true
                }
                return false
            }
        }

        webView.loadUrl(url)
    }
}