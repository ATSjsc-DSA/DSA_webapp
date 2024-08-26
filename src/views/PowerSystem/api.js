import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

console.log('projectId', projectId.value);
console.log('psm_active', psm_active.value._id);

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

  static async createGeneralPSE(data) {
    return post(`/powersystem/${projectId.value}/powersystemedit`, {
      projectId: projectId.value,
      generalInfo: data,
      engineInfo: {
        elementsDefinitionId: '',
        values: [''],
      },
      scadaInfo: {
        skey: '',
        scadaName: '',
        scadaUniqueId: '',
      },
    });
  }

  static async createEnginePSE(data) {
    return post(`/powersystem/${projectId.value}/powersystemedit`, {
      _id: 'string',
      projectId: 'string',
      generalInfo: {
        name: 'string',
        uniqueId: 'string',
        parrentId: 'string',
        emsName: 'string',
        emsUniqueId: 'string',
        operationName: 'string',
        operationUniqueId: 'string',
        softwareName: 'string',
        softwareUniqueId: 'string',
      },
      engineInfo: data,
      scadaInfo: {
        skey: 'string',
        scadaName: 'string',
        scadaUniqueId: 'string',
      },
    });
  }
  static async editPSE(data) {
    return put(`/powersystem/${projectId.value}/powersystemedit/${data._id}`, data);
  }
  static async deletePSE(psde_id) {
    return _delete(`/powersystem/${projectId.value}/powersystemedit/${psde_id}`);
  }
}
