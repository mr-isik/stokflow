import React from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};

const MaxWidthWrapper = (props: Props) => {
    return (
        <div className={`max-w-7xl mx-auto px-2 md:px-4 ${props.className}`}>
            {props.children}
        </div>
    );
};

export default MaxWidthWrapper;
