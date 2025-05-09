// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Список Продуктів",
            htmlAttrs: {
                lang: "uk",
            },
        },
    },
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    modules: ["@nuxt/ui", "@vueuse/nuxt"],
});
