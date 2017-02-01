function TModel(_url, _nameDB) {

    var urlDB = _url;
    var nameDB = _nameDB;
    var base = null;



    this.readDB = function(){

        return $.ajax(urlDB,{
            type:'POST',
            cache:'FALSE',
            data:{
                f:'READ',
                n:nameDB
            },
            success: getReadData,
            error: ErrorHandler
        })

    };

    function getReadData(_data) {
        base = JSON.parse(_data.result);
    }

    this.getDataArray = function (_filter) {

        if(typeof _filter == 'string'){
            return base[_filter];
        }
        var array = base[_filter.state];
        var resultArray = [];

        var numChecker = 0;
        for(k in _filter){
            if(k in array[0]){
                numChecker++;
            }
        }

        for(var i = 0; i < array.length; i++){
            var checker = 0;
            for(k in array[i]){
                if(k in _filter){
                    for(var j = 0; j < _filter[k].length; j++){
                        if(array[i][k] == _filter[k][j]){
                            checker++;
                        }
                    }
                }
            }
            if(numChecker == checker){
                resultArray.push(array[i]);
            }
        }
        if('order' in _filter){
            switch (_filter['order'][0]){
                case 'asc':
                    resultArray.sort(sortByAsc);
                    break;
                case 'desc':
                    resultArray.sort(sortByDesc);
                    break;
            }
        }

        return resultArray;
    };

    this.getProductInfo = function (_filter) {
        var array = base[_filter.state];
        for(var i = 0; i < array.length; i++){
            if (array[i]['id'] == _filter.id){
                return array[i];
            }
        }
    };
    this.getTitles = function () {
        return base['titles'];
    };
    this.getUnits = function () {
        return base['units'];
    };

    function sortByAsc(a,b) {
        return (a.price - b.price);
    }
    function sortByDesc(a,b) {
        return (b.price - a.price);
    }

    function ErrorHandler(jqXHR,StatusStr,ErrorStr)
    {
        alert(StatusStr+' '+ErrorStr);
    }
    this.getCategories = function () {
        return base.categories;
    };

}









// var base = {
//     users:[],
//     categories:['Phones', 'Notebooks'],
//     titles:{model:'Model', brandName:'Manufacturer', ddr: 'DDR', screenSize:'Screen size', resolution: 'Resolutions', memory:'Memory', price: 'Memory', cpu:'Processor',
//             hdd:'Hard drive', video: 'Video card'},
//         units:{ddr:'Gb', hdd:'Gb', screenSize:'inch', memory:'Gb'},
//     'Phones':[{id:'p001', model:'iPhone 7', brandName:'Apple', ddr: 2, screenSize:4.7, resolution: '750x1334', memory:32, price: 1680, image:'img/phones/iphone7.jpg'},
//         {id:'p002', model:'iPhone 5s', brandName:'Apple', ddr: 1, screenSize:4, resolution: '640x1136', memory:16, price: 715, image:'img/phones/iphone-5s.png'},
//         {id:'p003', model:'Redmi 4', brandName:'Xiaomi', ddr: 3, screenSize: 5, resolution: '1080x1920', memory: 32, price: 430, image:'img/phones/xiaomi-redmi-4.jpg'},
//         {id:'p004', model:'Galaxy S7 Edge', brandName:'Samsung', ddr: 4, screenSize: 5.5, resolution: '1440x2560', memory: 32, price: 1418, image:'img/phones/galaxy-s7-edge.png'},
//         {id:'p005', model:'Xperia XA Ultra', brandName:'Sony', ddr: 3, screenSize:6, resolution: '1080x1920', memory: 16, price: 739, image:'img/phones/sony_xperia_xa_ultra.jpg'},
//         {id:'p006', model:'Xperia Z5 Compact', brandName:'Sony', ddr: 2, screenSize:4.6, resolution: '720x1280', memory: 32, price: 915, image:'img/phones/SonyXperiaZ5Compact.jpg'},
//         {id:'p007', model:'Galaxy A5 (2016)', brandName:'Samsung', ddr: 2, screenSize:5.2, resolution: '1080x1920', memory:32, price: 650, image:'img/phones/GalaxyA5.jpg'},
//         {id:'p008', model:'Mi Mix', brandName:'Xiaomi', ddr: 6, screenSize: 6.4, resolution: '1080x1920', memory:256, price: 1900, image:'img/phones/Xiaomi-Mi-Mix.jpg'},
//         {id:'p009', model:'P9', brandName:'Huawei', ddr: 3, screenSize:5.2, resolution: '1080x1920', memory: 32, price: 950, image:'img/phones/HuaweiP9.jpg'},
//         {id:'p010', model:'P70-A', brandName:'Lenovo', ddr: 2, screenSize:5, resolution: '720x1280', memory: 16, price: 397, image:'img/phones/LenovoP70-A.jpg'}],
//     'Notebooks':[{id:'n001', model:'Mi Book Air', brandName:'Xiaomi', cpu:'Intel Core i5', ddr : 8, hdd: 256, video: 'NVIDIA GeForce 940MX', screenSize: 13.6, price: 1950, image:'img/notebooks/MiBookAir.jpeg'},
//         {id:'n002', model:'MacBook Pro', brandName:'Apple', cpu:'Intel Core i5', ddr : 8, hdd: 128, video: 'Intel Iris Graphics 6100', screenSize: 13.3, price: 2490, image:'img/notebooks/MACBOOKPRO.jpg'},
//         {id:'n003', model:'Y700-15ISK', brandName:'Lenovo', cpu:'Intel Core i5', ddr : 8, hdd: 1000, video: 'NVIDIA GeForce 960M', screenSize: 15.6, price : 1554, image:'img/notebooks/Y700-15ISK.jpg'},
//         {id:'n004', model:'F540SA-XX628D', brandName:'Asus', cpu:'Intel Pentium', ddr : 4, hdd: 1000, video: 'Intel HD Graphics', screenSize: 15.6, price: 655, image:'img/notebooks/F540SA-XX628D.jpeg'},
//         {id:'n005', model:'Z51-70', brandName:'Lenovo', cpu:'Intel Core i5', ddr : 8, hdd: 1000, video: 'AMD Radeon R9 M375', screenSize: 15.6, price: 1174, image:'img/notebooks/Z51-70.jpg'},
//         {id:'n006', model:'250 G5', brandName:'HP', cpu:'Intel Celeron', ddr : 4, hdd: 1000, video: 'Intel HD Graphics', screenSize: 15.6, price: 540, image:'img/notebooks/HP250G5.jpg'},
//         {id:'n007', model:'Zenbook Pro', brandName:'Asus', cpu:'Intel Core i7', ddr : 16, hdd: 512, video: 'NVIDIA GeForce 960M', screenSize: 15.6, price: 2999, image:'img/notebooks/ZenbookPro.jpg'},
//         {id:'n008', model:'GE62VR Apache Pro', brandName:'MSI', cpu:'Intel Core i7', ddr : 8, hdd: 1000, video: 'NVIDIA GeForce GTX1060', screenSize: 15.6, price: 2800, image:'img/notebooks/MSI-GE62VR-6RF-Apache-Pro-4.jpg'},
//         {id:'n009', model:'XPS 15 9550', brandName:'Dell', cpu:'Intel Core i7', ddr : 16, hdd: 256, video: 'NVIDIA GeForce GTX960M', screenSize: 15.6, price: 3220, image:'img/notebooks/DellXps.jpg'},
//         {id:'n010', model:'Yoga 710-14IKB', brandName:'Lenovo', cpu:'Intel Core i7', ddr : 8, hdd: 256, video: 'NVIDIA GeForce 940MX', screenSize: 14, price: 2300, image:'img/notebooks/yoga.png'}]
// };