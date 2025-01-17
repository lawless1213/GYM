import { useState } from 'react';
import { Combobox, Input, InputBase, Loader, useCombobox } from '@mantine/core';

export function SelectAsync({ title, callback }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        callback()
          .then((loadedData) => {
            setData(Array.isArray(loadedData) ? loadedData : []);
          })
          .catch((error) => {
            console.error("Failed to load data:", error);
            setData([]); // У разі помилки встановлюємо порожній масив
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
  });

  const options =
    data.length !== 0 ? (
      data.map((item) => (
        <Combobox.Option value={item} key={item}>
          {item}
        </Combobox.Option>
      ))
    ) : (
      <Combobox.Empty>No data loaded</Combobox.Empty>
    );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value || <Input.Placeholder>{title}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {loading ? <Combobox.Empty>Loading...</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
