function TOrderPopupModel() {
    var urlDB = '';
    var nameDB = '';
    var dataBase = null;
    var orderObject = {ordernum: 0,
                       customer:{name:'', phone:'', email:''},
                       goods:[]
                      };
	var lastOrderNum = 0;


    this.init = function (_url, _nameDB) {
        urlDB = _url;
        nameDB = _nameDB;
    };
    this.readDB = function (){

        return $.ajax(urlDB,{
            type:'POST',
            cache:'FALSE',
            data:{
                f:'READ',
                n:nameDB
            },
//            success: getReadData,
            error: ErrorHandler
        })

    };

    this.lockDB = function () {
        return $.ajax(urlDB,{
            type:'POST',
            data:{
                f:'LOCKGET',
                n:nameDB,
                p:123
            },
//            success: this.writeInDB(),
            error: ErrorHandler
        })
    };

    this.writeInDB = function () {
        return $.ajax(urlDB,{
            type:'POST',
            cache:'FALSE',
            data:{
                f:'UPDATE',
                n: nameDB,
                p: 123,
                v: JSON.stringify(dataBase)
            },
            error: ErrorHandler
        })
    };

    this.updateDataBase = function (_data) {
        dataBase = JSON.parse(_data.result);
    };

    function ErrorHandler(jqXHR,StatusStr,ErrorStr)
    {
        alert(StatusStr+' '+ErrorStr);
    }
    
    function calcOrderNum() {
        var orders = dataBase['orders'];
        lastOrderNum = 0;
        for(var i = 0; i < orders.length; i++){
            if(orders[i].ordernum > lastOrderNum){
                lastOrderNum = orders[i].ordernum;
            }
        }
		lastOrderNum ++;
        return lastOrderNum;
    }
    this.compileData = function (_customer, _goods) {
        var newOrder = Object.assign({}, orderObject);
        newOrder.ordernum = calcOrderNum();
        newOrder.customer = _customer;
        newOrder.goods = _goods;
        dataBase.orders.push(newOrder);
        return newOrder;
    }
	this.getOrderNum = function(){
		return lastOrderNum;
	}
}
