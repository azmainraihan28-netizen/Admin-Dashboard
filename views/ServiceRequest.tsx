import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { ServiceType, Requisition, User } from '../types';
import { SERVICES } from '../constants';
import { Button } from '../components/ui/Button';
import { Input, TextArea, Select } from '../components/ui/Input';
import { ArrowLeft, CheckCircle2, Shield, Signal, FileText, UploadCloud, File, Trash2 } from 'lucide-react';

// --- Validation Schemas ---

const baseSchema = yup.object({});

const safetySchema = yup.object({
  location: yup.string().required('Location is required'),
  guardType: yup.string().required('Please select a guard type'),
  duration: yup.string().required('Duration is required'),
});

const keyServicesSchema = yup.object({
  keyServiceType: yup.string().required(),
  receiverName: yup.string().required('Receiver name is required'),
  destination: yup.string().required('Destination is required'),
  instructions: yup.string(),
});

const eventSchema = yup.object({
  eventName: yup.string().required('Event name is required'),
  eventDate: yup.string().required('Event date is required'),
  attendees: yup.number().typeError('Must be a number').min(1, 'At least 1 attendee required').required('Number of attendees is required'),
  venueReqs: yup.string().required('Venue requirements are required'),
});

const transportSchema = yup.object({
  transportReqType: yup.string().required('Please select a type'),
  destination: yup.string().required('Destination is required'),
  transportDate: yup.string().required('Date is required'),
  transportTime: yup.string().required('Time is required'),
});

const communicationsSchema = yup.object({
  commType: yup.string().required(),
  justification: yup.string().required('Justification is required'),
});

const housekeepingSchema = yup.object({
  housekeepingServices: yup.array().min(1, 'Select at least one service'),
  location: yup.string().required('Location is required'),
  tasks: yup.string(),
});

const maintenanceSchema = yup.object({
  maintenanceType: yup.string().required('Please select a maintenance type'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
});

const canteenSchema = yup.object({
  canteenTab: yup.string().required(),
  staffId: yup.string().when('canteenTab', {
    is: 'new_emp',
    then: (schema) => schema.required('Staff ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  empName: yup.string().when('canteenTab', {
    is: 'new_emp',
    then: (schema) => schema.required('Employee Name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  dietaryPref: yup.string().when('canteenTab', {
    is: 'new_emp',
    then: (schema) => schema.required('Please select a dietary preference'),
    otherwise: (schema) => schema.notRequired(),
  }),
  hostId: yup.string().when('canteenTab', {
    is: 'guest',
    then: (schema) => schema.required('Host ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  guestCount: yup.number().when('canteenTab', {
    is: 'guest',
    then: (schema) => schema.typeError('Must be a number').min(1, 'At least 1 guest required').required('Guest count is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  mealType: yup.string().when('canteenTab', {
    is: 'guest',
    then: (schema) => schema.required('Please select a meal type'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const getSchema = (id: ServiceType) => {
  switch (id) {
    case ServiceType.SAFETY: return safetySchema;
    case ServiceType.KEY_SERVICES: return keyServicesSchema;
    case ServiceType.EVENT_MANAGEMENT: return eventSchema;
    case ServiceType.CANTEEN: return canteenSchema;
    case ServiceType.TRANSPORT: return transportSchema;
    case ServiceType.COMMUNICATIONS: return communicationsSchema;
    case ServiceType.HOUSEKEEPING: return housekeepingSchema;
    case ServiceType.MAINTENANCE: return maintenanceSchema;
    default: return baseSchema;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface ServiceRequestProps {
  user: User;
  serviceId: ServiceType;
  onBack: () => void;
  onSubmit: (requisition: Requisition) => Promise<void> | void;
}

export const ServiceRequest: React.FC<ServiceRequestProps> = ({ user, serviceId, onBack, onSubmit }) => {
  const service = SERVICES.find(s => s.id === serviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, any>>({
    canteenTab: 'new_emp',
    keyServiceType: 'courier',
    commType: 'sim',
    housekeepingServices: [],
    guardType: '',
    dietaryPref: '',
    mealType: '',
    transportReqType: '',
    maintenanceType: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      canteenTab: 'new_emp',
      keyServiceType: 'courier',
      commType: 'sim',
      housekeepingServices: [],
      guardType: '',
      dietaryPref: '',
      mealType: '',
      transportReqType: '',
      maintenanceType: '',
      attachments: [],
    });
    setErrors({});
  }, [serviceId]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const generateSummary = (id: ServiceType, data: any): string => {
    switch(id) {
      case ServiceType.SAFETY: return `${data.guardType} guard for ${data.location} (${data.duration})`;
      case ServiceType.KEY_SERVICES: return `${data.keyServiceType === 'courier' ? 'Courier' : 'Document'} service to ${data.destination}`;
      case ServiceType.EVENT_MANAGEMENT: return `Event: ${data.eventName} on ${data.eventDate}`;
      case ServiceType.CANTEEN: return data.canteenTab === 'new_emp' ? `New Staff Meal Plan: ${data.empName}` : `Guest Meal Request (${data.guestCount} pax)`;
      case ServiceType.TRANSPORT: return `${data.transportReqType} to ${data.destination} on ${data.transportDate}`;
      case ServiceType.COMMUNICATIONS: return data.commType === 'sim' ? 'New SIM Card Request' : 'Data Bundle Top-up';
      case ServiceType.HOUSEKEEPING: return `Housekeeping at ${data.location}`;
      case ServiceType.MAINTENANCE: return `${data.maintenanceType} maintenance at ${data.location}`;
      default: return 'Service Request';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const schema = getSchema(serviceId);
    try {
      await schema.validate(formData, { abortEarly: false });
      
      // Serialize files to metadata objects (name, size, type) before creating JSON
      // Note: In a real app, we would upload to storage bucket here and get URLs
      const serializedAttachments = (formData.attachments || []).map((file: File) => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      // Validation Passed
      const newRequisition: Requisition = {
        id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
        serviceId: serviceId,
        requesterName: user.name,
        requesterId: user.id,
        requesterStaffId: user.staffId, // Include Staff ID
        department: user.department,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        summary: generateSummary(serviceId, formData),
        formData: { ...formData, attachments: undefined }, // Store data without raw file objects
        attachments: serializedAttachments // Store serialized metadata
      };

      await onSubmit(newRequisition);
      
      setIsSubmitting(false);
      setIsSuccess(true);

    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.error(err);
      }
    }
  };

  if (!service) return null;

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4" aria-live="polite">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6 shadow-sm border border-green-100 dark:border-green-800">
          <CheckCircle2 size={40} aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Request Submitted</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          Your request has been successfully queued and sent to the administration team for approval.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={onBack} variant="outline">Back to Overview</Button>
          <Button onClick={() => {
            setIsSuccess(false);
            setFormData({
              canteenTab: 'new_emp',
              keyServiceType: 'courier',
              commType: 'sim',
              housekeepingServices: [],
              guardType: '',
              dietaryPref: '',
              mealType: '',
              transportReqType: '',
              maintenanceType: '',
              attachments: [],
            });
            setErrors({});
          }}>New Request</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="group flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1 -ml-2"
        aria-label="Back to Service Overview"
      >
        <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        Back to Overview
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-8 sm:px-10 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-start gap-5">
            <div className="p-3.5 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400">
              <service.icon size={32} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{service.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">{service.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-10">
          <FormFields 
            serviceId={serviceId} 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Attachments</h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
                aria-label="Upload files"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, DOC, JPG, PNG (max. 10MB)</p>
              </div>
            </div>

            {formData.attachments && formData.attachments.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {formData.attachments.map((file: File, index: number) => (
                  <li key={`${file.name}-${index}`} className="flex items-center p-3 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm group">
                    <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg text-slate-500 dark:text-slate-300 mr-3">
                      <File size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500 hidden sm:block">
              Fields marked with <span className="text-red-500 dark:text-red-400">*</span> are required
            </p>
            <div className="flex gap-4 ml-auto">
              <Button type="button" variant="ghost" onClick={onBack}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormFieldsProps {
  serviceId: ServiceType;
  formData: any;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ serviceId, formData, errors, onChange }) => {
  const h = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(field, e.target.value);
  };
  
  switch (serviceId) {
    case ServiceType.SAFETY:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2">
            <Input label="Location" placeholder="e.g. Building A, Main Entrance" value={formData.location || ''} onChange={h('location')} error={errors.location} required />
          </div>
          <Select label="Type of Guard Required" value={formData.guardType || ''} onChange={h('guardType')} error={errors.guardType} options={[{ value: 'armed', label: 'Armed Guard' }, { value: 'unarmed', label: 'Unarmed Guard' }, { value: 'supervisor', label: 'Security Supervisor' }, { value: 'event', label: 'Event Security' }]} required />
          <Input label="Duration" placeholder="e.g. 4 hours, 2 days" value={formData.duration || ''} onChange={h('duration')} error={errors.duration} required />
        </div>
      );
    case ServiceType.KEY_SERVICES:
       return (
        <div className="space-y-8">
          <fieldset>
            <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Service Type</legend>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-full sm:w-fit">
              <label className={`flex-1 sm:flex-none text-center px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-100 dark:focus-within:ring-offset-slate-800 ${formData.keyServiceType === 'courier' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'}`}>
                <input type="radio" name="key_service_type" value="courier" checked={formData.keyServiceType === 'courier'} onChange={() => onChange('keyServiceType', 'courier')} className="sr-only"/> Courier Dispatch
              </label>
              <label className={`flex-1 sm:flex-none text-center px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-100 dark:focus-within:ring-offset-slate-800 ${formData.keyServiceType === 'document' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'}`}>
                <input type="radio" name="key_service_type" value="document" checked={formData.keyServiceType === 'document'} onChange={() => onChange('keyServiceType', 'document')} className="sr-only"/> Document Handling
              </label>
            </div>
          </fieldset>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Receiver Name" placeholder="e.g. John Doe" value={formData.receiverName || ''} onChange={h('receiverName')} error={errors.receiverName} required />
            <Input label="Destination / Office" placeholder="e.g. Headquarters, NY Office" value={formData.destination || ''} onChange={h('destination')} error={errors.destination} required />
          </div>
          <TextArea label="Additional Instructions" placeholder="Any special handling instructions..." value={formData.instructions || ''} onChange={h('instructions')} error={errors.instructions} className="min-h-[120px]" />
        </div>
      );
    case ServiceType.EVENT_MANAGEMENT:
      return (
        <div className="space-y-6">
          <Input label="Event Name" placeholder="e.g. Q3 Town Hall" value={formData.eventName || ''} onChange={h('eventName')} error={errors.eventName} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date" type="date" value={formData.eventDate || ''} onChange={h('eventDate')} error={errors.eventDate} required />
            <Input label="Expected Attendees" type="number" placeholder="0" value={formData.attendees || ''} onChange={h('attendees')} error={errors.attendees} required />
          </div>
          <TextArea label="Venue Requirements" placeholder="e.g. Projector, Sound System, 50 Chairs..." value={formData.venueReqs || ''} onChange={h('venueReqs')} error={errors.venueReqs} required className="min-h-[150px]" />
        </div>
      );
    case ServiceType.CANTEEN:
      return (
        <div className="space-y-8">
           <div className="border-b border-slate-200 dark:border-slate-700">
            <div role="tablist" aria-label="Canteen Request Type" className="-mb-px flex space-x-8">
              <button type="button" role="tab" aria-selected={formData.canteenTab === 'new_emp'} onClick={() => onChange('canteenTab', 'new_emp')} className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded ${formData.canteenTab === 'new_emp' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}>New Employee</button>
              <button type="button" role="tab" aria-selected={formData.canteenTab === 'guest'} onClick={() => onChange('canteenTab', 'guest')} className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded ${formData.canteenTab === 'guest' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}>Guest Request</button>
            </div>
          </div>
          <div role="tabpanel" hidden={formData.canteenTab !== 'new_emp'} className={formData.canteenTab === 'new_emp' ? "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Staff ID" placeholder="e.g. EMP-1234" value={formData.staffId || ''} onChange={h('staffId')} error={errors.staffId} required={formData.canteenTab === 'new_emp'} />
              <Input label="Full Name" placeholder="e.g. Sarah Smith" value={formData.empName || ''} onChange={h('empName')} error={errors.empName} required={formData.canteenTab === 'new_emp'} />
            </div>
            <Select label="Dietary Preference" value={formData.dietaryPref || ''} onChange={h('dietaryPref')} error={errors.dietaryPref} required={formData.canteenTab === 'new_emp'} options={[{ value: 'standard', label: 'Standard' }, { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' }, { value: 'halal', label: 'Halal' }, { value: 'kosher', label: 'Kosher' }]} />
          </div>
          <div role="tabpanel" hidden={formData.canteenTab !== 'guest'} className={formData.canteenTab === 'guest' ? "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300" : "hidden"}>
            <Input label="Host Employee ID" placeholder="e.g. EMP-0042" value={formData.hostId || ''} onChange={h('hostId')} error={errors.hostId} required={formData.canteenTab === 'guest'} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Number of Guests" type="number" min="1" value={formData.guestCount || ''} onChange={h('guestCount')} error={errors.guestCount} required={formData.canteenTab === 'guest'} />
              <Select label="Meal Type" value={formData.mealType || ''} onChange={h('mealType')} error={errors.mealType} required={formData.canteenTab === 'guest'} options={[{ value: 'breakfast', label: 'Breakfast' }, { value: 'lunch', label: 'Lunch' }, { value: 'snacks', label: 'High Tea / Snacks' }, { value: 'dinner', label: 'Dinner' }]} />
            </div>
          </div>
        </div>
      );
    case ServiceType.TRANSPORT:
      return (
        <div className="space-y-6">
          <Select label="Requisition Type" value={formData.transportReqType || ''} onChange={h('transportReqType')} error={errors.transportReqType} options={[{ value: 'pickup', label: 'Pick-up' }, { value: 'drop', label: 'Drop-off' }, { value: 'adhoc', label: 'Ad-hoc (Hourly)' }]} required />
          <Input label="Destination / Address" placeholder="Enter full address" value={formData.destination || ''} onChange={h('destination')} error={errors.destination} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date" type="date" value={formData.transportDate || ''} onChange={h('transportDate')} error={errors.transportDate} required />
            <Input label="Time" type="time" value={formData.transportTime || ''} onChange={h('transportTime')} error={errors.transportTime} required />
          </div>
        </div>
      );
    case ServiceType.COMMUNICATIONS:
      return (
        <div className="space-y-8">
           <fieldset>
            <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Request Type</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`relative flex items-start p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 ${formData.commType === 'sim' ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-600'}`}>
                <div className="flex h-5 items-center"><input type="radio" name="comm-type" value="sim" className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" checked={formData.commType === 'sim'} onChange={() => onChange('commType', 'sim')} /></div>
                <div className="ml-3 text-sm"><span className={`block font-medium ${formData.commType === 'sim' ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>New SIM Card</span><span className={`block mt-1 ${formData.commType === 'sim' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Voice & SMS enabled for corporate use</span></div>
                <div className={`absolute top-4 right-4 ${formData.commType === 'sim' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}><Signal size={20} /></div>
              </label>
              <label className={`relative flex items-start p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 ${formData.commType === 'bundle' ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-600'}`}>
                <div className="flex h-5 items-center"><input type="radio" name="comm-type" value="bundle" className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" checked={formData.commType === 'bundle'} onChange={() => onChange('commType', 'bundle')} /></div>
                <div className="ml-3 text-sm"><span className={`block font-medium ${formData.commType === 'bundle' ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>Data Bundle</span><span className={`block mt-1 ${formData.commType === 'bundle' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Add-on Internet Pack for existing line</span></div>
                <div className={`absolute top-4 right-4 ${formData.commType === 'bundle' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}><FileText size={20} /></div>
              </label>
            </div>
          </fieldset>
          <TextArea label="Justification / Business Need" placeholder="Explain why this is required..." value={formData.justification || ''} onChange={h('justification')} error={errors.justification} required className="min-h-[120px]" />
        </div>
      );
    case ServiceType.HOUSEKEEPING:
      const toggleService = (service: string) => {
        const current = formData.housekeepingServices || [];
        const updated = current.includes(service) ? current.filter((s: string) => s !== service) : [...current, service];
        onChange('housekeepingServices', updated);
      };
      return (
        <div className="space-y-6">
          <fieldset>
            <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Required Services</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['General Cleaner', 'Labor Support', 'Tea / Pantry Boy'].map((item) => (
                <label key={item} className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${(formData.housekeepingServices || []).includes(item) ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/20 ring-1 ring-indigo-600 dark:ring-indigo-400' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'}`}>
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={(formData.housekeepingServices || []).includes(item)} onChange={() => toggleService(item)} />
                  <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
                </label>
              ))}
            </div>
            {errors.housekeepingServices && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.housekeepingServices}</p>}
          </fieldset>
          <Input label="Location / Floor / Room" placeholder="e.g. 3rd Floor, Conference Room B" value={formData.location || ''} onChange={h('location')} error={errors.location} required />
          <TextArea label="Specific Tasks" placeholder="e.g. Deep cleaning required for..." value={formData.tasks || ''} onChange={h('tasks')} error={errors.tasks} className="min-h-[120px]" />
        </div>
      );
    case ServiceType.MAINTENANCE:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Maintenance Type" value={formData.maintenanceType || ''} onChange={h('maintenanceType')} error={errors.maintenanceType} options={[{ value: 'civil', label: 'Civil / Structural' }, { value: 'electrical', label: 'Electrical' }, { value: 'plumbing', label: 'Plumbing / Washroom' }, { value: 'carpentry', label: 'Carpentry / Furniture' }, { value: 'construction', label: 'Minor Construction' }]} required />
            <Input label="Location" placeholder="Specific area requiring maintenance" value={formData.location || ''} onChange={h('location')} error={errors.location} required />
          </div>
          <TextArea label="Problem Description" placeholder="Describe the issue in detail..." value={formData.description || ''} onChange={h('description')} error={errors.description} required className="min-h-[150px]" />
        </div>
      );
    default: return <p className="text-slate-500 italic">Form details not available.</p>;
  }
};