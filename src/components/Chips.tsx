import * as React from 'react';

interface ChipsProps {
  title?: number | string
  index?: string
  handleClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

function Chips({
  title = '',
  index = '',
  handleClick = () => {}
}: ChipsProps) {
    return (
        <div
            key={index}
            id={index}
            onClick={handleClick}
            className={`min-w-[150px] h-[100px] items-center mr-[10px] mb-[10px] bg-slate-200 rounded-3xl flex flex-col  ${index === 'popup' ? 'text-6xl justify-start' : 'text-base justify-center'}`}
        >
                {title}
        </div>
    )
}

export default Chips;