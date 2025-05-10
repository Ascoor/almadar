// LitigationModal.jsx

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl"; // استخدام السمة للتحكم في موضوعات النهار والليل

const schema = yup.object().shape({
  case_number: yup.string().required("يرجى إدخال رقم الدعوى"),
  court: yup.string().required("يرجى إدخال اسم المحكمة"),
  opponent: yup.string().required("يرجى إدخال اسم الخصم"),
  subject: yup.string().required("يرجى إدخال الموضوع"),
});

export default function LitigationModal({
  isOpen,
  onClose,
  initialData,
  reloadLitigations,
  theme,
}) {
  const intl = useIntl();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data) => {
    try {
      // Add your API call here to save litigation data
      toast.success(intl.formatMessage({ id: "litigation.save_success" }));
      onClose();
      reloadLitigations();
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "litigation.save_error" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={intl.formatMessage({ id: "litigation.modal_title" })} theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="case_number" className="block text-sm font-medium text-gray-700">
            {intl.formatMessage({ id: "litigation.case_number" })}
          </label>
          <input
            type="text"
            id="case_number"
            name="case_number"
            ref={register}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.case_number && (
            <p className="mt-1 text-red-500 text-sm">{errors.case_number.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="court" className="block text-sm font-medium text-gray-700">
            {intl.formatMessage({ id: "litigation.court" })}
          </label>
          <input
            type="text"
            id="court"
            name="court"
            ref={register}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.court && <p className="mt-1 text-red-500 text-sm">{errors.court.message}</p>}
        </div>

        <div>
          <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
            {intl.formatMessage({ id: "litigation.opponent" })}
          </label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            ref={register}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.opponent && (
            <p className="mt-1 text-red-500 text-sm">{errors.opponent.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            {intl.formatMessage({ id: "litigation.subject" })}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            ref={register}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.subject && (
            <p className="mt-1 text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button type="button" onClick={() => onClose()} className="mr-2">
            <FormattedMessage id="litigation.cancel_button" />
          </Button>
          <Button type="submit" className="bg-blue-500 text-white">
            <FormattedMessage id="litigation.save_button" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
