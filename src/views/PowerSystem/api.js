import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

export default class api {
  static async getPSD(data) {
    return get(`/powersystem/${projectId.value}/powersystemdata`, data);
  }

  static async getPSDEdit(data) {
    return get(`/powersystem/${projectId.value}/powersystemedit`, data);
  }

  static async getComparePSD() {
    return get(`/powersystem/${projectId.value}/compare_powersystem`);
  }
  static async createPS(data) {
    return post(`/powersystem/${projectId.value}/powersystemedit`, {
      _id: '',
      projectId: projectId.value,
      generalInfo: {
        name: data.generalInfo.name,
        // uniqueId: '',
        parrentId: '',
        emsName: data.generalInfo.emsName,
        emsUniqueId: data.generalInfo.emsUniqueId,
        operationName: data.generalInfo.operationName,
        operationUniqueId: '',
        softwareName: data.generalInfo.softwareName,
        softwareUniqueId: '',
      },
      engineInfo: {
        elementsDefinitionId: '',
        values: [''],
      },
      scadaInfo: {
        skey: '',
        scadaName: data.scadaInfo.scadaName,
        scadaUniqueId: '',
      },
    });
  }
  static async editPSE(data) {
    return put(`/powersystem/${projectId.value}/powersystemedit/${data._id}`, data);
  }
  static async deletePSE(psde_id) {
    console.log('deletePSE', projectId.value, psde_id);
    return _delete(`/powersystem/${projectId.value}/powersystemedit/${psde_id}`);
  }
}
