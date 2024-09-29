import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing-cover"
          className="h-[330px] sm:[220px] object-cover w-full hover:scale-110 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col w-full gap-2 mt-2">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-sm text-gray-600 font-semibold">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && "/month"}
          </p>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="text-xs font-bold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms}-Beds`
                : `${listing.bedrooms}-Bed`}
            </div>
            <div className="text-xs font-bold">
              {listing.bathrooms > 1
                ? `${listing.bathrooms}-Baths`
                : `${listing.bathrooms}-Bath`}
            </div>
            <p className="text-xs font-bold">
              {listing.parking ? "Parking" : "No Parking"}
            </p>
            <p className="text-xs font-bold">
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
