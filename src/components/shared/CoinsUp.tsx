import React from "react";
import "../../views/ManagerPage/index.css";

type CustomCSSProperties = React.CSSProperties & {
  "--coin-to-x"?: string;
  "--coin-to-y"?: string;
  "--coin-delay"?: string;
};

const CoinsUp = ({ value = false }: { value?: boolean }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="wrap">
      <div className="wallet" id="wallet">
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-100px + 24px)",
              "--coin-to-y": "calc(-105px + 24px)",
              "--coin-delay": "0.3s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-70px + 24px)",
              "--coin-to-y": "-90px",
              "--coin-delay": "0.1s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-30px + 24px)",
              "--coin-to-y": "-125px",
              "--coin-delay": "0s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(10px + 24px)",
              "--coin-to-y": "-130px",
              "--coin-delay": "0.2s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(30px + 24px)",
              "--coin-to-y": "-100px",
              "--coin-delay": "0.1s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(70px + 24px)",
              "--coin-to-y": "-95px",
              "--coin-delay": "0.4s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(100px + 24px)",
              "--coin-to-y": "-100px",
              "--coin-delay": "0.2s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-120px + 24px)",
              "--coin-to-y": "calc(-115px + 24px)",
              "--coin-delay": "0.5s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-50px + 24px)",
              "--coin-to-y": "-80px",
              "--coin-delay": "0.15s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(-10px + 24px)",
              "--coin-to-y": "-140px",
              "--coin-delay": "0.25s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(20px + 24px)",
              "--coin-to-y": "-110px",
              "--coin-delay": "0.35s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(50px + 24px)",
              "--coin-to-y": "-85px",
              "--coin-delay": "0.45s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(90px + 24px)",
              "--coin-to-y": "-120px",
              "--coin-delay": "0.55s",
            } as CustomCSSProperties
          }
        ></div>
        <div
          className="coin coin--animated"
          style={
            {
              "--coin-to-x": "calc(110px + 24px)",
              "--coin-to-y": "-95px",
              "--coin-delay": "0.6s",
            } as CustomCSSProperties
          }
        ></div>
      </div>
    </div>
  );
};

export default CoinsUp;

{
  /* <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(-120px + 24px)",
              "--dollar-to-y": "calc(-110px + 24px)",
              "--dollar-delay": "0.3s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(-80px + 24px)",
              "--dollar-to-y": "-100px",
              "--dollar-delay": "0.1s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(-40px + 24px)",
              "--dollar-to-y": "-130px",
              "--dollar-delay": "0s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(20px + 24px)",
              "--dollar-to-y": "-140px",
              "--dollar-delay": "0.2s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(40px + 24px)",
              "--dollar-to-y": "-110px",
              "--dollar-delay": "0.1s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(80px + 24px)",
              "--dollar-to-y": "-105px",
              "--dollar-delay": "0.4s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div>
        <div
          className="dollar dollar--animated"
          style={
            {
              "--dollar-to-x": "calc(120px + 24px)",
              "--dollar-to-y": "-110px",
              "--dollar-delay": "0.2s",
            } as CustomCSSProperties
          }
        >
          ₽
        </div> */
}
