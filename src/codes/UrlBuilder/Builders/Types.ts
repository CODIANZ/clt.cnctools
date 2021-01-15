export type mode_t       = "pokepos" | "cnc";
export type menus_t      = "Service" | "Journal" | "Reprint";
export type moneytype_t  = "Credit" | "Cup" | "NFC" | "Suica" | "QP" | "ID" | "Waon" | "Nanaco";
export type job_t        = "Sales" | "Refund" | "Cancel" | "ReservedAuthority" | "ApprovedSales" | "CardCheck" | "BalanceInquiry" | "Confirm" | "Payment" | "HistoryInquiry" | "PointCharge";
export type journal_t    = "Total" | "Intermediate";
export type detail_t     = "Summary" | "Detail";
export type reprint_t    = "Slip" | "Journal";
export type when_t       = "Last" | "BeforeLast" | "SlipNo";

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
  bTogether:    boolean;
  amount:       string;
  taxOther:     string;
  productCode:  string;
  slipNo:       string;
  termId:       string;
  manualFlg:    boolean;
  pan:          string;
  transactionType?: "1" | "2";
  returnUrl:    string;
};

export type keyvalue_t = {[_: string]: string};
