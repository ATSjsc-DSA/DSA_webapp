import { get, post, put, _delete } from '@/utils/request';

export class ApiVsaCase {
  static async getList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodevsacase`);
  }
  static async getVsaCaseById(vsaCaseId) {
    return get(`/gridcode/gridcodevsacase/${vsaCaseId}`);
  }
  static async create(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodevsacase`, data);
  }
  static async update(vsaCaseId, data) {
    return put(`/gridcode/gridcodevsacase/${vsaCaseId}`, data);
  }
  static async deleteVsaCase(vsaCaseId) {
    return _delete(`/gridcode/gridcodevsacase/${vsaCaseId}`);
  }
}

export class ApiAngleStability {
  static async getAngleStabilityList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodeanglestability`);
  }
  static async getAngleStabilityById(angleStabilityId) {
    return get(`/gridcode/gridcodeanglestability/${angleStabilityId}`);
  }
  static async createAngleStability(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodeanglestability`, data);
  }
  static async updateAngleStability(angleStabilityId, data) {
    return put(`/gridcode/gridcodeanglestability/${angleStabilityId}`, data);
  }
  static async deleteAngleStability(angleStabilityId) {
    return _delete(`/gridcode/gridcodeanglestability/${angleStabilityId}`);
  }

  // --- RestoreTime
  static async getAngleRestoreTimeList(angleStabilityId, page) {
    return get(`/gridcode/${angleStabilityId}/gridcodeanglerestoretime`, {
      page: page,
      page_size: 10,
    });
  }
  static async getAngleRestoreTimeById(angleRestoreTimeId) {
    return get(`/gridcode/gridcodeanglerestoretime/${angleRestoreTimeId}`);
  }
  static async createAngleRestoreTime(angleStabilityId, data) {
    return post(`/gridcode/${angleStabilityId}/gridcodeanglerestoretime`, data);
  }
  static async updateAngleRestoreTime(angleRestoreTimeId, data) {
    return put(`/gridcode/gridcodeanglerestoretime/${angleRestoreTimeId}`, data);
  }
  static async deleteAngleRestoreTime(angleRestoreTimeId) {
    return _delete(`/gridcode/gridcodeanglerestoretime/${angleRestoreTimeId}`);
  }
}

export class ApiVoltage {
  static async getVoltageList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodevol`);
  }
  static async getVoltageById(voltageId) {
    return get(`/gridcode/gridcodevol/${voltageId}`);
  }
  static async createVoltage(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodevol`, data);
  }
  static async updateVoltage(voltageId, data) {
    return put(`/gridcode/gridcodevol/${voltageId}`, data);
  }
  static async deleteVoltage(voltageId) {
    return _delete(`/gridcode/gridcodevol/${voltageId}`);
  }
}

export class ApiContingency {
  static async getContingencyList(standartId) {
    return get(`/gridcode/${standartId}/gridcodecontingency`);
  }
  static async getContingencyById(contingencyId) {
    return get(`/gridcode/gridcodecontingency/${contingencyId}`);
  }
  static async createContingency(standartId, data) {
    return post(`/gridcode/${standartId}/gridcodecontingency`, data);
  }
  static async updateContingency(contingencyId, data) {
    return put(`/gridcode/gridcodecontingency/${contingencyId}`, data);
  }
  static async deleteContingency(contingencyId) {
    return _delete(`/gridcode/gridcodecontingency/${contingencyId}`);
  }

  // DynacmicStd
  static async getDynacmicStdList(contingencyId, page) {
    return get(`/gridcode/${contingencyId}/gridcodedynamicstd`, {
      page: page,
      page_size: 10,
    });
  }
  static async getDynacmicStdById(contingencyId) {
    return get(`/gridcode/gridcodedynamicstd/${contingencyId}`);
  }
  static async createDynacmicStd(contingencyId, data) {
    return post(`/gridcode/${contingencyId}/gridcodedynamicstd`, data);
  }
  static async updateDynacmicStd(contingencyId, data) {
    return put(`/gridcode/gridcodedynamicstd/${contingencyId}`, data);
  }
  static async deleteDynacmicStd(contingencyId) {
    return _delete(`/gridcode/gridcodedynamicstd/${contingencyId}`);
  }
}

export class ApiFrequency {
  static async getFrequencyList(gridcodeId) {
    return get(`/gridcode/${gridcodeId}/gridcodefreq`);
  }
  static async getFrequencyById(frequencyId) {
    return get(`/gridcode/gridcodefreq/${frequencyId}`);
  }
  static async createFrequency(gridcodeId, data) {
    return post(`/gridcode/${gridcodeId}/gridcodefreq`, data);
  }
  static async updateFrequency(frequencyId, data) {
    return put(`/gridcode/gridcodefreq/${frequencyId}`, data);
  }
  static async deleteFrequency(frequencyId) {
    return _delete(`/gridcode/gridcodefreq/${frequencyId}`);
  }
}
