import PropTypes from "prop-types";

const ProgressBar = (props) => {
      return (
            <div className='w-full relative rounded-full bg-primaryLight shadow-lg'>
                  <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold z-[1] transition-all'>{props.value}%</span>
                  <div className='text-center py-2 bg-primary rounded-full transition-all' style={{ width: props.value + "%" }} />
            </div>
      );
};
ProgressBar.propTypes = {
      value: PropTypes.number.isRequired,
};
export default ProgressBar;
