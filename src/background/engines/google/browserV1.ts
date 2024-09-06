import type {AxiosRequestConfig} from "axios";
import {userAgent} from "@/background/common";
import {axiosInstance} from "@/utils";
import {getTk} from "@/background/engines/google/common";

const transApi: string = "https://translate-pa.googleapis.com/v1/translateHtml"
const transApi360: string = "https://elephant.browser.360.cn"


type respParams = string[]

export async function translate(texts: string[], from: string, to: string): Promise<string[]> {

    return Api360(texts, from, to)
}

export async function Api360(texts: string[], from: string, to: string): Promise<string[]> {
    const tk = getTk(texts, "469542.3530600540")
    const body = {
        "q[]": texts,
    }
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": userAgent,
            "Referer": "https://www.amazon.com",
        },
        params: {
            "t": "translate",
            "m": "google",
            "anno": "3",
            "client": "te_lib",
            "format": "html",
            "v": "1.0",
            "key": "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw",
            "logld": "vTE_20200506_00",
            "sl": "en",
            "tl": "zh-CN",
            "sp": "nmt",
            "tc": "5",
            "sr": "1",
            "tk": tk,
            "mode": "1"
        },
        timeout: 10000,
    }
    console.log("tk", tk)
    return axiosInstance.post(transApi360, body, config).then((response) => {
        const resp: respParams = response.data
        // console.log("resp", resp)
        // const tlTextGroup: respParams = resp
        return resp;
    })
}

