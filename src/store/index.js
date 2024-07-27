import { createPinia } from 'pinia';

const store = createPinia();

export default store;

export * from './modules/common';
export * from './modules/dsa_store';
export * from './modules/map_store';
