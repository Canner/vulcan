import { useState } from 'react';
import { DATA_SOURCES, SETUP } from '@vulcan-sql/admin-ui/utils/enum';

export default function useSetupConnection() {
  const [stepKey, setStepKey] = useState(SETUP.STARTER);
  const [dataSource, setDataSource] = useState(DATA_SOURCES.BIG_QUERY);

  const submitDataSource = async (data: any) => {
    // TODO: implement submitDataSource API
  };

  const onBack = () => {
    if (stepKey === SETUP.CREATE_DATA_SOURCE) {
      setStepKey(SETUP.STARTER);
    }
  };

  const onNext = (data?: { dataSource: DATA_SOURCES }) => {
    if (stepKey === SETUP.STARTER) {
      setDataSource(data?.dataSource);
      setStepKey(SETUP.CREATE_DATA_SOURCE);
    } else if (stepKey === SETUP.CREATE_DATA_SOURCE) {
      submitDataSource(data);
    }
  };

  return {
    stepKey,
    dataSource,
    onBack,
    onNext,
  };
}
