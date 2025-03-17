import { useState, useEffect } from "react";
import { MultiSelect, Loader } from "@mantine/core";
import { useTranslation } from "react-i18next";

export function MultiSelectAsync({
  title,
  translateKey = "",
  selectedValue = [],
  onSelect,
  disabled,
  data = [],
  loading = false,
  onFirstOpen,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(selectedValue);
  const [opened, setOpened] = useState(false);
  const [internalData, setInternalData] = useState(data);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  const handleOpen = async () => {
    if (!opened && internalData.length === 0 && !loading && onFirstOpen) {
      try {
        const loadedData = await onFirstOpen();
        setInternalData(Array.isArray(loadedData) ? loadedData : []);
      } catch (error) {
        console.error("Failed to load data:", error);
        setInternalData([]);
      }
    }
    setOpened(true);
  };

  const options = internalData.map((item) => ({
    value: item,
    label: t(`${translateKey}${item}`),
  }));

  return (
    <MultiSelect
      data={options}
      value={value}
      onChange={(val) => {
        setValue(val);
        onSelect?.(val);
      }}
      checkIconPosition="right"
      searchable
      onSearchChange={setSearch}
      searchValue={search}
      placeholder={title}
      nothingFoundMessage={loading ? <Loader size="xs" /> : "Nothing found"}
      onDropdownOpen={handleOpen}
      clearable
      max={10}
      disabled={disabled || undefined}
    />
  );
}