var select_value2 = function(select_obj){
    var selected_index = select_obj.selectedIndex;
    var selected_value = select_obj.options[selected_index].value;
    var array = selected_value.split(',');
    var location = array[0];
    var resId = array[1];
    var now = new Date();

    var today = new Date(now.setDate(now.getDate() - 2));
    var year = today.getFullYear();
    var month1 = ('0'+(today.getMonth()+1)).slice(-2);
    var day = ('0'+today.getDate()).slice(-2);
    var dayString = String(year+month1+day);


    var now = new Date();

    today = new Date(now.setDate(now.getDate() - 8));
    year = today.getFullYear();
    var month2 = ('0'+(today.getMonth()+1)).slice(-2);
    day = ('0'+today.getDate()).slice(-2);

    var dayString2 = String(year+month2+day);

    var lastDate = new Date(year, month2, 0);
    var lastDays = ('0'+lastDate.getDate()).slice(-2);
    var count = 7;
    if(month1 != month2){
    count = lastDays - day + 1;
    }

    const getJSON = function(url,callback){
        const xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);
        xhr.responseType = 'json';
        xhr.onload = function(){
            const status = xhr.status;
            if(status === 200){
                callback(null,xhr.response);
            } else {
                callback(status,xhr.response);
            }
        };
        xhr.send();
    };
    getJSON(`https://ru066cuwv0.execute-api.ap-northeast-2.amazonaws.com/rqwthrpm/requestforecast?loc=${resId}&startday=${dayString}&endday=${dayString2}&count=${count}`,
    function(err,data) {
        if(err!==null){
            alert('오류발생'+err);
        } else{
            loadPM(data);
        }
    });

    function loadPM(data){
        let pm = document.getElementById('pm');
        document.getElementById('pm').style.marginTop = '50px';
        document.getElementById('pm').style.marginLeft = '110px';
        document.getElementById('pm').style.fontSize = '1.6em';
        pm.innerHTML = '';
        pm.innerHTML += "내일의 "+location+"국립공원의 미세먼지 예측값 : "+data.body;
        var image;
        if (data.body == "좋음"){
            image = './Good.jpg';
        }else if(data.body == "보통"){
            image = './Medium.jpg';
        }else if(data.body == "나쁨"){
            image = './Bad.jpg';
        }else{
            image = './VeryBad.jpg';
        }
        document.getElementById('image').src=image;

    }

}
