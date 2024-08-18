// import ky from "ky";
import type {AxiosRequestConfig} from "axios";
import {userAgent} from "@/background/common";
import {axiosInstance} from "@/utils";


let EdgeAuth: string = "";
const authApi: string = "https://edge.microsoft.com/translate/auth"
const translateApi: string = "https://api.cognitive.microsofttranslator.com/translate?from={0}&to={1}&api-version=3.0&includeSentenceLength=true"

let updatedAt: number = 0
const maxDuration: number = 500


interface repParams {
    detectedLanguage: {
        language: string,
        score: number,
    },
    translations: {
        text: string,
        to: string,
        sentLen: {
            srcSentLen: number[],
            transSentLen: number[],
        }
    }[]
}

export async function translate(texts: string[], from: string, to: string): Promise<string[]> {

    const auth = await getEdgeAuth();
    // console.log("auth", auth);
    const array: object[] = [];
    for (const text of texts) {
        array.push({
            "Text": text,
        })
    }
    const apiUrl = "https://api.cognitive.microsofttranslator.com/translate"
    const data =  JSON.stringify(array)
    const config: AxiosRequestConfig = {
        // params: new URLSearchParams([
        //     ["from", ], // 为空自动检测
        //     ["to", to],
        //     ["api-version", "3.0"],
        //     ["includeSentenceLength", "true"],
        // ]),
        params: {
            "from": from !== "auto" ? from : "",
            "to": to,
            "api-version": "3.0",
            "includeSentenceLength": "true"
        },
        headers: {
            'content-type': 'application/json',
            'User-Agent': userAgent,
            "Referer": "https://www.amazon.com",
            "Authorization": `Bearer ${auth}`,
        }
    }
    return axiosInstance.post(apiUrl, data, config).then((response) => {
        const resp: repParams[] = response.data
        const result: string[] = []
        for (const item of resp) {
            result.push(item.translations[0].text)
        }
        return result;
    })
}


async function getEdgeAuth(): Promise<string> {

    const nowSecTime: number = new Date().getTime() / 1000
    if (EdgeAuth !== "" && nowSecTime < updatedAt + maxDuration) {
        return EdgeAuth;
    }

    const config = {
        headers: {
            'content-type': 'text/html',
            'User-Agent': userAgent
        }
    }

    const resp = await axiosInstance.get(authApi, config)
    if (resp.status !== 200) {
        return "";
    } else {
        EdgeAuth = resp.data
    }

    updatedAt = nowSecTime;
    return EdgeAuth;
}