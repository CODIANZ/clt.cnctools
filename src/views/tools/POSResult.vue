<template>
  <v-container>
    <v-col>
      <v-btn
        rounded
        color="warning"
        dark
        @click="onEraseAll"
      >
        全て削除
      </v-btn>
    </v-col>

    <v-treeview
      :items="items"
    ></v-treeview>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { debug } from "debug";
import { ResultStore, resultstore_t } from "@/codes/ResultStore";
const LOG = debug("app:POSResult");

let item_id = 0;
let new_id: string | undefined = undefined;

type item_t = {
  id: number,
  name: string;
  children?: item_t[];
};

function generateString(key: string, value: string | undefined): item_t | undefined {
  if(value === undefined) return undefined;
  return {
    id: item_id++,
    name: `${key} : ${value}`
  };
}

function generateMap(key: string, value: unknown | undefined): item_t | undefined {
  if(value === undefined) return undefined;
  if(typeof value !== "object") return undefined;
  if(value === null) return undefined;

  return {
    id: item_id++,
    name: key,
    children: Object.keys(value)
              .map(k => generateString(k, (value as any)[k]))
              .filter(x => x !== undefined) as item_t[]
  }
}

function generateItems(data: resultstore_t[]) {
  return data.map((it) => {
    const d = {
      id: item_id++,
      name: `${it.param.logid}${(it.param.logid == new_id) ? "  *" : ""}`,
      children: new Array<item_t>()
    }

    const sendUrl       = generateString("send url", it.sendUrl);
    const receiveUrl    = generateString("receive url", it.receiveUrl);
    const param         = generateMap("param", it.param);
    const receiveData   = generateMap("receive data", it.receiveData);

    if(param      ) d.children.push(param);
    if(sendUrl    ) d.children.push(sendUrl);
    if(receiveUrl ) d.children.push(receiveUrl);
    if(receiveData) d.children.push(receiveData);
    return d;
  });
}


export default defineComponent({
  setup(props, ctx) {
    const stor = ResultStore.create();
    if(ctx.root.$route.params.id != "-"){
      new_id          = ctx.root.$route.params.id;
      const query     = JSON.stringify(ctx.root.$route.query);
      const fullpath  = ctx.root.$route.fullPath;
      stor.setReceive(new_id, fullpath, ctx.root.$route.query);
    }
    const items = generateItems(stor.list());
    return {
      items,
      onEraseAll: () => {
        if(confirm("全てのログを削除します。よろしいですか？")){
          stor.eraseAll();
          ctx.root.$router.replace("/");
        }
      }
    };
  }
});

</script>
