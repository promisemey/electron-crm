<script lang="tsx" setup>
import { RouterView } from 'vue-router'
import TagsMenu from '../navbar/TagsMenu.vue'
</script>
<template>
  <!-- main -->
  <main class="flex-1 flex flex-col relative overflow-hidden">
    <!-- tag -->
    <TagsMenu ref="tagMenuRef" />
    <!-- tag -->

    <RouterView v-slot="{ Component, route }">
      <template v-if="Component">
        <keep-alive>
          <Suspense>
            <template #default>
              <component :is="Component" v-if="route.query.card == 'nouse'" :key="route.fullPath" />

              <el-card
                v-else
                shadow="always"
                class="h-full overflow-hidden"
                body-class="h-full overflow-hidden"
              >
                <keep-alive>
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </el-card>
            </template>
            <template #fallback>
              <h1>Loading</h1>
            </template>
          </Suspense>
        </keep-alive>
        <Loading />
      </template>
    </RouterView>
  </main>
  <!-- main -->
</template>

<style lang="scss" scoped></style>
