import React from "react";
// import FeatureCard from "./FeatureCard.jsx"; 
import { FEATURES } from '../../data.js';
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