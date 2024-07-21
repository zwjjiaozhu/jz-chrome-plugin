import ky from 'ky';
// import { parseFromString } from 'dom-parser';

// var DOMParser = require('xmldom').DOMParser;
// var parser = new DOMParser();

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
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // 可以针对sender做一些白名单检查
  console.log("addListener:", message, sender, sendResponse)
  // sendResponse返回响应

  switch (message.type) {
    case 'GetArxivHtml':
      ky.get(message.msg, {}).then(
          result => {
            return result.text()

          }
      ).then(result => {

        sendResponse({type: 'MsgFromChrome', msg: result});

      }).catch(err => {
        console.log(err);
      });

      break;
    default:
      break;
  }

  // if (message.type === 'MsgFromPage') {
  //
  // }
  return true;
});