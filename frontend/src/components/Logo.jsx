function Logo({ light }) {
  const className = light ? "logo logo-light" : "logo";

  return (
    <a href="#home" className={className}>
      <span className="logo-mark">
        {/* Same globe + leaf logo as before */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="20"
            cy="20"
            r="19"
            fill={light ? "rgba(255,255,255,0.18)" : "#1b4332"}
          />
          <ellipse
            cx="20"
            cy="20"
            rx="11"
            ry="18"
            stroke="#d8e5d8"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <ellipse
            cx="20"
            cy="20"
            rx="18"
            ry="7.5"
            stroke="#d8e5d8"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <path
            d="M20 9c-1.6 3.8-5 6.4-7.5 7.6 2.5 1 5 3.8 6.3 8.9 1.3-5.1 3.8-7.9 6.3-8.9C22.6 15.4 20.8 12.8 20 9z"
            fill="#95b89a"
          />
          <circle cx="20" cy="20" r="2.2" fill="#f7f3eb" />
        </svg>
      </span>
      <span className="logo-text">
        Bhoomi<span>Setu</span>
      </span>
    </a>
  );
}

export default Logo;
