<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="ts" setup>
import { Dictionary } from '@api/dictionary/types'
import { getRoleDetailApi, getRoleNenuAuthApi, postAddRoleApi, postUpdateRolelApi } from '@api/role'
import { RecordsItem } from '@api/role/types'
import { useMainStore } from '@store'
import { ElTree } from 'element-plus'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { onMounted, reactive } from 'vue'
import { ref } from 'vue'
const mainStore = useMainStore()
const { roleVisit } = storeToRefs(mainStore)
// 表单
interface InitType {
  roleName: string
  rolePerm: string
  enabled: string
  descript: string
  id?: string
}
const init: InitType = {
  roleName: '',
  rolePerm: '',
  enabled: '1',
  descript: ''
}
const formData = reactive(init)

const propsTree = { label: 'name' }
const menuTreeAuth = ref<RecordsItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
// 展开
const treeExpand = ref<boolean>(false)
const handleTreeExpand = (val: boolean) => {
  const nodeMap = treeRef.value!.store.nodesMap
  Object.keys(nodeMap).forEach((item) => {
    nodeMap[item].expanded = val
  })

  treeExpand.value = val
}

// 全选
const handleCheckAll = (val: boolean) => {
  const nodeMap = treeRef.value!.store.nodesMap
  Object.keys(nodeMap).forEach((item) => {
    nodeMap[item].checked = val
  })

  treeExpand.value = val
}

// 父子联动
const linkage = ref<boolean>(false)
const handleLinkage = (val: boolean) => {
  linkage.value = val
}

onMounted(async () => {
  // 获取全部角色
  const res = await getRoleNenuAuthApi({ current: 1, size: 999 })

  type FlatMenu = (data: RecordsItem[]) => RecordsItem[]

  const flatMenu: FlatMenu = (data) => {
    const map = new Map(data.map((item) => [item.id, item]))

    return data.reduce((acc: RecordsItem[], item) => {
      if (item.parentId === '-1') {
        acc.push(item)
      } else {
        const parent = map.get(item.parentId)
        parent && parent.children?.push(item)
      }

      return acc
    }, [])
  }

  const result = flatMenu(res.data.records.filter((item) => !item.path.includes('//')))

  menuTreeAuth.value = result
})

const handleSubmit = async () => {
  const res = ref()

  if (!formData.id) {
    res.value = await postAddRoleApi({
      ...formData,
      permissionIds: treeRef.value?.getCheckedKeys() as string[]
    })
    console.log('创建')
  } else {
    const treeChecked = treeRef.value?.getCheckedKeys() as string[]

    console.log(treeChecked)

    res.value = await postUpdateRolelApi({
      ...formData,
      permissionIds: treeChecked,
      id: formData.id
    })
    console.log('修改')
  }

  if (res.value.code === '200') {
    roleVisit.value = false
    props.refresh()
  }
}

const props = defineProps<{
  roleStatus: Dictionary[]
  id?: string
  refresh: () => void
}>()

const getDetail = async (id) => {
  const res = await getRoleDetailApi(String(id))
  if (res.code == '200') {
    Object.assign(formData, { ...res.data.role, enabled: res.data.role.enabled.toString() })
    treeRef.value?.setCheckedKeys([...res.data.permissions])
  }
}

watch(
  roleVisit,
  (n) => {
    // console.log(n, formData, init)
    if (!n) {
      formData.descript = ''
      formData.enabled = '1'
      formData.roleName = ''
      formData.rolePerm = ''
      formData.id = ''
    }
  },
  {
    immediate: true
  }
)

defineExpose({
  formData,
  getDetail
})
</script>

<template>
  <el-dialog
    v-model="roleVisit"
    :destroy-on-close="true"
    width="50%"
    class="overflow-hidden flex flex-col"
    center
  >
    <el-scrollbar class="h-full">
      <el-form ref="form" :model="formData" label-width="80px" :inline="false">
        <el-form-item label="角色名称">
          <el-input v-model="formData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="formData.rolePerm"></el-input>
        </el-form-item>
        <el-form-item label="状态" props="enabled">
          <el-switch
            v-model="formData.enabled"
            :active-value="roleStatus[0].v"
            :active-text="roleStatus[0].k"
            :inactive-value="roleStatus[1].v"
            :inactive-text="roleStatus[1].k"
          />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox label="展开" @change="handleTreeExpand" />
          <el-checkbox label="全选" @change="handleCheckAll" />
          <el-checkbox label="父子(联动/不联动)" @change="handleLinkage" />
          <div class="w-[90%] h-[200px] rounded-sm border">
            <el-scrollbar>
              <el-tree
                ref="treeRef"
                :props="propsTree"
                :data="menuTreeAuth"
                show-checkbox
                node-key="id"
                highlight-current
                :check-strictly="linkage"
                :default-expand-all="treeExpand"
              />
            </el-scrollbar>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.descript"
            type="textarea"
            resize="none"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
          <el-button @click="roleVisit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<style lang="scss"></style>
