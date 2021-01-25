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
      <v-btn
        rounded
        color="primary"
        dark
        @click="onSave"
      >
        ファイルに保存
      </v-btn>
    </v-col>

    <v-treeview
      :items="items"
    ></v-treeview>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { mode_t } from '@/codes/UrlBuilder/Builders';
import { ResultStore, resultstore_t } from "@/codes/ResultStore";
import FileSaver from "file-saver";
import dateFormat from "dateformat";
import { debug } from "debug";
const LOG = debug("app:POSResult");

let item_id = 0;
let new_id: string | undefined = undefined;
let mode: mode_t | undefined = undefined;

type item_t = {
  id: number,
  name: string;
  children?: item_t[];
};

function generateString(key: string, value: string): item_t {
  if(mode == "Pokepos"){
    if(value.length > 0 && value.charAt(0) == '{'){
      return generateMap(key, JSON.parse(value));
    }
    else if(value.length > 0 && value.charAt(0) == '['){
      return generateArray(key, JSON.parse(value));
    }
  }
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
        if(Array.isArray(si)){
          return generateArray(`[${k}]`, si);
        }
        else if(si === null){
          return generateString(`[${k}]`, "null");
        }
        else if(typeof si ==="object"){
          return generateMap(`[${k}]`, si);
        }
        else{
          return generateString(`[${k}]`, `${si}`);
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
        if(Array.isArray(si)){
          return generateArray(`${k}`, si);
        }
        else if(si === null){
          return generateString(`${k}`, "null");
        }
        else if(typeof si ==="object"){
          return generateMap(`${k}`, si);
        }
        else{
          return generateString(`${k}`, `${si}`);
        }
      })
  };
}

function generateItems(data: resultstore_t[]) {
  try{
    return data.map((it) => {
      const title =
          it.param.logid
        + " ( "
        + it.param.mode
        + " / "
        + it.param.menu
        + " / "
        + it.param.moneytype
        + " )"
        + ((it.param.logid == new_id) ? "  **NEW" : "");

      mode = it.param.mode;

      const d = {
        id: item_id++,
        name: title,
        children: new Array<item_t>()
      };

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
  catch{
    alert("データが破損しています。「全て削除」を実行してください。");
    return [];
  }
}

export default defineComponent({
  setup(props, ctx) {
    const stor = ResultStore.create();
    if(ctx.root.$route.params.id == "-"){
      /* nothing to do */
    }
    else{
      if(ctx.root.$route.query.escape){
        const s = decodeURIComponent(ctx.root.$route.fullPath);
        const m = s.match(/:\/\/pokepos\?(.+)/);
        if(m){
          const query:{[_: string]: string} = {};
          [...m[1].matchAll(/&{0,1}([^=]+)=([^&$]*)/g)]
          .forEach((x, i) => {
            if(i == 0) return;
            query[x[1]] = x[2];
          });
        }
        new_id          = ctx.root.$route.params.id;
        const fullpath  = ctx.root.$route.fullPath;
        stor.setReceive(new_id, fullpath, ctx.root.$route.query);
      }
      else{
        new_id          = ctx.root.$route.params.id;
        const query     = JSON.stringify(ctx.root.$route.query);
        const fullpath  = ctx.root.$route.fullPath;
        stor.setReceive(new_id, fullpath, ctx.root.$route.query);
      }
    }

    const items = generateItems(stor.list());
    return {
      items,
      onEraseAll: () => {
        if(confirm("全てのログを削除します。よろしいですか？")){
          stor.eraseAll();
          ctx.root.$router.replace("/");
        }
      },
      onSave: () => {
        const l = stor.list();
        var blob = new Blob([JSON.stringify(l)], {type: "application/json;charset=utf-8"});
        FileSaver.saveAs(blob, `${dateFormat(new Date(), "yyyymmddHHMMss")}.json`)
      }
    };
  }
});

</script>
