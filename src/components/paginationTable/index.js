import paginationTable from './paginationTable.vue';

paginationTable.install = function (Vue) {
  Vue.component(paginationTable.name, paginationTable);
};

export default paginationTable;
