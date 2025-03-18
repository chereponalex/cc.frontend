import { Button } from "../ui";
import { FaTrashAlt } from "react-icons/fa";
import { useRef } from "react";

type UploadFileProps = {
  deletePhoto: any;
  handleImageChange: any;
  imagesUrl: string[];
};

export const UploadFile = ({
  handleImageChange,
  imagesUrl,
  deletePhoto,
}: UploadFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    fileInputRef.current?.click();
  };
  return (
    <div>
      {imagesUrl?.length > 0 && (
        <div style={{ flexWrap: "wrap", maxWidth: "750px" }}>
          {/* {imagesUrl.map((photo: string, i: number) => {
            return (
              <div
                key={i}
                style={{ display: "inline-flex", position: "relative" }}
              >
                <FaTrashAlt
                  size={20}
                  onClick={() => deletePhoto(i)}
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "20px",
                    zIndex: 3,
                    cursor: "pointer",
                  }}
                />
                <img
                  key={i}
                  style={{
                    width: photo && "100%",
                    height: photo && "156px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    marginRight: "15px",
                    objectFit: "contain",
                  }}
                  src={photo || ""}
                />
              </div>
            );
          })} */}
        </div>
      )}
      <div>
        <Button type="button" size="xs" onClick={(e) => handleButtonClick(e)}>
          <label htmlFor="upload-input">
            <div className="cursor-pointer">Добавить фото</div>
          </label>
        </Button>

        <input
          type="file"
          id="upload-input"
          className="upload-input"
          onChange={handleImageChange}
          multiple
          accept=".jpg, .jpeg, .png .gif .svg"
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};
