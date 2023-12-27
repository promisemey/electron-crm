<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { ref } from 'vue'

import { Meta } from '@api/common/types'

const route = useRoute()

const crumbs = ref<Meta[]>([])
watch(
  route,
  (nRoute) => {
    const { breadCrumbs, ...arg } = nRoute.meta as any as Meta

    if (breadCrumbs) {
      crumbs.value = [breadCrumbs, arg]
    }
  },
  { immediate: true }
)
</script>
<template>
  <div class="crumbs">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in crumbs" :key="item.title">
        <div class="flex items-center gap-1">
          <el-icon>
            <component :is="item.icon ? item.icon.replace('el-icon-', '') : 'user'"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped></style>
