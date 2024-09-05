<script setup lang="ts">
import { useApp } from '@/stores/app'
import { MenuUnfoldOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';

const store = useApp()

// const count = computed(() => store.count)
</script>

<template>
  <a-layout style="height: 100%">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null"
                    style="height: 100%"
                    collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <UserOutlined />
          <span>翻译设置</span>
        </a-menu-item>
        <a-menu-item key="2">
          <VideoCameraOutlined />
          <span>大模型</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <MenuUnfoldOutlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>

<!--  <header-->
<!--    aria-label="Site Header"-->
<!--    class="bg-gray-50"-->
<!--  >-->
<!--    Options Header-->
<!--  </header>-->

<!--  -->

<!--  <p>Count: {{ count }}</p>-->

<!--  <footer-->
<!--    aria-label="Site Footer"-->
<!--    class="bg-gray-50"-->
<!--  >-->
<!--    Options Footer-->
<!--  </footer>-->
</template>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

</style>
