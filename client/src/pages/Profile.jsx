import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  // Add some state variables:
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // useEffect:
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // function to uploading images:
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avator: downloadURL })
        );
      }
    );
  };

  // handle Change Field:
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle Submit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // handle Delete:
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      // create response:
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      // convert data to json:
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // handle SignOut :
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      // create response:
      const res = await fetch("/api/auth/signout");
      // convert data to json:
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // handle Show Listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      // create response:
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      // convert data to json:
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(false);
    }
  };

  //function to handle Delete Listing:
  const handleDeleteListing = async (listingId) => {
    try {
      // create response:
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      // convert data to json:
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl font-semibold my-7 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avator || currentUser.avator}
          alt="profile-image"
          className="rounded-full w-24 h-24 cursor-pointer self-center"
        />
        <p className="self-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 4 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 text-white cursor-pointer rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 text-white text-center rounded-lg uppercase hover:opacity-95"
        >
          Create listing
        </Link>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete your account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User updated Successfully!" : ""}
      </p>
      {/* button to show listing part */}
      <button
        onClick={handleShowListings}
        className="text-white bg-green-600 p-3 w-full rounded-lg uppercase mt-6 hover:rounded-full hover:bg-green-700 active:bg-green-800 transition duration-100 ease-in-out"
      >
        Show Listings
      </button>
      <p className="text-red-600 mt-5 text-center">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {/* show listing start here */}
      {userListings && userListings.length > 0 && (
        <div>
          <h1 className="text-center my-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between border border-gray-300 rounded-lg p-3 gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[1]}
                  alt="image-listing-cover"
                  className="w-24 h-24 object-contain rounded-lg"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-500 text-2xl  hover:text-red-600 cursor-pointer active:scale-[0.4] transition-all duration-200"
                >
                  {" "}
                  <MdDelete />
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-500 text-2xl hover:text-green-600 cursor-pointer active:scale-[0.4] transition-all duration-200">
                    <MdEdit />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* show listing end here */}
    </div>
  );
};

export default Profile;
