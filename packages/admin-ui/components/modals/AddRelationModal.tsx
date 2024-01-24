import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { ERROR_TEXTS } from '@vulcan-sql/admin-ui/utils/error';
import CombineFieldSelector from '@vulcan-sql/admin-ui/components/selectors/CombineFieldSelector';
import { JOIN_TYPE } from '@vulcan-sql/admin-ui/utils/enum';
import { getJoinTypeText } from '@vulcan-sql/admin-ui/utils/data';
import useCombineFieldOptions from '@vulcan-sql/admin-ui/hooks/useCombineFieldOptions';

interface Props {
  model: string;
  visible: boolean;
  onSubmit: (values: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  defaultValue?: {
    relationType: string;
    fromField: {
      model: string;
      field: string;
    };
    toField: {
      model: string;
      field: string;
    };
    relationName: string;
    description: string;
  };
}

export default function AddRelationModal(props: Props) {
  const { model, visible, loading, onSubmit, onClose, defaultValue } = props;
  const [form] = Form.useForm();

  const relationTypeOptions = Object.keys(JOIN_TYPE).map((key) => ({
    label: getJoinTypeText(key),
    value: JOIN_TYPE[key],
  }));

  const fromCombineField = useCombineFieldOptions({ model });
  const toCombineField = useCombineFieldOptions({
    model: defaultValue?.toField.model,
    excludeModels: [model],
  });

  const submit = () => {
    form
      .validateFields()
      .then(async (values) => {
        await onSubmit(values);
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal
      title="Add relation"
      width={750}
      visible={visible}
      okText="Submit"
      onOk={submit}
      onCancel={onClose}
      confirmLoading={loading}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        preserve={false}
        layout="vertical"
        initialValues={{
          relationType: defaultValue?.relationType,
          fromField: defaultValue?.fromField,
          toField: defaultValue?.toField,
          relationName: defaultValue?.relationName,
          description: defaultValue?.description,
        }}
      >
        <Form.Item
          label="Name"
          name="relationName"
          required
          rules={[
            {
              required: true,
              message: ERROR_TEXTS.ADD_RELATION.NAME.REQUIRED,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="From field"
              name="fromField"
              required
              rules={[
                {
                  required: true,
                  message: ERROR_TEXTS.ADD_RELATION.FROM_FIELD.REQUIRED,
                },
              ]}
            >
              <CombineFieldSelector
                modelValue={model}
                modelDisabled={true}
                onModelChange={fromCombineField.onModelChange}
                modelOptions={fromCombineField.modelOptions}
                fieldOptions={fromCombineField.fieldOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="To field"
              name="toField"
              required
              rules={[
                {
                  required: true,
                  message: ERROR_TEXTS.ADD_RELATION.TO_FIELD.REQUIRED,
                },
              ]}
            >
              <CombineFieldSelector
                onModelChange={toCombineField.onModelChange}
                modelOptions={toCombineField.modelOptions}
                fieldOptions={toCombineField.fieldOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Relation type"
          name="relationType"
          required
          rules={[
            {
              required: true,
              message: ERROR_TEXTS.ADD_RELATION.RELATION_TYPE.REQUIRED,
            },
          ]}
        >
          <Select
            options={relationTypeOptions}
            placeholder="Select a relation type"
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea showCount maxLength={300} />
        </Form.Item>
      </Form>
    </Modal>
  );
}