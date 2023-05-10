<template>
  <v-container>
    <v-form ref="form">

      <v-row>
        <v-col cols="12">
          <v-combobox
            v-model="m.moneys"
            :items="money_list"
            label="金種"
            multiple
            chips
          ></v-combobox>
        </v-col>
      </v-row>


      <v-row>
        <v-col cols="12">
          <v-row justify="end">
            <v-btn :disabled="m.moneys.length == 0" rounded color="primary" dark @click="onExecute" > 実行 </v-btn>
            <v-btn :disabled="!m.running" rounded color="primary" dark @click="onAbort" > 中断 </v-btn>            
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import { UrlBuilder } from "@/codes/UrlBuilder";
import { ResultStore } from "@/codes/ResultStore";
import dateFormat from "dateformat";
import { debug } from "debug";

const LOG = debug("app:POSContinuous");

type continuous_data_t = {
  params: UrlBuilder.params_t[];
  index: number;
};

type moneytype_t = Exclude<UrlBuilder.moneytype_t, "All">;

function buildParam(moneytype: moneytype_t) {
  const builder = new UrlBuilder.Cnc();
  builder.Params.mode       = "Cnc";
  builder.Params.amount     = "1";
  builder.Params.moneytype  = moneytype;
  builder.Params.menu       = "Service";

  const job: {[x in moneytype_t]: UrlBuilder.job_t} = {
    Credit: "Sales",
    Cup: "Sales",
    NFC: "Sales",
    Suica: "SubtractValue",
    QP: "SubtractValue",
    iD: "SubtractValue",
    WAON: "SubtractValue",
    Edy: "SubtractValue",
    nanaco: "SubtractValue",
  };

  builder.Params.job = job[moneytype];

  if(moneytype == "Credit" || moneytype == "NFC"){
    builder.Params.isUseLump  = true;
    builder.Params.bLump      = true;
  }

  builder.Params.amount      = "1";

  if(moneytype == "Credit" || moneytype == "NFC" || moneytype == "iD") {
    builder.Params.taxOther    = "0";
    builder.Params.productCode = "";
  }
  return builder.Params;
}

function goNext(cdata: continuous_data_t) {
  const d = dateFormat(new Date(), "yyyymmddHHMMss");
  const p = cdata.params[cdata.index];
  cdata.index++;
  if(cdata.index >= cdata.params.length){
    cdata.index = 0;
  }
  p.logid = d;
  p.returnUrl = `${location.protocol}//${location.host}/tools/poscontinuous/${d}`;
  const builder = new UrlBuilder.Cnc();
  builder.Params = p;
  localStorage.setItem("continuous_data", JSON.stringify(cdata));
  const url = builder.generateUrl(false)!;
  const stor = ResultStore.create();  
  stor.setSend(d, p, url);
  location.href = url;
}

export default defineComponent({
  setup(_, ctx) {
    type list_item_t = {
      text: string;
      value: moneytype_t;
    };

    const m = reactive({
      moneys: [] as list_item_t[],
      running: false
    });

    if(ctx.root.$route.params.id == "-"){
      localStorage.removeItem("continuous_data");
    }
    else{
      const stor = ResultStore.create();

      const new_id = ctx.root.$route.params.id;
      var query:{[_: string]: string} = {};
      var queries = ctx.root.$route.query;
      if (queries) {
        const keys = Object.keys(queries);
        keys.forEach((key) => {
          const element = queries[key];
          if (key === "rasResult" || key === "cncResult" || key === "printinfo") {
            if (typeof element === "string") {
              query[key] = JSON.parse(decodeURIComponent(element));
            }
          }
          else {
            if (typeof element === "string") {
              query[key] = element;
            }
            else if (typeof element === 'number') {
              query[key] = element;
            }
          }
        })
      }
      const fullpath  = ctx.root.$route.fullPath;
      stor.setReceive(new_id, fullpath, query); /** setSend をちゃんと実装しないとダメ */
 
      const cdata_ = localStorage.getItem("continuous_data");
      if(cdata_){
        m.running = true;
        setTimeout(() => {
          const cdata = JSON.parse(cdata_);
          goNext(cdata);
          setTimeout(() => {
            window.close();
          }, 1000);
        }, 3000);
      }
    }

    const money_list: list_item_t[] = [
      { text: "クレジット", value: "Credit" },
      { text: "銀聯", value: "Cup" },
      { text: "NFC", value: "NFC" },
      { text: "交通系IC", value: "Suica" },
      { text: "QUICPay", value: "QP" },
      { text: "iD", value: "iD" },
      { text: "WAON", value: "WAON" },
      { text: "Edy", value: "Edy" },
      { text: "nanaco", value: "nanaco" }
    ];

    return {
      m,
      money_list,
      onExecute: () => {
        const cdata : continuous_data_t = {
          params: m.moneys.map(x => buildParam(x.value)),
          index: 0
        };
        localStorage.setItem("continuous_data", JSON.stringify(cdata));
        goNext(cdata);
      },
      onAbort: () => {
        localStorage.removeItem("continuous_data");
        window.close();
      }
    }
  }
});

</script>
