<template>
  <!-- Add  -->
  <Panel toggleable>
    <template #header>
      <div class="my-3 text-green-500">New Power System ({{ tableData.Add.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="tableData.Add"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Operation Name" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" field="scadaInfo.skey" />
            <Column header="Scada Name" field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold" style="min-width: 6rem">
              {{ slotProps.data.generalInfo.uniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey" />
        <Column header="Scada Name" field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Update  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-yellow-500">Update Power System ({{ tableData.Update.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="tableData.Update"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" />
            <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Operation Name" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" />
            <Column header="Scada Name" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold" style="min-width: 6rem">
              {{ slotProps.data.emsUniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.name">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.name.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.name.old }}
              </div>
            </div>
          </template>
        </Column>
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.emsName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.emsName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.emsName.old }}
              </div>
            </div>
          </template>
        </Column>
        <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.operationName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.operationName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.operationName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.generalInfo || !slotProps.data.changes.generalInfo.softwareName">
              No change
            </div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.generalInfo.softwareName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.generalInfo.softwareName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.scadaInfo || !slotProps.data.changes.scadaInfo.skey">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.scadaInfo.skey.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.scadaInfo.skey.old }}
              </div>
            </div>
          </template>
        </Column>

        <Column header="Scada Name" field="scadaInfo.scadaName">
          <template #body="slotProps">
            <div v-if="!slotProps.data.changes.scadaInfo || !slotProps.data.changes.scadaInfo.scadaName">No change</div>
            <div v-else>
              <div class="text-green-500">
                {{ slotProps.data.changes.scadaInfo.scadaName.new }}
              </div>
              <div class="text-orange-500 line-through">
                {{ slotProps.data.changes.scadaInfo.scadaName.old }}
              </div>
            </div>
          </template>
        </Column>

        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>

  <!-- Delete  -->
  <Panel toggleable class="mt-3">
    <template #header>
      <div class="my-3 text-red-500">Delete Power System ({{ tableData.Delete.length }})</div>
    </template>
    <div class="py-2">
      <DataTable
        :value="tableData.Delete"
        dataKey="_id"
        tableStyle="min-width: 50rem"
        :lazy="true"
        :sortOrder="1"
        rowHover
        showGridlines
        scrollable
        scrollHeight="400px"
      >
        <ColumnGroup type="header">
          <Row>
            <Column header="Unique Id" style="width: 15%" :rowspan="2" />
            <Column header="General" :colspan="4" />
            <Column header="Scada" :colspan="3" />
          </Row>
          <Row>
            <Column header="Name" field="generalInfo.name" />
            <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Ems Name" field="generalInfo.emsName" />
            <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
            <Column header="Operation Name" field="generalInfo.operationName" />
            <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
            <Column header="Software Name" field="generalInfo.softwareName" />
            <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
            <Column header="Skey" field="scadaInfo.skey" />
            <Column header="Scada Name" field="scadaInfo.scadaName" />
            <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->
          </Row>
        </ColumnGroup>
        <Column header="Unique Id" style="width: 15%">
          <template #body="slotProps">
            <div class="font-bold" style="min-width: 6rem">
              {{ slotProps.data.generalInfo.uniqueId }}
            </div>
          </template>
        </Column>
        <Column header="Name" field="generalInfo.name" />
        <!-- <Column header="uniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Ems Name" field="generalInfo.emsName" />
        <!-- <Column header="emsUniqueId" field="generalInfo.uniqueId" /> -->
        <Column header="Operation Name" field="generalInfo.operationName" />
        <!-- <Column header="operationUniqueId" field="generalInfo.operationUniqueId" /> -->
        <Column header="Software Name" field="generalInfo.softwareName" />
        <!-- <Column header="softwareUniqueId" field="generalInfo.softwareUniqueId" /> -->
        <Column header="Skey" field="scadaInfo.skey" />
        <Column header="Scada Name" field="scadaInfo.scadaName" />
        <!-- <Column header="scadaUniqueId" field="scadaInfo.scadaUniqueId" /> -->

        <template #empty> No change </template>
      </DataTable>
    </div>
  </Panel>
</template>

<script setup>
import { computed } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import { ApiCompare } from './api';
// --- compare
const props = defineProps({
  disabled: { type: Boolean, default: false },
});
onMounted(async () => {
  if (!props.disabled) {
    await getComparePSD();
  }
});

const psCompareData = ref({});

const getComparePSD = async () => {
  try {
    const res = await ApiCompare.getComparePSD();
    psCompareData.value = res.data;
  } catch (error) {
    psCompareData.value = {};
    // toast.add({ severity: 'error', summary: 'Compare Power System', detail: error.data.detail, life: 3000 });
  }
};

const tableData = computed(() => {
  if (!psCompareData.value.Add) {
    return {
      Add: [],
      Update: [],
      Delete: [],
    };
  }
  return psCompareData.value;
});
</script>
