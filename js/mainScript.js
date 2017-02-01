$(function () {

    var urlDB = 'http://fe.it-academy.by/AjaxStringStorage2.php';
    var nameDB = 'minimarket';

    var view = new TView();
    var model = new TModel(urlDB, nameDB);
    var controller = new TStateController(model, view);

    controller.init(urlDB, nameDB);

});


