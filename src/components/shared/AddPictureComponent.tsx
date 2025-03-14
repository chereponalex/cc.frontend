import React, { useEffect, useRef, useState } from "react";
import { UploadFile } from "./UploadFile";
import "../../views/ResidentialComplexes/FormResidentialComplex/index.css";
import { FieldInputProps, FieldProps, FormikProps } from "formik";

interface Image {
  url: string;
  formData?: FormData;
}
interface AddPictureProps<V = any, FormValues = any> {
  field: FieldInputProps<V>;
  form: FormikProps<any>;
  images: string[];
}

const AddPictureComponent = ({
  field,
  form,
  images,
}: AddPictureProps): JSX.Element => {
  const MAX_FILE_SIZE = 8 * 1024 * 1024;
  const [imagesData, setImagesData] = useState<string[]>(images);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  useEffect(() => {
    setImagesData(images);
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const files = e.target.files;
    const validFiles = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSize = file.size;
        if (fileSize > MAX_FILE_SIZE) {
          setFileErrors((prev) => [
            ...prev,
            `Размер файла ${file.name} превышает допустимый лимит в ${(
              MAX_FILE_SIZE /
              (1024 * 1024)
            ).toFixed(0)}мб`,
          ]);
          continue;
        }

        validFiles.push(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (event) => {
          if (reader.result && event.target?.result !== null) {
            form.setFieldValue(field.name, [
              ...imagesData,
              reader.result as string,
            ]);
            setFileErrors([]);
          }
        };
      }
    }
    e.target.value = "";
  };

  const deletePhoto = (index: number): void => {
    const filtered = imagesData.filter((_, i) => i !== index);
    form.setFieldValue(field.name, filtered);
  };

  return (
    <div>
      <UploadFile
        handleImageChange={handleImageChange}
        imagesUrl={imagesData}
        deletePhoto={deletePhoto}
      />
      <p className="text-red-500">
        {fileErrors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </p>
    </div>
  );
};

export default AddPictureComponent;
