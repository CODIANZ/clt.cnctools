<template>
  <v-form ref="form">
    <v-container >
      <v-row >
        <v-radio-group v-model="m.p.mode" row >
          <v-radio v-for="it in modes" :key="`modes-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.mode" >
        <v-radio-group v-model="m.p.menu" row >
          <v-radio v-for="it in menus" :key="`menus-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.menu === 'Journal'" >
        <v-radio-group v-model="m.p.journal" row class="ml-6" >
          <v-radio v-for="it in journals" :key="`journals-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>
      <v-row v-else-if="m.p.menu === 'Reprint'" >
        <v-radio-group v-model="m.p.reprint" row class="ml-6" >
          <v-radio v-for="it in reprints" :key="`reprints-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'Menu'" >
        <v-radio-group v-model="m.p.menutype" row class="ml-6" >
          <v-radio v-for="it in menutypes" :key="`menutypes-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>
      <v-row v-else-if="m.p.mode && m.p.menu !== 'Hello' && m.p.menu !== 'CheckInterrupted' /* && m.p.menu !== 'ClearInterrupted' */">
        <v-radio-group v-model="m.p.moneytype" row >
          <v-radio v-for="it in moneytypes" :key="`moneytypes-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.menu === 'Service' && jobs && jobs.length > 0" >
        <v-radio-group v-model="m.p.job" row >
          <v-radio v-for="it in jobs" :key="`jobs-${it.value}`" :label=it.label :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="isChoicePrintDetail" >
        <v-checkbox v-model="m.p.isUseDetail" label="詳細タイプ" hide-details />
        <v-radio-group v-model="m.p.detail" row >
          <v-radio v-for="it in details" :key="`details-${it.value}`" :label=it.label  :value=it.value />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.menu === 'Reprint' && m.p.reprint === 'Journal'" >
        <v-col>
          <v-row  >
            <v-checkbox v-model="m.p.isUseWhen" label="対象" />
            <v-radio-group v-model="m.p.when" row >
              <v-radio v-for="it in whens" :key="`whens-${it.value}`" :label=it.label :value=it.value />
            </v-radio-group>
          </v-row>
        </v-col>
      </v-row>

      <hr />

      <v-row v-if="m.p.mode && m.p.menu !== 'Menu' && m.p.menu !== 'Hello' && m.p.menu !== 'CheckInterrupted' /* && m.p.menu !== 'ClearInterrupted' */" >
        <v-col :cols="getCols('print')" class="mt-0 mb-0 pt-0 pb-1" >
          <v-row >
            <v-checkbox v-model="m.p.isUsePrinting" label="印字" hide-details />
            <v-switch inset v-model="m.p.bPrinting" hide-details />
          </v-row>
        </v-col>
        <v-col v-if="m.p.mode && m.p.mode == 'Cnc'" :cols="getCols('self')" class="mt-0 mb-0 pt-0 pb-1" >
          <v-row >
            <v-checkbox v-model="m.p.isUseSelfMode" label="セルフモード" hide-details />
            <v-switch inset v-model="m.p.bSelfMode" hide-details />
          </v-row>
        </v-col>
        <v-col :cols="getCols('training')"  class="mt-0 mb-0 pt-0 pb-1" >
          <v-row >
            <v-checkbox v-model="m.p.isUseTraining" label="トレーニング" hide-details />
            <v-switch inset v-model="m.p.bTraining" hide-details />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'CheckInterrupted'"  >
        <v-col :cols="getCols('print')" >
          <v-row >
            <v-checkbox v-model="m.p.isUsePrinting" density="compact" label="印字" hide-details />
            <v-switch inset v-model="m.p.bPrinting" hide-details />
          </v-row>
        </v-col>
        <v-spacer />
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'Menu'" >
        <v-col :cols="getCols('print')" >
          <v-row >
            <v-checkbox v-model="m.p.isUsePrinting" density="compact" label="印字" hide-details />
            <v-switch inset v-model="m.p.bPrinting" hide-details />
          </v-row>
        </v-col>
        <v-col :cols="getCols('training')" >
          <v-row>
            <v-checkbox v-model="m.p.isUseTraining" density="compact" label="トレーニング" hide-details />
            <v-switch inset v-model="m.p.bTraining" hide-details />
          </v-row>
        </v-col>
        <v-spacer />
      </v-row>

      <v-row v-if="m.p.mode && m.p.mode == 'Cnc'" >
        <v-checkbox v-model="m.p.isUsePosExtendData" density="compact" hide-details class="pt-3 mr-0 pr-0" />
        <v-textarea v-model="m.p.posExtendData" label="POS拡張データ(45バイト)" type="text" clearable filled counter auto-grow rows="1" />
      </v-row>

      <v-row v-if="isWithMoney" >
        <v-col>
          <v-row>
            <v-checkbox v-model="m.p.isUseWithCash" density="compact" hide-details />
            <v-switch inset v-model="m.p.bWithCash" label="現金併用" hide-details />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isApprovalNo || isLump" >
        <v-col v-if="isApprovalNo" class="ma-0 pa-0" >
          <v-text-field v-model="m.p.approvalNumber" label="承認番号" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isLump">
          <v-row >
            <v-checkbox v-model="m.p.isUseLump" label="一括払優先" hide-details />
            <v-switch inset v-model="m.p.bLump" hide-details />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isExtRefund" >
        <v-col :cols="getCols('cancelAmount')" class="mt-0 mb-0 pt-0 pb-0" >
          <v-row >
            <v-checkbox v-model="m.p.isUseSlipNo" density="compact" hide-details label="伝票番号" />
            <v-text-field v-model="m.p.slipNo" type="text" class="shrink" clearable filled counter style="width: 10em;" />
          </v-row>
        </v-col>

        <v-col :cols="getCols('cancelAmount')" class="mt-0 mb-0 pt-0 pb-0" >
          <v-row >
            <v-checkbox v-model="m.p.isUseCancelAmount" density="compact" hide-details label="金額" />
            <v-text-field v-model="m.p.amount" type="text" class="shrink" clearable filled counter style="width: 10em;" />
          </v-row>
        </v-col>

        <v-col :cols="getCols('cancelPaymentDiv')" class="mt-0 mb-0 pt-0 pb-0" >
          <v-row >
            <v-checkbox v-model="m.p.isUseCancelPaymentDiv" density="compact" hide-details label="支払方法" />
            <v-text-field v-model="m.p.cancelPaymentDiv" type="text" class="shrink" clearable filled style="width: 11em;" messages="10,21,22,24,31,34,61,63,80" />
          </v-row>
        </v-col>

        <v-col :cols="getCols('cancelType')"  class="mt-0 mb-0 pt-0 pb-0">
          <v-row >
            <v-checkbox v-model="m.p.isUseCancelType" hide-details label="取消種別" />
            <v-radio-group v-model="m.p.cancelType" row hide-details >
              <v-radio v-for="it in refundTypeItems" :key="`refundTypeItems-${it.value}`" :label=it.label :value=it.value />
            </v-radio-group>
          </v-row>
        </v-col>

        <v-col :cols="getCols('cancelEdit')" class="mt-0 mb-0 pt-0 pb-0" >
          <v-row col >
            <v-checkbox v-model="m.p.isUseCancelEdit" hide-details label="取消編集" />
            <v-switch v-model="m.p.cancelEdit" inset hide-details />
          </v-row>
        </v-col>

        <v-col cols="12" style="height: 1em;" />

      </v-row>
      <v-row v-else-if="isRefund" >
        <v-col v-if="isReceiptNumber" :cols="getCols('slipNo')" class="ma-0 pa-0" >
          <v-text-field v-model="m.p.slipNo" label="伝票番号" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isTerminalID">
          <v-text-field v-model="m.p.otherTermJudgeNo" label="SPRWID" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isRefundType" :cols="getCols('cancelType')" >
          <v-row col >
            <v-checkbox v-model="m.p.isUseCancelType" label="取消種別" hide-details />
            <v-radio-group v-model="m.p.cancelType" row >
              <v-radio v-for="it in refundTypeItems" :key="`refundTypeItems-${it.value}`" :label=it.label :value=it.value />
            </v-radio-group>
          </v-row>
        </v-col>
        <v-col v-if="isManualReturn" cols="8">
          <v-row >
            <v-checkbox v-model="m.p.isUseManualFlg" label="マニュアル返品" hide-details />
            <v-switch v-model="m.p.manualFlg" inset hide-details />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isAmount || isTaxOther || isProductCode" >
        <v-col v-if="isAmount" class="ma-0 pa-0 mr-1" >
          <v-text-field v-model="m.p.amount" label="金額" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isTaxOther" class="ma-0 pa-0 mr-1" >
          <v-text-field v-model="m.p.taxOther" label="その他" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isProductCode" class="ma-0 pa-0" >
          <v-text-field v-model="m.p.productCode" label="商品コード" type="text" clearable filled counter />
        </v-col>
      </v-row>

      <hr />

      <v-row class="shrink" >
        <v-checkbox v-model="m.useEncode" label="URLエンコード" hide-details />
        <v-spacer />
        <v-checkbox v-model="m.openNewPage" label="別ページで開く" hide-details />
        <v-spacer />
        <v-checkbox v-model="m.customReturnUrl" label="戻りURLをカスタム" hide-details />
      </v-row>

      <v-row >
        <v-textarea v-model="m.p.returnUrl" label="戻りURL" :rules="[required]" :readonly="!m.customReturnUrl" rows="1" auto-grow filled />
      </v-row>

      <v-row v-if="!m.bBrowserCall" >
        <v-textarea v-model="m.computedUrl" label="生成URL" outlined readonly rows="1" auto-grow filled />
      </v-row>
      <v-row v-if="!m.bBrowserCall" >
        <v-spacer />
        <v-btn color="info" :disabled="!m.b.valid" @click="updateUrl" > Log ID 更新 </v-btn>
        <v-spacer />
        <v-btn rounded color="primary" dark :disabled="!m.b.valid" @click="onExecute" > 実行 - {{ m.p.logid }} </v-btn>
        <v-spacer />
      </v-row>

      <v-row v-if="m.bBrowserCall" >
        <v-col>
          <v-text-field v-model="m.browserCall.nuxtServeUrl" label="Nuxt serve url" type="text" />
        </v-col>
        <v-col>
          <v-text-field v-model="m.browserCall.targetIP" label="target IP" type="text" />
        </v-col>
        <v-col>
          <v-text-field v-model="m.browserCall.targetPort" label="target Port" type="text" />
        </v-col>
      </v-row>
      <v-row v-if="m.bBrowserCall" >
        <v-textarea v-model="m.computedBrowserCallUrl" label="生成URL(検証用)" outlined readonly rows=2 auto-grow />
      </v-row>
      <v-row v-if="m.bBrowserCall" >
        <v-textarea v-model="m.computedBrowserJavascript" label="JavascriptCode(検証用)" outlined readonly rows=2 auto-grow />
      </v-row>
      <v-row v-if="m.bBrowserCall" >
        <v-spacer />
        <v-btn color="info" :disabled="!m.b.valid" @click="updateUrl" > Log ID 更新 </v-btn>
        <v-spacer />
        <v-btn rounded color="info" dark :disabled="!m.b.valid" @click="onExecuteBrowserCall" > 実行(検証用) - {{ m.p.logid }} </v-btn>
        <v-spacer />
        <v-btn rounded color="brown" dark :disabled="!m.b.valid" @click="onCopyUrl" > URLコピー</v-btn>
        <v-spacer />
        <v-btn rounded color="brown" dark :disabled="!m.b.valid" @click="onCopyJavascript" > Javascriptコピー</v-btn>
        <v-spacer />
      </v-row>

      <v-row style="height: 1em;" />

      <hr />

      <v-row >
        <v-switch v-model="m.bBrowserCall" inset label="ブラウザーURL呼び出し（開発者以外は使用しないでください）" />
        <v-spacer />
      </v-row>

    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil";
import { UrlBuilder } from "@/codes/UrlBuilder";
import { ResultStore } from "@/codes/ResultStore";
import { mode_t } from "@/codes/UrlBuilder/Builders/Types";
import dateFormat from "dateformat";
import { debug } from "debug";

const LOG = debug("app:POS");

let builder: UrlBuilder.Base | undefined = undefined;

const m = reactive({
  p: UrlBuilder.Base.DefaultParams,
  bBrowserCall: false,
  computedUrl: "",
  browserCall: {
    nuxtServeUrl: "http://localhost:3000/",
    targetPort: "50555",
    targetIP: "a.b.c.d"
  },
  computedBrowserCallUrl: "",
  computedBrowserJavascript: "",
  useEncode: false,
  openNewPage: true,
  customReturnUrl: false,
  b: {
    productCode: false,
    taxOther: false,
    withCash: false,
    lump: false,
    valid: false,
    selfMode: false
  }
});


interface field_item<T> {
  label: string;
  value: T;
}


const modes: field_item<mode_t>[] = [
  { label: "CNC", value: "Cnc" },
  { label: "pokepos/EM 互換", value: "Pokepos" }
];

const menus = computed<field_item<UrlBuilder.menus_t>[]>(() => {
  let result: field_item<UrlBuilder.menus_t>[] = [
    { label: "決済", value: "Service" },
    { label: "集計", value: "Journal" },
    { label: "再印字", value: "Reprint" },
  ];

  if (m.p.mode === "Cnc") {
    result.push({ label: "業務メニュー", value: "Menu" });
    result.push({ label: "起動要求", value: "Hello" });
    result.push({ label: "中断業務確認", value: "CheckInterrupted" });
    // result.push({ label: "中断業務クリア", value: "ClearInterrupted" });
  }

  return result;
});

const moneytypes = computed<field_item<UrlBuilder.moneytype_t>[]>(() =>  {
  var items: field_item<UrlBuilder.moneytype_t>[] = [
    { label: "クレジット", value: "Credit" },
    { label: "銀聯", value: "Cup" },
    { label: "NFC", value: "NFC" },
    { label: "交通系IC", value: "Suica" },
    { label: "QUICPay", value: "QP" },
    { label: "iD", value: "iD" }
  ];

  if (m.p.mode === "Cnc") {
    items.push({ label: "WAON", value: "WAON" });
    items.push({ label: "Edy", value: "Edy" });
    items.push({ label: "nanaco", value: "nanaco" });
  }

  if (m.p.menu === "Journal" || (m.p.menu === "Reprint" && m.p.reprint === "Journal")) {
    items.push({ label: "全取引", value: "All" });
  }

  return items;
});


const menutypes = computed<field_item<UrlBuilder.menutype_t>[]>(() =>  {
  var items: field_item<UrlBuilder.menutype_t>[] = [
    { label: "支払選択", value: "Choice" }
  ];
  return items;
});

const jobs = computed<field_item<UrlBuilder.job_t>[]>(() =>  {
  if (m.p.moneytype === "Credit") {
    if (m.p.mode === "Pokepos") {
      return [
        { label: "売上", value: "Sales" },
        { label: "取消返品", value: "Refund" },
        { label: "オーソリ予約", value: "ReservedAuthority" },
        { label: "承認後売上", value: "ApprovedSales" },
        { label: "カードチェック", value: "CardCheck" }
      ];
    }
    return [
      { label: "売上", value: "Sales" },
      { label: "取消返品", value: "Refund" },
      { label: "オーソリ予約", value: "ReservedAuthority" },
      { label: "オーソリ予約取消", value: "RefundReservedAuthority" },
      { label: "承認後売上", value: "ApprovedSales" },
      { label: "承認後売上取消", value: "RefundApprovedSales" },
      { label: "カードチェック", value: "CardCheck"}
    ];
  }
  else if (m.p.moneytype === "Cup" || m.p.moneytype === "NFC") {
    return [
      { label: "売上", value: "Sales" },
      { label: "取消返品", value: "Refund" }
    ];
  }
  else if (m.p.moneytype === "Suica") {
    if (m.p.mode === "Pokepos") {
      return [
        { label: "支払", value: "SubtractValue" },
        { label: "残高照会", value: "Balance" },
        { label: "前回取引確認", value: "Confirm" }
      ];
    }
    return [
      { label: "支払", value: "SubtractValue" },
      { label: "残高照会", value: "Balance" },
      { label: "取消", value: "CancelValue" },
      { label: "前回取引確認", value: "Confirm" }
    ];
  }
  else if(m.p.moneytype === "QP" || m.p.moneytype === "iD") {
    return [
      { label: "売上", value: "SubtractValue" },
      { label: "取消", value: "CancelValue" },
      { label: "前回取引確認", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "WAON") {
    return [
      { label: "支払", value: "SubtractValue" },
      { label: "取消", value: "CancelValue" },
      { label: "残高照会", value: "Balance" },
      { label: "履歴照会", value: "History" },
      { label: "ポイントチャージ", value: "PointCharge" },
      { label: "前回取引確認", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "Edy") {
    return [
      { label: "支払", value: "SubtractValue" },
      { label: "残高照会", value: "Balance" },
      { label: "履歴照会", value: "History" },
      { label: "前回取引確認", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "nanaco") {
    return [
      { label: "支払", value: "SubtractValue" },
      { label: "残高照会", value: "Balance" },
      { label: "前回取引確認", value: "Confirm" }
    ];
  }
  else {
    return [];
  }
});

const refundTypeItems: field_item<UrlBuilder.refundtype_t>[] = [
  { label: "取消", value: "1" },
  { label: "返品", value: "2" }
];

const journals: field_item<UrlBuilder.journal_t>[] = [
  { label: "日計", value: "Total" },
  { label: "中間計", value: "Intermediate" }
];

const details: field_item<UrlBuilder.detail_t>[] = [
  { label: "簡易", value: "Summary" },
  { label: "詳細", value: "Detail" }
];

const reprints: field_item<UrlBuilder.reprint_t>[] = [
  { label: "伝票", value: "Slip" },
  { label: "日計", value: "Journal" }
];

const whens: field_item<UrlBuilder.when_t>[] = [
  { label: "前回", value: "Last" },
  { label: "前々回", value: "BeforeLast" }
];

// Phone デバイスで col を固定させたい場合に記述を追加.
const phoneCols = new Map<String, String>([
  ['print', '5'],
  ['self', '7'],
  ['training', '7'],
  ['slipNo', '5'],
]);

// Tablet デバイスで col を固定させたい場合に記述を追加.
const tabletCols = new Map<String, String>([
  ['print', '4'],
  ['self', '4'],
  ['training', '4'],
  ['slipNo', '6'],
  ['cancelSlipNo', '4'],
  ['cancelAmount', '4'],
  ['cancelPaymentDiv', '4'],
  ['cancelType', '4'],
  ['cancelEdit', '4'],
]);

function paramsToBuilder() {
  if (!builder) {
    return;
  }
  builder.Params.menu        = m.p.menu;
  builder.Params.moneytype   = m.p.moneytype;
  builder.Params.menutype    = m.p.menutype;
  builder.Params.job         = m.p.job;
  builder.Params.journal     = m.p.journal;

  builder.Params.isUseTraining = m.p.isUseTraining;
  builder.Params.bTraining   = m.p.bTraining;
  builder.Params.isUsePrinting = m.p.isUsePrinting;
  builder.Params.bPrinting   = m.p.bPrinting;
  builder.Params.isUseSelfMode = m.p.isUseSelfMode;
  builder.Params.bSelfMode   = m.p.bSelfMode;
  builder.Params.isUseWithCash = m.p.isUseWithCash;
  builder.Params.bWithCash   = m.p.bWithCash;
  builder.Params.isUseLump = m.p.isUseLump;
  builder.Params.bLump       = m.p.bLump;
  builder.Params.isUsePosExtendData  = m.p.isUsePosExtendData;
  builder.Params.posExtendData       = m.p.posExtendData;

  builder.Params.amount      = m.p.amount;
  builder.Params.taxOther    = m.p.taxOther;
  builder.Params.productCode = m.p.productCode;
  builder.Params.slipNo      = m.p.slipNo;
  builder.Params.otherTermJudgeNo = m.p.otherTermJudgeNo;
  builder.Params.isUseManualFlg = m.p.isUseManualFlg;
  builder.Params.manualFlg   = m.p.manualFlg;
  builder.Params.pan         = m.p.pan;
  builder.Params.approvalNumber  = m.p.approvalNumber;
  builder.Params.returnUrl   = m.p.returnUrl;
  builder.Params.isUseCancelType = m.p.isUseCancelType;
  builder.Params.cancelType  = m.p.cancelType;
  builder.Params.isUseCancelPaymentDiv = m.p.isUseCancelPaymentDiv;
  builder.Params.cancelPaymentDiv = m.p.cancelPaymentDiv;
  builder.Params.isUseCancelEdit = m.p.isUseCancelEdit;
  builder.Params.cancelEdit = m.p.cancelEdit;

  builder.Params.reprint     = m.p.reprint;
  builder.Params.isUseDetail = m.p.isUseDetail;
  builder.Params.detail      = m.p.detail;
  builder.Params.isUseWhen   = m.p.isUseWhen;
  builder.Params.when        = m.p.when;
}

function updateLogIdAndReturnUrl() {
  const d = dateFormat(new Date(), "yyyymmddHHMMss");
  m.p.logid = d;

  if (!m.customReturnUrl) {
    if (builder) {
      m.p.returnUrl = `${location.protocol}//${location.host}/tools/posresult/${d}`;
    }
    else {
      m.p.returnUrl = "";
    }
  }
}

function updateUrl() {
  if (builder) {
    updateLogIdAndReturnUrl();
    paramsToBuilder();

    const url = builder.generateUrl(m.useEncode);
    m.b.valid     = url !== undefined;
    m.computedUrl = url ?? "";

    m.computedBrowserCallUrl = `${m.browserCall.nuxtServeUrl}?target=${m.browserCall.targetIP}&port=${m.browserCall.targetPort}#/pos/`
      + m.computedUrl.replace(/^[a-z\-]+:\/\//, "") + "&browser=";
    m.computedBrowserJavascript = `window.posExecute("/pos/${m.computedUrl.replace(/^[a-z\-]+:\/\//, "")}")`
  }
  else {
    m.computedUrl = "";
    m.computedBrowserCallUrl = ""
  }
}

function changeMode() {
  builder = undefined;
  if (m.p.mode) {
    if (m.p.mode == "Pokepos") {
      if (m.p.moneytype == 'Credit' || m.p.moneytype == 'Cup' || m.p.moneytype == 'NFC') {
        builder = new UrlBuilder.Pokepos();
      }
      else if (m.p.moneytype == 'Suica' || m.p.moneytype == 'iD' || m.p.moneytype == 'QP') {
        builder = new UrlBuilder.PokeposEM();
      }
    }
    else if (m.p.mode == "Cnc") {
      builder = new UrlBuilder.Cnc();
    }
  }
  if (builder) {
    paramsToBuilder();
  }
  updateUrl();
}

function resetParam() {
  m.p.amount = "";
  m.p.taxOther = "";
  m.p.productCode = "";
  m.p.isUseWithCash = false;
  m.p.bWithCash = false;
  m.p.isUseLump = false;
  m.p.bLump = false;
  m.p.isUseCancelType = false;
  m.p.cancelType = undefined;
  m.p.otherTermJudgeNo = "";
  m.p.isUseApprovalNumber = false;
  m.p.approvalNumber = "";
  m.p.slipNo = "";
  m.p.moneytype = undefined;
  m.p.isUseCancelPaymentDiv = false;
  m.p.cancelPaymentDiv = "";
  m.p.isUseWhen = false;
  m.p.isUseManualFlg = false;
  m.p.isUseCancelEdit = false;
  m.p.isUseDetail = false;
}

function onExecute() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  if(m.openNewPage){
    open(m.computedUrl, "_blank")
  }
  else{
    location.href = m.computedUrl;
  }
}

function onExecuteBrowserCall() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  if(m.openNewPage){
    open(m.computedBrowserCallUrl, "_blank")
  }
  else{
    location.href = m.computedBrowserCallUrl;
  }
}

function onCopyUrl() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  navigator.clipboard.writeText(m.computedBrowserCallUrl);
}

function onCopyJavascript() {
  const stor = ResultStore.create();
  stor.setSend(m.p.logid, m.p, m.computedUrl);
  navigator.clipboard.writeText(m.computedBrowserJavascript);
}

function isTypeCreditNFCiD() {
  return (m.p.moneytype && (m.p.moneytype == 'Credit' || m.p.moneytype == 'NFC' || m.p.moneytype == 'iD'));
}

function isSalesState() {
  return (m.p.job === 'Sales' || m.p.job === 'ReservedAuthority' || m.p.job === 'ApprovedSales' || m.p.job === 'SubtractValue');
}

function isRefundState() {
  return (m.p.job === 'Refund' || m.p.job === 'RefundReservedAuthority' || m.p.job === 'RefundApprovedSales' || m.p.job === 'CancelValue');
}

//
// 値変更監視
//
watch(() => m.p.mode, () => { changeMode(); });
watch(() => m.p.menu, () => { resetParam(); updateUrl(); });
watch(() => m.p.menutype, () => { resetParam(); });
watch(() => m.p.moneytype, ()=> { changeMode(); updateUrl(); });
watch(() => m.p.job, () => { updateUrl(); });


export default defineComponent({
  created() {
    this.$watch(() => [
      m.p.journal, m.p.reprint, m.p.when,
      m.p.amount, m.p.taxOther, m.p.productCode,
      m.p.slipNo, m.p.otherTermJudgeNo, m.p.pan,
      m.p.returnUrl,
      m.p.isUseTraining, m.p.bTraining,
      m.p.isUsePrinting, m.p.bPrinting,
      m.p.isUseSelfMode, m.p.bSelfMode,
      m.p.isUsePosExtendData, m.p.posExtendData,
      m.p.isUseLump, m.p.bLump,
      m.p.isUseWithCash, m.p.bWithCash,
      m.p.isUseApprovalNumber, m.p.approvalNumber,
      m.p.isUseManualFlg, m.p.manualFlg,
      m.p.isUseCancelType, m.p.cancelType,
      m.p.isUseCancelPaymentDiv, m.p.cancelPaymentDiv,
      m.p.isUseCancelEdit, m.p.cancelEdit,
      m.p.isUseDetail, m.p.detail,
      m.p.isUseWhen, m.p.when,
      m.useEncode,
      m.browserCall.nuxtServeUrl,
      m.browserCall.targetPort, m.browserCall.targetIP
    ],
    (value, oldValue) => {
      localStorage.setItem("targetIP", m.browserCall.targetIP);
      localStorage.setItem("targetPort", m.browserCall.targetPort);
      updateUrl();
    });
  },
  setup() {
    const isMobile = (() => {
      const result = (screen.width <= 760) ? true : false;
      return result
    })();

    const getCols = ((type: string) => {
      if (isMobile) {
        const result = phoneCols.get(type);
        return (result) ? result : '12';
      }
      const result = tabletCols.get(type);
      return (result) ? result : '12';
    });

    {
      const tip = localStorage.getItem("targetIP");
      const tport = localStorage.getItem("targetPort");
      if(tip) m.browserCall.targetIP = tip;
      if(tport) m.browserCall.targetPort = tport;
    }

    const form = ref<iform>();

    const isExtRefund = computed(() => {
      return ((m.p.mode == 'Cnc' && (m.p.moneytype === 'Credit' || m.p.moneytype === 'NFC') && m.p.job === 'Refund'));
    });

    const isAmount = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if (m.p.menu === 'Service') {
          if (m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC') {
            if (m.p.job !== 'CardCheck') {
              return true;
            }
          }
          else if (m.p.moneytype === 'Suica' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') {
            if (m.p.job === 'Sales' || m.p.job === 'SubtractValue') {
              return true;              
            }
          }
        }
      }
      else {
        if (m.p.menu === 'Service') {
          return isSalesState();
        }
        else if (m.p.menu === 'Menu') {
          if (m.p.menutype === 'Choice') {
            return true;
          }
        }
      }
      return false;
    });
    const isTaxOther = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if (m.p.menu === 'Service') {
          if (isTypeCreditNFCiD() && isSalesState()) {
            return true;
          }
        }
      }
      else if (m.p.menu === 'Service') {
        if (isTypeCreditNFCiD() && isSalesState()) {
          return true;
        }
      }
      return false;
    });
    const isProductCode = computed(() => {
      if (m.p.mode === 'Pokepos' && m.p.menu === 'Service') {
        if (isTypeCreditNFCiD() && isSalesState()) {
          return true;
        }
      }
      else if (m.p.mode === 'Cnc' && m.p.menu === 'Service') {
        if (isTypeCreditNFCiD() && isSalesState()) {
          return true;
        }
      }
      return false;
    });
    const isReceiptNumber = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') && isRefundState()) {
          return true;
        }
      }
      else if (m.p.mode === 'Cnc') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') && isRefundState()) {
          return true;
        }
      }
      return false;
    });
    const isRefund = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') && isRefundState()) {
          return true;
        }
      }
      else if (m.p.mode === 'Cnc') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'Suica' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') && isRefundState()) {
          return true;
        }
      }
      return false;
    });
    const isRefundType = computed(() => {
      if (m.p.mode === 'Cnc') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC') && (m.p.job === 'Refund' || m.p.job === 'RefundApprovedSales')) {
          return true;
        }
      }
      return false;
    });
    const isApprovalNo = computed(() => {
      if (m.p.menu === 'Service') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'NFC') && (m.p.job === 'ApprovedSales')) {
          return true;
        }
      }
      return false;
    });
    const isLump = computed(() => {
      if (m.p.mode === 'Cnc' && m.p.menu === 'Service') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'NFC') && isSalesState()) {
          return true;
        }
      }
      return false;
    });
    const isWithMoney = computed(() => {
      if (m.p.menu === 'Service') {
        if ((m.p.moneytype === "Suica" || m.p.moneytype === "nanaco" || m.p.moneytype === 'Edy' || m.p.moneytype === "WAON") && m.p.job === "SubtractValue") {
          return true;
        }
      }
      return false;
    });
    const isTerminalID = computed(() => {
      if ((m.p.moneytype === "iD" || m.p.moneytype === "QP") && isRefundState()) {
        return true;
      }
      return false;
    });
    const isManualReturn = computed(() => {
      if ((m.p.moneytype === "iD" || m.p.moneytype === "QP") && isRefundState()) {
        return true;
      }
      return false;
    });
    const isSelfMode = computed(() => {
      if (m.p.menu === 'Service' || m.p.menu === 'Reprint' || m.p.menu === 'Journal') {
        return true;
      }
      return false;
    });
    const isChoicePrintDetail = computed(() => {
      if (m.p.menu === 'Journal' || (m.p.menu === 'Reprint' && m.p.reprint ==='Journal')) {
        return true;
      }
      return false;
    });

    return {
      isMobile,
      getCols,
      m,
      modes,
      menus,
      moneytypes,
      menutypes,
      jobs,
      refundTypeItems,
      journals,
      reprints,
      whens,
      details,
      form,
      isAmount,
      isTaxOther,
      isProductCode,
      isReceiptNumber,
      isRefund,
      isRefundType,
      isApprovalNo,
      isLump,
      isWithMoney,
      isTerminalID,
      isManualReturn,
      isSelfMode,
      isChoicePrintDetail,
      isExtRefund,
      updateUrl,
      onExecute,
      onExecuteBrowserCall,
      onCopyUrl,
      onCopyJavascript,
      ...validations
    }
  }
});

</script>

<style scoped lans="sass">

.v-container::v-deep {
  margin-top: 0em;
  margin-bottom: 0em;
  padding-top: 0em;
  padding-bottom: 0em;
}

.v-row::v-deep {
  margin: 0em;
}

.v-input--checkbox::v-deep {
  margin: 0em;
  margin-top: .2em;
  margin-right: .5em;
  padding: 0em;
}

.v-input--switch::v-deep {
  margin: 0em;
}

.v-input--radio-group::v-deep {
  margin: 0em;
  padding: 0em;
}

.v-input--v-radio::v-deep {
  margin: 0em;
  padding: 0em;
}

.v-input--textarea::v-deep {
  word-break: break-all;
}

</style>