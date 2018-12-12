<template>
<div class="pagination-table-wrap" ref="tableBox">
  <el-table
    ref="myTable"
    :data="tableData"
    :height="tableHeight"
    :stripe="stripe"
    :border="border"
    :fit="fit"
    size="small"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    v-loading="loading"
    @select="selectChange"
    @select-all="selectALL"
    @selection-change="selectGroupChange"
    @row-click="rowClick"
    @row-dblclick="rowDblClick"
    @sort-change="sortChange"
  >
    <slot name="tableColumns"></slot>
  </el-table>
  <div class="page-wrap">
    <el-pagination
      :small="small"
      :background="background"
      :page-size.sync="currentPageSize"
      :total="total"
      :pager-count="pagerCount"
      :current-page.sync="currentPage"
      :layout="layout"
      :page-sizes="pageSizes"
      :popper-class="popperClass"
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
    >
    </el-pagination>
    <div v-if="hasTotal" class="page-total">已选{{currentSelectTotal}}条，共{{total}}条数据</div>
  </div>
</div>
</template>

<script>
  import {post} from '../../utils/http';
  export default {
    name: "pagination-table",
    props: {
      // 表格prop
      height: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: Boolean,
      fit: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      currentRowKey: {
        type: [Number, String]
      },
      // 分页prop
      small: Boolean,
      background: {
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 50
      },
      // total: Number,
      pagerCount: Number,
      // currentPage: Number,
      layout: {
        type: String,
        default: 'prev, pager, next, sizes, jumper'
      },
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 30, 50, 100, 200];
        }
      },
      popperClass: String,
      // 表格查询条件
      searchParam: {
        default: {},
        type: Object
      },
      // 是否主动加载表格
      // (若设置该项为false,需要手动调用getTableData方法，即时修改了searchParam，也不会发出请求)
      autoLoad: {
        default: true,
        type: Boolean
      },
      // 表格查询url
      dataUrl: {
        default: '',
        type: String
      },
      // 表格请求方法名字
      dataUrlFunc: {
        type: Function,
        default () {
          return () => {}
        }
      },
      // 设置表格高度（距离页面底部距离）
      verticalResizeOffset: {
        type: Number,
        default: 60
      },
      // 是否有底部选中行数统计
      hasTotal: {
        type: Boolean,
        default: true
      },
      // 表格查询字段设置字段
      searchField: {
        type: Object,
        default () {
          return {
            sortType: 'sortType|asc|desc',
            sortName: 'sortName',
            pageNum: 'pageNum',
            pageSize: 'pageSize'
          }
        }
      }
    },
    data () {
      return {
        tableHeight: -1,
        loading: false, // 表格是否加载中
        tableData: [],
        total: 0,
        currentPage: 1,
        currentPageSize: this.pageSize, // 当前每页显示条数
        currentSelectTotal: 0, // 当前选中数据总条数
        sortName: '', // 表格当前排序字段
        sortType: '', // 表格排序类型

        sortTypeField: this.searchField.sortType.split('|')[0],
        sortTypeAscField: this.searchField.sortType.split('|')[1],
        sortTypeDescField: this.searchField.sortType.split('|')[2],
        sortNameField: this.searchField.sortName,
        pageNumField: this.searchField.pageNum,
        pageSizeField: this.searchField.pageSize
      }
    },
    watch: {
      // 查询条件改变时，重新加载表格数据
      searchParam () {
        this.currentPage = 1;
        this.$refs.myTable.clearSort();
        this.sortType = '';
        this.sortName = '';
        this.getTableData()
      }
    },
    mounted () {
      if (this.autoLoad) {
        this.getTableData();
      }
      this.$nextTick(() => {
        this.setTableHeight();
      })
    },
    methods: {
      // 获取表格数据
      getTableData () {
        if (!this.dataUrl && !this.dataUrlFunc) {
          return;
        }
        this.setQueryMethod().then(res => {
          if (res.code === '0') {
            this.tableData = res.rows;
            this.total = res.total;
          }
          this.loading = false
        })
      },
      setQueryMethod () {
        this.loading = true;
        let searchData = {
          [this.pageNumField]: this.currentPage,
          [this.pageSizeField]: this.currentPageSize,
          [this.sortNameField]: this.sortName,
          [this.sortTypeField]: this.sortType,
          ...this.searchParam
        };
        if (this.dataUrl) {
          return post(this.dataUrl, searchData)
        } else {
          return this.dataUrlFunc(searchData)
        }
      },
      // 每页展示条数改变
      pageSizeChange () {
        this.currentPage = 1;
        this.getTableData();
      },
      // 当前页改变
      currentPageChange () {
        this.getTableData();
      },
      // 某一项 checkbox 触发
      selectChange (selection, row) {
        this.currentSelectTotal = selection.length;
        this.$emit('on-select', selection, row);
      },
      // 全选时触发
      selectALL (selection) {
        this.currentSelectTotal = selection.length;
        this.$emit('on-select-all', selection);
      },
      // 在多选模式下有效，只要选中项发生变化时就会触发
      selectGroupChange (selection) {
        this.currentSelectTotal = selection.length;
        this.$emit('on-selection-change', selection);
      },
      // 表格行单击事件
      rowClick (row, event, column) {
        this.$refs.myTable.toggleRowSelection(row);
        this.$emit('on-row-click', row, event, column);
      },
      // 表格行双击事件
      rowDblClick (row, event) {
        this.$emit('on-row-dblclick', row, event);
      },
      // 排序时生效
      sortChange (column) {
        this.sortName = column.prop === null ? '' : column.prop;
        if (column.order === 'ascending') {
          this.sortType = this.sortTypeAscField;
        } else if (column.order === 'descending') {
          this.sortType = this.sortTypeDescField;
        } else {
          this.sortType = '';
        }
        this.$emit('on-sort-change', this.sortName, this.sortType);
        this.getTableData();
      },
      // 初始化表格高度
      initTableHeight () {
        if (this.height) {
          return this.height
        } else {
          let tableBox = document.getElementsByClassName('pagination-table-wrap');
          if (tableBox.length > 0) {
            let windowHeight = document.documentElement.clientHeight,
                top = this.$refs.tableBox.getBoundingClientRect().top;
            return windowHeight - top - this.verticalResizeOffset;
          }
        }
      },
      // 设置表格高度（在tab切换或者展开、收缩查询条件时都可以调用该方法）
      setTableHeight () {
        this.tableHeight = this.initTableHeight();
        console.log(this.tableHeight);
      }
    }
  }
</script>

<style lang="less">
  @import "../../theme/pagination-table";
</style>
