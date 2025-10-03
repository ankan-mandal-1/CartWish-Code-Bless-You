import React, { useState } from 'react'
import {useForm} from "react-hook-form"
import {z} from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

import "./SignupPage.css"
import user from "../../assets/user.png"
import { getUser, signUp } from '../services/userServices'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  name: z.string().min(3, {message: "Name should be at least 3 characters!"}),
  email: z.string().email({message: "Please enter a valid email!"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters!"}),
  confirmPassword: z.string(),
  deliveryAddress:z.string().min(15, {message: "Address must be at least 15 characters!"}),
}).refine(data => data.password === data.confirmPassword, {
  message: "Confirm Password does not match password!",
  path: ["confirmPassword"]
})

const SignupPage = () => {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null)
  const [formError, setformError] = useState("")

  const {register, handleSubmit, formState: {errors}} = useForm({resolver: zodResolver(schema)})

  const onSubmit = async (formData) => {
    try {
      await signUp(formData, profilePic)
      
      window.location = "/"
    } catch (error) {
      if(error.response && error.response.status === 400){
        setFormError(error.response.data.message)
      }
    }
    
  }

  if(getUser()){
    return <Navigate to="/" />
}

  return (
    <section className="align_center form_page">
        <form className="authentication_form signup_form" onSubmit={handleSubmit(onSubmit)}>
            <h2>SignUp Form</h2>

            <div className="image_input_section">
                <div className="image_preview">
                    <img src={profilePic ? URL.createObjectURL(profilePic) : user} id="file-ip-1-preview" />
                </div>
                <label htmlFor="file-ip-1" className="image_label">
                  Upload Image
                </label>
                <input type="file" onChange={e => setProfilePic(e.target.files[0])} id="file-ip-1" className="image_input" />
            </div>

            <div className="form_inputs signup_form_input">
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Enter your name" className="form_text_input" {...register("name")} />
                {errors.name && <em className="form_error">{errors.name.message}</em>}
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" className="form_text_input" {...register("email")} />
                {errors.email && <em className="form_error">{errors.email.message}</em>}
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" className="form_text_input" {...register("password")} />
                {errors.password && <em className="form_error">{errors.password.message}</em>}
              </div>

              <div>
                <label htmlFor="cpassword">Confirm Password</label>
                <input type="password" id="cpassword" placeholder="Enter confirm password" className="form_text_input" {...register("confirmPassword")} />
                {errors.confirmPassword && <em className="form_error">{errors.confirmPassword.message}</em>}
              </div>

              <div className="signup_textareas_section">
                <label htmlFor="address">Delivery Address</label>
                <textarea id="address" placeholder="Enter delivery password" className="input_textarea" {...register("deliveryAddress")} />
                {errors.deliveryAddress && <em className="form_error">{errors.deliveryAddress.message}</em>}
              </div>
            </div>

            {formError && <em className="form_error">{formError}</em>}

            <button className="search_button form_submit" type="submit">
              Submit
            </button>
        </form>
    </section>
  )
}

export default SignupPage