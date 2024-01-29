import { useState } from 'react';
import { JOIN_TYPE, SETUP } from '@vulcan-sql/admin-ui/utils/enum';
import { useRouter } from 'next/router';
import { SelectedRecommendRelationsProps } from '@vulcan-sql/admin-ui/components/pages/setup/DefineRelations';

export default function useSetupRelations() {
  const [stepKey, setStepKey] = useState(SETUP.RECOMMEND_RELATIONS);
  const [selectedRecommendRelations, setSelectedRecommendRelations] = useState<
    SelectedRecommendRelationsProps | undefined
  >(undefined);

  const router = useRouter();

  const submitReleations = async (
    relations: SelectedRecommendRelationsProps
  ) => {
    // TODO: implement submitReleations API
    router.push('/modeling');
  };

  const onBack = () => {
    if (stepKey === SETUP.DEFINE_RELATIONS) {
      setStepKey(SETUP.RECOMMEND_RELATIONS);
    } else {
      router.push('/setup/models');
    }
  };

  const onNext = (data: {
    selectedRecommendRelations: SelectedRecommendRelationsProps;
    relations: SelectedRecommendRelationsProps;
  }) => {
    if (stepKey === SETUP.RECOMMEND_RELATIONS) {
      setSelectedRecommendRelations(data.selectedRecommendRelations);
      setStepKey(SETUP.DEFINE_RELATIONS);
    }

    if (stepKey === SETUP.DEFINE_RELATIONS) {
      submitReleations(data.relations);
    }
  };

  return {
    stepKey,
    recommendRelations,
    selectedRecommendRelations,
    onBack,
    onNext,
  };
}

// TODO: remove it when connecting to backend
const recommendRelations = [
  {
    name: 'Customer',
    relations: [
      {
        relationName: 'Customer_Order',
        fromField: { model: 'Customer', field: 'custkey' },
        toField: { model: 'Orders', field: 'custkey' },
        relationType: JOIN_TYPE.ONE_TO_MANY,
        isAutoGenerated: true,
      },
      {
        relationName: 'Customer_trans',
        fromField: { model: 'Customer', field: 'custkey' },
        toField: { model: 'trans', field: 'custkey' },
        relationType: JOIN_TYPE.ONE_TO_MANY,
        isAutoGenerated: true,
      },
    ],
  },
  {
    name: 'Order',
    relations: [
      {
        relationName: 'Order_Lineitem',
        fromField: { model: 'Order', field: 'orderkey' },
        toField: { model: 'Lineitem', field: 'orderkey' },
        relationType: JOIN_TYPE.ONE_TO_MANY,
        isAutoGenerated: true,
      },
    ],
  },
];
