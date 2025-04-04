import React, { useRef, useState } from "react";
import { Carousel, ConfigProvider } from "antd";
import no_photo from "../../../public/img/real-estate-building/no_photo.png";
import { Loading } from "@/components/shared";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
interface CarouselProps {
  images: string[];
}

const CarouselComponent = ({ images }: CarouselProps) => {
  // const [isLoading, setIsLoading] = useState<Record<string, boolean>>(() => {
  //   return images?.reduce(
  //     (acc, el, index) => {
  //       acc[index] = true;
  //       return acc;
  //     },
  //     {} as Record<string, boolean>,
  //   );
  // });

  const handleImageLoad = (index: number) => {
    // setIsLoading((prevState) => ({
    //   ...prevState,
    //   [index]: false,
    // }));
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              arrowSize: 35,
            },
          },
        }}
      >
        <div>
          <img src={`${no_photo}`} className="img-carousel" />
          {/* {
          images?.length > 0 ? (
            <Carousel
              arrows
              infinite={false}
              dots={false}
              adaptiveHeight={true}
            >
              {images?.map((image: string, index: number) => {
                return (
                  <Loading type="cover" key={index} loading={isLoading[index]}>
                    <img
                      className="img-carousel"
                      src={image}
                      alt="фото"
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                    />
                  </Loading>
                );
              })}
            </Carousel>
          ) : (
            
            <img src={`${no_photo}`} className="img-carousel" />
          )} */}
        </div>
      </ConfigProvider>
    </>
  );
};

export default CarouselComponent;
