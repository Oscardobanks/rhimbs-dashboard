'use client';
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// FAQ item interface
interface FAQItem {
    question: string;
    answer: string;
}

const HelpPage = () => {
    // State to track which FAQ items are expanded
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    // Toggle FAQ item expansion
    const toggleItem = (index: number) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // FAQ data
    const faqItems: FAQItem[] = [
        {
            question: "How do I access study materials?",
            answer: "You can access study materials by navigating to the Books, Notes, or Questions sections from the sidebar. There you can browse, search, and download materials based on your course and department."
        },
        {
            question: "Can I upload my own study materials?",
            answer: "Currently, only administrators can upload study materials to ensure quality and relevance. If you have valuable materials to share, please contact the admin team via the support email provided on this page."
        },
        {
            question: "How do I report incorrect or outdated materials?",
            answer: "If you find any materials that are incorrect, outdated, or inappropriate, please report them by contacting our support team through the email address or phone numbers listed on this page."
        },
        {
            question: "Is there a limit to how many materials I can download?",
            answer: "No, there is no limit to the number of materials you can download. We encourage you to make the most of the resources available to support your studies."
        },
        {
            question: "How do I update my profile information?",
            answer: "You can update your profile information by clicking on your profile picture in the top right corner, selecting 'My Profile', and then editing your details on the profile page."
        },
        {
            question: "I forgot my password. How do I reset it?",
            answer: "On the login page, click on the 'Forgot Password' link. You will be prompted to enter your email address, and we will send you instructions to reset your password."
        },
        {
            question: "Can I suggest new features for the platform?",
            answer: "Yes! We welcome suggestions for improving our platform. Please send your ideas to our support email or visit our office in person to discuss them."
        }
    ];

    return (
        <DashboardLayout active="Help">
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg shadow-lg p-8 mb-8 text-white">
                        <h1 className="text-3xl font-bold mb-4">Support & Help Center</h1>
                        <p className="text-lg opacity-90">
                            We're here to help you make the most of our platform. Find answers to common questions or reach out to our support team.
                        </p>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-primary-700">About Our Platform</h2>
                        <p className="text-gray-700 mb-4">
                            Our educational resource platform is designed to provide students with easy access to study materials including books, lecture notes, and past questions.
                            We aim to enhance the learning experience by centralizing educational resources and making them accessible to all students.
                        </p>
                        <p className="text-gray-700">
                            The platform is maintained by a dedicated team committed to ensuring that all materials are up-to-date, relevant, and of high quality.
                            We continuously work to improve the platform based on user feedback and evolving educational needs.
                        </p>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-primary-700">Contact Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-primary-100 p-3 rounded-full">
                                    <FaEnvelope className="text-primary-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                                    <p className="text-gray-600 mb-1">For general inquiries and support:</p>
                                    <a href="mailto:support@rhibms.com" className="text-primary-600 hover:underline">
                                        support@rhibms.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-primary-100 p-3 rounded-full">
                                    <FaPhone className="text-primary-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Phone Support</h3>
                                    <p className="text-gray-600 mb-2">Our support team is available Monday-Friday, 8am-5pm:</p>
                                    <ul className="space-y-1">
                                        <li className="text-gray-700">Technical Support: <a href="tel:+2348012345678" className="text-primary-600 hover:underline">+237 680 123 456</a></li>
                                        <li className="text-gray-700">Content Requests: <a href="tel:+2348023456789" className="text-primary-600 hover:underline">+237 680 234 567</a></li>
                                        <li className="text-gray-700">Account Issues: <a href="tel:+2348034567890" className="text-primary-600 hover:underline">+237 680 345 678</a></li>
                                        <li className="text-gray-700">General Inquiries: <a href="tel:+2348045678901" className="text-primary-600 hover:underline">+237 680 456 789</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 md:col-span-2">
                                <div className="bg-primary-100 p-3 rounded-full">
                                    <FaMapMarkerAlt className="text-primary-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Campus Office</h3>
                                    <p className="text-gray-600 mb-1">Visit us in person for direct assistance:</p>
                                    <p className="text-gray-700">
                                        3rd Story, Computer Lab, <br />
                                        Main University Campus, <br />
                                        Malingo, Pres Hostel Street <br />
                                        Buea, Cameroon
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        <span className="font-medium">Office Hours:</span> Monday-Friday, 9am-4pm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold mb-6 text-primary-700">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleItem(index)}
                                    >
                                        <span className="font-medium text-gray-800">{item.question}</span>
                                        {expandedItems[index] ? (
                                            <FaChevronUp className="text-primary-500" />
                                        ) : (
                                            <FaChevronDown className="text-primary-500" />
                                        )}
                                    </button>

                                    <div
                                        className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${expandedItems[index] ? 'max-h-96 py-4' : 'max-h-0 py-0'
                                            }`}
                                    >
                                        <p className="text-gray-700">{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Can't find what you're looking for? We're always looking to improve our support resources.
                        </p>
                        <a
                            href="mailto:feedback@eduresources.com"
                            className="inline-block mt-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                        >
                            Send Feedback
                        </a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HelpPage;