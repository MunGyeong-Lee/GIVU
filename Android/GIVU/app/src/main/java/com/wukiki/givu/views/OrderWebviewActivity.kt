package com.wukiki.givu.views

import android.app.Activity
import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Message
import android.util.Log
import android.view.ViewGroup
import android.webkit.WebChromeClient
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
    private var popupDialog: Dialog? = null

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
        webView.settings.javaScriptCanOpenWindowsAutomatically = true
        webView.settings.setSupportMultipleWindows(true)

        val productId = intent.getStringExtra("productId") ?: return
        val url = "https://j12d107.p.ssafy.io/shopping/order/$productId"



        // 웹뷰 팝업 허용을 위한 ChromeClient 설정
        webView.webChromeClient = object : WebChromeClient() {
            override fun onCreateWindow(
                view: WebView,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: Message
            ): Boolean {
                val newWebView = WebView(view.context).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                }

                val dialog = Dialog(this@OrderWebviewActivity).apply {
                    setContentView(newWebView)
                    window?.setLayout(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    show()
                }
                popupDialog = dialog
                newWebView.webChromeClient = this
                newWebView.webViewClient = WebViewClient()

                (resultMsg.obj as WebView.WebViewTransport).webView = newWebView
                resultMsg.sendToTarget()

                return true
            }

            override fun onCloseWindow(window: WebView) {
                // window.close() 호출될 때 실행
                popupDialog?.dismiss()
                popupDialog = null

                setResult(Activity.RESULT_OK)
                finish()

            }
        }

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


        }

        webView.loadUrl(url)
    }
}