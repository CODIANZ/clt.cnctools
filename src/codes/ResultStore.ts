import { UrlBuilder } from "./UrlBuilder";
import { LocalStoargeData } from "./LocalStorageData";
import { debug } from "debug";
const LOG = debug("app:ResultStore");

export type resultstore_t = {
  param: UrlBuilder.params_t;
  sendUrl: string;
  receiveUrl?: string;
  receiveData?: unknown;
};

export class ResultStore extends LocalStoargeData<resultstore_t> {
  private static s_key = "posresults";

  static create() {
    return new ResultStore(ResultStore.s_key);
  }

  public setSend(id: string, param: UrlBuilder.params_t, sendUrl: string){
    const d = this.loadAll();
    d[id] = {
      param: param,
      sendUrl: sendUrl
    };
    this.saveAll(d);
  }

  public setReceive(id: string, receiveUrl: string, receiveData: unknown){
    const d = this.loadAll();
    if(id in d){
      d[id].receiveUrl = receiveUrl;
      d[id].receiveData = receiveData;
      this.saveAll(d);
    }
    else{
      LOG("setReceive(): id not found", id);
    }
  }
}