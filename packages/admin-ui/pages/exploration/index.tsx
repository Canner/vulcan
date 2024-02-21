import { useRouter } from 'next/router';
import { Button } from 'antd';
import { Path } from '@vulcan-sql/admin-ui/utils/enum';
import { ExploreIcon } from '@vulcan-sql/admin-ui/utils/icons';
import SiderLayout from '@vulcan-sql/admin-ui/components/layouts/SiderLayout';
import SelectDataToExploreModal from '@vulcan-sql/admin-ui/components/pages/explore/SelectDataToExploreModal';
import Background from '@vulcan-sql/admin-ui/components/Background';
import useModalAction from '@vulcan-sql/admin-ui/hooks/useModalAction';

export default function Exploration() {
  const selectDataToExploreModal = useModalAction();
  const router = useRouter();

  // TODO: call API to get real exploration list data
  const data = [
    {
      id: 'id-1',
      name: 'global customer',
    },
    {
      id: 'id-2',
      name: 'customer order amount exceeding 5000 ',
    },
  ];

  const onSelect = (selectKeys: string[]) => {
    router.push(`${Path.Exploration}/${selectKeys[0]}`);
  };

  return (
    <SiderLayout loading={false} sidebar={{ data, onSelect }}>
      <Background />

      <div
        className="d-flex align-center justify-center"
        style={{ height: '100%' }}
      >
        <Button
          icon={<ExploreIcon className="mr-2" />}
          onClick={() => selectDataToExploreModal.openModal()}
        >
          Start from modeling
        </Button>
      </div>

      <SelectDataToExploreModal
        {...selectDataToExploreModal.state}
        onClose={selectDataToExploreModal.closeModal}
      />
    </SiderLayout>
  );
}
