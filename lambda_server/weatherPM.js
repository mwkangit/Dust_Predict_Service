
exports.handler = async (event) => {
    // TODO implement
    
    
    
    var loc = event.params.querystring.loc;
    var startDate = event.params.querystring.startday;
    var endDate= event.params.querystring.endday;
    var count = Number(event.params.querystring.count);
    

    var startMonth = Number(startDate.substring(4, 2));
    var endMonth = Number(endDate.substring(4, 2));
    
    var request = require('request');

    
    var url = 'http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=g9wzu3wZlzaVPxmJrNz6dci2a%2FCEXt91Xpvk4uEQ%2BQvEpDEs8CvQcICWDZg4R3YIQx0vf%2FEEjOPD0grnTOB3cw%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('7'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
    queryParams += '&' + encodeURIComponent('dataCd') + '=' + encodeURIComponent('ASOS'); /* */
    queryParams += '&' + encodeURIComponent('dateCd') + '=' + encodeURIComponent('DAY'); /* */
    queryParams += '&' + encodeURIComponent('startDt') + '=' + encodeURIComponent(endDate); /* */
    queryParams += '&' + encodeURIComponent('endDt') + '=' + encodeURIComponent(startDate); /* */
    queryParams += '&' + encodeURIComponent('stnIds') + '=' + encodeURIComponent(loc); /* */

    var request = require('sync-request');

    var res = request('GET', url + queryParams);
    var parseJson = JSON.parse(res.getBody());
    
    var avgTa =[]
    var sumRn = [];
    var avgWs = [];
    var avgTd = [];
    var avgRhm = [];
    var avgPa = [];
    var avgPs = [];
    var avgTca = [];
    var avgLmac = [];
    var month = [];

    for(var i = 0 ; i < 7 ; i++){
      var subItem = parseJson.response.body.items.item[i];

      avgTa[i] = subItem.avgTa;
      sumRn[i] = subItem.sumRn;
      avgWs[i] = subItem.avgWs;
      avgTd[i] = subItem.avgTd;
      avgRhm[i] = subItem.avgRhm;
      avgPa[i] = subItem.avgPa;
      avgPs[i] = subItem.avgPs;
      avgTca[i] = subItem.avgTca;
      avgLmac[i] = subItem.avgLmac;
      if(i + 1 > count){
        month[i] = String(endMonth);
      } else{
        month[i] = String(startMonth);
      }

    }
    
    const modelInput = {"평균기온" : avgTa, "일강수량" : sumRn, "평균풍속" : avgWs, "평균이슬점온도" : avgTd, "평균상대습도" : avgRhm, "평균현지기압" : avgPa, "평균해면기압" : avgPs, "평균전운량" : avgTca, "평균중하층운량" : avgLmac, "월" : month};
    
    
    var headers = {
      'content-type':'application/json',
    
    };
    
    const request2 = require('sync-request');

    var res = request2('POST',
    'http://117.16.137.115:3000/PM', {
      headers: headers,
      json:modelInput
    });
    var resBody = JSON.parse(res.getBody('utf8'));
    
    var result = resBody.result;
    
    const response = {
      "statusCode": 200,
      "headers":{"Access-Control-Allow-Origin":"*"},
      "body": result
    };
    return response;
  
  
};

