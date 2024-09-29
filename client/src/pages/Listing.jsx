import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/navigation";
import "swiper/css/bundle";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
  // SwiperCore.use([Navigation]);
  const params = useParams();
  // some state to save data and loading and error messages:
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  // useEffect to fetch data:
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        // create a response:
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        // convert response to json:
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-3xl text-green-700">Loading....</p>
      )}
      {error && (
        <div className="flex items-center justify-center my-7 flex-col gap-4">
          <p className="text-center italic  text-2xl text-red-700 ">
            Something Went Wrong. Please try again later.
          </p>
          <Link
            className="text-3xl rounded-2xl  bg-gray-300 p-2 hover:bg-gray-900 hover:rounded-full hover:text-white transition-all duration-150"
            to={"/"}
          >
            <IoReturnUpBack />
          </Link>
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation={true} modules={[Navigation]}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/*  for copy the url start here */}
          <div className="fixed top-[13%] right-[3%] border rounded-full w-12 h-12 flex items-center justify-center bg-slate-100 cursor-pointer z-50">
            <FaShare
              className="text-slate-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] italic font-semibold z-10 rounded-md bg-slate-100 p-2">
              Link Copied!
            </p>
          )}
          {/*  for copy url end here */}

          {/* for name and price and content start here */}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-3">
            <p className="text-2xl font-semibold">
              {listing.name}-{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-Us")
                : listing.regularPrice.toLocaleString("en-Us")}
              {listing.type === "rent" && "/month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-800 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-800 w-full max-w-[200px] text-white text-center p-1  rounded-tl-md rounded-br-md hover:rounded-full transition-all ease-in-out duration-150">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}
            </div>
            {/* for description start here */}
            <p className="text-slate-700">
              <span className="text-black font-bold">Description -</span>
              {listing.description}
            </p>
            {/* for description end here */}#
            {/* for bed and path and parking start here */}
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 ">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot" : "No Parking"}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Un Furnished"}
              </li>
            </ul>
            {/* for bed and path and parking end here */}
            {/* for more options start here */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-800 uppercase text-white mt-4 text-center p-3 rounded-lg cursor-pointer font-semibold hover:rounded-full hover:opacity-95 transition-all ease-in-out duration-200"
              >
                contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
            {/* for more options end here */}
          </div>
          {/* for content end here */}
        </div>
      )}
    </main>
  );
};

export default Listing;
