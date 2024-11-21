import "./css/UserStatusIndicator.css";

const UserStatusIndicator = ({ status }) => {
    const getDisplayText = (status) => {
      switch (status) {
        case 'customer':
          return 'Customer';
        case 'staff': 
          return 'Staff';
        case 'admin':
          return 'Admin';
        case 'banned':
          return 'Banned';
        default:
          return status;
      }
    };
  
    return (
      <div className={`statusIndicator ${status}`}>
        <h1>{ getDisplayText(status) }</h1>
      </div>
    );
};
  
export default UserStatusIndicator;