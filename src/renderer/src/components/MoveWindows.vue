<script lang="ts" setup>
import { Close, Moon, Sunny } from '@element-plus/icons-vue'
import { onBeforeMount, reactive, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
import type { DropdownInstance } from 'element-plus'

// 鼠标进入判断，只有鼠标进入到范围内，才能进行鼠标按压拖拽
let enterFlag = false
// 鼠标按压判断，只有鼠标进入范围内，并且按压状态，此时释放鼠标才会关闭窗口移动
let mousedownFlag = false
let timer: NodeJS.Timeout | null

type HTMLElementEvent<T extends HTMLElement> =
  | (Event & {
      target: T
    })
  | MouseEvent

/**鼠标按压 */
const mousedown = (event: HTMLElementEvent<HTMLElement>) => {
  try {
    if (!(event.target as HTMLElement).className.includes('el-')) {
      if (enterFlag) {
        window.electron.ipcRenderer.invoke('custom-move', true)
        mousedownFlag = true
      }
    }
  } catch (error) {
    console.log()
  }
}

/**鼠标释放 */
const mouseup = () => {
  if (enterFlag && mousedownFlag) {
    window.electron.ipcRenderer.invoke('custom-move', false)
    mousedownFlag = false
  }
}

/**鼠标移入 */
const mouseenter = () => {
  enterFlag = true
}

/**鼠标移出 */
const mouseleave = () => {
  enterFlag = false
  // 避免卡顿的情况下，鼠标滑出移动范围，但窗口仍跟随鼠标移动
  if (timer !== null) {
    timer = setTimeout(() => {
      mousedownFlag = false
      window.electron.ipcRenderer.invoke('custom-move', false)
      timer = null
    }, 1000)
  }
}

export interface Props {
  titleBtn?: boolean
}

withDefaults(defineProps<Props>(), {
  titleBtn: false
})

const onClose = () => {
  window.electron.ipcRenderer.send('exit-app')
}

const dropdown = ref<DropdownInstance>()

// 国际化
interface LANG {
  name: string
  value: string
}
const lang = reactive<LANG[]>([
  {
    name: '中文',
    value: 'zh-cn'
  },
  {
    name: '英文',
    value: 'en'
  }
])
const { proxy } = getCurrentInstance() as ComponentInternalInstance

const configLang = (lang: string) => {
  const i18n = proxy?.$i18n
  i18n!.locale = lang
  localStorage.setItem('lang', lang)
}
const getLanguage = (lang: LANG) => {
  configLang(lang.value)
}

// 打开下拉菜单
const showClick = () => {
  if (!dropdown.value) return
  dropdown.value.handleOpen()
}

// 暗黑模式
const dark = ref<boolean>(false)

dark.value = localStorage.getItem('dark')
  ? JSON.parse(localStorage.getItem('dark') as string)
  : dark.value

const onChangeDark = () => {
  const res = document.querySelector('html')?.classList.toggle('dark', dark.value)
  // console.log('图标:', res, `${res ? '太阳' : '月亮'}`)
  // console.log('界面:', res, `${res ? '可以移除' : '不能移除'}`)
  dark.value = !res
  localStorage.setItem('dark', String(res))
}

onBeforeMount(() => {
  onChangeDark()
})
</script>

<template>
  <div
    class="move-windows"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
    <div
      v-if="titleBtn"
      class="button absolute z-10 items-center justify-end flex h-14 pr-4 w-full"
    >
      <el-dropdown
        ref="dropdown"
        trigger="contextmenu"
        style="margin-right: 12px"
        @command="getLanguage"
      >
        <el-button circle size="default" @click="showClick">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 512 512"
          >
            <path
              d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z"
              fill="currentColor"
            ></path>
            <path
              d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"
              fill="currentColor"
            ></path>
          </svg>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="item in lang" :key="item.value">
              <el-dropdown-item :command="item">{{ item.name }}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button circle size="default" :icon="dark ? Moon : Sunny" @click="onChangeDark" />
      <el-button circle size="default" :icon="Close" @click="onClose" />
    </div>
    <slot name="title"></slot>

    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.move-windows {
  width: 100vw;
  height: 100vh;
  /* background: #fff; */

  /* .drag {
    width: 100%;
    height: 40px;
    position: absolute;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
  }*/
}
</style>
