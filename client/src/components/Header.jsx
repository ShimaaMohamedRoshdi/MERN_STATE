import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
  // select the currentuser:
  const { currentUser } = useSelector((state) => state.user);
  // Add some state for search results:
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // handle search:
  const handleSubmit = async (e) => {
    e.preventDefault();
    //  get the url to keep the previous search term:
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    // convert the url to a string:
    const searchQuery = urlParams.toString();
    // navigate to the search results page:
    navigate(`/search?${searchQuery}`);
  };

  // useEffect to show the searchTerm inside the input :
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  // Note that: if the location.search changed we will update the search
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="p-3 max-w-6xl mx-auto flex items-center justify-between">
        <Link to={"/"}>
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span className="text-red-600">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-md flex items-center"
        >
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-32 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-700" />
          </button>
        </form>
        <ul className="flex items-center gap-4">
          <Link to={"/"}>
            <li className="hidden sm:inline font-semibold text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline font-semibold text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                src={currentUser.avator}
                alt="profile image"
                className="rounded-full h-8 w-8 object-cover"
              />
            ) : (
              <li className="text-slate-700 font-semibold hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
