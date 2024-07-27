<Dialog v-model:visible="createAreaDialog" :style="{ width: '30rem' }" header="Create New Area" :modal="true">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="areaname" class="font-semibold w-6rem">Area Name</label>
      <InputText id="areaname" class="flex-auto" autocomplete="off" v-model="areaNameCreate" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="createAreaDialog = false"></Button>
      <Button type="button" label="Submit" @click="createArea()"></Button>
    </div>
  </Dialog>
<Dialog
  v-model:visible="createDataOnAreaDialog"
  modal
  :header="headerDialogUpdate"
  :style="{ width: '50vw' }"
  :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
>
    <ScrollPanel style="width: 100%; height: 400px">
      <ul class="values-list">
        <li
          v-for="value in DataListGenRemaining"
          :key="value._id"
          :class="{ selected: selectedCreateValues.includes(value.name) }"
          @click="toggleSelectValue(value)"
        >
          {{ value.name }}
        </li>
      </ul>
    </ScrollPanel>
    <div class="flex justify-content-end mt-2">
      <Button label="Submit" text raised @click="addDataOnArea()" />
    </div>
  </Dialog>
const DataListGenRemaining = ref([]);
const selectedCreateValues = ref([]);
const psm_id = ref('');
const typeUpdateArea = ref('GEN');
const headerDialogUpdate = computed(() => 'Add ' + typeUpdateArea.value + ' on AREA');
const toggleSelectValue = (value) => {
  if (selectedCreateValues.value.includes(value.name)) {
    selectedCreateValues.value = selectedCreateValues.value.filter((v) => v !== value.name);
  } else {
    selectedCreateValues.value.push(value.name);
  }
};
const addDataTypeOnArea = (id_Area, datalistArea, type) => {
  typeUpdateArea.value = type;
  selectedCreateValues.value = [];
  const datalistAreaIds = datalistArea.map((item) => item.name);
  psm_id.value = id_Area;
  if (type === 'GEN') {
    DataListGenRemaining.value = listGen.value.filter((item) => !datalistAreaIds.includes(item.name));
  } else {
    DataListGenRemaining.value = listLoad.value.filter((item) => !datalistAreaIds.includes(item.name));
  }
  createDataOnAreaDialog.value = true;
};
