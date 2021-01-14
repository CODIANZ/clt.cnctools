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
            label="トレーニング"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bPrinting"
            inset
            label="印字"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bSelfMode"
            inset
            label="セルフモード"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.bTogether"
            inset
            label="現金併用"
            :disabled="!m.b.together"
          ></v-switch>
        </v-col>
      </v-row>

      <v-row v-if="m.p.moneytype=='Credit'&&(m.p.job=='Sales'||m.p.job=='Refund')">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.taxOther"
            label="税・その他"
            type="number"
            :rules="[required,range(0,99999)]"
            :disabled="!m.b.taxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.productCode"
            label="商品コード"
            type="number"
            :rules="[required,length(4)]"
            :disabled="!m.b.productCode"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="m.p.moneytype=='Credit'&&m.p.job=='Refund'">
        <v-col>
          <v-text-field
            v-model="m.p.slipNo"
            label="伝票番号"
            type="number"
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
            label="マニュアル"
          ></v-switch>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.pan"
            label="カード番号"
            :rules="[required,length(16)]"
          ></v-text-field>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="2"
        >
          <v-select
            v-model="m.p.transactionType"
            :items="m.transactionTypeItems"
            item-text="name"
            item-value="value"
            label="取引区分"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="m.p.moneytype=='Credit'&&m.p.job=='AuthorizedReservations'">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.taxOther"
            label="税・その他"
            type="number"
            :rules="[required,range(0,99999)]"
            :disabled="!m.b.taxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.p.lump"
            inset
            label="一括払優先"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row v-if="m.p.moneytype=='Credit'&&m.p.job=='ApprovedSales'">
        <v-col>
          <v-text-field
            v-model="m.p.approvalNo"
            label="承認番号"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.taxOther"
            label="税・その他"
            type="number"
            :rules="[required,range(0,99999)]"
            :disabled="!m.b.taxOther"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="(m.p.moneytype=='Cup'||m.p.moneytype=='Suica'||m.p.moneytype=='QP'||m.p.moneytype=='Waon')&&m.p.job=='Sales'">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="m.p.moneytype=='Cup'&&m.p.job=='Refund'">
        <v-col>
          <v-text-field
            v-model="m.p.slipNo"
            label="伝票番号"
            type="number"
            :rules="[required,length(5)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.approvalNo"
            label="承認番号"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.cupNo"
            label="銀聯番号"
            type="number"
            :rules="(/^[0-9]+$/)"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.SendDate"
            label="銀聯送信日時"
            type="number"
            :rules="(/^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$ ^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="2"
        >
          <v-select
            v-model="m.p.transactionType"
            :items="m.transactionTypeItems"
            item-text="name"
            item-value="value"
            label="取引区分"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="(m.p.moneytype=='QP'||m.p.moneytype=='ID')&&m.p.job=='Cancel'">
        <v-col>
          <v-text-field
            v-model="m.p.slipNo"
            label="伝票番号"
            type="number"
            :rules="[required,length(5)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.termId"
            label="端末ID"
            type="number"
            :rules="[required,length(9)]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="m.p.moneytype=='ID'&&(m.p.job=='Sales'||m.p.job=='Cancel')">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.taxOther"
            label="税・その他"
            type="number"
            :rules="[required,range(0,99999)]"
            :disabled="!m.b.taxOther"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.p.productCode"
            label="商品コード"
            type="number"
            :rules="[required,length(4)]"
            :disabled="!m.b.productCode"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="m.p.moneytype=='Nanaco'&&m.p.job=='Payment'">
        <v-col>
          <v-text-field
            v-model="m.p.amount"
            label="金額"
            type="number"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="m.p.returnUrl"
            label="戻りURL"
            :rules="[required]"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-switch
            v-model="m.useEncode"
            inset
            label="URLエンコード"
          ></v-switch>
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
          <v-text-field
            v-model="m.baseUrlForNuxt"
            label="検証用baseURL"
          ></v-text-field>
        </v-col>
      </v-row>

            <v-row>
        <v-col>
          <v-textarea
            v-model="m.computedUrlForNuxt"
            label="生成URL(検証用)"
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
          実行 - {{ m.p.logid }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            rounded
            color="info"
            dark
            @click="onExecuteForNuxt"
            :disabled="!m.b.valid"
          >
          実行(検証用) - {{ m.p.logid }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil";
import { UrlBuilder } from "@/codes/UrlBuilder";
import { ResultStore } from "@/codes/ResultStore";
import dateFormat from "dateformat";
import { debug } from "debug";
const LOG = debug("app:POS");

let builder: UrlBuilder.Base | undefined = undefined;

type mode_t = "pokepos" | "cnc";

const m = reactive({
  p: UrlBuilder.Base.DefaultParams,
  computedUrl: "",
  baseUrlForNuxt: "http://localhost:3000/#/pos/",
  computedUrlForNuxt: "",
  useEncode: false,
  transactionTypeItems: [
    { name: '取消', value: '1' },
    { name: '返品', value: '2' }
  ],
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
    label: "クレジット",
    value: "Credit"
  },
  {
    label: "銀聯",
    value: "Cup"
  },
  {
    label: "NFC",
    value: "NFC"
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

const jobs = computed<radio_item<UrlBuilder.job_t>[]>(() =>  {
  if(m.p.moneytype == "Credit"){
    return [
      {
        label: "売上",
        value: "Sales"
      },
      {
        label: "取消返品",
        value: "Refund"
      },
      {
        label: "オーソリ予約",
        value: "AuthorizedReservations"
      },
      {
        label: "承認後売上",
        value: "ApprovedSales"
      },
      {
        label: "カードチェック",
        value: "CardCheck"
      }
    ];
  }
  if(m.p.moneytype == "Cup" || m.p.moneytype == "NFC" ){
    return [
      {
        label: "売上",
        value: "Sales"
      },
      {
        label: "取消返品",
        value: "Refund"
      }
    ];
  }
  if(m.p.moneytype == "Suica" ){
    return [
      {
        label: "売上",
        value: "Sales"
      },
      {
        label: "残高照会",
        value: "BalanceInquiry"
      },
    ];
  }
  if(m.p.moneytype == "QP" || m.p.moneytype == "ID" ){
    return [
      {
        label: "売上",
        value: "Sales"
      },
      {
        label: "取消",
        value: "Cancel"
      },
      {
        label: "前回取引確認",
        value: "Confirm"
      }
    ];
  }
  if(m.p.moneytype == "Nanaco" ){
    return [
      {
        label: "支払",
        value: "Payment"
      },
      {
        label: "残高照会",
        value: "BalanceInquiry"
      },
      {
        label: "前回取引確認",
        value: "Confirm"
      }
    ];
  }
  if(m.p.moneytype == "Waon" ){
    return [
      {
        label: "売上",
        value: "Sales"
      },
      {
        label: "取消",
        value: "Cancel"
      },
      {
        label: "残高照会",
        value: "BalanceInquiry"
      },
      {
        label: "履歴照会",
        value: "HistoryInquiry"
      },
      {
        label: "ポイントチャージ",
        value: "PointCharge"
      },
      {
        label: "前回取引確認",
        value: "Confirm"
      }
    ];
  };
});

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
    label: "日計",
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

function updateLogIdAndReturnUrl() {
  const d = dateFormat(new Date(), "yyyymmddHHMMss");
  m.p.logid = d;

  if(builder){
    if((!builder.isEMoney()) && (m.p.mode == "pokepos")){
      m.p.returnUrl = `${location.protocol}//${location.host}/tools/posresult/${d}?escape=`;
    }
    else{
      m.p.returnUrl = `${location.protocol}//${location.host}/tools/posresult/${d}`;
    }
  }
}

function updateUrl() {
  if(builder){
    updateLogIdAndReturnUrl();
    paramsToBuilder();
    m.b.taxOther    = builder.isNeedTaxOther();
    m.b.productCode = builder.isNeedProductCode();
    m.b.together    = builder.isNeedTogether();

    const url = builder.generateUrl(m.useEncode);
    m.b.valid     = url !== undefined;
    m.computedUrl = url ?? "";

    m.computedUrlForNuxt =m.baseUrlForNuxt+ m.computedUrl.replace(/^[a-z\-]+:\/\//, "") ;
  }
  else{
    m.computedUrl = "";
    m.computedUrlForNuxt = ""
  }
}

function changeMode() {
  switch(m.p.mode){
    case "pokepos":{
      if(UrlBuilder.Base.isEMoney(m.p.moneytype)){
        builder = new UrlBuilder.PokeposEM();
      }
      else{
        builder = new UrlBuilder.Pokepos();
      }
      break;
    }
    case "cnc":{
      builder = new UrlBuilder.Cnc();
      break;
    }
    default:        builder = undefined; break;
  }
  if(builder){
    paramsToBuilder();
  }
  updateUrl();
}

watch(() => m.p.mode        , ()=> changeMode());

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
watch(() => m.useEncode     , ()=> updateUrl());

function onExecute() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  location.href = m.computedUrl;
}

function onExecuteForNuxt() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  open(m.computedUrlForNuxt, "_blank")
}

export default defineComponent({
  setup() {
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
      onExecute,
      onExecuteForNuxt
    }
  }
});

</script>
