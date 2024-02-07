import { useRouter } from 'next/router';
import { Drawer, Button, Typography } from 'antd';
import CompassOutlined from '@ant-design/icons/CompassOutlined';
import { NODE_TYPE, Path } from '@vulcan-sql/admin-ui/utils/enum';
import { DrawerAction } from '@vulcan-sql/admin-ui/hooks/useDrawerAction';
import FieldTable from '@vulcan-sql/admin-ui/components/table/FieldTable';
import CaculatedFieldTable from '@vulcan-sql/admin-ui/components/table/CaculatedFieldTable';
import MeasureFieldTable from '@vulcan-sql/admin-ui/components/table/MeasureFieldTable';
import DimensionFieldTable from '@vulcan-sql/admin-ui/components/table/DimensionFieldTable';
import WindowFieldTable from '@vulcan-sql/admin-ui/components/table/WindowFieldTable';
import RelationTableFormControl from '@vulcan-sql/admin-ui/components/tableFormControls/RelationTableFormControl';
import { makeMetadataBaseTable } from '@vulcan-sql/admin-ui/components/table/MetadataBaseTable';
import UpdateMetadataModal from '@vulcan-sql/admin-ui/components/modals/UpdateMetadataModal';

interface MetadataData {
  name: string;
  description: string;
  fields?: any[];
  caculatedFields?: any[];
  relations?: any[];
  measures?: any[];
  dimensions?: any[];
  windows?: any[];
  nodeType: NODE_TYPE;
}

type Props = DrawerAction<MetadataData>;

const ModelMetadata = ({
  name,
  fields = [],
  caculatedFields = [],
  relations = [],
}) => {
  const FieldMetadataTable =
    makeMetadataBaseTable(FieldTable)(UpdateMetadataModal);
  const CaculatedFieldMetadataTable =
    makeMetadataBaseTable(CaculatedFieldTable)(UpdateMetadataModal);

  const submitRelation = async (value) => {
    // TODO: waiting for API
    console.log(value);
  };

  const deleteRelation = async (value) => {
    // TODO: waiting for API
    console.log(value);
  };

  // To convert edit value for update metadata modal
  const editMetadataValue = (value) => {
    return {
      displayName: value.displayName || value.fieldName || value.name,
      description: value.description,
    };
  };

  const submitMetadata = (values) => {
    // TODO: waiting for API
    console.log(values);
  };

  return (
    <>
      <div className="mb-6">
        <Typography.Text className="d-block gray-7 mb-2">
          Fields ({fields.length})
        </Typography.Text>
        <FieldMetadataTable
          dataSource={fields}
          onEditValue={editMetadataValue}
          onSubmitRemote={submitMetadata}
        />
      </div>

      <div className="mb-6">
        <Typography.Text className="d-block gray-7 mb-2">
          Caculated fields ({caculatedFields.length})
        </Typography.Text>
        <CaculatedFieldMetadataTable
          dataSource={caculatedFields}
          onEditValue={editMetadataValue}
          onSubmitRemote={submitMetadata}
        />
      </div>

      <div className="mb-6">
        <Typography.Text className="d-block gray-7 mb-2">
          Relations ({relations.length})
        </Typography.Text>
        <RelationTableFormControl
          modalProps={{ model: name }}
          value={relations}
          onRemoteSubmit={submitRelation}
          onRemoteDelete={deleteRelation}
        />
      </div>
    </>
  );
};

const MetricMetadata = ({
  measures = [],
  dimensions = undefined,
  windows = undefined,
}) => {
  const MeasureFieldMetadataTable =
    makeMetadataBaseTable(MeasureFieldTable)(UpdateMetadataModal);
  const DimensionFieldMetadataTable =
    makeMetadataBaseTable(DimensionFieldTable)(UpdateMetadataModal);
  const WindowFieldMetadataTable =
    makeMetadataBaseTable(WindowFieldTable)(UpdateMetadataModal);

  // To convert edit value for update metadata modal
  const editMetadataValue = (value) => {
    return {
      displayName: value.displayName || value.fieldName || value.name,
      description: value.description,
    };
  };

  const submitMetadata = (values) => {
    // TODO: waiting for API
    console.log(values);
  };

  return (
    <>
      <div className="mb-6">
        <Typography.Text className="d-block gray-7 mb-2">
          Measures ({measures.length})
        </Typography.Text>
        <MeasureFieldMetadataTable
          dataSource={measures}
          onEditValue={editMetadataValue}
          onSubmitRemote={submitMetadata}
        />
      </div>

      {!!dimensions && (
        <div className="mb-6">
          <Typography.Text className="d-block gray-7 mb-2">
            Dimensions ({dimensions.length})
          </Typography.Text>
          <DimensionFieldMetadataTable
            dataSource={dimensions}
            onEditValue={editMetadataValue}
            onSubmitRemote={submitMetadata}
          />
        </div>
      )}

      {!!windows && (
        <div className="mb-6">
          <Typography.Text className="d-block gray-7 mb-2">
            Windows ({windows.length})
          </Typography.Text>
          <WindowFieldMetadataTable
            dataSource={windows}
            onEditValue={editMetadataValue}
            onSubmitRemote={submitMetadata}
          />
        </div>
      )}
    </>
  );
};

export default function MetadataDrawer(props: Props) {
  const { visible, defaultValue, onClose } = props;
  const { name, description, nodeType = NODE_TYPE.MODEL } = defaultValue;
  const router = useRouter();

  const goToExplore = () => {
    router.push(Path.Explore);
  };

  return (
    <Drawer
      visible={visible}
      title={name}
      width={750}
      closable
      destroyOnClose
      onClose={onClose}
      footer={
        <div className="text-right">
          <Button
            type="primary"
            icon={<CompassOutlined />}
            onClick={goToExplore}
          >
            Explore data
          </Button>
        </div>
      }
    >
      <div className="mb-6">
        <Typography.Text className="d-block gray-7 mb-2">
          Description
        </Typography.Text>
        <div>{description || '-'}</div>
      </div>

      {nodeType === NODE_TYPE.MODEL && <ModelMetadata {...defaultValue} />}
      {nodeType === NODE_TYPE.METRIC && <MetricMetadata {...defaultValue} />}
    </Drawer>
  );
}