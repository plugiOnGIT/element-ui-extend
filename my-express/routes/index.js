var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
})
  .post('/comboGrid.do', function (req, res, next) {
    let param = req.body,
      pageSize = Number(param.pageSize),
      pageNum = Number(param.pageNum),
      rows = [],
      totalLength = 200;
    for (let i = 0; i < pageSize; i++) {
      let currentRowId = i + pageSize * (pageNum - 1) + 1;
      if (currentRowId > totalLength) {
        break;
      }
      rows.push({
        value: currentRowId,
        text: `combo-grid测试数据${currentRowId}`
      })
    }
    res.send({
      code: '0',
      rows,
      total: totalLength
    });
  })
  .post('/paginationTable.do', function (req, res, next) {
    let param = req.body,
      pageSize = Number(param.pageSize),
      pageNum = Number(param.pageNum),
      rows = [],
      totalLength = 168;
    for (let i = 0; i < pageSize; i++) {
      let currentRowId = i + pageSize * (pageNum - 1) + 1;
      if (currentRowId > totalLength) {
        break;
      }
      rows.push({
        urid: currentRowId,
        columns1: `分页表格测试数据——第一列——${currentRowId}`,
        columns2: `分页表格测试数据——第二列——${currentRowId}`,
        columns3: `分页表格测试数据——第三列——${currentRowId}`,
        columns4: `分页表格测试数据——第四列——${currentRowId}`
      })
    }
    res.send({
      code: '0',
      rows,
      total: totalLength
    })
  });

module.exports = router;
