<script setup lang="ts">

import {useAppStore} from "@/stores/app";

const version = __VERSION__
const displayName = __DISPLAY_NAME__
// const gitURL = __GITHUB_URL__
// const gitCommit = __GIT_COMMIT__
// const gitCommitURL = `${gitURL}/commit/${gitCommit}`

// const name = computed(() => store.name)
// const count = computed(() => store.count)
// const transEngine = ref("bing")

const appStore = useAppStore()
// const appStore2 = useAppStore()
const config = appStore.appConfig

const options = {
  google: {
    sourceOptions: [
      { label: '原生浏览器接口', value: 'browserV2' },
      { label: '360（些许延迟）', value: '360' }
    ]
  }
}

// watch(config, (newVal, _) => {
//   console.log(33, newVal)
//   Object.assign(crxConfig, newVal)
//   const text = JSON.stringify(newVal)
//   chrome.storage.sync.set({ "config": text }).then(() => {
//     console.log("config changed: ", text)
//   }).catch((err: any) => {
//     console.error(err)
//   });
// })
// 监控设置修改信号
// chrome.storage.onChanged.addListener((changes: StorageChange, areaName: string) => {
//
// })

</script>

<template>
  <div class="m-4 flex flex-col gap-y-2 w-80 p-2">
    <!--    <h1 class="text-3xl font-bold underline pb-6">-->
    <!--      你好我是饺子翻译-->
    <!--    </h1>-->

    <div class="flex justify-center" />
    翻译引擎：
    <a-select v-model:value="config.transEngine" style="width: 240px">
      <a-select-option value="bing">
        必应翻译
      </a-select-option>
      <a-select-option value="google">
        谷歌翻译
      </a-select-option>
      <a-select-option value="deepl" disabled>
        Deepl
      </a-select-option>
      <a-select-option value="deepl" disabled>
        ChatGPT
      </a-select-option>
    </a-select>

    <template v-if="config.transEngine === 'google'">
      <div>
        翻译接口：
        <a-space direction="vertical">
          <a-radio-group v-model:value="config.google.source" :options="options.google.sourceOptions" />
        </a-space>
      </div>
    </template>

    <a-divider>About</a-divider>
    <div class="border-r-gray-200">
      <p>名称: {{ displayName }}</p>
      <p>版本: {{ version }}</p>
      <p>未来：网页全文翻译、划词翻译、文档翻译等科研相关</p>
      <a target="_blank" class="underline" rel="noopener noreferrer" href="https://jz.zwjjiaozhu.top/">About</a>
    </div>


    <!--    <RouterLink-->
    <!--      class="underline"-->
    <!--      to="/common/about"-->
    <!--    >-->
    <!--      About-->
    <!--    </RouterLink>-->
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md bg-blue-500 text-white;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
