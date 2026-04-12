"use client";

import RichTextEditor from "./RichTextEditor";

interface BilingualInputProps {
  labelTr: string;
  labelEn: string;
  nameTr: string;
  nameEn: string;
  valueTr: string;
  valueEn: string;
  onChangeTr: (value: string) => void;
  onChangeEn: (value: string) => void;
  multiline?: boolean;
  richText?: boolean;
  required?: boolean;
}

export function BilingualInput({
  labelTr,
  labelEn,
  nameTr,
  nameEn,
  valueTr,
  valueEn,
  onChangeTr,
  onChangeEn,
  multiline = false,
  richText = false,
  required = false,
}: BilingualInputProps) {
  const inputClass =
    "w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm";

  function renderField(
    id: string,
    value: string,
    onChange: (value: string) => void,
    isRequired: boolean
  ) {
    if (richText) {
      return <RichTextEditor value={value} onChange={onChange} />;
    }
    if (multiline) {
      return (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={isRequired}
          rows={8}
          className={inputClass}
        />
      );
    }
    return (
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={isRequired}
        className={inputClass}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor={nameTr} className="block text-sm font-medium text-fg mb-1">
          {labelTr} (Türkçe) {required && <span className="text-red-500">*</span>}
        </label>
        {renderField(nameTr, valueTr, onChangeTr, required)}
      </div>
      <div>
        <label htmlFor={nameEn} className="block text-sm font-medium text-fg mb-1">
          {labelEn} (English)
        </label>
        {renderField(nameEn, valueEn, onChangeEn, false)}
      </div>
    </div>
  );
}
