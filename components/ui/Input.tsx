import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400
          border-slate-200 hover:border-slate-300
          focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
          disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : ''
          } 
          ${className}
        `}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          block w-full min-h-[120px] rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400
          border-slate-200 hover:border-slate-300
          focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
          disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : ''
          } 
          ${className}
        `}
        {...props}
      />
      {error && <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            block w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200
            border-slate-200 hover:border-slate-300
            focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
              : ''
            } 
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};