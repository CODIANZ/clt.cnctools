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
    Reprint: "reprint"
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
    Nanaco: "nanaco"
  };

  private m_jobs: {[_ in job_t]: string} = {
    "Sales": "settlement",
    "Refund": "refund",
    "Cancel": "cancel",
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
    return {"Lump": this.Params.bLump ? "true" : "false"};
  }

  protected doService() {
    if (this.Params.moneytype && this.Params.job) {
      const path = `${this.m_moneytypes[this.Params.moneytype]}-${this.m_jobs[this.Params.job]}`;
      const kvs: keyvalue_t = {};

      switch(this.Params.job) {
      case "Sales":
        if (isNaN(parseInt(this.Params.amount))) {
          return undefined;
        }

        kvs.amount = this.Params.amount;
        if (this.isNeedProductCode() && this.isValidProductCode()) {
          kvs.productCode = this.Params.productCode;
        }
        if (this.isNeedTaxOther() && this.isNumber(this.Params.taxOther)) {
          kvs.taxOtherAmount = this.Params.taxOther;
        }
        break;

      case "Refund":
        if (isNaN(parseInt(this.Params.amount))) {
          return undefined;
        }

        switch(this.Params.moneytype) {
        case "Suica":
          kvs.amount  = this.Params.amount;
          break;

        default:
          kvs.amount  = this.Params.amount;
          kvs.slipNo  = this.Params.slipNo;
          kvs.termId  = this.Params.termId;
          kvs.manual  = this.Params.manualFlg ? "true" : "false";
          if (this.Params.manualFlg) {
            kvs.pan = this.Params.pan;
          }
          break;
        }
        break;

      case "Confirm":
        break;
      }
      return {path, kvs};
    }
    return undefined;
  }

  protected doJournal() {
    if (this.Params.moneytype && this.Params.journal && this.Params.detail) {
      const path = `${this.m_moneytypes[this.Params.moneytype]}-journal-${this.m_journals[this.Params.journal]}`;
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
    if(!re) return undefined;
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
      Nanaco: false
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
      Nanaco: false
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
      Nanaco: false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }

  public /* abstract */ isNeedSelfMode() {
    return false;
  }
}