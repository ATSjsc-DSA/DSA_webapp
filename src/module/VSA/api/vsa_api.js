import { get, post } from '@/utils/request';
import { useCommonStore } from '@/store';

const commonStore = useCommonStore();
const { psm_active } = storeToRefs(commonStore);
export default class SSR_api {
  static async getAreaList() {
    return get('/vsa/' + psm_active.value._id);
  }
  static async getBusbarList(area) {
    return get('/vsa/' + psm_active.value._id + '/' + area);
  }
  static async detailBusBar(area, payload) {
    return post('/vsa/' + psm_active.value._id + '/' + area, payload);
  }
}
