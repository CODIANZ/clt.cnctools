import { keyvalue_t, params_t, moneytype_t } from "./Types";

export abstract class  Base {
  private m_params = Base.DefaultParams;
  public get Params() { return this.m_params; }

  protected abstract  generateBaseUrlSelf(): string | undefined;
  protected abstract  generateGetParameterSelf(): keyvalue_t | undefined;

  public generateUrl(): string | undefined{
    const urlbase = this.generateBaseUrlSelf();
    const kvs = this.generateGetParameterSelf();

    if(!urlbase) return undefined;
    if(!kvs) return undefined;

    const getp = Object.keys(kvs).reduce((p, c) => {
      return `${p}${p.length > 0 ? "&" : ""}${c}=${kvs[c]}`;
    }, "");

    return `${urlbase}?${getp}`;
  }

  public static isEMoney(moneytype: moneytype_t | undefined): boolean {
    switch(moneytype){
      case "Credit":
      case "Cup": {
        return false;
      }
      case "Suica":
      case "QP":
      case "ID":
      case "Waon":
      case "Nanaco": {
        return true;
      }
      default: return false;
    }
  }

  public isEMoney(): boolean {
    return Base.isEMoney(this.Params.moneytype);
  }

  public isNeedTogether(): boolean {
    return this.Params.moneytype == "Suica" && this.Params.job == "Sales";
  }

  public abstract isNeedProductCode(): boolean;
  public abstract isNeedTaxOther(): boolean;

  public isNumber(s: string | undefined): boolean {
    if(s === undefined) return false;
    if(s.length == 0) return false;
    return !isNaN(parseInt(s));
  }

  public isValidProductCode(): boolean {
    return this.Params.productCode.match(/^[0-9]{4}$/) != null;
  }

  static get DefaultParams() {
    return {
      menu:         undefined,
      moneytype:    undefined ,
      job:          undefined,
      journal:      undefined,
      detail:       undefined,
      reprint:      undefined,
      when:         undefined,
      bTraining:    false,
      bPrinting:    false,
      bSelfMode:    false,
      bTogether:    false,
      amount:       "",
      taxOther:     "",
      productCode:  "",
      slipNo:       "",
      termId:       "",
      manualFlg:    false,
      pan:          "",
      returnUrl:    `${location.protocol}//${location.host}${location.pathname}`
    } as params_t;
  }
}
