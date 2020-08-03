<template>
  <v-container>
    <v-app-bar>
      <v-app-bar-nav-icon @click="m.drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ m.title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="m.drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>save</v-icon>
            </v-list-item-icon>
            <v-list-item-title>POS</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";


const m = reactive({
  drawer: false,
  title: "cnc"
});

export default defineComponent({
  setup() {
    return { m };
  }
});
</script>
