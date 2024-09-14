import { useContext,useState } from "react";
import {
  createSMEDocumentFromAuth,
  signInWithGooglePopUp,
} from "../../utils/firebase";
import { GlobalContext } from "../../context/global-context";
import { Tsme } from "../../types";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const {
    pageState,
    setPageState,
    currentUser,
    currentSME,
    setCurrentSME,
    setSignInAsSME,
    allowAccess
  } = useContext(GlobalContext);
  const [companyName, setCompanyName] = useState<string>("");
//   const [signingOut, setSigningOut] = useState(false);

  // When a user clicks on log in as an admin and if the user does not exist, sign them out, now if the user exist, t

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
       await signInWithGooglePopUp();
      setSignInAsSME(true);
       
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
    await signInWithGooglePopUp();
    // try {
    //   const { user } = await signInWithGooglePopUp();
    //   // After they have authenticated, we want to check if they exist, and if they dont, we sign them out, but if they do we let them in
    //   const smeEmail = await checkIfAdminExists(user);
    //   if (!smeEmail) {
    //     navigate("/not-an-employee");
    //     return;
    //   }
    //   const response = await getSmeDocument(smeEmail);

    //   if (response) {
    //     setCurrentUser(user);
    //     setCurrentSME(response as Tsme);
    //     navigate("/admin-queue");
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    // //   setSigningOut(false);
    //   setPageState("login")
    // }
  };
  console.log(pageState)
  console.log(allowAccess)
  return (
    <>
      {/* {signingOut && (
        <div className="flex items-center justify-center  h-screen">
          <p className="text-2xl">
            You do not exist as an Employee. Try creating an account as an SME
          </p>
        </div>
      )} */}
      {pageState === "insertCompanyName" && (
        <div>
          <h1>Insert Company Name</h1>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            type="text"
          />
          <button onClick={() => handleCompanyNameSubmit(companyName)}>
            Submit
          </button>
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
