<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-radio-group v-model="m.p.mode" row>
          <v-radio
            v-for="it in modes"
              :key="`modes-${it.value}`" :label=it.label :value=it.value
          />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.mode">
        <v-radio-group v-model="m.p.menu" row>
          <v-radio
            v-for="it in menus"
              :key="`menus-${it.value}`" :label=it.label :value=it.value
          />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.menu === 'Reprint'">
        <v-radio-group v-model="m.p.reprint" row>
          <v-radio
            v-for="it in reprints"
              :key="`reprints-${it.value}`" :label=it.label :value=it.value
          />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu !== 'Menu' && m.p.menu !== 'Hello' && m.p.menu !== 'CheckInterrupted' && m.p.menu !== 'ClearInterrupted'">
        <v-radio-group v-model="m.p.moneytype" row>
          <v-radio
            v-for="it in moneytypes"
              :key="`moneytypes-${it.value}`" :label=it.label :value=it.value
          />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'Menu'">
        <v-radio-group v-model="m.p.menutype" row>
          <v-radio
            v-for="it in menutypes"
              :key="`menutypes-${it.value}`" :label=it.label :value=it.value
          />
        </v-radio-group>
      </v-row>

      <v-row v-if="m.p.menu === 'Service' && jobs && jobs.length > 0" dense>
        <v-col>
          <v-radio-group v-model="m.p.job" row>
            <v-radio
              v-for="it in jobs"
                :key="`jobs-${it.value}`" :label=it.label :value=it.value
            />
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu === 'Journal'" dense>
        <v-col>
          <v-radio-group v-model="m.p.journal" row>
            <v-radio
              v-for="it in journals"
                :key="`journals-${it.value}`" :label=it.label :value=it.value
            />
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row v-if="isChoicePrintDetail" dense>
        <v-col>
          <v-row dense>
            <v-checkbox v-model="m.p.isUseDetail" />
            <v-radio-group v-model="m.p.detail" row>
              <v-radio
                v-for="it in details"
                  :key="`details-${it.value}`" :label=it.label  :value=it.value
              />
            </v-radio-group>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.p.menu === 'Reprint' && m.p.reprint === 'Journal'" dense>
        <v-col>
          <v-row dense>
            <v-checkbox v-model="m.p.isUseWhen" />
            <v-radio-group v-model="m.p.when" row>
              <v-radio
                v-for="it in whens"
                  :key="`whens-${it.value}`" :label=it.label :value=it.value
              />
            </v-radio-group>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu !== 'Menu' && m.p.menu !== 'Hello' && m.p.menu !== 'CheckInterrupted' && m.p.menu !== 'ClearInterrupted'" dense>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUsePrinting" />
            <v-switch inset v-model="m.p.bPrinting" label="??????" />
          </v-row>
        </v-col>
        <v-col v-if="isSelfMode" cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUseSelfMode" />
            <v-switch inset v-model="m.p.bSelfMode" label="??????????????????" />
          </v-row>
        </v-col>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUseTraining" />
            <v-switch inset v-model="m.p.bTraining" label="??????????????????" />
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUsePosExpArea" />
            <v-text-field v-model="m.p.posExpArea" label="POS???????????????(45?????????)" type="text" clearable filled counter />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'CheckInterrupted'" dense>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUsePrinting" />
            <v-switch inset v-model="m.p.bPrinting" label="??????" />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.p.mode && m.p.menu === 'Menu'" dense>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUsePrinting" />
            <v-switch inset v-model="m.p.bPrinting" label="??????" />
          </v-row>
        </v-col>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUseTraining" />
            <v-switch inset v-model="m.p.bTraining" label="??????????????????" />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isWithMoney" dense>
        <v-col cols="12" sm="4">
          <v-row justify="left">
            <v-checkbox v-model="m.p.isUseWithCash" />
            <v-switch inset v-model="m.p.bWithCash" label="????????????" />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isApprovalNo || isLump">
        <v-col v-if="isApprovalNo">
          <v-text-field v-model="m.p.approvalNumber" label="????????????" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isLump">
          <v-row dense>
            <v-checkbox v-model="m.p.isUseLump" />
            <v-switch inset v-model="m.p.bLump" label="???????????????" />
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="isAmount || isTaxOther || isProductCode">
        <v-col v-if="isAmount">
          <v-text-field v-model="m.p.amount" label="??????" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isTaxOther">
          <v-text-field v-model="m.p.taxOther" label="?????????" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isProductCode">
          <v-text-field v-model="m.p.productCode" label="???????????????" type="text" clearable filled counter />
        </v-col>
      </v-row>

      <v-row v-if="isReceiptNumber">
        <v-col v-if="isReceiptNumber">
          <v-text-field v-model="m.p.slipNo" label="????????????" type="text" clearable filled counter />
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="isTerminalID">
          <v-text-field v-model="m.p.otherTermJudgeNo" label="SPRWID" type="text" clearable filled counter />
        </v-col>
        <v-col v-if="isManualReturn">
          <v-row dense>
            <v-checkbox v-model="m.p.isUseManualFlg" />
            <v-switch v-model="m.p.manualFlg" inset label="?????????????????????" />
          </v-row>
        </v-col>
        <v-col v-if="isRefundType">
          <v-row dense>
            <v-checkbox v-model="m.p.isUseCancelType" />
            <v-radio-group v-model="m.p.cancelType" row>
              <v-radio
                v-for="it in refundTypeItems"
                  :key="`refundTypeItems-${it.value}`" :label=it.label :value=it.value
              />
            </v-radio-group>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" sm="4">
          <v-checkbox v-model="m.useEncode" label="URL???????????????" />
        </v-col>
        <v-col cols="6" sm="4">
          <v-checkbox v-model="m.openNewPage" label="?????????????????????" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field dense v-model="m.p.returnUrl" label="??????URL" :rules="[required]" readonly />
        </v-col>
      </v-row>

      <v-row v-if="!m.bBrowserCall">
        <v-col cols="12">
          <v-textarea v-model="m.computedUrl" label="??????URL" outlined readonly rows=3 auto-grow style="word-break: break-all;" />
        </v-col>
        <v-col cols="12">
          <v-row justify="end">
            <v-btn color="info" :disabled="!m.b.valid" @click="updateUrl" > Log ID ?????? </v-btn>
            <v-btn rounded color="primary" dark :disabled="!m.b.valid" @click="onExecute" > ?????? - {{ m.p.logid }} </v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="m.bBrowserCall">
        <v-col cols="12" sm="6">
            <v-text-field v-model="m.browserCall.nuxtServeUrl" label="Nuxt serve url" type="text" />
        </v-col>
        <v-col cols="6" sm="3">
            <v-text-field v-model="m.browserCall.targetIP" label="target IP" type="text" />
        </v-col>
        <v-col cols="6" sm="3">
            <v-text-field v-model="m.browserCall.targetPort" label="target Port" type="text" />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="m.computedBrowserCallUrl" label="??????URL(?????????)" outlined readonly rows=2 auto-grow style="word-break: break-all;" />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="m.computedBrowserJavascript" label="JavascriptCode(?????????)" outlined readonly rows=2 auto-grow style="word-break: break-all;" />
        </v-col>
        <v-col cols="12">
          <v-row justify="end">
            <v-btn color="info" :disabled="!m.b.valid" @click="updateUrl" > Log ID ?????? </v-btn>
            <v-btn rounded color="info" dark :disabled="!m.b.valid" @click="onExecuteBrowserCall" > ??????(?????????) - {{ m.p.logid }} </v-btn>
            <v-btn rounded color="brown" dark :disabled="!m.b.valid" @click="onCopyUrl" > URL?????????</v-btn>
            <v-btn rounded color="brown" dark :disabled="!m.b.valid" @click="onCopyJavascript" > Javascript?????????</v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-switch v-model="m.bBrowserCall" inset label="???????????????URL??????????????????????????????????????????????????????????????????" />
      </v-row>

    </v-form>
  </v-container>
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
  { label: "pokepos/EM ??????", value: "Pokepos" }
];

const menus = computed<field_item<UrlBuilder.menus_t>[]>(() => {
  let result: field_item<UrlBuilder.menus_t>[] = [
    { label: "??????", value: "Service" },
    { label: "??????", value: "Journal" },
    { label: "?????????", value: "Reprint" },
  ];

  if (m.p.mode === "Cnc") {
    result.push({ label: "??????????????????", value: "Menu" });
    result.push({ label: "????????????", value: "Hello" });
    result.push({ label: "??????????????????", value: "CheckInterrupted" });
    result.push({ label: "?????????????????????", value: "ClearInterrupted" });
  }

  return result;
});

const moneytypes = computed<field_item<UrlBuilder.moneytype_t>[]>(() =>  {
  var items: field_item<UrlBuilder.moneytype_t>[] = [
    { label: "???????????????", value: "Credit" },
    { label: "??????", value: "Cup" },
    { label: "NFC", value: "NFC" },
    { label: "?????????IC", value: "Suica" },
    { label: "QUICPay", value: "QP" },
    { label: "iD", value: "iD" }
  ];

  if (m.p.mode === "Cnc") {
    items.push({ label: "WAON", value: "WAON" });
    items.push({ label: "Edy", value: "Edy" });
    items.push({ label: "nanaco", value: "nanaco" });
  }

  if (m.p.menu === "Journal" || (m.p.menu === "Reprint" && m.p.reprint === "Journal")) {
    items.push({ label: "?????????", value: "All" });
  }

  return items;
});


const menutypes = computed<field_item<UrlBuilder.menutype_t>[]>(() =>  {
  var items: field_item<UrlBuilder.menutype_t>[] = [
    { label: "????????????", value: "Choice" }
  ];
  return items;
});

const jobs = computed<field_item<UrlBuilder.job_t>[]>(() =>  {
  if (m.p.moneytype === "Credit") {
    if (m.p.mode === "Pokepos") {
      return [
        { label: "??????", value: "Sales" },
        { label: "????????????", value: "Refund" },
        { label: "??????????????????", value: "ReservedAuthority" },
        { label: "???????????????", value: "ApprovedSales" },
        { label: "?????????????????????", value: "CardCheck" }
      ];
    }
    return [
      { label: "??????", value: "Sales" },
      { label: "????????????", value: "Refund" },
      { label: "??????????????????", value: "ReservedAuthority" },
      { label: "????????????????????????", value: "RefundReservedAuthority" },
      { label: "???????????????", value: "ApprovedSales" },
      { label: "?????????????????????", value: "RefundApprovedSales" },
      { label: "?????????????????????", value: "CardCheck"}
    ];
  }
  else if (m.p.moneytype === "Cup" || m.p.moneytype === "NFC") {
    return [
      { label: "??????", value: "Sales" },
      { label: "????????????", value: "Refund" }
    ];
  }
  else if (m.p.moneytype === "Suica") {
    return [
      { label: "??????", value: "SubtractValue" },
      { label: "????????????", value: "Balance" },
      { label: "??????????????????", value: "Confirm" }
    ];
  }
  else if(m.p.moneytype === "QP" || m.p.moneytype === "iD") {
    return [
      { label: "??????", value: "SubtractValue" },
      { label: "??????", value: "CancelValue" },
      { label: "??????????????????", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "WAON") {
    return [
      { label: "??????", value: "SubtractValue" },
      { label: "??????", value: "CancelValue" },
      { label: "????????????", value: "Balance" },
      { label: "????????????", value: "History" },
      { label: "????????????????????????", value: "PointCharge" },
      { label: "??????????????????", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "Edy") {
    return [
      { label: "??????", value: "SubtractValue" },
      { label: "????????????", value: "Balance" },
      { label: "????????????", value: "History" },
      { label: "??????????????????", value: "Confirm" }
    ];
  }
  else if (m.p.moneytype === "nanaco") {
    return [
      { label: "??????", value: "SubtractValue" },
      { label: "????????????", value: "Balance" },
      { label: "??????????????????", value: "Confirm" }
    ];
  }
  else {
    return [];
  }
});

const refundTypeItems: field_item<UrlBuilder.refundtype_t>[] = [
  { label: "??????", value: "1" },
  { label: "??????", value: "2" }
];

const journals: field_item<UrlBuilder.journal_t>[] = [
  { label: "??????", value: "Total" },
  { label: "?????????", value: "Intermediate" }
];

const details: field_item<UrlBuilder.detail_t>[] = [
  { label: "??????", value: "Summary" },
  { label: "??????", value: "Detail" }
];

const reprints: field_item<UrlBuilder.reprint_t>[] = [
  { label: "??????", value: "Slip" },
  { label: "??????", value: "Journal" }
];

const whens: field_item<UrlBuilder.when_t>[] = [
  { label: "??????", value: "Last" },
  { label: "?????????", value: "BeforeLast" }
];

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
  builder.Params.isUsePosExpArea  = m.p.isUsePosExpArea;
  builder.Params.posExpArea       = m.p.posExpArea;

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

  builder.Params.reprint     = m.p.reprint;
  builder.Params.isUseDetail = m.p.isUseDetail;
  builder.Params.detail      = m.p.detail;
  builder.Params.isUseWhen   = m.p.isUseWhen;
  builder.Params.when        = m.p.when;
}

function updateLogIdAndReturnUrl() {
  const d = dateFormat(new Date(), "yyyymmddHHMMss");
  m.p.logid = d;

  if (builder) {
    m.p.returnUrl = `${location.protocol}//${location.host}/tools/posresult/${d}`;
  }
  else {
    m.p.returnUrl = "";
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
  if (m.p.mode === "Pokepos") {
    if (m.p.moneytype === 'Suica' || m.p.moneytype === 'iD' || m.p.moneytype === 'QP') {
      builder = new UrlBuilder.PokeposEM();
    }
    else {
      builder = new UrlBuilder.Pokepos();
    }
  }
  else if (m.p.mode === "Cnc") {
      builder = new UrlBuilder.Cnc();
  }
  else {
      builder = undefined;
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
  m.p.bWithCash = false;
  m.p.bLump = false;
  m.p.cancelType = undefined;
  m.p.otherTermJudgeNo = "";
  m.p.approvalNumber = "";
  m.p.slipNo = "";
  m.p.moneytype = undefined;
  m.p.isUseWhen = false;
  // m.p.isUseTraining = false;
  // m.p.isUsePrinting = false;
  // m.p.isUseSelfMode = false;
  // m.p.isUsePosExpArea = false;
  // m.p.posExpArea = "";
  m.p.isUseLump = false;
  m.p.isUseWithCash = false;
  m.p.isUseManualFlg = false;
  m.p.isUseApprovalNumber = false;
  m.p.isUseCancelType = false;
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

function isSalesState() {
  return (m.p.job === 'Sales' || m.p.job === 'ReservedAuthority' || m.p.job === 'ApprovedSales' || m.p.job === 'SubtractValue');
}

function isRefundState() {
  return (m.p.job === 'Refund' || m.p.job === 'RefundReservedAuthority' || m.p.job === 'RefundApprovedSales' || m.p.job === 'CancelValue');
}

//
// ???????????????
//
watch(() => m.p.mode, () => { changeMode(); });
watch(() => m.p.menu, () => { resetParam(); updateUrl(); });
watch(() => m.p.moneytype, ()=> { changeMode(); });
watch(() => m.p.menutype, () => { resetParam(); });
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
      m.p.isUsePosExpArea, m.p.posExpArea,
      m.p.isUseLump, m.p.bLump,
      m.p.isUseWithCash, m.p.bWithCash,
      m.p.isUseApprovalNumber, m.p.approvalNumber,
      m.p.isUseManualFlg, m.p.manualFlg,
      m.p.isUseCancelType, m.p.cancelType,
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
    {
      const tip = localStorage.getItem("targetIP");
      const tport = localStorage.getItem("targetPort");
      if(tip) m.browserCall.targetIP = tip;
      if(tport) m.browserCall.targetPort = tport;
    }

    const form = ref<iform>();

    const isAmount = computed(() => {
      if (m.p.menu === 'Service') {
        return isSalesState();
      }
      else if (m.p.menu === 'Menu') {
        if (m.p.menutype === 'Choice') {
          return true;
        }
      }
      return false;
    });
    const isTaxOther = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if (m.p.menu === 'Service') {
          if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC') && isSalesState()) {
            return true;
          }
        }
      }
      else if (m.p.menu === 'Service') {
        if (m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'iD') {
          if (isSalesState()) {
            return true;
          }
        }
      }
      return false;
    });
    const isProductCode = computed(() => {
      if (m.p.mode === 'Cnc' && m.p.menu === 'Service') {
        if ((m.p.moneytype === 'Credit' || m.p.moneytype === 'NFC' || m.p.moneytype === 'iD') && isSalesState()) {
          return true;
        }
      }
      return false;
    });
    const isReceiptNumber = computed(() => {
      if (m.p.mode === 'Pokepos') {
        if (m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC') {
          if (m.p.job === 'Refund') {
            return true;
          }
        }
      }
      else if (m.p.mode === 'Cnc' && m.p.menu === 'Service') {
        if (m.p.moneytype === 'Credit' || m.p.moneytype === 'Cup' || m.p.moneytype === 'NFC' || m.p.moneytype === 'QP' || m.p.moneytype === 'iD') {
          if (isRefundState()) {
            return true;
          }
        }
      }
      return false;
    });
    const isRefundType = computed(() => {
      if (m.p.mode === 'Cnc' && m.p.menu === 'Service') {
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
      if ((m.p.moneytype === "Suica" || m.p.moneytype === "nanaco" || m.p.moneytype === "WAON") && m.p.job === "SubtractValue") {
        return true;
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
      isRefundType,
      isApprovalNo,
      isLump,
      isWithMoney,
      isTerminalID,
      isManualReturn,
      isSelfMode,
      isChoicePrintDetail,
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
