import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  SelectTravelList,
  SelectBugetOptions,
  AI_PROMPT,
} from "./constants/options.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [fromData, setFromData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null); // Added state to keep track of user data

  const handleInputChange = (name, value) => {
    setFromData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(fromData);
  }, [fromData]);

  const handleLoginSuccess = (response) => {
    GetUserProfile(response);
  };

  const handleLoginError = (error) => {
    console.error(error);
    toast("Google login failed. Please try again.");
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const onGenerateTrip = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (fromData?.noOfDays > 5 && !fromData?.location) ||
      !fromData?.budget ||
      !fromData?.traveler
    ) {
      toast("Please fill all details");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      fromData?.location?.label
    )
      .replace("{totalDays}", fromData?.noOfDays)
      .replace("{traveler}", fromData?.traveler)
      .replace("{budget}", fromData?.budget);

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip. Please try again.");
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    })
    .then((resp) => {
      console.log(resp.data);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setUser(resp.data); // Update state with user data
      setOpenDialog(false); // Close the dialog
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      toast("Failed to fetch user profile. Please try again.");
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40">
      <div className="w-full max-w-4xl">
        <h2 className="font-bold text-3xl text-center">
          Tell us your travel preferences 🏕️ 🌴
        </h2>
        <p className="mt-3 text-gray-500 text-xl text-center">
          Just provide some basic information, and our trip planner will
          generate a customized itinerary based on your preferences.
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
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          </div>
          <div>
            <h2 className="text-xl my-3 font-medium">
              How many days are you planning your trip?
            </h2>
            <Input
              placeholder={"Ex. 3"}
              type="number"
              onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBugetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${fromData?.budget === item.title && "shadow-lg border-black"}
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
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                ${fromData?.traveler === item.people && "shadow-lg border-black"}
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
          <Button onClick={onGenerateTrip}>Generate Trip</Button>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/logo.svg" alt="Logo" />
                <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                <p>Sign in to the App with Google authentication securely</p>
                <Button
                  onClick={() => login()}
                  className="w-full mt-5 flex gap-4 items-center"
                >
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;
