import { ChangeEvent, MouseEvent, useState } from "react";
import { FaDownload, FaX } from "react-icons/fa6";
import { useToast } from "../hooks/useToast";
import CryptoJS from 'crypto-js';

interface UploadImageProps {
    label: string;
    uploadedFile: string | undefined;
    setUploadedFile: (url: string | undefined) => void;
}

const UploadImage = ({ label, uploadedFile, setUploadedFile }: UploadImageProps) => {
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const { showToast } = useToast();

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
    const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/zip'];

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (file) {
            if (!allowedFileTypes.includes(file.type)) {
                console.log("Invalid file type");
                showToast({
                    type: "error",
                    message: "Invalid file format. Please upload PDF, JPG, PNG, JPEG or ZIP files only.",
                });
                return;
            }

            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "dashboard-file");
            formData.append("cloud_name", cloudName);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                setIsUploading(false);
                setUploadedFileName(file.name);
                setUploadedFile(data.secure_url);
            } catch (error) {
                console.error("Error uploading file:", error);
                showToast({
                    type: "error",
                    message: "Error uploading File. Plesae try again later.",
                });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const removeUploadedImage = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        let publicId = '';

        // Extract the public ID from the URL
        if (uploadedFile) {
            const parts = uploadedFile.split('/');
            const lastPart = parts.pop();
            if (lastPart) {
                publicId = lastPart.split('.')[0];
            }
        }

        // Generate the signature
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`;
        const signature = CryptoJS.SHA1(signatureString).toString();

        // Delete the file from Cloudinary
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await res.json();
        if (result.result !== 'ok') {
            throw new Error('Failed to delete file from Cloudinary');
        }
        setUploadedFileName("");
        setUploadedFile("")
    };

    return (
        <div>
            <div className="font-semibold transition-all duration-200 ease-in-out w-full focus:outline-none focus:border-teal-600 border border-gray-400 rounded placeholder:text-gray-400 hover:border-2 hover:border-teal-500 active:ring-2 active:ring-teal-500">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileInput"
                    disabled={isUploading}
                />
                <label htmlFor="fileInput" className={`flex gap-3 items-center px-4 py-1 ${isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <FaDownload className="text-gray-500" />
                    {isUploading ? (
                        <span className="text-gray-500">Uploading...</span>
                    ) : !uploadedFileName ? (
                        <span className="font-bold text-gray-600">
                            {label}
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {uploadedFileName}
                            </span>
                            {uploadedFileName && (
                                <button
                                    onClick={removeUploadedImage}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaX size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
};

export default UploadImage;