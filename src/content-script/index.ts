import './index.scss'
import {sendMessagePromise} from "@/utils";
import type {httpRespParams} from "@/types/arxiv";
import {getConfig, updateConfig} from "@/config/config-manger";


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
getConfig()
updateConfig({})

const jzCrxExtensionId: string = import.meta.env.VITE_CRX_EXTENSION_ID

const arxivInjectButton = (): void => {
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
            // const href = btnHtmlNode.getAttribute("href")
            addFullTextTransBtn(`${currentUrl}?source=html`);
            return
        }

        // 必须得有tex版本，不然不可能有html版本的
        const btnTexNode = document.getElementsByClassName('download-eprint');
        if (!btnTexNode) {
            return
        }

        // 2、尝试ping https://arxiv.org/html/2305.16291
        const htmlUrlExper = currentUrl.replace("abs", "html")
        const htmlUrlAr5iv = `https://ar5iv.labs.arxiv.org${urlObj.pathname.replace("abs", "html")}`;
        // const htmlUrlAr5iv = currentUrl.replace("arxiv", "ar5iv")
        // console.log(htmlUrlExper, htmlUrlAr5iv);
        sendMessagePromise(
            jzCrxExtensionId,
            {type: 'axios', data: {url: htmlUrlExper, method: 'head'}}
        ).then((response: any) => {
            // const lastError = chrome.runtime.lastError;
            const resp: httpRespParams = response;
            // console.log("resp.data.status", resp.data.status);
            if (resp.data?.status === 200) {
                addFullTextTransBtn(`${currentUrl}?source=html`);
                return "success";
            }
            console.log(htmlUrlAr5iv);
            return sendMessagePromise(
                jzCrxExtensionId,
                {type: 'fetch', data: {url: htmlUrlAr5iv, method: 'head', maxRedirects: 0}}
            )
        }).then((response: any) => {
            console.log("resp.data", response);
            const resp: httpRespParams = response;
            // 特殊情况，访问5iv又跳回到abs页面的情况
            // console.log("resp.location", response.data.headers);
            if (resp.data?.status === 200) {
                addFullTextTransBtn(`${currentUrl}?source=5iv`);
            }
        }).catch((err) => {
            console.log("fetch error:", err);
        })
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
// console.log(document.readyState)
// 针对arxiv 注册一个按钮，一键开启双语
// content.js
if (document.readyState === 'complete') {
    arxivInjectButton()
} else {
    window.onload = () => {
        arxivInjectButton();
    };
    // document.addEventListener('DOMContentLoaded', () => {
    //     arxivInjectButton()
    // })
}

globalThis.onerror = function (message, source, lineno, colno, error) {
    console.info(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
    )
}