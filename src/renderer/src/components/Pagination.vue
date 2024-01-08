<script lang="ts" setup>
// 分页
const emits = defineEmits<{
  SizeChange: [pagesize: number]
  CurrentChange: [current: number]
}>()

const onSizeChange = (pagesize: number) => {
  emits('SizeChange', pagesize)
}
const onCurrentChange = (current: number) => {
  emits('CurrentChange', current)
}

withDefaults(
  defineProps<{
    current?: number
    size?: number
    count?: number
    hideOnSinglePage?: boolean
  }>(),
  {
    current: 1,
    size: 10,
    count: 1,
    hideOnSinglePage: false
  }
)
</script>
<template>
  <div class="pt-5 flex justify-center">
    <el-pagination
      :current-page="+current"
      :page-size="+size"
      background
      :hide-on-single-page="hideOnSinglePage"
      layout="sizes, prev, pager, next, jumper"
      :page-count="+count"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped></style>
