import { keyvalue_t } from "./Types";
import { Pokepos } from './Pokepos';

export class PokeposEM extends Pokepos {

  /* override */
  protected doTraining() {
    return this.Params.bTraining ? {training:"1"} : undefined;
  }

  /* override */
  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const kvs: keyvalue_t = {};

      if (params.job === "Sales" || params.job === "Refund") {
        if (!isNaN(parseInt(params.amount))) {
          kvs.amount = params.amount;
        }
    
        if (this.isNeedProductCode() && this.isValidProductCode()) {
          kvs.goodsCode = params.productCode;
        }
  
        if (this.isNeedTaxOther() && this.isNumber(params.taxOther)) {
          kvs.taxOther = params.taxOther;
        }
  
        if (this.isNeedWithCash()) {
          kvs.together = params.bWithCash ? "1" : "0";
        }
      }

      if (params.moneytype === "Suica") {
        if (params.job === "Sales") {
          kvs.operationDiv = "1";
        }
        else if (params.job === "Balance") {
          kvs.operationDiv = "2";
        }
        else if (params.job === "Confirm") {
          kvs.operationDiv = "3";
        }
      }
      else if (params.moneytype === "ID" || params.moneytype === "QP") {
        if (params.job === "Sales") {
          kvs.operationDiv = "1";
        }
        else if (params.job === "Refund") {
          if (isNaN(parseInt(params.amount)) || params.slipNo.length === 0 || params.otherTermJudgeNo.length === 0) {
            return undefined;
          }
          kvs.operationDiv = "2";
          kvs.slipNo = params.slipNo;
          kvs.termId = params.otherTermJudgeNo;
        }
        else if (params.job === "Confirm") {
          kvs.operationDiv = "3";
        }
      }

      return kvs;
    }
  
    return undefined;
  }

  /* override */
  protected doJournal() {
    let params = this.Params;
    if (params.moneytype && params.journal && params.detail) {
      const kvs: keyvalue_t = {};

      if (params.journal === "Total") {
        kvs.operationDiv = "1";
      }
      else if (params.journal === "Intermediate") {
        kvs.operationDiv = "2";
      }

      if (params.detail === "Summary") {
        kvs.detail = "0";
      }
      else if (params.detail === "Detail") {
        kvs.detail = "1";
      }

      return kvs;
    }

    return undefined;
  }

  /* override */
  protected doReprint() {
    const params = this.Params;
    if (params.reprint && params.moneytype) {
      const kvs: keyvalue_t = {};

      if (params.reprint === "Slip") {
        kvs.operationDiv = "2";
      }
      else if (params.reprint === "Journal") {
        kvs.operationDiv = "1";
        if (params.detail === "Summary") {
          kvs.detail = "0";
        }
        else if (params.detail === "Detail") {
          kvs.detail = "1";
        }
        else {
          return undefined;
        }

        if (params.when === "Last") {
          kvs.target = "0";
        }
        else if (params.when === "BeforeLast") {
          kvs.target = "1";
        }
        else {
          return undefined;
        }
      }

      return kvs;
    }
    
    return undefined;
  }

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const path = this.doPath();
    return path ? `pokeposem-pos://${path}` : undefined;
  }

  public /* abstract */ isNeedSelfMode() {
    return true;
  }
}