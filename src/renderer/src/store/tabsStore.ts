import { useSelectMenu } from '@hooks/useSelectMenu'
import { TabsType } from '@types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 标签
export const useTabsStore = defineStore('tabsStore', () => {
  const initTabs: TabsType = {
    index: '/home',
    title: '仪表盘',
    path: '/dashboard'
  }

  //   当前选中
  const editableTabsValue = ref<string>(JSON.stringify(initTabs))
  const editableTabs = ref([initTabs])
  const tabFlag = ref<boolean>(true)

  const addTab = (newTabs: TabsType) => {
    const result = editableTabs.value.findIndex((item) => item.path === newTabs.path)

    if (result == -1) {
      // editableTabs.value.push(newTabs)
      editableTabs.value.push(newTabs)
    }

    editableTabsValue.value = JSON.stringify(newTabs)
  }

  // 移除
  const removeTab = (targetName: string, back?: TabsType) => {
    tabFlag.value = false
    // 标签页数组
    const tabs = editableTabs.value
    // 选中页
    let activeName = editableTabsValue.value

    if (!back) {
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
    }
    editableTabsValue.value = back ? JSON.stringify(back) : activeName

    editableTabs.value = tabs.filter((tab) => JSON.stringify(tab) !== targetName)
    // 防止自动添加
    setTimeout(() => {
      tabFlag.value = true
    }, 10)
  }

  return {
    editableTabsValue,
    editableTabs,
    tabFlag,
    addTab,
    removeTab
  }
})
