function TOrderPopupView(_model) {

    this.createForm = function () {

        var wrapper = $('<div></div>').addClass('orderPopupWrapper');
        var orderForm = $('<form></form>').addClass('orderForm');
        var formTitle = $('<span></span>').addClass('orderFormTitle').text('Enter your contact information:');
        var nameLabel = $('<label></label>').addClass('orderFormLabel').text('Your name:');
        var inputNameField = $('<input type="text">').addClass('orderFormInputField nameField')
            .attr({'title': 'Enter your name here', 'name':'nameField', 'required':'required'});
        var phoneLabel = $('<label></label>').addClass('orderFormLabel').text('Phone number:');
        var inputPhoneField = $('<input type="text">').addClass('orderFormInputField phoneField')
            .attr({'title':'Enter your phone here', 'name':'phoneField'});
        var emailLabel = $('<label></label>').addClass('orderFormLabel').text('E-mail address:');
        var inputEmailField = $('<input type="email">').addClass('orderFormInputField emailField')
            .attr({'title':'Enter your email address here', 'name':'emailField'});
        var sendBtn = $('<span></span>').addClass('orderPopupSendBtn').text('Order');
        var closeBtn = $('<span></span>').addClass('orderFormCloseBtn');
		
		$(inputPhoneField).mask('(99) 999-99-99');

        $(nameLabel).append('<br/>', inputNameField);
        $(phoneLabel).append('<br/>', inputPhoneField);
        $(emailLabel).append('<br/>', inputEmailField);
        $(orderForm).append(formTitle, '<br/>', nameLabel, '<br/>', phoneLabel, '<br/>', emailLabel, sendBtn, closeBtn);
        $(wrapper).append(orderForm);

        $('body').append(wrapper);
        return wrapper;
    };

    this.createOrderInfo = function () {

		var orderNum = _model.getOrderNum();
        // var orderNum = 10;
        var wrapper = $('<div></div>').addClass('orderPopupWrapper orderComplete');
        var orderForm = $('<form></form>').addClass('orderForm ocp');
        var icon = $('<img>').attr('src', 'img/success.png').addClass('successIcon');
        var formTitle = $('<span></span>').addClass('orderFormTitle ocp').html('Your order is added.<br/>Soon we will contact you to confirm your order.<br/><span>Your order num:</span><span class="orderNum"> ' + orderNum+ '</span>');
        var closeBtn = $('<span></span>').addClass('orderFormCloseBtn ocp');

        $(orderForm).append(icon, formTitle, closeBtn);
        $(wrapper).append(orderForm);

        $('body').append(wrapper);
        return wrapper;
    }
}
