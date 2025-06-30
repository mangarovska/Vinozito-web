import React from "react";
import PersonCard from "./PersonCard";
import profileImg from "/ana.jpg";
import profileImg2 from "/anja2.jpg";

export default function ExpertSection() {
  return (
    <section className="flex justify-center gap-6 flex-wrap">
      <PersonCard
          name="Ana Mangarovska"
          title="Developer & Designer"
          // description=""
          image={profileImg}
        />
        <PersonCard
          name="Anastazija Kovachevikj"
          title="Developer & Designer"
          // description=""
          image={profileImg2}
        />
    </section>
  );
}
