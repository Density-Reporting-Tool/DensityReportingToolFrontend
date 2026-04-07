import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  IconButton,
  Stack,
  MenuItem,
  Menu,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import OutlineButton from "@/components/button/OutlineButton";
import { useState } from "react";
import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";
import { Photo } from "@/types/photos";

const images = [
  {
    id: 1,
    title: "Description",
    updated: "Today",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 2,
    title: "Another photo",
    updated: "Yesterday",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 3,
    title: "Another photo",
    updated: "Yesterday",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 4,
    title: "City view",
    updated: "2 days ago",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 5,
    title: "A really long title for testing",
    updated: "Last week",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 6,
    title: "Sunset",
    updated: "Last month",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 7,
    title: "Ocean waves",
    updated: "Today",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 8,
    title: "Forest trail",
    updated: "3 days ago",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: 9,
    title: "Snowy field",
    updated: "Yesterday",
    src: "https://placehold.co/125",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const [selectedImage, setSelectedImage] = useState<(typeof images)[0] | null>(
    null,
  );
  const [openSelectedImageModal, setOpenSelectedImageModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);

  const [addImageMenu, setAddImageMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(addImageMenu);

  const handleClickSelect = () => {
    if (!selectMode) {
      setSelectedPhotos([]);
    }
    setSelectMode(!selectMode);
  };

  const handleClickPhoto = (image: Photo) => {
    if (selectMode) {
      setSelectedPhotos((prev) => {
        const isSelected = prev.some((photo) => photo.id === image.id);
        if (isSelected) {
          return prev.filter((photo) => photo.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      setSelectedImage(image);
      setOpenSelectedImageModal(true);
    }
  };

  const handleOpenAddPhotoMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAddImageMenu(event.currentTarget);
  };

  const handleCloseAddPhotoMenu = () => {
    setAddImageMenu(null);
  };

  const handleFinalizeSelect = () => {
    console.log(selectedPhotos);
    navigate(-1);
  };

  const handleDelete = () => {
    console.log("Delete");
  };
  const handleEdit = () => {
    console.log("Edit");
  };

  const handleClickUpload = () => {
    handleCloseAddPhotoMenu();
    console.log("upload photo");
  };
  const handleClickTakePhoto = () => {
    handleCloseAddPhotoMenu();
    console.log("take photo");
  };

  return (
    <>
      <HeaderWithBackButton
        title={`Job #${jobId}`}
        subtitle={`Report ${reportId}`}
      />
      <Container maxWidth="xl" sx={{ my: 3, mb: 12 }}>
        {/* Recent Reports */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Report Photos</Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              sx={{ borderRadius: 10 }}
              onClick={handleClickSelect}
            >
              {selectMode ? "Cancel" : "Select"}
            </Button>

            <Button
              variant="contained"
              disableElevation
              aria-controls={openMenu ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              sx={{
                borderRadius: 10,
              }}
              onClick={handleOpenAddPhotoMenu}
            >
              <AddIcon />
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={addImageMenu}
              open={openMenu}
              onClose={handleCloseAddPhotoMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleClickUpload}>Upload</MenuItem>
              <MenuItem onClick={handleClickTakePhoto}>Take photo</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {images.map((image) => (
            <Grid
              item
              xs={4}
              key={image.id}
              className="photos"
              sx={{
                border:
                  selectedPhotos.some((photo) => photo.id === image.id) &&
                  selectMode
                    ? "2px solid green "
                    : "none",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Box onClick={() => handleClickPhoto(image)}>
                <Box
                  component="img"
                  sx={{
                    borderRadius: 2,
                    width: "100%",
                  }}
                  alt="Report photos"
                  src={image.src}
                />
                <Typography
                  variant="body1"
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Fig {image.id}: {image.title}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {image.updated}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Overlay */}
      <Modal
        open={openSelectedImageModal}
        onClose={() => setOpenSelectedImageModal(false)}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Modal content */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "80vh",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => setOpenSelectedImageModal(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "black",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                borderRadius: 2,
                maxHeight: "80vh",
                overflowY: "auto",
                p: 2,
                pt: 5,
              }}
            >
              {selectedImage && (
                <Stack sx={{ my: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {selectedImage.updated}
                  </Typography>
                  <Box
                    component="img"
                    src={selectedImage.src}
                    alt="Overlay"
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 1,
                    }}
                  />
                  <Typography sx={{ my: 2 }}>
                    Fig {selectedImage.id}: {selectedImage.title}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    {selectedImage.description}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "flex-end" }}
                    gap={1}
                  >
                    <OutlineButton handleClick={handleEdit}>Edit</OutlineButton>
                    <SolidBackgroundColorButton handleClick={handleDelete}>
                      Delete
                    </SolidBackgroundColorButton>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      {selectMode && (
        <Box sx={{ position: "fixed", bottom: 20, left: 20, right: 20 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleFinalizeSelect}
            sx={{
              py: 1.5,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            Select {selectedPhotos.length} photos
          </Button>
        </Box>
      )}
    </>
  );
};

export default JobDetails;
