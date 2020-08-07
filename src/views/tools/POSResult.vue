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

function generateString(key: string, value: string): item_t {
  return {
    id: item_id++,
    name: `${key} : ${value}`
  };
}

function generateArray(key: string, value: any[]): item_t {
  let i = 0;
  return {
    id: item_id++,
    name: key,
    children:
      Object.keys(value)
      .map((k) => {
        const si = value[parseInt(k)];
        if(typeof si === "string"){
          return generateString(`[${k}]`, si);
        }
        else if(typeof si === "number"){
          return generateString(`[${k}]`, `${si}`);
        }
        else if(typeof si === "boolean"){
          return generateString(`[${k}]`, `${si}`);
        }
        else if(Array.isArray(value)){
          return generateArray(`[${k}]`, value);
        }
        else {
          return generateMap(`[${k}]`, value);
        }
      })
  };
}

function generateMap(key: string, value: any): item_t {
  return {
    id: item_id++,
    name: key,
    children:
      Object.keys(value)
      .map((k) => {
        const si = value[k];
        if(typeof si === "string"){
          return generateString(k, si);
        }
        else if(typeof si === "number"){
          return generateString(k, `${si}`);
        }
        else if(typeof si === "boolean"){
          return generateString(k, `${si}`);
        }
        else if(Array.isArray(value)){
          return generateArray(k, value);
        }
        else {
          return generateMap(k, value);
        }
      })
  };
}

function generateItems(data: resultstore_t[]) {
  return data.map((it) => {
    const d = {
      id: item_id++,
      name: `${it.param.logid}${(it.param.logid == new_id) ? "  *new" : ""}`,
      children: new Array<item_t>()
    }

    const param         = generateMap("param", it.param);
    const sendUrl       = generateString("send url", it.sendUrl);
    const receiveUrl    = it.receiveUrl ? generateString("receive url", it.receiveUrl) : undefined;
    const receiveData   = it.receiveData ? generateMap("receive data", it.receiveData) : undefined;

    d.children.push(param);
    d.children.push(sendUrl);
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
