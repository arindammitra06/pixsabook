import { Select, SelectProps } from '@mantine/core';
export interface MySelectItem {
  value: string;
  label: string;
}

function coerceToMySelectItems(
  items: Array<{ value: string | number; label: string }>
): MySelectItem[] {
  return items.map((item) => ({
    value: String(item.value),
    label: item.label,
  }));
}

// 👇 Accept any valid SelectProps including itemComponent
export function AppCustomSelect(
  props: Omit<SelectProps, 'data'> & {
    data: Array<{ value: string | number; label: string }>;
  }
) {
  const { data, ...rest } = props;
  const coercedData = coerceToMySelectItems(data);

  return <Select {...rest} checkIconPosition="right" data={coercedData} />;
}
