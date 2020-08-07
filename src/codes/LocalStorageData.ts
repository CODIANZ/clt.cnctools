/** indexedDB のサポートブラウザが増えたら移行した方が良いかもね */
import { debug } from "debug";
const LOG = debug("app:LocalStoargeData");

export class LocalStoargeData<TYPE> {
  private m_key: string;
  private get Key() { return this.m_key; }

  constructor(key: string){
    this.m_key = key;
  }

  protected saveAll(data: {[_: string]: TYPE}) {
    localStorage.setItem(this.Key, JSON.stringify(data));
  }

  protected loadAll() {
    const d = localStorage.getItem(this.Key);
    return (d ? JSON.parse(d) : {}) as {[_: string]: TYPE};
  }

  public set(id: string, data: TYPE) {
    const d = this.loadAll();
    d[id] = data;
  }

  public get(id: string) {
    const d = this.loadAll();
    return (id in d) ? d[id] : undefined;
  }

  public list() {
    const d = this.loadAll();
    return Object.keys(d)
    .sort((a, b) => { return b.localeCompare(a); })
    .map((id) => {
      return d[id];
    });
  }

  public eraseAll() {
    localStorage.removeItem(this.Key);
  }
  
  public erase(id: string) {
    const d = this.loadAll();
    if(id in d){
      delete d[id];
      this.saveAll(d);
    }
    else{
      LOG("erase(): id not found", id);
    }
  }
}