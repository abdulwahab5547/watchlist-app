"use client"

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Popcorn from "@/app/assets/popcorn.png"
import Image from "next/image";
import Google from "@/app/assets/google.svg"

function Register(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });
            
            if (response.ok) {
                toast.success('Registration successful!');
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return(
        <div className="text-white">
            <div className="py-16 max-w-[94%] m-auto px-5">
                <div className="flex md:flex-row flex-col md:gap-5 gap-12 items-center">

                    {/* Left part */}
                    <div className="md:w-[45%]">
                        <div>
                            <div className="pb-5">
                                <h2 className="md:text-3xl text-xl font-bold text-center md:text-left">Sign Up</h2>
                            </div>

                            <div className="pb-3 text-sm">
                                <p className="">Already registered? <span className="text-orange font-bold hover:underline"><a href="/login">Sign in here.</a></span></p>
                            </div>
                            
                            
                            <form className="pt-3" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="name">
                                        Name
                                    </label>
                                    <input 
                                        className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" 
                                        id="name" 
                                        type="text" 
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input 
                                        className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" 
                                        id="email" 
                                        type="email" 
                                        name='email'
                                        placeholder="Enter your email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                        />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input 
                                        className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" 
                                        id="password" 
                                        type="password" 
                                        placeholder="Enter your password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
                                        Confirm Password 
                                    </label>
                                    <input 
                                        className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" 
                                        id="confirmPassword" 
                                        type="password" 
                                        name='confirmPassword'
                                        placeholder="Confirm your password" 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='md:block flex justify-center'>
                                    <button type="submit" className="bg-orange hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Sign up
                                    </button>
                                </div>
                                
                            </form>

                            
                            <div className="flex items-center justify-center gap-3 py-5">
                                <hr className="w-full"/>
                                <p>Or</p>
                                <hr className="w-full"/>
                            </div>
                            
                            

                            <div className="">
                                <button className="shadow-lg text-sm bg-white text-black w-full py-2 px-4 rounded flex items-center justify-center gap-3">
                                    <Image src={Google} alt="google" width={20}/>
                                    Continue with Google
                                </button>
                            </div>
                            
                        </div>
                    </div>

                    {/* Right part */}
                    <div className="md:w-[55%]">
                        <Image src={Popcorn} alt="popcorn"/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register; 