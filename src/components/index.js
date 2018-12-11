import comboGrid from './comboGrid';
import paginationTable from './paginationTable';
import formatter from '../utils/formatter';

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  comboGrid,
  paginationTable
}

const ElementUIExtend = {
  comboGrid,
  paginationTable,
  formatter,
  components: ['comboGrid', 'paginationTable'],
  methods: ['formatter'],
  install(Vue) {
    this.components.forEach(item => {
      Vue.component(item, this[item]);
    });
    this.methods.forEach(method => {
      Vue.prototype['$' + method] = this[method];
    })
  }
};

export default ElementUIExtend;

