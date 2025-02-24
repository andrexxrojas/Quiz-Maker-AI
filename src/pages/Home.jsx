// Other
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { useState } from "react";

// Styling
import "../styles/homeStyle.css";

// Components


function Home({ onOpenModal }) {
    return(
        <div className="home-container">
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
                }}>
                <ShaderGradientCanvas>
                    <ShaderGradient
                        control="query"
                        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23121213&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.1&uStrength=1.7&uTime=8&wireframe=false"
                    />
                </ShaderGradientCanvas>
                </div>

                <div className="hero-section">
                    <h1>Create Smart Quizzes Instantly</h1>
                    <p>
                        Generate interactive quizzes in seconds using AI.
                        Customize, share, and analyze results effortlessly.
                    </p>
                    <button onClick={ () => onOpenModal("register") }>Get Started</button>
                </div>
        </div>
    )
}

export default Home;