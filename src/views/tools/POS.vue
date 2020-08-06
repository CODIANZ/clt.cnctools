<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-radio-group v-model="m.mode" row>
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
            :disabled="!m.b.together"
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
            :disabled="!m.b.taxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.productCode"
            label="商品コード"
            :rules="[required,length(4)]"
            :disabled="!m.b.productCode"
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
          <v-textarea
            v-model="m.computedUrl"
            label="生成URL"
            outlined
            readonly
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            rounded
            color="primary"
            dark
            @click="onExecute"
            :disabled="!m.b.valid"
          >
          実行
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil";
import { UrlBuilder } from "@/codes/UrlBuilder";
import { debug } from "debug";
const LOG = debug("app:POS");

let builder: UrlBuilder.Base | undefined = undefined;

type mode_t = "pokepos" | "cnc";

const m = reactive({
  mode: undefined as mode_t | undefined,
  p: UrlBuilder.Base.DefaultParams,
  computedUrl: "",
  b: {
    productCode: false,
    taxOther: false,
    together: false,
    valid: false
  }
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

const menus: radio_item<UrlBuilder.menus_t>[] = [
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

const moneytypes: radio_item<UrlBuilder.moneytype_t>[] = [
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

const jobs: radio_item<UrlBuilder.job_t>[] = [
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

const journals: radio_item<UrlBuilder.journal_t>[] = [
  {
    label: "日計",
    value: "Total"
  },
  {
    label: "中間計",
    value: "Intermediate"
  }
];

const details: radio_item<UrlBuilder.detail_t>[] = [
  {
    label: "簡易",
    value: "Summary"
  },
  {
    label: "詳細",
    value: "Detail"
  }
];

const reprints: radio_item<UrlBuilder.reprint_t>[] = [
  {
    label: "伝票",
    value: "Slip"
  },
  {
    label: "集計",
    value: "Journal"
  }
];

const whens: radio_item<UrlBuilder.when_t>[] = [
  {
    label: "前回",
    value: "Last"
  },
  {
    label: "前々回",
    value: "BeforeLast"
  }
];

function paramsToBuilder() {
  if(!builder) return;
  builder.Params.menu        = m.p.menu;
  builder.Params.moneytype   = m.p.moneytype;
  builder.Params.job         = m.p.job;
  builder.Params.journal     = m.p.journal;
  builder.Params.detail      = m.p.detail;
  builder.Params.reprint     = m.p.reprint;
  builder.Params.when        = m.p.when;
  builder.Params.bTraining   = m.p.bTraining;
  builder.Params.bPrinting   = m.p.bPrinting;
  builder.Params.bSelfMode   = m.p.bSelfMode;
  builder.Params.bTogether   = m.p.bTogether;
  builder.Params.amount      = m.p.amount;
  builder.Params.taxOther    = m.p.taxOther;
  builder.Params.productCode = m.p.productCode;
  builder.Params.slipNo      = m.p.slipNo;
  builder.Params.termId      = m.p.termId;
  builder.Params.manualFlg   = m.p.manualFlg;
  builder.Params.pan         = m.p.pan;
  builder.Params.returnUrl   = m.p.returnUrl;
}

function updateUrl() {
  if(builder){
    paramsToBuilder();
    m.b.taxOther    = builder.isNeedTaxOther();
    m.b.productCode = builder.isNeedProductCode();
    m.b.together    = builder.isNeedTogether();

    const url = builder.generateUrl();
    m.b.valid       = url !== undefined;
    m.computedUrl = url ?? "";
  }
  else{
    m.computedUrl = "";
  }
}

function changeMode() {
  switch(m.mode){
    case "pokepos":{
      if(UrlBuilder.Base.isEMoney(m.p.moneytype)){
        builder = new UrlBuilder.PokeposEM();
      }
      else{
        builder = new UrlBuilder.Pokepos();
      }
      break;
    }
    case "cnc":     builder = undefined; break;
    default:        builder = undefined; break;
  }
  if(builder){
    paramsToBuilder();
  }
  updateUrl();
}

watch(() => m.mode          , ()=> changeMode());

watch(() => m.p.menu        , ()=> updateUrl());
watch(() => m.p.moneytype   , ()=> changeMode());
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

function onExecute() {
  location.href = m.computedUrl;
}

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
      ...validations,
      onExecute
    };
  }
});

</script>
