export type mode_t       = "Pokepos" | "Cnc";
export type menus_t      = "Service" | "Journal" | "Reprint" | "Settings";
export type moneytype_t  = "Credit" | "Cup" | "NFC" | "Suica" | "ID" | "QP" | "Waon" | "Edy" | "Nanaco" | "All";
export type job_t        = "Sales" | "Refund" | "ReservedAuthority" | "RefundReservedAuthority" | "ApprovedSales" | "RefundApprovedSales" | "CardCheck" | "Balance" | "Confirm" | "History" | "PointCharge";
export type journal_t    = "Total" | "Intermediate";
export type detail_t     = "Summary" | "Detail";
export type reprint_t    = "Slip" | "Journal";
export type when_t       = "Last" | "BeforeLast" | "SlipNo";
export type refundtype_t = "1" | "2";

export type params_t = {
  logid:        string;
  mode:         mode_t;
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
  bLump:        boolean;
  bWithCash:    boolean;
  amount:       string;
  taxOther:     string;
  productCode:  string;
  slipNo:       string;
  otherTermJudgeNo: string;
  manualFlg:    boolean;
  pan:          string;
  cancelType?:  refundtype_t;
  returnUrl:    string;
};

export type keyvalue_t = {[_: string]: string};
