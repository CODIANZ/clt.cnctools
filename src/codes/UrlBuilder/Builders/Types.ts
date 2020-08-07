export type mode_t       = "pokepos" | "cnc";
export type menus_t      = "Service" | "Journal" | "Reprint";
export type moneytype_t  = "Credit" | "Cup" | "Suica" | "QP" | "ID" | "Waon" | "Nanaco";
export type job_t        = "Sales" | "Refund" | "Confirm";
export type journal_t    = "Total" | "Intermediate";
export type detail_t     = "Summary" | "Detail";
export type reprint_t    = "Slip" | "Journal";
export type when_t       = "Last" | "BeforeLast";

export type params_t = {
  menu?:        menus_t;
  moneytype?:   moneytype_t;
  job?:         job_t;
  journal?:     journal_t;
  detail?:      detail_t;
  reprint?:     reprint_t;
  when?:        when_t;
  bTraining:    boolean;
  bPrinting:    boolean;
  bSelfMode:    boolean;
  bTogether:    boolean;
  amount:       string;
  taxOther:     string;
  productCode:  string;
  slipNo:       string;
  termId:       string;
  manualFlg:    boolean;
  pan:          string;
  returnUrl:    string;
};

export type keyvalue_t = {[_: string]: string};