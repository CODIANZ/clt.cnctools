<template>
  <v-container>
    {{ m.id }}<br>
    {{ m.fullpath }}<br>
    {{ m.query }}
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { debug } from "debug";
const LOG = debug("app:POSResult");

const m = reactive({
  id: "",
  query: "",
  fullpath: ""
});

export default defineComponent({
  setup(props, ctx) {
    m.id = ctx.root.$route.params.id;
    m.query = JSON.stringify(ctx.root.$route.query);
    m.fullpath = ctx.root.$route.fullPath;
    return { m }
  }
});

</script>
