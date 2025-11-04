import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    // const colors = {
    //   background: '#040D12',
    //   cardBg: '#183D3D',
    //   border: '#5C8374',
    //   textLight: '#93B1A6',
    //   textWhite: '#ffffff',
    //   primary: '#A27B5C',
    //   primaryHover: '#b58e70', 
    // };

    const navigate = useNavigate();

    const howItWorksSteps = [
        "Mark any of your busy slots as swappable.",
        "Browse through other users’ available swappable slots.",
        "Request a swap that fits your schedule better.",
        "The other user can accept or reject the request.",
        "Once accepted, both users’ calendars are automatically updated — no manual edits needed!",
    ];

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#040D12] p-4 sm:p-8 font-sans">

            <div className="w-full max-w-3xl bg-[#183D3D] rounded-xl shadow-2xl border border-[#5C8374] overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffffff] mb-3">
                        SlotSwapper
                    </h1>
                    <p className="text-lg sm:text-xl text-[#93B1A6]">
                        Tired of rigid schedules? SlotSwapper makes your calendar flexible again.
                    </p>
                    <p className="text-md sm:text-lg text-[#93B1A6] mt-4">
                        It’s a peer-to-peer time-slot scheduling app that lets users swap their busy slots with others—effortlessly and transparently.
                    </p>
                </div>
                <div className="border-t border-[#5C8374]"></div>

                <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] mb-5 flex items-center">
                            How It Works
                        </h2>
                        <ul className="space-y-3">
                            {howItWorksSteps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-[#A27B5C] font-bold text-xl mr-3 mt-0.5">›</span>
                                    <span className="text-[#93B1A6] text-base">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] mb-5 flex items-center">
                            Example
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#040D12] rounded-lg border border-[#5C8374]">
                                <p className="font-semibold text-[#ffffff]">User A</p>
                                <p className="text-[#93B1A6]">Has a <strong className="text-[#A27B5C]">Team Meeting</strong> on Tuesday, 10–11 AM and marks it as swappable.</p>
                            </div>

                            <div className="p-4 bg-[#040D12] rounded-lg border border-[#5C8374]">
                                <p className="font-semibold text-[#ffffff]">User B</p>
                                <p className="text-[#93B1A6]">Has a <strong className="text-[#A27B5C]">Focus Block</strong> on Wednesday, 2–3 PM and does the same.</p>
                            </div>

                            <div className="p-4 bg-[#040D12] rounded-lg border border-[#5C8374]">
                                <p className="font-semibold text-[#ffffff]">The Swap</p>
                                <p className="text-[#93B1A6]">User A requests to swap, User B accepts, and their calendars update instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#040D12] bg-opacity-50 p-8 text-center">
                    <button
                        className="bg-[#A27B5C] text-[#ffffff] font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-[#b58e70] transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate("/login")}
                    >
                        Get Started with SlotSwapper
                    </button>
                </div>

            </div>
        </div>
    );
}
