import { Base } from "./Base";
import { mode_t, menus_t, moneytype_t, keyvalue_t, job_t, journal_t, when_t, reprint_t } from "./Types";

export class Cnc extends Base {

  private m_modes: {[_ in mode_t]: string} = {
    Pokepos: "pokepos",
    Cnc:     "cnc"
  };

  private m_menus: {[_ in menus_t]: string} = {
    Service: "service",
    Journal: "journal",
    Reprint: "reprint",
    Settings: "settings"
  };

  private m_moneytypes: {[_ in moneytype_t]: string} = {
    Credit: "credit",
    Cup:    "cup",
    NFC:    "nfc",
    Suica:  "suica",
    ID:     "id",
    QP:     "quicpay",
    Waon:   "waon",
    Edy:    "edy",
    Nanaco: "nanaco",
    All:    "all"
  };

  private m_jobs: {[_ in job_t]: string} = {
    "Sales": "settlement",
    "Refund": "refund",
    "ReservedAuthority": "preapproval",
    "ApprovedSales": "afterapproval",
    "CardCheck": "cardcheck",
    "Balance": "balance",
    "Confirm": "confirm",
    "History": "history",
    "PointCharge": "pointcharge"
  };

  private m_journals: {[_ in journal_t]: string} = {
    "Total": "total",
    "Intermediate": "intermediate"
  };

  private m_reprints: {[_ in reprint_t]: string} = {
    "Slip": "slip",
    "Journal": "journal"
  };

  private m_whens: {[_ in when_t]: string} = {
    "Last": "last",
    "BeforeLast": "beforeLast",
    "SlipNo": "slipNo"
  };


  protected doTraining() {
    return {"training": this.Params.bTraining ? "true" : "false"};
  }

  protected doPrint() {
    return {"print": this.Params.bPrinting ? "true" : "false"};
  }

  protected doSelfmode() {
    return {"self": this.Params.bSelfMode ? "true" : "false"};
  }

  protected doLump() {
    const params = this.Params;
    if ((params.moneytype === "Credit" || params.moneytype === "NFC") && (params.job === "Sales" || params.job === "ApprovedSales")) {
      return {"Lump": params.bLump ? "true" : "false"};
    }
    return undefined;
  }

  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const path = `${this.m_moneytypes[params.moneytype]}-${this.m_jobs[params.job]}`;
      const kvs: keyvalue_t = {};

      if (params.job === "Sales" || params.job === "ApprovedSales" || params.job === "ReservedAuthority") {
        if (isNaN(parseInt(params.amount))) {
          return undefined;
        }

        kvs.amount = params.amount;
        if (this.isNeedProductCode() && this.isValidProductCode()) {
          kvs.productCode = params.productCode;
        }
        if (this.isNeedTaxOther() && this.isNumber(params.taxOther)) {
          kvs.taxOtherAmount = params.taxOther;
        }
        if (this.isNeedWithCash()) {
          kvs.withCash = params.bWithCash ? "true" : "false";
        }
      }
      else if (params.job === "Refund") {
        if (isNaN(parseInt(params.amount))) {
          return undefined;
        }

        kvs.amount  = params.amount;
        if (params.slipNo) {
          kvs.slipNo  = params.slipNo;
        }
        if (params.termId) {
          kvs.termId  = params.termId;
        }
        if (params.manualFlg) {
          kvs.manual  = params.manualFlg ? "true" : "false";
        }
        if (params.pan) {
          kvs.pan = params.pan;
        }
        if (params.cancelType) {
          kvs.cancelType = params.cancelType;
        }
      }
      else if (params.job === "Confirm" || params.job === "Balance") {

      }
      return {path, kvs};
    }
    return undefined;
  }

  protected doJournal() {
    const params = this.Params;
    if (params.moneytype && params.journal && params.detail) {
      const path = `${this.m_moneytypes[params.moneytype]}-journal-${this.m_journals[params.journal]}`;
      const kvs: keyvalue_t = {};

      kvs.type = (this.Params.detail == "Summary") ? "summary" : "detail";

      return {path, kvs};
    }
    return undefined;
  }

  protected doReprint() {
    if (this.Params.moneytype && this.Params.reprint && this.Params.when) {
      const path = `${this.m_moneytypes[this.Params.moneytype]}-reprint-${this.m_reprints[this.Params.reprint]}`;
      const kvs: keyvalue_t = {};

      switch (this.Params.reprint) {
      case "Journal":
        if (this.Params.when != "SlipNo") {
          kvs.when = this.m_whens[this.Params.when];
        }
        break;
      case "Slip":
        kvs.when = this.m_whens[this.Params.when];
        if (this.Params.when =="SlipNo") {
          kvs.slipNo = this.Params.slipNo;
        }
        break;
      }
      return {path, kvs};
    }
    return undefined;
  }

  protected /* abstract */ generateGetParameterSelf(): keyvalue_t | undefined {
    const re  = (() => {
      switch(this.Params.menu){
      case "Service":
        return this.doService();

      case "Journal":
        return this.doJournal();

      case "Reprint":
        return this.doReprint();

      default:
        return undefined;
      }
    })();

    if (!re) {
      return undefined;
    }

    return {
      ...re.kvs,
      ...this.doTraining(),
      ...this.doPrint(),
      ...this.doSelfmode(),
      ...this.doLump(),
      return: this.Params.returnUrl
    };
  }

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const re  = (() => {
      switch(this.Params.menu){
        case "Service": {
          return this.doService();
        }
        case "Journal": {
          return this.doJournal();
        }
        case "Reprint": {
          return this.doReprint();
        }
        default: {
          return undefined;
        }
      }
    })();
    if(!re) {
      return undefined;
    }
    return `pp-cnc://${re.path}`;
  }

  public /* abstract */ isNeedProductCode() {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      NFC:    true,
      Suica:  false,
      ID:     true,
      QP:     true,
      Waon:   false,
      Edy:    false,
      Nanaco: false,
      All:    false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }

  public /* abstract */ isNeedTaxOther() {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      NFC:    true,
      Suica:  false,
      ID:     true,
      QP:     true,
      Waon:   false,
      Edy:    false,
      Nanaco: false,
      All:    false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }

  public /* abstract */ isNeedLump() {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    false,
      NFC:    false,
      Suica:  false,
      ID:     false,
      QP:     false,
      Waon:   false,
      Edy:    false,
      Nanaco: false,
      All:    false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }

  public /* abstract */ isNeedSelfMode() {
    return false;
  }
}