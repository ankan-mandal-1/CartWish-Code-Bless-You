import React, { useEffect, useState } from 'react'
import useData from '../hooks/useData'

import "./ProductsList.css"
import ProductCard from './ProductCard'
// import ProductCardSkeleton from './ProductCardSkeleton'
import { useSearchParams } from 'react-router-dom'
import Pagination from '../Common/Pagination'

const ProductsList = () => {

  const [page, setPage] = useState(1)

  const [sortBy, setSortBy] =  useState("")
  const [sortedProduct, setSortedProduct] = useState([])

  const [search, setSearch] = useSearchParams()
  const category = search.get("category")
  // const page = search.get("page")

  const searchQuery = search.get("search")

  const {data, error, isLoading} = useData("/products", {
    params: {
      search: searchQuery,
      category,
      page,
    }
  }, [searchQuery, category, page]) 

  useEffect(() => {
    setPage(1)
  }, [searchQuery, category])

  // const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  {/* ----------Pagination---------- */}
  // const handlePageChange = page => {
  //   const currentParams = Object.fromEntries([...search])
  //   // console.log(currentParams);
  //   setSearch({ ...currentParams, page: page})
  // }

  const handlePageChange = page => {
    const currentParams = Object.fromEntries([...search])
    setSearch({ ...currentParams, page: parseInt(currentParams.page) + 1})
  }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const {scrollTop, clientHeight, scrollHeight} = document.documentElement
  //     // console.log("Scroll Top", scrollTop)
  //     // console.log("Client Height", clientHeight)
  //     // console.log("Scroll Height", scrollHeight)

  //     if(scrollHeight + clientHeight >= scrollHeight - 1 && !isLoading && data && page < data.totalPages){
  //       console.log("Bottom");
  //       setPage(prev => prev + 1)
  //     }
  //   }

  //   window.addEventListener("scroll", handleScroll)
    
  //   return () => window.removeEventListener("scroll", handleScroll)

  // }, [data, isLoading])

  useEffect(() => {

    const handleScroll = () => {
      const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
      if( scrollTop + clientHeight > scrollHeight - 1){
        setPage((prev) => prev + 1)
      }

    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [data, isLoading])

  useEffect(() => {
    if(data && data.products){
      const products = [...data.products]

      if(sortBy === "price desc"){
       setSortedProduct(products.sort((a, b) => b.price - a.price))
      } else if(sortBy == "price asc"){
        setSortedProduct(products.sort((a, b) => a.price - b.price))
      }
      else if(sortBy === "rate desc"){
        setSortedProduct(products.sort((a, b) => b.reviews.rate - a.reviews.rate))
       } else if(sortBy == "rate asc"){
         setSortedProduct(products.sort((a, b) => a.reviews.rate - b.reviews.rate))
       } else {
        setSortedProduct(products)
       }
    }
  }, [sortBy, data])

  return (
    <section className="products_list_section">
        <header className="align_center products_list_header">
            <h2>Products</h2>
            <select name="sort" id="" className="products_sorting" onChange={e => setSortBy(e.target.value)}>
                <option value="">Relevance</option>
                <option value="price desc">Price High to Low</option>
                <option value="price asc">Price Low to High</option>
                <option value="rate desc">Rate High to Low</option>
                <option value="price asc">Rate Low to High</option>
            </select>
        </header>

        <div className="products_list">
          {error && <em className="form_error">{error}</em>}
          {/* {isLoading && skeletons.map(n => <ProductCardSkeleton key={n} />)} */}
          {data?.products && sortedProduct.map(product => <ProductCard 
            key={product._id} 
            product={product}
          />)}

          {/* ----------Pagination---------- */}
          {/* {data && <Pagination 
          totalPosts={data.totalProducts} 
          postsPerPage={8} 
          onClick={handlePageChange} 
          currentPage={page} 
          />} */}


        </div>
    </section>
  )
}

export default ProductsList;