import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import UploadImage from './UploadImage';
import { useToast } from '../hooks/useToast';

interface Question {
    id: string;
    lecturer: string;
    course: string;
    department: string;
    uploadedQuestion: string;
}

interface EditModalProps {
    question: Question;
    onSave: (updatedQuestion: Question) => void;
    onCancel: () => void;
}

const EditQuestionModal: React.FC<EditModalProps> = ({ question, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Question>({ ...question, uploadedQuestion: question.uploadedQuestion || '' });
    const uploadedQuestion = formData.uploadedQuestion;
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadedQuestions = (file: string | undefined) => {
        setFormData((prev) => ({ ...prev, uploadedQuestion: file || '' }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const questionDoc = doc(db, 'Questions', formData.id);
            await updateDoc(questionDoc, {
                lecturer: formData.lecturer,
                course: formData.course,
                department: formData.department,
                questionsUrl: formData.uploadedQuestion,
            });
            showToast({
                type: "success",
                message: "Updated Question details successfully.",
            });
            onSave(formData);
        } catch (error) {
            console.error('Error updating question:', error);
            showToast({
                type: "error",
                message: "Failed to update question.",
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg lg:max-w-3xl md:max-w-2xl max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-1">Edit Question</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="md:space-y-8 space-y-6 mt-8">
                        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-x-20 gap-8">
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
                                <label htmlFor="file" className="font-semibold text-gray-600">Questions</label>
                                <UploadImage label="Upload Questions" uploadedFile={uploadedQuestion} setUploadedFile={handleUploadedQuestions} />
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

export default EditQuestionModal;