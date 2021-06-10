import './resizable.css';
import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth * 0.7);

  useEffect(() => {
    let delay: NodeJS.Timeout;

    const externalResizeEvent = () => {
      if (delay) clearTimeout(delay);

      delay = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);

        if (window.innerWidth * 0.7 < width) setWidth(window.innerWidth * 0.7);
      }, 100);
    };

    window.addEventListener('resize', externalResizeEvent);
    return () => window.removeEventListener('resize', externalResizeEvent);
  }, [width]);

  let resizerOpt: ResizableBoxProps;
  if (direction === 'horizontal') {
    resizerOpt = {
      className: 'resize-horizontal',
      height: Infinity,
      width,
      resizeHandles: ['e'],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      lockAspectRatio: false,
      onResizeStop: (event, data) => setWidth(data.size.width),
    };
  } else {
    resizerOpt = {
      height: innerHeight * 0.3,
      width: Infinity,
      resizeHandles: ['s'],
      minConstraints: [Infinity, 25],
      maxConstraints: [Infinity, innerHeight * 0.9],
      lockAspectRatio: false,
    };
  }
  return <ResizableBox {...resizerOpt}>{children}</ResizableBox>;
};

export default Resizable;
