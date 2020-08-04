<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-radio-group v-model="m.menu" row>
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
          <v-radio-group v-model="m.moneytype" row>
            <v-radio
              v-for="it in moneytypes"
              :key="`moneytypes-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.menu=='Service'">
        <v-col>
          <v-radio-group v-model="m.job" row>
            <v-radio
              v-for="it in jobs"
              :key="`jobss-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.menu=='Reprint'">
        <v-col>
          <v-radio-group v-model="m.reprint" row>
            <v-radio
              v-for="it in reprints"
              :key="`reprints-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.menu=='Journal'">
        <v-col>
          <v-radio-group v-model="m.journal" row>
            <v-radio
              v-for="it in journals"
              :key="`journals-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="(m.menu=='Journal')||(m.menu=='Reprint'&&m.reprint=='Journal')">
        <v-col>
          <v-radio-group v-model="m.detail" row>
            <v-radio
              v-for="it in details"
              :key="`details-${it.value}`"
              :label=it.label
              :value=it.value
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.menu=='Reprint'&&m.reprint=='Journal'">
        <v-col>
          <v-radio-group v-model="m.when" row>
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
            v-model="m.bTraining"
            inset
            :label="`トレーニング`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.bPrinting"
            inset
            :label="`印字`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.bSelfMode"
            inset
            :label="`セルフモード`"
          ></v-switch>
        </v-col>
      </v-row>

      <v-row v-if="m.menu=='Service'&&m.job=='Sales'">
        <v-col>
          <v-text-field
            v-model="m.amount"
            label="金額"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.taxOther"
            label="税・その他"
            :rules="[required,range(1,99999)]"
            :disabled="!bTaxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.productCode"
            label="商品コード"
            :rules="[required,length(4)]"
            :disabled="!bProductCode"
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
          >
          実行
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive, ref, computed } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil";
import { debug } from "debug";
const LOG = debug("app:POS");

type menus_t      = "Service" | "Journal" | "Reprint";
type moneytype_t  = "Credit" | "Cup" | "Suica" | "QP" | "ID" | "Waon" | "Nanaco";
type job_t        = "Sales" | "Refund" | "Confirm";
type journal_t    = "Total" | "Intermediate";
type detail_t     = "Summary" | "Detail";
type reprint_t    = "Slip" | "Journal";
type when_t       = "Last" | "BeforeLast";

const m = reactive({
  menu: undefined as menus_t | undefined,
  moneytype: undefined as moneytype_t | undefined,
  job: undefined as job_t | undefined,
  journal: undefined as journal_t | undefined,
  detail: undefined as detail_t | undefined,
  reprint: undefined as reprint_t | undefined,
  when: undefined as when_t | undefined,
  bTraining: false,
  bPrinting: false,
  bSelfMode: false,
  amount: "",
  taxOther: "",
  productCode: "",
  baseScheme: "pokeposem-pos://"
});


interface radio_item<T> {
  label: string;
  value: T;
}

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
    return m.moneytype ? tbl[m.moneytype] : false;
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
    return m.moneytype ? tbl[m.moneytype] : false;
  })
}

function isEMoney(mt: moneytype_t) {
  switch(m.moneytype){
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

function urlCommon() {
  return  `training=${m.bTraining?"1":"0"}` +
          `&bPrinting=${m.bPrinting?"1":"0"}` +
          `&bSelfMode=${m.bSelfMode?"1":"0"}`;
}

function urlService() {
  const baseUrl = `${m.baseScheme}Service${m.moneytype}`;
  const amount = `?amount=${m.amount}`
  const productCode = (() => {
    if(computeds.bProductCode.value){
      if(m.moneytype == "ID") return `&goodsCode=${m.productCode}`;
      /* TODO: クレジットってProductCode不要？ */
    }
    return "";
  })();
  const taxOther = (() => {
    if(computeds.bTaxOther.value){
      return `&taxOther=${m.taxOther}`;
    }
    return "";
  })();
  const operationDiv = (() => {
    if(!m.moneytype) return "";

    if(isEMoney(m.moneytype)){
      const tbl: {[_ in job_t]: string} = {
        Sales:    "&operationDiv=1",
        Refund:   "&operationDiv=2",
        Confirm:  ""
      }
      return m.job ? tbl[m.job] : "";
    }
    else{
      const tbl: {[_ in job_t]: string} = {
        Sales:    "&operationDiv=0",
        Refund:   "&operationDiv=1",
        Confirm:  "&operationDiv=2"
      }
      return m.job ? tbl[m.job] : "";
    }
  })();
  return `${baseUrl}${amount}${productCode}${taxOther}${operationDiv}&${urlCommon()}`;
}

function onExecute() {
  const url = (() => {
    switch(m.menu){
      case "Service": {
        return urlService();
      }
      case "Journal": {
        return "";
      }
      case "Reprint": {
        return "";
      }
      default: {
        return "";
      }
    }
  })();
  LOG(`onExecute = ${url}`);
  location.href = url;
}

export default defineComponent({
  setup(props, ctx) {
    const form = ref<iform>();
    return {
      m,
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
