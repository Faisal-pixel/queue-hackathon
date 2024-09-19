

function SigninAsAdmin() {



    return (
        <div className="flex items-center justify-center w-screen">
            <div className=''>
                <button
                    className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-blue-400 md:p-4"
                    // onClick={handleStaffLogin}
                >
                    Log in as Staff
                </button>
                <button
                    className="login-button bg-orange-400 text-white p-4 rounded-md hover:bg-green-400"
                    // onClick={handleAdminLogin}
                >
                    Log in as Admin
                </button>
            </div>

        </div>
    );
}

export default SigninAsAdmin;
