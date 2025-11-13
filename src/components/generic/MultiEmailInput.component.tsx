import React, { FC, useState, KeyboardEvent, useEffect } from "react";
import { TextInput, Pill, Group, Text, useMantineTheme } from "@mantine/core";
import { t } from "i18next";

export interface MultiEmailInputProps {
  /** The current list of emails */
  emailList: string[];
  error: any;

  /** Callback when the email list changes */
  onChange?: (emails: string[]) => void;

  /** Optional label for the input */
  label?: string;

  /** Optional placeholder text */
  placeholder?: string;
}

export const MultiEmailInput: FC<MultiEmailInputProps> = ({
  emailList = [],
  onChange,
  error,
  label = "Invite people by email",
  placeholder = "Enter email and press Enter, space, or semicolon",
}) => {
  const [inputValue, setInputValue] = useState("");
  const theme = useMantineTheme();
  
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const addEmail = (value: string) => {
    if (!value.trim()) return;

    const newEmails = value
      .split(/[;, ]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && isValidEmail(e));

    const updated = Array.from(new Set([...emailList, ...newEmails]));
    onChange?.(updated);
    setInputValue("");
  };

  const removeEmail = (email: string) => {
    const updated = emailList.filter((e) => e !== email);
    onChange?.(updated);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const separators = [";", ",", " "];
    if (separators.includes(event.key) || event.key === "Enter") {
      event.preventDefault();
      addEmail(inputValue);
    }
  };

  return (
    <div>
      <TextInput
        size="sm"
        radius="md"
        error={error}
        label={
          <Text fw={600} c={theme.primaryColor}>
            {t("invitees")}
          </Text>
        }
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addEmail(inputValue)}
      />

      {emailList.length > 0 && (
        <Group mt="xs" gap="xs">
          {emailList.map((email) => (
            <Pill
              key={email}
              withRemoveButton
              onRemove={() => removeEmail(email)}
            >
              {email}
            </Pill>
          ))}
        </Group>
      )}
    </div>
  );
};
