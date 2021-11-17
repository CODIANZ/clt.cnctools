import { keyvalue_t } from "./Types";
import { Pokepos } from './Pokepos';

export class PokeposEM extends Pokepos {

  /* override */
  protected doTraining() {
    const params = this.Params;
    if (params.isUseTraining) {
      return this.Params.bTraining ? {training:"1"} : undefined;
    }
    return undefined;
  }

  /* override */
  protected doService() {
    const params = this.Params;
    if (params.moneytype && params.job) {
      const kvs: keyvalue_t = {};

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
      else if (params.moneytype === "iD" || params.moneytype === "QP") {
        if (params.job === "Sales") {
          kvs.operationDiv = "1";
        }
        else if (params.job === "Refund") {
          kvs.operationDiv = "2";
          if (params.slipNo) {
            kvs.slipNo = params.slipNo;
          }
          if (params.otherTermJudgeNo) {
            kvs.termId = params.otherTermJudgeNo;
          }
          if (params.isUseManualFlg) {
            kvs.manualFlg = (params.manualFlg) ? "1" : "0";
          }
        }
        else if (params.job === "Confirm") {
          kvs.operationDiv = "3";
        }
      }

      if (params.amount) {
        kvs.amount = params.amount;
      }
      if (params.taxOther) {
        kvs.taxOther = params.taxOther;
      }
      if (params.productCode) {
        kvs.goodsCode = params.productCode;
      }
      if (params.isUseWithCash) {
        kvs.together = params.bWithCash ? "1" : "0";
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

      if (params.isUsePrintDetail) {
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

        if (params.when === "Last") {
          kvs.target = "0";
        }
        else if (params.when === "BeforeLast") {
          kvs.target = "1";
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

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const path = this.doPath();
    return path ? `pokeposem-pos://${path}` : undefined;
  }

  public /* abstract */ isNeedSelfMode() {
    return true;
  }
}