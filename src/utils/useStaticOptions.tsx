import { IconHome2, IconArtboard, IconSearch, IconBriefcase2, IconReceipt2, IconSettings, IconUsersGroup } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Option = {
    value: string;
    label: string;
    icon?: any;
    color?: string;
    roles?: string[];
};

type StaticOptions = {
    relationshipArray: Option[];
    fullDayHalfDay: Option[];
    genders: Option[];
    attendanceState: Option[];
    daysOfWeek: Option[];
    educationLevels: Option[];
    maritalStatuses: Option[];
    monthsArray: Option[];
    dateTimeFormatArray: Option[];
    dateFormatArray:Option[];
    countries: Option[];
    languages: Option[];
    menus: Option[];
    quality: Option[];
    features: Option[]
};

export function useStaticOptions(): StaticOptions {
    const { t } = useTranslation();

    const features = useMemo(() => [
        { value: t('feature-lifetime'), label: t('feature-lifetime-desc'),icon: IconHome2 , color:'green' },
        { value: t('feature-easy-to-use'), label: t('feature-easy-to-use-desc'),icon: IconArtboard , color:'orange' },
        { value: t('feature-customizable'), label: t('feature-customizable-desc'),icon: IconSearch , color:'blue' },
        { value: t('feature-cloud-storage'), label: t('feature-cloud-storage-desc'),icon: IconBriefcase2 , color:'yellow' },
    ], [t]); 
    const daysOfWeek = useMemo(() => [
        { value: 'su', label: t('sunday') },
        { value: 'mo', label: t('monday') },
        { value: 'tu', label: t('tuesday') },
        { value: 'we', label: t('wednesday') },
        { value: 'th', label: t('thursday') },
        { value: 'fr', label: t('friday') },
        { value: 'sa', label: t('saturday') },
    ], [t]);

    const fullDayHalfDay = useMemo(() => [
        { value: "FullDay", label: t('full_day') },
        { value: "HalfDay", label: t('half_day') }
    ], [t]);

    const attendanceState = useMemo(() => [
        { value: "UnMarked", label: t('unmarked') },
        { value: "Present", label: t('present') },
        { value: "Absent", label: t('absent') },
        { value: "Holiday", label: t('holiday') },
        { value: "Leave", label: t('leave') }
    ], [t]);


    const relationshipArray = useMemo(() => [
        { value: 'NA_PARENTTYPE', label: t('not_applicable') },
        { value: 'Aunt', label: t('aunt') },
        { value: 'BrotherInLaw', label: t('bro_in_law') },
        { value: 'Cousin', label: t('cousin') },
        { value: 'Daughter', label: t('daughter') },
        { value: 'DaughterInLaw', label: t('dau_in_law') },
        { value: 'Father', label: t('father') },
        { value: 'FatherInLaw', label: t('fath_in_law') },
        { value: 'GrandFather', label: t('gr_father') },
        { value: 'GrandMother', label: t('gr_mother') },
        { value: 'Husband', label: t('husband') },
        { value: 'LegalGuardian', label: t('legal_guardian') },
        { value: 'Mother', label: t('mother') },
        { value: 'MotherInLaw', label: t('mot_in_law') },
        { value: 'Nephew', label: t('nephew') },
        { value: 'Sister', label: t('sister') },
        { value: 'SisterInLaw', label: t('sis_in_law') },
        { value: 'Son', label: t('son') },
        { value: 'SonInLaw', label: t('son_in_law') },
        { value: 'Uncle', label: t('uncle') },
        { value: 'Wife', label: t('wife') },
    ], [t]);

    const genders = useMemo<Option[]>(() => [
        { value: 'Male', label: t('male') },
        { value: 'Female', label: t('female') },
        { value: 'Other', label: t('other') },
    ], [t]);

    const educationLevels = useMemo<Option[]>(() => [
        { value: 'Primary', label: t('primary') },
        { value: 'Secondary', label: t('secondary') },
        { value: 'Graduate', label: t('graduate') },
        { value: 'PostGraduate', label: t('post_graduate') },
        { value: 'Doctorate', label: t('doctorate') },
    ], [t]);

    const maritalStatuses = useMemo<Option[]>(() => [
        { value: 'Single', label: t('single') },
        { value: 'Married', label: t('married') },
        { value: 'Divorced', label: t('divorced') },
        { value: 'Widowed', label: t('widowed') },
    ], [t]);

    const monthsArray = useMemo<Option[]>(() => [
        { value: '0', label: t('january') },
        { value: '1', label: t('february') },
        { value: '2', label: t('march') },
        { value: '3', label: t('april') },
        { value: '4', label: t('may') },
        { value: '5', label: t('june') },
        { value: '6', label: t('july') },
        { value: '7', label: t('august') },
        { value: '8', label: t('september') },
        { value: '9', label: t('october') },
        { value: '10', label: t('november') },
        { value: '11', label: t('december') },
    ], [t]);

    const dateTimeFormatArray = useMemo<Option[]>(() => [
        { value: 'MM/DD/YYYY hh:mm A', label: 'MM/DD/YYYY hh:mm A (USA)' },
        { value: 'DD/MM/YYYY HH:mm', label: 'DD/MM/YYYY HH:mm (UK, France, Brazil)' },
        { value: 'DD-MM-YYYY hh:mm A', label: 'DD-MM-YYYY hh:mm A (India)' },
        { value: 'DD.MM.YYYY HH:mm', label: 'DD.MM.YYYY HH:mm (Germany, Russia)' },
        { value: 'YYYY/MM/DD HH:mm', label: 'YYYY/MM/DD HH:mm (China)' },
        { value: 'YYYY. MM. DD. HH:mm', label: 'YYYY. MM. DD. HH:mm (South Koria)' },
        { value: 'DD/MM/YYYY hh:mm A', label: 'DD/MM/YYYY hh:mm A (Saudi Arabia)' },
    ], []);

    const dateFormatArray = useMemo<Option[]>(() => [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
        { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
        { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
        { value: 'YYYY. MM. DD.', label: 'YYYY. MM. DD.' },
    ], []);

    const countries = useMemo<Option[]>(() => [
        { label: 'Afghanistan', value: 'AF' },
        { label: 'Albania', value: 'AL' },
        { label: 'Algeria', value: 'DZ' },
        { label: 'Andorra', value: 'AD' },
        { label: 'Angola', value: 'AO' },
        { label: 'Antigua and Barbuda', value: 'AG' },
        { label: 'Argentina', value: 'AR' },
        { label: 'Armenia', value: 'AM' },
        { label: 'Australia', value: 'AU' },
        { label: 'Austria', value: 'AT' },
        { label: 'Azerbaijan', value: 'AZ' },
        { label: 'Bahamas', value: 'BS' },
        { label: 'Bahrain', value: 'BH' },
        { label: 'Bangladesh', value: 'BD' },
        { label: 'Barbados', value: 'BB' },
        { label: 'Belarus', value: 'BY' },
        { label: 'Belgium', value: 'BE' },
        { label: 'Belize', value: 'BZ' },
        { label: 'Benin', value: 'BJ' },
        { label: 'Bhutan', value: 'BT' },
        { label: 'Bolivia', value: 'BO' },
        { label: 'Bosnia and Herzegovina', value: 'BA' },
        { label: 'Botswana', value: 'BW' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Brunei', value: 'BN' },
        { label: 'Bulgaria', value: 'BG' },
        { label: 'Burkina Faso', value: 'BF' },
        { label: 'Burundi', value: 'BI' },
        { label: 'Cabo Verde', value: 'CV' },
        { label: 'Cambodia', value: 'KH' },
        { label: 'Cameroon', value: 'CM' },
        { label: 'Canada', value: 'CA' },
        { label: 'Central African Republic', value: 'CF' },
        { label: 'Chad', value: 'TD' },
        { label: 'Chile', value: 'CL' },
        { label: 'China', value: 'CN' },
        { label: 'Colombia', value: 'CO' },
        { label: 'Comoros', value: 'KM' },
        { label: 'Congo (Congo-Brazzaville)', value: 'CG' },
        { label: 'Costa Rica', value: 'CR' },
        { label: 'Croatia', value: 'HR' },
        { label: 'Cuba', value: 'CU' },
        { label: 'Cyprus', value: 'CY' },
        { label: 'Czech Republic', value: 'CZ' },
        { label: 'Denmark', value: 'DK' },
        { label: 'Djibouti', value: 'DJ' },
        { label: 'Dominica', value: 'DM' },
        { label: 'Dominican Republic', value: 'DO' },
        { label: 'Ecuador', value: 'EC' },
        { label: 'Egypt', value: 'EG' },
        { label: 'El Salvador', value: 'SV' },
        { label: 'Equatorial Guinea', value: 'GQ' },
        { label: 'Eritrea', value: 'ER' },
        { label: 'Estonia', value: 'EE' },
        { label: 'Eswatini', value: 'SZ' },
        { label: 'Ethiopia', value: 'ET' },
        { label: 'Fiji', value: 'FJ' },
        { label: 'Finland', value: 'FI' },
        { label: 'France', value: 'FR' },
        { label: 'Gabon', value: 'GA' },
        { label: 'Gambia', value: 'GM' },
        { label: 'Georgia', value: 'GE' },
        { label: 'Germany', value: 'DE' },
        { label: 'Ghana', value: 'GH' },
        { label: 'Greece', value: 'GR' },
        { label: 'Grenada', value: 'GD' },
        { label: 'Guatemala', value: 'GT' },
        { label: 'Guinea', value: 'GN' },
        { label: 'Guinea-Bissau', value: 'GW' },
        { label: 'Guyana', value: 'GY' },
        { label: 'Haiti', value: 'HT' },
        { label: 'Honduras', value: 'HN' },
        { label: 'Hungary', value: 'HU' },
        { label: 'Iceland', value: 'IS' },
        { label: 'India', value: 'IN' },
        { label: 'Indonesia', value: 'ID' },
        { label: 'Iran', value: 'IR' },
        { label: 'Iraq', value: 'IQ' },
        { label: 'Ireland', value: 'IE' },
        { label: 'Israel', value: 'IL' },
        { label: 'Italy', value: 'IT' },
        { label: 'Jamaica', value: 'JM' },
        { label: 'Japan', value: 'JP' },
        { label: 'Jordan', value: 'JO' },
        { label: 'Kazakhstan', value: 'KZ' },
        { label: 'Kenya', value: 'KE' },
        { label: 'Kiribati', value: 'KI' },
        { label: 'Kuwait', value: 'KW' },
        { label: 'Kyrgyzstan', value: 'KG' },
        { label: 'Laos', value: 'LA' },
        { label: 'Latvia', value: 'LV' },
        { label: 'Lebanon', value: 'LB' },
        { label: 'Lesotho', value: 'LS' },
        { label: 'Liberia', value: 'LR' },
        { label: 'Libya', value: 'LY' },
        { label: 'Liechtenstein', value: 'LI' },
        { label: 'Lithuania', value: 'LT' },
        { label: 'Luxembourg', value: 'LU' },
        { label: 'Madagascar', value: 'MG' },
        { label: 'Malawi', value: 'MW' },
        { label: 'Malaysia', value: 'MY' },
        { label: 'Maldives', value: 'MV' },
        { label: 'Mali', value: 'ML' },
        { label: 'Malta', value: 'MT' },
        { label: 'Marshall Islands', value: 'MH' },
        { label: 'Mauritania', value: 'MR' },
        { label: 'Mauritius', value: 'MU' },
        { label: 'Mexico', value: 'MX' },
        { label: 'Micronesia', value: 'FM' },
        { label: 'Moldova', value: 'MD' },
        { label: 'Monaco', value: 'MC' },
        { label: 'Mongolia', value: 'MN' },
        { label: 'Montenegro', value: 'ME' },
        { label: 'Morocco', value: 'MA' },
        { label: 'Mozambique', value: 'MZ' },
        { label: 'Myanmar (Burma)', value: 'MM' },
        { label: 'Namibia', value: 'NA' },
        { label: 'Nauru', value: 'NR' },
        { label: 'Nepal', value: 'NP' },
        { label: 'Netherlands', value: 'NL' },
        { label: 'New Zealand', value: 'NZ' },
        { label: 'Nicaragua', value: 'NI' },
        { label: 'Niger', value: 'NE' },
        { label: 'Nigeria', value: 'NG' },
        { label: 'North Korea', value: 'KP' },
        { label: 'North Macedonia', value: 'MK' },
        { label: 'Norway', value: 'NO' },
        { label: 'Oman', value: 'OM' },
        { label: 'Pakistan', value: 'PK' },
        { label: 'Palau', value: 'PW' },
        { label: 'Panama', value: 'PA' },
        { label: 'Papua New Guinea', value: 'PG' },
        { label: 'Paraguay', value: 'PY' },
        { label: 'Peru', value: 'PE' },
        { label: 'Philippines', value: 'PH' },
        { label: 'Poland', value: 'PL' },
        { label: 'Portugal', value: 'PT' },
        { label: 'Qatar', value: 'QA' },
        { label: 'Romania', value: 'RO' },
        { label: 'Russia', value: 'RU' },
        { label: 'Rwanda', value: 'RW' },
        { label: 'Saint Kitts and Nevis', value: 'KN' },
        { label: 'Saint Lucia', value: 'LC' },
        { label: 'Saint Vincent and the Grenadines', value: 'VC' },
        { label: 'Samoa', value: 'WS' },
        { label: 'San Marino', value: 'SM' },
        { label: 'Sao Tome and Principe', value: 'ST' },
        { label: 'Saudi Arabia', value: 'SA' },
        { label: 'Senegal', value: 'SN' },
        { label: 'Serbia', value: 'RS' },
        { label: 'Seychelles', value: 'SC' },
        { label: 'Sierra Leone', value: 'SL' },
        { label: 'Singapore', value: 'SG' },
        { label: 'Slovakia', value: 'SK' },
        { label: 'Slovenia', value: 'SI' },
        { label: 'Solomon Islands', value: 'SB' },
        { label: 'Somalia', value: 'SO' },
        { label: 'South Africa', value: 'ZA' },
        { label: 'South Korea', value: 'KR' },
        { label: 'South Sudan', value: 'SS' },
        { label: 'Spain', value: 'ES' },
        { label: 'Sri Lanka', value: 'LK' },
        { label: 'Sudan', value: 'SD' },
        { label: 'Suriname', value: 'SR' },
        { label: 'Sweden', value: 'SE' },
        { label: 'Switzerland', value: 'CH' },
        { label: 'Syria', value: 'SY' },
        { label: 'Taiwan', value: 'TW' },
        { label: 'Tajikistan', value: 'TJ' },
        { label: 'Tanzania', value: 'TZ' },
        { label: 'Thailand', value: 'TH' },
        { label: 'Timor-Leste', value: 'TL' },
        { label: 'Togo', value: 'TG' },
        { label: 'Tonga', value: 'TO' },
        { label: 'Trinidad and Tobago', value: 'TT' },
        { label: 'Tunisia', value: 'TN' },
        { label: 'Turkey', value: 'TR' },
        { label: 'Turkmenistan', value: 'TM' },
        { label: 'Tuvalu', value: 'TV' },
        { label: 'Uganda', value: 'UG' },
        { label: 'Ukraine', value: 'UA' },
        { label: 'United Arab Emirates', value: 'AE' },
        { label: 'United Kingdom', value: 'GB' },
        { label: 'United States', value: 'US' },
        { label: 'Uruguay', value: 'UY' },
        { label: 'Uzbekistan', value: 'UZ' },
        { label: 'Vanuatu', value: 'VU' },
        { label: 'Vatican City', value: 'VA' },
        { label: 'Venezuela', value: 'VE' },
        { label: 'Vietnam', value: 'VN' },
        { label: 'Yemen', value: 'YE' },
        { label: 'Zambia', value: 'ZM' },
        { label: 'Zimbabwe', value: 'ZW' },
    ], []);

    const languages = [
        { value: 'en', label: t('english') },
        { value: 'hi', label: t('hindi' )},
        { value: 'bn', label: t('bengali') },
        { value: 'ta', label: t('tamil') },
        { value: 'te', label: t('telugu' )},
        { value: 'gu', label: t('gujarati') },
        { value: 'mr', label: t('marathi') },
        { value: 'ml', label: t('malayalam') },
        { value: 'pa', label: t('punjabi') },
        { value: 'ur', label: t('urdu') },
        
    ];

     const menus = useMemo<Option[]>(() => [
        {  label: t('home') ,value: '/home', icon: IconHome2 ,color:'green', roles: ['Viewer','Editor','Admin']},
        {  label: t('create-pixsabook') ,value: '/home/create', icon: IconArtboard,color:'orange', roles: ['Editor','Admin']},
        {  label: t('my-work') ,value: '/home/mywork', icon: IconBriefcase2,color:'yellow', roles: ['Editor','Admin']},
        {  label: t('add_editors') ,value: '/home/add', icon: IconUsersGroup,color:'blue', roles: ['Admin']},
        {  label: t('billing') ,value: '/home/billing', icon: IconReceipt2,color:'violet', roles: ['Editor','Admin']},
        {  label: t('settings') ,value: '/home/settings', icon: IconSettings,color:'red', roles: ['Viewer','Editor','Admin']},
        
        
    ], [t]);

    const quality = useMemo(() => [
        { value: 'low', label: t('low-quality') },
        { value: 'medium', label: t('medium-quality') },
        { value: 'high', label: t('high-quality') },
    ], [t]);



    return {
        relationshipArray,
        genders,
        fullDayHalfDay,
        daysOfWeek,
        attendanceState,
        educationLevels,
        maritalStatuses,
        monthsArray,
        countries,
        languages,
        dateFormatArray,
        dateTimeFormatArray,
        menus,
        quality,
        features
    };
}
