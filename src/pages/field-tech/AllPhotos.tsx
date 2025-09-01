import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  IconButton,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import HeaderWithBackButton from "@/components/headers/HeaderWithBackButton";
import OutlineButton from "@/components/button/OutlineButton";
import { useState } from "react";
import SolidBackgroundColorButton from "@/components/button/SolidBackgroundColorButton";

const JobDetails: React.FC = () => {
  const { jobId, reportId } = useParams<{ jobId: string; reportId: string }>();
  const [selectedImage, setSelectedImage] = useState<(typeof images)[0] | null>(
    null,
  );

  const [open, setOpen] = useState(false);
  const handleNewPhoto = () => {
    console.log("Create new photo");
  };
  const handleClose = () => setOpen(false);

  const handleClickPhoto = (image: (typeof images)[0]) => {
    setSelectedImage(image); // save which image was clicked
    setOpen(true); // open the modal
  };

  const handleDelete = () => {
    console.log("Delete");
  };
  const handleEdit = () => {
    console.log("Edit");
  };

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

          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 10,
            }}
            onClick={handleNewPhoto}
          >
            <AddIcon />
          </Button>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {images.map((image) => (
            <Grid item xs={4} key={image.id}>
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
      <Modal open={open} onClose={handleClose}>
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
              onClick={handleClose}
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
    </>
  );
};

export default JobDetails;
