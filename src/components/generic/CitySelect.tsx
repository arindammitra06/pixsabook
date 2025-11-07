"use client";

import { useState } from "react";
import { Combobox, useCombobox, Input } from "@mantine/core";
import { INDIAN_CITIES } from "@/utils/indianCities";
import { t } from "i18next";

export function CitySelect() {
  const combobox = useCombobox({  });
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const filtered =
    search.trim().length === 0
      ? []
      : INDIAN_CITIES.filter((c) =>
          c.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 20);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Input
          placeholder={t('select-location')}
          value={search}
          onChange={(event) => {
            const q = event.currentTarget.value;
            setSearch(q);
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {filtered.length > 0 ? (
            filtered.map((city) => (
              <Combobox.Option key={city} value={city}>
                {city}
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>{t('nothing-found-for-typed-chars')}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
