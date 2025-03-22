import React from "react";
import FeatureCard from "./FeatureCard.jsx"; // default export
import { FEATURES } from '../data';
import './Cards.css';

export default function Cards() {

    return(
        <section id="features">
          <div className="features-container">
                {FEATURES.map((item, index) => (
                    <FeatureCard 
                    key={item.title} 
                    {...item} 
                    index={index} 
                    />
                ))}
            </div>
        </section>
    );
}