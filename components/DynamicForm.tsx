import { useState } from "react";

export interface FormField {
    id: string;
    label: string;
    type: "text" | "number" | "select";
    placeholder?: string;
    options?: string[];
}

export interface FormData {
    fields: FormField[];
}

interface DynamicFormProps {
    formData: FormData;
    onSubmit: (values: Record<string, string>) => void;
}

export default function DynamicForm({ formData, onSubmit }: DynamicFormProps) {
    const [values, setValues] = useState<Record<string, string>>({});

    const handleChange = (id: string, value: string) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
            {formData.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                    <label htmlFor={field.id} className="text-sm font-medium text-neutral-300">
                        {field.label}
                    </label>

                    {field.type === "select" ? (
                        <select
                            id={field.id}
                            value={values[field.id] || ""}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="bg-neutral-900 border border-neutral-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            <option value="">Select...</option>
                            {field.options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={field.id}
                            type={field.type}
                            value={values[field.id] || ""}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="bg-neutral-900 border border-neutral-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
                Submit
            </button>
        </form>
    );
}
