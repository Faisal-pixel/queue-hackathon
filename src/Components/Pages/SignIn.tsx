import { useContext,useState } from "react";
import {
  createSMEDocumentFromAuth,
  signInWithGooglePopUp,
} from "../../utils/firebase";
import { GlobalContext } from "../../context/global-context";
import { Tsme } from "../../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const SignIn = () => {
  const {
    pageState,
    setPageState,
    currentUser,
    currentSME,
    setCurrentSME,
  } = useContext(GlobalContext);
  const [companyName, setCompanyName] = useState<string>("");
  const {toast} = useToast();
//   const [signingOut, setSigningOut] = useState(false);

  // When a user clicks on log in as an admin and if the user does not exist, sign them out, now if the user exist, t

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      localStorage.removeItem("signInAsEmployee");
      localStorage.setItem("signInAsAnSME", "true");
       await signInWithGooglePopUp();
       
    } catch (error) {
      console.log(error);
    } 
  };

  const handleCompanyNameSubmit = async (companyName: string) => {
    if (currentUser) {
      // Update the current SME state in context
      const newSME = {
        ...currentSME,
        smeName: companyName,
        isFirstTime: true,
      };
      setCurrentSME(newSME as Tsme);

      // Create new SME document in Firestore
      try{
        await createSMEDocumentFromAuth(currentUser, newSME.smeName, newSME.isFirstTime);
      } catch(error) {
        console.log(error);
      } finally {
        setPageState("login");
      }

      // const smeDoc = await getSmeDocument(currentUser.email as string);

      // setCurrentSME(smeDoc as Tsme);

      // Navigate to SME dashboard
      navigate("/admin-queue");
    }
  };

  

  const handleSignInAsEmployee = async () => {
    try {
      localStorage.removeItem("signInAsAnSME");
      localStorage.setItem("signInAsEmployee", "true");
    await signInWithGooglePopUp();
    } catch (error) {
      console.log(error);
    } finally {
      toast({
        description: "You have successfully signed in as an Employee"
      })
    }
   
  };
  

  return (
    <>
       {pageState === "insertCompanyName" && (
      <div className="flex items-center justify-center min-h-screen bg-orange-100">
        <div className="bg-orange-100 p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Insert Company Name</h1>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            type="text"
            placeholder="Enter company name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={() => handleCompanyNameSubmit(companyName)}
            className="w-full bg-orange-400 text-white p-2 rounded hover:bg-orange-500"
          >
            Submit
          </button>
        </div>
      </div>
    )}
      {pageState === "login" && (
        <div className="flex items-center justify-center  h-screen">
          <div className="space-x-2">
            <button
              className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-blue-400 md:p-4"
              onClick={handleSignIn}
            >
              Log in as an SME
            </button>
            <button
              className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-green-400"
              onClick={handleSignInAsEmployee}
            >
              Log in as as Employee
            </button>
          </div>
        </div>
      )}
    </>
  );
};
