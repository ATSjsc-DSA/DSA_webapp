import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { psm_active, projectData, versionId } = storeToRefs(commonStore);

export class ApiCommon {
  static async getQueueTask(param) {
    return get(`/common/${projectData.value._id}/task`, param);
  }
}
