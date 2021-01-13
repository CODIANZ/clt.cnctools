import { Base } from "./Base";
import { menus_t, moneytype_t, keyvalue_t, job_t, journal_t, when_t, reprint_t } from "./Types";

export class Cnc extends Base {
  private m_menus: {[_ in menus_t]: string} = {
    Service: "service",
    Journal: "journal",
    Reprint: "reprint"
  };

  private m_moneytypes: {[_ in moneytype_t]: string} = {
    Credit: "credit",
    Cup:    "cup",
    Suica:  "suica",
    QP:     "quickpay",
    ID:     "id",
    Waon:   "waon",
    Nanaco: "nanaco"
  };

  private m_jobs: {[_ in job_t]: string} = {
    "Sales": "settlement",
    "Refund": "refund",
    "Confirm": "confirm"
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
    return {"selfMode": this.Params.bSelfMode ? "true" : "false"};
  }

  protected doService() {
    do {
      if(!this.Params.moneytype) break;
      if(!this.Params.job) break;

      const path = `${this.m_moneytypes[this.Params.moneytype]}-${this.m_jobs[this.Params.job]}`;
      const kvs: keyvalue_t = {};

      switch(this.Params.job){
        case "Sales":{
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
          break;
        }
        case "Refund":{
          if(isNaN(parseInt(this.Params.amount))) break;
          switch(this.Params.moneytype){
            case "Suica":{
              kvs.amount  = this.Params.amount;
              break;
            }
            default:{
              kvs.amount  = this.Params.amount;
              kvs.slipNo  = this.Params.slipNo;
              kvs.termId  = this.Params.termId;
              kvs.manual  = this.Params.manualFlg ? "true" : "false";
              if(this.Params.manualFlg){
                kvs.pan = this.Params.pan;
              }
              break;
            }
          }
          break;
        }
        case "Confirm":{
          break;
        }
      }

      return {path, kvs};
    // eslint-disable-next-line no-constant-condition
    } while(false);
  
    return undefined;
  }

  protected doJournal() {
    do {
      if(!this.Params.moneytype) break;
      if(!this.Params.journal) break;
      if(!this.Params.detail) break;

      const path = `${this.m_moneytypes[this.Params.moneytype]}-journal-${this.m_journals[this.Params.journal]}`;
      const kvs: keyvalue_t = {};

      kvs.type = (this.Params.detail == "Summary") ? "summary" : "detail";

      return {path, kvs};
      // eslint-disable-next-line no-constant-condition
    } while(false);
    
    return undefined;
  }

  protected doReprint() {
    do {
      if(!this.Params.moneytype) break;
      if(!this.Params.reprint) break;
      if(!this.Params.when) break;

      const path = `${this.m_moneytypes[this.Params.moneytype]}-reprint-${this.m_reprints[this.Params.reprint]}`;
      const kvs: keyvalue_t = {};

      switch(this.Params.reprint){
        case "Journal":{
          if(this.Params.when == "SlipNo") break;
          kvs.when = this.m_whens[this.Params.when];

          break;
        }
        case "Slip":{
          kvs.when = this.m_whens[this.Params.when];
          if(this.Params.when =="SlipNo"){
            kvs.slipNo = this.Params.slipNo;
          }
          break;
        }
      }

      return {path, kvs};
    // eslint-disable-next-line no-constant-condition
    } while(false);
    
    return undefined;
  }

  protected /* abstract */ generateGetParameterSelf(): keyvalue_t | undefined {
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

    return {
      ...re.kvs,
      ...this.doTraining(),
      ...this.doPrint(),
      ...this.doSelfmode(),
      returnUrlScheme: this.Params.returnUrl
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
      NFC:    true,
      Suica:  false,
      QP:     true,
      ID:     true,
      Waon:   false,
      Nanaco: false
    };
    return this.Params.moneytype ? tbl[this.Params.moneytype] : false;
  }
}