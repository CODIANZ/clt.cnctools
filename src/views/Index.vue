<template>
  <v-app>
    <app-bar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>


<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup(props, ctx) {
    return {};
  },
  components: {
    AppBar: () => import("./components/AppBar.vue")
  }
});
</script>
