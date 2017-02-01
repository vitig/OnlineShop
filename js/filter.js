/*************************************************************/

function TFilter(_container, _data, _state){

    var filterPhonesData = {brandName:{values:[], title:'Brand name', option:'brandName'},
        screenSize:{values:[], title:'Screen size', unit:'"', option:'screenSize'},
        resolution:{values:[], title:'Resolutions', option:'resolution'},
        ddr:{values:[], title:'DDR', unit:'Gb', option:'ddr'},
        memory:{values:[], title:'Memory', unit:'Gb', option:'memory'}};

    var filterNotebooksData = {brandName:{values:[], title:'Brand name', option:'brandName'},
        screenSize:{values:[], title:'Screen size', unit:'"', option:'screenSize'},
        ddr:{values:[], title:'DDR', unit:'Gb', option:'ddr'},
        hdd:{values:[], title:'HDD', unit:'Gb', option:'hdd'},
        cpu:{values:[], title:'Processor', option:'cpu'}};

    var filterData = null;
    switch(_state){
        case 'Phones':
            filterData = filterPhonesData;
            break;
        case  'Notebooks':
            filterData = filterNotebooksData;
            break;
    }

    for(var i = 0; i < _data.length; i++) {
        for (key in _data[i]) {
            if(key in filterData) {
                createArrayEls(_data[i][key], filterData[key]['values']);
            }
        }
    }

    for(Key in filterData){
        filterData[Key]['values'].sort(SortData);
    }

    $(_container).empty().append(createForm(filterData));
    // $('.filter').accordion({'header':'.filterListTitle', 'heightStyle':'content', 'collapsible': 'true'});

    function SortData(a, b) {
        if(a == b){
            return 0;
        }
        return (a < b)? -1 : 1;
    }

    function createArrayEls(_el, _array) {
        if(_array.length == 0){
            _array.push(_el);
        }else{
            var checker = true;
            for(var i = 0; i < _array.length; i++){
                if(_el == _array[i]){
                    checker = false;
                }
            }
            if(checker){
                _array.push(_el);
            }
        }
    }

    function createForm(_filterOptions) {

        var wrapper = $('<div></div>').addClass('filter');

        for(key in _filterOptions){
            $(wrapper).append(createList(_filterOptions[key]));
        }

        return wrapper;
    }
    function createList(_item) {

        var div = $('<div></div>').addClass('filterItem');
        var title = $('<span></span>').addClass('filterListTitle open').text(_item.title);
        var list = $('<ul></ul>').addClass('filterList');

        for(var i = 0; i < _item.values.length; i++){
            var li = $('<li></li>').addClass('filterLI');
            var label = $('<label></label>').addClass('filterLabel');
            var checkbox = $('<input type="checkbox">').addClass('filterCheckbox').attr({'data-value': _item.values[i], 'data-option':_item.option});
            if(checkInHash($(checkbox).data('option'), $(checkbox).data('value'))){
                $(checkbox).attr('checked', 'checked');
            }
            var elText = $('<span></span>').addClass('filterElementText');
            var str = '' + _item.values[i];
            if('unit' in _item){
                str += ' ' + _item.unit;
            }

            $(elText).text(str);
            $(label).append(checkbox, elText);
            $(li).append(label);
            $(list).append(li);
        }

        $(div).append(title, list);

        return div;

    }

    function checkInHash(_option, _value){

        var localHash = location.hash.substr(1);
        var arr = localHash.split('&');
        if(arr.length <= 1){
            return false;
        }
        var newOption = _option + '=' + _value;

        for(var i = 0; i < arr.length; i++){
            if(arr[i] == newOption){
                return true;
            }
        }
        return false;
    }
}