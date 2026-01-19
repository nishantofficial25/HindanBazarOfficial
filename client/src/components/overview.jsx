const Overview = (props) => {
  return (
    <div className="overview-container">
      <h1 className="overview-title">Owner Details</h1>
      <div className="overview-content">
        <div className="info-item">
          <div className="icon-wrapper">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="info-content">
            <p className="info-label">Owner</p>
            <p className="info-value">{props.data[0].owner.Username}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="icon-wrapper">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="info-content">
            <p className="info-label">Mobile (*Click on No. to call)</p>
            <a href=""><p className="info-value">{props.data[0].owner.mob} Call</p></a>
            
          </div>
        </div>

        <div className="info-item">
          <div className="icon-wrapper">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="info-content">
            <p className="info-label">Location</p>
            <p className="info-value">{props.data[0].owner.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

// CSS Styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background-color: #f5f5f5;
    padding: 20px;
  }

  .overview-container {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .overview-title {
    font-size: 28px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .overview-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background-color: #f7fafc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: #4a5568;
  }

  .info-content {
    flex: 1;
    min-width: 0;
  }

  .info-label {
    font-size: 14px;
    color: #718096;
    margin-bottom: 4px;
    font-weight: 400;
  }

  .info-value {
    font-size: 18px;
    color: #2d3748;
    font-weight: 600;
    word-wrap: break-word;
  }

  @media (max-width: 968px) {
    .overview-content {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 640px) {
    .overview-container {
      padding: 16px;
    }

    .overview-title {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .overview-content {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .info-item {
      gap: 12px;
    }

    .icon-wrapper {
      width: 40px;
      height: 40px;
    }

    .icon {
      width: 20px;
      height: 20px;
    }

    .info-label {
      font-size: 13px;
    }

    .info-value {
      font-size: 16px;
    }
  }

  @media (max-width: 375px) {
    body {
      padding: 10px;
    }

    .overview-container {
      padding: 12px;
    }

    .overview-title {
      font-size: 20px;
    }

    .info-value {
      font-size: 15px;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
