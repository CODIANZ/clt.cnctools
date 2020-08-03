import Vue from "vue";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import {
  email,
  max,
  min,
  numeric,
  required,
  between
} from "vee-validate/dist/rules";

extend("email", email);
extend("max", max);
extend("min", min);
extend("numeric", numeric);
extend("required", required);
extend("between", between);

extend("decimal", {
  validate: (value) => {
    if(value){
      const v = parseFloat(value);
      return { valid: !isNaN(v) }
    }
    return { valid: false };
  },
  message: "{_field_} は数値を指定してください。"
});

Vue.component("validation-provider", ValidationProvider);
Vue.component("validation-observer", ValidationObserver);
