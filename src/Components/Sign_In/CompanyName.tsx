import React, { useState, useEffect } from 'react';

const Signinasstaff: React.FC = () => {
    const [companyName, setCompanyName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [enteredEmail, setEnteredEmail] = useState<string>(''); // Field for entering the old email
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [savedCompanyName, setSavedCompanyName] = useState<string | null>(null);
    const [savedEmail, setSavedEmail] = useState<string | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // Flag to check if the email is verified

    // Retrieve company name and email from localStorage on component mount
    useEffect(() => {
        const savedCompanyName = localStorage.getItem('companyName');
        const savedEmail = localStorage.getItem('email');
        if (savedCompanyName && savedEmail) {
            setCompanyName(savedCompanyName);
            setEmail(''); // Clear the email field when loading saved data
            setSavedCompanyName(savedCompanyName);
            setSavedEmail(savedEmail);
            setSubmitted(true);
        }
    }, []);

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to mask email address (h********@gmail.com format)
    const maskEmail = (email: string): string => {
        const [localPart, domain] = email.split('@');
        return `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear any previous errors

        // Ensure the company name is different from the previous one
        if (companyName === savedCompanyName) {
            setError('Please enter a new company name different from the previous one.');
            return;
        }

        // Validate the email input
        if (!validateEmail(email)) {
            setError('Invalid email. Please enter the correct email.');
            return;
        }

        // Save the new company name and email to localStorage
        localStorage.setItem('companyName', companyName);
        localStorage.setItem('email', email);
        setSavedCompanyName(companyName);
        setSavedEmail(email);
        setSubmitted(true);
        setIsEmailVerified(false); // Reset email verification after a successful submission
    };

    const handleEmailVerification = () => {
        setError(null); // Clear any previous errors

        // Check if the entered email matches the saved email
        if (enteredEmail !== savedEmail) {
            setError('The email you entered does not match the current email.');
            return;
        }

        // If the email matches, allow editing of the company name
        setIsEmailVerified(true);
    };

    const handleEdit = () => {
        setSubmitted(false);
        setEmail(''); // Clear the email when editing the company name
        setIsEmailVerified(false); // Reset email verification
    };

    const handleGoBack = () => {
        setCompanyName(savedCompanyName || '');
        setEmail(savedEmail || '');
        setSubmitted(true);
        setError(null);
    };

    return (
        <div className="min-h-screen flex justify-center items-center w-[1150px]">
            <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
                {!submitted ? (
                    <>
                        {!isEmailVerified ? (
                            // Show email verification input first
                            <form onSubmit={(e) => { e.preventDefault(); handleEmailVerification(); }} className="space-y-6">
                                <div>
                                    <label htmlFor="emailVerification" className="block text-sm font-medium text-gray-700">
                                        Enter your current email to edit company name
                                    </label>
                                    <input
                                        type="email"
                                        id="emailVerification"
                                        value={enteredEmail}
                                        onChange={(e) => setEnteredEmail(e.target.value)}
                                        required
                                        placeholder="Enter your current email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Verify Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="bg-orange-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Show the form to edit the company name after email verification
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your new email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Company Name: {companyName}
                        </h2>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Email: {maskEmail(savedEmail || '')}
                        </h3>
                        <button
                            onClick={handleEdit}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Edit Company Name
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signinasstaff;
