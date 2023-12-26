<script lang="ts" setup>
import { ref } from 'vue'
import { TabsType } from '@types'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSelectMenu } from '@hooks/useSelectMenu'

const editableTabsValue = ref('/dashboard')
const editableTabs = ref([
  {
    title: '仪表盘',
    name: '/dashboard',
    path: '/dashboard'
  }
])

const addTab = (newTabs: TabsType) => {
  const result = editableTabs.value.findIndex((item) => item.name === newTabs.name)

  if (result == -1) {
    editableTabs.value.push(newTabs)
  }

  editableTabsValue.value = newTabs.name
}

// 移除
const removeTab = (targetName: string) => {
  console.log(targetName)

  // 标签页数组
  const tabs = editableTabs.value
  // 选中页
  let activeName = editableTabsValue.value

  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
          // 跳转选中页
          router.push(activeName)
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
const route = useRoute()

watch(route, (nRoute) => {
  console.log(nRoute)
  const nTabs: TabsType = {
    title: nRoute.meta.title as string,
    // name: `${nRoute.path}${nRoute.meta.title}`,
    name: `${nRoute.path}`,
    path: nRoute.path
  }
  addTab(nTabs)
})

// 跳转
const router = useRouter()
const onJump = (name: string) => {
  useSelectMenu({ index: name })
  // router.push(name)
}
// defineExpose({
//   addTab,
//   removeTab
// })
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
        :key="item.name"
        :closable="item.path != '/dashboard'"
        :label="item.title"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
