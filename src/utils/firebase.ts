// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { TCustomer, TEmployee, Tsme } from "../types";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFdI_KsPH4QimflALObPmjN-t1moz3QBQ",
    authDomain: "queue-hackathon.firebaseapp.com",
    projectId: "queue-hackathon",
    storageBucket: "queue-hackathon.appspot.com",
    messagingSenderId: "108940034300",
    appId: "1:108940034300:web:12a4e389d9363d41ced779"
  };

  initializeApp(firebaseConfig);
  const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
    prompt: "select_account"
    });



  // TODOS/TASKS
  // For a new SME.
  // 1. Sign In with google - DONE
  // 2. After the user clicks log in with sme. We need to create the document in the sme collection.
  // |--Create a function that handles creating a document for the sme. The name of the document is going to be the currentUser Email.
    // |-- We meed the currentUser, and the SME object.

  // 3. Creating an employee document when the sme adds an admin.

  // 4. Create an Employee collection.

  // 5. Updating the queue for the sme.

  // 6. Delete a customer from the queue.

  // 7. Deleting an Admin from the employee collection and sme document.

  // 8. Deleting an employee from the employee collection.

  // 9. Getting the sme document.

  // 1. SIGN IN WITH GOOGLE

  const auth = getAuth(); //This basically initializes the auth service.

  export const signInWithGooglePopUp = () => signInWithPopup(auth, googleProvider);
  export const onAuthStateChangedListener = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
  export const signOutUser = () => signOut(auth);





// FIRESTORE

const db = getFirestore();



  // 2. CREATE SME DOCUMENT

  export const createSMEDocumentFromAuth = async (userAuth: User, sme: Tsme) => {
    // Create a new document in the SME collection
    if(!userAuth) return
    // We want to know whether the document exist in the databse. 
    const smeDocRef = doc(db, "sme", userAuth.email as string);
    // Check if the document exists
    const smeDocSnapshot = await getDoc(smeDocRef);

    // We check, if the smeDocSnapshot does not exist, we want to create a new one in the database.
    if(!smeDocSnapshot.exists()){
      // Create a new document in the database.

      try {
        await setDoc(smeDocRef, {
          smeName: sme.smeName,
          isFirstTime: sme.isFirstTime,
        })
      } catch(error: unknown) {
        if( error instanceof Error) {
          console.log("error creating the sme", error.message); //if there is an error, we want to log the error message
      } else {
      console.log("An unknown error occurred.");
      } 
      }
    } else {
      console.log("SME already exists");
      return false;
    }
  }


  // 3. CREATE EMPLOYEE DOCUMENT

  export const createEmployeeDocument = async (smeEmail: string, employee: TEmployee) => {
    const employeeDocRef = doc(db, "sme", smeEmail, "employees", employee.email);
    const employeeDocSnapshot = await getDoc(employeeDocRef);

    if(!employeeDocSnapshot.exists()){
      try {
        await setDoc(employeeDocRef, {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          dateAdded: employee.dateAdded,
        })
      } catch(error: unknown) {
        if( error instanceof Error) {
          console.log("error creating the employee", error.message); //if there is an error, we want to log the error message
      } else {
      console.log("An unknown error occurred.");
      } 
      }
    }
  
  }

// 4. CREATE EMPLOYEE COLLECTION

export const createEmployeeCollection = async (smeEmail: string, employee: TEmployee) => {
  const employeeCollectionRef = doc(db, "employeeCol", employee.email);
  const employeeCollectionSnapshot = await getDoc(employeeCollectionRef);

  if(!employeeCollectionSnapshot.exists()){
    try {
      await setDoc(employeeCollectionRef, {
        firstName: employee.firstName,
        lastName: employee.lastName,
        smeEmail: smeEmail,
      })
    } catch(error: unknown) {
      if( error instanceof Error) {
        console.log("error creating the employee collection", error.message); //if there is an error, we want to log the error message
    } else {
    console.log("An unknown error occurred.");
    } 
    }
  }
}

// 5. UPDATE QUEUE FOR SME

export const updateQueueForSME = async (smeEmail: string, queue: TCustomer[]) => {
  const smeDocRef = doc(db, "sme", smeEmail);
  const smeSnapshot = await getDoc(smeDocRef);
  
  if(smeSnapshot.exists()) {
    const existingQueue = smeSnapshot.data().queue || [];

    const filteredQueue = queue.filter((queue) => {
        return !existingQueue.some((existingCustomer: TCustomer)  => existingCustomer.ticketNo === queue.ticketNo);
    });

    if (filteredQueue.length === 0) {
        console.log("No new customers to add.");
        return "No new customers added to the queue.";
      }
const updatedQueue = [...existingQueue, ...filteredQueue];
    try {
        await updateDoc(smeDocRef, {
            queue: updatedQueue
        })

        return "Queue updated successfully";
    } catch(error) {
        if( error instanceof Error) {
            console.log("error adding queue to sme", error.message);
        } else {
            console.log("An unknown error occurred.");
        }
    }
} else {
    return false;
}
  
}

// 6. DELETE CUSTOMER FROM QUEUE
export const deleteCustomerFromQueue = async (smeEmail: string, ticketNo: number) => {
  const smeDocRef = doc(db, "sme", smeEmail);
  const smeSnapshot = await getDoc(smeDocRef);

  if(smeSnapshot.exists()) {
    const existingQueue = smeSnapshot.data().queue || [];
    const updatedQueue = existingQueue.filter((customer: TCustomer) => customer.ticketNo !== ticketNo);

    try {
        await updateDoc(smeDocRef, {
            queue: updatedQueue
        })

        return "Customer deleted successfully";
    } catch(error) {
        if( error instanceof Error) {
            console.log("error deleting customer from queue", error.message);
        } else {
            console.log("An unknown error occurred.");
        }
    }
} else {
    return false;
}
}

// 7. DELETE ADMIN FROM EMPLOYEE COLLECTION AND SME DOCUMENT
export const deleteEmployeeFromSME = async (smeEmail: string, adminEmail: string) => {
  const employeeDocRef = doc(db, "sme", smeEmail, "employees", adminEmail);
  const employeeSnapshot = await getDoc(employeeDocRef);

  if(employeeSnapshot.exists()) {
    try {
        await deleteDoc(employeeDocRef);
        return "Admin deleted successfully";
    } catch(error) {
        if( error instanceof Error) {
            console.log("error deleting admin", error.message);
        } else {
            console.log("An unknown error occurred.");
        }
    }
  } else {
      return false;
  }
}

// 8. DELETE EMPLOYEE FROM EMPLOYEE COLLECTION

export const deleteEmployeeFromCollection = async (employeeEmail: string) => {
  const employeeDocRef = doc(db, "employeeCol", employeeEmail);
  const employeeSnapshot = await getDoc(employeeDocRef);

  if(employeeSnapshot.exists()) {
    try {
        await deleteDoc(employeeDocRef);
        return "Employee deleted successfully";
    } catch(error) {
        if( error instanceof Error) {
            console.log("error deleting employee", error.message);
        } else {
            console.log("An unknown error occurred.");
        }
    }
} else {
    return false;
}
}

// 9. GET SME DOCUMENT
export const getSmeDocument = async (smeEmail: string) => {
  if(!smeEmail) return
  const smeDocRef = doc(db, "sme", smeEmail);
  const smeDocSnapshot = await getDoc(smeDocRef);

  if(smeDocSnapshot.exists()){
    return smeDocSnapshot.data() as Tsme;
  } else {
    return false;
  }
}

// GET SME DOC REF
export const getSmeDocRef = (smeEmail: string) => doc(db, "sme", smeEmail);

// A function that checks if the sme exists in the databse,

export const checkIfSmeExists = async (userAuth: User) => {
  if(!userAuth) return
  const smeDocRef = doc(db, "sme", userAuth.email as string);
  const smeDocSnapshot = await getDoc(smeDocRef);

  if(smeDocSnapshot.exists()){
    return true;
  } else {
    return false;
  }
}
// If it does, we getSmeDocument and return it.
//onClick on the button, we if(checkIfSmeExists) then we getSmeDocument and then we navigate to the dashboard.
// after we get the smeDocument, we set it to the smeState in the context.
// If it does not, we create a new sme document in the database.

// A function that checks if the admin exists in the databse,
// If it the person exists in the employee colection, then we can use the smeEmail to get the sme document.
// If it does not, we notify the person that they dont exist as an admin, and then we log the person out

export const checkIfAdminExists = async (userAuth: User) => {
  if(!userAuth) return
  const employeeDocRef = doc(db, "employeeCol", userAuth.email as string);
  const employeeDocSnapshot = await getDoc(employeeDocRef);

  if(employeeDocSnapshot.exists()){
    return employeeDocSnapshot.data().smeEmail;
  } else {
    return false;
  }
}

// Update status of a customer in the queue
export const updateCustomerStatus = async (smeEmail: string, ticketNo: number, status: string) => {
  const smeDocRef = doc(db, "sme", smeEmail);
  const smeSnapshot = await getDoc(smeDocRef);

  if(smeSnapshot.exists()) {
    const existingQueue = smeSnapshot.data().queue || [];
    const updatedQueue = existingQueue.map((customer: TCustomer) => {
        if (customer.ticketNo === ticketNo) {
            return {
                ...customer,
                status
            }
        } else {
            return customer;
        }
    });

    try {
        await updateDoc(smeDocRef, {
            queue: updatedQueue
        })

        return "Status updated successfully";
    } catch(error) {
        if( error instanceof Error) {
            console.log("error updating status", error.message);
        } else {
            console.log("An unknown error occurred.");
        }
    }
} else {
    return false;
}
}
