import React from "react";
import styled from "styled-components";

export default function InputWithIcon({ icon, type, placeholder, name }) {
  return (
    <StyledWrapper>
      <div className="group">
        <div className="icon">{icon}</div>
        <input
          className="input"
          type={type}
          name={name}
          placeholder={placeholder}
          required
        />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .group {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    height: 45px;
    padding-left: 3rem;
    border: 2px solid transparent;
    border-radius: 10px;
    background-color: #f8fafc;
    color: #0d0c22;
    transition: 0.5s ease;
  }

  .input::placeholder {
    color: #94a3b8;
  }

  .input:focus,
  .input:hover {
    border-color: rgba(129, 140, 248);
    background-color: #fff;
    box-shadow: 0 0 0 5px rgb(129 140 248 / 30%);
  }

  .icon {
    position: absolute;
    left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .icon svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke: #94a3b8;
  }
`;
