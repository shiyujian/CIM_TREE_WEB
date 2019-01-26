import React from 'react';

const Content = ({children}) => {
    return (
        <div style={{overflow: 'hidden', padding: 20}}>
            {children}
        </div>
    );
};

Content.propTypes = {};
Content.defaultProps = {};

export default Content;
