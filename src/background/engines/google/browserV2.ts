import type {AxiosRequestConfig} from "axios";
import {userAgent} from "@/background/common";
import {axiosInstance} from "@/utils";

const transApi: string = "https://translate-pa.googleapis.com/v1/translateHtml"


type respParams = [
    string[], string[]
]

export async function translate(texts: string[], from: string, to: string): Promise<string[]> {

    const body = [
        [texts, "auto", "zh-CN"], "te_lib"
    ]
    const data: string = JSON.stringify(body)
    // const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    // console.log(httpProxy)
    const config: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json+protobuf",
            "User-Agent": userAgent,
            "Referer": "https://www.amazon.com",
            "x-goog-api-key": "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520",
        },
        timeout: 10000,
    }

    return axiosInstance.post(transApi, data, config).then((response) => {
        const resp: respParams = response.data
        const tlTextGroup: string[] = resp[0]
        const result: string[] = []
        for (const item of tlTextGroup) {
            result.push(item)
        }
        return result;
    })
}
