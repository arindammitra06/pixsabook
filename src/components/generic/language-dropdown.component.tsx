import { Select } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { changeLanguage } from '../../store/slices/language.slice';
import { IconChevronDown, IconLanguage } from '@tabler/icons-react';
import { AppCustomSelect } from '../generic/app-select.componnent';

const LanguageDropdown = () => {
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();

    const changeLanguageOnClick = (lng: string | undefined) => {
        i18n.changeLanguage(lng);
        handleLanguageChange(lng);
    };
    const handleLanguageChange = (newLanguage: string | undefined) => {
        dispatch(changeLanguage(newLanguage));
    };
    return (
        <AppCustomSelect
            value={i18n.language}
            onChange={(e: any) => changeLanguageOnClick(e)}
            label=""
            data={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
                { value: 'bn', label: 'Bengali' },
                { value: 'ur', label: 'Urdu' },
            ]}
            placeholder="Select Language"
            //rightSection={<IconChevronDown size={16} />}
            leftSection={<IconLanguage size={16} />}
            styles={{
                input: {
                    paddingLeft: '2.25rem', // space for the icon
                },
            }}
            checkIconPosition="right"
            w={140}
            p={0}
            withAsterisk={false} />
    );
};

export default LanguageDropdown;