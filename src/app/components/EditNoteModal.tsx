import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import UploadImage from './UploadImage';
import { useToast } from '../hooks/useToast';

interface Note {
    id: string;
    title: string;
    lecturer: string;
    course: string;
    department: string;
    uploadedNote: string;
}

interface EditModalProps {
    note: Note;
    onSave: (updatedNote: Note) => void;
    onCancel: () => void;
}

const EditNoteModal: React.FC<EditModalProps> = ({ note, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Note>({...note, uploadedNote: note.uploadedNote || ''});
    const uploadedNote = formData.uploadedNote;
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadedNotes = (file: string | undefined) => {
        setFormData((prev) => ({ ...prev, uploadedNote: file || '' }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const noteDoc = doc(db, 'Notes', formData.id);
            await updateDoc(noteDoc, {
                title: formData.title,
                lecturer: formData.lecturer,
                course: formData.course,
                department: formData.department,
                notesUrl: formData.uploadedNote,
            });
            showToast({
                type: "success",
                message: "Updated Note details successfully.",
            });
            onSave(formData);
        } catch (error) {
            console.error('Error updating note:', error);
            showToast({
                type: "error",
                message: "Failed to update note.",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg lg:max-w-3xl md:max-w-2xl max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-1">Edit Note</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="md:space-y-8 space-y-6 mt-8">
                        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-20 gap-8">
                            <div className="flex flex-col">
                                <label htmlFor="title" className="font-semibold text-gray-600">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    placeholder="Enter note title"
                                    className="px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="course" className="font-semibold text-gray-600">Course</label>
                                <input
                                    id="course"
                                    name="course"
                                    placeholder="Enter course name"
                                    className="px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                    value={formData.course}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="department" className="font-semibold text-gray-600">Department</label>
                                <input
                                    id="department"
                                    name="department"
                                    placeholder="Enter department name"
                                    className="px-4 py-1 focus:outline-none focus:border-teal-600 border border-gray-400 rounded hover:border-2 hover:border-teal-500 capitalize"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="file" className="font-semibold text-gray-600">Notes</label>
                                <UploadImage label="Upload Notes" uploadedFile={uploadedNote} setUploadedFile={handleUploadedNotes} />
                                <span className="text-sm pt-1">(<span className="font-semibold">upload format:</span> pdf, jpg, png, jpeg, zip)</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-500 border border-gray-500 rounded hover:text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModal;