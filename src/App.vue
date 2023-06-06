<template>
    <v-app>
        <AppHeader />
        <v-main>
            <v-container>
                <AppTasks />
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
        ...mapActions(["localStorageGet", "setClickInclude"]),
    },
    mounted() {
        this.localStorageGet()
        this.setClickInclude(
            document.getElementsByClassName("headerAndTasksInclude")
        )
    },
}
</script>

<style lang="scss">
%tableBorder {
    &:not(:last-of-type) {
        border-right: thin solid rgba(0, 0, 0, 0.12);
    }
}

.headerRow > th {
    @extend %tableBorder;
    font-size: 1rem !important;
}

.bodyRow > td {
    @extend %tableBorder;
}

.actionBtn {
    &::before {
        background-color: transparent;
    }
}
</style>
