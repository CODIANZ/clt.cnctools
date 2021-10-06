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
      Settings: "Settings"
    };

    const moneytypes: {[_ in moneytype_t]: string} = {
      Credit: "Credit",
      Cup:    "Cup",
      NFC:    "Nfc",
      Suica:  "Suica",
      ID:     "ID",
      QP:     "QP",
      Waon:   "Waon",
      Edy:    "Edy",
      Nanaco: "Nanaco",
      All:    "All"
    };

    let params = this.Params;
    if (params.moneytype === "All" && (params.reprint === "Journal" || params.journal)) {
      return "AllJournalPrint";
    }

    return (params.menu ? menus[params.menu] : "") + (params.moneytype ? moneytypes[params.moneytype] : "");
  }

  protected doTraining() {
    return this.Params.bTraining ? {training:"1"} : undefined;
  }

  protected doPrint() {
    return {print: this.Params.bPrinting ? "1" : "0"}
  }

  protected doSelfmode() {
    return this.Params.bSelfMode ? {selfmode: "1"} : undefined;
  }

  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const kvs: keyvalue_t = {};

      if (!isNaN(parseInt(params.amount))) {
        kvs.amount = params.amount;
      }
  
      if (this.isNeedProductCode() && this.isValidProductCode()) {
        kvs.productCode = params.productCode;
      }

      if (this.isNeedTaxOther() && this.isNumber(params.taxOther)) {
        kvs.taxOther = params.taxOther;
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

      if (params.detail === "Summary") {
        kvs.detail = "0";
      }
      else if (params.detail === "Detail") {
        kvs.detail = "1";
      }
      else {
        return undefined;
      }

      return kvs;
    }

    return undefined;
  }

  protected doReprint() {
    const params = this.Params;
    if (params.reprint && params.moneytype) {
      const kvs: keyvalue_t = {};

      if (params.reprint === "Slip") {
        kvs.operationDiv = "1";
      }
      else if (params.reprint === "Journal") {
        if (params.when === "Last") {
          kvs.reprint = "1";
        }
        else if (params.when === "BeforeLast") {
          kvs.reprint = "2";
        }
        else {
          return undefined;
        }

        if (params.detail === "Summary") {
          kvs.detail = "0";
        }
        else if (params.detail === "Detail") {
          kvs.detail = "1";
        }
        else {
          return undefined;
        }
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


  public /* abstract */ isNeedSelfMode() {
    return true;
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
}