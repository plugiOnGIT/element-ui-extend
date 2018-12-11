<template>
  <div>
    <el-row>
      <el-col :span="6">
        <combo-grid
          v-model='searchData.comboGrid1'
          data-fun-name="comboGridQuery"
          id="value"
          size="small"
          :multiple="true"
          text="text">
        </combo-grid>
      </el-col>
      <el-col :span="6">
        <combo-grid
          v-model='searchData.comboGrid2'
          :data-url="API.comboGridUrl()"
          id="value"
          size="small"
          :multiple="true"
          text="text">
        </combo-grid>
      </el-col>
      <el-col :span="6">
        <combo-grid
          v-model='searchData.comboGrid3'
          data-fun-name="comboGridQuery"
          id="value"
          size="small"
          :multiple="false"
          text="text">
        </combo-grid>
      </el-col>
      <el-col :span="6">
        <el-button size="small" @click="search">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <pagination-table
      ref="myTable"
      :data-url-func="API.paginationTableQuery"
      :search-param="searchParam"
    >
      <template slot="tableColumns">
        <el-table-column type="index" width="70"></el-table-column>
        <el-table-column type="selection" width="56"></el-table-column>
        <el-table-column prop="columns1" label="第一列" min-width="180"></el-table-column>
        <el-table-column prop="columns2" sortable="custom" show-overflow-tooltip label="第二列" min-width="220"></el-table-column>
        <el-table-column prop="columns4" show-overflow-tooltip label="第四列" min-width="170"></el-table-column>
      </template>
    </pagination-table>

  </div>
</template>
<script>
  export default {
    name: 'app',
    data() {
      return {
        searchData: {
          comboGrid1: [],
          comboGrid2: [],
          comboGrid3: ''
        },
        // 表格实际查询参数
        searchParam: {}
      }
    },
    methods: {
      search() {
        this.searchParam = JSON.parse(JSON.stringify(this.searchData));
      },
      reset() {
        this.searchParam = {};
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
