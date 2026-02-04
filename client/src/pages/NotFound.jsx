import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/AppIcon.jsx";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md">
        <Icon
          name="SearchX"
          size={64}
          className="text-accent/30 mx-auto"
          strokeWidth={1}
        />

        <h1 className="text-6xl font-bold text-primary font-accent mt-8 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-primary mb-3">
          Page Not Found
        </h2>

        <p className="text-lg text-text-secondary mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>

          <Button
            variant="default"
            size="lg"
            iconName="Home"
            iconPosition="left"
            onClick={handleGoHome}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
