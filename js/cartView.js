function TCartView(_miniCartParent, _basketParent, _model) {
/****************** Mini Cart Block ***********************************************************/
    var container = _miniCartParent;
    var div = $('<div></div>');
    var span = $('<span></span>');
    var items = [];

    var miniCart = $(div).clone().addClass('miniCart');
    var infoBar = $(div).clone().addClass('miniCartInfoPanel');
    var ibTextContainer = $(div).clone().addClass('textPanel ibContainer');
    var ibBtnContainer = $(div).clone().addClass('btnPanel ibContainer');

    var totalText = $(span).clone().addClass('totalText').text('Total: ');
    var totalSum = $(span).clone().addClass('mCart totalSum');
    $(totalText).append(totalSum);
    $(ibTextContainer).append(totalText);

    var viewBasketBtn = $(span).clone().addClass('viewBasketBtn').text('View Basket');
    $(ibBtnContainer).append(viewBasketBtn);
    var itemsContainer = $(div).clone();

    $(infoBar).append(ibTextContainer, ibBtnContainer);

    $(miniCart).append(infoBar, itemsContainer).hide();
    $(container).append(miniCart);

    var confirmWindow = $(div).clone().addClass('miniCartConfirmWindow');
    var confirmText = $(span).clone().addClass('miniCartConfirmText').text('Item added to basket');

    $(confirmWindow).append(confirmText).hide();
    $(container).append(confirmWindow);


    this.setItems = function (_items) {
        items = _items;
        changeNumberItems();
        this.getTotalSum();

        $(itemsContainer).empty();
        for (var i = 0; i < items.length; i++) {
            $(itemsContainer).append(createSmallItem(_model.getItemInfo(items[i].id), items[i].qty));
        }
		if(items.length == 0){
			this.hideMiniCartAnimate();
		}
    };

    function changeNumberItems() {
        var str = 'ITEMS';
        var sum = 0;
        if (items.length > 0) {
            for(var i = 0; i< items.length; i++){
                sum += parseInt(items[i].qty);
            }
            if (sum == 1) {
                str = str.slice(0, -1);
            }
        }
        $(container).find('.cartCounter').text(sum + ' ' + str);
    }

    this.getTotalSum = function () {
        var sum = 0;
        for(var i = 0; i < items.length; i++){
            sum += (_model.getItemInfo(items[i].id)['price'] * items[i].qty);
        }
        $('.totalSum').text(sum + ' BYN');
    };

    function createSmallItem(_itemInfo, _qty){
        var thisItem = getOneItem(_itemInfo.id);
        var titles = _model.getTitles();
        var exceptions = {brandName:'', model:''};

        var el = $(div).clone().addClass('cartSmallItem');
		var deleteBtn = $(span).clone().addClass('cart deleteBtn').data('id', _itemInfo.id);
        var image = $('<img>').attr('src', _itemInfo.image).addClass('miniCartSmallImage');
        var refItem = $(span).clone().addClass('mCart nameRef').text(_itemInfo.brandName + ' ' + _itemInfo.model).data({'cat': thisItem.cat, 'id':thisItem.id});
        var descr = $(div).clone().addClass('miniCartDescription');
        var str = '';
        for(k in titles){
            if(k in _itemInfo){
                if(!(k in exceptions)) {
                    str += _itemInfo[k] + '/';
                }
            }
        }
        str = str.slice(0, -1);
        $(descr).text(str);

        var priceItem = $(span).clone().addClass('miniCartPrice').text((_itemInfo.price * _qty) + ' BYN');
        var qtyNum = $(span).clone().addClass('miniCartItemQty').text(' Qty: ' + _qty);


        $(el).append(deleteBtn, image, refItem, '<br>',descr, priceItem, qtyNum);
        return el;
    }

    this.showMiniCartAnimate = function () {
        if(items.length > 0) {
            $(miniCart).fadeIn(100);
        }
    };
    this.hideMiniCartAnimate = function () {
        $(miniCart).fadeOut(100);
    };
	this.showHoverEffects = function(){
		$(this).css('background-color','lightgrey');		
	};
	this.hideHoverEffects = function(){
		$(this).css('background-color','white');	
	};
	this.showAddItemConfirm = function () {
        $(confirmWindow).fadeIn('slow');
        setTimeout(function () {
            $(confirmWindow).fadeOut('slow');
        }, 1000);
    };

    function getOneItem(_id) {
        for(var i = 0; i < items.length; i++){
            if(items[i].id == _id){
                return items[i];
            }
        }
    }

    /************************************ Basket block ***********************************************/

    this.createBasketPage = function () {

        $(_basketParent).empty();
        if(items.length == 0){
            var noItemsInfo = $('<span></span>').addClass('basketNoItemsInfo').text('There are no items in your basket.');
            $(_basketParent).append(noItemsInfo);
        }else {
            for (var i = 0; i < items.length; i++) {
                var itemInfo = _model.getItemInfo(items[i].id);
                $(_basketParent).append(createBasketItem(itemInfo, items[i].qty));
            }
            var checkoutWrapper = $('<div></div>').addClass('checkoutWrapper');
            var totalSum = $(span).clone().addClass('basket totalSum');
            var checkoutBtn = $('<span></span>').addClass('checkoutBtn').text('Checkout');
            $(checkoutWrapper).append('Total: ', totalSum,checkoutBtn);
            $(_basketParent).append(checkoutWrapper);
        }
    };

    function createBasketItem(_itemInfo, _qty) {
        var thisItem = getOneItem(_itemInfo.id);
        var titles = _model.getTitles();
        var exceptions = {brandName:'', model:''};

        var el = $(div).clone().addClass('basketItemContainer');
        var deleteBtn = $(span).clone().addClass('basket deleteBtn').data('id', _itemInfo.id);
        var imageContainer = $(div).clone().addClass('basketItemImageContainer');
        var image = $('<img>').attr('src', _itemInfo.image).addClass('basketItemImage');

        $(imageContainer).append(image);
        $(image).bind('load', function () {
            if($(image).width() > $(image).height()){
                $(image).css('width', '100%');
            }else{
                $(image).css('height', '100%');
            }
            $(image).show();
        });
        var refItem = $(span).clone().addClass('basketItem nameRef').text(_itemInfo.brandName + ' ' + _itemInfo.model).data({'cat': thisItem.cat, 'id':thisItem.id});
        var descr = $(div).clone().addClass('basketItemDescription');
        var str = '';
        var units = _model.getUnits();
        for(k in titles){
            if(k in _itemInfo){
                if(!(k in exceptions)) {
                    str += titles[k] + ':' + _itemInfo[k];
                    if(k in units){
                        str += ' ' + units[k] + '<br/>';
                    }else{
                        str += '<br/>';
                    }
                }
            }
        }
        str = str.slice(0, -1);
        $(descr).html(str);
        var qtyNum = $(div).clone().addClass('basketItemQty').text(' Qty: ' + _qty);
        var priceItem = $(div).clone().addClass('basketItemPrice').text((_itemInfo.price * _qty) + ' BYN');

        $(el).append(deleteBtn, imageContainer, refItem, '<br>',descr, priceItem, qtyNum);
        return el;
    }

}
