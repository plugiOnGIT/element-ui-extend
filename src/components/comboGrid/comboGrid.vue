<template>
  <div class="combo-grid-wrap" ref="comboGrid">
    <el-select
      v-model="val"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :collapse-tags="multiple"
      prefix="combo-grid-prefix"
      :remote="filterable"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :loading="loading"
      @clear="clear"
      @change="onChange"
      :size="size"
      popper-class="combo-grid-list"
      @visible-change="visibleChange">
      <el-option
        v-for="item in listData"
        :disabled="item.disabled"
        :class="{'no-data': item.type === 'c'}"
        :key="item[id]"
        :label="item[text]"
        :value="item[id]">
        <span class="combo-grid-checkbox"></span>
        <span style="padding-left: 10px">{{item[text]}}</span>
      </el-option>
      <div class="cg-pagination" v-show="pageShow">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="pageChange"
          :current-page.sync="currentPage"
          :small="true"
          :background="true"
          :pager-count="5"
        >
        </el-pagination>
      </div>
    </el-select>
  </div>
</template>
<script>
  import {post} from '../../utils/http'
  import Emitter from 'element-ui/src/mixins/emitter'

  export default {
    name: "combo-grid",
    mixins: [Emitter],
    props: {
      placeholder: {
        default: '请选择'
      },
      searchParam: {
        default() {
          return {}
        }
      },
      size: {
        default: 'small'
      },
      multiple: {
        default: false
      },
      filterable: {
        default: true
      },
      dataUrl: {
        default: ''
      },
      dataUrlFunc: {
        type: Function,
        default() {
          return null
        }
      },
      pageSize: {
        default: 6
      },
      id: {
        default: 'urid'
      },
      text: {
        default: 'name'
      },
      selectValue: {
        default: ''
      },
      showField: {
        default: this.multiple ? [] : ''
      },
      filterField: {
        default: ''
      },
      disabled: {
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        val: '',
        listData: [],
        currentPage: 1,
        total: 0,
        checkedData: [],
        loading: false,
        query: '',
        inputNode: null,
        originalValue: null,
        originalObj: {},
        showFld: this.multiple ? [] : '',
        pageShow: true
      }
    },
    model: {
      prop: 'selectValue',
      event: 'change'
    },
    computed: {
      selectVal() {
        return this.selectValue;
      }
    },
    mounted() {
      this.getListData();
    },
    watch: {
      dataUrl(val) {
        if (val) {
          this.getListData();
        }
      },
      showField: {
        immediate: true,
        handler(val) {
          this.showFld = val;
          if (val === '' || (val instanceof Array && val.length === 0)) {
            this.val = this.multiple ? [] : '';
          }
        }
      },
      selectVal: {
        immediate: true,
        handler(val) {
          if (val === '' || val === []) {
            this.val = this.multiple ? [] : ''
          }
          if ((this.showFld !== '' && this.multiple === false) || (this.showFld.length !== 0 && this.multiple === true)) {
            this.val = this.showFld;
            this.originalValue = val;
            if (this.multiple === true) {
              this.showFld.map((item, index) => {
                this.originalObj[item] = this.originalValue[index];
              })
            }
          }
        }
      },
      val: {
        immediate: true,
        handler(val) {
          if ((this.showFld === '' && this.multiple === false) || (this.showFld.length === 0 && this.multiple === true) || this.originalValue === null) {
            if (this.multiple === false) {
              let selectedRow = {};
              let selectedShowText = '';
              this.listData.forEach(item => {
                if (item[this.id] === this.val) {
                  selectedRow = item;
                  selectedShowText = item[this.text];
                }
              });
              this.$emit('change', val, selectedShowText, selectedRow);
              this.dispatch('ElFormItem', 'el.form.change', val);
            } else {
              let finalVal = val.map((item) => {
                if (this.originalObj[item]) {
                  return this.originalObj[item]
                } else {
                  return item
                }
              });
              this.$emit('change', finalVal);
              this.dispatch('ElFormItem', 'el.form.change', val);
            }
          }
          this.showFld = this.multiple ? [] : ''
        }
      }
    },
    methods: {
      clear() {
        this.originalValue = null;
      },
      setQueryMethod(param) {
        if (this.dataUrl) {
          return post(this.dataUrl, {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            ...this.searchParam,
            ...param
          });
        } else if (this.dataUrlFunc) {
          return this.dataUrlFunc({
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            ...this.searchParam,
            ...param
          });
        }
      },
      getListData(param) {
        if (!this.dataUrl && !this.dataUrlFunc) {
          return;
        }
        this.loading = true;
        this.setQueryMethod(param).then(res => {
          if (res.code === '0') {
            this.loading = false;
            this.listData = res.rows;
            this.total = res.total;
            if (res.rows.length > 0) {
              this.pageShow = true;
              if (this.originalValue !== null && this.multiple === false) {
                let len = res.rows.length;
                let select = this.originalValue;
                for (let i = 0; i < len; i++) {
                  if (select === res.rows[i][this.id]) {
                    this.val = this.originalValue;
                    this.originalValue = null;
                  }
                }
              } else if (this.originalValue !== null && this.multiple === true) {
                let valCopy = this.val.concat();
                let select = this.originalValue;
                for (let i = 0, len = res.rows.length; i < len; i++) {
                  for (let j = 0, ilen = select.length; j < ilen; j++) {
                    if (select[j] === res.rows[i][this.id]) {
                      valCopy[j] = this.originalValue[j];
                      this.originalValue.splice(j, 1, '');
                    }
                  }
                }
                this.val = valCopy
              }
            } else {
              this.pageShow = false
              // ivew 的选择组件再开启远程搜索的时候在第一次加载的时候
              // 如果没数据不会出现下拉框
              this.listData = [
                {
                  [this.text]: '无数据',
                  [this.id]: '-1',
                  disabled: true,
                  type: 'c'
                }
              ]
            }
          }
        })
      },
      pageChange(page) {
        this.currentPage = page;
        this.getListData();
      },
      remoteMethod(query) {
        this.query = query;
        if (query !== '') {
          this.currentPage = 1;
          let param = {};
          if (this.filterField) {
            param[this.filterField] = query
          } else {
            param[this.text] = query
          }
          this.getListData(param)
        } else if (query === '') {
          this.getListData();
        }
      },
      visibleChange(state) {
        if (state) {
          this.currentPage = 1;
          this.getListData();
        }
      },
      onChange() {
        this.$emit('on-change', this.val);
      }
    }
  }
</script>
<style lang="less">
  @import "../../theme/combo-grid";
</style>
