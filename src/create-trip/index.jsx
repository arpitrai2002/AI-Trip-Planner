import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  SelectTravelList,
  SelectBugetOptions,
  AI_PROMPT,
} from "./constants/options.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner"
import { chatSession } from "@/service/AIModal.jsx";

function CreateTrip() {
  const [place, setPlace] = useState();

  const [fromData,setFromData]=useState([]);

  const handleInputChange=(name,value)=>{
    setFromData({
        ...fromData,
        [name]:value
      })
  }

  useEffect(()=>{
    console.log(fromData);
  },[fromData])

   const OnGenerateTrip=async()=>{
    if(fromData?.noOfDays>5 &&!fromData?.location||!fromData?.budget||!fromData?.traveler){
      toast("Please fill all details")
      return;
    }
    const FINAL_PROMPT=AI_PROMPT
    .replace('{location}',fromData?.location?.label)
    .replace('{totalDays}',fromData?.noOfDays)
    .replace('{traveler}',fromData?.traveler)
    .replace('{budget}',fromData?.budget)
    .replace('{totalDays}',fromData?.noOfDays)

    console.log(FINAL_PROMPT);

    const result=await chatSession.sendMessage(FINAL_PROMPT);

    console.log(result?.response?.text());
   }

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
      <div className="w-full max-w-4xl">
        <h2 className="font-bold text-3xl text-center">Tell us your travel preferences 🏕️ 🌴</h2>
        <p className="mt-3 text-gray-500 text-xl text-center">
          Just provide some basic information, and our trip planner will generate
          a customized itinerary based on your preferences.
        </p>
        <div className="mt-20 flex flex-col gap-10">
          <div>
            <h2 className="text-xl my-3 font-medium">
              What is your destination of choice?
            </h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);handleInputChange('location',v)
                },
              }}
            />
          </div>
          <div>
            <h2 className="text-xl my-3 font-medium">
              How many days are you planning your trip?
            </h2>
            <Input placeholder={"Ex. 3"} type="number" 
              onChange={(e)=>handleInputChange('noOfDays',e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBugetOptions.map((item) => (
              <div
                key={item.id}
                onClick={()=>handleInputChange('budget',item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${fromData?.budget==item.title&&'shadow-lg border-black'}
                `}
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item) => (
              <div
                key={item.id}
                onClick={()=>handleInputChange('traveler',item.people)}

                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${fromData?.traveler==item.people&&'shadow-lg border-black'}
                `}
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 flex justify-end">
          <Button onClick={OnGenerateTrip}> Generate Trip</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
