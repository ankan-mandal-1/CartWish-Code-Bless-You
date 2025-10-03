import React, { useEffect, useState } from 'react'
import {ToastContainer, toast} from "react-toastify"

import "./App.css"
import Navbar from './components/Navbar/Navbar'
import Routing from './components/Routing/Routing'

import {jwtDecode} from "jwt-decode";
import { getJwt, getUser } from './components/services/userServices';
import setAuthToken from './components/utils/setAuthToken';
import "react-toastify/dist/ReactToastify.css"
import { getCartAPI, removeFromCartAPI, incraseProductAPI, decreaseProductAPI } from './components/services/cartServices'
import UserContext from './contexts/UserContext'
import CartContext from './contexts/CartContext'

setAuthToken(getJwt())

const App = () => {

  UserContext

  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  useEffect(() =>{
    try {
     const jwtUser = getUser()
      if(Date.now() >= jwtUser.exp * 1000){
        localStorage.removeItem("token")
        location.reload()
      } else{
        setUser(jwtUser)
      }
    } catch (error) {
      console.log(error)
    }
    
  }, [])

  const addToCart = (product, quantity) => {
    const updatedCart = [...cart]
    const productIndex = updatedCart.findIndex(item => item.product._id === product._id)

    if(productIndex === -1){
      updatedCart.push({product: product, quantity: quantity})
    } else {
      updatedCart[productIndex].quantity += quantity
    }

    setCart(updatedCart);
    addToCart(product._id, quantity).then(res => {
      toast.success("Product Added Successfully")
    }).catch(err => {
      toast.error("Failed to Add Product")
      setCart(cart)
    })
  }

  const removeFromCart = (id) => {
    const oldCart = [...cart]
    const newCart = oldCart.filter(item => item.product._id !== id)
    setCart(newCart)

    removeFromCartAPI(id).catch(err => {
      toast.error("Something went wrong!")
      setCart(oldCart)
    })
  }

  const updateCart = (type, id) => {
    const oldCart = [...cart]
    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex(item => item.product._id === id)

    if(type === "increase"){
      updatedCart[productIndex].quantity += 1
      setCart(updatedCart)

      incraseProductAPI(id).catch(err => {
        toast.error("Something went wrong!")
        setCart(oldCart)
      })
    } 

    if(type === "decrease"){
      updatedCart[productIndex].quantity -= 1
      setCart(updatedCart)

      decreaseProductAPI(id).catch(err => {
        toast.error("Something went wrong!")
        setCart(oldCart)
      })
    } 
    
  }

  const getCart = () => {
    getCartAPI().then(res => {
      setCart(res.data)
    }).catch(err => {
      toast.error("Something wen wrong!")
    })
  }

  useEffect(() => {
    if(user){
      getCart()
    }
  }, [user])

  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider value={{cart, addToCart, removeFromCart, updateCart, setCart}}>
        <div className='app'>
          <Navbar />
          <main>
            <ToastContainer position="bottom-right" />
            <Routing />
          </main>
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  )
}

export default App