import { get, post, put, _delete } from '@/utils/request';

import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { powerSystemVersionId } = storeToRefs(commonStore);

export class Api {
  static async getBarChartData(appId = '') {
    return get(`/hmi/task/${powerSystemVersionId.value}/app/${appId}`);
  }
  static async getRadarChartData(appId = '') {
    return get(`/hmi/task/${powerSystemVersionId.value}/radar/app/${appId}`);
  }
}
