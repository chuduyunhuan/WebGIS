/**
 * ES6练习
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-12-09 09:56:51
 * @version $Id$
 */
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var AJAX = {
  hotSpots: ['迪士尼', '世卫大会', 'MWC'],
  dataCol: [],
  init: function init() {
    AJAX.hotSpots.map(function (val) {
      var url = 'http://10.221.247.7:8080/services/ws/fast_query/area/re/re_cellByHotname?hotspot=' + encodeURIComponent(val);
      var jqDeferred = AJAX.ajaxCall({ url: url });
      jqDeferred.then(function (response) {
        AJAX.dataCol.push(response);
      }).then(function () {
        console.log(AJAX.dataCol);
      });
    });
  },
  ajaxCall: function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(obj) {
      var url, type, data, dataType, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = obj.url;
              type = obj.type || 'get';
              data = obj.data;
              dataType = obj.dataType || 'json';
              _context.next = 6;
              return $.ajax({
                url: url,
                type: type,
                dataType: dataType,
                data: data
              });

            case 6:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function ajaxCall(_x) {
      return _ref.apply(this, arguments);
    }

    return ajaxCall;
  }()
};
AJAX.init();
