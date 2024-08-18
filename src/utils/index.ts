import axios from "axios";

export const constField = {
    error: "error",
    axios: "axios",
    fetch: "fetch",
    translate: "translate",
    greet: "greet",  // 打招呼
}

export const axiosInstance = axios.create({})


export const sendMessagePromise = (targetExtensionId: string, message: any) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(targetExtensionId, message, (response: any) => {
            const lastError = chrome.runtime.lastError;
            // console.log("ffwef342wef", response);
            if (lastError) {
                reject(lastError);
            } else if (response.type === 'error') {
                reject(response.message);
            } else {
                resolve(response);
            }

        });
    });
}