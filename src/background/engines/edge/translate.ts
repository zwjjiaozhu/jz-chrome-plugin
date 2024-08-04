import ky from "ky";
import {userAgent} from "@/background/common";

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

    const options = {
        body: JSON.stringify(array),
        searchParams: new URLSearchParams([
            ["from", from !== "auto" ? from : ""], // 为空自动检测
            ["to", to],
            ["api-version", "3.0"],
            ["includeSentenceLength", "true"],
        ]),
        headers: {
            'content-type': 'application/json',
            'User-Agent': userAgent,
            'Referer': "https://www.amazon.com",
            'authorization': `Bearer ${auth}`,
        }
    }
    return ky.post(translateApi, options).json().then((data: repParams[]) => {
        const result: string[] = []
        for (const item of data) {
            result.push(item.translations[0].text)
        }
        return result;
    })
}


async function getEdgeAuth(): Promise<string> {

    const nowTime: number = new Date().getTime() / 1000
    if (EdgeAuth !== "" && nowTime < updatedAt + maxDuration) {
        return EdgeAuth;
    }

    const options = {
        headers: {
            'content-type': 'text/html',
            'User-Agent': userAgent
        }
    }

    const resp = await ky.get(authApi, options)
    if (resp.status !== 200) {
        return "";
    } else {
        EdgeAuth = await resp.text()
    }

    updatedAt = nowTime;
    return EdgeAuth;
}