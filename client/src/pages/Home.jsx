import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  // fetch data from api using useEffect:
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true");
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent");
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale");
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className="max-w-6xl mx-auto py-28 px-3 flex flex-col gap-6">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your Next <span className="text-red-600">Perfect</span>
          <br /> Place With Ease
        </h1>

        <div className="text-slate-600 text-xs sm:text-sm">
          <span className="text-red-600 font-bold text-[16px]">Real</span>{" "}
          <span className="text-slate-700 font-bold text-[16px]">Estate</span>{" "}
          is the best place to find your next perfect place to Live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="flex items-center gap-2 text-blue-700 text-xs sm:text-sm font-bold hover:underline hover:text-blue-800 transition-all duration-200"
        >
          Let us Started Now...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">
                Recent Offers
              </h2>
              <Link
                to={`/search?offer=true`}
                className="text-blue-700 text-xs sm:text-sm font-bold hover:underline hover:text-blue-800 transition-all duration-200"
              >
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* rent listings */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">
                Places For Rent
              </h2>
              <Link
                to={`/search?type=rent`}
                className="text-blue-700 text-xs sm:text-sm font-bold hover:underline hover:text-blue-800 transition-all duration-200"
              >
                Show More places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* sale listings */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">
                Places For Sale
              </h2>
              <Link
                to={`/search?type=sale`}
                className="text-blue-700 text-xs sm:text-sm font-bold hover:underline hover:text-blue-800 transition-all duration-200"
              >
                Show More places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
