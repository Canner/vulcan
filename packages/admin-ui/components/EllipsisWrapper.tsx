import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  text?: string;
  children?: ReactNode;
}

export default function EllipsisWrapper(props: Props) {
  const { text, children } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(undefined);
  const hasWidth = width !== undefined;

  // Auto setup client width itself
  useEffect(() => {
    if (ref.current && !hasWidth) {
      const cellWidth = ref.current.clientWidth;
      setWidth(cellWidth);
    }
  }, []);

  const renderContent = () => {
    if (!children) return text || '-';
    return children;
  };

  return (
    <div ref={ref} className="text-truncate" title={text} style={{ width }}>
      {hasWidth ? renderContent() : null}
    </div>
  );
}