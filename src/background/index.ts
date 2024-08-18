// import ky from 'ky';
import type {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";

import {translate as edgeTranslate} from "@/background/engines/edge/translate";
import {constField} from "@/utils";
import {arxivTransReqParams, arxivTransRespParams, httpReqParams, httpRespParams} from "@/types/arxiv";
// import fetchAdapter from "@vespaiach/axios-fetch-adapter";

// import { parseFromString } from 'dom-parser';
const axiosInstance = axios.create({})


interface transRepParams {
    text: string,
    rootId: string,  // 节点的所在块（p、h1、等 ）的id
    nodeId: string,
}

interface reqDataHttp {
    type: string;
    data: AxiosRequestConfig
}

interface respDataHttp {
    type: string;
    message?: string;
    data?: AxiosResponse
}



// 请求拦截器
// requests.interceptors.request.use()

// 添加响应拦截器npm i axios@
axiosInstance.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response;
    },
    error => {
        // 对响应错误做点什么
        if (error.response && error.response.status === 404) {
            // 这里是处理 404 的逻辑
            console.log('Resource not found:', error.response.config.url);
            // 你可以选择返回一个自定义的响应对象或者进行其他操作
            // 然后返回一个 resolved 的 promise，这样就不会触发 catch
            return Promise.resolve(error.response);
        }
        // 对于其他错误，仍然抛出错误
        return Promise.reject(error);
    }
);


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

// 右键菜单

chrome.contextMenus.create({
    title: '全文翻译(实验)', //菜单的名称
    id: 'fulltext-translate', //一级菜单的id
    contexts: ['page'], // 选中文字时用：selection
});

// const tabId = getTabId();
chrome.contextMenus.create({
    title: "翻译%s(实验)",
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

chrome.contextMenus.onClicked.addListener((info, _) => {
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
    (message: any, sender, sendResponse) => {
        // 可以针对sender做一些白名单检查
        console.log("onMessageExternal:", message)
        switch (message.type) {
            case constField.axios: {
                messageHandlerAxios(message, sendResponse)
                break;
            }
            case constField.fetch: {
                messageHandlerFetch(message, sendResponse)
                break;
            }
            case constField.translate: {
                messageHandlerTranslate(message, sendResponse)
                break;
            }
            case constField.greet: {
                sendResponse({})
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

// 监听来自插件内容脚本发送来的消息
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse): boolean => {
        // console.log("onMessage:", message);
        const resp: httpReqParams = message;
        switch (resp.type) {
            case constField.axios: {
                messageHandlerAxios(message, sendResponse);
                break;
            }
            case constField.fetch: {
                messageHandlerFetch(message, sendResponse)
                break;
            }
        }
        return true;
    });


function messageHandlerAxios(message: any, sendResponse: any): void {
    const reqData: httpReqParams = message
    let respData: httpRespParams;

    // const data2 = reqData.data
    axiosInstance.request(reqData.data).then(result => {
        respData = {type: constField.axios, data: result}
        // console.log("axios request respData：", respData)
        sendResponse(respData);
        // throw "fwef";
    }).catch((err: AxiosError) => {
        respData = {
            type: constField.error,
            msg: `message: ${err.message}, status: ${err.response?.status}, `,
            data: err.response
        }
        sendResponse(respData);
        console.log("error axios request respData:", respData);
        return true;
    });
}

async function messageHandlerFetch(message: any, sendResponse: any): void {
    const reqData: httpReqParams = message
    let respData: httpRespParams

    const url_ = reqData.data?.url || ""
    fetch(url_, {method: 'HEAD', redirect: 'error', }).then(result => {
        respData = {type: constField.axios, data: {data: result.text(), status: 200}}
        sendResponse(respData);
    }).catch((err: Error) => {
        // 如果发生错误，打印错误信息
        respData = {
            type: constField.error,
            msg: `message: ${err.message}, name: ${err.name}, `
        }
        sendResponse(respData);
        return null;
    })
    // try {
    //     // 使用 fetch 发送 HEAD 请求，并设置 redirect: 'manual' 来禁止重定向
    //     const response = await ;
    //
    //     // 返回状态码
    //     console.log(666, response.ok, response.headers, response.redirected);
    // } catch (err: Error) {
    //
    // }

}

function messageHandlerTranslate(message: any, sendResponse: any): void {
    const reqData: arxivTransReqParams = message
    let respData: arxivTransRespParams;

    const data = reqData.data
    const texts: string[] = []
    for (const item of data) {
        texts.push(item.text)
    }
    edgeTranslate(texts, data[0].from, data[0].to).then((result: string[]) => {
        const textArray: transRepParams[] = []
        for (const [index, value] of result.entries()) {
            textArray.push({
                text: value,
                nodeId: data[index].nodeId, rootId: data[index].rootId
            })
        }
        // console.log(ret)
        respData = {type: constField.translate, data: textArray}
        sendResponse(respData);
    }).catch((err: AxiosError) => {
        respData = {type: constField.error, msg: err.message}
        sendResponse(respData);
    })
}



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