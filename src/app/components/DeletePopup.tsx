"use client"
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import CryptoJS from 'crypto-js';

interface DeletePopupProps {
  onDelete: (data: any) => void;
  onCancel: () => void;
  rowData: any;
  collectionName: string;
}

const DeletePopup: React.FC<DeletePopupProps> = ({ onDelete, onCancel, rowData, collectionName }) => {
  const handleDelete = async () => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, collectionName, rowData.id));
      let publicId = '';

      // Extract the public ID from the URL
      if (collectionName === 'Books') {
        publicId = rowData.bookUrl.split('/').pop().split('.')[0];
      } else if (collectionName === 'Notes') {
        publicId = rowData.notesUrl.split('/').pop().split('.')[0];
      } else if (collectionName === 'Questions') {
        publicId = rowData.questionsUrl.split('/').pop().split('.')[0];
      }

      // Read env vars and validate (guard against undefined so FormData.append always gets strings)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        console.error('Missing Cloudinary environment variables. Deletion from Cloudinary skipped.');
        // We already deleted the Firestore doc; inform caller and exit.
        onDelete(rowData);
        return;
      }

      // Generate the signature
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = CryptoJS.SHA1(signatureString).toString();

      // Delete the file from Cloudinary
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      if (result.result !== 'ok') {
        throw new Error('Failed to delete file from Cloudinary');
      }

      // Call the onDelete callback
      onDelete(rowData);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-12">Are you sure you want to delete?</h2>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 border border-gray-500 rounded hover:text-gray-800 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;