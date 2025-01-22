import { useState } from 'react';
import { CloseButton, Combobox, Input, InputBase, Loader, useCombobox } from '@mantine/core';

export function SelectAsync({ title, onFirstOpen, onSelect }) {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch('');
    },
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        onFirstOpen()
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
      data
      .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
      .map((item) => (
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
        if (onSelect) {
          onSelect(val);
        }
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={
            value !== null ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setValue(null);
                  if (onSelect) {
                    onSelect('');
                  }
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents={value === null ? 'none' : 'all'}
        >
          {value || <Input.Placeholder>{title}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search groceries"
        />
        <Combobox.Options>
          {loading ? <Combobox.Empty>Loading...</Combobox.Empty> : options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
