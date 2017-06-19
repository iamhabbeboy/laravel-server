//Variables
var userOrders;
var preCartItem={};
var preCartUpdateItem={};
var selectedDiscount={};
var discounts=[];
var currentOrder;
var totalsum = 0;
var qty = [0,0,0,0,0,0];
var ingredient_length = 0;
var ordersUnpoppedCounter;
var products_cart={orderType:'dineIn',totalItems:0, limiter:0, discountT:0.0 ,discount:0.0, discountType:'amount', total:0.0, tax:0.0, paymentInfo:{type:'card',creditCardNo:'',cardHolder:'',cardType:''}, items:[]};
$( document ).ready(function() {
    $("#prev-category").attr('data-id',0);
    $("#next-category").attr('data-id',2);
    loadCategories(1);
    loadDiscounts();
    employeeOrders();
});

//Employee Orders
function employeeOrders(){
    $.ajax(
        {
            url: super_path + '/getEmployeesOrders',
            type: 'GET',
            success: function (data) {
                var ordres = data.orders;

                if(ordres.length  > 0 ){
                    ordersUnpoppedCounter = ordres.length;
                    userOrders = ordres;
                    $('#previous-order').attr('data-id',ordres[ordres.length - 1].id);
                }
                else{

                }
            },
            error:function () {notification_handler('error', 'Something went wrong while fetching employees orders.');}
        });
}

//Checkboxes of what ingredients are selected
function checkIfIngredientSelected(defaultIngredient,ingredients) {
    var returnVal = false;

    for(var i=0;i < ingredients.length; i++){
        if(ingredients[i].id == defaultIngredient){
            returnVal =  true;
            break;
        }
    }
    return returnVal;
}

//Find products in order(orders panel)
function findItemInCart(id) {
    for(var i=0;i < products_cart.items.length; i++){
        if(products_cart.items[i].id == id){
            return {item:products_cart.items[i],index:i};
        }
    }
}

//Check if product is not in order(orders panel)
function checkIfNotInCart(id) {
    var returnVar = false;
    for(var i=0;i < products_cart.items.length; i++){
        if(products_cart.items[i].id == id){
            returnVar = true;
        }
    }
    return returnVar;
}

//Update order
function updateCart(){

    var totalItems = 0;
    var total = 0;
    $('#cart-body').empty();
    $('#receipt-table-body').empty();

    for(var i=0;i < products_cart.items.length; i++){
        var item = products_cart.items[i];
        totalItems = totalItems + item.quantity;
        var totalPerItem = parseFloat(item.price_retail) * item.quantity;
        total = parseFloat(total) + totalPerItem;
        var cartRow = '<tr><td><button class="btn btn-default btn-lg btn-block btnProductCart" data-id="'+item.id+'">'+item.name+'</button></td><td>$ '+item.price_retail+'</td><td>'+item.quantity+'</td><td>$ '+totalPerItem.toFixed(2)+'</td><td><button class="btn btn-danger btn-lg deleteCartItEm" data-id="'+item.id+'"><i class="fa fa-trash"></i></button></td></tr>';
        var receiptRow = '<tr id="receiptItem_'+item.name+'"><td>'+item.name+'</td><td>$ '+item.price_retail+'</td><td>'+item.quantity+'</td><td>$ '+totalPerItem.toFixed(2)+'</td>';
        $('#cart-body').append(cartRow);
        $('#receipt-table-body').append(receiptRow);
    }
    products_cart.totalItems = totalItems;

    var tax = total * 5/100; // To be replaced with global system variable.
    products_cart.tax = tax.toFixed(2);
    var cartTotal;
    if(products_cart.totalItems > 0 &&  products_cart.discount > 0){
        products_cart.discountT = parseFloat( products_cart.discountT);
        products_cart.discount = parseFloat( products_cart.discount);
        if(products_cart.discountType == 'amount'){
            if(products_cart.discount.toFixed(2) < total ){
                cartTotal = parseFloat(total) + parseFloat(tax) - products_cart.discount.toFixed(2);
                products_cart.discountT = products_cart.discount.toFixed(2);
            }
            else {
                cartTotal = parseFloat(total) + parseFloat(tax);
            }
        }
        else{
            cartTotal = parseFloat(total) + parseFloat(tax);
            products_cart.discountT = parseFloat(total) * products_cart.discount.toFixed(2)/100;
            cartTotal = cartTotal - parseFloat(total) * products_cart.discount.toFixed(2)/100;
        }
    }
    else{
        cartTotal = parseFloat(total) + parseFloat(tax);
    }
    products_cart.total = cartTotal.toFixed(2);

    $('#cart-total-items').text(totalItems);
    $('#cart-total-items-payment').text(totalItems);
    $('#cart-total-discount').text("$ " + parseFloat(products_cart.discountT).toFixed(2));
    $('#cart-total-discount-receipt').text("$ " + parseFloat(products_cart.discountT).toFixed(2));
    $('#cart-total-tax').text("$ " + tax.toFixed(2));
    $('#cart-total-tax-receipt').text("$ " + tax.toFixed(2));
    $('#cart-total-price').text("$ " + total.toFixed(2));
    $('#cart-total-price-payment').text("$ " + total.toFixed(2));
    $('#cart-total-price-receipt').text("$ "+ total.toFixed(2));
    $('#cart-total-payable').text("$ " + cartTotal.toFixed(2));
    $('#cart-total-payable-receipt').text("$ " + cartTotal.toFixed(2));
    console.log('update Cart');
    console.log(products_cart);
}

//Load categories in category slider
function loadCategories(page) {
    $.ajax(
        {
            url: super_path + '/posCategories/'+page,
            type: 'GET',
            success: function (data) {
                if (!data['error'])
                {categoriesPopulator(data);}
                else
                {notification_handler('error', data['message']);}
            },
            error:function () {notification_handler('error', 'Something went wrong while fetching categories.');}
        });

}

//Display discounts in discount modal
function loadDiscounts(){
    $.ajax(
        {
            url: super_path + '/posDiscounts',
            type: 'GET',
            success: function (data) {
                discounts = data.discounts;
                for(var i=0; i <= discounts.length; i++)
                {
                    $("#testing").append('<a class="btn btn-danger btn-lg discountSelected col-md-3" style="margin: 5px" id="' + discounts[i].id + '">' + discounts[i].title + '</a>');
                }
            },
            error:function () {notification_handler('error', 'Something went wrong while fetching discounts.');}
        });
}

//Display products based on category
function loadProducts(category) {
    $.ajax(
        {
            url: super_path + '/posProducts/'+category,
            type: 'GET',
            success: function (data) {
                if (!data['error'])
                {productPopulator(data);}
                else
                {
                    $('.product-selector').remove();
                    notification_handler('error', data['message']);
                }
            },
            error:function () {notification_handler('error', 'Something went wrong while fetching products.');$('.product-selector').remove();}
        });

}

//load categories based by Id's
$('#prev-category,#next-category').on( "click", function() {loadCategories($(this).attr('data-id'));});

//Display categories on PAGE
function categoriesPopulator(data) {
    $('.category-pagination').remove();

    for (var i = 0; i < data.data.length; i++) {$('#category-pagination-div').append('<a class="btn dark btn-outline btn-lg category-pagination" style = "font-size:1.25rem;" data-id="'+data.data[i].id+'"> '+data.data[i].name+' </a>');}
    if(data.prev_page == 0){$('#prev-category').prop('disabled', true)}else{$('#prev-category').prop('disabled', false).attr('data-id',data.prev_page)}
    if(data.next_page == 0){$('#next-category').prop('disabled', true)}else{$('#next-category').prop('disabled', false).attr('data-id',data.next_page)}
}

//Display Products based on categorty in the page
function productPopulator(data) {

    $('.product-selector').remove();

    for (var i = 0; i < data.data.length; i++) {
        var src;
        if(data.data[i].image != ''){src = super_path + '/images/products/thumbs150/'+data.data[i].image;}
        else{src = 'http://placehold.it/150x150';}
        //console.log(data.data[i])
        $('#product-picker-panel').append(
            '<div class="col-sm-12 col-md-3 product-selector" data-id="'+data.data[i].id+'">'+
            '<h4>'+data.data[i].name+'</h4>'+
            '<div class="thumbnail">'+
            '<img src="'+src+'" style="width: 100%; display: block;">'+
            '</div>'+
            '<h4>$ '+data.data[i].price_retail+'</h4>'+
            '</div>'
        );
    }
}

//Category pagination(back and fourth)(<-Red "categories" Blue->)
$(document.body).on('click', '.category-pagination' , function() {
    $('#portlet-pos-title-category').text($(this).text());
    $('.category-pagination.btn-info').removeClass('btn-info').addClass('btn-default');
    $(this).removeClass('btn-default').addClass('btn-info');
    loadProducts($(this).attr('data-id'));
});

//Load products by ID
$(document.body).on('click', '.product-selector' , function() {
    loadProductDetails($(this).attr('data-id'));
});

//Load product details based with category,price,ingredients,& name of product
function loadProductDetails(id) {
    var isInCart = checkIfNotInCart(id);
    if (!isInCart){
        $.ajax(
            {
                url: super_path + '/posProduct/'+id,
                type: 'GET',
                success: function (data) {
                    if (!data.error)
                    {
                        var product = data.data;
                        var ingredients=[];
                        var defaultIngredients=[];
                        var ingredients_raw = product.product_ingredients;
                        ingredient_length = ingredients_raw.length;
                        for(var i=0; i < ingredients_raw.length; i++ ){
                            $('#ingredientsChecklist').append('<label><input type="checkbox" value="'+ingredients_raw[i].ingredient.id+'" checked class="ingredientsCheck"> '+ingredients_raw[i].ingredient.name+' </label>');
                            var ingredient = {id:ingredients_raw[i].ingredient.id,name:ingredients_raw[i].ingredient.name};
                            ingredients.push(ingredient);
                            defaultIngredients.push(ingredient);
                        }
                        $('#ingredientsChecklist').iCheck({checkboxClass: 'icheckbox_square-grey'});
                        var src;
                        if(product.image != ''){src = super_path + '/images/products/thumbs150/'+product.image;}
                        else{src = 'http://placehold.it/150x150';}

                        $('#addCartItemImage').append('<img width="150" src="'+ src +'" alt="" style="display: block;">');
                        $('#addCartItemName').text(product.name);
                        $('#addCartItemPrice').text('$ '+ product.price_retail);
                        $('#addCartItemCategory').text(product.category.name);
                        $('#addToCart').attr('data-id' , product.id);
                        preCartItem = {id:product.id , name:product.name , image:product.image ,category:product.category.name, quantity:1,price_retail:product.price_retail , ingredients:ingredients , ingredientsDefault:defaultIngredients };
                        $('#add_product_modal').modal('toggle');
                    }
                    else
                    {notification_handler('error', data['message']);}
                },
                error:function () {notification_handler('error', 'Something went wrong while fetching product details.');}
            });
    }
}

//Call add to cart function
$(document.body).on('click', '#addToCart' , function() {
    addProductCart($(this).attr('data-id'));
});

//Add to cart button in modal,when pressed add to orders panel
function addProductCart(product_id) {

    $.ajax({
      url: super_path + '/select2cart',
      method: 'GET',
      data: { 'product_id' : product_id },
      success: function(data) {
        console.log(data)
      },
      error: function(err) {

      }
    })
    var defaultIngredients = preCartItem.ingredients;
    $( ".ingredientsCheck" ).each(function(index) {
        if (!$(this).is(':checked')) {
            for(var i=0;i < defaultIngredients.length; i++){
                if(defaultIngredients[i].id == $(this).val()){
                    defaultIngredients.splice(i,1);
                }
            }
        }
    });
    preCartItem.ingredients = defaultIngredients;
    populateProductCart(preCartItem);
}

//Function to handle products in orders panel
function populateProductCart(product) {
    products_cart.items.push(product);
    updateCart();
    clearAddItemModal();
}

//Cleart cart items
$("#add_product_modal").on("hidden.bs.modal", function () {
    clearAddItemModal();
});

//Cleart add ingredient
$("#add_ingredient_modal").on("hidden.bs.modal", function () {
    clearAddIngredientModal();
});

//Clear add_ingredient modal
function clearAddIngredientModal(){
    $('#customIngredient').val();
    $("#add_ingredient_modal").modal('hide');
}

//Clear orders modal
function clearAddItemModal(){
    $('#add_product_modal').modal('hide');
    $('#addCartItemImage').empty();
    $('#addCartItemName').text();
    $('#addCartItemPrice').text();
    $('#addCartItemCategory').text();
    $('#ingredientsChecklist').empty();
    preCartItem={};
}

//Edit product information in modal when clicked in orders panel
$(document.body).on('click', '.btnProductCart' , function() {
    var itemForUpdate = $(this).attr('data-id');
    var itemIndex = findItemInCart(itemForUpdate);
    var item = itemIndex.item;
    for(var y=0;y<item.ingredientsDefault.length; y++ ){
        var isSelected = checkIfIngredientSelected(item.ingredientsDefault[y].id,item.ingredients);
        if(isSelected){
            $('#editIngredientsChecklist').append('<label><input type="checkbox" value="'+item.ingredientsDefault[y].id+'" checked class="editIngredientsCheck"> '+item.ingredientsDefault[y].name+' </label>');
        }
        else{
            $('#editIngredientsChecklist').append('<label><input type="checkbox" value="'+item.ingredientsDefault[y].id+'" class="editIngredientsCheck"> '+item.ingredientsDefault[y].name+' </label>');
        }
    }
    $('#editIngredientsChecklist').iCheck({checkboxClass: 'icheckbox_square-grey'});

    var src;
    if(item.image != ''){src = super_path + '/images/products/thumbs150/'+item.image;}
    else{src = 'http://placehold.it/150x150';}
    $('#editCartItemImage').append('<img width="150" src="'+src+'" alt="" style="display: block;">');
    $('#editCartItemName').text(item.name);
    $('#editCartItemPrice').text('$ '+item.price_retail);
    $('#editCartItem').attr('data-id' , item.id);
    $('#editCartItemCategory').text(item.category);
    $('#editCartItemQuantity').text(item.quantity);
    $('#increaseQuantity').attr('data-id' , item.id);
    $('#decreaseQuantity').attr('data-id' , item.id);
    var cartItemTotal = parseFloat(item.quantity) * parseFloat(item.price_retail);
    $('#editCartItemTotal').text('$ '+cartItemTotal.toFixed(2));
    preCartUpdateItem = {id:item.id , name:item.name , image:item.image , category:item.category , quantity:1 , price_retail:item.price_retail , ingredients:item.ingredients , ingredientsDefault:item.ingredientsDefault  };

    $('#edit_product_modal').modal('toggle');
});

$(document.body).on('click', '#editCartItem' , function() {
    updateCartItem();
});

function updateCartItem() {
    var defaultIngredients = preCartUpdateItem.ingredientsDefault;
    var updatedIngredients = [];

    $( ".editIngredientsCheck" ).each(function(index) {
        if ($(this).is(':checked')) {
            for(var i=0;i < defaultIngredients.length; i++){
                if(defaultIngredients[i].id == $(this).val()){
                    updatedIngredients.push(defaultIngredients[i]);
                }
            }
        }
    });
    preCartUpdateItem.ingredients = updatedIngredients;
    populateProductCartAfterEdit(preCartUpdateItem);
}

function populateProductCartAfterEdit(product) {
    var itemIndex = findItemInCart(product.id);
    var index = itemIndex.index;
    if (~index) {
        products_cart.items[index] = product;
    }
    updateCart();
    clearEditItemModal();
}

$("#edit_product_modal").on("hidden.bs.modal", function () {
    clearEditItemModal();
});

function clearEditItemModal(){
    $('#edit_product_modal').modal('hide');
    $('#editCartItemImage').empty();
    $('#editCartItemName').text();
    $('#editCartItemPrice').text();
    $('#editCartItemCategory').text();
    $('#editCartItemQuantity').text();
    $('#editCartItemTotal').text();
    $('#editIngredientsChecklist').empty();
    preCartUpdateItem={};
}


$(document.body).on('click', '#increaseQuantity' , function(){
    var quantity = preCartUpdateItem.quantity;
    preCartUpdateItem.quantity = quantity + 1;
    $('#editCartItemQuantity').text(quantity + 1);
    var total = (quantity + 1) * parseFloat(preCartUpdateItem.price_retail);
    $('#editCartItemTotal').text('$ '+total.toFixed(2));
    updateCart();
});

$(document.body).on('click', '#decreaseQuantity' , function(){
    var quantity = preCartUpdateItem.quantity;
    var special_quantity;
    if (quantity - 1 < 1){special_quantity = 1;}
    else {special_quantity = quantity - 1;}
    preCartUpdateItem.quantity = special_quantity;
    $('#editCartItemQuantity').text(special_quantity);
    var total = special_quantity * parseFloat(preCartUpdateItem.price_retail);
    $('#editCartItemTotal').text('$ '+total.toFixed(2));
    updateCart();
});

$(document.body).on('click', '.deleteCartItEm' , function() {

    var itemForDelete = $(this).attr('data-id');
    var itemIndex = findItemInCart(itemForDelete);
    products_cart.items.splice(itemIndex.i,1);
    $(this).closest("tr").remove();
    $('#receiptItem_'+ itemForDelete).remove();
    updateCart();

});


$(document.body).on('click', '#payment-modal-discount' , function() {
    $('#discountModal').modal('toggle');
});

$(document.body).on('click', '.discountSelected' , function(){
    var m = $(this).text();
    var discountId = $(this).attr('id');
    if(discountId != ''){
        for( var i=0; i < discounts.length; i++){if(discounts[i].id == discountId){selectedDiscount = discounts[i];break;}}
        if(selectedDiscount.hasPin){$('#discountPin').parent().show();}else{$('#discountPin').parent().hide();}
    }
    else{
        $('#discountPin').parent().hide();
    }
});

$(document.body).on('click', '#applyDiscount' , function(){
    handleDiscountRequest();
});

function handleDiscountRequest(){
    if($('#discountPin').val() =='' && selectedDiscount.hasPin){
        notification_handler('error', 'Discount pin is empty.');
    }
    else{
        $.ajax(
            {
                url: super_path + '/posDiscount',
                type: 'POST',
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                data: {'limiter':selectedDiscount.id,'pin':$('#discountPin').val()},
                success: function (data) {
                    if (data.error){
                        notification_handler('error', data.message);
                    }
                    else{
                        products_cart.discount=parseFloat(selectedDiscount.amount);
                        products_cart.discountType=selectedDiscount.type;
                        products_cart.limiter=selectedDiscount.id;
                        updateCart();
                        clearDiscountModal();
                    }
                },
                error:function () {notification_handler('error', 'Something went wrong.');}
            });
    }
}

$("#discountModal").on("hidden.bs.modal", function () {
    clearDiscountModal();
});

function clearDiscountModal(){
    $('#discountModal').modal('hide');
    $("#discountsSelect").prop("selectedIndex", 0);
    $('#discountPin').val('');
    $('#discountPin').parent().hide();
    selectedDiscount={};
}

$(document.body).on('click', '#addCustomIngredient', function(){
   $('#add_ingredient_modal').modal('toggle');
});

$(document.body).on('click', '#applyIngredient' , function(){
    AddIngredient();
});

function AddIngredient()
{
    if($('#customIngredient').val() == '')
    {
        notification_handler('error', 'Ingredient pin is empty.');
    }
    else{
        var custom = $('#customIngredient').val();
        var productID = $('#addToCart').attr('data-id')

        $.ajax({
          url: super_path + '/customIngredient/' + productID,
          type: 'GET',
          data: { 'customIngredient' : custom },
            success: function (data) {
              if( null !== data.id) {
                $('#ingredientsChecklist').append('<label><input type="checkbox" value="" checked class="ingredientsCheck"> '+ $('#customIngredient').val() +' </label>');
                clearAddIngredientModal();
                $('#customIngredient').val('');
                $('#ingredientsChecklist').iCheck({checkboxClass: 'icheckbox_square-grey'});
              }
          },
            error:function (err) { console.log(err)}
        });
        // var ingredients=[];
        // var defaultIngredients=[];
        // var ingId = ingredient_length + 1;
        //
        // var ingredient = {id:'s'+ingId,name:$('#customIngredient').val()};
        // ingredients.push(ingredient);
        // defaultIngredients.push(ingredient);
        // clearAddIngredientModal();
        // notification_handler('success', 'Special ingredient added to order');
        // $('#ingredientsChecklist').iCheck({checkboxClass: 'icheckbox_square-grey'});
    }
}

$(document.body).on('click', '.payment-order-types' , function(){
    var orderType = $(this).attr('id');
    if(orderType == 'onlineOrder' || orderType == 'catering' || orderType == 'toGo' || orderType == 'dineIn' || orderType == 'driveThrough'){
        products_cart.orderType = orderType;
        $('.btn-info.payment-order-types').removeClass('btn-info').addClass('btn-danger');
        $(this).removeClass('btn-danger').addClass('btn-info');
        $('#recipt-head-order-type').text($(this).text());
    }
    else{notification_handler('error', 'Unknown order type.'); $('.btn-info.payment-order-types').removeClass('btn-info').addClass('btn-danger'); $('#recipt-head-order-type').text('N/A');}
});

$(document.body).on('click', '#payment-modal-cash' , function(){
    $('#credit-card-info').hide();
    $('#cash-payment-banknotes').show();
    products_cart.paymentInfo={type:'cash',specificAmount:0,hundreds:0,fifties:0,twenties:0,tens:0,fives:0,ones:0};
    $('#credit-card-info').trigger("reset");
    //Sets "Paid By" equalled to "Cash"
    var paid_by = document.querySelector("#cart-head-client-name");
    $(paid_by).text('Cash');
    //Get total amount,display total amount when card button is clicked
    $("#cart-head-tender").text("N/A");
});

$(document.body).on('click', '#payment-modal-card' , function(){
    $('#cash-payment-banknotes').hide();
    $('#credit-card-info').show();
    products_cart.paymentInfo={type:'card',creditCardNo:'',cardHolder:'',cardType:''};
    //Sets "Paid By" equalled to "Card";
    var paid_by = document.querySelector("#cart-head-client-name");
    $(paid_by).text('Card');
    //Get total amount,display total amount when card button is clicked
    var cartTotal = $('#cart-total-payable-receipt').html();
    $("#cart-head-tender").text(cartTotal);
});

$(document.body).on('click', '#numpadClear' , function(){
    clearNumpad();
});

$(document.body).on('click', '.numpadNr' , function(){
    var clicked =  $(this).attr('data-id');
    var fieldVal = $('#numpadValue').val();

    if (clicked == '.' && ~fieldVal.indexOf("."))
    {$(this).prop('disabled','disabled');}
    else
    {
        $(this).prop('disabled','');
        $('#numpadValue').val(fieldVal+clicked);
    }
});

$(document.body).on('click', '#numpadBckSpc' , function(){
    var fieldVal = $('#numpadValue').val();
    fieldVal = fieldVal.slice(0, -1);
    if ( ~fieldVal.indexOf("."))
    {$('#numpadDot').prop('disabled','disabled');}
    else
    {$('#numpadDot').prop('disabled','');}
    $('#numpadValue').val(fieldVal);
});

$(document.body).on('click', '#numpadOk' , function(){
    var fieldVal = $('#numpadValue').val();
    var element = $(this).attr('data-id');
    if(element != 'creditCardNo'){
        $('#'+element).val(fieldVal);
        fieldVal = parseFloat(fieldVal);
        products_cart.paymentInfo={type:'cash',specificAmount:fieldVal.toFixed(2),hundreds:0,fifties:0,twenties:0,tens:0,fives:0,ones:0};
    }
    else{
        $('#'+element).val(fieldVal);
    }
    $("#cart-head-tender").text("$ " + fieldVal);
    $('#numpad').modal('hide');
    clearNumpad();
});

$("#numpad").on("hidden.bs.modal", function () {
    clearNumpad();
});

function clearNumpad() {
    $('#numpadValue').val('');
    $('#numpadDot').prop('disabled','');
}

$(document.body).on('click', '#creditCardNo' , function(){
    var txt = $('#creditCardNo').val();
    if(txt != ''){
        var numb = txt.match(/\d/g);
        numb = numb.join("");
        $('#numpadValue').val(numb);
    }
    $('#numpadDot').prop('disabled','disabled');
    $('#numpadOk').attr('data-id','creditCardNo');
    // $('#numpad').modal('show');
});

$(document.body).on('click', '#specificAmount' , function(){
    clearNotes();
    $('#specificAmountField').parent().parent().show();
    var txt = $('#specificAmountField').val();
    if(txt != ''){
        $('#numpadValue').val(txt.replace(/[^0-9.]/g, ""));
    }
    $('#numpadOk').attr('data-id','specificAmountField');
    $('#numpad').modal('show');

});

$(document.body).on('click', '#specificAmountField' , function(){
    $('#specificAmountField').parent().parent().show();
    var txt = $('#specificAmountField').val();
    if(txt != ''){
        $('#numpadValue').val(txt.replace(/[^0-9.]/g, ""));
    }
    $('#numpadOk').attr('data-id','specificAmountField');
    $('#numpad').modal('show');
});

function add2Session(val) {

  $.ajax({
    url: super_path + '/addcash2session',
    method: 'GET',
    data: { 'cash': val },
    success: function(callback) {
      console.log(callback);
    },
    error: function(err) {

    }
  })
}

$(document.body).on('click', '.payment-order-banknote' , function(){
    //Select receipt tender field to display tender
    var tender = document.querySelector("#cart-head-tender");
    $('#specificAmountField').parent().parent().hide();
    $('.bankNotesQty').show();
    var bankNote = $(this).attr('data-id');
    products_cart.paymentInfo.specificAmount = 0;
    if( bankNote == '100'){
        products_cart.paymentInfo.hundreds = products_cart.paymentInfo.hundreds + 1;
        $('#qty100').text('x '+ products_cart.paymentInfo.hundreds);
        qty[0] = getSum(100, products_cart.paymentInfo.hundreds);
        $(tender).text("$ " + setSum() + ".00");
    }
    if( bankNote == '50'){
        products_cart.paymentInfo.fifties = products_cart.paymentInfo.fifties + 1;
        $('#qty50').text('x '+products_cart.paymentInfo.fifties);
        qty[1] = getSum(50, products_cart.paymentInfo.fifties);
        $(tender).text("$ " + setSum() + ".00");
    }
    if( bankNote == '20'){
        products_cart.paymentInfo.twenties = products_cart.paymentInfo.twenties +1;
        $('#qty20').text('x '+products_cart.paymentInfo.twenties);
        qty[2] = getSum(20, products_cart.paymentInfo.twenties);
        $(tender).text("$ " + setSum() + ".00");
    }
    if( bankNote == '10'){
        products_cart.paymentInfo.tens = products_cart.paymentInfo.tens +1;
        $('#qty10').text('x '+products_cart.paymentInfo.tens);
        qty[3] = getSum(10, products_cart.paymentInfo.tens);
        $(tender).text("$ " + setSum() + ".00");
    }
    if( bankNote == '5'){
        products_cart.paymentInfo.fives = products_cart.paymentInfo.fives +1;
        $('#qty5').text('x '+products_cart.paymentInfo.fives);
        qty[4] = getSum(5, products_cart.paymentInfo.fives);
        $(tender).text("$ " + setSum() + ".00");
    }
    if( bankNote == '1'){
        products_cart.paymentInfo.ones  = products_cart.paymentInfo.ones +1;
        $('#qty1').text('x '+products_cart.paymentInfo.ones);
        qty[5] = getSum(1, products_cart.paymentInfo.ones);
        $(tender).text("$ " + setSum() + ".00");
    }

    add2Session(setSum())
});

$(document.body).on('click', '#clearBanknotes' , function(){
    var tender = document.querySelector("#cart-head-tender");
    clearNotes();
    $(tender).text("N/A");
});

function clearNotes(){
    products_cart.paymentInfo={type:'cash',specificAmount:0,hundreds:0,fifties:0,twenties:0,tens:0,fives:0,ones:0};
    $('#qty100').text('x 0');
    $('#qty50').text('x 0');
    $('#qty20').text('x 0');
    $('#qty10').text('x 0');
    $('#qty5').text('x 0');
    $('#qty1').text('x 0');
    qty = [0,0,0,0,0,0];
    $('.bankNotesQty').hide();
}

$(document.body).on('click', '#placeOrder' , function(){
    if(products_cart.paymentInfo.type == 'card'){
        if($('#credit-card-info').valid())
        {
            products_cart.paymentInfo={type:'card',creditCardNo:$('#creditCardNo').val(),cardHolder:$('#cardHolderName').val(),cardType:$('#cardType').val()};
            placeOrder('');
        }
    }
    else{
        placeOrder('');
    }
});

$(document.body).on('click', '#hold-order' , function(){
    products_cart.paymentInfo={type:'cash',specificAmount:0,hundreds:0,fifties:0,twenties:0,tens:0,fives:0,ones:0};
    placeOrder('onhold');
    clearEverything();
});

function placeOrder(status) {

    $.ajax(
        {
            url: super_path + '/create_pos_order',
            type: 'POST',
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: {
                orderData: products_cart,
                status :status
            },
            success: function (data) {
                if (data.error === false){

                    notification_handler('success', data.message);
                    clearEverything();
                }
                else{
                    notification_handler('error', data.message);
                }
            },
            error:function () {notification_handler('error', 'Something went wrong.');}
        });
}

function clearEverything(){
    $('#large').modal('hide');
    $('#specificAmountField').val('');
    clearDiscountModal();
    clearNotes();
    clearNumpad();
    clearEditItemModal();
    clearAddItemModal();
    clearAddIngredientModal();
    products_cart={orderType:'dineIn',totalItems:0, limiter:0, discountT:0.0 ,discount:0.0, discountType:'amount', total:0.0, tax:0.0, paymentInfo:{type:'card',creditCardNo:'',cardHolder:'',cardType:''}, items:[]};
    updateCart();
    employeeOrders();
    $('.deleteCartItEm').prop('disabled',false);
    $('#placeOrder').prop('disabled',false);
}

$(document.body).on('click', '#current-order' , function(){
    products_cart = currentOrder;
    employeeOrders();
    updateCartAfterPreviosOrderLoad();
    $('.deleteCartItEm').prop('disabled',false);
    $('#placeOrder').prop('disabled',false);
});


$(document.body).on('click', '#previous-order' , function(){
    if(userOrders.length == ordersUnpoppedCounter){
        currentOrder = products_cart;
    }
    getPreviousOrder($(this).attr('data-id'));

});

$(document.body).on('click', '#new-order' , function(){
    clearEverything();
});


function getPreviousOrder(id) {
    $.ajax(
        {
            url: super_path + '/getPreviousOrder/'+id,
            type: 'GET',
            success: function (data) {
                products_cart = data.data;
                previousOrder();
                updateCartAfterPreviosOrderLoad();
            },
            error:function () {notification_handler('error', 'Something went wrong while fetching previous order.');}
        });
}

function previousOrder(){
    if (userOrders.length > 1){
        userOrders.pop();
        $('#previous-order').attr('data-id',userOrders[userOrders.length - 1].id);
    }
}

function  updateCartAfterPreviosOrderLoad() {
    updateCart();
    $('.deleteCartItEm').prop('disabled',true);
    $('#placeOrder').prop('disabled',true);
}

function getSum(price, count)
{
    var ans = price * count;
    return ans;
}

function setSum()
{
    var sum = 0;
    for (var i = 0; i < qty.length; i++) {
        sum = sum + qty[i]
    };
    return sum;
}
