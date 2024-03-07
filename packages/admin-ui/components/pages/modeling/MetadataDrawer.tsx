import { Drawer, Button } from 'antd';
import { NODE_TYPE } from '@vulcan-sql/admin-ui/utils/enum';
import { DrawerAction } from '@vulcan-sql/admin-ui/hooks/useDrawerAction';
import { SparklesIcon } from '@vulcan-sql/admin-ui/utils/icons';
import ModelMetadata, {
  Props as ModelMetadataProps,
} from './metadata/ModelMetadata';
import MetricMetadata, {
  Props as MetricMetadataProps,
} from './metadata/MetricMetadata';
import ViewMetadata, {
  Props as ViewMetadataProps,
} from './metadata/ViewMetadata';
import useModalAction from '@vulcan-sql/admin-ui/hooks/useModalAction';
import GenerateMetadataModal from '@vulcan-sql/admin-ui/components/pages/modeling/GenerateMetadataModal';

type Metadata = { nodeType: NODE_TYPE } & ModelMetadataProps &
  MetricMetadataProps &
  ViewMetadataProps;

type Props = DrawerAction<Metadata>;

export default function MetadataDrawer(props: Props) {
  const { visible, defaultValue, onClose } = props;
  const { displayName, nodeType = NODE_TYPE.MODEL } = defaultValue || {};

  const generateMetadataModal = useModalAction();
  const openGeneratedMetadataModal = () => {
    // TODO: put generated metadata in
    generateMetadataModal.openModal(defaultValue);
  };

  const submitGenerateMetadata = async (values) => {
    console.log(values);
  };

  return (
    <Drawer
      visible={visible}
      title={`${displayName}'s metadata`}
      width={750}
      closable
      destroyOnClose
      onClose={onClose}
      footer={
        <div className="text-right">
          <Button
            className="d-inline-flex align-center"
            icon={<SparklesIcon className="mr-2" />}
            onClick={openGeneratedMetadataModal}
          >
            Generate metadata
          </Button>
        </div>
      }
    >
      {nodeType === NODE_TYPE.MODEL && <ModelMetadata {...defaultValue} />}
      {nodeType === NODE_TYPE.METRIC && <MetricMetadata {...defaultValue} />}
      {nodeType === NODE_TYPE.VIEW && <ViewMetadata {...defaultValue} />}

      <GenerateMetadataModal
        {...generateMetadataModal.state}
        onClose={generateMetadataModal.closeModal}
        onSubmit={submitGenerateMetadata}
      />
    </Drawer>
  );
}
