import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#6f116c',
                secondary: '#dcf3fe',
                third: '#fddbff',
                fourth: '#f9ccff',
                fifth: '#2c3e50',
                deleteMode: '#ff0000',
            },
        },
    },
})
