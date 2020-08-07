import { Base } from "./Base";
import { menus_t, moneytype_t, keyvalue_t } from "./Types";

export class Pokepos extends Base {
  protected doPath() {
    const menus: {[_ in menus_t]: string} = {
      Service: "Service",
      Journal: "Journal",
      Reprint: "Reprint"
    };

    const moneytypes: {[_ in moneytype_t]: string} = {
      Credit: "Credit",
      Cup:    "Cup",
      Suica:  "Suica",
      QP:     "QP",
      ID:     "ID",
      Waon:   "Waon",
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
    do {
      const kvs: keyvalue_t = {};

      if(!this.Params.moneytype) break;

      if(isNaN(parseInt(this.Params.amount))) break;
      kvs.amount = this.Params.amount;

  
      if(this.isNeedProductCode()){
        if(!this.isValidProductCode()) break;
        kvs.productCode = this.Params.productCode;
      }

      if(this.isNeedTaxOther()){
        if(!this.isNumber(this.Params.taxOther)) break;
        kvs.taxOther = this.Params.taxOther;
      }
      
      if(     this.Params.job == "Sales"  ) kvs.operationDiv = "0";
      else if(this.Params.job == "Refund" ) kvs.operationDiv = "0";
      else break;

      return kvs;
    // eslint-disable-next-line no-constant-condition
    } while(false);
  
    return undefined;
  }

  protected doJournal() {
    do {
      const kvs: keyvalue_t = {};

      if(!this.Params.journal) break;
      switch(this.Params.journal){
        case "Total":         kvs.operationDiv = "0"; break;
        case "Intermediate":  kvs.operationDiv = "1"; break;
      }

      return kvs;
      // eslint-disable-next-line no-constant-condition
    } while(false);
    
    return undefined;
  }

  protected doReprint() {
    do {
      const kvs: keyvalue_t = {};

      if(!this.Params.reprint) break;
      switch(this.Params.reprint){
        case "Journal":                         break;
        case "Slip":    kvs.operationDiv = "1"; break;
      }

      return kvs;
    // eslint-disable-next-line no-constant-condition
    } while(false);
    
    return undefined;
  }

  protected /* abstract */ generateGetParameterSelf(): keyvalue_t | undefined {
    const kvs  = (() => {
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
    if(!kvs) return undefined;

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
    return path ? `pokepos://${path}?escape=` : undefined;
  }

  public /* abstract */ isNeedProductCode() {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      Suica:  false,
      QP:     true,
      ID:     true,
      Waon:   false,
      Nanaco: false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }

  public /* abstract */ isNeedTaxOther() {
    const tbl: {[_ in moneytype_t]: boolean} = {
      Credit: true,
      Cup:    true,
      Suica:  false,
      QP:     true,
      ID:     true,
      Waon:   false,
      Nanaco: false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }
}