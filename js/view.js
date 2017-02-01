function TView() {

    var numView = 0;
    var wrapper = null;

    this.setNumView = function (_num) {
        numView = _num;
    };

    this.setParent = function (_obj) {
        wrapper = _obj;
    };

    this.createMainPage = function (_cats) {
        $(wrapper).empty();

        for(var i = 0; i < _cats.length; i++){
            createCat(_cats[i]);
        }

        function createCat(_name) {
            var wrap = $('<div></div>').addClass('categoriesItem tile').data('state', _name);
            var imgContainer = $('<div></div>').addClass('catImgCont');
            var image = $('<img>').addClass('catImage').attr('src', 'img/' + _name + '.png');
            var title = $('<span></span>').addClass('catTitle').text(_name);
            $(imgContainer).append(image);
            $(wrap).append(imgContainer, title);
            $(wrapper).append(wrap);
        }

    };
/********************************************************************/
    this.createProductListPage = function ( _newState, _data) {
        $(wrapper).empty().append(createSortBar(_newState['order']));
        var startElem = numView * (_newState['page'] - 1);
        var endElem = numView * _newState['page'];

        if(endElem > _data.length){
            endElem = _data.length;
        }

        for(var i = startElem; i < endElem; i++) {

            var e = createSmallItemCard(wrapper, _data[i]);
            $(wrapper).append(e);
        }
        createPagination(_data, _newState['page']);
    };

    function createSmallItemCard(parent, _data) {

        var div = $('<div></div>').addClass('smallCard tile');
        var imgCont = $('<div></div>').addClass('imgContainer');
        var description = $('<div></div>').addClass('shortDescr');

        var src = '';
        if(!_data['image']){
            src = 'img/no-image.png'
        }else{
            src = _data['image'];
        }
        var img = $('<img>').addClass('smallImage').attr('src', src).hide();

        $(img).bind('load', function () {
            if($(img).width() > $(img).height()){
                $(img).css('width', '100%');
            }else{
                $(img).css('height', '100%');
            }
            // $(img).css({'left':'50%', 'top':'50%', 'transform':'translateX(-50%) translateY(50%)'}).show();
            $(img).show();
        });

        $(imgCont).append(img);

        var mName = $('<span class="modelName"></span>').text(_data.brandName + ' ' + _data.model);
        var price = $('<span class="price"></span>').text('Price: ' + _data.price + ' BYN');

        $(description).append(mName, price);
        $(div).append(imgCont, description).data('id', _data.id);

        $(parent).append(div);

    }

    function createPagination (_data, _currentPage){

        var numPages = Math.ceil(_data.length / numView);
        if (numPages == 1){
            return;
        }

        var ul = $('<ul class = "pagination"></ul>');
        for(var i = 1; i <= numPages; i++){
            var li = $('<li class="numPage"></li>').text(i);
            $(li).data('numPage', i);

            if(i == _currentPage){
                $(li).addClass('currentPage');
            }

            $(ul).append(li);
        }
        $(wrapper).append(ul);

    }

    function createSortBar(_sortState) {
        var div = $('<div></div>').addClass('sortBar');
        var span = $('<span></span>').addClass('sortBarBtn').data('option','order').text('Sort by price');
        if(!_sortState){
            $(span).addClass('idle');
        }else {
            switch (_sortState[0]) {
                case 'asc':
                    $(span).addClass('sortAsc');
                    break;
                case 'desc':
                    $(span).addClass('sortDesc');
                    break;
            }
        }
        $(div).append(span);
        return div;
    }
/*************************************************************************************/
    this.createProductPage = function (_item, _titles) {

        $(wrapper).empty();
        var div = $('<div></div>').addClass('itemDetailsPage');
        var imgCont = $('<div></div>').addClass('bigImageContainer');

        var src = '';
        if(!_item['image']){
            src = 'img/no-image.png'
        }else{
            src = _item['image'];
        }
        var img = $('<img>').addClass('bigImage').attr('src',src).hide();
        $(img).bind('load', function () {
            if($(img).width() > $(img).height()){
                $(img).css('width', '100%');
            }else{
                $(img).css('height', '100%');
            }
            $(img).show();
        });

        $(imgCont).append(img);

        var Table = $('<table></table>').addClass('productInfoTable');
        for(K in _item){
            if(K in _titles) {
                var tr = $('<tr></tr>');
                var parName = $('<td></td>').addClass('parName').text(_titles[K]);
                var parValue = $('<td></td>').addClass('parValue').text(_item[K]);
                $(tr).append(parName, parValue);
                $(Table).append(tr);
            }
        }

        var btnBox = $('<div></div>').addClass('priceOrderBox');
        var price = $('<span></span>').addClass('priceBig').text(_item['price'] + ' BYN');
        var orderBtn = $('<div></div>').addClass('orderBtn').data('id', _item['id']).text('Add to basket');
        $(btnBox).append(price, orderBtn);
        $(div).append(imgCont, btnBox, Table);
        $(wrapper).append(div);

    };
    /****************************************************************************************/
    this.setLoadingPopup = function (_parent) {
        var popup = $('<div></div>').addClass('loadingPopUp');
        var popupImage = $('<img>').addClass('loadingPopUpImage').attr('src','img/loading.gif');
        $(popup).append(popupImage);
        $(_parent).append(popup);
        return popup;
    };
    
    this.removePopup = function (_popup) {
        $(_popup).remove();
        return null;
    }
}
