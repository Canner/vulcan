import { useMemo } from 'react';
import { makeTableFormControl } from './base';
import AddWindowFieldModal, {
  WindowFieldValue,
} from '@vulcan-sql/admin-ui/components/modals/AddWindowFieldModal';
import { getWindowFieldTableColumns } from '@vulcan-sql/admin-ui/components/table/WindowFieldTable';

export type WindowTableValue = WindowFieldValue[];

type Props = Omit<React.ComponentProps<typeof TableFormControl>, 'columns'>;

const TableFormControl = makeTableFormControl(AddWindowFieldModal);

export default function WindowTableFormControl(props: Props) {
  const columns = useMemo(getWindowFieldTableColumns, [props.value]);
  return <TableFormControl {...props} columns={columns} />;
}
