import { useEffect, useRef } from "react";
import SolidBackgroundColorButton from "./button/SolidBackgroundColorButton";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";

interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

const UploadWidget = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryRef = useRef<typeof window.cloudinary>();
  const widgetRef = useRef<CloudinaryUploadWidget | undefined>();

  useEffect(() => {
    if (window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      });
    }
  }, [cloudName, uploadPreset]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <SolidBackgroundColorButton
      icon={<FileUploadIcon sx={{ fontSize: "1.25rem" }} />}
      handleClick={handleClick}
    >
      Upload Image
    </SolidBackgroundColorButton>
  );
};

export default UploadWidget;
