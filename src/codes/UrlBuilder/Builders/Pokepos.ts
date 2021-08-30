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
      Reprint: "Reprint"
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
      Nanaco: "Nanaco"
    };

    return  (this.Params.menu ? menus[this.Params.menu] : "") + 
            (this.Params.moneytype ? moneytypes[this.Params.moneytype] : "");
  }

  protected doTraining() {
    return {training: this.Params.bTraining ? "1" : "2"};
  }

  protected doPrint() {
    return {print: this.Params.bPrinting ? "1" : "0"}
  }

  protected doSelfmode() {
    return this.Params.bSelfMode ? {selfmode: "1"} : undefined;
  }

  protected doService() {
    if (this.Params.moneytype) {
      const kvs: keyvalue_t = {};

      if (isNaN(parseInt(this.Params.amount))) {
        return undefined;
      }
      kvs.amount = this.Params.amount;
  
      if (this.isNeedProductCode()) {
        if (this.isValidProductCode()) {
          kvs.productCode = this.Params.productCode;
        }
      }

      if (this.isNeedTaxOther()) {
        if (this.isNumber(this.Params.taxOther)) {
          kvs.taxOther = this.Params.taxOther;
        }
      }
      
      if (this.Params.job == "Sales") {
        kvs.operationDiv = "0";
      }
      else if (this.Params.job == "Refund") {
        kvs.operationDiv = "1";
      }

      return kvs;
    }
  
    return undefined;
  }

  protected doJournal() {
    if (this.Params.journal) {
      const kvs: keyvalue_t = {};

      switch(this.Params.journal) {
      case "Total":
        kvs.operationDiv = "0";
        break;
      case "Intermediate":
        kvs.operationDiv = "1";
        break;
      }

      return kvs;
    }
    return undefined;
  }

  protected doReprint() {
    if (this.Params.reprint) {
      const kvs: keyvalue_t = {};

      switch (this.Params.reprint) {
      case "Journal":
        break;
      case "Slip":
        kvs.operationDiv = "1";
        break;
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
}