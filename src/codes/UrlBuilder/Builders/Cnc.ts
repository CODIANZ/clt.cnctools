import { params } from "vee-validate/dist/types/rules/alpha";
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
    iD:     "id",
    QP:     "quicpay",
    WAON:   "waon",
    Edy:    "edy",
    nanaco: "nanaco",
    All:    "all"
  };

  private m_jobs: {[_ in job_t]: string} = {
    "Sales": "settlement",
    "Refund": "refund",
    "ReservedAuthority": "preapproval",
    "RefundReservedAuthority": "refundpreapproval",
    "ApprovedSales": "afterapproval",
    "RefundApprovedSales": "refundafterapproval",
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
    const params = this.Params;
    if (params.isUseTraining) {
      return {"training": params.bTraining ? "true" : "false"};
    }
    return undefined;
  }

  protected doPrint() {
    const params = this.Params;
    if (params.isUsePrinting) {
      return {"print": params.bPrinting ? "true" : "false"};
    }
    return undefined;
  }

  protected doSelfmode() {
    const params = this.Params;
    if (params.isUseSelfMode) {
      return {"self": params.bSelfMode ? "true" : "false"};
    }
    return undefined;
  }

  protected doLump() {
    const params = this.Params;
    if (params.isUseLump) {
      return {"lump": params.bLump ? "true" : "false"};
    }
    return undefined;
  }

  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const path = `${this.m_moneytypes[params.moneytype]}-${this.m_jobs[params.job]}`;
      const kvs: keyvalue_t = {};

      if (params.amount) {
        kvs.amount = params.amount;
      }
      if (params.productCode) {
        kvs.productCode = params.productCode;
      }
      if (params.taxOther) {
        kvs.taxOtherAmount = params.taxOther;
      }
      if (params.isUseWithCash) {
        kvs.withCash = params.bWithCash ? "true" : "false";
      }
      if (params.approvalNumber) {
        kvs.approvalNo = params.approvalNumber;
      }
      if (params.slipNo) {
        kvs.slipNo = params.slipNo;
      }
      if (params.otherTermJudgeNo) {
        kvs.otherTermJudgeNo = params.otherTermJudgeNo;
      }
      if (params.isUseManualFlg) {
        kvs.manual = params.manualFlg ? "true" : "false";
      }
      if (params.pan) {
        kvs.pan = params.pan;
      }
      if (params.isUseCancelType && params.cancelType != undefined) {
        kvs.cancelType = params.cancelType;
      }

      return {path, kvs};
    }
    return undefined;
  }

  protected doJournal() {
    const params = this.Params;
    if (params.moneytype && params.journal) {
      const path = `${this.m_moneytypes[params.moneytype]}-journal-${this.m_journals[params.journal]}`;
      const kvs: keyvalue_t = {};

      if (params.isUsePrintDetail && params.detail) {
        kvs.type = params.detail.toLowerCase();
      }

      return {path, kvs};
    }
    return undefined;
  }

  protected doReprint() {
    const params = this.Params;
    if (params.moneytype && params.reprint) {
      const path = `${this.m_moneytypes[params.moneytype]}-reprint-${this.m_reprints[params.reprint]}`;
      const kvs: keyvalue_t = {};

      if (params.reprint === 'Slip') {
        if (params.slipNo) {
          kvs.slipNo = params.slipNo;
        }
      }
      else if (params.reprint === 'Journal') {
        if (params.when) {
          kvs.when = this.m_whens[params.when];
        }
        if (params.detail) {
          kvs.type = params.detail.toLowerCase();
        }
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

}