// import ky from "ky";


async function niuTranslate(text: string, from: string, to: string): Promise<string> {

    const apiUrl = "https://api.niutrans.com/NiuTransServer/translation"

    const options = {
        body: JSON.stringify({
            "from": "auto",
            "to": "zh",
            "src_text": text,
            "apikey": "633d9262947ed51162888cccd3b12afc"
        }),
        headers: {
            'content-type': 'application/json'
        }
    }
    return ky.post(apiUrl, options).json()
}



