<script lang="ts" setup>
import { getCityByParentApi } from '@api/city'
import { onMounted, ref } from 'vue'
import { CityType } from '@api/city/types'
const cityData = ref<CityType[]>([])

const load = async (row, _treeNode, resolve) => {
  const res = await getCityByParentApi(row.id)
  resolve(res.data)
}

onMounted(async () => {
  const res = await getCityByParentApi(1)

  if (res.code == '200') {
    cityData.value = res.data
  }
})
</script>
<template>
  <div class="h-full overflow-hidden">
    <el-scrollbar>
      <el-table
        :data="cityData"
        height="auto"
        border
        row-key="id"
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="地区名称" prop="areaName" align="left"></el-table-column>
        <el-table-column label="地区简称" prop="shortName" align="center" />
        <el-table-column label="排序" prop="sort" align="center" />
        <el-table-column label="经度" prop="lng" align="center" />
        <el-table-column label="纬度" prop="lat" align="center" />
      </el-table>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
