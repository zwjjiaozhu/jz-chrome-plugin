import { defineStore } from 'pinia'
import {getConfig, updateConfig} from "@/config/config-manger";
// import { useStorage } from '@vueuse/core'
// import {crxConfig} from "@/utils/config";

export const useAppStore = defineStore('app', () => {
  /*
  搞这个store 是为了能够在vue中响应式的更改config
  但是popup、options是不同的app，不共用store的数据，所以使用config.ts
  存储配置数据，这样background也可以获取配置了
   */
  const appConfig = reactive({
    version: import.meta.env.version,
    transEngine: "bing",
    google: {
      source: "360",
    }
  })
  // 读取本地配置
  getConfig().then((newConfig:any) => {
    if (newConfig) {
      Object.assign(appConfig, newConfig)
    }
  })
  // 修改配置更新到本地配置
  watch(appConfig, (newVal, _) => {
    console.log(33, newVal)
    updateConfig(newVal)
  })


  // const increment = () => {
  //   count.value++
  // }
  //
  // const decrement = () => {
  //   count.value--
  // }

  return {
    appConfig
  }
})
