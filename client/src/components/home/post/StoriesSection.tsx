import React, { useState } from "react";
import "../Home.scss";
const StoriesSection = ({ stories }: any) => {
  const [currentStory, setCurrentStory] = useState(0);

  const handleNext = () => {
    if (currentStory < stories.length - 4) {
      setCurrentStory((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1);
    }
  };

  return (
    <div className="stories-section">
      {currentStory > 0 && (
        <button className="story-nav left" onClick={handleBack}>
          &#10094;
        </button>
      )}
      <div className="story-items">
        {stories
          .slice(currentStory, currentStory + 4)
          .map((story: any, index: any) => (
            <div
              key={story.id}
              className={`story-item ${index === 0 ? "partial-left" : ""} ${
                index === 3 ? "partial-right" : ""
              }`}
            >
              <img src={story.image} alt={story.user} className="story-image" />
              <div className="story-user">{story.user}</div>
            </div>
          ))}
      </div>
      {currentStory < stories.length - 4 && (
        <button className="story-nav right" onClick={handleNext}>
          &#10095;
        </button>
      )}
    </div>
  );
};

export default StoriesSection;
