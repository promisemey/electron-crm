<script lang="ts" setup>
import { getUserPageApi } from '@api/user'
import { UserType } from '@api/user/types'
import { onBeforeMount } from 'vue'
import { reactive, ref } from 'vue'

const formData = reactive({
  username: '',
  realName: '',
  phone: '',
  current: '1',
  size: '10',
  count: 0
})

const peopleVisible = ref<boolean>(false)

const hadleSubmit = () => {
  getUserData()
}

const handleReset = () => {
  Object.assign(formData, {
    username: '',
    realName: '',
    phone: '',
    current: 1,
    size: 10
  })
  getUserData()
}
const onSizeChange = (size) => {
  formData.size = size
  getUserData()
}
const onCurrentChange = (current) => {
  formData.current = current
  getUserData()
}

const onSelectUser = () => {
  peopleVisible.value = false
  if (leaderRow.value) {
    emits('selectLeader', leaderRow.value)
  }
}

const leaderRow = ref({})

const onSelectRow = (row) => {
  leaderRow.value = row
}

const userData = ref<UserType[]>([])

const getUserData = async () => {
  const res = await getUserPageApi(formData)
  if (res.code != '200') return

  userData.value = res.data.records

  formData.count = res.data.pages
}

onBeforeMount(() => {
  getUserData()
})

const columns = [
  { id: 1, prop: 'username', label: '用户名称', minWidth: '200' },
  { id: 2, prop: 'realName', label: '姓名', minWidth: '200' },
  { id: 3, prop: 'phone', label: '手机号', minWidth: '200' }
]

const emits = defineEmits(['selectLeader'])

defineExpose({
  peopleVisible
})
</script>
<template>
  <el-dialog v-model="peopleVisible" title="选择用户">
    <el-form ref="formRef" :model="formData" label-width="80px" :inline="true">
      <el-form-item label="用户名称" class="min-w-[30%]">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formData.realName"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="hadleSubmit">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="userData" border stripe highlight-current-row @current-change="onSelectRow">
      <el-table-column
        v-for="col in columns"
        :key="col.id"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
      >
      </el-table-column>
    </el-table>

    <Pagination
      :current="+formData.current"
      :size="+formData.size"
      :count="+formData.count"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <template #footer>
      <el-button @click="peopleVisible = false">取消</el-button>
      <el-button type="primary" @click="onSelectUser">确认</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
