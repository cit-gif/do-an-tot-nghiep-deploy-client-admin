import React from 'react'
import PropTypes from 'prop-types'

const ProgressLoading = props => {
      return (
            <div className="h-10 w-10 mx-auto p-2">
                  <span className={`w-full h-full rounded-full border-2 border-primary border-r-transparent animate-spin ${!props.show ? "hidden invisible" : "block"}`} />
            </div>
      )
}
ProgressLoading.propTypes = {
      show: PropTypes.bool.isRequired
}
export default ProgressLoading;
