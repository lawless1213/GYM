import { useState, useEffect } from "react";
import { Text, Image, ActionIcon, Box, Stack } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconX } from '@tabler/icons-react';

const VIDEO_MIME_TYPE = ["video/mp4", "video/webm", "video/ogg"];

function MyDropzone({isVideo = false}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Stack gap="md">
			{!preview && 
				<Dropzone
					accept={ isVideo ? VIDEO_MIME_TYPE : IMAGE_MIME_TYPE }
					onDrop={(files) => setFile(files[0])}
					maxFiles={1}
					style={{ cursor: "pointer", padding: 20, border: "1px dashed #ddd", height: "160px" }}
				>
					<Text ta="center">Drop a single { isVideo ? 'video' : 'image' } here</Text>
				</Dropzone>
			}
      

      {preview && (
        <Box style={{ position: "relative", height: "160px", width: "100%" }}>
					{ isVideo 
					? 
						<Box
							component="video"
							height="100%"
							width="100%"
							style={{ objectFit: "contain" }}
							src={preview}
							autoPlay
							muted
							loop
						>
							Your browser does not support the video tag.
						</Box>
					: 
						<Image 
							src={preview} 
							alt="Preview"
							height="100%"
							width="100%"
							fit="contain" 
						/> 
					}
          

          <ActionIcon
            size="sm"
            variant="border"
            onClick={removeFile}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
          >
            <IconX />
          </ActionIcon>
        </Box>
      )}
    </Stack>
  );
}

export default MyDropzone;