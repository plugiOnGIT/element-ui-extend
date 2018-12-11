const formatter = {
  // 金额格式化
  moneyFormat (cellValue) {
    let html = '';
    if (!cellValue) {
      cellValue = 0
    }
    html = this.numberToMoney(cellValue);
    return html
  },
  // 日期格式化
  dateFormat (date, fmt) {
    if (date === '') {
      return null
    }
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  // 数字转化为金额
  numberToMoney (s) {
    if (isNaN(s) && !(typeof s === 'string')) {
      return s
    }
    s = '' + s;
    s = s.replace(/,/g, '');
    s = (s + '').split('.');
    let l = s[0].split('').reverse();
    let r = s[1];
    if (r) {
      if (r.length === 1) {
        r = '.' + r + '0'
      } else if (r.length === 2) {
        r = '.' + r
      } else {
        r = '.' + r.substr(0, 2)
      }
    } else {
      r = '.00'
    }
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length && l[(i + 1)] !== '-' ? ',' : '')
    }
    return t.split('').reverse().join('') + r
  }
};

export default formatter;
