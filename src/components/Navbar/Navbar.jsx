import React, {useContext, useEffect, useState} from 'react'
import {NavLink, useNavigate, Link} from "react-router-dom"

import "./Navbar.css"
import LinkWithIcon from './LinkWithIcon'
import CartContext from '../../contexts/CartContext'
import UserContext from '../../contexts/UserContext'
import { getSuggestionsAPI } from '../services/productServices'

const Navbar = () => {
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [selectedItem, setSelectedItem] = useState(-1)

  const navigate = useNavigate()

  const user = useContext(UserContext);
  const {cart} = useContext(CartContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    if(search.trim() !== ""){
      navigate(`/products?search=${search.trim()}`);
    }
    setSuggestions([])
  }

  const handleKeyDown = e => {
    if(e.key === "ArrowDown"){
      setSelectedItem(current => current + 1)
    } else if(e.key === "ArrowUp"){
      setSelectedItem(current => current - 1)
    } else if (e.key === "Enter" && selectedItem > -1){
      const suggestion = suggestions[selectedItem]
      navigate(`/products?search=${suggestion.title}`)
      setSearch("")
      setSuggestions([])
    }
  }

  useEffect(() => {
    const delaySuggestions = setTimeout(() => {
      if(search.trim() !== ""){
        getSuggestionsAPI(search).then(res => setSuggestions(res.data)).catch(err => console.log(err))
      } else {
        setSuggestions([])
      }
    }, 1000);

    return () => clearTimeout(delaySuggestions)
  }, [search])

  return (
    <nav className='align_center navbar'>
        <div className="align_center">
            <h1 className='navbar_heading'>CartWish</h1>
            <form className='align_center navbar_form' onSubmit={handleSubmit}>
                <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className='navbar_search' 
                placeholder='Search Products'
                onKeyDown={handleKeyDown} 
                />
                <button type="submit" className='search_button'>Search</button>
                {suggestions.length > 0 && (
                  <ul className="search_result">
                  {suggestions.map((suggestion, index) => <li
                  className={selectedItem === index ? 'search_suggestion_link active' : "search_suggestion_link"} 
                  key={suggestions._id} 
                  onClick={() => {
                    setSearch("");
                    setSuggestions([])
                  }} >
                    <Link to={`/products?search=${suggestion.title}`}>{suggestion.title}</Link>
                  </li>)}
                </ul>
                )}
            </form>
        </div>
        <div className='align_center navbar_links'>
          <LinkWithIcon title="Home" link="/" />
          <LinkWithIcon title="Products" link="/products" />
          {!user && <><LinkWithIcon title="Log In" link="/login" />
          <LinkWithIcon title="Sign Up" link="/signup" /></>}
          {user && <><LinkWithIcon title="My Orders" link="/myorders" />
          <LinkWithIcon title="Logout" link="/logout" />
          <NavLink to="/cart" className='align_center'>Cart <p className="align_center cart_counts">{cart.length}</p></NavLink></>
          }
        </div>
    </nav>
  )
}

export default Navbar