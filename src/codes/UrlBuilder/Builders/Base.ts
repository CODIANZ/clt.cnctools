import { keyvalue_t, params_t, mode_t, moneytype_t } from "./Types";

export abstract class  Base {
  private m_params = Base.DefaultParams;
  public get Params() { return this.m_params; }

  protected abstract  generateBaseUrlSelf(): string | undefined;
  protected abstract  generateGetParameterSelf(): keyvalue_t | undefined;

  public generateUrl(bEndode: boolean): string | undefined {
    const urlbase = this.generateBaseUrlSelf();
    const kvs = this.generateGetParameterSelf();

    if (!urlbase || !kvs) {
      return undefined;
    }

    const getp = Object.keys(kvs).reduce((p, c) => {
      return `${p}${p.length > 0 ? "&" : ""}${c}=${bEndode ? encodeURIComponent(kvs[c]) : kvs[c]}`;
    }, "");

    return `${urlbase}?${getp}`;
  }

  public static isEMoney(moneytype: moneytype_t | undefined): boolean {
    return !(moneytype === "Credit" || moneytype === "Cup" || moneytype === "NFC");
  }

  public isEMoney(): boolean {
    return Base.isEMoney(this.Params.moneytype);
  }

  public isNeedWithCash(): boolean {
    return this.Params.moneytype == "Suica" && this.Params.job == "Sales";
  }

  public abstract isNeedProductCode(): boolean;
  public abstract isNeedTaxOther(): boolean;
  public abstract isNeedLump(): boolean;

  public isNumber(s: string | undefined): boolean {
    if (s === undefined) {
      return false;
    }
    if (s.length === 0) {
      return false;
    }
    return !isNaN(parseInt(s));
  }

  public isValidProductCode(): boolean {
    return this.Params.productCode.match(/^[0-9]{4}$/) != null;
  }

  public abstract isNeedSelfMode(): boolean;

  static get DefaultParams() {
    return {
      menu:         undefined,
      moneytype:    undefined,
      job:          undefined,
      journal:      undefined,
      detail:       undefined,
      reprint:      undefined,
      when:         undefined,
      bTraining:    false,
      bPrinting:    true,
      bSelfMode:    false,
      bLump:        false,
      isUseWithCash: false,
      bWithCash:    false,
      amount:       "",
      taxOther:     "",
      productCode:  "",
      slipNo:       "",
      otherTermJudgeNo: "",
      manualFlg:    false,
      pan:          "",
      approvalNumber: "",
      cancelType:   undefined,
      returnUrl:    ""
    } as params_t;
  }
}
