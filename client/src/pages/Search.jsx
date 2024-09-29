import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { FaAngleDown } from "react-icons/fa6";
import { BsChevronDoubleDown } from "react-icons/bs";

const Search = () => {
  // some state to get data from sidebar:
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  // console.log(sidebarData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  // console.log(listings);

  // useEffect to keep track of previous value in the url and update the search:
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    // fetch the data from the api:
    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);
  // handle Change the input field:
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  // handle submit the form:
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle the search here with the sidebarData
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    // redirect to the search page with the urlParams
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };


  // handle show more button:
  const onShowMoreClick=async()=>{
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
    try {
      const res = await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if(data.length <9){
        setShowMore(false)
      }
      setListings([...listings,...data])
    } catch (error) {
      setShowMore(false)
      console.log(error.message)
    }
   

  }
  return (
    <div className="flex flex-col md:flex-row">
      {/* div for left side start here */}
      <div className="p-7 border-b-2 border-b-gray-300 md:border-r-2 md:border-r-gray-200 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-lg whitespace-nowrap">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search..."
              className="border border-blue-300 rounded-lg p-3 w-full focus:outline-none"
              value={sidebarData.searchTerm || ""}
              onChange={handleChange}
            />
          </div>
          {/* Add another dives to handle the input */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="font-semibold text-lg">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <span className="font-semibold">Rent&Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <span className="font-semibold">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarData.type === "sale"}
                onChange={handleChange}
              />
              <span className="font-semibold">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span className="font-semibold">Offer</span>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label className="font-semibold text-lg">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span className="font-semibold">Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span className="font-semibold">Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold text-lg">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="p-2 border border-blue-300 rounded-lg focus:outline-blue-800"
            >
              <option value={"regularPrice_desc"}>Price (High To Low)</option>
              <option value={"regularPrice_asc"}>Price (Low To High)</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="uppercase bg-slate-900 text-white rounded-lg text-lg p-3 font-semibold hover:rounded-full hover:opacity-95 transition-all ease-in-out duration-200">
            search
          </button>
        </form>
      </div>
      {/* div for left side end here */}

      {/* div for right side start here */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b border-b-gray-300 p-3 text-slate-600 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-800 ">No Listings Found!</p>
          )}
          {loading && (
            <p className="text-green-700 text-center w-full ">Loading...</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          
        </div>
        {showMore && (
            <div className="flex items-center p-3">
              {/* <button className=" text-3xl p-7"> */}
              <BsChevronDoubleDown onClick={onShowMoreClick} className="text-3xl  text-center w-full  text-green-800 font-bold cursor-pointer "/>
              {/* Show More */}
            {/* </button> */}
            </div>
          )}
      </div>
      {/* div for right side end here */}
    </div>
  );
};

export default Search;
