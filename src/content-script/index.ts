import './index.scss'
import {sendMessagePromise} from "@/utils";
import {respDataHttp} from "@/types/axios";


/* 获取一个页面，然后追加进去
const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  document.body?.append(iframe)
}
 */

const jzCrxExtensionId: string = import.meta.env.VITE_CRX_EXTENSION_ID

const injectArxivButton = (): void => {
    const location = window.location.href;
    const urlObj = new URL(location)
    const currentUrl = `${urlObj.origin}${urlObj.pathname}`

    // 根据URL注入不同的按钮
    if (currentUrl.includes('https://arxiv.org/abs/')) {
        // injectButton('btnExample1', '按钮1');

        // let transBtnUrl = currentUrl

        // 1、先判断是否有html版本的按钮
        const btnHtmlNode = document.getElementById('latexml-download-link');
        if (btnHtmlNode) {
            addFullTextTransBtn(`${currentUrl}?atype=html`);
            return
        }
        // 2、尝试ping https://arxiv.org/html/2305.16291
        const htmlUrlExper = currentUrl.replace("abs", "html")
        const htmlUrlAr5iv = currentUrl.replace("arxiv", "ar5iv")
        console.log(htmlUrlExper, htmlUrlAr5iv);
        sendMessagePromise(
            jzCrxExtensionId,
            {type: 'fetch', data: {url: htmlUrlExper, method: 'head'}}
        ).then((response: any) => {
            // const lastError = chrome.runtime.lastError;
            const resp: respDataHttp = response;
            console.log("resp.data.status", resp.data.status);
            if (resp.data.status === 200) {
                addFullTextTransBtn(`${currentUrl}?source=html`);
                return "success";
            }
            return sendMessagePromise(
                jzCrxExtensionId,
                {type: 'fetch', data: {url: htmlUrlAr5iv, method: 'head'}}
            )
        }).then((response: any) => {
            const resp: respDataHttp = response;
            if (resp.data.status === 200) {
                addFullTextTransBtn(`${currentUrl}?source=5iv`);
            }
        }).catch(() => {})
        // addFullTextTransBtn(currentUrl)
    }
    // 可以继续添加更多的条件判断
}

function addFullTextTransBtn(btnUrl: string): void {
    const baseUrl = import.meta.env.VITE_WEB_BASE_URL
    // console.log('baseUrl', baseUrl)
    // 追加
    const element = document.querySelector("div.full-text ul")
    if (element) {
        const node = document.createElement("li")
        node.innerHTML = `
      <a href="${baseUrl}/translate/arxiv?url=${btnUrl}" aria-describedby="download-button-info" 
      accesskey="f" target="_blank" class="abs-button download-pdf">全文翻译(饺子翻译)</a>
      `
        element.appendChild(node)
    }
}

console.log("content-script")
// 针对arxiv 注册一个按钮，一键开启双语
// content.js
if (document.readyState !== 'loading') {
    injectArxivButton()
} else {
    document.addEventListener('DOMContentLoaded', () => {
        injectArxivButton()
    })
}

globalThis.onerror = function (message, source, lineno, colno, error) {
    console.info(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
    )
}