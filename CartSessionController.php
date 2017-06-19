<?php

namespace App\Http\Controllers;

use App\Category;
use App\Product;
use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Validator;
use Auth;

class CartSessionController extends Controller
{
  public function add(Request $request) {
    $request->session()->put('add2cart', $_GET['cash']);
    $data = $request->session()->get('add2cart');
    return response()->json(['test' => $data]);
  }

  public function cart(Request $request) {
    $ssidList = [];
    $request->session()->put('poscart', $ssidList['pid'] = $_GET['product_id']);
    $data = $request->session()->get('poscart');
    return response()->json($data);
  }
}
