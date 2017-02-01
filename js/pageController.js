function TStateController(_model, _view) {

    var urlDB = '';
    var nameDB = '';
    var numView = 6;
    var container = $('#content');
    var leftContainer = $('#leftMenu');
    var filter = null;
    var loadingPopup = null;
    var cartModel = new TCartModel();
    var cartView = new TCartView($('.cartBox'), container, cartModel);
    var currentState = null;
    var opModel = new TOrderPopupModel();
    var opView = new TOrderPopupView(opModel);

    this.init = function (_url, _nameDB) {
        urlDB = _url;
        nameDB = _nameDB;
        loadingPopup = _view.setLoadingPopup(container);
        $.when(_model.readDB())
            .then(function (_data) {
                loadingPopup = _view.removePopup(loadingPopup);

                refreshCart();
                addCartListeners();
                cartModel.init(_model.getUnits());
                SwitchStatePageFromUrl();
            });

        _view.setNumView(numView);
        _view.setParent(container);

        opModel.init(urlDB, nameDB);


        $(window).bind('hashchange', SwitchStatePageFromUrl);
        $(window).bind('storage', refreshCart);
    };

    $('.categoriesBtn').bind('click', function () {
        location.hash = $(this).data('cat') + '&page=1';
    });

    bindLogo();

    function SwitchStatePageFromUrl () {

        currentState = parceHash();
        switch (currentState.state){
            case 'Main':
                createMain();
                break;
            case 'Phones':
            case 'Notebooks':
                createProductList(currentState);
                break;
            case 'Basket':
                $(leftContainer).empty().show();
                renderBasketPage();
                break;
        }

    }
    function createMain (){
        _view.createMainPage(_model.getCategories());
        $('.categoriesItem').bind('click', function () {
            location.hash = $(this).data('state')  + '&page=1';
        });
        $(leftContainer).empty();
    }
    function bindLogo() {
        var logo = $('#logo');
        $(logo).bind('mouseenter', function () {
            var img = $(logo).find('img');
            $(img).attr('src', $(img).data('home'));
        });
        $(logo).bind('mouseleave', function () {
            var img = $(logo).find('img');
            $(img).attr('src', $(img).data('src'));
        });
        $(logo).bind('click', function () {
            location.hash = 'Main';
        });
    }

    function createProductList (_newState) {
        if('page' in _newState) {

            var goods = _model.getDataArray(_newState);

            if(goods.length < numView){
                changeValueOption('page', 1);
            }
            _view.createProductListPage(_newState, goods);
            $('.smallCard').bind('click', function () {
                location.hash = _newState.state + '&id=' + $(this).data('id');
            });
            $('.numPage').bind('click', function () {
                changeValueOption('page', $(this).data('numPage'));
            });
            $('.sortBarBtn').bind('click', function () {
                var curOpt = checkInHash($(this).data('option'));
                if(curOpt){
                    var newVal = (curOpt == 'asc') ? 'desc' : 'asc';
                    changeValueOption($(this).data('option'), newVal);
                }else {
                    toggleOption($(this).data('option'), 'asc');
                }
            });
            // $(leftContainer).show();
            createFilter(leftContainer, _newState.state);
        }
        if('id' in _newState){
            var prodInfo = _model.getProductInfo(_newState);
            _view.createProductPage(prodInfo, _model.getTitles());
            $(leftContainer).empty();
            var orderButton = $('.orderBtn');
            bindButtonEffect(orderButton);
            $(orderButton).bind('click', addItemToCart);
        }
    }
    function bindButtonEffect(_button){
		$(_button).css({'border': 'solid black 1px', 'border-radius':'0.2em', 'box-shadow':'0 0 .2em black', 'cursor':'pointer'});
        _button.bind('mousedown',function () {
            $(this).css('box-shadow', 'inset 0 0 .2em black');
        });
        _button.bind('mouseup',function () {
            $(this).css('box-shadow', '0 0 .2em black');
        });
    }

    function parceHash(){

        var localHash = location.hash.substr(1);

        if(localHash.length == 0){
            return {state: 'Main'};
        }

        var lhArray = localHash.split('&');
        var options = {state: lhArray[0]};

        for(var i = 1; i < lhArray.length; i++ ){
            var opt = lhArray[i].split('=');
            if( !(opt[0] in options)){
                options[opt[0]] = [];
            }
            options[opt[0]].push(opt[1]);
        }

        return options;

    }

    function createFilter(_parent, _state) {

        var array = _model.getDataArray(_state);
        filter = new TFilter(_parent, array, _state);

        $('.filterLabel').bind('click', function (e) {
            e.preventDefault();
            var chb = $(this).find('.filterCheckbox');
            toggleOption($(chb).data('option'), $(chb).data('value'));
        });
        $('.filterListTitle').bind('click', function () {
            $(this).siblings('.filterList').toggle('fast');
            $(this).toggleClass('open close');
        })
    }

    function toggleOption(_option, _value) {

        var localHash = location.hash.substr(1);
        var arr = localHash.split('&');
        var newOption = _option + '=' + _value;
        var position = -1;

        if(arr.length > 0){
            for(var i = 0; i < arr.length; i++){
                if(arr[i] == newOption){
                    position = i;
                }
            }
        }
        if(position == -1){
            location.hash = localHash + '&' + newOption;
        }else{
            arr.splice(position, 1);
            location.hash = arr.join('&');
        }
    }

    function changeValueOption(_option, _newVal) {

        var localHash = location.hash.substr(1);
        var arr = localHash.split('&');

        if(arr.length > 0){
            for(var i = 0; i < arr.length; i++){
                var tmp = arr[i].split('=');
                if(tmp[0] == _option){
                    tmp[1] = _newVal;
                    arr[i] = tmp.join('=');
                }
            }
        }
        location.hash = arr.join('&');
    }

    function checkInHash(_option){

        var localHash = location.hash.substr(1);
        var arr = localHash.split('&');
        if(arr.length <= 1){
            return false;
        }
        for(var i = 0; i < arr.length; i++){
            var tmp = arr[i].split('=');
            if(tmp[0] == _option){
                return tmp[1];
            }
        }
        return false;
    }

    function addItemToCart() {
        cartModel.addItemToCart(currentState.state, _model.getProductInfo(currentState));
        cartView.showAddItemConfirm();
        refreshCart();
    }

    function refreshCart() {
        cartModel.refresh();
        updateCartItemsInfo();
        cartModel.setTitles(_model.getTitles());
        cartView.setItems(cartModel.getItems());
		addCartListeners();
    }

    function updateCartItemsInfo() {
        var items = cartModel.getItems();
        for(var i = 0; i < items.length; i++){
            cartModel.updateItemInfo(items[i].id, _model.getProductInfo({state: items[i].cat, id: items[i].id}));
        }
    }
    function addCartListeners(){
        unbindAll();
        $('.cart.deleteBtn').bind('click', function (_e) {
            _e.stopPropagation();
            cartModel.deleteItem($(this).data('id'));
            refreshCart();
            if(currentState.state == 'Basket'){
                renderBasketPage();
            }
        });
        var cartBox = $('.cartBox');
        cartBox.bind('mouseenter', function () {
            if(currentState.state != 'Basket') {
                cartView.showMiniCartAnimate();
            }
        });
        cartBox.bind('mouseleave', function () {
            cartView.hideMiniCartAnimate();
        });
        var cartSI = $('.cartSmallItem');
		cartSI.bind('mouseenter', cartView.showHoverEffects);
		cartSI.bind('mouseleave', cartView.hideHoverEffects);
        
		var basketBtn = $('.viewBasketBtn');
		bindButtonEffect(basketBtn);
		$(basketBtn).bind('click', goToBasket);
		$('.cartCounter').bind('click', goToBasket);

		$('.nameRef').bind('click', function () {
            location.hash = $(this).data('cat') + '&id=' + $(this).data('id');
            cartView.hideMiniCartAnimate();
        })
    }
    function renderBasketPage() {
        refreshCart();
        cartView.createBasketPage();
        cartView.getTotalSum();
        $('.basket.deleteBtn').bind('click', function () {
            cartModel.deleteItem($(this).data('id'));
            refreshCart();
            renderBasketPage();
        });
        addCartListeners();
        var checkoutBtn = $('.checkoutBtn');
        if(checkoutBtn) {
            bindButtonEffect(checkoutBtn);
            $(checkoutBtn).bind('click',createOrderPopup)
        }
    }
    function goToBasket(){
        cartView.hideMiniCartAnimate();
        location.hash = 'Basket';
    }

    function unbindAll() {
        $('.cart.deleteBtn').unbind();
        $('.cartBox').unbind();
        $('.cartSmallItem').unbind();
        $('.viewBasketBtn').unbind();
        $('.cartCounter').unbind();
        $('.nameRef').unbind();
    }
    function createOrderPopup() {
        var oPop = opView.createForm();
        var sendButton = $('.orderPopupSendBtn');
        bindButtonEffect(sendButton);
        bindPop();
        $(sendButton).bind('click', sendItemsFarFarAway);

        function sendItemsFarFarAway() {
            if(!checkValid()){
                return;
            }

            var customerInfo = {name: $(oPop).find('.nameField').val(),
                                phone:$(oPop).find('.phoneField').val(),
                                email:$(oPop).find('.emailField').val()};
            var goods = cartModel.getItems();
            _view.setLoadingPopup($(oPop).find('.orderForm'));
            
			$.when(opModel.readDB()).then(function(response){
				return(opModel.lockDB());
			}).then(function(response){
				opModel.updateDataBase(response);
				opModel.compileData(customerInfo, goods);
				return (opModel.writeInDB());
			}).then(function(response){
				$(oPop).remove();
                oPop = opView.createOrderInfo(opModel.getOrderNum());
				bindPop();
				setTimeout(function(){
					$(oPop).fadeOut('fast');
					clearBasket();
				}, 5000);
			});

        }
		function bindPop(){
			$(oPop).bind('click', function (_e) {
			    if($(_e.target).hasClass($(oPop).attr('class'))) {
                    $(oPop).remove();
                    if($(_e.currentTarget).hasClass('orderComplete')){
                        clearBasket();
                    }
                }
            });
            $('.orderFormCloseBtn').bind('click', function (_e) {
                 _e.stopPropagation();
                if($(_e.currentTarget).hasClass('orderComplete')){
                    clearBasket();
                }
                $(oPop).remove();
             });
		}
		function clearBasket() {
            cartModel.clearCart();
            refreshCart();
            location.hash = 'Main';
        }
    }
    function checkValid() {
        var checker = true;
        var nameField = $('.nameField');
        var phoneField = $('.phoneField');
        var emailField = $('.emailField');

        if(isEmpty(nameField)){
            checker = false;
        }else {
            var nameVal = $(nameField).val();
            if (!(/[a-zA-Z]{2,}/g.test(nameVal))) {
                $(nameField).parent().find('.error').remove();
                var errorSign = $('<span></span>').addClass('error').text('Only letters. Min 2.');
                $(nameField).parent().append(errorSign);
                checker = false;
            }
        }
        if(isEmpty(phoneField)){
            checker = false;
        }
        var emailVal = $(emailField).val();
        if((emailVal.length != 0) && !(/\w{2,}@+\w{2,}\.\w+/g.test(emailVal))){
            $(emailField).parent().find('.error').remove();
            var errorEmail = $('<span></span>').addClass('error').text('Wrong format.');
            $(emailField).parent().append(errorEmail);
            checker = false;
        }


        function isEmpty(_field) {
            $(_field).parent().find('.error').remove();
            if($(_field).val().length == 0){
                var errorSign = $('<span></span>').addClass('emptyField error').text('This field is required.');
                $(_field).parent().append(errorSign);
                return true
            }
            return false
        }

        return checker;
    }


}
