<?php

namespace App\Http\Controllers;

use App\Ingredient;
use App\Product_Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Auth;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $ingredient = Ingredient::with('creator','modifier')->get();
       // return $ingredient;
       return view('ingredients.ingredient_listing',['ingredients' => $ingredient]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {


    }

    public function custom($id)
    {

      $ingredient = new Ingredient;
      $ingredient->name = ucfirst($_GET['customIngredient']);
      $ingredient->user_create_id = Auth::user()->id;
      $ingredient->created_at = date("Y-m-d H:i:s");

      if ( $ingredient->save() ) {
        $p_ing = new Product_Ingredient;
        $p_ing->product_id = $id;
        $p_ing->ingredient_id = $ingredient->id;
        $p_ing->save();

        return response()->json(['id' => $id]);
      } else {

      }

      //     //return redirect('ingredients')->with('success', 'Ingredient added successfully.');
      //     return response()->json(['name' => $id]);
      // } else {
      //     return redirect()->back()->with('error', 'Something went wrong');
      // }


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),
            [
                'name' => 'required|min:2',
            ]);
        if ($validator->fails())
        {
            $errors = $validator->errors();
            foreach ($errors->all() as $message) {
                return redirect()->back()->with('error', $message) ;
            }
        }
        $ingredient = new Ingredient();
        $ingredient->name = ucfirst($request->name);
        $ingredient->user_create_id = Auth::user()->id;
        $ingredient->created_at = date("Y-m-d H:i:s");

        if ($ingredient->save()) {
            return redirect('ingredients')->with('success', 'Ingredient added successfully.');
        } else {

            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Ingredient  $ingredient
     * @return \Illuminate\Http\Response
     */
    public function show(Ingredient $ingredient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Ingredient  $ingredient
     * @return \Illuminate\Http\Response
     */
    public function edit(Ingredient $ingredient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Ingredient  $ingredient
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Ingredient $ingredient)
    {
        $validator = Validator::make($request->all(),
            [
                'name' => 'required|min:2',
            ]);
        if ($validator->fails())
        {
            $errors = $validator->errors();
            foreach ($errors->all() as $message) {
                return redirect()->back()->with('error', $message) ;
            }
        }
        $ingredient->name = ucfirst($request->name);
        $ingredient->user_modify_id = Auth::user()->id;
        $ingredient->updated_at = date("Y-m-d H:i:s");
        if ($ingredient->save()) {
            return redirect('ingredients')->with('success', 'Ingredient updated successfully.');
        } else {

            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Ingredient  $ingredient
     * @return \Illuminate\Http\Response
     */
    public function destroy(Ingredient $ingredient)
    {

        if($ingredient){
            $ingredient->delete_ingredient = 'yes';
            $ingredient->user_modify_id = Auth::user()->id;
            $ingredient->updated_at = date('Y-m-d H:i:s');

            if ($ingredient->save())
            {return response()->json(array('error'=>'false','message'=>'Ingredient was deleted successfully.'));}
            else
            {return response()->json(array('error'=>'true','message'=>'Ingredient was deleted successfully.'));}
        }
        else{
            return response()->json(array('error'=>'true','message'=>'Ingredient was deleted successfully.'));
        }
    }
}
