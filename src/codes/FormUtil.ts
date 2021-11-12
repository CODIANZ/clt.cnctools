import Vue from "vue";

export interface iform extends Vue {
  validate(): boolean;
}

export const validations = {
  required: (v: string | number) => { return !!v || "必ず入力してください"; },
  length: (n: string | number) => { return (v: string) => {
    if (v as string) {
      return v.length <= n || `${n} 文字以内で入力してください`;
    }
    let value: string = "" + v;
    return value.length <= n || `${n} 文字以内で入力してください`;
  }},
  range: (min: number | undefined, max: number | undefined) => { return (v: number) => {
    if(min && max){
      return ((min <= v) && (v <= max)) || `入力範囲は ${min}～${max} です`;
    }
    else if(min){
      return (min <= v) || `入力範囲は ${min} 以下です`;

    }
    else if(max){
      return (v <= max) || `入力範囲は ${max} 以上です`;
    }
   }
  }
}

