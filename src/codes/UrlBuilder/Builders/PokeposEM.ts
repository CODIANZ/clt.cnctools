import { keyvalue_t } from "./Types";
import { Pokepos } from './Pokepos';

export class PokeposEM extends Pokepos {

  /* override */
  protected doTraining() {
    return {training: this.Params.bTraining ? "0" : "1"};
  }

  /* override */
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

      if(this.isNeedTogether()){
        kvs.together = this.Params.bTogether ? "1" : "0";
      }

      if(     this.Params.job == "Sales"    ) kvs.operationDiv = "0";
      else if(this.Params.job == "Refund"   ) kvs.operationDiv = "1";
      else if(this.Params.job == "Confirm"  ) kvs.operationDiv = "2";
      else break;

      return kvs;
    // eslint-disable-next-line no-constant-condition
    } while(false);
  
    return undefined;
  }

  /* override */
  protected doJournal() {
    return undefined;
  }

  /* override */
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

  protected  /* abstract */ generateBaseUrlSelf(): string | undefined {
    const path = this.doPath();
    return path ? `pokeposem-pos://${path}` : undefined;
  }
}