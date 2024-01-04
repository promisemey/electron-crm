<script lang="ts" setup>
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
        <!-- {{ $router.getRoutes() }} -->
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
                <component :is="Component" :key="route.fullPath" />
              </el-card>
            </template>
            <template #fallback> <Loading /></template>
          </Suspense>
        </keep-alive>
      </template>
    </RouterView>

    <!-- <router-view v-if="$route.query.card == 'nouse'" />

    <el-card
      v-else
      shadow="always"
      class="h-full overflow-hidden"
      body-class="h-full overflow-hidden"
    >
      <router-view />
    </el-card>
    <Loading /> -->
  </main>
  <!-- main -->
</template>

<style lang="scss" scoped></style>
