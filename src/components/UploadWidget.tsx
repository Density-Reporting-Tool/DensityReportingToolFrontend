import { useEffect, useRef } from "react";
import SolidBackgroundColorButton from "./button/SolidBackgroundColorButton";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";

type CloudinaryWidget = {
  open: () => void;
};

type CloudinaryInstance = {
  createUploadWidget: (
    options: { cloudName: string; uploadPreset: string },
  ) => CloudinaryWidget;
};

declare global {
  interface Window {
    cloudinary?: CloudinaryInstance;
  }
}

const UploadWidget = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryRef = useRef<CloudinaryInstance | null>(null);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  useEffect(() => {
    if (!window.cloudinary) {
      return;
    }

    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: cloudName,
      uploadPreset: uploadPreset,
    });
  }, [cloudName, uploadPreset]);
  return (
    <SolidBackgroundColorButton
      icon={<FileUploadIcon sx={{ fontSize: "1.25rem" }} />}
      handleClick={() => widgetRef.current?.open()}
    >
      Upload Image
    </SolidBackgroundColorButton>
  );
};

export default UploadWidget;
