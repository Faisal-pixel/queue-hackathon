import { useState } from "react";
import './team.css';

export default function Team(props: any) {
    const [isZoomed, setIsZoomed] = useState(false);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <>
            {/* Card structure */}
            <div className="max-w-sm rounded overflow-hidden shadow-2xl">
                {/* Clickable thumbnail image */}
                <img
                    className="w-full h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
                    src={props.img}
                    alt="image"
                    onClick={toggleZoom}
                />

                {/* Content Section */}
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{props.name}</div>
                    <p className="text-gray-700 text-base contribution">
                        {props.contribution}
                    </p>
                </div>

                {/* Social Links */}
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        <a href={props.github} target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-github"></i> Github
                        </a>
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        <a href={props.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-linkedin"></i> Linkedin
                        </a>
                    </span>
                </div>
            </div>

            {/* Zoomed Image Modal */}
            {isZoomed && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                    <div className="relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-white text-4xl font-bold"
                            onClick={toggleZoom}
                        >
                            &times;
                        </button>

                        {/* Zoomed Image */}
                        <img
                            src={props.img}
                            alt="Zoomed image"
                            className="max-w-3xl max-h-screen object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
