import { useContext, useState } from "react";
import { createSMEDocumentFromAuth, signInWithGooglePopUp } from "../../utils/firebase";
import { GlobalContext } from "../../context/global-context";
import { Tsme } from "../../types";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const { pageState, currentUser, currentSME, setCurrentSME } = useContext(GlobalContext);
const [companyName, setCompanyName] = useState<string>("");

const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
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
            isFirstTime: true
        };
        setCurrentSME(newSME as Tsme);

        // Create new SME document in Firestore
        await createSMEDocumentFromAuth(currentUser, newSME as Tsme);

        // Navigate to SME dashboard
        navigate("/dashboard");
    }
};


  return (
    <>

        {
            pageState === "insertCompanyName" && (
                <div>
                    <h1>Insert Company Name</h1>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} type="text" />
                    <button onClick={() => handleCompanyNameSubmit(companyName)}>Submit</button>
                </div>
            )
        }
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
              onClick={handleSignIn}
            >
              Log in as as Employee
            </button>
          </div>
        </div>
      )}
    </>
  );
};
