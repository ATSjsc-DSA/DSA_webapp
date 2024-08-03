<template>
  <div class="card w-full">
    <Stepper>
      <StepperPanel header="Grid Code">
        <template #content="{ nextCallback }">
          <DSA_CommonConfig></DSA_CommonConfig>
          <!-- <div class="flex pt-4 justify-content-end">
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div> -->
        </template>
      </StepperPanel>
      <!-- <StepperPanel header="SPS-F81">
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex pt-4 justify-content-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel> -->
      <StepperPanel header="SPS">
        <template #content="{ prevCallback, nextCallback }">
          <TabView>
            <TabPanel header="F27">
              <DSA_F27_table></DSA_F27_table>
            </TabPanel>
            <TabPanel header="F81"> <DSA_F81_table></DSA_F81_table> </TabPanel>
            <TabPanel header="Power Transfer"><DSA_SPS_PowerTrans></DSA_SPS_PowerTrans> </TabPanel>
          </TabView>

          <!-- <div class="flex pt-4 justify-content-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div> -->
        </template>
      </StepperPanel>
      <!-- <StepperPanel header="SPS-PT">
        <template #content="{ prevCallback, nextCallback }">
          
           <div class="flex pt-4 justify-content-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div> 
        </template>
      </StepperPanel> -->
      <StepperPanel header="SSR">
        <template #content="{ prevCallback, nextCallback }">
          <DSA_SSRConfig></DSA_SSRConfig>
          <!-- <div class="flex pt-4 justify-content-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div> -->
        </template>
      </StepperPanel>
      <StepperPanel header="TSAT">
        <template #content="{ prevCallback, nextCallback }">
          <DSA_TSAT_info></DSA_TSAT_info>
          <!-- <div class="flex pt-4 justify-content-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div> -->
        </template>
      </StepperPanel>

      <StepperPanel header="SPS Check">
        <template #content="{ prevCallback }">
          <DSA_TSA_common></DSA_TSA_common>
          <div class="flex pt-4 justify-content-end">
            <!-- <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" /> -->
            <Button label="Submit" @click="createNewInitSetting" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import DSA_CommonConfig from '@/components/DSA_CommonConfig.vue';
import DSA_F81_table from '@/components/DSA_F81_table.vue';
import DSA_F27_table from '@/components/DSA_F27_table.vue';
import DSA_SPS_PowerTrans from '@/components/DSA_SPS_PowerTrans.vue';
import DSA_SSRConfig from '@/components/DSA_SSRConfig.vue';
import DSA_TSAT_info from '@/components/DSA_TSAT_info.vue';
import { useDSAStore } from '@/store';
import DSA_Common from '@/combosables/DSA_common';
import chartComposable from '@/combosables/chartData';
import DSA_TSA_common from '@/components/DSA_TSA_common.vue';
// import DSA_TSAT_common from '@/components/DSA_TSAT_common.vue';
import { useToast } from 'primevue/usetoast';

const emits = defineEmits(['createProfile']);
const createNewInitSetting = async () => {
  emits('createProfile');
};
</script>

<style scoped>
.p-stepper {
  flex-basis: 50rem;
}
</style>
