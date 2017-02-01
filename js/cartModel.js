function TCartModel() {

    var cartName = 'myCart';
    var cartItems = [];
    var item = {cat:'', id:'', qty:1};
    var itemsInfo = {};
    var titles = {};
    var units = null;

    this.init = function (_units) {
        units = _units;
    };

    this.addItemToCart = function (_cat, _product) {
        var pos = -1;
        for(var i = 0; i < cartItems.length; i++){
            if(cartItems[i].id == _product['id']){
                cartItems[i].qty ++;
                pos = i;
            }
        }

        if(-1 == pos){
            var el = Object.assign({}, item);
            el.cat = _cat;
            el.id = _product.id;
            cartItems.push(el);
            itemsInfo[_product.id] = _product;
        }

        writeInLocalHash();
    };

    this.deleteItem = function (_id) {
        for(var i = 0; i < cartItems.length; i++){
            if(cartItems[i].id == _id){
                cartItems.splice(i, 1);
                writeInLocalHash();
                this.refresh();
                return;
            }
        }
    };

    this.refresh = function () {
        var storageArray = localStorage.getItem(cartName);
        if((!storageArray) || (storageArray == '')){
            cartItems =[];
        }else{
            storageArray = localStorage.getItem(cartName).split(',');
            cartItems = [];
            for(var j = 0; j < storageArray.length; j++){
                cartItems.push(parceRow(storageArray[j]));
            }
        }
    };

    this.clearCart = function () {
        localStorage.removeItem(cartName);
    };

    this.getItems = function () {
        return cartItems;
    };

    function parceRow(_row) {
        var el = Object.assign({}, item);
        var tmpArr = _row.split('&');
        el.cat = tmpArr[0];
        el.id = tmpArr[1];
        el.qty = +tmpArr[2];
        return el;
    }
    function stringifyItem(_item){
        var str = '';
        for(k in _item){
            str += _item[k] + '&';
        }
        str = str.slice(0, -1);
        return str;
    }
    this.updateItemInfo = function (_id, _info ) {
        itemsInfo[_id] = _info;
    };

    this.getItemInfo = function (_id) {
        return itemsInfo[_id];
    };
    this.setTitles = function (_titles) {
        titles = _titles;
    };
    this.getTitles = function () {
        return titles;
    };
    this.getUnits = function () {
        return units;
    };

    function writeInLocalHash() {
        var storageArray = [];

        for(var j = 0; j < cartItems.length; j++){
            storageArray.push(stringifyItem(cartItems[j]));
        }

        localStorage.setItem(cartName, storageArray);
    }
}