import dynamic from 'next/dynamic';
import { Button, Typography } from 'antd';
import CopyOutlined from '@ant-design/icons/lib/icons/CopyOutlined';
import UpCircleOutlined from '@ant-design/icons/UpCircleOutlined';
import PreviewData from '@vulcan-sql/admin-ui/components/ask/PreviewData';

const CodeBlock = dynamic(
  () => import('@vulcan-sql/admin-ui/components/editor/CodeBlock'),
  { ssr: false }
);

const { Text } = Typography;

export interface Props {
  isViewSQL?: boolean;
  isViewFullSQL?: boolean;
  isPreviewData?: boolean;
  onCloseCollapse: () => void;
  onCopyFullSQL?: () => void;
  sql: string;
}

export default function CollapseContent(props: Props) {
  const {
    isViewSQL,
    isViewFullSQL,
    isPreviewData,
    onCloseCollapse,
    onCopyFullSQL,
    sql,
  } = props;
  return (
    <>
      {(isViewSQL || isViewFullSQL) && (
        <pre className="p-0 my-2">
          <CodeBlock code={sql} showLineNumbers />
        </pre>
      )}
      {isPreviewData && (
        <div className="my-2">
          <PreviewData sql={sql} />
        </div>
      )}
      {(isViewSQL || isPreviewData) && (
        <div className="d-flex justify-space-between">
          <Button
            className="gray-6"
            type="text"
            size="small"
            icon={<UpCircleOutlined />}
            onClick={onCloseCollapse}
          >
            Collapse
          </Button>
          {isPreviewData && (
            <Text className="gray-6">Showing up to 500 rows</Text>
          )}
        </div>
      )}
      {isViewFullSQL && (
        <>
          <Button
            className="gray-6 mr-2"
            type="text"
            size="small"
            icon={<UpCircleOutlined />}
            onClick={onCloseCollapse}
          >
            Collapse
          </Button>
          <Button
            className="gray-6"
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={onCopyFullSQL}
          >
            Copy
          </Button>
        </>
      )}
    </>
  );
}