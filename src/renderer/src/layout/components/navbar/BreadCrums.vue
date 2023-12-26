<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { Menu } from '@api/common/types'
import { ref } from 'vue'

const route = useRoute()

const breadCrumbs = ref<Menu[]>([])

watch(
  route,
  (nRoute) => {
    const [, ...args] = nRoute.matched as unknown as Menu[]

    breadCrumbs.value = args
  },
  { immediate: true }
)
</script>
<template>
  <div class="crumbs">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in breadCrumbs" :key="item.id">
        <div class="flex items-center gap-1">
          <el-icon>
            <component :is="item.meta.icon.replace('el-icon-', '') || 'user'"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped></style>
