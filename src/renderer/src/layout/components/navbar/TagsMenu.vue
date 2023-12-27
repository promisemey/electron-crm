<script lang="ts" setup>
import { ref } from 'vue'
import { TabsType } from '@types'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSelectMenu } from '@hooks/useSelectMenu'

const initTabs = {
  index: '/home',
  title: '仪表盘',
  path: '/dashboard'
}

const editableTabsValue = ref(JSON.stringify(initTabs))
const editableTabs = ref([initTabs])
const flag = ref<boolean>(true)

const addTab = (newTabs: TabsType) => {
  const result = editableTabs.value.findIndex((item) => item.path === newTabs.path)

  if (result == -1) {
    // editableTabs.value.push(newTabs)
    editableTabs.value.push(newTabs)
  }

  editableTabsValue.value = JSON.stringify(newTabs)
}

// 移除
const removeTab = (targetName: string) => {
  flag.value = false
  // 标签页数组
  const tabs = editableTabs.value
  // 选中页
  let activeName = editableTabsValue.value

  // 删除当前选中页
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (JSON.stringify(tab) === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = JSON.stringify(nextTab)
          // 跳转选中页
          useSelectMenu(nextTab)
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => JSON.stringify(tab) !== targetName)
  setTimeout(() => {
    flag.value = true
  }, 50)

  // console.log(editableTabs.value, '===-=-=--=-')
}
const route = useRoute()

watch(
  route,
  (nRoute) => {
    if (!flag.value) return

    const nTabs: TabsType = {
      index: nRoute.meta.parent as string,
      title: nRoute.meta.title as string,
      path: nRoute.matched[1].path
    }

    addTab(nTabs)
  },
  {
    immediate: true
  }
)

// 跳转
const onJump = (path: string) => {
  useSelectMenu(JSON.parse(path))
}
</script>
<template>
  <div class="h-10 w-full overflow-hidden">
    <el-tabs
      v-model="editableTabsValue"
      type="border-card"
      class="h-full"
      @tab-change="onJump"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.path"
        :closable="item.path != '/dashboard'"
        :label="item.title"
        :name="JSON.stringify(item)"
      >
        <!-- {{ item }} -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
