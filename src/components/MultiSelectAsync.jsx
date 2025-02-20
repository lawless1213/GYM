import { useState } from 'react';
import { MultiSelect, Loader, CloseButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function MultiSelectAsync({ title, translateKey = '', selectedValue = [], onFirstOpen, onSelect, disabled }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(selectedValue);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (!opened && data.length === 0 && !loading) {
      setLoading(true);
      onFirstOpen()
        .then((loadedData) => {
          setData(Array.isArray(loadedData) ? loadedData : []);
        })
        .catch((error) => {
          console.error("Failed to load data:", error);
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setOpened(true);
  };

  const options = data.map((item) => ({ value: item, label: t(`${translateKey}${item}`) }));

  return (
    <MultiSelect
      data={options}
      value={value}
      onChange={(val) => {
        setValue(val);
        if (onSelect) {
          onSelect(val);
        }
      }}
			checkIconPosition="right"
      searchable
      onSearchChange={setSearch}
      searchValue={search}
      placeholder={title}
      nothingFound={loading ? "Loading..." : "Nothing found"}
			nothingFoundMessage="Nothing found..."
      onDropdownOpen={handleOpen}
			clearable
			max={10}
			disabled={disabled ? true : undefined}
    />
  );
}
