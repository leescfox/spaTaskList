<template>
    <v-app>
        <AppHeader />
        <v-main>
            <v-container>
                <AppTasks ref="Tasks" />
            </v-container>
            <AppTaskModal />
            <AppDeleteModal />
        </v-main>
    </v-app>
</template>

<script>
import { mapActions } from "vuex"
import AppDeleteModal from "./components/AppDeleteModal.vue"
import AppHeader from "./components/AppHeader.vue"
import AppTaskModal from "./components/AppTaskModal.vue"
import AppTasks from "./components/AppTasks.vue"

export default {
    name: "app",
    components: {
        AppHeader,
        AppTaskModal,
        AppTasks,
        AppDeleteModal,
    },
    methods: {
        ...mapActions(["localStorageGet"]),
    },
    mounted() {
        this.localStorageGet()
    },
}
</script>

<style lang="scss">
.headerRow > th {
    @extend %tableBorder;
    font-size: 1rem !important;
}

.bodyRow {
    @extend %tableRow;
    .overlay {
        @extend %tableRowOverlay;
    }
    & > td {
        @extend %tableBorder;
    }
}

.actionBtn {
    &::before {
        background-color: transparent;
    }
}
</style>
