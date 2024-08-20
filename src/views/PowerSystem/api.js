import { get, post, put, _delete } from '@/utils/request';
import { useCommonStore } from '@/store';
const commonStore = useCommonStore();
const { psm_active, projectId } = storeToRefs(commonStore);

export default class api {
  static async getListPowerSystemData(project_id) {
    return get('/project/' + project_id);
  }
  static async createProject(data) {
    return post('/project', data);
  }
  static async deleteroject(id) {
    return _delete('/project/' + id);
  }
}
