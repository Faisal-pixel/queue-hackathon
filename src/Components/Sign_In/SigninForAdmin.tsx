// import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { User } from 'firebase/auth';

function SigninAsAdmin() {
    // const [isLoginAsStaff, setIsLoginAsStaff] = useState(false);
    // const [isAnyButtonClicked, setIsAnyButtonClicked] = useState(false);
    // const [email, setEmail] = useState('');
    // const [companyName, setCompanyName] = useState('');
    // const [emailError, setEmailError] = useState('');
    // const [companyError, setCompanyError] = useState('');

    // const { userAuth, setEmployee } = useContext(HackathonContext);

    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleStaffLogin = async () => {
        //If clicks log in as staff, check if he is an employee, if he is an employee, navigate to dashboard he belongs to
        // If not show him an error page

        try {
            const isEmployee = await checkIfCurrentUserIsAnEmployee(userAuth);
            if (isEmployee) {
                // Get employee document using the currentUser email and get the database of the sme using the sme email he belongs to
                const response = await getEmployeeDocument(userAuth?.email as string);
                setEmployee?.(response);
                navigate('/company');
            } else {
                navigate('/not-an-employee');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAdminLogin = async () => {
        // setIsLoginAsStaff(false);
        // setIsAnyButtonClicked(true);
        //Check if the current user is an existing sme, if not, navigate to the sme company name form
        // if it is an existing user, navigate to the dashboard page
        try {
            const response = await checkIfCurrentUserIsAnSME(userAuth)
            if (response) {
                navigate('/company');
            } else {
                navigate('/company-name');
            }
        } catch (error) {
            console.log(error);
        }

    };




    // // Navigate to /admin-ticket-table after successful login
    // navigate('/admin-ticket-table');


    return (
        <div className="flex items-center justify-center  w-[75%]">
            <div className='space-x-2'>
                <button
                    className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-blue-400 md:p-4"
                    onClick={handleStaffLogin}
                >
                    Log in as Staff
                </button>
                <button
                    className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-green-400"
                    onClick={handleAdminLogin}
                >
                    Log in as Admin
                </button>
            </div>

        </div>
    );
}

export default SigninAsAdmin;
