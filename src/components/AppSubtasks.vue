<template>
    <div class="mb-3 subtasks-container">
        <div class="pl-2">
            <v-checkbox
                class="pa-0 mt-5 single-task fifth--text"
                hide-details
                v-for="(subtask, index) in subtasksMainPart"
                :key="subtask.id"
                :input-value="subtask.checked"
                :label="subtask.name"
                @click="checkboxValueChange(index)"
            />
        </div>
        <div ref="showHideContainer" class="pb-2 pl-2 show-hide-container">
            <v-checkbox
                class="pa-0 mt-5 single-task"
                hide-details
                v-for="(subtask, index) in subtasksHidePart"
                :key="subtask.id"
                :input-value="subtask.checked"
                :label="subtask.name"
                @click="checkboxValueChange(maxElemsToShow + index)"
            />
        </div>
        <div class="pl-2">
            <v-btn
                v-if="showBtn"
                @click="showAndHide"
                class="show-more-less-btn"
                color="primary"
                elevation="4"
                small
                outlined
            >
                {{ btnText }}
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppSubtasks',
    props: {
        subtasks: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            maxElemsToShow: 4,
            showAll: false,
        }
    },
    computed: {
        subtasksLength() {
            return this.subtasks.length
        },
        subtasksMainPart() {
            return this.subtasks.slice(0, this.maxElemsToShow)
        },
        subtasksHidePart() {
            return this.subtasks.slice(this.maxElemsToShow)
        },
        showBtn() {
            return this.subtasksHidePart.length > 0
        },
        btnText() {
            return this.showAll ? 'Свернуть' : 'Развернуть'
        },
    },
    methods: {
        checkboxValueChange(index) {
            this.$emit('checkbox-value-change', index)
        },
        setHeight() {
            this.$refs['showHideContainer'].style.maxHeight = this.showAll
                ? `${this.$refs['showHideContainer'].scrollHeight}px`
                : 0
        },
        showAndHide() {
            this.showAll = !this.showAll
            this.setHeight()
        },
    },
    watch: {
        showBtn() {
            this.showAll = false
        },
        subtasksLength() {
            this.setHeight()
        },
    },
}
</script>

<style lang="scss" scoped>
.single-task {
    width: max-content;
}

.show-hide-container {
    overflow: hidden;
    transition: max-height 0.6s ease-out;
    max-height: 0;
}

.show-more-less-btn {
    min-width: 25% !important;
}
</style>
