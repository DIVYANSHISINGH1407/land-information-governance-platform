import { Link } from "react-router-dom";

function Logo({ light }) {
  const className = light ? "logo logo-light" : "logo";

  return (
    <Link to="/" className={className}>
      <span className="logo-mark">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="16" stroke={light ? "#d7e1cd" : "#315d3b"} strokeWidth="1.7" />
          <ellipse
            cx="20"
            cy="20"
            rx="7"
            ry="16"
            stroke={light ? "#b8c8ad" : "#789476"}
            strokeWidth="1.2"
          />
          <path
            d="M5 20h30M8 13h24M8 27h24"
            stroke={light ? "#b8c8ad" : "#789476"}
            strokeWidth="1.2"
          />
          <path
            d="M20 11c-2 3-4 4-6 5 2 1 4 3 5 6 1-3 3-5 6-6-3-1-4-3-5-5Z"
            fill={light ? "#d7e1cd" : "#789476"}
          />
        </svg>
      </span>
      <span className="logo-text">
        Bhumi<span>Setu</span>
      </span>
    </Link>
  );
}

export default Logo;
