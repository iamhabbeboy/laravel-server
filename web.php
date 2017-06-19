<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();

Route::get('/', array('as' => '/','uses' =>  'HomeController@index'));
Route::get('/home', array('as' => 'home','uses' =>  'HomeController@index'));
Route::get('/pos', array('as' => 'pos','uses' =>  'HomeController@pos'));
Route::group(['middleware' => 'auth'], function () {

    Route::group(['middleware' => 'manager'], function () {

        /************************************** Users Routes ****************************************/

        Route::get('/users',array('as' => 'users','uses' => 'UserController@index'));
        Route::get('/view_user/{user}',array('as' => 'view_user','uses' => 'UserController@show'));
        Route::get('/create_user',array('as' => 'create_user','uses' => 'UserController@create'));
        Route::post('/add_user',array('as' => 'add_user','uses' => 'UserController@store'));
        Route::get('/edit_user/{user}',array('as' => 'edit_user','uses' => 'UserController@edit'));
        Route::post('/update_user/{user}',array('as' => 'update_user','uses' => 'UserController@update'));
        Route::get('/delete_user/{user}',array('as' => 'delete_user','uses' => 'UserController@destroy'));

        /************************************** Category Routes ****************************************/

        Route::get('/categories',array('as' => 'categories','uses' => 'CategoryController@index'));
        Route::get('/view_category/{category}',array('as' => 'view_category','uses' => 'CategoryController@show'));
        Route::get('/create_category',array('as' => 'create_category','uses' => 'CategoryController@create'));
        Route::post('/add_category',array('as' => 'add_category','uses' => 'CategoryController@store'));
        Route::get('/edit_category/{category}',array('as' => 'edit_category','uses' => 'CategoryController@edit'));
        Route::post('/update_category/{category}',array('as' => 'update_category','uses' => 'CategoryController@update'));
        Route::get('/delete_category/{category}',array('as' => 'delete_category','uses' => 'CategoryController@destroy'));

    /************************************** Products Routes ****************************************/

        Route::get('/products',array('as' => 'products','uses' => 'ProductController@index'));
        Route::get('/view_product/{products}',array('as' => 'view_product','uses' => 'ProductController@show'));
        Route::get('/create_product',array('as' => 'create_product','uses' => 'ProductController@create'));
        Route::post('/add_product',array('as' => 'add_product','uses' => 'ProductController@store'));
        Route::get('/edit_product/{products}',array('as' => 'edit_product','uses' => 'ProductController@edit'));
        Route::post('/update_product/{products}',array('as' => 'update_product','uses' => 'ProductController@update'));
        Route::get('/delete_product/{products}',array('as' => 'delete_product','uses' => 'ProductController@destroy'));
        Route::get('/get_ingredient_product/{product}',array('as' => 'get_ingredient_product','uses' => 'ProductController@ingredientsAjax'));
        Route::get('/delete_ingredient/{ingredient}',array('as' => 'deleteIngredientsAjax','uses' => 'ProductController@deleteIngredientsAjax'));

        /************************************** Ingredients Routes ****************************************/

        Route::get('/ingredients',array('as' => 'ingredients','uses' => 'IngredientController@index'));
        Route::get('/view_ingredient/{ingredient}',array('as' => 'view_ingredient','uses' => 'IngredientController@show'));
        Route::get('/create_ingredient',array('as' => 'create_ingredient','uses' => 'IngredientController@create'));
        Route::post('/add_ingredient',array('as' => 'add_ingredient','uses' => 'IngredientController@store'));
        Route::get('/edit_ingredient/{ingredient}',array('as' => 'edit_ingredient','uses' => 'IngredientController@edit'));
        Route::post('/update_ingredient/{ingredient}',array('as' => 'update_ingredient','uses' => 'IngredientController@update'));
        Route::get('/delete_ingredient/{ingredient}',array('as' => 'delete_ingredient','uses' => 'IngredientController@destroy'));

        /************************************** Discounts Routes ****************************************/

        Route::get('/discounts',array('as' => 'discounts','uses' => 'DiscountController@index'));
        Route::get('/view_discount/{discount}',array('as' => 'view_discount','uses' => 'DiscountController@show'));
        Route::get('/create_discount',array('as' => 'create_discount','uses' => 'DiscountController@create'));
        Route::post('/add_discount',array('as' => 'add_discount','uses' => 'DiscountController@store'));
        Route::get('/edit_discount/{discount}',array('as' => 'edit_discount','uses' => 'DiscountController@edit'));
        Route::post('/update_discount/{discount}',array('as' => 'update_discount','uses' => 'DiscountController@update'));
        Route::get('/delete_discount/{discount}',array('as' => 'delete_discount','uses' => 'DiscountController@destroy'));

        /************************************** Orders Routes ****************************************/

        Route::get('/orders', array('as' => 'orders', 'uses' => 'OrderController@index'));
        Route::get('/view_order/{order}', array('as' => 'view_order', 'uses' => 'OrderController@show'));
        Route::get('/create_order', array('as' => 'create_order', 'uses' => 'OrderController@create'));
        Route::post('/add_order', array('as' => 'add_order', 'uses' => 'OrderController@store'));
        Route::get('/edit_order/{order}', array('as' => 'edit_order', 'uses' => 'OrderController@edit'));
        Route::post('/update_order/{order}', array('as' => 'update_order', 'uses' => 'OrderController@update'));
        Route::get('/delete_order/{order}', array('as' => 'delete_order', 'uses' => 'OrderController@destroy'));
        Route::get('/order_items/{order}', array('as' => 'order_items', 'uses' => 'OrderController@orderItemsAjax'));
        Route::get('/payment_info/{order}', array('as' => 'payment_info', 'uses' => 'OrderController@orderPaymentAjax'));


        /************************************** Settings Routes ****************************************/

        Route::get('/settings', array('as' => 'settings', 'uses' => 'SettingController@index'));
        Route::get('/view_setting/{setting}', array('as' => 'view_setting', 'uses' => 'SettingController@show'));
        Route::get('/create_setting', array('as' => 'create_setting', 'uses' => 'SettingController@create'));
        Route::post('/add_setting', array('as' => 'add_setting', 'uses' => 'SettingController@store'));
        Route::get('/edit_setting/{setting}', array('as' => 'edit_setting', 'uses' => 'SettingController@edit'));
        Route::post('/update_setting', array('as' => 'update_setting', 'uses' => 'SettingController@update'));
        Route::get('/delete_setting/{setting}', array('as' => 'delete_setting', 'uses' => 'SettingController@destroy'));


     /************************************** Vendors Routes ****************************************/

        Route::get('/vendors', array('as' => 'vendors', 'uses' => 'VendorController@index'));
        Route::get('/view_vendor/{vendor}', array('as' => 'view_vendor', 'uses' => 'VendorController@show'));
        Route::get('/create_vendor', array('as' => 'create_vendor', 'uses' => 'VendorController@create'));
        Route::post('/add_vendor', array('as' => 'add_vendor', 'uses' => 'VendorController@store'));
        Route::get('/edit_vendor/{vendor}', array('as' => 'edit_vendor', 'uses' => 'VendorController@edit'));
        Route::post('/update_vendor/{vendor}', array('as' => 'update_vendor', 'uses' => 'VendorController@update'));
        Route::get('/delete_vendor/{vendor}', array('as' => 'delete_vendor', 'uses' => 'VendorController@destroy'));

    /**************************************** Registers Routes ****************************************/
        Route::get('/registers', array('as' => 'registers', 'uses' => 'RegistersController@index'));
        Route::get('/view_register/{register}', array('as' => 'view_registers', 'uses' => 'RegistersController@show'));
        Route::get('/create_register', array('as' => 'create_registers', 'uses' => 'RegistersController@create'));
        Route::post('/add_register', array('as' => 'add_register', 'uses' => 'RegistersController@store'));
        Route::get('/edit_register/{register}', array('as' => 'edit_register', 'uses' => 'RegistersController@edit'));
        Route::post('/update_register/{register}', array('as' => 'update_registers', 'uses' => 'RegistersController@update'));
        Route::get('/delete_register/{register}', array('as' => 'delete_register', 'uses' => 'RegistersController@destroy'));

    });

    Route::get('/posCategories/{page}',array('as' => 'posCategories','uses' => 'CategoryController@indexAjax'));
    Route::get('/posProducts/{category}',array('as' => 'posProducts','uses' => 'ProductController@productsOfCategory'));
    Route::get('/posProduct/{product}',array('as' => 'posProduct','uses' => 'ProductController@product'));
    Route::get('/posDiscounts',array('as' => 'posDiscounts','uses' => 'DiscountController@posDiscounts'));
    Route::post('/posDiscount',array('as' => 'posDiscount','uses' => 'DiscountController@posDiscount'));
    //Custom Ingredient Ajax POST Request
    Route::get('/customIngredient/{product}',array('as' => 'customIngredient','uses' => 'IngredientController@custom'));
    Route::get('/addcash2session', array('as' => 'addcash2session', 'uses' => 'CartSessionController@add'));
    Route::get('/select2cart', array('as' => 'select2cart', 'uses' => 'CartSessionController@cart'));

    Route::post('create_pos_order',array('as'=> 'createPosOrder', 'uses'=>'OrderController@store'));
    Route::get('getEmployeesOrders',array('as'=> 'getEmployeesOrders', 'uses'=>'OrderController@getEmployeesOrders'));
    Route::get('getPreviousOrder/{order}',array('as'=> 'getPreviousOrder', 'uses'=>'OrderController@getPreviousOrder'));
});
