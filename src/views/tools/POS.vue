<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-select
            v-model="m.job"
            :items="jobs"
            label="業務"
            item-text="name"
            item-value="value"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-switch
            v-model="m.bTraining"
            inset
            :label="`トレーニング`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.bPrinting"
            inset
            :label="`印字`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="m.bSelfMode"
            inset
            :label="`セルフモード`"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="m.amount"
            label="金額"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.taxOther"
            label="税・その他"
            :rules="[required,range(1,99999)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="m.productCode"
            label="商品コード"
            :rules="[required,length(4)]"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive, ref } from "@vue/composition-api";
import { iform, validations } from "@/codes/FormUtil"

type job_t = {
  name: string;
  value: string;
};

const jobs: job_t[] = [
  { name: "クレジット：売上",   value: "1" }
];

const m = reactive({
  job: {name: "", value: ""} as job_t,
  bTraining: false,
  bPrinting: false,
  bSelfMode: false,
  amount: "",
  taxOther: "",
  productCode: ""
});

export default defineComponent({
  setup(props, ctx) {
    const form = ref<iform>();
    return {
      m,
      jobs,
      form,
      ...validations
    };
  }
});
</script>
