import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { adapter } from '@admin-ui/utils/data/adapter';
import { MDLJson } from '@admin-ui/utils/data/model';
import testData from '@admin-ui/testData';
import InfoModal, { useInfoModal } from '@admin-ui/components/infoModal';

const TestDataSelect = dynamic(
  () => import('@admin-ui/components/TestDataSelect'),
  { ssr: false }
);
const Diagram = dynamic(() => import('@accio/ui/src/lib/diagram'), {
  ssr: false,
});

export default function DiagramTest() {
  const [selectedValue, setSelectValue] = useState(Object.keys(testData)[0]);
  const [selectedData, setSelectedData] = useState(null);
  const { openInfoModal, closeInfoModal, infoModalProps } = useInfoModal();

  const onSelect = (value) => setSelectValue(value);

  useEffect(() => {
    setSelectedData(adapter(testData[selectedValue] as MDLJson));
  }, [selectedValue]);

  const onInfoIconClick = (data) => {
    openInfoModal(data);
  };

  return (
    <Layout className="gml-main">
      <TestDataSelect value={selectedValue} onSelect={onSelect} />
      <Diagram data={selectedData} onInfoIconClick={onInfoIconClick} />
      <InfoModal
        visible={infoModalProps.visible}
        title={infoModalProps.title}
        data={infoModalProps.data}
        onOk={closeInfoModal}
        onCancel={closeInfoModal}
      />
    </Layout>
  );
}

// This page will only available in development mode
export const getStaticProps = async () => {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return { props: {} };
};
