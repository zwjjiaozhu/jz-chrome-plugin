import ky from 'ky';
import {translate as edgeTranslate} from "@/background/engines/edge/translate";
import index from "@/setup/pages/index.vue";
// import { parseFromString } from 'dom-parser';

// var DOMParser = require('xmldom').DOMParser;
// var parser = new DOMParser();
interface transReqParams {
    text: string,
    from: string,
    to: string,
    rootId: string,  // 节点的所在块（p、h1、等 ）的id
    nodeId: string,
}

interface transRepParams {
    text: string,
    rootId: string,  // 节点的所在块（p、h1、等 ）的id
    nodeId: string,
}

// 安装以及更新信号
chrome.runtime.onInstalled.addListener(async (opt) => {
    // Check if reason is install or update. Eg: opt.reason === 'install' // If extension is installed.
    // opt.reason === 'update' // If extension is updated.
    if (opt.reason === 'install') {
        await chrome.storage.local.clear()

        chrome.tabs.create({
            active: true,
            // Open the setup page and append `?type=install` to the URL so frontend
            // can know if we need to show the install page or update page.
            url: chrome.runtime.getURL('./src/setup/index.html?type=install'),
        })
    }

    if (opt.reason === 'update') {
        chrome.tabs.create({
            active: true,
            url: chrome.runtime.getURL('./src/setup/index.html?type=update'),
        })
    }
})

console.log('hello world from background')

self.onerror = function (message, source, lineno, colno, error) {
    console.info(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
    )
}

export {}


// 右键菜单

chrome.contextMenus.create({
    title: '全文翻译44', //菜单的名称
    id: 'fulltext-translate', //一级菜单的id
    contexts: ['page'], // 选中文字时用：selection
});

// const tabId = getTabId();
chrome.contextMenus.create({
    title: "翻译%s",
    id: '11',
    contexts: ["selection"], // 选中文字时用：selection
    // onclick: function () {
    //   chrome.scripting.executeScript({target: {tabId: 10}}, () => {
    //
    //   });
    // }
})
/**
 * 添加点击菜单后的处理事件
 */

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "fulltext-translate":
            console.log("fulltext-translate");
            break;

        case "translate_page":
            // (0,_library_translate_js__WEBPACK_IMPORTED_MODULE_0__.translatePage)(channel);
            break;

        case "translate_page_google":
            // (0,_library_translate_js__WEBPACK_IMPORTED_MODULE_0__.executeGoogleScript)(channel);
            break;

        default:
            break;
    }
});


// 监听其他网页发送过来的请求
chrome.runtime.onMessageExternal.addListener(
    async (message: {data: any, type: string}, sender, sendResponse) => {
    // 可以针对sender做一些白名单检查
    console.log("addListener:", message, sender, sendResponse)
    // sendResponse返回响应

    switch (message.type) {
        case 'GetArxivHtml': {
            const page_url = message.msg
            ky.get(page_url, {}).then(
                result => {
                    return result.text()
                }
            ).then(result => {
                sendResponse({type: 'MsgFromChrome', msg: result});
            }).catch(err => {
                console.log(err);
            });
            break;
        }
        case "translate": {
            const data: transReqParams[] = message.data

            const texts: string[] = []
            for (const item of data) {
                texts.push(item.text)
            }

            edgeTranslate(texts, data[0].from, data[0].to).then((result: string[]) => {

                const ret: transRepParams[] = []
                for (const [index, value] of result.entries()) {
                    ret.push({
                        text: value,
                        nodeId: data[index].nodeId, rootId: data[index].rootId
                    })
                }
                // console.log(ret)
                sendResponse({type: "translation", msg: "", data: ret});
            })


            // console.log(data)
            // niuTranslate(data.text, "", "").then((result) =>{
            //     // console.log("result:", result)
            //     const translation = result["tgt_text"]
            //     sendResponse({type: "translation", msg: "", data: {text: translation, nodeId: data.nodeId}});
            // })
            break;
        }
        default:
            break;
    }

    // if (message.type === 'MsgFromPage') {
    //
    // }
    return true;
});

// async function niuTranslate(text: string, from: string, to: string) {
//
//   const apiUrl = "https://api.niutrans.com/NiuTransServer/translation"
//
//   let options = {
//     body: JSON.stringify({
//       "from": "auto",
//       "to": "zh",
//       "src_text": text,
//       "apikey": "633d9262947ed51162888cccd3b12afc"
//     }),
//     headers: {
//       'content-type': 'application/json'
//     }
//   }
//   return ky.post(apiUrl, options).json()
// }