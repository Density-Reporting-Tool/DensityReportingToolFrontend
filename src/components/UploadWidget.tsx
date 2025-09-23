import { useEffect, useRef } from "react";
import SolidBackgroundColorButton from "./button/SolidBackgroundColorButton";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";
const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "drt",
        uploadPreset: "drt-upload",
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
