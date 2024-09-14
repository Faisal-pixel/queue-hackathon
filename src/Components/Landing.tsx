import { useState, useEffect } from 'react';
import Team from './Team';
import Data from './TeamData';
import { Link} from 'react-router-dom';

const Landing = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Toggle scroll button visibility
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const contribution = Array.isArray(Data)
        ? Data.map((contribution, index: number) => (
            <Team key={index} {...contribution} />
        ))
        : null;

    return (
        <>
            <div className="bg-[#fdf6ed] flex flex-col items-center min-h-screen">
                {/* Header */}
                <header className="w-full flex justify-between items-center md:px-24 px-5 py-4">
                    <h1 className="text-2xl font-bold">QueueNot</h1>
                    <nav className="space-x-6 text-right">
                        <a href="#Team" className="text-gray-600 text-xl font-semibold">
                            Team
                        </a>
                        <a href="#Service" className="text-gray-600  text-xl font-semibold">
                            Service
                        </a>
                    </nav>
                </header>

                {/* Main Section */}
                <main className="flex flex-col md:flex-row justify-between items-center md:items-start w-full px-8 md:px-20 py-12 md:py-20">
                    {/* Left content */}
                    <div className="space-y-6  md:pr-10 pt-20" id="pr">
                        <h2 className="text-5xl font-bold" id="good">
                            Say Goodbye to <br /> Long Queues!
                        </h2>
                        <p className="text-gray-600">
                            Experience the freedom of no waiting, ever again.
                        </p>
                        <Link to="/signin">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-400 transition duration-300">
    Get Started
  </button>
</Link>
                    </div>

                    {/* Right content (image and details) */}
                    <div className="relative mt-5 md:mt-0 hidden md:block">
                        <img
                            src="/queue.png"
                            alt="queue"
                            className="h-[500px] object-cover header-img"
                        />
                    </div>
                </main>
            </div>

            <div id="Service">
                <section className="bg-gray-50 py-12 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-light text-gray-800 italic">
                            Your Solution to Endless Waiting!
                        </h2>
                        <p className=" text-xl font-semibold text-gray-600 mb-6 ">
                            Queuenot is your ultimate solution to prevent long queues and enhance your waiting experience. Our platform allows you to manage your time better by letting you pre-book your place in line. No more wasting hours—we help you get where you need to be, on time!
                        </p>
                        {/* <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-400">
                            Get Started
                        </button> */}
                    </div>
                </section>

                <section className="bg-white py-12 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">How QueueNot Works</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Follow these easy steps to skip the queue and save time!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-orange-100 border-orange-300">
                                <div className="mb-4 text-orange-600 text-5xl">📋</div>
                                <h3 className="text-xl font-semibold text-gray-800">Step 1: Sign Up</h3>
                                <p className="text-gray-600">Create your free account and set up your profile.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-orange-100 border-orange-300">
                                <div className="mb-4 text-orange-600 text-5xl">📍</div>
                                <h3 className="text-xl font-semibold text-gray-800">Step 2: Choose Your Location</h3>
                                <p className="text-gray-600">Select the venue and get in line virtually.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-orange-100 border-orange-300">
                                <div className="mb-4 text-orange-600 text-5xl">🔔</div>
                                <h3 className="text-xl font-semibold text-gray-800">Step 3: Get Notified</h3>
                                <p className="text-gray-600">Receive real-time updates and arrive just in time!</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Team Section */}
            <div className=" pt-14 " id="Team">
                <div>
                    <div className="container">
                        <h2 className="text-3xl font-bold text-gray-800 p-2 text-center pb-5">Meet The Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contribution}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-600 py-8 mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="border-t border-gray-300 mt-8 pt-4">
                        <p className="text-center text-gray-300">
                            &copy; {new Date().getFullYear()} QueueNot. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to top button */}
            {showScrollButton && (
                <button
                    className="fixed bottom-4 text-2xl right-4 w-14 h-14 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-400 transition duration-300"
                    onClick={scrollToTop}
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default Landing;
