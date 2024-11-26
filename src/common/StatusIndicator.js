import "./css/StatusIndicator.css";

const StatusIndicator = ({ status }) => {
    const getDisplayText = (status) => {
      switch (status) {
        case 'pending':
          return 'Pending';
        case 'cancellation-requested': 
          return 'Cancellation Requested';
        case 'cancelled':
          return 'Cancelled';
        case 'unpaid':
          return 'Unpaid';
        case 'paid':
          return 'Paid';
        case 'ongoing':
          return 'Ongoing';
        default:
          return status;
      }
    };
  
    return (
      <div className={`statusIndicator ${status}`}>
        <h1>{getDisplayText(status)}</h1>
      </div>
    );
};
  
export default StatusIndicator;