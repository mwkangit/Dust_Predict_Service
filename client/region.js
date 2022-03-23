function select_value(select_obj){
    var selected_index = select_obj.selectedIndex;
    var selected_value = select_obj.options[selected_index].value;
    var city1 = 'seoul';
    var city2 = 'daegu';
    var city3 = 'daejeon';
    var city4 = 'busan';
    var city5 = 'gwangju';
    var city6 = 'chuncheon';
    var city7 = 'gangneung';
    var city8 = 'jeju city';


    var API_KEY = '1ffaa33a3e5c89370422112722775663';
    var city = selected_value;
    if (city == city1){
        url(city,API_KEY);
    }
    if (city == city2){
        url(city,API_KEY);
    }
    if (city == city3){
        url(city,API_KEY);
    }
    if (city == city4){
        url(city,API_KEY);
    }
    if (city == city5){
        url(city,API_KEY);
    }
    if (city == city6){
        url(city,API_KEY);
    }
    if (city == city7){
        url(city,API_KEY);
    }
    if (city == city8){
        url(city,API_KEY);
    }
}