import React from 'react';

export default function DogCSS({ talking = false }) {
  return (
    <div className="dog">
      <div className="leg-front leg-front--left"></div>
      <div className="leg-front leg-front--right"></div>
      <div className="leg-back leg-back--left"></div>
      <div className="tail"></div>
      <div className="head">
        <div className="neck"></div>
        <div className="ear ear--left"></div>
        <div className="ear ear--right"></div>
        <div className="face">
          <div className="eye eye--left"></div>
          <div className="eye eye--right"></div>
          <div className="nose"></div>
          <div className={`mouth ${talking ? `mouth--talking` : ``}`}></div>
        </div>
      </div>
      <div className="body"></div>
      <div className="leg-back leg-back--right"></div>
    </div>
  );
}
