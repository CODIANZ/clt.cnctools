<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-radio-group v-model="m.p.mode" row>
            <v-radio
              v-for="it in modes"
              :key="`modes-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-radio-group v-model="m.p.menu" row>
            <v-radio
              v-for="it in menus"
              :key="`menus-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row> 
        <v-col>
          <v-radio-group v-model="m.p.moneytype" row>
            <v-radio
              v-for="it in moneytypes"
              :key="`moneytypes-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu=='Service'">
        <v-col>
          <v-radio-group v-model="m.p.job" row>
            <v-radio
              v-for="it in jobs"
              :key="`jobs-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu=='Reprint'">
        <v-col>
          <v-radio-group v-model="m.p.reprint" row>
            <v-radio
              v-for="it in reprints"
              :key="`reprints-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu=='Journal'">
        <v-col>
          <v-radio-group v-model="m.p.journal" row>
            <v-radio
              v-for="it in journals"
              :key="`journals-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="(m.p.mode=='cnc')&&((m.p.menu=='Journal')||(m.p.menu=='Reprint'&&m.p.reprint=='Journal'))">
        <v-col>
          <v-radio-group v-model="m.p.detail" row>
            <v-radio
              v-for="it in details"
              :key="`details-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.p.mode=='cnc'&&m.p.menu=='Reprint'&&m.p.reprint=='Journal'">
        <v-col>
          <v-radio-group v-model="m.p.when" row>
            <v-radio
              v-for="it in whens"
              :key="`whens-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-switch
            v-model="m.p.bTraining"
            inset
            :label="`トレーニング`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bPrinting"
            inset
            :label="`印字`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bSelfMode"
            inset
            :label="`セルフモード`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bTogether"
            inset
            :label="`現金併用`"
            :disabled="!(m.p.moneytype=='Suica'&&m.p.job=='Sales')"
          ></v-switch>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu=='Service'&&(m.p.job=='Sales'||m.p.job=='Refund')">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.taxOther"
            label="税・その他"
            :rules="[required,range(0,99999)]"
            :disabled="!bTaxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.productCode"
            label="商品コード"
            :rules="[required,length(4)]"
            :disabled="!bProductCode"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu=='Service'&&m.p.job=='Refund'">
        <v-col>
          <v-text-field
            v-model="m.p.slipNo"
            label="伝票番号"
            :rules="[required,length(5)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.termId"
            label="端末ID"
            :rules="[required,length(9)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.manualFlg"
            inset
            :label="`マニュアル`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.pan"
            label="カード番号"
            :rules="[required,length(16)]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="m.p.returnUrl"
            label="戻りURL"
            :rules="[required]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="m.computedUrl"
            label="生成URL"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            rounded
            color="primary"
            dark
            @click="onExecute"
            :disabled="m.computedUrl.length==0"
          >
          実行
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil";
import { debug } from "debug";
const LOG = debug("app:POS");

type mode_t       = "pokepos" | "cnc";
type menus_t      = "Service" | "Journal" | "Reprint";
type moneytype_t  = "Credit" | "Cup" | "Suica" | "QP" | "ID" | "Waon" | "Nanaco";
type job_t        = "Sales" | "Refund" | "Confirm";
type journal_t    = "Total" | "Intermediate";
type detail_t     = "Summary" | "Detail";
type reprint_t    = "Slip" | "Journal";
type when_t       = "Last" | "BeforeLast";

type params_t = {
  mode?:        mode_t;
  menu?:        menus_t;
  moneytype?:   moneytype_t;
  job?:         job_t;
  journal?:     journal_t;
  detail?:      detail_t;
  reprint?:     reprint_t;
  when?:        when_t;
  bTraining:    boolean;
  bPrinting:    boolean;
  bSelfMode:    boolean;
  bTogether:    boolean;
  amount:       string;
  taxOther:     string;
  productCode:  string;
  slipNo:       string;
  termId:       string;
  manualFlg:    boolean;
  pan:          string;
  returnUrl:    string;
};

const params_default: params_t = {
  mode:         undefined,
  menu:         undefined,
  moneytype:    undefined ,
  job:          undefined,
  journal:      undefined,
  detail:       undefined,
  reprint:      undefined,
  when:         undefined,
  bTraining:    false,
  bPrinting:    false,
  bSelfMode:    false,
  bTogether:    false,
  amount:       "",
  taxOther:     "",
  productCode:  "",
  slipNo:       "",
  termId:       "",
  manualFlg:    false,
  pan:          "",
  returnUrl:    `${location.protocol}//${location.host}${location.pathname}`
};

const m = reactive({
  p: params_default,
  computedUrl: ""
});


interface radio_item<T> {
  label: string;
  value: T;
}

const modes: radio_item<mode_t>[] = [
  {
    label: "pokepos（互換）",
    value: "pokepos"
  },
  {
    label: "cnc",
    value: "cnc"
  }
];

const menus: radio_item<menus_t>[] = [
  {
    label: "決済",
    value: "Service"
  },
  {
    label: "集計",
    value: "Journal"
  },
  {
    label: "再印字",
    value: "Reprint"
  }
];

const moneytypes: radio_item<moneytype_t>[] = [
  {
    label: "クレジット" ,
    value: "Credit"
  },
  {
    label: "銀聯",
    value: "Cup"
  },
  {
    label: "交通系IC",
    value: "Suica"
  },
  {
    label: "QUICPay",
    value: "QP"
  },
  {
    label: "iD",
    value: "ID"
  },
  {
    label: "WAON",
    value: "Waon"
  },
  {
    label: "nanaco",
    value: "Nanaco"
  }
];

const jobs: radio_item<job_t>[] = [
  {
    label: "売上",
    value: "Sales"
  },
  {
    label: "取消",
    value: "Refund"
  },
  {
    label: "前回取引確認",
    value: "Confirm"
  }
];

const journals: radio_item<journal_t>[] = [
  {
    label: "日計",
    value: "Total"
  },
  {
    label: "中間計",
    value: "Intermediate"
  }
];

const details: radio_item<detail_t>[] = [
  {
    label: "簡易",
    value: "Summary"
  },
  {
    label: "詳細",
    value: "Detail"
  }
];

const reprints: radio_item<reprint_t>[] = [
  {
    label: "伝票",
    value: "Slip"
  },
  {
    label: "集計",
    value: "Journal"
  }
];

const whens: radio_item<when_t>[] = [
  {
    label: "前回",
    value: "Last"
  },
  {
    label: "前々回",
    value: "BeforeLast"
  }
];

const computeds  = {
  bProductCode: computed(() => {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      Suica:  false,
      QP:     true,
      ID:     true,
      Waon:   false,
      Nanaco: false
    };
    return m.p.moneytype ? tbl[m.p.moneytype] : false;
  }),
  bTaxOther: computed(() => {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      Suica:  false,
      QP:     true,
      ID:     true,
      Waon:   false,
      Nanaco: false
    };
    return m.p.moneytype ? tbl[m.p.moneytype] : false;
  })
}

function onExecute() {
  location.href = m.computedUrl;
}

function isEMoney() {
  switch(m.p.moneytype){
    case "Credit":
    case "Cup": {
      return false;
    }
    case "Suica":
    case "QP":
    case "ID":
    case "Waon":
    case "Nanaco": {
      return true;
    }
    default: false;
  }
}

function baseScheme() {
  if(!m.p.moneytype) return undefined;
  if(!m.p.mode) return undefined;
  if(m.p.mode == "pokepos"){
    return isEMoney() ? "pokeposem-pos://" : "pokepos://";
  }
  else if(m.p.mode == "cnc"){
    return "ppcnc://";
  }
}

function urlCommon() {
  if(!m.p.moneytype) return undefined;

  const training = (() => {
    if(isEMoney()){
      return m.p.bTraining ? "&training=1" : "";
    }
    else{
      return m.p.bTraining ? "&training=1" : "&training=2";
    }
  })();

  const print = (() => {
    return m.p.bPrinting ? "&print=1" : "&print=0";
  })();

  const selfmode = (() => {
    if(m.p.job != "Sales") return "";
    return m.p.bSelfMode ? "&selfmode=1" : "";
  })();

  return `returnUrlScheme=${m.p.returnUrl}${training}${print}${selfmode}`;
}

function doUrlService() {
  do {
    const scheme = baseScheme();
    if(!scheme) break;
    if(!m.p.moneytype) break;
    if(isNaN(parseInt(m.p.amount))) break;

    const path = `Service${m.p.moneytype}`;
    const common = urlCommon();
    const amount = `&amount=${m.p.amount}`

    const productCode = (() => {
      if(computeds.bProductCode.value){
        if(isNaN(parseInt(m.p.productCode))) undefined;
        if(m.p.moneytype == "ID") return `&goodsCode=${m.p.productCode}`;
        /* TODO: クレジットってProductCode不要？ */
      }
      return "";
    })();
    if(productCode === undefined) break;

    const taxOther = (() => {
      if(computeds.bTaxOther.value){
        if(isNaN(parseInt(m.p.taxOther))) undefined;
        return `&taxOther=${m.p.taxOther.length == 0 ? "0" : m.p.taxOther}`;
      }
      return "";
    })();
    if(taxOther === undefined) break;

    const operationDiv = (() => {
      if(isEMoney()){
        const tbl: {[_ in job_t]: string} = {
          Sales:    "&operationDiv=1",
          Refund:   "&operationDiv=2",
          Confirm:  "&operationDiv=3"
        }
        return m.p.job ? tbl[m.p.job] : "";
      }
      else{
        const tbl: {[_ in job_t]: string} = {
          Sales:    "&operationDiv=0",
          Refund:   "&operationDiv=1",
          Confirm:  ""
        }
        return m.p.job ? tbl[m.p.job] : "";
      }
    })();

    const together = (() => {
      if(m.p.moneytype == "Suica" && m.p.job == "Sales"){
        return `&together=${m.p.bTogether?"1":"0"}`;
      }
      return "";
    })();

    return `${scheme}${path}?${common}${amount}${productCode}${taxOther}${operationDiv}${together}`;
  // eslint-disable-next-line no-constant-condition
  } while(false);

  return undefined;
}

function doUrlJournal() {
  do {
    if(isEMoney()) break; /* 電子マネーは未サポート */

    const scheme = baseScheme();
    if(!scheme) break;
    if(!m.p.moneytype) break;

    const path = `Journal${m.p.moneytype}`;
    const common = urlCommon();


    const operationDiv = (() => {
      const tbl: {[_ in journal_t]: string} = {
        Total:        "&operationDiv=0",
        Intermediate: "&operationDiv=1"
      }
      return m.p.journal ? tbl[m.p.journal] : undefined;
    })();
    if(operationDiv === undefined) break;

    return `${scheme}${path}?${common}${operationDiv}`;
  // eslint-disable-next-line no-constant-condition
  } while(false);
  
  return undefined;
}

function doUrlReprint() {
  do {
    const scheme = baseScheme();
    if(!scheme) break;
    if(!m.p.moneytype) break;

    const path = `Reprint${m.p.moneytype}`;
    const common = urlCommon();


    const operationDiv = (() => {
      if(isEMoney()){
        const tbl: {[_ in reprint_t]: string | undefined} = {
          Slip:     "&operationDiv=2",
          Journal:  undefined
        }
        return m.p.reprint ? tbl[m.p.reprint] : undefined;
      }
      else{
        const tbl: {[_ in reprint_t]: string} = {
          Slip:     "&operationDiv=1",
          Journal:  ""
        }
        return m.p.reprint ? tbl[m.p.reprint] : undefined;
      }
    })();
    if(operationDiv === undefined) break;

    return `${scheme}${path}?${common}${operationDiv}`;
  // eslint-disable-next-line no-constant-condition
  } while(false);
  
  return undefined;
}

function updateUrl() {
  const url = (() => {
    switch(m.p.menu){
      case "Service": {
        return doUrlService();
      }
      case "Journal": {
        return doUrlJournal();
      }
      case "Reprint": {
        return doUrlReprint();
      }
      default: {
        return undefined;
      }
    }
  })();

  m.computedUrl = url ?? "";
}

watch(() => m.p.mode        , ()=> updateUrl());
watch(() => m.p.menu        , ()=> updateUrl());
watch(() => m.p.moneytype   , ()=> updateUrl());
watch(() => m.p.job         , ()=> updateUrl());
watch(() => m.p.journal     , ()=> updateUrl());
watch(() => m.p.detail      , ()=> updateUrl());
watch(() => m.p.reprint     , ()=> updateUrl());
watch(() => m.p.when        , ()=> updateUrl());
watch(() => m.p.bTraining   , ()=> updateUrl());
watch(() => m.p.bPrinting   , ()=> updateUrl());
watch(() => m.p.bSelfMode   , ()=> updateUrl());
watch(() => m.p.bTogether   , ()=> updateUrl());
watch(() => m.p.amount      , ()=> updateUrl());
watch(() => m.p.taxOther    , ()=> updateUrl());
watch(() => m.p.productCode , ()=> updateUrl());
watch(() => m.p.slipNo      , ()=> updateUrl());
watch(() => m.p.termId      , ()=> updateUrl());
watch(() => m.p.manualFlg   , ()=> updateUrl());
watch(() => m.p.pan         , ()=> updateUrl());
watch(() => m.p.returnUrl   , ()=> updateUrl());

export default defineComponent({
  setup(prop, ctx) {
    LOG(ctx.root.$route.query);
    const form = ref<iform>();
    return {
      m,
      modes,
      menus,
      moneytypes,
      jobs,
      journals,
      reprints,
      whens,
      details,
      form,
      ...computeds,
      ...validations,
      onExecute
    };
  }
});

</script>
