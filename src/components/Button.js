import PropTypes from "prop-types";

const Button = ({ text, color, onClick }) => {
  return (
    <button onClick={onClick} style={{ backgroundColor: color }}>
      {text}
    </button>
  );
};

Button.defaultProps = {
  text: "text",
  color: "black",
};

Button.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
};
export default Button;
