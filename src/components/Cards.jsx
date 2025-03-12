import React from "react";
import { FEATURES } from '../data';
import './Cards.css';
import CardFeature from "./CardFeature.jsx";

export default function Cards() {
    return (
        <section id="features">
          <div className="features-container">
                {FEATURES.map((item) => (
                    <CardFeature
                        key={item.title} 
                        bgColor={item.bgColor} 
                        borderColor={item.borderColor} 
                        image={item.image} 
                        header={item.title} 
                        paragraph={item.paragraph} 
                    />
                ))}
            </div>
        </section>
    );
}
