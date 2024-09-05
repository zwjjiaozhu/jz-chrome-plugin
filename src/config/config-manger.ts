
interface config {
    transEngine: string,
}

export const crxConfig = {
    transEngine: "bing",
    google: {
        source: "360",
    }
}

export const getConfig = (): Promise<void | object> => {
    return chrome.storage.sync.get(["basicConfig"]).then((result): {} => {
        // console.log(result);
        const nowConfig = JSON.parse(result.basicConfig)
        Object.assign(crxConfig, nowConfig)
        return nowConfig
    }).catch((err: any) => {
        console.error(err)
    });
}

export const updateConfig = (config: any): Promise<string> => {
    const text = JSON.stringify(config)
    return chrome.storage.sync.set({"basicConfig": text}).then(() => {
        console.log("config changed: ", text)
        return "success";
    }).catch((err: any) => {
        console.error(err)
        return "";
    });
}