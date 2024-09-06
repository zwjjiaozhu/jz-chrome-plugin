import packageJson from "../../package.json"


interface configType {
    version: string,
    transEngine: string,
    google: {
        source: "360" | "browserV2"
    }
}

export const crxConfig: configType = {
    version: packageJson.version,
    transEngine: "bing",
    google: {
        source: "360",
    }
}

export const getConfig = (): Promise<void | object> => {
    return chrome.storage.sync.get(["basicConfig"]).then((result): {} => {
        console.log("get local config", result);
        const nowConfig = JSON.parse(result.basicConfig)
        // Object.assign(crxConfig, nowConfig)
        return nowConfig
    }).catch((err: any) => {
        console.error(err)
    });
}

export const updateConfig = (config: configType): Promise<string> => {
    const text = JSON.stringify(config)
    return chrome.storage.sync.set({"basicConfig": text}).then(() => {
        console.log("config changed: ", text)
        // Object.assign(crxConfig, config)
        // console.log("config changed: ", crxConfig)
        return "success";
    }).catch((err: any) => {
        console.error(err)
        return "";
    });
}

export const initConfig = (): Promise<void | object> => {
    return getConfig()
}

// 统一监听修改然后更新crxConfig
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const key in changes) {
        if (key === "basicConfig") {
            const storageChange = changes[key];
            const nowConfig = JSON.parse(storageChange.newValue)
            Object.assign(crxConfig, nowConfig)
        }
        // console.log('存储键“%s”（位于“%s”命名空间中）已更改。' +
        //     '原来的值为“%s”，新的值为“%s”。',
        //     key,
        //     namespace,
        //     storageChange.oldValue,
        //     storageChange.newValue);
    }
});