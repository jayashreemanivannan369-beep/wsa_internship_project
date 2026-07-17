//fetch cart
//add items
//update quantity
//remove items
//handle loading and errors

import api from "../../utils/api";
import {
    cartRequest,
    cartSuccess,
    cartFail,
    updateCartSuccess,
    removeCartSuccess,
    clearCart,
    clearErrors,
    saveDeliveryInfo
} from "../slices/cartSlice"

//fetch

export const fetchCartItems =() => async(dispatch) =>{
    try{
        dispatch(cartRequest());
        const {data} = await api.get("/v1/eats/cart/get-cart")
        console.log("GET CART RESPONSE:", data);
        dispatch(cartSuccess(data.cart))
        console.log("CART API",data.data)
    }catch (error) {
    console.log("GET CART ERROR:", error);
    console.log("GET CART ERROR RESPONSE:", error.response);

    dispatch(cartFail(error.response?.data?.message));
}
}

//add cart items
//fooditemsId
//restaurant
//quantity

export const addItemToCart =(foodItemId, restaurantId, quantity) => async(dispatch,getState)=>{
    try{
        console.log("addItemToCart called", {
            foodItemId,
            restaurantId,
            quantity,
        });

        dispatch(cartRequest());
        console.log("ENTIRE USER STATE:", getState().user);

        const { user } = getState().user;
        console.log("USER OBJECT:", user);
        console.log("USER ID:", user?._id);

        const{data} = await api.post("/v1/eats/cart/add-to-cart",{
            userId:user._id,
            foodItemId,
            restaurantId,
            quantity
        })
        console.log("ADDING TO CART FOR USER:", user?._id);
        console.log("CART STORED:", data.cart);
        dispatch(cartSuccess(data.cart))
    }catch(error){
        dispatch(cartFail(error.response?.data?.message))
    }
}

//update cart quantity

export const updateCartQuantity =(foodItemId, quantity) => async(dispatch,getState)=>{
    try{
        console.log({foodItemId, quantity});

        const{user} = getState().user;
        const{data} = await api.post("/v1/eats/cart/update-cart-item",{
            userId:user._id,
            foodItemId,
            quantity
        })

        console.log("UPDATE RESPONSE:", data);

        dispatch(updateCartSuccess(data.cart))

    }catch(error){
        dispatch(cartFail(error.response?.data?.message))
    }
}

//remove item from cart

export const removeItemFromCart =(foodItemId, restaurantId, quantity) => async(dispatch,getState)=>{
    try{

        const{user} = getState().user;
        const{data} = await api.delete("/v1/eats/cart/delete-cart-item",{
        data:{
            userId:user._id,
            foodItemId
        }
        })

        dispatch(removeCartSuccess(data))

    }catch(error){
        dispatch(cartFail(error.response?.data?.message))
        console.log(error.response);
    }
}