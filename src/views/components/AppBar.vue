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

          <v-list-item
            v-for="item in items"
            :key="item.model"
            @click="onItemClick(item.title, item.path)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

const items: {
  icon: string;
  title: string;
  path: string;
}[] = [
  {
    icon: "send",
    title: "POS連携機能テスト",
    path: "/tools/pos"
  },
  {
    icon: "list",
    title: "POS連携結果",
    path: "/tools/posresult/-"
  },
  // {
  //   icon: "vpn_key",
  //   title: "クライアント証明書をインストール",
  //   path: "/tools/posresult/-"
  // }
];

const m = reactive({
  drawer: false,
  title: "cnc"
});

export default defineComponent({
  setup(prop, ctx) {
    return {
      m,
      items,
      onItemClick: (title: string, path: string) => {
        m.title = title;
        ctx.root.$router.push(path);
      }
    };
  }
});
</script>
