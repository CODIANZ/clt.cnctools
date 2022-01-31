export type mode_t       = "Pokepos" | "Cnc";
export type menus_t      = "Service" | "Journal" | "Reprint" | "Settings";
export type moneytype_t  = "Credit" | "Cup" | "NFC" | "Suica" | "iD" | "QP" | "WAON" | "Edy" | "nanaco" | "All";
export type job_t        = "Sales" | "Refund" | "ReservedAuthority" | "RefundReservedAuthority" | "ApprovedSales" | "RefundApprovedSales" | "CardCheck" |
"SubtractValue" | "CancelValue" | "Balance" | "Confirm" | "History" | "PointCharge";
export type journal_t    = "Total" | "Intermediate";
export type detail_t     = "Summary" | "Detail";
export type reprint_t    = "Slip" | "Journal";
export type when_t       = "Last" | "BeforeLast" | "SlipNo";
export type refundtype_t = "1" | "2";

export type params_t = {
  logid:          string;
  mode:           mode_t;
  menu?:          menus_t;
  moneytype?:     moneytype_t;
  job?:           job_t;
  journal?:       journal_t;
  isUseDetail:    boolean;
  detail?:        detail_t;
  reprint?:       reprint_t;
  isUseWhen:      boolean;
  when?:          when_t;
  isUseTraining:  boolean;
  bTraining:      boolean;
  isUsePrinting:  boolean;
  bPrinting:      boolean;
  isUseSelfMode:  boolean;
  bSelfMode:      boolean;
  isUseLump:      boolean;       
  bLump:          boolean;
  isUseWithCash:  boolean;
  bWithCash:      boolean;
  amount:         string;
  taxOther:       string;
  productCode:    string;
  slipNo:         string;
  otherTermJudgeNo: string;
  isUseManualFlg: boolean;
  manualFlg:      boolean;
  pan:            string;
  isUseApprovalNumber:  boolean;
  approvalNumber: string;
  isUseCancelType:  boolean;
  cancelType?:    refundtype_t;
  returnUrl:      string;
};

export type keyvalue_t = {[_: string]: string};
