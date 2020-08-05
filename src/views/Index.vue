<template>
  <v-app>
    <app-bar />
    <v-container>
      <router-view />
    </v-container>
  </v-app>
</template>


<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    return {};
  },
  components: {
    AppBar: () => import("./components/AppBar.vue")
  }
});
</script>
