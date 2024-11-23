"use client"

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Popcorn from "@/app/assets/popcorn.png"
import Google from "@/app/assets/google.svg"

function Login(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const data = await response.json();
                // Store the token in localStorage and cookies
                localStorage.setItem('token', data.token);
                document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
                // Show success toast
                toast.success('Login successful!');
                // Redirect to the home page after 2 seconds
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                const errorData = await response.json();
                // Handle login error
                toast.error('Login failed!');
                console.error('Login failed:', errorData.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return(
        <div className="text-white">
            <div className="py-16 max-w-[94%] m-auto px-5">
                <div className="flex md:flex-row flex-col md:gap-5 gap-12 items-center">

                    {/* Left part */}
                    <div className="md:w-[55%]">
                        <Image src={Popcorn} alt="popcorn"/>
                    </div>

                    {/* Right part */}
                    <div className="md:w-[45%]">
                        <div>
                            <div className="pb-5">
                                <h2 className="md:text-3xl text-xl font-bold md:text-left text-center">Login</h2>
                            </div>

                            <div className="pb-3 text-sm">
                                <p className="">No account? <span className="text-orange font-bold hover:underline"><a href="/register">Sign up here.</a></span></p>
                            </div>
                            
                            
                            <form className="pt-3" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input 
                                        className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" 
                                        id="email" 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        name="email"
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
                                <div className='flex md:block justify-center'>
                                    <button className="bg-orange hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Login
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
                </div>
            </div>
        </div>
    )
}

export default Login; 