import { useEffect, useRef } from "react";
import SolidBackgroundColorButton from "./button/SolidBackgroundColorButton";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";
const UploadWidget = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      },
      function (error, result) {
        console.log(result);
      },
    );
  }, []);
  return (
    <SolidBackgroundColorButton
      icon={<FileUploadIcon sx={{ fontSize: "1.25rem" }} />}
      handleClick={() => widgetRef.current.open()}
    >
      Upload Image
    </SolidBackgroundColorButton>
  );
};

export default UploadWidget;
