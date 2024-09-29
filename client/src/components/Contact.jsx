import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [landlordError, setLandlordError] = useState(false);
  const [message, setMessage] = useState("");

  // useEffect to fetch data from api:
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLandlordError(false);
        // create response
        const res = await fetch(`/api/user/${listing.userRef}`);
        // convert response to json
        const data = await res.json();
        if (data.success === false) {
          setLandlordError(data.message);
          return;
        }
        setLandlord(data);
        setLandlordError(false);
      } catch (error) {
        setLandlordError(error.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  //   handle Change Textarea:
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlordError && (
        <p className="text-red-700 italic text-center my-7">
          Error fetching landlord's details: {landlordError}
        </p>
      )}
      {landlord && (
        <div className="flex flex-col gap-4 items-start mt-3">
          <p>
            Contact{" "}
            <span className="font-semibold text-blue-600 underline   px-1">
              {landlord.username}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-blue-600 underline   px-1">
              {listing.name.toLowerCase()}:
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            placeholder="Enter your message..."
            rows={"3"}
            className="w-full border border-blue-500 p-3 rounded-lg focus:outline-none"
            onChange={handleChange}
            value={message}
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
            className="bg-gray-700 w-full text-white uppercase text-center p-3 rounded-lg font-semibold hover:rounded-full hover:opacity-95 transition-all ease-in-out duration-200"
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
