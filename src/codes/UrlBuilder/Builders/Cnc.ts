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
    Settings: "settings",
    Menu:    "Menu",
    Hello: "hello",
    CheckInterrupted: "checkinterrupted",
    ClearInterrupted: "clearinterrupted"
  };

  private m_moneytypes: {[_ in moneytype_t]: string} = {
    Credit: "credit",
    Cup:    "cup",
    NFC:    "contactless",
    Suica:  "suica",
    iD:     "id",
    QP:     "quicpay",
    WAON:   "waon",
    Edy:    "edy",
    nanaco: "nanaco",
    All:    "all"
  };

  private m_jobs: {[_ in job_t]: string} = {
    "Sales": "authorizesales",
    "Refund": "authorizerefund",
    "ReservedAuthority": "authorizepresales",
    "RefundReservedAuthority": "authorizepresalesvoid",
    "ApprovedSales": "authorizecompletion",
    "RefundApprovedSales": "authorizecompletionvoid",
    "CardCheck": "checkcard",
    "SubtractValue": "subtractvalue",
    "CancelValue": "cancelvalue",
    "Balance": "readvalue",
    "Confirm": "outputcompleteevent",
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

  protected doPosExtendData() {
    const params = this.Params;
    if (params.isUsePosExtendData) {
      return {"posExtendData": encodeURIComponent(params.posExtendData)};
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
      if (params.isUseCancelPaymentDiv && params.cancelPaymentDiv.length > 0) {
        kvs.paymentDiv = params.cancelPaymentDiv;
      }
      if (params.isUseCancelEdit) {
        kvs.edit = params.cancelEdit ? "true" : "false";
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

      if (params.isUseDetail && params.detail) {
        kvs.type = params.detail.toLowerCase();
      }
      if (params.isUseWhen && params.when) {
        kvs.when = params.when.toLowerCase();
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
        if (params.isUseWhen && params.when) {
          kvs.when = this.m_whens[params.when];
        }
        if (params.isUseDetail && params.detail) {
          kvs.type = params.detail.toLowerCase();
        }
      }
      return {path, kvs};
    }
    return undefined;
  }

  protected doMenu() {
    const params = this.Params;
    let path = "job-menu";
    const kvs: keyvalue_t = {};

    if (params.amount) {
      kvs.amount = params.amount;
      return {path, kvs};
    }
    return undefined;
  }

  protected doHello() {
    return {
      path: "pos-hello",
      kvs: {} as keyvalue_t
    };
  }

  protected doCheckInterrupted() {
    return {
      path: "pos-checkinterrupted",
      kvs: {} as keyvalue_t
    };
  }

  protected doClearInterrupted() {
    return {
      path: "pos-clearinterrupted",
      kvs: {} as keyvalue_t
    };
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

      case "Menu":
        return this.doMenu();

      case "Hello":
        return this.doHello();

      case "CheckInterrupted":
        return this.doCheckInterrupted();

      case "ClearInterrupted":
        return this.doClearInterrupted();
    
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
      ...this.doPosExtendData(),
      return: this.Params.returnUrl
    };
  }

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const re  = (() => {
      switch(this.Params.menu){
        case "Service":
          return this.doService();
      
        case "Journal":
          return this.doJournal();
        
        case "Reprint":
          return this.doReprint();
        
        case "Menu":
          return this.doMenu();

        case "Hello":
          return this.doHello();

        case "CheckInterrupted":
          return this.doCheckInterrupted();

        case "ClearInterrupted":
            return this.doClearInterrupted();
  
        default:
          return undefined;
        
      }
    })();
    if(!re) {
      return undefined;
    }
    return `pp-cnc://${re.path}`;
  }

}