"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Avatar1 from "@/app/assets/avatars/1.svg";
import Avatar2 from "@/app/assets/avatars/2.svg";
import Avatar3 from "@/app/assets/avatars/3.svg";
import Avatar4 from "@/app/assets/avatars/4.svg";
import Avatar5 from "@/app/assets/avatars/5.svg";
import Avatar6 from "@/app/assets/avatars/6.svg";
import Avatar7 from "@/app/assets/avatars/7.svg";
import Avatar8 from "@/app/assets/avatars/8.svg";
import { toast } from "react-hot-toast";
import { useUser } from "../context/usercontext";

interface ProfileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}
function ProfileOverlay({ isVisible, onClose }: ProfileOverlayProps) {
  const { selectedAvatar, setSelectedAvatar } = useUser();
  const [name, setName] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Avatar images array
  const avatars = [
    { src: Avatar1, alt: "Avatar 1", id: 1 },
    { src: Avatar2, alt: "Avatar 2", id: 2 },
    { src: Avatar3, alt: "Avatar 3", id: 3 },
    { src: Avatar4, alt: "Avatar 4", id: 4 },
    { src: Avatar5, alt: "Avatar 5", id: 5 },
    { src: Avatar6, alt: "Avatar 6", id: 6 },
    { src: Avatar7, alt: "Avatar 7", id: 7 },
    { src: Avatar8, alt: "Avatar 8", id: 8 },
  ];

  // Fetch user data on mount to get current avatar
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`${backendUrl}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const { avatar, name } = data; // Assuming the response has an avatar field

        // Set the current avatar from the user's profile data
        setSelectedAvatar(avatar);
        setName(name);
      } catch (error) {
        console.error("Error fetching user avatar:", error);
      }
    };

    fetchUserAvatar();
  }, [backendUrl, setSelectedAvatar, setName]);

  // Function to send selected avatar number to backend
  const handleAvatarSelection = async (avatarId: number) => {
    try {
      setSelectedAvatar(avatarId); // Update the selected avatar state

      // Send PATCH request to backend with selected avatar number
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${backendUrl}/api/update-avatar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const data = await response.json();
      console.log("Avatar updated successfully", data);
      toast.success("Avatar updated");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 px-4 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose}></div>

      {/* Overlay Content */}
      <div className="relative bg-gray text-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300">
        <div className="pb-6">
            <p className="text-center">Hi {name} 👋 </p>
            <div className="max-w-[100px] m-auto pt-2">
                <hr/>
            </div>
            
        </div>
        <h3 className="pt-2">Select avatar</h3>
        <div className="py-5">
          <div className="flex flex-wrap">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`w-1/6 p-2 cursor-pointer ${
                  selectedAvatar === avatar.id
                    ? "border-2 border-orange rounded-lg"
                    : ""
                }`}
                onClick={() => handleAvatarSelection(avatar.id)}
              >
                <Image src={avatar.src} alt={avatar.alt} />
              </div>
            ))}
          </div>
        </div>
        <button
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Log Out
        </button>
        <button
          className="absolute top-5 right-5 text-gray-600 hover:text-orange"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default ProfileOverlay;