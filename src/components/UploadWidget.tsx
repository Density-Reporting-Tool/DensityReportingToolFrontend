import { useEffect, useRef } from "react";
import SolidBackgroundColorButton from "./button/SolidBackgroundColorButton";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";

interface CloudinaryUploadWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface Cloudinary {
  createUploadWidget: (options: {
    cloudName: string;
    uploadPreset: string;
  }) => CloudinaryUploadWidget;
}

const UploadWidget = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryRef = useRef<Cloudinary | undefined>();
  const widgetRef = useRef<CloudinaryUploadWidget | undefined>();

  useEffect(() => {
    const cloudinary = (window as any).cloudinary as Cloudinary | undefined;
    if (cloudinary) {
      cloudinaryRef.current = cloudinary;
      widgetRef.current = cloudinary.createUploadWidget({
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
