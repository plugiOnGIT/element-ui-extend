import axios from 'axios'
import {post} from '../../utils/http';
axios.defaults.timeout = 30000 // 设置请求时间
axios.defaults.withCredentials = true
let baseUrl = 'http://localhost:3000';

export default {
  // 可分页下拉表格示例地址
  comboGridQuery (param) {
    return post(baseUrl + '/comboGrid.do', param)
  },
  comboGridUrl () {
    return baseUrl + '/comboGrid.do';
  },
  // 分页表格
  paginationTableQuery (param) {
    return post(baseUrl + '/paginationTable.do', param)
  },
  paginationTableUrl () {
    return baseUrl + '/paginationTable.do';
  }
}
