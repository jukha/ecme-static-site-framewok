export const dateLocales: {
    [key: string]: () => Promise<ILocale>
} = {
    en: () => import('dayjs/locale/en'),
    es: () => import('dayjs/locale/es'),
    zh: () => import('dayjs/locale/zh'),
    ar: () => import('dayjs/locale/ar'),
}
