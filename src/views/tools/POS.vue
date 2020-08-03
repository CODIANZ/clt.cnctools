<template>
  <v-container>
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
          label="金額"
          :rules="rules"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>




  </v-container>
</template>
    
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

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
  bSelfMode: false
});

export default defineComponent({
  setup(props, ctx) {
    return { m, jobs };
  }
});
</script>
