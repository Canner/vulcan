import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Divider } from 'antd';
import { Path } from '@vulcan-sql/admin-ui/utils/enum';
import SiderLayout from '@vulcan-sql/admin-ui/components/layouts/SiderLayout';
import AnswerResult from '@vulcan-sql/admin-ui/components/ask/AnswerResult';

const AnswerResultsBlock = styled.div`
  width: 768px;
  margin-left: auto;
  margin-right: auto;

  h4.ant-typography {
    margin-top: 10px;
  }

  .ant-typography pre {
    border: none;
    border-radius: 4px;
  }

  .ace_editor {
    border: none;
  }

  button {
    vertical-align: middle;
  }
`;

export default function AnswerBlock() {
  const router = useRouter();

  // TODO: call API to get real exploration list data
  const data = [];

  const onSelect = (selectKeys: string[]) => {
    router.push(`${Path.ASK}/${selectKeys[0]}`);
  };

  // TODO: call API to get real answer results
  const answerResults = [
    {
      status: 'finished',
      query: 'What is our MoM of sales revenue in 2023?',
      summary: 'MoM of sales revenue in 2023',
      sql: 'SELECT * FROM customer',
      description:
        'To calculate the Month-over-Month (MoM) growth rate of sales revenue in 2023. We can use `sales` model to calculate MoM.',
      steps: [
        {
          summary:
            'First, we calculate the total revenue for each month in 2023 with `sales` model.',
          sql: `SELECT * FROM Revenue`,
        },
        {
          summary:
            "Then, we calculate the previous month's revenue for each month.",
          sql: `WITH Revenue AS (\n    SELECT \n      custkey,\n      orderstatus,\n      sum(totalprice) as totalprice\n    FROM Orders\n    GROUP BY 1, 2\n)\nSELECT * FROM Revenue`,
        },
        {
          summary:
            "At last, we calculate the Month-over-Month growth rate as a percentage. This is done by subtracting the previous month's revenue from the current month's revenue, dividing by the previous month's revenue, and then multiplying by 100 to get a percentage.",
          sql: 'SELECT *\nFROM tpch.sf1.lineitem\nlimit 200',
        },
      ],
    },
  ];

  return (
    <SiderLayout loading={false} sidebar={{ data, onSelect }}>
      <AnswerResultsBlock className="my-12">
        {answerResults.map((answerResult, index) => (
          <div key={`${answerResult.query}-${index}`}>
            {index > 0 && <Divider />}
            <AnswerResult
              answerResultSteps={answerResult.steps}
              description={answerResult.description}
              loading={answerResult.status !== 'finished'}
              question={answerResult.query}
              sql={answerResult.sql}
            />
          </div>
        ))}
      </AnswerResultsBlock>
    </SiderLayout>
  );
}
