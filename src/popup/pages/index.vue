<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'

const version = __VERSION__
const displayName = __DISPLAY_NAME__
const gitURL = __GITHUB_URL__
const gitCommit = __GIT_COMMIT__
const gitCommitURL = `${gitURL}/commit/${gitCommit}`

const store = useAppStore()

// const name = computed(() => store.name)
// const count = computed(() => store.count)



</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <h1 class="text-3xl font-bold underline pb-6">
      你好我是饺子翻译
    </h1>

    <p>Vesion: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>

    <p>未来：浏览器划词翻译</p>
    <p>文档翻译</p>


    <div class="flex gap-x-2 justify-center">
      <button
        class="btn btn-warning"
        @click="store.increment"
      >
        Increment
      </button>
      <button
        class="btn btn-primary"
        @click="store.decrement"
      >
        Decrement
      </button>
    </div>

    <RouterLink
      class="underline"
      to="/common/about"
    >
      About
    </RouterLink>
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
