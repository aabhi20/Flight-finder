import React from "react";

const ErrorMessage = ({ message, onRetry, type = "error" }) => {
  const getErrorStyles = () => {
    switch (type) {
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "text-yellow-400",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "text-blue-400",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
      default:
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-400",
          button: "bg-[#5948DB] hover:bg-[#4a3fd0] focus:ring-[#5948DB]",
        };
    }
  };

  const styles = getErrorStyles();

  // Base icon classes with vw units only, responsive sizing added for bigger screens
  const baseSize =
    "[width:5vw] [height:5vw] sm:[width:3vw] sm:[height:3vw] lg:[width:1.5vw] lg:[height:1.5vw]";

  const getIcon = () => {
    switch (type) {
      case "warning":
        return (
          <svg
            className={`${baseSize} ${styles.icon}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={`${baseSize} ${styles.icon}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${baseSize} ${styles.icon}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        rounded-[0.8vw] border p-[4vw] sm:p-[2.5vw] lg:p-[1.5vw]
        shadow-sm ${styles.container}
        [text-size:4vw] sm:[text-size:2.5vw] lg:[text-size:1.2vw]
        max-w-[80vw] sm:max-w-[60vw] lg:max-w-[50vw] mx-auto
      `}
    >
      <div className="flex items-start gap-[3vw] sm:gap-[1.5vw] lg:gap-[1vw]">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="[font-weight:600] mb-[2vw] sm:mb-[1vw] lg:mb-[0.5vw] [text-size:4.5vw] sm:[text-size:2.5vw] lg:[text-size:1.3vw]">
            {type === "warning"
              ? "Warning"
              : type === "info"
              ? "Information"
              : "Error"}
          </h3>
          <p className="[text-size:3.5vw] sm:[text-size:2.2vw] lg:[text-size:1.1vw]">
            {message}
          </p>
          {onRetry && (
            <div className="mt-[3vw] sm:mt-[1.5vw] lg:mt-[1vw]">
              <button
                type="button"
                onClick={onRetry}
                className={`
                  px-[5vw] py-[2.5vw] sm:px-[2.5vw] sm:py-[1vw] lg:px-[1.5vw] lg:py-[0.7vw]
                  rounded-[0.8vw] [color:white] [text-size:4vw] sm:[text-size:2.2vw] lg:[text-size:1vw]
                  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${styles.button}
                `}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
