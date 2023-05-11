<template>
  <v-container>
    <v-app-bar>
      <v-app-bar-nav-icon @click="m.drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ m.title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="m.drawer" absolute >
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">

          <v-list-item v-for="item in items" :key="item.model" @click="onItemClick(item.title, item.path)">
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
import { ResultStore } from "@/codes/ResultStore";
import { defineComponent, reactive } from "@vue/composition-api";

const items: {
  icon: string;
  title: string;
  path: string;
}[] = [
  {
    icon: "send",
    title: "POS連携確認",
    path: "/tools/pos"
  },
  {
    icon: "list",
    title: "POS連携結果",
    path: "/tools/posresult/-"
  },
  {
    icon: "update",
    title: "連続試験",
    path: "/tools/poscontinuous/-"
  }
];

const m = reactive({
  drawer: false,
  title: "-"
});

export default defineComponent({
  setup(prop, ctx) {
    if(ctx.root.$route.path.indexOf("/tools/posresult") >= 0 ){
      m.title = "POS連携結果";
    }
    else if(ctx.root.$route.path.indexOf("/tools/poscontinuous") >= 0){
      m.title = "連続試験";
    }
    else if(ctx.root.$route.path.indexOf("/tools/pos") >= 0 ){
      m.title = "POS連携確認";
    }
    return {
      m,
      items,
      onItemClick: (title: string, path: string) => {
        m.title = title;
        ctx.root.$router.replace(path);
        m.drawer = false;
      }
    };
  }
});
</script>
