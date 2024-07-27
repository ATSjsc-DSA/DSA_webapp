import { get, post } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);

export default class SSR_api {
  static async getSubInfo(sub_name) {
    return get('/ssr/' + psm_active.value._id + '/' + sub_name);
  }
  static async getGenList() {
    return get('/ssr/' + psm_active.value._id);
  }
}
