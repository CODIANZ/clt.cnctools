import { Base } from "./Base";
import { mode_t, menus_t, moneytype_t, keyvalue_t } from "./Types";

export class Pokepos extends Base {
  protected doPath() {

    const modes: {[_ in mode_t]: string} = {
      Pokepos: "Pokepos",
      Cnc: "Cnc"
    };

    const menus: {[_ in menus_t]: string} = {
      Service: "Service",
      Journal: "Journal",
      Reprint: "Reprint",
      Settings: "Settings",
      Menu: "Menu",
      Hello: "Hello",
      CheckInterrupted: "CheckInterrupted",
      ClearInterrupted: "ClearInterrupted"
    };

    const moneytypes: {[_ in moneytype_t]: string} = {
      Credit: "Credit",
      Cup:    "Cup",
      NFC:    "Nfc",
      Code:   "Code",
      Suica:  "Suica",
      iD:     "iD",
      QP:     "QP",
      WAON:   "WAON",
      Edy:    "Edy",
      nanaco: "nanaco",
      All:    "All"
    };

    let params = this.Params;
    if (params.moneytype === "All" && (params.reprint === "Journal" || params.journal)) {
      return "AllJournalPrint";
    }

    return (params.menu ? menus[params.menu] : "") + (params.moneytype ? moneytypes[params.moneytype] : "");
  }

  protected doTraining() {
    const params = this.Params;
    if (params.isUseTraining) {
      return params.bTraining ? { training:"1" } : undefined;
    }
    return undefined;
  }

  protected doPrint() {
    const params = this.Params;
    if (params.isUsePrinting) {
      return {print: params.bPrinting ? "1" : "0"};
    }
    return undefined;
  }

  protected doSelfmode() {
    const params = this.Params;
    if (params.isUseSelfMode) {
      return params.bSelfMode ? {selfmode: "1"} : undefined;
    }
    return undefined;
  }

  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const kvs: keyvalue_t = {};

      if (params.amount) {
        kvs.amount = params.amount;
      }
  
      if (params.taxOther) {
        kvs.taxOther = params.taxOther;
      }
      if (params.productCode) {
        kvs.productCode = params.productCode;
      }
      if (params.approvalNumber) {
        kvs.approvalNo = params.approvalNumber;
      }
      if (params.slipNo) {
        kvs.slipNo = params.slipNo;
      }

      if (params.job === "Sales") {
        kvs.operationDiv = "0";
      }
      else if (params.job === "Refund") {
        kvs.operationDiv = "1";
      }
      else if (params.job === "ReservedAuthority") {
        kvs.operationDiv = "3";
      }
      else if (params.job === "ApprovedSales") {
        kvs.operationDiv = "4";
      }
      else if (params.job === "CardCheck") {
        kvs.operationDiv = "5";
      }

      if (params.isUsePrinting) {
        kvs.print = (params.bPrinting) ? "1" : "0";
      }
      if (params.isUseSelfMode) {
        kvs.selfmode = (params.bSelfMode) ? "1" : "0";
      }
      if (params.isUseTraining) {
        kvs.training = (params.bTraining) ? "1" : "2";
      }

      return kvs;
    }
  
    return undefined;
  }

  protected doJournal() {
    const params = this.Params;
    if (params.journal && params.moneytype) {
      const kvs: keyvalue_t = {};

      if (params.moneytype === "All") {
        kvs.reprint = "0";
        if (params.journal === "Total") {
          kvs.type = "0";
        }
        else if (params.journal === "Intermediate") {
          kvs.type = "1";
        }
      }
      else {
        if (params.journal === "Total") {
          kvs.operationDiv = "0";
        }
        else if (params.journal === "Intermediate") {
          kvs.operationDiv = "1";
        }
      }

      if (params.isUseDetail) {
        if (params.detail === "Summary") {
          kvs.detail = "0";
        }
        else if (params.detail === "Detail") {
          kvs.detail = "1";
        }
      }

      if (params.isUsePrinting) {
        kvs.print = (params.bPrinting) ? "1" : "0";
      }
      if (params.isUseSelfMode) {
        kvs.selfmode = (params.bSelfMode) ? "1" : "0";
      }
      if (params.isUseTraining) {
        kvs.training = (params.bTraining) ? "1" : "2";
      }

      return kvs;
    }

    return undefined;
  }

  protected doReprint() {
    const params = this.Params;
    if (!params.moneytype || (params.moneytype != 'Credit' && params.moneytype != 'Cup' && params.moneytype != 'NFC')) {
      return undefined;
    }
    if (params.reprint && params.moneytype) {
      const kvs: keyvalue_t = {};

      if (params.reprint === "Slip") {
        kvs.operationDiv = "1";
      }
      else if (params.reprint === "Journal") {
        kvs.operationDiv = "0";

        if (params.isUseWhen) {
          if (params.when === "Last") {
            kvs.reprint = "1";
          }
          else if (params.when === "BeforeLast") {
            kvs.reprint = "2";
          }
        }

        if (params.isUseDetail) {
          if (params.detail === "Summary") {
            kvs.detail = "0";
          }
          else if (params.detail === "Detail") {
            kvs.detail = "1";
          }
        }
      }

      if (params.isUsePrinting) {
        kvs.print = (params.bPrinting) ? "1" : "0";
      }
      if (params.isUseSelfMode) {
        kvs.selfmode = (params.bSelfMode) ? "1" : "0";
      }
      if (params.isUseTraining) {
        kvs.training = (params.bTraining) ? "1" : "2";
      }

      return kvs;
    }
    return undefined;
  }

  protected /* abstract */ generateGetParameterSelf(): keyvalue_t | undefined {
    const kvs  = (() => {
      switch(this.Params.menu) {
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

    if (!kvs) {
      return undefined;
    }

    return {
      ...kvs,
      ...this.doTraining(),
      ...this.doPrint(),
      ...this.doSelfmode(),
      returnUrlScheme: this.Params.returnUrl
    };
  }

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const path = this.doPath();
    return path ? `pokepos://${path}` : undefined;
  }

}